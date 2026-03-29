// node-cron scheduler — runs daily cache refresh
// Only runs in Node.js runtime (not Edge, not browser)
import cron from 'node-cron';
import { getOrFetch, flushCache } from './cache';
import { getTrending, getPopular, getUpcoming, getGenres, discoverAnime } from './tmdb';

let isScheduled = false;

/**
 * Pre-warm the cache by fetching all homepage data
 */
export async function warmCache(): Promise<void> {
  console.log('[CineNex CRON] Warming cache...');
  const start = Date.now();

  try {
    await Promise.allSettled([
      getOrFetch('trending_week', () => getTrending('week', 1)),
      getOrFetch('trending_day', () => getTrending('day', 1)),
      getOrFetch('popular_1', () => getPopular(1)),
      getOrFetch('upcoming_1', () => getUpcoming(1)),
      getOrFetch('genres', () => getGenres()),
      getOrFetch('anime_trending', () => discoverAnime(1)),
    ]);
    console.log(`[CineNex CRON] Cache warmed in ${Date.now() - start}ms`);
  } catch (err) {
    console.error('[CineNex CRON] Cache warm failed:', err);
  }
}

/**
 * Start the cron scheduler — runs once daily at midnight UTC
 * Singleton guard to prevent duplicate registration
 */
export function startCronJobs(): void {
  if (isScheduled) {
    console.log('[CineNex CRON] Already scheduled, skipping.');
    return;
  }

  // Daily at midnight UTC: 0 0 * * *
  cron.schedule('0 0 * * *', async () => {
    console.log('[CineNex CRON] Daily refresh triggered');
    flushCache();
    await warmCache();
  }, {
    timezone: 'UTC',
  });

  isScheduled = true;
  console.log('[CineNex CRON] Scheduler started — daily refresh at 00:00 UTC');

  // Warm cache immediately on startup
  warmCache().catch(console.error);
}
