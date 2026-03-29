// n8n webhook client — proxies AI recommendation requests

export interface N8NRequest {
  query: string;
  mood?: string;
  genre?: string;
}

export interface N8NResponse {
  recommendations?: Array<{
    title: string;
    year?: string;
    reason?: string;
  }>;
  output?: string;
  error?: string;
  [key: string]: unknown;
}

const N8N_TIMEOUT = 15000; // 15 seconds

/**
 * Send a recommendation request to the n8n webhook
 */
export async function sendToN8N(data: N8NRequest): Promise<N8NResponse> {
  const webhookUrl = process.env.N8N_WEBHOOK_URL;
  if (!webhookUrl) {
    throw new Error('N8N_WEBHOOK_URL is not configured');
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Optional secret key for webhook authentication
  const secret = process.env.N8N_WEBHOOK_SECRET;
  if (secret) {
    headers['X-Webhook-Secret'] = secret;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), N8N_TIMEOUT);

  try {
    const res = await fetch(webhookUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: buildQuery(data) }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!res.ok) {
      throw new Error(`n8n webhook returned ${res.status}: ${res.statusText}`);
    }

    return await res.json() as N8NResponse;
  } catch (err) {
    clearTimeout(timeoutId);
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('n8n webhook request timed out after 15 seconds');
    }
    throw err;
  }
}

function buildQuery(data: N8NRequest): string {
  let query = data.query;
  if (data.mood) query += ` | Mood: ${data.mood}`;
  if (data.genre) query += ` | Genre: ${data.genre}`;
  return query;
}
