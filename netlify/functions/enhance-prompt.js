export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { idea, mood, useCase, tool } = await req.json();

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Transform this video idea into a professional AI video generation prompt. Be vivid and cinematic, under 60 words.

Idea: "${idea}"
Mood: ${mood || 'Not specified'}
Use case: ${useCase || 'Not specified'}
Tool: ${tool || 'General'}

Format: Just return the enhanced prompt text, nothing else.`
        }]
      })
    });

    const data = await response.json();
    const promptText = data.content?.[0]?.text || data.completion || '';

    return new Response(JSON.stringify({ prompt: promptText.trim() }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (err) {
    return new Response(JSON.stringify({ error: 'Failed to enhance prompt' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
