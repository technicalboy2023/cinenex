'use client';
import { useState } from 'react';
import type { Video } from '@/types/movie';

export default function TrailerEmbed({ videos }: { videos: Video[] }) {
  const [playing, setPlaying] = useState(false);

  // Find the best trailer (official trailer first, then any trailer, then any video)
  const trailer = videos.find(v => v.type === 'Trailer' && v.official)
    || videos.find(v => v.type === 'Trailer')
    || videos[0];

  if (!trailer) return null;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Trailer</h2>
      <div className="relative aspect-video rounded-xl overflow-hidden glass bg-card hover:bg-card-hover 
                      border border-border transition-colors hover:border-border-hover border-border shadow-2xl shadow-black/50">
        {playing ? (
          <iframe
            src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`}
            title={trailer.name}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            className="absolute inset-0 w-full h-full"
          />
        ) : (
          <button
            onClick={() => setPlaying(true)}
            className="absolute inset-0 w-full h-full group cursor-pointer"
          >
            {/* YouTube thumbnail */}
            <img
              src={`https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`}
              alt={trailer.name}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-white/80 dark:bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
            {/* Play button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-red-600 flex items-center justify-center
                            shadow-2xl shadow-red-600/50 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-foreground ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
            <p className="absolute bottom-4 left-4 text-foreground text-sm font-medium">{trailer.name}</p>
          </button>
        )}
      </div>
    </section>
  );
}
