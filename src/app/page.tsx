import { Suspense } from 'react';
import { getHomepageData, getAnimeShows } from '@/services/movieService';
import HeroSection from '@/components/home/HeroSection';
import MovieCarousel from '@/components/movie/MovieCarousel';
import GenreBar from '@/components/home/GenreBar';
import AdBanner from '@/components/ads/AdBanner';
import Skeleton from '@/components/ui/Skeleton';
import type { Movie } from '@/types/movie';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const [homeData, animeData] = await Promise.all([
    getHomepageData(),
    getAnimeShows(1),
  ]);

  const { trending, popular, upcoming } = homeData;
  const anime = animeData.results.map((show: any) => ({
    ...show,
    title: show.name,
    releaseDate: show.firstAirDate,
    adult: false,
    mediaType: 'tv' as const,
  })) as Movie[];

  const heroMovie = trending[0];

  return (
    <div>
      {/* Hero – sits behind the transparent header */}
      {heroMovie && <HeroSection movie={heroMovie} />}

      {/* Smooth transition from hero (always black bottom) → theme background */}
      <div className="relative z-10 -mt-20">
        <div className="h-20 bg-gradient-to-b from-black to-background" />

        <div className="bg-background pb-16">
          <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
            <MovieCarousel title="Trending Now" movies={trending} />

            <AdBanner />

            <MovieCarousel title="Anime Spotlight" movies={anime} />

            <MovieCarousel title="Popular on CineNex" movies={popular} />

            <Suspense fallback={<Skeleton className="h-24 w-full rounded-lg" />}>
              <GenreBar />
            </Suspense>

            <AdBanner />

            <MovieCarousel title="Coming Soon" movies={upcoming} />
          </div>
        </div>
      </div>
    </div>
  );
}
