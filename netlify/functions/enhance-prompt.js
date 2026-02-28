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
      includeAudioSfx = false,
      includeImages = false
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
        'directors-cut': 'Create an auteur director\'s-cut version with motivated camera language, layered blocking, restrained color palette, and narrative subtext.',
        'luxury-commercial': 'Create a premium luxury commercial version with elegant camera choreography, polished material rendering, controlled highlights, and brand-grade finish.',
        'vfx-spectacle': 'Create a high-end VFX spectacle version with cinematic scale, dynamic environmental effects, depth layers, and hero-level visual impact.',
        'prestige-animation': 'Create a prestige animation version with premium stylization, intentional shape language, rich lighting design, and feature-film quality motion.'
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

    const imageInstruction = includeImages
      ? (isBeginner
          ? 'Include one short Image details line describing composition, color feel, and visual texture.'
          : 'Include concise still-image direction for composition, palette control, focal hierarchy, and texture fidelity.')
      : 'Do not include any dedicated still-image details line.';

    const promptInput = `Create an AI video generation prompt for ${isBeginner ? 'beginners' : 'professionals'}.

${skillInstruction}
${audioInstruction}
${imageInstruction}

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
