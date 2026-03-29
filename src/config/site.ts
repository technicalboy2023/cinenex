// Central site metadata and branding configuration

export const siteConfig = {
  name: 'CineNex',
  description: 'Discover trending movies & anime, watch trailers, find where to stream, and get AI-powered recommendations.',
  url: process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000',
  ogImage: '/og-default.png',
  creator: 'CineNex',
  keywords: [
    'movies', 'anime', 'trending movies', 'movie trailers',
    'where to watch', 'streaming', 'movie recommendations',
    'AI recommendations', 'movie discovery', 'upcoming movies',
  ],
  links: {
    tmdb: 'https://www.themoviedb.org/',
  },
} as const;
