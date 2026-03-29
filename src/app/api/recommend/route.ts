// API Route: POST /api/recommend — proxy to n8n webhook
import { type NextRequest } from 'next/server';
import { getRecommendations } from '@/services/recommendService';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { RATE_LIMITS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    // Rate limit
    const ip = getClientIp(request);
    const limit = checkRateLimit(`recommend:${ip}`, RATE_LIMITS.recommend);
    if (!limit.allowed) {
      return Response.json(
        { error: 'Too many requests', retryAfter: Math.ceil(limit.retryAfterMs / 1000) },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    // Parse request
    const body = await request.json();
    const query = body?.query?.trim();
    if (!query || typeof query !== 'string') {
      return Response.json({ error: 'Query is required' }, { status: 400 });
    }

    // Call n8n
    const result = await getRecommendations({
      query,
      mood: body.mood || undefined,
      genre: body.genre || undefined,
    });

    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Recommendation service unavailable';
    console.error('[API /recommend]', message);

    // Distinguish timeout from other errors
    if (message.includes('timed out')) {
      return Response.json({ error: 'timeout', message }, { status: 504 });
    }
    if (message.includes('not configured')) {
      return Response.json({ error: 'not_configured', message: 'AI recommendation service is not configured' }, { status: 503 });
    }
    return Response.json({ error: 'server_error', message }, { status: 500 });
  }
}
