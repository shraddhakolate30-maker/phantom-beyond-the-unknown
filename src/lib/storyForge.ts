/**
 * Story Forge AI adapter.
 *
 * Uses Transformers.js (v4) to run the open-weight Gemma 3 1B
 * instruction-tuned model entirely in the browser via ONNX Runtime.
 *
 * Model: onnx-community/gemma-3-1b-it-ONNX
 *   - Open weights under the Gemma Terms of Use + Apache 2.0 for the ONNX export.
 *   - Instruction-tuned, ~1B parameters from Google DeepMind.
 *   - Quantized to q4 (WASM) or q4f16 (WebGPU) for feasible browser download.
 *
 * Inference runs in a Web Worker so the UI thread stays responsive.
 * The worker loads Transformers.js dynamically. If WebGPU is available
 * we use it; otherwise we fall back to WASM (slower, but works without GPU).
 *
 * The model is downloaded from the Hugging Face Hub on first use and cached
 * by the browser's Cache API for subsequent visits.
 *
 * IMPORTANT — honesty:
 *   If the model cannot be loaded (e.g. blocked network, unsupported
 *   runtime, out of memory) the UI surfaces a clear "AI unavailable"
 *   state rather than fabricating output. We never substitute hardcoded
 *   responses labelled as AI.
 */

import type { TransformMode } from '../types';

export type ForgeStatus =
  | 'idle'
  | 'loading'
  | 'generating'
  | 'done'
  | 'error'
  | 'cancelled';

export interface ForgeProgress {
  status: ForgeStatus;
  /** 0-100 model download progress, or null when not downloading */
  downloadProgress: number | null;
  /** Human-readable status message */
  message: string;
  /** Generated text when status is 'done' */
  output: string | null;
  /** Partial text during generation (streaming) */
  partial: string | null;
  /** Error text when status is 'error' */
  error: string | null;
}

const MODE_PROMPTS: Record<TransformMode, string> = {
  'ghost-story':
    'Rewrite the following passage as a chilling ghost story. Introduce a spectral presence, a sense of being watched, and an unsettling atmosphere. Keep the original meaning and characters. End ambiguously.',
  mysterious:
    'Rewrite the following passage to be more mysterious. Add unanswered questions, creeping dread, and details that do not quite add up. Keep the original events but withhold full explanation.',
  psychological:
    'Rewrite the following passage with a psychological horror twist. Introduce doubt about what is real and what is in the narrator\'s mind. Make the reader question the narrator\'s perception.',
  'unexpected-ending':
    'Rewrite the following passage and give it a startling, unexpected ending. Build tension slowly, then deliver a final twist the reader did not see coming.',
  atmospheric:
    'Rewrite the following passage as atmospheric horror. Build dread through setting, texture, weather, and mood. Prioritize sensory detail and a slow, suffocating atmosphere over explicit fright.',
};

const SYSTEM_PROMPT =
  'You are the Story Forge, an AI that rewrites ordinary text into atmospheric horror fiction. ' +
  'You write vivid, literary prose with sensory detail and restraint. ' +
  'You never claim the story is a real event. You never use slurs or graphic violence. ' +
  'Keep your output to 3-5 short paragraphs.';

let worker: Worker | null = null;
let nextId = 0;
const pending = new Map<number, (progress: ForgeProgress) => void>();

function getWorker(): Worker {
  if (worker) return worker;
  worker = new Worker(new URL('../workers/storyForge.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (event: MessageEvent) => {
    const { id, ...progress } = event.data as { id: number } & ForgeProgress;
    const cb = pending.get(id);
    if (cb) {
      cb(progress);
      if (progress.status === 'done' || progress.status === 'error' || progress.status === 'cancelled') {
        pending.delete(id);
      }
    }
  };
  worker.onerror = (err) => {
    // A worker-level error is rare but we must not leave callers hanging.
    const detail = err.message || 'The AI worker crashed unexpectedly. Reload the page and try again.';
    for (const [id, cb] of pending) {
      cb({
        status: 'error',
        downloadProgress: null,
        message: 'Worker error',
        output: null,
        partial: null,
        error: detail,
      });
    }
    pending.clear();
  };
  return worker;
}

/**
 * Transform text using the on-device Gemma model.
 * Calls `onProgress` repeatedly with status updates, streaming partial
 * text, and the final output. Returns a request id for cancellation.
 */
export function transformStory(
  input: string,
  mode: TransformMode,
  onProgress: (progress: ForgeProgress) => void,
): number {
  const id = ++nextId;
  const userPrompt = `${MODE_PROMPTS[mode]}\n\nPassage:\n"""${input.trim()}"""`;
  pending.set(id, onProgress);
  const w = getWorker();
  w.postMessage({ id, system: SYSTEM_PROMPT, user: userPrompt });
  return id;
}

/** Cancel an in-flight generation by its request id. */
export function cancelTransform(id: number): void {
  const w = worker;
  if (!w) return;
  w.postMessage({ cancel: true, id });
  pending.delete(id);
}

/** Detect whether the browser likely supports WebGPU for accelerated inference. */
export function isWebGPUAvailable(): boolean {
  return typeof navigator !== 'undefined' && 'gpu' in navigator;
}
