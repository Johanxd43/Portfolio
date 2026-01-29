import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { messages, systemPrompt } = await req.json()
    const openRouterKey = Deno.env.get('OPENROUTER_API_KEY')

    if (!openRouterKey) {
      throw new Error('Missing OPENROUTER_API_KEY')
    }

    // Construct the messages array for the LLM
    // Ensure the system prompt is first
    const conversation = [
        { role: 'system', content: systemPrompt },
        ...messages
    ];

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openRouterKey}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://portfolio-chatbot.com',
        'X-Title': 'Portfolio ChatBot',
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3-8b-instruct:free',
        messages: conversation,
        max_tokens: 500,
        temperature: 0.7,
      }),
    })

    if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter Error:', errorText);
        throw new Error(`OpenRouter API error: ${response.status} ${errorText}`);
    }

    const data = await response.json()

    // Extract the content
    const content = data.choices[0]?.message?.content || "No response generated."

    return new Response(JSON.stringify({ content }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
