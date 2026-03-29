import type { Metadata } from 'next';
import { getAnimeShows } from '@/services/movieService';
import Image from 'next/image';
import Link from 'next/link';
import { imageUrl } from '@/lib/tmdb';
import { siteConfig } from '@/config/site';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Anime',
  description: `Discover trending anime shows on ${siteConfig.name}. Browse popular anime series and find your next favorite.`,
};

export default async function AnimePage() {
  const data = await getAnimeShows(1);

  return (
    <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 pt-24">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground">Anime</h1>
        <p className="text-muted mt-1">Trending anime shows powered by TMDb</p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {data.results.map(show => (
          <Link
            key={show.id}
            href={`/anime/${show.id}`}
            className="group relative flex flex-col rounded-lg overflow-hidden bg-card border border-border
                       transition-all duration-300 hover:border-border-hover hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
          >
            <div className="relative aspect-[2/3] overflow-hidden">
              <Image
                src={imageUrl(show.posterPath, 'w500')}
                alt={show.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent
                              opacity-0 group-hover:opacity-100 transition-opacity duration-300
                              flex items-end p-3">
                <p className="text-xs text-white/80 line-clamp-3">{show.overview}</p>
              </div>
              <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm
                              text-xs text-white font-semibold flex items-center gap-1">
                <span className="text-yellow-400">★</span>
                {show.voteAverage.toFixed(1)}
              </div>
            </div>
            <div className="p-3 flex-1">
              <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
                {show.name}
              </h3>
              {show.firstAirDate && (
                <span className="text-xs text-muted">{new Date(show.firstAirDate).getFullYear()}</span>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
