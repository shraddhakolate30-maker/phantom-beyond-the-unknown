import { AlertTriangle, Cpu, Download, Eye, Ghost, Info, Sparkles, Wind, Brain, Copy, Check, RotateCcw, X } from 'lucide-react';
import { useRef, useState } from 'react';
import { TRANSFORM_OPTIONS } from '../data';
import type { TransformMode } from '../types';
import { cancelTransform, isWebGPUAvailable, transformStory, type ForgeProgress } from '../lib/storyForge';
import type { LucideIcon } from 'lucide-react';

const MODE_ICONS: Record<string, LucideIcon> = {
  Ghost,
  Eye,
  Brain,
  Sparkles,
  Wind,
};

export function ForgePage() {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<TransformMode>('ghost-story');
  const [progress, setProgress] = useState<ForgeProgress>({
    status: 'idle',
    downloadProgress: null,
    message: '',
    output: null,
    partial: null,
    error: null,
  });
  const [copied, setCopied] = useState(false);
  const reqIdRef = useRef<number | null>(null);
  const hasWebGPU = isWebGPUAvailable();

  const busy = progress.status === 'loading' || progress.status === 'generating';
  const displayText = progress.partial ?? progress.output ?? '';

  function handleTransform() {
    if (input.trim().length < 20 || busy) return;
    setCopied(false);
    reqIdRef.current = transformStory(input, mode, (p) => setProgress(p));
    setProgress({ status: 'loading', downloadProgress: null, message: 'Starting…', output: null, partial: null, error: null });
  }

  function handleCancel() {
    if (reqIdRef.current !== null) cancelTransform(reqIdRef.current);
    reqIdRef.current = null;
    setProgress({ status: 'idle', downloadProgress: null, message: '', output: null, partial: null, error: null });
  }

  function reset() {
    setProgress({ status: 'idle', downloadProgress: null, message: '', output: null, partial: null, error: null });
  }

  function copyOutput() {
    if (!progress.output) return;
    navigator.clipboard?.writeText(progress.output).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="animate-page-fade mx-auto max-w-4xl px-4 py-12 md:px-6">
      <header className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-crimson-500/30 bg-crimson-950/30 text-crimson-300 shadow-[0_0_30px_-8px_rgba(224,69,69,0.5)]">
          <Cpu className="h-7 w-7" strokeWidth={1.3} />
        </div>
        <h1 className="font-display text-4xl font-semibold text-midnight-50 md:text-5xl text-glow-crimson">
          The Story Forge
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-midnight-200">
          Transform ordinary text into atmospheric horror — with an open-weight Gemma model
          running on your own device.
        </p>
      </header>

      {/* AI info banner */}
      <div className="mb-8 flex gap-3 rounded-xl border border-midnight-700/40 bg-midnight-900/50 p-4 text-sm text-midnight-200">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-candle-300" strokeWidth={1.5} />
        <div>
          <p>
            The Story Forge uses <strong className="text-midnight-50">Gemma 3 1B (instruction-tuned)</strong>,
            an open-weight model from Google DeepMind, converted to ONNX by the Hugging Face
            community and run locally with Transformers.js. Your text stays in your browser —
            it is never sent to a server.
          </p>
          <p className="mt-2 text-xs text-midnight-300">
            {hasWebGPU
              ? 'WebGPU detected: the model will use GPU acceleration (~0.8 GB download on first use, cached after).'
              : 'No WebGPU detected: the model will run on CPU via WebAssembly. First load can take several minutes — a shorter passage generates faster.'}
            {' '}Requires a recent browser (Chrome/Edge 113+ recommended for WebGPU).
          </p>
        </div>
      </div>

      {/* Input */}
      <div className="case-card rounded-xl p-6 md:p-8">
        <label className="mb-2 block text-sm font-medium text-midnight-100">Your text</label>
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Paste an ordinary passage, a memory, or a draft story. The Forge will reshape it into something that lingers…"
          className="input-field min-h-[160px] resize-y leading-relaxed"
          maxLength={4000}
          disabled={busy}
        />
        <p className="mt-1 text-right text-xs text-midnight-400">{input.length}/4000</p>

        {/* Mode selection */}
        <label className="mb-3 mt-6 block text-sm font-medium text-midnight-100">Choose a transformation</label>
        <div className="grid gap-2.5 sm:grid-cols-2">
          {TRANSFORM_OPTIONS.map((opt) => {
            const Icon = MODE_ICONS[opt.icon] ?? Sparkles;
            const active = mode === opt.id;
            return (
              <button
                key={opt.id}
                type="button"
                disabled={busy}
                onClick={() => setMode(opt.id)}
                className={`flex items-start gap-3 rounded-xl border p-3.5 text-left transition-all disabled:opacity-50 ${
                  active
                    ? 'border-crimson-500/50 bg-crimson-900/20'
                    : 'border-midnight-700/40 bg-midnight-900/40 hover:border-midnight-500/60'
                }`}
              >
                <div className={`rounded-lg p-2 ${active ? 'bg-crimson-900/40 text-candle-200' : 'bg-midnight-800/60 text-midnight-200'}`}>
                  <Icon className="h-4.5 w-4.5" strokeWidth={1.5} />
                </div>
                <div>
                  <p className={`text-sm font-semibold ${active ? 'text-candle-100' : 'text-midnight-50'}`}>{opt.label}</p>
                  <p className="mt-0.5 text-xs text-midnight-300">{opt.description}</p>
                </div>
              </button>
            );
          })}
        </div>

        <div className="mt-6 flex items-center justify-between">
          {input.trim().length < 20 && progress.status === 'idle' && (
            <p className="text-xs text-midnight-400">Enter at least 20 characters to begin.</p>
          )}
          <div className="ml-auto flex gap-3">
            {busy && (
              <button onClick={handleCancel} className="btn-ghost">
                <X className="h-4 w-4" /> Cancel
              </button>
            )}
            <button
              onClick={handleTransform}
              disabled={busy || input.trim().length < 20}
              className="btn-primary"
            >
              {busy ? (
                <>
                  <GhostLoader />
                  Working…
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Transform
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Progress / output */}
      {(progress.status !== 'idle' || progress.output) && (
        <div className="mt-6 case-card rounded-xl p-6 md:p-8">
          {/* Loading state */}
          {progress.status === 'loading' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="relative">
                <Download className="h-10 w-10 text-candle-300 animate-pulse-glow" strokeWidth={1.3} />
                <span className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-crimson-500 animate-ping" />
              </div>
              <p className="mt-4 text-midnight-100">{progress.message}</p>
              {progress.downloadProgress !== null && (
                <div className="mt-4 w-full max-w-md">
                  <div className="h-2 w-full overflow-hidden rounded-full bg-midnight-800">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-candle-500 to-crimson-500 transition-all duration-300"
                      style={{ width: `${progress.downloadProgress}%` }}
                    />
                  </div>
                  <p className="mt-1.5 text-xs text-midnight-400">
                    Downloading model: {progress.downloadProgress}%
                  </p>
                  <p className="mt-2 text-xs text-midnight-500">
                    This is a one-time download. The model is cached by your browser for future visits.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Generating state with streaming */}
          {progress.status === 'generating' && (
            <div>
              <div className="mb-4 flex items-center gap-3">
                <Ghost className="h-6 w-6 animate-ghost-fade text-midnight-100" strokeWidth={1.2} />
                <p className="text-midnight-100">{progress.message}</p>
                <span className="text-xs text-midnight-400">Generating on your device…</span>
              </div>
              {displayText ? (
                <div className="whitespace-pre-line rounded-xl border border-midnight-700/40 bg-midnight-950/50 p-5 text-base leading-relaxed text-midnight-100">
                  {displayText}
                  <span className="ml-0.5 inline-block h-4 w-1.5 animate-pulse bg-candle-400 align-middle" />
                </div>
              ) : (
                <GhostShimmer />
              )}
            </div>
          )}

          {/* Error state */}
          {progress.status === 'error' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <AlertTriangle className="h-10 w-10 text-crimson-400" strokeWidth={1.3} />
              <h3 className="mt-4 font-display text-2xl text-midnight-50">AI generation unavailable</h3>
              <p className="mt-2 max-w-md text-sm text-crimson-200">{progress.error}</p>
              <div className="mt-6 flex gap-3">
                <button onClick={handleTransform} className="btn-primary">
                  <RotateCcw className="h-4 w-4" /> Retry
                </button>
                <button onClick={reset} className="btn-ghost">
                  Dismiss
                </button>
              </div>
            </div>
          )}

          {/* Cancelled state */}
          {progress.status === 'cancelled' && (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <X className="h-10 w-10 text-midnight-300" strokeWidth={1.3} />
              <h3 className="mt-4 font-display text-2xl text-midnight-50">Generation cancelled</h3>
              <p className="mt-2 text-sm text-midnight-300">Your input is still here — try again when you're ready.</p>
              <button onClick={reset} className="btn-ghost mt-6">
                <RotateCcw className="h-4 w-4" /> Start over
              </button>
            </div>
          )}

          {/* Output */}
          {progress.status === 'done' && progress.output && (
            <div className="animate-fade-in">
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-display text-2xl text-midnight-50">Your transformed story</h3>
                <button
                  onClick={copyOutput}
                  className="inline-flex items-center gap-1.5 rounded-full border border-midnight-700/40 bg-midnight-900/50 px-3 py-1.5 text-xs text-midnight-200 transition-colors hover:text-midnight-50"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-candle-300" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
              </div>
              <div className="whitespace-pre-line rounded-xl border border-midnight-700/40 bg-midnight-950/60 p-5 text-lg leading-relaxed text-midnight-50">
                {progress.output}
              </div>
              <p className="mt-4 text-xs text-midnight-400">
                Generated locally by Gemma 3 1B running in your browser. AI output may contain
                errors or unexpected content — it is fiction, not fact.
              </p>
              <div className="mt-5 flex gap-3">
                <button onClick={reset} className="btn-primary">
                  <RotateCcw className="h-4 w-4" /> Forge another
                </button>
                <button onClick={handleTransform} className="btn-ghost">
                  <Sparkles className="h-4 w-4" /> Re-run with same input
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function GhostLoader() {
  return (
    <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-20" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
      <path className="opacity-90" fill="currentColor" d="M12 2a10 10 0 0 1 10 10h-3a7 7 0 0 0-7-7z" />
    </svg>
  );
}

function GhostShimmer() {
  return (
    <div className="space-y-3">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="h-4 animate-pulse rounded bg-midnight-800/60"
          style={{ width: `${85 - i * 12}%`, animationDelay: `${i * 0.2}s` }}
        />
      ))}
    </div>
  );
}
