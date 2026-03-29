import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { getAnimeDetail } from '@/services/movieService';
import MovieHero from '@/components/movie/MovieHero';
import CastList from '@/components/movie/CastList';
import TrailerEmbed from '@/components/movie/TrailerEmbed';
import WatchProviders from '@/components/movie/WatchProviders';
import SimilarMovies from '@/components/movie/SimilarMovies';
import AdBanner from '@/components/ads/AdBanner';
import { siteConfig } from '@/config/site';
import { imageUrl } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

interface PageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || 'en-US';
    const region = acceptLanguage.split(',')[0].split('-')[1]?.toUpperCase() || 'US';
    const movie = await getAnimeDetail(parseInt(id, 10), region);
    return {
      title: movie.title,
      description: movie.overview.slice(0, 160),
      openGraph: {
        title: `${movie.title} | ${siteConfig.name}`,
        description: movie.overview.slice(0, 160),
        images: [{ url: imageUrl(movie.posterPath, 'w780'), width: 780, height: 1170, alt: movie.title }],
        type: 'video.movie',
      },
      twitter: {
        card: 'summary_large_image',
        title: movie.title,
        description: movie.overview.slice(0, 160),
        images: [imageUrl(movie.posterPath, 'w780')],
      },
    };
  } catch {
    return { title: 'Movie Not Found' };
  }
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { id } = await params;
  const animeId = parseInt(id, 10);

  if (isNaN(animeId)) notFound();

  let movie;
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language') || 'en-US';
    const region = acceptLanguage.split(',')[0].split('-')[1]?.toUpperCase() || 'US';
    movie = await getAnimeDetail(animeId, region);

    if (!movie || movie.id === 0 || (!movie.title && !(movie as any).name)) {
      notFound();
    }
  } catch (err: any) {
    if (err?.message?.includes('NotFound')) {
      notFound();
    }
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
        <div className="text-6xl mb-4">😢</div>
        <h1 className="text-2xl font-bold text-foreground mb-2">Failed to load anime data</h1>
        <p className="text-muted max-w-md mx-auto mb-6">
          The database is currently unreachable or the connection was unexpectedly reset.
        </p>
      </div>
    );
  }

  return (
    <div>
      <MovieHero movie={movie} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <AdBanner />

        {/* Trailer */}
        {movie.videos.length > 0 && <TrailerEmbed videos={movie.videos} />}

        {/* Cast */}
        <CastList cast={movie.cast} />

        {/* Where to Watch */}
        {movie.watchProviders && (
          <WatchProviders providers={movie.watchProviders} />
        )}

        <AdBanner />

        {/* Similar Movies */}
        <SimilarMovies movies={movie.similar} />
      </div>
    </div>
  );
}
