// Movie service — business logic layer between pages and raw API
import { getOrFetch } from '@/lib/cache';
import * as tmdb from '@/lib/tmdb';
import { sanitizeMovie, sanitizeMovieDetail, sanitizeAnimeShow } from '@/lib/sanitize';
import type { Movie, MovieDetail, Genre, PaginatedResponse, AnimeShow } from '@/types/movie';

/**
 * Fetch all homepage data in parallel (cached)
 */
export async function getHomepageData() {
  const [trending, popular, upcoming, genres, anime] = await Promise.all([
    getOrFetch('trending_week', async () => {
      const data = await tmdb.getTrending('week', 1);
      return { ...data, results: data.results.map(sanitizeMovie) };
    }),
    getOrFetch('popular_1', async () => {
      const data = await tmdb.getPopular(1);
      return { ...data, results: data.results.map(sanitizeMovie) };
    }),
    getOrFetch('upcoming_1', async () => {
      const data = await tmdb.getUpcoming(1);
      return { ...data, results: data.results.map(sanitizeMovie) };
    }),
    getOrFetch('genres', () => tmdb.getGenres()),
    getOrFetch('anime_trending', async () => {
      const data = await tmdb.discoverAnime(1);
      return { ...data, results: data.results.map(sanitizeAnimeShow) };
    }),
  ]);

  return {
    trending: trending.results.filter((m: Movie) => m.id && (m.title || (m as any).name)),
    popular: popular.results.filter((m: Movie) => m.id && (m.title || (m as any).name)),
    upcoming: upcoming.results.filter((m: Movie) => m.id && (m.title || (m as any).name)),
    genres: genres as Genre[],
    anime: anime.results.filter((a: AnimeShow) => a.id && (a.name || (a as any).title)),
  };
}

/**
 * Get full movie detail (cached individually)
 */
export async function getMovieDetail(id: number, region = 'US'): Promise<MovieDetail> {
  return getOrFetch(`movie_${id}`, async () => {
    const raw = await tmdb.getMovieDetails(id);
    return sanitizeMovieDetail(raw, region);
  }, 86400); // 24h cache
}

/**
 * Search movies (not cached — user-driven)
 */
export async function searchMovies(query: string, page = 1): Promise<PaginatedResponse<Movie>> {
  const data = await tmdb.searchMovies(query, page);
  return {
    page: data.page,
    results: data.results.map(sanitizeMovie),
    totalPages: data.total_pages,
    totalResults: data.total_results,
  };
}

/**
 * Get movies by genre (cached per genre+page)
 */
export async function getGenreMovies(genreId: number, page = 1): Promise<PaginatedResponse<Movie>> {
  return getOrFetch(`genre_${genreId}_${page}`, async () => {
    const data = await tmdb.discoverByGenre(genreId, page);
    return {
      page: data.page,
      results: data.results.map(sanitizeMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }, 3600); // 1h cache
}

/**
 * Get all genres (heavily cached)
 */
export async function getAllGenres(): Promise<Genre[]> {
  return getOrFetch('genres', () => tmdb.getGenres(), 604800); // 1 week
}

/**
 * Get anime shows (cached)
 */
export async function getAnimeShows(page = 1): Promise<PaginatedResponse<AnimeShow>> {
  return getOrFetch(`anime_${page}`, async () => {
    const data = await tmdb.discoverAnime(page);
    return {
      page: data.page,
      results: data.results.map(sanitizeAnimeShow),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    };
  }, 3600);
}

export async function getAnimeDetail(id: number, region = 'US'): Promise<MovieDetail> {
  return getOrFetch(`tv_${id}`, async () => {
    const raw = await tmdb.getTvDetails(id);
    // Convert TV details to a MovieDetail-like structure for the UI
    const detail: MovieDetail = {
      id: raw.id,
      title: raw.name || raw.original_name,
      overview: raw.overview,
      posterPath: raw.poster_path,
      backdropPath: raw.backdrop_path,
      releaseDate: raw.first_air_date,
      voteAverage: raw.vote_average,
      voteCount: raw.vote_count,
      genres: raw.genres || [],
      videos: raw.videos?.results.map((v: any) => ({
        id: v.id,
        key: v.key,
        name: v.name,
        site: v.site,
        type: v.type,
        official: v.official,
        publishedAt: v.published_at,
      })) || [],
      similar: raw.similar?.results?.map((show: any) => sanitizeAnimeShow(show)) || [],
      watchProviders: raw['watch/providers']?.results?.[region] || {},
      runtime: raw.episode_run_time?.[0] || null,
      tagline: raw.tagline || '',
      homepage: raw.homepage || '',
      cast: raw.credits?.cast?.slice(0, 15).map((c: any) => ({
        id: c.id,
        name: c.name,
        character: c.character,
        profilePath: c.profile_path,
      })) || [],
      crew: raw.credits?.crew?.slice(0, 10).map((c: any) => ({
        id: c.id,
        name: c.name,
        job: c.job,
        department: c.department,
        profilePath: c.profile_path,
      })) || [],
      status: raw.status || '',
      budget: 0,
      revenue: 0,
      imdbId: null,
      genreIds: raw.genres?.map((g: any) => g.id) || [],
      originalLanguage: raw.original_language || '',
      popularity: raw.popularity || 0,
      adult: raw.adult || false,
    };
    return detail;
  }, 86400); // 24h cache
}
