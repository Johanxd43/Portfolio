// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck

interface ChatRequest {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  messages: any[];
  systemPrompt?: string;
}

console.info('chat-completion function starting');

Deno.serve(async (req: Request) => {
  // CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'POST') {
    return jsonResponse({ error: 'Method not allowed, use POST' }, 405);
  }

  let body: ChatRequest;
  try {
    body = await req.json();
  } catch {
    return jsonResponse({ error: 'Invalid JSON body' }, 400);
  }

  const { messages, systemPrompt } = body || {};
  if (!messages || !Array.isArray(messages)) {
    return jsonResponse({ error: "'messages' is required and must be an array" }, 400);
  }

  const OPENROUTER_API_KEY = Deno.env.get('OPENROUTER_API_KEY');
  if (!OPENROUTER_API_KEY) {
    return jsonResponse({ error: 'Server misconfiguration: OPENROUTER_API_KEY not set' }, 500);
  }

  // Build payload for OpenRouter
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const payload: any = {
    model: 'meta-llama/llama-3-8b-instruct:free',
    messages,
  };
  if (systemPrompt) payload.system_prompt = systemPrompt;

  try {
    const referer = req.headers.get('referer') || req.headers.get('origin') || 'https://portfolio-chatbot.com';
    const title = req.headers.get('x-title') || 'chat-completion-proxy';

    const orRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        'HTTP-Referer': referer,
        'X-Title': title,
      },
      body: JSON.stringify(payload),
    });

    const text = await orRes.text();
    // try parse JSON
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let data: any = null;
    try {
      data = JSON.parse(text);
    } catch {
      data = { raw: text };
    }

    return new Response(JSON.stringify({ status: orRes.status, data }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (err) {
    console.error('OpenRouter request failed', err);
    return jsonResponse({ error: 'Failed to contact OpenRouter', detail: String(err) }, 502);
  }
});

function jsonResponse(payload: unknown, status = 200) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  });
}
