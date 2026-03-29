// API Route: GET /api/search — proxy TMDb search
import { type NextRequest } from 'next/server';
import { searchMovies } from '@/services/movieService';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { RATE_LIMITS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`search:${ip}`, RATE_LIMITS.search);
    if (!limit.allowed) {
      return Response.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    const query = request.nextUrl.searchParams.get('q')?.trim();
    const page = parseInt(request.nextUrl.searchParams.get('page') || '1', 10);

    if (!query) {
      return Response.json({ error: 'Query parameter "q" is required' }, { status: 400 });
    }

    const results = await searchMovies(query, page);
    return Response.json(results);
  } catch (err) {
    console.error('[API /search]', err);
    return Response.json({ error: 'Search failed' }, { status: 500 });
  }
}
