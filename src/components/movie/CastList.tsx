import Image from 'next/image';
import { imageUrl } from '@/lib/tmdb';
import type { CastMember } from '@/types/movie';

export default function CastList({ cast }: { cast: CastMember[] }) {
  if (!cast.length) return null;

  return (
    <section className="py-8">
      <h2 className="text-2xl font-bold text-foreground mb-6">Cast</h2>
      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide" style={{ scrollbarWidth: 'none' }}>
        {cast.map(member => (
          <div
            key={member.id}
            className="flex-none w-[120px] group"
          >
            <div className="w-[120px] h-[120px] rounded-full overflow-hidden mb-2 border-2 border-border transition-colors hover:border-border-hover border-border
                          group-hover:border-blue-500/50 transition-colors duration-300">
              <Image
                src={imageUrl(member.profilePath, 'w185')}
                alt={member.name}
                width={120}
                height={120}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
            <p className="text-sm font-medium text-foreground text-center truncate">{member.name}</p>
            <p className="text-xs text-muted text-center truncate">{member.character}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
