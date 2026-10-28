import { Ghost } from 'lucide-react';
import { navigate } from '../lib/router';

export function Footer() {
  return (
    <footer className="relative z-10 mt-24 border-t border-midnight-700/40 bg-midnight-950/60">
      <div className="mx-auto max-w-7xl px-4 py-10 md:px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2.5">
            <Ghost className="h-6 w-6 text-midnight-200 animate-ghost-fade" strokeWidth={1.5} />
            <span className="font-display text-xl font-semibold tracking-wide text-midnight-100">PHANTOM</span>
            <span className="hidden text-sm text-midnight-300 sm:inline">— Beyond the Unknown</span>
          </div>
          <p className="text-center text-sm italic text-midnight-300">
            "Every shadow has a story."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-midnight-300">
            <button onClick={() => navigate({ name: 'wall' })} className="hover:text-midnight-100">Story Wall</button>
            <button onClick={() => navigate({ name: 'forge' })} className="hover:text-midnight-100">Story Forge</button>
            <button onClick={() => navigate({ name: 'share' })} className="hover:text-midnight-100">Share</button>
            <button onClick={() => navigate({ name: 'atmosphere' })} className="hover:text-midnight-100">Atmosphere</button>
          </div>
        </div>
        <div className="mt-8 border-t border-midnight-800/50 pt-6 text-center text-xs text-midnight-400">
          <p>
            PHANTOM is a storytelling platform. Stories marked as personal experiences are
            user-submitted and unverified — they are not scientific evidence of the supernatural.
            Fictional stories are works of imagination.
          </p>
          <p className="mt-2">
            Built for the Hacktoberfest Open-Source AI Challenge — Week 4: Ghost in the Machine.
            AI transformation uses the open-weight Gemma 3 1B model running locally in your browser.
          </p>
        </div>
      </div>
    </footer>
  );
}
