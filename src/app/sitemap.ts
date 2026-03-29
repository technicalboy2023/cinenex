import type { MetadataRoute } from 'next';
import { getGenres, getTrending, getPopular } from '@/lib/tmdb';

export const dynamic = 'force-dynamic';

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${BASE_URL}/search`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${BASE_URL}/recommend`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${BASE_URL}/anime`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/watchlist`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.5 },
  ];

  // Genre pages
  let genrePages: MetadataRoute.Sitemap = [];
  try {
    const genres = await getGenres();
    genrePages = genres.map(genre => ({
      url: `${BASE_URL}/genre/${genre.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }));
  } catch { /* skip if API unavailable */ }

  // Top movie pages from trending + popular
  let moviePages: MetadataRoute.Sitemap = [];
  try {
    const [trending, popular] = await Promise.all([
      getTrending('week', 1),
      getPopular(1),
    ]);
    const movieIds = new Set<number>();
    [...trending.results, ...popular.results].forEach(m => movieIds.add(m.id));

    moviePages = Array.from(movieIds).slice(0, 200).map(id => ({
      url: `${BASE_URL}/movie/${id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    }));
  } catch { /* skip if API unavailable */ }

  return [...staticPages, ...genrePages, ...moviePages];
}
