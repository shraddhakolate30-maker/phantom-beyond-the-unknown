import { ArrowRight, BookOpen, Feather, Ghost, Sparkles, Flame, ChevronDown } from 'lucide-react';
import { useMemo } from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { navigate } from '../lib/router';
import { CATEGORIES } from '../data';
import { StoryCard } from '../components/StoryCard';
import { CategoryIcon } from '../components/StoryBadges';

export function HomePage() {
  const { stories } = useAtmosphere();

  const featured = useMemo(
    () => stories.find((s) => s.id === 'seed-story-week') ?? stories[0],
    [stories],
  );
  const recent = useMemo(
    () => [...stories].sort((a, b) => b.createdAt - a.createdAt).slice(0, 3),
    [stories],
  );

  return (
    <div className="animate-page-fade">
      {/* Hero */}
      <section className="relative mx-auto flex min-h-[82vh] max-w-5xl flex-col items-center justify-center px-4 py-20 text-center">
        <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-midnight-600/40 bg-midnight-950/60 px-4 py-1.5 text-xs uppercase tracking-[0.3em] text-midnight-200 backdrop-blur-sm">
          <Ghost className="h-3.5 w-3.5" strokeWidth={1.5} />
          Beyond the Unknown
        </div>
        <h1 className="font-display text-6xl font-semibold leading-[1.05] text-midnight-50 text-glow sm:text-7xl md:text-8xl lg:text-9xl">
          PHANTOM
        </h1>
        <p className="mt-6 max-w-2xl font-display text-xl italic text-midnight-100 sm:text-2xl md:text-3xl">
          Every shadow has a story.
        </p>
        <p className="mt-6 max-w-xl text-base leading-relaxed text-midnight-200">
          A community for ghost stories, unexplained experiences, and atmospheric
          horror fiction. Read, share, and transform ordinary tales into something
          that lingers — with open-weight AI running entirely in your browser.
        </p>
        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          <button onClick={() => navigate({ name: 'wall' })} className="btn-primary">
            <BookOpen className="h-4.5 w-4.5" strokeWidth={1.5} />
            Explore Stories
          </button>
          <button onClick={() => navigate({ name: 'share' })} className="btn-ghost">
            <Feather className="h-4.5 w-4.5" strokeWidth={1.5} />
            Create a Story
          </button>
        </div>

        <button
          onClick={() => navigate({ name: 'forge' })}
          className="group mt-8 inline-flex items-center gap-2 text-sm text-midnight-300 transition-colors hover:text-candle-200"
        >
          <Sparkles className="h-4 w-4 text-candle-400" strokeWidth={1.5} />
          Or transform a story with the AI Story Forge
          <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" />
        </button>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-midnight-400 animate-ghost-fade">
          <ChevronDown className="h-6 w-6" strokeWidth={1.3} />
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <h2 className="section-title">Step Into the Shadows</h2>
            <p className="mt-2 text-sm text-midnight-300">Browse stories by what unsettles you.</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => navigate({ name: 'wall', category: cat.id })}
              className="case-card case-card-hover group flex flex-col items-start gap-3 rounded-xl p-4 text-left"
            >
              <div className="rounded-lg bg-midnight-800/60 p-2.5 text-midnight-100 transition-colors group-hover:text-candle-200">
                <CategoryIcon id={cat.id} className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-sm font-semibold leading-tight text-midnight-50">{cat.label}</h3>
                <p className="mt-1 text-xs text-midnight-300">{cat.blurb}</p>
              </div>
            </button>
          ))}
        </div>
      </section>

      {/* Featured / Story of the Week preview */}
      {featured && (
        <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h2 className="section-title flex items-center gap-2">
                <Flame className="h-7 w-7 text-candle-400 animate-flicker" strokeWidth={1.5} />
                Story of the Week
              </h2>
              <p className="mt-2 text-sm text-midnight-300">An editorial pick — chosen for atmosphere and craft.</p>
            </div>
            <button
              onClick={() => navigate({ name: 'week' })}
              className="hidden text-sm text-midnight-200 transition-colors hover:text-candle-200 sm:inline"
            >
              View feature →
            </button>
          </div>
          <div className="mx-auto max-w-3xl">
            <StoryCard story={featured} featured />
          </div>
        </section>
      )}

      {/* Recent stories */}
      <section className="mx-auto max-w-7xl px-4 py-12 md:px-6">
        <div className="mb-8 flex items-end justify-between">
          <h2 className="section-title">Whispers in the Dark</h2>
          <button
            onClick={() => navigate({ name: 'wall' })}
            className="text-sm text-midnight-200 transition-colors hover:text-candle-200"
          >
            See all →
          </button>
        </div>
        {recent.length > 0 ? (
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {recent.map((s) => (
              <StoryCard key={s.id} story={s} />
            ))}
          </div>
        ) : (
          <EmptyState />
        )}
      </section>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="case-card rounded-xl p-10 text-center">
      <Ghost className="mx-auto h-10 w-10 text-midnight-400" strokeWidth={1.2} />
      <p className="mt-4 text-midnight-200">No stories yet. The shadows are waiting for the first whisper.</p>
      <button onClick={() => navigate({ name: 'share' })} className="btn-primary mt-6">
        Share the first story
      </button>
    </div>
  );
}
