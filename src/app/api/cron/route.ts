// API Route: POST /api/cron — manual cache refresh trigger
import { type NextRequest } from 'next/server';
import { flushCache } from '@/lib/cache';
import { warmCache } from '@/lib/cron';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  // Verify secret
  const secret = process.env.CRON_SECRET;
  if (secret) {
    const authHeader = request.headers.get('authorization');
    if (authHeader !== `Bearer ${secret}`) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }
  }

  try {
    flushCache();
    await warmCache();
    return Response.json({ success: true, message: 'Cache refreshed', timestamp: new Date().toISOString() });
  } catch (err) {
    console.error('[API /cron]', err);
    return Response.json({ error: 'Cache refresh failed' }, { status: 500 });
  }
}
