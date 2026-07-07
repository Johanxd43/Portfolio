export interface Env {
  OPENROUTER_API_KEY: string;
  ALLOWED_ORIGIN: string;
}

const corsHeaders = (origin: string, allowedOrigin: string) => {
  // Allow localhost for development, otherwise enforce allowedOrigin
  const isLocalhost = origin.startsWith('http://localhost:') || origin.startsWith('http://127.0.0.1:');
  const corsOrigin = isLocalhost ? origin : allowedOrigin;

  return {
    'Access-Control-Allow-Origin': corsOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Max-Age': '86400',
  };
};

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || '';
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN);

    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { headers });
    }

    if (request.method !== 'POST') {
      return new Response('Method not allowed', { status: 405, headers });
    }

    const url = new URL(request.url);

    try {
      if (url.pathname === '/api/chat') {
        return await handleChat(request, env, headers);
      }

      return new Response('Not found', { status: 404, headers });
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      return new Response(JSON.stringify({ error: errorMessage }), {
        status: 500,
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
    }
  },
};

async function handleChat(request: Request, env: Env, headers: Record<string, string>): Promise<Response> {
  if (!env.OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY is not configured');
  }

  const body = await request.json() as { messages?: unknown[] };
  const userMessages = body.messages || [];

  // TODO: Replace this generic system prompt with your technical resume, projects, and persona details.
  const systemPrompt = {
    role: 'system',
    content: 'You are a professional digital clone of a software engineer. You answer questions about your experience, skills, and projects concisely and professionally. If you do not know the answer, politely state that.'
  };

  const payload = {
    model: 'meta-llama/llama-3.3-70b-instruct:free',
    messages: [systemPrompt, ...userMessages],
    stream: true
  };

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': env.ALLOWED_ORIGIN, // Required by OpenRouter
      'X-Title': 'Portfolio ChatBot' // Required by OpenRouter
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errorText = await response.text();
    return new Response(JSON.stringify({ error: `OpenRouter API error: ${response.status} - ${errorText}` }), {
      status: response.status,
      headers: { ...headers, 'Content-Type': 'application/json' }
    });
  }

  // Pass the ReadableStream directly to the client
  return new Response(response.body, {
    headers: {
      ...headers,
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive'
    }
  });
}
