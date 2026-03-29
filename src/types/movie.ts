// Application-level movie types (clean, sanitized)

export interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  releaseDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  genres?: Genre[];
  popularity: number;
  originalLanguage: string;
  adult: boolean;
  mediaType?: 'movie' | 'tv';
}

export interface MovieDetail extends Movie {
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdbId: string | null;
  genres: Genre[];
  cast: CastMember[];
  crew: CrewMember[];
  videos: Video[];
  similar: Movie[];
  watchProviders: WatchProviderRegion | null;
}

export interface Genre {
  id: number;
  name: string;
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profilePath: string | null;
  order: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profilePath: string | null;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface WatchProvider {
  logoPath: string;
  providerId: number;
  providerName: string;
  displayPriority: number;
}

export interface WatchProviderRegion {
  link: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
}

// Anime uses TV show structure
export interface AnimeShow {
  id: number;
  name: string;
  overview: string;
  posterPath: string | null;
  backdropPath: string | null;
  firstAirDate: string;
  voteAverage: number;
  voteCount: number;
  genreIds: number[];
  popularity: number;
  originalLanguage: string;
  mediaType?: 'tv';
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  totalPages: number;
  totalResults: number;
}
