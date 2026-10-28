import { ArrowUpRight, Ghost, User } from 'lucide-react';
import type { Story } from '../types';
import { navigate } from '../lib/router';
import { CategoryBadge, FictionBadge, ReactionBar } from './StoryBadges';
import { useAtmosphere } from '../context/AtmosphereContext';
import { formatDate } from '../lib/format';

export function StoryCard({ story, featured = false }: { story: Story; featured?: boolean }) {
  const { reactToStory, reacted } = useAtmosphere();
  const storyReacted = (reacted[story.id]?.size ?? 0) > 0;

  return (
    <article
      className={`case-card case-card-hover group relative flex flex-col rounded-xl p-5 ${
        featured ? 'md:p-7' : ''
      }`}
    >
      {/* Case-file header bar */}
      <div className="mb-3 flex items-center justify-between gap-3 border-b border-midnight-700/30 pb-3">
        <CategoryBadge id={story.category} />
        <FictionBadge isFiction={story.isFiction} />
      </div>

      {/* Case number stamp */}
      <span
        className="pointer-events-none absolute right-3 top-3 font-mono text-[10px] uppercase tracking-widest text-midnight-400/60"
        aria-hidden="true"
      >
        CASE №{story.id.slice(-4).toUpperCase()}
      </span>

      <h3
        className={`font-display font-semibold text-midnight-50 transition-colors group-hover:text-candle-100 ${
          featured ? 'text-2xl md:text-3xl' : 'text-xl'
        }`}
      >
        {story.title}
      </h3>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-midnight-200">{story.excerpt}</p>

      <div className="mt-4 flex items-center gap-2 text-xs text-midnight-300">
        {story.author === 'Anonymous' ? (
          <Ghost className="h-3.5 w-3.5" strokeWidth={1.5} />
        ) : (
          <User className="h-3.5 w-3.5" strokeWidth={1.5} />
        )}
        <span>{story.author}</span>
        <span className="text-midnight-500">·</span>
        <time dateTime={new Date(story.createdAt).toISOString()}>{formatDate(story.createdAt)}</time>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-midnight-700/30 pt-4">
        <ReactionBar
          shiver={story.reactions.shiver}
          skull={story.reactions.skull}
          heart={story.reactions.heart}
          reacted={storyReacted}
          onReact={(type) => reactToStory(story.id, type)}
        />
        <button
          onClick={() => navigate({ name: 'story', id: story.id })}
          className="inline-flex items-center gap-1 text-xs font-medium text-midnight-200 transition-colors hover:text-candle-200"
        >
          Read
          <ArrowUpRight className="h-3.5 w-3.5" />
        </button>
      </div>
    </article>
  );
}
