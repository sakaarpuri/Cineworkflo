const MODEL_FALLBACK = [
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
    const { image } = JSON.parse(event.body || '{}');
    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Image payload is required' })
      };
    }

    const mediaMatch = image.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
    const mediaType = mediaMatch?.[1] || 'image/jpeg';
    const allowedMediaTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
    if (!allowedMediaTypes.has(mediaType)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Unsupported image format. Use JPG, PNG, WEBP, or GIF.' })
      };
    }

    const base64Image = mediaMatch ? image.slice(mediaMatch[0].length) : image;

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
            messages: [
              {
                role: 'user',
                content: [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: mediaType,
                      data: base64Image
                    }
                  },
                  {
                    type: 'text',
                    text: `Analyze this shot and create a detailed AI video generation prompt to recreate it.

Include camera movement, lighting style, composition, subject, mood, and technical details.
Format as a single paragraph optimized for Runway/Pika-style video generation.`
                  }
                ]
              }
            ]
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
      body: JSON.stringify({ error: error.message || 'Failed to generate prompt' })
    };
  }
};
