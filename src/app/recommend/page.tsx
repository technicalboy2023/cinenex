'use client';
import { useState, useEffect } from 'react';
import RecommendForm from '@/components/recommend/RecommendForm';
import RecommendResults from '@/components/recommend/RecommendResults';
import type { RecommendedMovie } from '@/types/recommend';
import type { Genre } from '@/types/movie';

export default function RecommendPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<RecommendedMovie[]>([]);
  const [query, setQuery] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [genres, setGenres] = useState<Genre[]>([]);

  useEffect(() => {
    setGenres([
      { id: 28, name: 'Action' }, { id: 12, name: 'Adventure' }, { id: 16, name: 'Animation' },
      { id: 35, name: 'Comedy' }, { id: 80, name: 'Crime' }, { id: 99, name: 'Documentary' },
      { id: 18, name: 'Drama' }, { id: 10751, name: 'Family' }, { id: 14, name: 'Fantasy' },
      { id: 36, name: 'History' }, { id: 27, name: 'Horror' }, { id: 10402, name: 'Music' },
      { id: 9648, name: 'Mystery' }, { id: 10749, name: 'Romance' }, { id: 878, name: 'Sci-Fi' },
      { id: 53, name: 'Thriller' }, { id: 10752, name: 'War' }, { id: 37, name: 'Western' },
    ]);
  }, []);

  const handleSubmit = async (data: { query: string; mood?: string; genre?: string }) => {
    setIsLoading(true);
    setError(null);
    setQuery(data.query);

    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        if (res.status === 503) {
          setError('AI recommendation service is not configured. Please set up your n8n webhook.');
        } else if (res.status === 504) {
          setError('The AI service took too long to respond. Please try again.');
        } else {
          setError(errData.message || 'Failed to get recommendations');
        }
        return;
      }

      const result = await res.json();
      setRecommendations(result.recommendations || []);
    } catch {
      setError('Failed to connect to recommendation service. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <div className="text-center mb-10">
        <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-3">
          ✨ AI Movie Recommendations
        </h1>
        <p className="text-muted text-lg">
          Tell us what you&apos;re in the mood for and our AI will find the perfect movies for you.
        </p>
      </div>

      {/* Form card */}
      <div className="bg-card border border-border rounded-xl p-6 sm:p-8 mb-8">
        <RecommendForm onSubmit={handleSubmit} isLoading={isLoading} genres={genres} />
      </div>

      {/* Error */}
      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 mb-6 animate-fade-in">
          <p className="font-medium text-red-600 dark:text-red-400">⚠️ {error}</p>
          <button
            onClick={() => setError(null)}
            className="text-sm text-red-500 hover:text-red-400 mt-2 underline"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Results */}
      {recommendations.length > 0 && (
        <div className="animate-fade-in">
          <RecommendResults recommendations={recommendations} query={query} />
        </div>
      )}
    </div>
  );
}
