import { ArrowLeft, ArrowUpRight, Ghost, User } from 'lucide-react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { navigate } from '../lib/router';
import { CategoryBadge, FictionBadge, ReactionBar } from '../components/StoryBadges';
import { formatDate } from '../lib/format';

export function StoryPage({ id }: { id: string }) {
  const { stories, reactToStory, reacted } = useAtmosphere();
  const story = stories.find((s) => s.id === id);
  if (!story) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20 text-center">
        <Ghost className="mx-auto h-10 w-10 text-midnight-400" strokeWidth={1.2} />
        <h1 className="mt-4 font-display text-3xl text-midnight-50">This story has vanished.</h1>
        <p className="mt-2 text-midnight-300">It may have been moved or never existed in this realm.</p>
        <button onClick={() => navigate({ name: 'wall' })} className="btn-ghost mt-8">
          <ArrowLeft className="h-4 w-4" /> Back to the Wall
        </button>
      </div>
    );
  }

  const hasReacted = (reacted[story.id]?.size ?? 0) > 0;

  return (
    <article className="animate-page-fade mx-auto max-w-3xl px-4 py-12 md:px-6">
      <button onClick={() => navigate({ name: 'wall' })} className="mb-8 inline-flex items-center gap-1.5 text-sm text-midnight-300 transition-colors hover:text-midnight-100">
        <ArrowLeft className="h-4 w-4" /> Back to the Wall
      </button>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <CategoryBadge id={story.category} />
        <FictionBadge isFiction={story.isFiction} />
      </div>

      <h1 className="font-display text-4xl font-semibold leading-tight text-midnight-50 text-glow md:text-5xl">
        {story.title}
      </h1>

      <div className="mt-4 flex items-center gap-2 text-sm text-midnight-300">
        {story.author === 'Anonymous' ? (
          <Ghost className="h-4 w-4" strokeWidth={1.5} />
        ) : (
          <User className="h-4 w-4" strokeWidth={1.5} />
        )}
        <span>{story.author}</span>
        <span className="text-midnight-500">·</span>
        <time dateTime={new Date(story.createdAt).toISOString()}>{formatDate(story.createdAt)}</time>
      </div>

      <div className="case-card mt-8 whitespace-pre-line rounded-xl p-6 text-lg leading-relaxed text-midnight-100">
        {story.content}
      </div>

      {!story.isFiction && (
        <div className="mt-8 rounded-xl border border-crimson-800/30 bg-crimson-950/20 p-4 text-sm text-crimson-200">
          This story is a personal account shared by a visitor. It has not been verified
          and is not scientific evidence of the supernatural. Read it as one person's experience.
        </div>
      )}

      <div className="mt-8 flex items-center justify-between border-t border-midnight-700/30 pt-6">
        <div className="flex items-center gap-2 text-sm text-midnight-300">
          <span>React to this story:</span>
        </div>
        <ReactionBar
          shiver={story.reactions.shiver}
          skull={story.reactions.skull}
          heart={story.reactions.heart}
          reacted={hasReacted}
          onReact={(type) => reactToStory(story.id, type)}
        />
      </div>

      <div className="mt-8 flex items-center justify-center">
        <button onClick={() => navigate({ name: 'forge' })} className="btn-ghost">
          Transform a story with the AI Forge
          <ArrowUpRight className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}
