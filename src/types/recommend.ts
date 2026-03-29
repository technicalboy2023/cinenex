// AI Recommendation types

export interface RecommendRequest {
  query: string;
  mood?: string;
  genre?: string;
}

export interface RecommendedMovie {
  title: string;
  year?: string;
  reason?: string;
  tmdbId?: number;
  posterPath?: string | null;
  voteAverage?: number;
}

export interface RecommendResponse {
  recommendations: RecommendedMovie[];
  query: string;
  timestamp: string;
}

export interface RecommendError {
  error: string;
  message: string;
}
