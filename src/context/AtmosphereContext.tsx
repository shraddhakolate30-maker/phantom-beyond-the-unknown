import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { AtmosphereSettings, Story } from '../types';
import {
  DEFAULT_ATMOSPHERE,
  addStory as addStoryStore,
  loadAtmosphere,
  loadReacted,
  loadStories,
  saveAtmosphere,
  saveReacted,
  saveStories,
} from '../lib/storage';

interface AtmosphereContextValue {
  settings: AtmosphereSettings;
  updateSettings: (patch: Partial<AtmosphereSettings>) => void;
  stories: Story[];
  submitStory: (story: Omit<Story, 'id' | 'createdAt' | 'reactions'>) => Story;
  reactToStory: (storyId: string, reaction: 'shiver' | 'skull' | 'heart') => void;
  reacted: Record<string, Set<string>>;
}

const AtmosphereContext = createContext<AtmosphereContextValue | null>(null);

export function AtmosphereProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AtmosphereSettings>(DEFAULT_ATMOSPHERE);
  const [stories, setStories] = useState<Story[]>([]);
  const [reacted, setReacted] = useState<Record<string, Set<string>>>({});

  useEffect(() => {
    setSettings(loadAtmosphere());
    setStories(loadStories());
    setReacted(loadReacted());
  }, []);

  const updateSettings = useCallback((patch: Partial<AtmosphereSettings>) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch };
      saveAtmosphere(next);
      return next;
    });
  }, []);

  const submitStory = useCallback((story: Omit<Story, 'id' | 'createdAt' | 'reactions'>) => {
    const full: Story = {
      ...story,
      id: `story-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: Date.now(),
      reactions: { shiver: 0, skull: 0, heart: 0 },
    };
    const updated = addStoryStore(full);
    setStories(updated);
    return full;
  }, []);

  const reactToStory = useCallback((storyId: string, reaction: 'shiver' | 'skull' | 'heart') => {
    setReacted((prev) => {
      const key = `${storyId}`;
      const set = new Set(prev[key] ?? []);
      if (set.has(reaction)) return prev; // one reaction per type, no toggling for simplicity
      set.add(reaction);
      const next = { ...prev, [key]: set };
      saveReacted(next);
      // Update story counts
      setStories((curStories) => {
        const updated = curStories.map((s) =>
          s.id === storyId
            ? { ...s, reactions: { ...s.reactions, [reaction]: s.reactions[reaction] + 1 } }
            : s,
        );
        saveStories(updated);
        return updated;
      });
      return next;
    });
  }, []);

  // Apply reduced motion class to root
  useEffect(() => {
    const root = document.documentElement;
    if (settings.reducedMotion) root.classList.add('reduce-motion');
    else root.classList.remove('reduce-motion');
  }, [settings.reducedMotion]);

  const value = useMemo<AtmosphereContextValue>(
    () => ({ settings, updateSettings, stories, submitStory, reactToStory, reacted }),
    [settings, updateSettings, stories, submitStory, reactToStory, reacted],
  );

  return <AtmosphereContext.Provider value={value}>{children}</AtmosphereContext.Provider>;
}

export function useAtmosphere() {
  const ctx = useContext(AtmosphereContext);
  if (!ctx) throw new Error('useAtmosphere must be used within AtmosphereProvider');
  return ctx;
}
