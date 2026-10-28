import { BookOpen, Brain, Eye, Ghost, Heart, HelpCircle, Home, Skull, Wind } from 'lucide-react';
import type { CategoryId } from '../types';
import { CATEGORIES } from '../data';
import type { LucideIcon } from 'lucide-react';

const ICONS: Record<string, LucideIcon> = {
  Eye,
  Ghost,
  Home,
  HelpCircle,
  BookMarked: BookOpen,
  Brain,
  Wind,
};

export function CategoryIcon({ id, className }: { id: CategoryId; className?: string }) {
  const cat = CATEGORIES.find((c) => c.id === id);
  const Icon = cat ? ICONS[cat.icon] ?? Ghost : Ghost;
  return <Icon className={className} strokeWidth={1.5} />;
}

export function CategoryBadge({ id }: { id: CategoryId }) {
  const cat = CATEGORIES.find((c) => c.id === id);
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-midnight-600/40 bg-midnight-800/50 px-2.5 py-1 text-xs font-medium text-midnight-100">
      <CategoryIcon id={id} className="h-3 w-3" />
      {cat?.label ?? 'Unknown'}
    </span>
  );
}

export function FictionBadge({ isFiction }: { isFiction: boolean }) {
  return isFiction ? (
    <span className="inline-flex items-center rounded-full border border-candle-500/40 bg-candle-900/30 px-2.5 py-1 text-xs font-medium text-candle-200">
      Fiction
    </span>
  ) : (
    <span className="inline-flex items-center rounded-full border border-crimson-700/40 bg-crimson-950/30 px-2.5 py-1 text-xs font-medium text-crimson-200">
      Personal Account · Unverified
    </span>
  );
}

export interface ReactionBarProps {
  shiver: number;
  skull: number;
  heart: number;
  reacted?: boolean;
  onReact?: (type: 'shiver' | 'skull' | 'heart') => void;
}

export function ReactionBar({ shiver, skull, heart, reacted, onReact }: ReactionBarProps) {
  return (
    <div className="flex items-center gap-1.5">
      <ReactionButton icon={Ghost} count={shiver} label="gave a shiver" color="text-midnight-100" onClick={() => onReact?.('shiver')} active={reacted} />
      <ReactionButton icon={Skull} count={skull} label="marked with a skull" color="text-crimson-300" onClick={() => onReact?.('skull')} active={reacted} />
      <ReactionButton icon={Heart} count={heart} label="loved it" color="text-crimson-400" onClick={() => onReact?.('heart')} active={reacted} />
    </div>
  );
}

function ReactionButton({
  icon: Icon,
  count,
  label,
  color,
  onClick,
  active,
}: {
  icon: LucideIcon;
  count: number;
  label: string;
  color: string;
  onClick?: () => void;
  active?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className={`group inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-all ${
        active
          ? 'border-crimson-500/50 bg-crimson-900/20'
          : 'border-midnight-700/40 bg-midnight-900/40 hover:border-midnight-500/60'
      }`}
    >
      <Icon className={`h-3.5 w-3.5 ${color} transition-transform group-hover:scale-110`} strokeWidth={1.5} />
      <span className="text-midnight-200">{count}</span>
    </button>
  );
}
