'use client';
import { useWatchlist } from '@/hooks/useWatchlist';

export default function WatchlistButton({ movieId, size = 'md' }: { movieId: number; size?: 'sm' | 'md' | 'lg' }) {
  const { isInWatchlist, toggleWatchlist } = useWatchlist();
  const active = isInWatchlist(movieId);

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
  };

  return (
    <button
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWatchlist(movieId); }}
      className={`${sizeClasses[size]} rounded-full flex items-center justify-center transition-all duration-300
        ${active
          ? 'bg-accent text-white shadow-lg shadow-accent/30 scale-110'
          : 'bg-black/50 backdrop-blur-sm text-white/80 hover:text-white hover:bg-black/70 border border-white/20'
        }`}
      aria-label={active ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      {active ? '♥' : '♡'}
    </button>
  );
}
