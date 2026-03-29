import Image from 'next/image';
import Link from 'next/link';
import { imageUrl } from '@/lib/tmdb';
import type { Movie } from '@/types/movie';

export default function HeroSection({ movie }: { movie: Movie }) {
  if (!movie) return null;

  return (
    <section className="relative w-full h-[80vh] min-h-[500px] max-h-[800px] overflow-hidden bg-black">
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={imageUrl(movie.backdropPath, 'original')}
          alt={movie.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* ALWAYS dark overlays on the hero image for text readability.
            Bottom gradient uses transparent → black so it merges into
            the carousel section below regardless of theme. */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent md:w-2/3" />
      </div>

      {/* Content — always white text since overlays are always dark */}
      <div className="relative z-10 h-full flex items-end pb-16 md:pb-24">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 w-full animate-slide-up">
          <div className="max-w-xl">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white drop-shadow-2xl mb-3 leading-[1.1]">
              {movie.title}
            </h1>

            <div className="flex items-center gap-3 text-sm text-white/80 mb-4 font-medium">
              <span className="text-green-400 font-bold">{Math.round(movie.voteAverage * 10)}% Match</span>
              {movie.releaseDate && <span>{movie.releaseDate.split('-')[0]}</span>}
              <span className="border border-white/30 px-1.5 py-0.5 rounded text-xs">HD</span>
            </div>

            <p className="text-sm md:text-base text-white/80 line-clamp-3 mb-6 max-w-lg leading-relaxed">
              {movie.overview}
            </p>

            <div className="flex items-center gap-3">
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-white text-black font-bold rounded-md
                           hover:bg-white/90 transition-all active:scale-[0.97]"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M8 5v14l11-7z" />
                </svg>
                View Details
              </Link>
              <Link
                href={`/movie/${movie.id}`}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 backdrop-blur-sm text-white font-semibold rounded-md
                           border border-white/20 hover:bg-white/30 transition-all active:scale-[0.97]"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                More Info
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
