import type { Metadata } from 'next';
import { getGenreMovies, getAllGenres } from '@/services/movieService';
import MovieGrid from '@/components/movie/MovieGrid';
import { siteConfig } from '@/config/site';
import { GENRE_ICONS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const genres = await getAllGenres();
  const genre = genres.find(g => g.id === parseInt(id, 10));
  const name = genre?.name || 'Movies';

  return {
    title: `${name} Movies`,
    description: `Discover the best ${name} movies on ${siteConfig.name}. Browse popular and trending ${name.toLowerCase()} films.`,
  };
}

export default async function GenrePage({ params }: PageProps) {
  const { id } = await params;
  const genreId = parseInt(id, 10);

  const [data, genres] = await Promise.all([
    getGenreMovies(genreId, 1),
    getAllGenres(),
  ]);

  const genre = genres.find(g => g.id === genreId);
  const genreName = genre?.name || 'Movies';
  const icon = GENRE_ICONS[genreId] || '🎥';

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground flex items-center gap-3">
          <span>{icon}</span> {genreName} Movies
        </h1>
        <p className="text-muted mt-2">
          {data.totalResults.toLocaleString()} movies found
        </p>
      </div>

      <MovieGrid movies={data.results} />
    </div>
  );
}
