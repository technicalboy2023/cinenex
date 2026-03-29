'use client';
import { useState } from 'react';
import type { RecommendRequest } from '@/types/recommend';
import { MOOD_OPTIONS } from '@/lib/constants';

interface RecommendFormProps {
  onSubmit: (data: RecommendRequest) => void;
  isLoading: boolean;
  genres: { id: number; name: string }[];
}

export default function RecommendForm({ onSubmit, isLoading, genres }: RecommendFormProps) {
  const [query, setQuery] = useState('');
  const [mood, setMood] = useState('');
  const [genre, setGenre] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    onSubmit({ query: query.trim(), mood: mood || undefined, genre: genre || undefined });
  };

  const inputClasses = `w-full px-4 py-3 rounded-lg bg-card border border-border text-foreground
                        placeholder-muted text-sm
                        focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/20
                        hover:border-border-hover transition-all duration-200`;

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label htmlFor="recommend-query" className="block text-sm font-medium text-foreground mb-2">
          What are you in the mood for?
        </label>
        <input
          id="recommend-query"
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="e.g. action movies like Avengers, cozy anime for a rainy day..."
          className={inputClasses}
          required
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label htmlFor="recommend-mood" className="block text-sm font-medium text-foreground mb-2">
            Mood (optional)
          </label>
          <select id="recommend-mood" value={mood} onChange={(e) => setMood(e.target.value)} className={inputClasses}>
            <option value="">Any mood</option>
            {MOOD_OPTIONS.map(m => (
              <option key={m.value} value={m.value}>{m.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="recommend-genre" className="block text-sm font-medium text-foreground mb-2">
            Genre (optional)
          </label>
          <select id="recommend-genre" value={genre} onChange={(e) => setGenre(e.target.value)} className={inputClasses}>
            <option value="">Any genre</option>
            {genres.map(g => (
              <option key={g.id} value={g.name}>{g.name}</option>
            ))}
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={isLoading || !query.trim()}
        className="w-full py-3 rounded-lg font-semibold text-white bg-accent hover:bg-accent-hover
                   disabled:opacity-50 disabled:cursor-not-allowed
                   transition-all duration-200 active:scale-[0.98]"
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Finding recommendations...
          </span>
        ) : (
          '✨ Get AI Recommendations'
        )}
      </button>
    </form>
  );
}
