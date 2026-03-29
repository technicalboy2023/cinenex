// Validated environment variables — fail fast if required vars are missing

function getEnvVar(key: string, fallback?: string): string {
  const value = process.env[key] ?? fallback;
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnvVar(key: string, fallback = ''): string {
  return process.env[key] ?? fallback;
}

export const env = {
  TMDB_API_KEY: getEnvVar('TMDB_API_KEY'),
  TMDB_BASE_URL: 'https://api.themoviedb.org/3',
  TMDB_IMAGE_BASE: 'https://image.tmdb.org/t/p',

  NEXT_PUBLIC_BASE_URL: getOptionalEnvVar('NEXT_PUBLIC_BASE_URL', 'http://localhost:3000'),

  N8N_WEBHOOK_URL: getOptionalEnvVar('N8N_WEBHOOK_URL'),
  N8N_WEBHOOK_SECRET: getOptionalEnvVar('N8N_WEBHOOK_SECRET'),

  NEXT_PUBLIC_ADSENSE_CLIENT_ID: getOptionalEnvVar('NEXT_PUBLIC_ADSENSE_CLIENT_ID'),

  CACHE_TTL: parseInt(getOptionalEnvVar('CACHE_TTL', '86400'), 10),
  CRON_SECRET: getOptionalEnvVar('CRON_SECRET'),
} as const;
