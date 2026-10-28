/// <reference lib="webworker" />

/**
 * Story Forge worker.
 *
 * Loads Transformers.js and the Gemma 3 1B instruction-tuned ONNX model
 * (onnx-community/gemma-3-1b-it-ONNX) and runs text generation in the
 * background so the UI stays responsive.
 *
 * The model is downloaded from the Hugging Face Hub on first use and
 * cached by the browser (via Transformers.js + Cache API). We attempt
 * WebGPU first (fast) and fall back to WASM if WebGPU is unavailable.
 *
 * Streaming: we emit partial text as tokens are generated so the UI can
 * show progress instead of a frozen spinner.
 *
 * Cancellation: a generation can be cancelled mid-flight. We cannot
 * abort the underlying ONNX run, but we stop feeding the streamer and
 * report a 'cancelled' status so the UI resets cleanly.
 */

interface RequestPayload {
  id: number;
  system: string;
  user: string;
}

type Status = 'idle' | 'loading' | 'generating' | 'done' | 'error' | 'cancelled';

interface ProgressPayload {
  id: number;
  status: Status;
  downloadProgress: number | null;
  message: string;
  output: string | null;
  /** partial output during generation */
  partial: string | null;
  error: string | null;
}

const MODEL_ID = 'onnx-community/gemma-3-1b-it-ONNX';
/** Hard timeout for the whole generation (ms). Generous because a 1B
 * model on WASM can take minutes on first token. */
const GENERATION_TIMEOUT_MS = 180_000;

type GeneratorFn = (
  messages: { role: string; content: string }[],
  options: Record<string, unknown>,
) => Promise<unknown>;

let generatorFn: GeneratorFn | null = null;
let loadingPromise: Promise<void> | null = null;
/** Active request id — used to support cancellation. */
let activeId: number | null = null;
let cancelledIds = new Set<number>();

self.onmessage = async (event: MessageEvent<RequestPayload | { cancel: true; id: number }>) => {
  const data = event.data;
  if ('cancel' in data && data.cancel) {
    cancelledIds.add(data.id);
    if (activeId === data.id) activeId = null;
    return;
  }

  const { id, system, user } = data as RequestPayload;
  cancelledIds.delete(id);
  activeId = id;

  try {
    await ensurePipeline(id);
    if (cancelledIds.has(id) || activeId !== id) {
      post(id, { status: 'cancelled', downloadProgress: null, message: 'Cancelled', output: null, partial: null, error: null });
      return;
    }
    post(id, { status: 'generating', downloadProgress: null, message: 'Weaving your story…', output: null, partial: '', error: null });

    const messages = [
      { role: 'system', content: system },
      { role: 'user', content: user },
    ] as { role: string; content: string }[];

    // Streamer accumulates tokens and posts partial updates, throttled.
    let partialText = '';
    let lastPost = 0;
    const streamer = (token: string) => {
      if (cancelledIds.has(id) || activeId !== id) return;
      partialText += token;
      const now = Date.now();
      if (now - lastPost > 120) {
        lastPost = now;
        post(id, { status: 'generating', downloadProgress: null, message: 'Weaving your story…', output: null, partial: partialText, error: null });
      }
    };

    const generate = async (): Promise<string> => {
      // Try sampled generation first; fall back to greedy if unsupported.
      let result: unknown;
      try {
        result = await generatorFn!(messages, {
          max_new_tokens: 320,
          do_sample: true,
          temperature: 0.85,
          top_k: 40,
          streamer,
        } as Record<string, unknown>);
      } catch {
        if (cancelledIds.has(id)) return '';
        result = await generatorFn!(messages, {
          max_new_tokens: 320,
          do_sample: false,
          streamer,
        } as Record<string, unknown>);
      }
      // If streaming already captured text, use it; otherwise decode result.
      if (partialText.trim()) return cleanOutput(partialText);
      return cleanOutput(extractGeneratedText(result));
    };

    // Race with timeout + cancellation check.
    const output = await Promise.race([
      generate(),
      new Promise<never>((_, reject) =>
        setTimeout(() => reject(new Error('timeout')), GENERATION_TIMEOUT_MS),
      ),
    ]);

    if (cancelledIds.has(id) || activeId !== id) {
      post(id, { status: 'cancelled', downloadProgress: null, message: 'Cancelled', output: null, partial: null, error: null });
      return;
    }
    if (!output || !output.trim()) {
      post(id, { status: 'error', downloadProgress: null, message: 'The model produced no output.', output: null, partial: null, error: 'The model generated an empty response. Try again with a longer or clearer passage.' });
      return;
    }
    post(id, { status: 'done', downloadProgress: null, message: 'Complete', output, partial: null, error: null });
  } catch (err) {
    if (cancelledIds.has(id)) {
      post(id, { status: 'cancelled', downloadProgress: null, message: 'Cancelled', output: null, partial: null, error: null });
      return;
    }
    const message = err instanceof Error ? err.message : String(err);
    post(id, {
      status: 'error',
      downloadProgress: null,
      message: 'AI generation failed',
      output: null,
      partial: null,
      error: explainError(message),
    });
  } finally {
    if (activeId === id) activeId = null;
  }
};

