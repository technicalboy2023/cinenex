'use client';
import { useWatchlist } from '@/hooks/useWatchlist';
import { useState, useEffect } from 'react';
import MovieGrid from '@/components/movie/MovieGrid';
import Skeleton from '@/components/ui/Skeleton';
import type { Movie } from '@/types/movie';

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();
  const [movies, setMovies] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (watchlist.length === 0) {
      setMovies([]);
      setIsLoading(false);
      return;
    }

    const itemsToFetch = watchlist.slice(0, 40);

    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const moviePromises = itemsToFetch.map(async (id) => {
          const res = await fetch(`/api/movie/${id}`);
          if (!res.ok) return null;
          const data = await res.json();
          return {
            id: data.id,
            title: data.title || data.name,
            overview: data.overview,
            posterPath: data.posterPath,
            backdropPath: data.backdropPath,
            releaseDate: data.releaseDate || data.firstAirDate || '',
            voteAverage: data.voteAverage || 0,
            voteCount: data.voteCount || 0,
            genreIds: data.genres?.map((g: any) => g.id) || [],
            popularity: data.popularity || 0,
            originalLanguage: data.originalLanguage || '',
            adult: false,
            mediaType: data.name && !data.title ? 'tv' : 'movie',
          } as Movie;
        });

        const results = (await Promise.all(moviePromises)).filter(Boolean) as Movie[];
        setMovies(results);
      } catch (err) {
        console.error('Failed to fetch watchlist movies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [watchlist]);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">My Watchlist</h1>
        <p className="text-muted mt-1">
          {watchlist.length} {watchlist.length === 1 ? 'movie' : 'movies'} saved
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {Array.from({ length: 6 }, (_, i) => (
            <Skeleton key={i} className="aspect-[2/3]" />
          ))}
        </div>
      ) : movies.length > 0 ? (
        <MovieGrid movies={movies} />
      ) : (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">🎬</div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Your watchlist is empty</h2>
          <p className="text-muted">Start browsing and add movies you want to watch later!</p>
        </div>
      )}
    </div>
  );
}
