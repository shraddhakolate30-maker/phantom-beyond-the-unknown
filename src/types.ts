export type CategoryId =
  | 'real-life'
  | 'ghost-encounters'
  | 'haunted-places'
  | 'unexplained'
  | 'horror-fiction'
  | 'psychological-horror';

export interface Category {
  id: CategoryId;
  label: string;
  blurb: string;
  icon: string; // lucide icon name
}

export interface Story {
  id: string;
  title: string;
  content: string;
  excerpt: string;
  category: CategoryId;
  author: string; // display name or 'Anonymous'
  isFiction: boolean;
  createdAt: number; // epoch ms
  reactions: {
    shiver: number;
    skull: number;
    heart: number;
  };
}

export type TransformMode =
  | 'ghost-story'
  | 'mysterious'
  | 'psychological'
  | 'unexpected-ending'
  | 'atmospheric';

export interface TransformOption {
  id: TransformMode;
  label: string;
  description: string;
  icon: string;
}

export interface AtmosphereSettings {
  audioEnabled: boolean;
  audioVolume: number;
  reducedMotion: boolean;
  fogEnabled: boolean;
  particlesEnabled: boolean;
  candlelightEnabled: boolean;
}
