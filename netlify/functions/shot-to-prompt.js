const Anthropic = require('@anthropic-ai/sdk');

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

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

  if (!process.env.ANTHROPIC_API_KEY) {
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
    const base64Image = mediaMatch ? image.slice(mediaMatch[0].length) : image;

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
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
    });

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
