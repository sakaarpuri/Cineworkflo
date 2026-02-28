const MODEL_FALLBACK = [
  'claude-sonnet-4-6',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest',
  'claude-3-sonnet-20240229'
];

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
  if (!anthropicApiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' })
    };
  }

  try {
    const {
      idea = '',
      mood = '',
      useCase = '',
      tool = 'General',
      interpretation = '',
      skillLevel = 'beginner',
      includeAudioSfx = false
    } = JSON.parse(event.body || '{}');

    const trimmedIdea = String(idea || '').trim();
    if (trimmedIdea.length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Idea must be at least 3 characters' })
      };
    }

    const isBeginner = skillLevel === 'beginner';

    let interpretationInstruction = '';
    if (interpretation) {
      const styleGuidelines = {
        cinematic: 'Create a cinematic, film-like version with dramatic lighting, camera movement, and movie-quality aesthetics.',
        stylized: 'Create a highly stylized, artistic version with bold colors, graphic design elements, and creative visual treatment.',
        photorealistic: 'Create a photorealistic, hyper-realistic version that looks like professional photography.',
        animated: 'Create an animated, motion graphics style version suitable for 2D/3D animation.'
      };
      interpretationInstruction = styleGuidelines[interpretation] || '';
    }

    const skillInstruction = isBeginner
      ? 'Use simple, accessible language. Avoid technical jargon. Focus on describing the scene in plain English. Always include aspect ratio (16:9 or 9:16) and resolution (4K) at the end.'
      : 'Use professional cinematography terminology. Include specific camera movements, lens types (24mm, 50mm, 85mm), aperture settings (f/1.4, f/2.8), lighting setups, and technical specs. Always include aspect ratio and resolution.';

    const audioInstruction = includeAudioSfx
      ? (isBeginner
          ? 'Include one short SFX line with ambience and simple foley cues.'
          : 'Include concise professional SFX design notes (ambience, foley, music texture, mix intent).')
      : 'Do not include any audio, SFX, music, dialogue, voiceover, foley, ambience, or sound design details.';

    const promptInput = `Create an AI video generation prompt for ${isBeginner ? 'beginners' : 'professionals'}.

${skillInstruction}
${audioInstruction}

Idea: "${trimmedIdea}"
Mood: ${mood || 'Not specified'}
Use case: ${useCase || 'Not specified'}
Tool: ${tool || 'General'}
${interpretationInstruction ? `Style direction: ${interpretationInstruction}` : ''}

Format: ${isBeginner ? 'Simple descriptive prompt ending with aspect ratio and resolution' : 'Technical cinematography prompt with full specifications'}. Keep it under ${isBeginner ? '60' : '80'} words. Just return the prompt text.`;

    let response = null;
    let lastError = null;

    for (const model of MODEL_FALLBACK) {
      try {
        const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': anthropicApiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify({
            model,
            max_tokens: 500,
            messages: [{ role: 'user', content: promptInput }]
          })
        });

        const apiData = await apiResponse.json();
        if (!apiResponse.ok) {
          throw new Error(apiData?.error?.message || apiData?.error || `Anthropic request failed (${apiResponse.status})`);
        }

        response = apiData;
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!response) {
      throw lastError || new Error('Model request failed');
    }

    const prompt = response?.content?.[0]?.text?.trim();
    if (!prompt) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'No prompt returned from model' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ prompt })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to enhance prompt' })
    };
  }
};
