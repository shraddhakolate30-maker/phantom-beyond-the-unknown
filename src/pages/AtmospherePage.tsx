import { Eye, Ghost, Volume2, Wind, Sparkles, Zap } from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphereContext';

export function AtmospherePage() {
  const { settings, updateSettings } = useAtmosphere();

  return (
    <div className="animate-page-fade mx-auto max-w-3xl px-4 py-12 md:px-6">
      <header className="mb-8 text-center">
        <Eye className="mx-auto h-10 w-10 text-midnight-200 animate-ghost-fade" strokeWidth={1.3} />
        <h1 className="mt-3 font-display text-4xl font-semibold text-midnight-50 md:text-5xl text-glow">
          Ghostly Atmosphere
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-midnight-200">
          Tune the mood. Adjust the ambience and visual effects to your taste.
        </p>
      </header>

      <div className="case-card space-y-6 rounded-xl p-6 md:p-8">
        {/* Audio */}
        <ToggleRow
          icon={Volume2}
          title="Ambient sound"
          description="A synthesized drone, wind, and slow sub-bass — generated in your browser, no audio files required."
          checked={settings.audioEnabled}
          onChange={(v) => updateSettings({ audioEnabled: v })}
        />
        <div className="pl-12">
          <label className="flex items-center gap-3 text-sm text-midnight-200">
            Volume
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={settings.audioVolume}
              onChange={(e) => updateSettings({ audioVolume: Number(e.target.value) })}
              className="h-1 w-40 cursor-pointer appearance-none rounded-full accent-candle-400"
              style={{
                background: `linear-gradient(to right, #ffb833 ${settings.audioVolume * 100}%, #332a52 ${settings.audioVolume * 100}%)`,
              }}
            />
            <span className="text-xs text-midnight-400">{Math.round(settings.audioVolume * 100)}%</span>
          </label>
        </div>

        <Divider />

        {/* Visual effects */}
        <ToggleRow
          icon={Wind}
          title="Drifting fog"
          description="Slow, layered fog that drifts across the lower screen."
          checked={settings.fogEnabled}
          onChange={(v) => updateSettings({ fogEnabled: v })}
        />
        <ToggleRow
          icon={Sparkles}
          title="Floating particles"
          description="Dust and faint spirits that rise from the dark."
          checked={settings.particlesEnabled}
          onChange={(v) => updateSettings({ particlesEnabled: v })}
        />
        <ToggleRow
          icon={Ghost}
          title="Candlelight flicker"
          description="A warm, flickering glow near the edges of the page."
          checked={settings.candlelightEnabled}
          onChange={(v) => updateSettings({ candlelightEnabled: v })}
        />

        <Divider />

        {/* Reduced motion */}
        <ToggleRow
          icon={Zap}
          title="Reduced motion"
          description="Disable animations and transitions for a calmer, more accessible experience."
          checked={settings.reducedMotion}
          onChange={(v) => updateSettings({ reducedMotion: v })}
        />
      </div>

      <p className="mt-6 text-center text-xs text-midnight-400">
        Settings are saved in your browser. Audio starts only after you press play — browsers
        block autoplay until you interact with the page.
      </p>
    </div>
  );
}

function ToggleRow({
  icon: Icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: typeof Ghost;
  title: string;
  description: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="rounded-lg bg-midnight-800/60 p-2.5 text-midnight-100">
        <Icon className="h-5 w-5" strokeWidth={1.5} />
      </div>
      <div className="flex-1">
        <p className="text-sm font-semibold text-midnight-50">{title}</p>
        <p className="mt-0.5 text-xs text-midnight-300">{description}</p>
      </div>
      <button
        role="switch"
        aria-checked={checked}
        aria-label={title}
        onClick={() => onChange(!checked)}
        className={`relative mt-1 h-6 w-11 shrink-0 rounded-full transition-colors ${
          checked ? 'bg-crimson-600/70' : 'bg-midnight-700'
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-midnight-50 shadow transition-transform ${
            checked ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  );
}

function Divider() {
  return <div className="border-t border-midnight-700/30" />;
}
