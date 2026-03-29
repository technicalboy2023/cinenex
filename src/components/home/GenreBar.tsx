import Link from 'next/link';
import { getAllGenres } from '@/services/movieService';
import { GENRE_ICONS } from '@/lib/constants';

export default async function GenreBar() {
  let genres: { id: number; name: string }[] = [];
  try {
    genres = await getAllGenres();
  } catch {
    return null;
  }

  if (!genres.length) return null;

  return (
    <section className="py-8">
      <h2 className="text-xl font-bold text-foreground mb-4">Browse by Genre</h2>
      <div className="flex flex-wrap gap-2">
        {genres.map(genre => (
          <Link
            key={genre.id}
            href={`/genre/${genre.id}`}
            className="px-4 py-2 rounded-lg bg-card border border-border text-sm text-muted font-medium
                       hover:bg-card-hover hover:border-border-hover hover:text-foreground
                       transition-all duration-200 flex items-center gap-2"
          >
            <span>{GENRE_ICONS[genre.id] || '🎥'}</span>
            {genre.name}
          </Link>
        ))}
      </div>
    </section>
  );
}
