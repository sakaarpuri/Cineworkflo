export default async (req, context) => {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const { idea, mood, useCase, tool, interpretation, skillLevel } = await req.json();
    const isBeginner = skillLevel === 'beginner';

    // Build interpretation instruction if provided
    let interpretationInstruction = '';
    if (interpretation) {
      const styleGuidelines = {
        'cinematic': 'Create a cinematic, film-like version with dramatic lighting, camera movement, and movie-quality aesthetics.',
        'stylized': 'Create a highly stylized, artistic version with bold colors, graphic design elements, and creative visual treatment.',
        'photorealistic': 'Create a photorealistic, hyper-realistic version that looks like professional photography.',
        'animated': 'Create an animated, motion graphics style version suitable for 2D/3D animation.'
      };
      interpretationInstruction = styleGuidelines[interpretation] || '';
    }

    // Build skill level instruction
    const skillInstruction = isBeginner
      ? `Use simple, accessible language. Avoid technical jargon. Focus on describing the scene in plain English. Always include aspect ratio (16:9 or 9:16) and resolution (4K) at the end.`
      : `Use professional cinematography terminology. Include specific camera movements, lens types (24mm, 50mm, 85mm), aperture settings (f/1.4, f/2.8), lighting setups, and technical specs. Always include aspect ratio and resolution.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 500,
        messages: [{
          role: 'user',
          content: `Create an AI video generation prompt for ${isBeginner ? 'beginners' : 'professionals'}.

${skillInstruction}

Idea: "${idea}"
Mood: ${mood || 'Not specified'}
Use case: ${useCase || 'Not specified'}
Tool: ${tool || 'General'}
${interpretationInstruction ? `Style direction: ${interpretationInstruction}` : ''}

Format: ${isBeginner ? 'Simple descriptive prompt ending with aspect ratio and resolution' : 'Technical cinematography prompt with full specifications'}. Keep it under ${isBeginner ? '60' : '80'} words. Just return the prompt text.`
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
