import type { AtmosphereSettings, Story } from '../types';
import { DEMO_STORIES } from '../data';

const STORIES_KEY = 'phantom.stories.v1';
const SETTINGS_KEY = 'phantom.atmosphere.v1';
const REACTED_KEY = 'phantom.reacted.v1';

export const DEFAULT_ATMOSPHERE: AtmosphereSettings = {
  audioEnabled: false,
  audioVolume: 0.7,
  reducedMotion: false,
  fogEnabled: true,
  particlesEnabled: true,
  candlelightEnabled: true,
};

export function loadStories(): Story[] {
  try {
    const raw = localStorage.getItem(STORIES_KEY);
    if (!raw) {
      // Seed demo stories on first load
      localStorage.setItem(STORIES_KEY, JSON.stringify(DEMO_STORIES));
      return DEMO_STORIES;
    }
    const parsed = JSON.parse(raw) as Story[];
    if (!Array.isArray(parsed)) return DEMO_STORIES;
    return parsed;
  } catch {
    return DEMO_STORIES;
  }
}

export function saveStories(stories: Story[]): void {
  try {
    localStorage.setItem(STORIES_KEY, JSON.stringify(stories));
  } catch {
    /* storage may be unavailable (private mode); ignore */
  }
}

export function addStory(story: Story): Story[] {
  const stories = loadStories();
  const updated = [story, ...stories];
  saveStories(updated);
  return updated;
}

export function loadAtmosphere(): AtmosphereSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (!raw) return DEFAULT_ATMOSPHERE;
    return { ...DEFAULT_ATMOSPHERE, ...(JSON.parse(raw) as Partial<AtmosphereSettings>) };
  } catch {
    return DEFAULT_ATMOSPHERE;
  }
}

export function saveAtmosphere(settings: AtmosphereSettings): void {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {
    /* ignore */
  }
}

export function loadReacted(): Record<string, Set<string>> {
  try {
    const raw = localStorage.getItem(REACTED_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, string[]>;
    const out: Record<string, Set<string>> = {};
    for (const key of Object.keys(parsed)) out[key] = new Set(parsed[key]);
    return out;
  } catch {
    return {};
  }
}

export function saveReacted(reacted: Record<string, Set<string>>): void {
  try {
    const serializable: Record<string, string[]> = {};
    for (const key of Object.keys(reacted)) serializable[key] = Array.from(reacted[key]);
    localStorage.setItem(REACTED_KEY, JSON.stringify(serializable));
  } catch {
    /* ignore */
  }
}