async function ensurePipeline(id: number): Promise<void> {
  if (generatorFn) return;
  if (loadingPromise) return loadingPromise;

  loadingPromise = (async () => {
    post(id, { status: 'loading', downloadProgress: 0, message: 'Loading Transformers.js…', output: null, partial: null, error: null });
    try {
      const transformers = await import('@huggingface/transformers');
      const { pipeline, env, TextStreamer } = transformers;

      env.allowLocalModels = false;
      env.useBrowserCache = true;

      const hasWebGPU = typeof navigator !== 'undefined' && 'gpu' in navigator;
      const device = hasWebGPU ? 'webgpu' : 'wasm';
      const dtype = hasWebGPU ? 'q4f16' : 'q4';

      post(id, {
        status: 'loading',
        downloadProgress: 0,
        message: hasWebGPU
          ? 'Downloading Gemma 3 1B (WebGPU build)…'
          : 'Downloading Gemma 3 1B (WASM build). First load can take several minutes…',
        output: null,
        partial: null,
        error: null,
      });

      const generator = await pipeline('text-generation', MODEL_ID, {
        device,
        dtype,
        progress_callback: (info: Record<string, unknown>) => {
          const status = info.status as string | undefined;
          const progress = info.progress as number | undefined;
          const file = (info.file as string) ?? '';
          if (status === 'progress' && typeof progress === 'number') {
            post(id, {
              status: 'loading',
              downloadProgress: Math.round(progress),
              message: `Downloading model… ${file.split('/').pop() ?? ''}`,
              output: null,
              partial: null,
              error: null,
            });
          } else if (status === 'done') {
            post(id, {
              status: 'loading',
              downloadProgress: 100,
              message: 'Preparing model…',
              output: null,
              partial: null,
              error: null,
            });
          } else if (status === 'ready') {
            post(id, {
              status: 'loading',
              downloadProgress: 100,
              message: 'Model ready.',
              output: null,
              partial: null,
              error: null,
            });
          }
        },
      });

      // Bind the streamer type into the generator wrapper so callers can
      // pass a callback that receives tokens.
      const tokenizer = (generator as { tokenizer?: unknown }).tokenizer;
      generatorFn = ((messages: unknown[], options: Record<string, unknown>) => {
        const streamerCb = options.streamer as ((t: string) => void) | undefined;
        if (streamerCb && tokenizer) {
          const streamer = new TextStreamer(tokenizer as never, {
            skip_prompt: true,
            callback_function: (text: string) => streamerCb(text),
          });
          return (generator as (m: unknown, o: Record<string, unknown>) => Promise<unknown>)(
            messages,
            { ...options, streamer },
          );
        }
        return (generator as (m: unknown, o: Record<string, unknown>) => Promise<unknown>)(
          messages,
          options,
        );
      }) as GeneratorFn;
    } catch (err) {
      loadingPromise = null; // allow retry on next request
      throw err;
    }
  })();

  return loadingPromise;
}

function extractGeneratedText(result: unknown): string {
  if (Array.isArray(result) && result.length > 0) {
    const first = result[0] as Record<string, unknown>;
    const gt = first.generated_text;
    if (Array.isArray(gt)) {
      const last = gt[gt.length - 1] as Record<string, unknown>;
      return (last?.content as string) ?? '';
    }
    if (typeof gt === 'string') return gt;
  }
  return '';
}

function cleanOutput(text: string): string {
  let out = text.trim();
  out = out.replace(/^assistant\s*/i, '').trim();
  return out;
}

function explainError(message: string): string {
  const m = message.toLowerCase();
  if (m === 'timeout')
    return 'The model took too long to respond (over 3 minutes). On a CPU (WASM) backend, first-time generation can be very slow — try a shorter passage, use a WebGPU-capable browser like Chrome, or try again.';
  if (m.includes('webgpu'))
    return 'WebGPU was not available or failed. The Gemma 3 1B model runs best on WebGPU (Chrome or Edge 113+). On CPU it can be very slow. Try the latest Chrome on desktop.';
  if (m.includes('network') || m.includes('fetch') || m.includes('cors') || m.includes('failed to fetch'))
    return 'Could not download the model. Check your internet connection — the model (~0.8–1.2 GB) is fetched from the Hugging Face Hub on first use and then cached.';
  if (m.includes('memory') || m.includes('oom') || m.includes('out of memory'))
    return 'The model ran out of memory in this browser. Try closing other tabs, using a device with more RAM, or a WebGPU-capable browser.';
  if (m.includes('wasm') || m.includes('simd') || m.includes('threads'))
    return 'This browser does not support the WASM backend needed to run the model. Try a recent Chrome, Edge, or Firefox.';
  if (m.includes('401') || m.includes('403') || m.includes('forbidden'))
    return 'Access to the model was denied. The repository may have changed access settings.';
  return message || 'An unknown error occurred while running the model.';
}

function post(id: number, payload: Omit<ProgressPayload, 'id'>) {
  (self as unknown as Worker).postMessage({ id, ...payload } satisfies ProgressPayload);
}
