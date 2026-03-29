import Image from 'next/image';
import { backdropUrl, imageUrl } from '@/lib/tmdb';
import Badge from '@/components/ui/Badge';
import StarRating from '@/components/ui/StarRating';
import WatchlistButton from '@/components/shared/WatchlistButton';
import type { MovieDetail } from '@/types/movie';

export default function MovieHero({ movie }: { movie: MovieDetail }) {
  const year = movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '';
  const director = movie.crew.find(c => c.job === 'Director');

  return (
    <section className="relative w-full min-h-[60vh] lg:min-h-[70vh]">
      {/* Backdrop */}
      <div className="absolute inset-0">
        <Image
          src={backdropUrl(movie.backdropPath)}
          alt={movie.title}
          fill
          className="object-cover"
          priority
        />
        {/* Always dark overlays for readability over images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
      </div>

      {/* Content — always white since overlays are dark */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-12 flex flex-col lg:flex-row gap-8 items-end lg:items-end">
        {/* Poster */}
        <div className="flex-none w-[200px] lg:w-[280px] rounded-xl overflow-hidden shadow-2xl shadow-black/50
                        border border-white/10 animate-fade-in">
          <Image
            src={imageUrl(movie.posterPath, 'w500')}
            alt={movie.title}
            width={280}
            height={420}
            className="w-full h-auto"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex-1 animate-slide-up">
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            {movie.genres.map(g => (
              <Badge key={g.id} variant="primary">{g.name}</Badge>
            ))}
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-2">
            {movie.title}
            {year && <span className="text-white/60 font-normal ml-3">({year})</span>}
          </h1>

          {movie.tagline && (
            <p className="text-lg text-white/70 italic mb-4">&ldquo;{movie.tagline}&rdquo;</p>
          )}

          <div className="flex items-center gap-4 mb-4 flex-wrap">
            <StarRating rating={movie.voteAverage} />
            {movie.runtime && (
              <span className="text-sm text-white/70">
                {Math.floor(movie.runtime / 60)}h {movie.runtime % 60}m
              </span>
            )}
            {director && (
              <span className="text-sm text-white/70">
                Directed by <span className="text-white">{director.name}</span>
              </span>
            )}
          </div>

          <p className="text-white/80 text-base leading-relaxed max-w-2xl mb-6">
            {movie.overview}
          </p>

          <div className="flex items-center gap-3">
            <WatchlistButton movieId={movie.id} size="lg" />
            {movie.homepage && (
              <a
                href={movie.homepage}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-2.5 rounded-lg bg-white/10 backdrop-blur-sm text-white
                           border border-white/20 hover:bg-white/20 transition-all duration-300 text-sm"
              >
                Official Site ↗
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
