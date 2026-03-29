'use client';
import { dedupeById } from '@/lib/utils';
import { useState, useEffect, useCallback, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MovieGrid from '@/components/movie/MovieGrid';
import Skeleton from '@/components/ui/Skeleton';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import type { Movie } from '@/types/movie';

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const [movies, setMovies] = useState<Movie[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);

  const fetchResults = useCallback(async (q: string, p: number, append = false) => {
    if (!q.trim()) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&page=${p}`);
      const data = await res.json();
      if (data.results) {
        setMovies(prev => append ? dedupeById([...prev, ...data.results]) : dedupeById([...data.results]));
        setTotalPages(data.totalPages || 0);
        setTotalResults(data.totalResults || 0);
      }
    } catch (err) {
      console.error('Search failed:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    setPage(1);
    setMovies([]);
    fetchResults(query, 1);
  }, [query, fetchResults]);

  const loadMore = useCallback(() => {
    if (page < totalPages) {
      const nextPage = page + 1;
      setPage(nextPage);
      fetchResults(query, nextPage, true);
    }
  }, [page, totalPages, query, fetchResults]);

  const { sentinelRef } = useInfiniteScroll(loadMore, page < totalPages, isLoading);

  if (!query) {
    return (
      <div className="text-center py-20 text-muted">
        <div className="text-6xl mb-4">🔍</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Search Movies</h1>
        <p>Start typing to discover movies...</p>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-foreground">
          Search results for &ldquo;{query}&rdquo;
        </h1>
        {totalResults > 0 && (
          <p className="text-sm text-muted mt-1">{totalResults.toLocaleString()} results found</p>
        )}
      </div>

      <MovieGrid movies={movies} />

      {/* Infinite scroll sentinel */}
      <div ref={sentinelRef} className="py-8 flex justify-center">
        {isLoading && <Skeleton className="h-8 w-32" />}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <Suspense fallback={<Skeleton className="h-[60vh] w-full rounded-xl" />}>
        <SearchContent />
      </Suspense>
    </div>
  );
}
