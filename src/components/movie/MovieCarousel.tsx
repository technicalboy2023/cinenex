'use client';
import { useRef, useState, useEffect } from 'react';
import MovieCard from './MovieCard';
import type { Movie } from '@/types/movie';

export default function MovieCarousel({ movies, title }: { movies: Movie[], title?: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const updateArrows = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 10);
  };

  useEffect(() => {
    updateArrows();
    const resizeHandler = () => updateArrows();
    window.addEventListener('resize', resizeHandler);
    return () => window.removeEventListener('resize', resizeHandler);
  }, [movies]);

  const scroll = (dir: 'left' | 'right') => {
    if (!scrollRef.current) return;
    const amount = scrollRef.current.clientWidth * 0.8;
    scrollRef.current.scrollBy({ left: dir === 'left' ? -amount : amount, behavior: 'smooth' });
    setTimeout(updateArrows, 500);
  };

  if (!movies?.length) return null;

  return (
    <section className="relative group/carousel py-4">
      {title && (
        <h2 className="text-lg md:text-xl font-bold text-foreground mb-3 px-4 sm:px-6 lg:px-8">
          {title}
        </h2>
      )}

      {/* Left arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-[50%] -translate-y-1/2 z-30 w-10 h-24
                     bg-background/80 backdrop-blur-sm text-foreground
                     flex items-center justify-center
                     opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300
                     hover:bg-background rounded-r-lg"
          aria-label="Scroll left"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {/* Carousel track */}
      <div
        ref={scrollRef}
        onScroll={updateArrows}
        className="flex gap-3 overflow-x-auto scrollbar-hide px-4 sm:px-6 lg:px-8 pb-2"
      >
        {Array.from(new Map(movies.map(m => [m.id, m])).values()).map((movie, index) => (
          <div key={`${movie.id}-${index}`} className="shrink-0 w-[140px] sm:w-[160px] md:w-[180px] lg:w-[200px]">
            <MovieCard movie={movie} />
          </div>
        ))}
      </div>

      {/* Right arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-[50%] -translate-y-1/2 z-30 w-10 h-24
                     bg-background/80 backdrop-blur-sm text-foreground
                     flex items-center justify-center
                     opacity-0 group-hover/carousel:opacity-100 transition-opacity duration-300
                     hover:bg-background rounded-l-lg"
          aria-label="Scroll right"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </section>
  );
}
