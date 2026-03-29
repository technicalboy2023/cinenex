import Link from 'next/link';
import MovieCarousel from '@/components/movie/MovieCarousel';
import type { Movie } from '@/types/movie';

export default function UpcomingSection({ movies }: { movies: Movie[] }) {
  return (
    <section className="py-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
          🎬 Upcoming Movies
        </h2>
        <Link href="/genre/upcoming" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
          See all →
        </Link>
      </div>
      <MovieCarousel movies={movies} />
    </section>
  );
}
