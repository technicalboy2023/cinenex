// API Route: GET /api/movies — proxy TMDb popular/trending movies
import { type NextRequest } from 'next/server';
import { getPopular } from '@/lib/tmdb';
import { sanitizeMovie } from '@/lib/sanitize';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { RATE_LIMITS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`movies:${ip}`, RATE_LIMITS.search);
    if (!limit.allowed) {
      return Response.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    const pageParam = request.nextUrl.searchParams.get('page') || '1';
    const page = parseInt(pageParam, 10);

    const data = await getPopular(page);
    return Response.json({
      page: data.page,
      results: data.results.map(sanitizeMovie),
      totalPages: data.total_pages,
      totalResults: data.total_results,
    });
  } catch (err) {
    console.error('[API /movies]', err);
    return Response.json({ error: 'Failed to fetch movies' }, { status: 500 });
  }
}
