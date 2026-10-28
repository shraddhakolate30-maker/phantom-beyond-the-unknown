import { Volume2, VolumeX, Volume1 } from 'lucide-react';

interface AudioControlProps {
  enabled: boolean;
  volume: number;
  onToggle: () => void;
  onVolume: (v: number) => void;
}

export function AudioControl({ enabled, volume, onToggle, onVolume }: AudioControlProps) {
  const Icon = !enabled || volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className="flex items-center gap-1.5 rounded-full border border-midnight-700/40 bg-midnight-900/60 px-2 py-1.5">
      <button
        onClick={onToggle}
        aria-label={enabled ? 'Mute ambient audio' : 'Play ambient audio'}
        title={enabled ? 'Mute ambient audio' : 'Play ambient audio'}
        className={`rounded-full p-1.5 transition-colors ${
          enabled ? 'text-candle-300 hover:text-candle-200' : 'text-midnight-300 hover:text-midnight-100'
        }`}
      >
        <Icon className="h-4 w-4" />
      </button>
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={enabled ? volume : 0}
        onChange={(e) => onVolume(Number(e.target.value))}
        aria-label="Ambient audio volume"
        className="h-1 w-20 cursor-pointer appearance-none rounded-full bg-midnight-700 accent-candle-400"
        style={{
          background: `linear-gradient(to right, #ffb833 ${(enabled ? volume : 0) * 100}%, #332a52 ${(enabled ? volume : 0) * 100}%)`,
        }}
      />
    </div>
  );
}
