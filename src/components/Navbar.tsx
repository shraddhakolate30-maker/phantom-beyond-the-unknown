import { Ghost, Menu, X } from 'lucide-react';
import { useState } from 'react';
import { navigate, type Route } from '../lib/router';
import { AudioControl } from './AudioControl';
import { useAtmosphere } from '../context/AtmosphereContext';

const NAV_ITEMS: { label: string; route: Route }[] = [
  { label: 'Home', route: { name: 'home' } },
  { label: 'Story Wall', route: { name: 'wall' } },
  { label: 'Discover', route: { name: 'discover' } },
  { label: 'Story of the Week', route: { name: 'week' } },
  { label: 'Story Forge', route: { name: 'forge' } },
  { label: 'Share', route: { name: 'share' } },
];

export function Navbar({ current }: { current: Route }) {
  const [open, setOpen] = useState(false);
  const { settings, updateSettings } = useAtmosphere();

  return (
    <header className="sticky top-0 z-40 border-b border-midnight-700/40 bg-midnight-950/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90"
        >
          <Ghost className="h-7 w-7 text-midnight-100 animate-ghost-fade" strokeWidth={1.5} />
          <span className="font-display text-2xl font-semibold tracking-wide text-midnight-50 text-glow">
            PHANTOM
          </span>
          <span className="hidden text-xs uppercase tracking-[0.3em] text-midnight-300 sm:inline">
            Beyond the Unknown
          </span>
        </button>

        <nav className="hidden items-center gap-1 lg:flex">
          {NAV_ITEMS.map((item) => {
            const active = item.route.name === current.name;
            return (
              <button
                key={item.label}
                onClick={() => navigate(item.route)}
                className={`rounded-full px-3.5 py-2 text-sm font-medium transition-colors ${
                  active
                    ? 'text-candle-100'
                    : 'text-midnight-200 hover:text-midnight-50'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <AudioControl
            enabled={settings.audioEnabled}
            volume={settings.audioVolume}
            onToggle={() => updateSettings({ audioEnabled: !settings.audioEnabled })}
            onVolume={(v) => updateSettings({ audioVolume: v })}
          />
          <button
            onClick={() => navigate({ name: 'atmosphere' })}
            aria-label="Atmosphere settings"
            className="rounded-full p-2 text-midnight-200 transition-colors hover:bg-midnight-700/40 hover:text-midnight-50"
          >
            <SettingsGlyph />
          </button>
          <button
            onClick={() => setOpen((o) => !o)}
            aria-label="Menu"
            className="rounded-full p-2 text-midnight-200 transition-colors hover:bg-midnight-700/40 lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="border-t border-midnight-700/40 bg-midnight-950/95 px-4 py-3 lg:hidden">
          {NAV_ITEMS.map((item) => {
            const active = item.route.name === current.name;
            return (
              <button
                key={item.label}
                onClick={() => {
                  navigate(item.route);
                  setOpen(false);
                }}
                className={`block w-full rounded-lg px-3 py-2.5 text-left text-sm font-medium transition-colors ${
                  active ? 'bg-midnight-700/40 text-candle-100' : 'text-midnight-200 hover:bg-midnight-800/60'
                }`}
              >
                {item.label}
              </button>
            );
          })}
        </nav>
      )}
    </header>
  );
}

function SettingsGlyph() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z" />
    </svg>
  );
}
