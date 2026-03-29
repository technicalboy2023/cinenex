'use client';
import { useState, useEffect, useCallback, Suspense } from 'react';
import MovieGrid from '@/components/movie/MovieGrid';
import Skeleton from '@/components/ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import { dedupeById } from '@/lib/utils';
import type { Movie } from '@/types/movie';

function MoviesListContent() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResults = useCallback(async (p: number, append = false) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/movies?page=${p}`);
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
      const text = await res.text();
      let data;
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error('Invalid response from API');
      }
      if (data.results) {
        setMovies(prev => append ? dedupeById([...prev, ...data.results]) : dedupeById([...data.results]));
        setTotalPages(data.totalPages || 0);
      }
    } catch (err: any) {
      console.error('Movies fetch failed:', err);
      setError(err.message || 'Failed to load movies');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResults(1);
  }, [fetchResults]);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(nextPage, true);
    }
  }, [page, totalPages, fetchResults]);

  const { sentinelRef } = useInfiniteScroll(loadMore, page < totalPages, isLoading);

  if (error && movies.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4">⚠️</div>
        <h2 className="text-xl font-semibold text-foreground mb-2">Failed to load movies</h2>
        <p className="text-muted mb-4">{error}</p>
        <button
          onClick={() => fetchResults(1)}
          className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent-hover transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div>
      {isLoading && movies.length === 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 12 }, (_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      ) : (
        <MovieGrid movies={movies} />
      )}

      <div ref={sentinelRef} className="py-8 flex justify-center">
        {isLoading && movies.length > 0 && (
          <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        )}
      </div>
    </div>
  );
}

export default function MoviesPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Movies</h1>
        <p className="text-muted mt-1">Discover the most popular movies right now</p>
      </div>

      <Suspense fallback={<Skeleton className="h-[60vh] w-full rounded-xl" />}>
        <MoviesListContent />
      </Suspense>
    </div>
  );
}
