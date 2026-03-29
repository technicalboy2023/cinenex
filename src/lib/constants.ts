// Application-wide constants

export const TMDB_IMAGE_SIZES = {
  poster: {
    small: 'w185',
    medium: 'w342',
    large: 'w500',
    xl: 'w780',
    original: 'original',
  },
  backdrop: {
    small: 'w300',
    medium: 'w780',
    large: 'w1280',
    original: 'original',
  },
  profile: {
    small: 'w45',
    medium: 'w185',
    large: 'h632',
    original: 'original',
  },
  logo: {
    small: 'w45',
    medium: 'w92',
    large: 'w154',
    original: 'original',
  },
} as const;

export const ANIME_GENRE_ID = 16; // Animation genre ID in TMDb

export const REVALIDATION_INTERVALS = {
  homepage: 3600,    // 1 hour
  movieDetail: 86400, // 24 hours
  genres: 604800,    // 1 week
} as const;

export const RATE_LIMITS = {
  search: { windowMs: 60000, maxRequests: 300 },
  recommend: { windowMs: 60000, maxRequests: 100 },
  cron: { windowMs: 60000, maxRequests: 50 },
} as const;

export const MOOD_OPTIONS = [
  { value: 'happy', label: '😊 Happy & Fun' },
  { value: 'thrilling', label: '🎢 Thrilling & Exciting' },
  { value: 'romantic', label: '❤️ Romantic' },
  { value: 'dark', label: '🌑 Dark & Intense' },
  { value: 'thought-provoking', label: '🧠 Thought-Provoking' },
  { value: 'relaxing', label: '😌 Relaxing & Calm' },
  { value: 'scary', label: '👻 Scary & Horror' },
  { value: 'inspiring', label: '✨ Inspiring & Motivating' },
] as const;

export const GENRE_ICONS: Record<number, string> = {
  28: '💥', 12: '🗺️', 16: '🎨', 35: '😂', 80: '🔪',
  99: '📹', 18: '🎭', 10751: '👨‍👩‍👧‍👦', 14: '🧙', 36: '📜',
  27: '👻', 10402: '🎵', 9648: '🔍', 10749: '❤️', 878: '🚀',
  10770: '📺', 53: '😱', 10752: '⚔️', 37: '🤠',
};
