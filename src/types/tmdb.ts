// Raw TMDb API response types (snake_case as returned by API)

export interface TMDbMovie {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  popularity: number;
  original_language: string;
  adult: boolean;
  media_type?: string;
}

export interface TMDbMovieDetail extends TMDbMovie {
  runtime: number | null;
  tagline: string;
  status: string;
  budget: number;
  revenue: number;
  homepage: string | null;
  imdb_id: string | null;
  genres: { id: number; name: string }[];
  credits?: {
    cast: TMDbCast[];
    crew: TMDbCrew[];
  };
  videos?: {
    results: TMDbVideo[];
  };
  similar?: {
    results: TMDbMovie[];
  };
  'watch/providers'?: {
    results: Record<string, TMDbWatchProviderRegion>;
  };
}

export interface TMDbCast {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
}

export interface TMDbCrew {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
}

export interface TMDbVideo {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
}

export interface TMDbWatchProviderEntry {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface TMDbWatchProviderRegion {
  link: string;
  flatrate?: TMDbWatchProviderEntry[];
  rent?: TMDbWatchProviderEntry[];
  buy?: TMDbWatchProviderEntry[];
}

export interface TMDbPaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface TMDbTVShow {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  vote_average: number;
  vote_count: number;
  genre_ids: number[];
  popularity: number;
  original_language: string;
  media_type?: string;
}

export interface TMDbGenre {
  id: number;
  name: string;
}
