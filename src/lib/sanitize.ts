// Response sanitization utilities
import type { TMDbMovie, TMDbMovieDetail, TMDbTVShow } from '@/types/tmdb';
import type { Movie, MovieDetail, AnimeShow, CastMember, CrewMember, Video, WatchProviderRegion } from '@/types/movie';

/**
 * Strip HTML and dangerous characters from text
 */
function sanitizeText(text: string | null | undefined): string {
  if (!text) return '';
  return text
    .replace(/<[^>]*>/g, '')           // Remove HTML tags
    .replace(/[<>]/g, '')             // Remove angle brackets
    .replace(/javascript:/gi, '')     // Remove JS protocol
    .trim();
}

/**
 * Transform TMDb movie to clean app format
 */
export function sanitizeMovie(raw: TMDbMovie): Movie {
  return {
    id: raw.id,
    title: sanitizeText(raw.title),
    overview: sanitizeText(raw.overview),
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    releaseDate: raw.release_date || '',
    voteAverage: Math.round((raw.vote_average || 0) * 10) / 10,
    voteCount: raw.vote_count || 0,
    genreIds: raw.genre_ids || raw.genres?.map(g => g.id) || [],
    genres: raw.genres?.map(g => ({ id: g.id, name: sanitizeText(g.name) })),
    popularity: raw.popularity || 0,
    originalLanguage: raw.original_language || '',
    adult: raw.adult || false,
    mediaType: raw.media_type === 'tv' ? 'tv' : 'movie',
  };
}

/**
 * Transform TMDb movie detail to clean app format
 */
export function sanitizeMovieDetail(raw: TMDbMovieDetail, region = 'US'): MovieDetail {
  const base = sanitizeMovie(raw);

  // Extract watch providers for specified region
  let watchProviders: WatchProviderRegion | null = null;
  const providerData = raw['watch/providers']?.results?.[region];
  if (providerData) {
    watchProviders = {
      link: providerData.link || '',
      flatrate: providerData.flatrate?.map(p => ({
        logoPath: p.logo_path,
        providerId: p.provider_id,
        providerName: sanitizeText(p.provider_name),
        displayPriority: p.display_priority,
      })),
      rent: providerData.rent?.map(p => ({
        logoPath: p.logo_path,
        providerId: p.provider_id,
        providerName: sanitizeText(p.provider_name),
        displayPriority: p.display_priority,
      })),
      buy: providerData.buy?.map(p => ({
        logoPath: p.logo_path,
        providerId: p.provider_id,
        providerName: sanitizeText(p.provider_name),
        displayPriority: p.display_priority,
      })),
    };
  }

  // Only keep YouTube videos
  const videos: Video[] = (raw.videos?.results || [])
    .filter(v => v.site === 'YouTube')
    .map(v => ({
      id: v.id,
      key: v.key,
      name: sanitizeText(v.name),
      site: v.site,
      type: v.type,
      official: v.official,
    }));

  const cast: CastMember[] = (raw.credits?.cast || [])
    .slice(0, 20) // Top 20 cast members
    .map(c => ({
      id: c.id,
      name: sanitizeText(c.name),
      character: sanitizeText(c.character),
      profilePath: c.profile_path,
      order: c.order,
    }));

  const crew: CrewMember[] = (raw.credits?.crew || [])
    .filter(c => ['Director', 'Producer', 'Screenplay', 'Writer'].includes(c.job))
    .slice(0, 10)
    .map(c => ({
      id: c.id,
      name: sanitizeText(c.name),
      job: sanitizeText(c.job),
      department: sanitizeText(c.department),
      profilePath: c.profile_path,
    }));

  const similar: Movie[] = (raw.similar?.results || [])
    .slice(0, 12)
    .map(sanitizeMovie);

  return {
    ...base,
    runtime: raw.runtime,
    tagline: sanitizeText(raw.tagline),
    status: raw.status || '',
    budget: raw.budget || 0,
    revenue: raw.revenue || 0,
    homepage: raw.homepage,
    imdbId: raw.imdb_id,
    genres: raw.genres?.map(g => ({ id: g.id, name: sanitizeText(g.name) })) || [],
    cast,
    crew,
    videos,
    similar,
    watchProviders,
  };
}

/**
 * Transform TMDb TV show to anime format
 */
export function sanitizeAnimeShow(raw: TMDbTVShow): AnimeShow {
  return {
    id: raw.id,
    name: sanitizeText(raw.name),
    overview: sanitizeText(raw.overview),
    posterPath: raw.poster_path,
    backdropPath: raw.backdrop_path,
    firstAirDate: raw.first_air_date || '',
    voteAverage: Math.round((raw.vote_average || 0) * 10) / 10,
    voteCount: raw.vote_count || 0,
    genreIds: raw.genre_ids || [],
    popularity: raw.popularity || 0,
    originalLanguage: raw.original_language || '',
    mediaType: 'tv',
  };
}
