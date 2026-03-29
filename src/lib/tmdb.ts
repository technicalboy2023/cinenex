// TMDb API client — all endpoints centralized here
import type {
  TMDbMovie, TMDbMovieDetail, TMDbPaginatedResponse,
  TMDbTVShow, TMDbGenre,
} from '@/types/tmdb';

const TMDB_BASE = 'https://api.themoviedb.org/3';

function getApiKey(): string | null {
  return process.env.TMDB_API_KEY || null;
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const key = getApiKey();
  if (!key) {
    console.warn(`[TMDb] No API key, failing ${path}`);
    throw new Error('TMDB_API_KEY is not configured');
  }

  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set('api_key', key);
  Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v));

  let res: Response;
  try {
    res = await fetch(url.toString(), {
      headers: { Accept: 'application/json' },
      next: { revalidate: 3600 },
    });
  } catch (error: any) {
    console.error(`[TMDb] Network fetch failed for ${path}:`, error.message);
    throw new Error(`Network failure: ${error.message || 'fetch failed'}`);
  }

  if (!res.ok) {
    console.warn(`[TMDb] API error ${res.status} for ${path}`);
    // If it's a 404 from TMDB, throw a standard error so detail pages can call notFound()
    if (res.status === 404) {
      throw new Error(`NotFound: ${path}`);
    }
    // Generic API failure
    throw new Error(`TMDb API error: ${res.status}`);
  }
  
  return res.json() as Promise<T>;
}

// ─── Movie Endpoints ───

export async function getTrending(
  timeWindow: 'day' | 'week' = 'week',
  page = 1
): Promise<TMDbPaginatedResponse<TMDbMovie>> {
  return tmdbFetch(`/trending/movie/${timeWindow}`, { page: String(page) });
}

export async function getPopular(page = 1): Promise<TMDbPaginatedResponse<TMDbMovie>> {
  return tmdbFetch('/movie/popular', { page: String(page) });
}

export async function getUpcoming(page = 1): Promise<TMDbPaginatedResponse<TMDbMovie>> {
  return tmdbFetch('/movie/upcoming', { page: String(page) });
}

export async function getTopRated(page = 1): Promise<TMDbPaginatedResponse<TMDbMovie>> {
  return tmdbFetch('/movie/top_rated', { page: String(page) });
}

export async function getMovieDetails(id: number): Promise<TMDbMovieDetail> {
  return tmdbFetch(`/movie/${id}`, {
    append_to_response: 'credits,videos,similar,watch/providers',
  });
}

export async function searchMovies(
  query: string,
  page = 1
): Promise<TMDbPaginatedResponse<TMDbMovie>> {
  return tmdbFetch('/search/movie', { query, page: String(page) });
}

export async function discoverByGenre(
  genreId: number,
  page = 1,
  sortBy = 'popularity.desc'
): Promise<TMDbPaginatedResponse<TMDbMovie>> {
  return tmdbFetch('/discover/movie', {
    with_genres: String(genreId),
    page: String(page),
    sort_by: sortBy,
  });
}

export async function getGenres(): Promise<TMDbGenre[]> {
  const data = await tmdbFetch<{ genres: TMDbGenre[] }>('/genre/movie/list');
  return data.genres;
}

// ─── TV / Anime Endpoints ───

export async function getTrendingTV(
  timeWindow: 'day' | 'week' = 'week',
  page = 1
): Promise<TMDbPaginatedResponse<TMDbTVShow>> {
  return tmdbFetch(`/trending/tv/${timeWindow}`, { page: String(page) });
}

export async function discoverAnime(page = 1): Promise<TMDbPaginatedResponse<TMDbTVShow>> {
  return tmdbFetch('/discover/tv', {
    with_genres: '16',
    sort_by: 'popularity.desc',
    page: String(page),
  });
}

export async function searchTV(
  query: string,
  page = 1
): Promise<TMDbPaginatedResponse<TMDbTVShow>> {
  return tmdbFetch('/search/tv', { query, page: String(page) });
}

export async function getTvDetails(id: number): Promise<any> {
  return tmdbFetch(`/tv/${id}`, {
    append_to_response: 'credits,videos,similar,watch/providers',
  });
}

// ─── Image URL helpers ───

export function imageUrl(
  path: string | null,
  size: string = 'w500'
): string {
  if (!path) return '/placeholder-poster.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}

export function backdropUrl(
  path: string | null,
  size: string = 'w1280'
): string {
  if (!path) return '/placeholder-backdrop.svg';
  return `https://image.tmdb.org/t/p/${size}${path}`;
}
