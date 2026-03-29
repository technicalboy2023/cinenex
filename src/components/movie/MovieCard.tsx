import Image from 'next/image';
import Link from 'next/link';
import { imageUrl } from '@/lib/tmdb';
import WatchlistButton from '@/components/shared/WatchlistButton';
import type { Movie } from '@/types/movie';

export default function MovieCard({ movie }: { movie: Movie }) {
  const displayTitle = movie.title || (movie as any).name || 'Title Unavailable';
  const displayDate = movie.releaseDate || (movie as any).firstAirDate;
  const year = displayDate ? new Date(displayDate).getFullYear() : '';
  // If the movie came from TV/anime, link to /anime/[id], otherwise /movie/[id]
  const href = movie.mediaType === 'tv' ? `/anime/${movie.id}` : `/movie/${movie.id}`;

  return (
    <Link
      href={href}
      id={`movie-card-${movie.id}`}
      className="group relative flex flex-col rounded-lg overflow-hidden bg-card border border-border
                 transition-all duration-300 hover:border-border-hover hover:shadow-xl hover:shadow-black/20 hover:-translate-y-1"
    >
      {/* Poster */}
      <div className="relative aspect-[2/3] overflow-hidden bg-zinc-900">
        <Image
          src={imageUrl(movie.posterPath, 'w500')}
          alt={displayTitle}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 20vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Hover gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent
                        opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        flex flex-col justify-end p-3">
          <p className="text-xs text-white/80 line-clamp-3">{movie.overview}</p>
        </div>

        {/* Rating badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm
                        text-xs text-white font-semibold flex items-center gap-1">
          <span className="text-yellow-400">★</span>
          {movie.voteAverage.toFixed(1)}
        </div>

        {/* Watchlist button */}
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <WatchlistButton movieId={movie.id} size="sm" />
        </div>
      </div>

      {/* Info */}
      <div className="p-3 flex-1 flex flex-col gap-1">
        <h3 className="text-sm font-semibold text-foreground line-clamp-1 group-hover:text-accent transition-colors">
          {displayTitle}
        </h3>
        {year && (
          <span className="text-xs text-muted">{year}</span>
        )}
      </div>
    </Link>
  );
}
