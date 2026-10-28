import { Ghost, Filter } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { CATEGORIES } from '../data';
import type { CategoryId } from '../types';
import { StoryCard } from '../components/StoryCard';
import { navigate } from '../lib/router';

export function WallPage({ initialCategory }: { initialCategory?: string }) {
  const { stories } = useAtmosphere();
  const [active, setActive] = useState<CategoryId | 'all'>(
    (initialCategory as CategoryId) ?? 'all',
  );

  const filtered = useMemo(() => {
    if (active === 'all') return stories;
    return stories.filter((s) => s.category === active);
  }, [stories, active]);

  return (
    <div className="animate-page-fade mx-auto max-w-7xl px-4 py-12 md:px-6">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-semibold text-midnight-50 md:text-5xl text-glow">
          The Paranormal Story Wall
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-midnight-200">
          Browse community-submitted experiences and fiction. Personal accounts are
          unverified stories, not scientific evidence. Fictional tales are works of imagination.
        </p>
      </header>

      {/* Category filter */}
      <div className="mb-10 flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-midnight-300">
          <Filter className="h-4 w-4" strokeWidth={1.5} />
          Filter by category
        </div>
        <div className="flex flex-wrap gap-2">
          <FilterChip label="All Stories" active={active === 'all'} onClick={() => { setActive('all'); navigate({ name: 'wall' }); }} />
          {CATEGORIES.map((cat) => (
            <FilterChip
              key={cat.id}
              label={cat.label}
              active={active === cat.id}
              onClick={() => { setActive(cat.id); navigate({ name: 'wall', category: cat.id }); }}
            />
          ))}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filtered.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      ) : (
        <div className="case-card rounded-xl p-12 text-center">
          <Ghost className="mx-auto h-10 w-10 text-midnight-400" strokeWidth={1.2} />
          <p className="mt-4 text-midnight-200">No stories in this category yet.</p>
          <button onClick={() => navigate({ name: 'share' })} className="btn-primary mt-6">
            Share a story
          </button>
        </div>
      )}
    </div>
  );
}

function FilterChip({ label, active, onClick }: { label: string; active: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
        active
          ? 'border border-crimson-500/50 bg-crimson-900/30 text-candle-100'
          : 'border border-midnight-700/40 bg-midnight-900/40 text-midnight-200 hover:border-midnight-500/60 hover:text-midnight-50'
      }`}
    >
      {label}
    </button>
  );
}
