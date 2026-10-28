import { Check, Feather, Ghost, ShieldAlert } from 'lucide-react';
import { useState } from 'react';
import { useAtmosphere } from '../context/AtmosphereContext';
import { CATEGORIES } from '../data';
import type { CategoryId } from '../types';
import { navigate } from '../lib/router';

type ExperienceType = 'fiction' | 'personal';

export function SharePage() {
  const { submitStory } = useAtmosphere();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<CategoryId>('real-life');
  const [author, setAuthor] = useState('');
  const [anonymous, setAnonymous] = useState(true);
  const [experience, setExperience] = useState<ExperienceType>('fiction');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState<{ id: string; title: string } | null>(null);

  function validate(): boolean {
    const e: Record<string, string> = {};
    if (title.trim().length < 3) e.title = 'Title must be at least 3 characters.';
    if (content.trim().length < 40) e.content = 'Story must be at least 40 characters.';
    if (!anonymous && author.trim().length < 2) e.author = 'Display name must be at least 2 characters, or choose Anonymous.';
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit(ev: React.FormEvent) {
    ev.preventDefault();
    if (!validate()) return;
    const story = submitStory({
      title: title.trim(),
      content: content.trim(),
      excerpt: content.trim().slice(0, 160) + (content.length > 160 ? '…' : ''),
      category,
      author: anonymous ? 'Anonymous' : author.trim(),
      isFiction: experience === 'fiction',
    });
    setSubmitted({ id: story.id, title: story.title });
  }

  if (submitted) {
    return (
      <div className="animate-page-fade mx-auto max-w-2xl px-4 py-16 text-center">
        <div className="case-card rounded-xl p-10">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-candle-900/30 text-candle-300">
            <Check className="h-7 w-7" strokeWidth={1.5} />
          </div>
          <h1 className="mt-5 font-display text-3xl text-midnight-50">Your story has been whispered into the dark.</h1>
          <p className="mt-3 text-midnight-200">
            "{submitted.title}" was saved to this browser. It will appear in the Story Wall and Discover.
          </p>
          <p className="mt-4 rounded-lg border border-midnight-700/40 bg-midnight-900/50 p-3 text-xs text-midnight-300">
            Note: stories are stored in your browser's local storage only. They are not uploaded
            to a shared server, so other visitors will not see them. This is a demo for the MVP.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <button onClick={() => navigate({ name: 'story', id: submitted.id })} className="btn-primary">
              Read your story
            </button>
            <button onClick={() => navigate({ name: 'wall' })} className="btn-ghost">
              Visit the Story Wall
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="animate-page-fade mx-auto max-w-3xl px-4 py-12 md:px-6">
      <header className="mb-8 text-center">
        <Feather className="mx-auto h-9 w-9 text-midnight-200" strokeWidth={1.3} />
        <h1 className="mt-3 font-display text-4xl font-semibold text-midnight-50 md:text-5xl text-glow">
          Share Your Experience
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-midnight-200">
          Tell your story — real or imagined. Be honest about which it is.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="case-card space-y-6 rounded-xl p-6 md:p-8" noValidate>
        {/* Title */}
        <Field label="Story title" error={errors.title}>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="The Whistling Stairwell"
            className="input-field"
            maxLength={120}
          />
        </Field>

        {/* Content */}
        <Field label="Story content" error={errors.content}>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="It started the night I forgot to lock the attic door…"
            className="input-field min-h-[180px] resize-y leading-relaxed"
            maxLength={8000}
          />
          <p className="mt-1 text-right text-xs text-midnight-400">{content.length}/8000</p>
        </Field>

        {/* Category + experience type */}
        <div className="grid gap-6 md:grid-cols-2">
          <Field label="Category">
            <select value={category} onChange={(e) => setCategory(e.target.value as CategoryId)} className="input-field">
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id} className="bg-midnight-900">{c.label}</option>
              ))}
            </select>
          </Field>
          <Field label="Is this real or imagined?">
            <div className="flex gap-2">
              <Pill active={experience === 'fiction'} onClick={() => setExperience('fiction')}>Fiction</Pill>
              <Pill active={experience === 'personal'} onClick={() => setExperience('personal')}>Personal Experience</Pill>
            </div>
          </Field>
        </div>

        {/* Author */}
        <Field label="Display name">
          <div className="space-y-3">
            <label className="flex items-center gap-2.5 text-sm text-midnight-200">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
                className="h-4 w-4 rounded border-midnight-500 bg-midnight-900 accent-crimson-500"
              />
              Post anonymously
            </label>
            {!anonymous && (
              <input
                type="text"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="Your display name"
                className="input-field"
                maxLength={40}
              />
            )}
            {errors.author && <p className="text-xs text-crimson-300">{errors.author}</p>}
          </div>
        </Field>

        {experience === 'personal' && (
          <div className="flex gap-3 rounded-xl border border-crimson-800/30 bg-crimson-950/20 p-4 text-sm text-crimson-200">
            <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" strokeWidth={1.5} />
            <p>
              Personal accounts are unverified stories shared by visitors. They are not
              scientific evidence. Please avoid sharing names or details that could identify real people.
            </p>
          </div>
        )}

        <div className="flex flex-col items-center gap-3 border-t border-midnight-700/30 pt-6 sm:flex-row sm:justify-between">
          <p className="text-xs text-midnight-400">
            <Ghost className="mr-1 inline h-3.5 w-3.5" strokeWidth={1.5} />
            Saved to this browser only (localStorage demo).
          </p>
          <button type="submit" className="btn-primary w-full sm:w-auto">
            <Feather className="h-4 w-4" strokeWidth={1.5} />
            Submit Story
          </button>
        </div>
      </form>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-midnight-100">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-crimson-300">{error}</p>}
    </div>
  );
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium transition-all ${
        active
          ? 'border border-crimson-500/50 bg-crimson-900/30 text-candle-100'
          : 'border border-midnight-700/40 bg-midnight-900/40 text-midnight-200 hover:border-midnight-500/60'
      }`}
    >
      {children}
    </button>
  );
}
