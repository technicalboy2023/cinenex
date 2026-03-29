import MovieCarousel from './MovieCarousel';
import type { Movie } from '@/types/movie';

export default function SimilarMovies({ movies }: { movies: Movie[] }) {
  if (!movies.length) return null;

  return (
    <section className="py-8">
      <MovieCarousel movies={movies} title="Similar Movies" />
    </section>
  );
}
