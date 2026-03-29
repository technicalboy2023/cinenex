import MovieCard from './MovieCard';
import type { Movie } from '@/types/movie';

export default function MovieGrid({ movies, className = '' }: { movies: Movie[]; className?: string }) {
  if (!movies.length) {
    return (
      <div className="text-center py-16 text-muted">
        <div className="text-5xl mb-3">🎬</div>
        <p className="text-lg font-medium">No movies found</p>
      </div>
    );
  }

  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 ${className}`}>
      {Array.from(new Map(movies.map(m => [m.id, m])).values()).map((movie, index) => (
        <MovieCard key={`${movie.id}-${index}`} movie={movie} />
      ))}
    </div>
  );
}
