import { Flame, Ghost, Sparkles } from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { navigate } from '../lib/router';
import { CategoryBadge, FictionBadge } from '../components/StoryBadges';
import { formatDate } from '../lib/format';

export function WeekPage() {
  const { stories } = useAtmosphere();
  const featured = stories.find((s) => s.id === 'seed-story-week') ?? stories[0];

  return (
    <div className="animate-page-fade mx-auto max-w-4xl px-4 py-12 md:px-6">
      <header className="mb-8 text-center">
        <Flame className="mx-auto h-10 w-10 text-candle-400 animate-flicker" strokeWidth={1.3} />
        <h1 className="mt-3 font-display text-4xl font-semibold text-midnight-50 md:text-5xl text-glow">
          Story of the Week
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-midnight-200">
          A single story, chosen each week for atmosphere, craft, and the way it stays with you.
        </p>
      </header>

      <div className="mb-8 rounded-xl border border-midnight-700/40 bg-midnight-900/30 p-4 text-sm text-midnight-300">
        <p className="font-medium text-midnight-100">Selection criteria</p>
        <ul className="mt-2 space-y-1.5 text-midnight-300">
          <li>· Strong atmosphere and a distinct sense of place.</li>
          <li>· A turn or image that lingers after the last line.</li>
          <li>· Originality of premise or framing.</li>
          <li>· Readability and care with language.</li>
        </ul>
        <p className="mt-3 text-xs text-midnight-400">
          Note: the current feature is demonstration content chosen by the project team. No
          public competition has run yet — this selection illustrates the feature.
        </p>
      </div>

      {featured ? (
        <article className="case-card rounded-xl p-6 md:p-10">
          <div className="mb-4 flex flex-wrap items-center gap-2">
            <CategoryBadge id={featured.category} />
            <FictionBadge isFiction={featured.isFiction} />
          </div>
          <h2 className="font-display text-3xl font-semibold text-midnight-50 md:text-4xl text-glow">
            {featured.title}
          </h2>
          <div className="mt-3 flex items-center gap-2 text-sm text-midnight-300">
            <Ghost className="h-4 w-4" strokeWidth={1.5} />
            <span>{featured.author}</span>
            <span className="text-midnight-500">·</span>
            <time>{formatDate(featured.createdAt)}</time>
          </div>
          <div className="mt-6 whitespace-pre-line text-lg leading-relaxed text-midnight-100">
            {featured.content}
          </div>
          <div className="mt-8 flex items-center justify-center">
            <button onClick={() => navigate({ name: 'story', id: featured.id })} className="btn-ghost">
              <Sparkles className="h-4 w-4" />
              View full story
            </button>
          </div>
        </article>
      ) : (
        <div className="case-card rounded-xl p-10 text-center">
          <Ghost className="mx-auto h-10 w-10 text-midnight-400" strokeWidth={1.2} />
          <p className="mt-4 text-midnight-200">No story selected yet.</p>
        </div>
      )}
    </div>
  );
}
