// API Route: GET /api/health — health check
import { getCacheStats } from '@/lib/cache';

export const dynamic = 'force-dynamic';

export async function GET() {
  return Response.json({
    status: 'ok',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    cache: getCacheStats(),
  });
}
