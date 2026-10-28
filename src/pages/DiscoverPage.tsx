import { ArrowUpDown, Search, Ghost } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { CATEGORIES } from '../data';
import type { CategoryId } from '../types';
import { StoryCard } from '../components/StoryCard';

type SortMode = 'recent' | 'popular';

export function DiscoverPage() {
  const { stories } = useAtmosphere();
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState<CategoryId | 'all'>('all');
  const [sort, setSort] = useState<SortMode>('recent');

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = stories.filter((s) => {
      if (category !== 'all' && s.category !== category) return false;
      if (!q) return true;
      return s.title.toLowerCase().includes(q) || s.content.toLowerCase().includes(q);
    });
    if (sort === 'recent') list = list.sort((a, b) => b.createdAt - a.createdAt);
    else
      list = list.sort(
        (a, b) =>
          b.reactions.shiver + b.reactions.skull + b.reactions.heart -
          (a.reactions.shiver + a.reactions.skull + a.reactions.heart),
      );
    return list;
  }, [stories, query, category, sort]);

  return (
    <div className="animate-page-fade mx-auto max-w-7xl px-4 py-12 md:px-6">
      <header className="mb-8 text-center">
        <h1 className="font-display text-4xl font-semibold text-midnight-50 md:text-5xl text-glow">
          Discover
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-midnight-200">
          Search the archive. Filter by category, sort by what unsettles you most.
        </p>
      </header>

      {/* Controls */}
      <div className="case-card mb-8 rounded-xl p-4 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-midnight-400" strokeWidth={1.5} />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search titles or content…"
              className="input-field pl-10"
            />
          </div>
          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-midnight-400" strokeWidth={1.5} />
            <select value={sort} onChange={(e) => setSort(e.target.value as SortMode)} className="input-field w-auto">
              <option value="recent" className="bg-midnight-900">Most recent</option>
              <option value="popular" className="bg-midnight-900">Most reacted</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Chip active={category === 'all'} onClick={() => setCategory('all')}>All</Chip>
          {CATEGORIES.map((c) => (
            <Chip key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>{c.label}</Chip>
          ))}
        </div>
      </div>

      <p className="mb-4 text-sm text-midnight-300">{results.length} {results.length === 1 ? 'story' : 'stories'} found</p>

      {results.length > 0 ? (
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {results.map((s) => (
            <StoryCard key={s.id} story={s} />
          ))}
        </div>
      ) : (
        <div className="case-card rounded-xl p-12 text-center">
          <Ghost className="mx-auto h-10 w-10 text-midnight-400" strokeWidth={1.2} />
          <p className="mt-4 text-midnight-200">No stories match your search.</p>
          <p className="mt-1 text-sm text-midnight-400">Try a different word or category.</p>
        </div>
      )}
    </div>
  );
}

function Chip({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3.5 py-1.5 text-sm font-medium transition-all ${
        active
          ? 'border border-crimson-500/50 bg-crimson-900/30 text-candle-100'
          : 'border border-midnight-700/40 bg-midnight-900/40 text-midnight-200 hover:border-midnight-500/60 hover:text-midnight-50'
      }`}
    >
      {children}
    </button>
  );
}
