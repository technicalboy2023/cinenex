// Recommendation service — orchestrates n8n webhook calls
import { sendToN8N } from '@/lib/n8n';
import type { RecommendRequest, RecommendResponse, RecommendedMovie } from '@/types/recommend';

/**
 * Get AI recommendations via n8n webhook
 */
export async function getRecommendations(input: RecommendRequest): Promise<RecommendResponse> {
  const n8nResponse = await sendToN8N(input);

  // Parse recommendations from n8n response
  // n8n might return data in various formats — handle flexibly
  let recommendations: RecommendedMovie[] = [];

  if (Array.isArray(n8nResponse.recommendations)) {
    recommendations = n8nResponse.recommendations.map(r => ({
      title: r.title || 'Unknown',
      year: r.year,
      reason: r.reason,
    }));
  } else if (typeof n8nResponse.output === 'string') {
    // If n8n returns a text response, try to parse it
    recommendations = parseTextRecommendations(n8nResponse.output);
  } else if (Array.isArray(n8nResponse)) {
    // Direct array response
    recommendations = (n8nResponse as unknown as RecommendedMovie[]).map(r => ({
      title: r.title || 'Unknown',
      year: r.year,
      reason: r.reason,
    }));
  }

  return {
    recommendations,
    query: input.query,
    timestamp: new Date().toISOString(),
  };
}

/**
 * Parse plain text recommendations into structured data
 */
function parseTextRecommendations(text: string): RecommendedMovie[] {
  const lines = text.split('\n').filter(l => l.trim().length > 0);
  const movies: RecommendedMovie[] = [];

  for (const line of lines) {
    // Match patterns like "1. Movie Title (2023) - reason"
    const match = line.match(/^\d+\.\s*(.+?)(?:\s*\((\d{4})\))?\s*(?:[-–—:]\s*(.+))?$/);
    if (match) {
      movies.push({
        title: match[1].trim(),
        year: match[2] || undefined,
        reason: match[3]?.trim() || undefined,
      });
    } else if (line.trim().length > 2) {
      // Fallback: treat entire line as movie title
      movies.push({ title: line.replace(/^\d+\.\s*/, '').trim() });
    }
  }

  return movies.slice(0, 10); // Cap at 10
}
