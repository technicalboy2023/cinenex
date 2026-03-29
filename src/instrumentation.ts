// Next.js instrumentation — runs once on server start
// Used to initialize the cron scheduler

export async function register() {
  // Only run cron in Node.js runtime (not Edge, not during build)
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const { startCronJobs } = await import('./lib/cron');
    startCronJobs();
  }
}
