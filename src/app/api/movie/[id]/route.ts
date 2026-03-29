// API Route: GET /api/movie/[id] — get a single movie's details
import { type NextRequest } from 'next/server';
import { getMovieDetail, getAnimeDetail } from '@/services/movieService';
import { checkRateLimit, getClientIp } from '@/lib/rate-limit';
import { RATE_LIMITS } from '@/lib/constants';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const ip = getClientIp(request);
    const limit = checkRateLimit(`movie_detail:${ip}`, RATE_LIMITS.search);
    if (!limit.allowed) {
      return Response.json(
        { error: 'Too many requests' },
        { status: 429, headers: { 'Retry-After': String(Math.ceil(limit.retryAfterMs / 1000)) } }
      );
    }

    const { id } = await params;
    
    // Check if it's an anime detail request by query param ?type=anime
    const type = request.nextUrl.searchParams.get('type');
    
    let movie;
    if (type === 'anime') {
        movie = await getAnimeDetail(parseInt(id, 10));
    } else {
        try {
            movie = await getMovieDetail(parseInt(id, 10));
        } catch (err: any) {
            if (err?.message?.includes('NotFound')) {
                movie = await getAnimeDetail(parseInt(id, 10));
            } else {
                throw err;
            }
        }
    }

    return Response.json(movie);
  } catch (err) {
    console.error('[API /movie/[id]]', err);
    return Response.json({ error: 'Failed to fetch movie details' }, { status: 500 });
  }
}
