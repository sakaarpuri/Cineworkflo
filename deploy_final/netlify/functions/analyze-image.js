// Netlify Function: Analyze image with Claude and generate prompt
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

  try {
    const { image } = JSON.parse(event.body);
    
    // Remove data URL prefix if present
    const base64Image = image.replace(/^data:image\/\w+;base64,/, '');

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 500,
      messages: [{
        role: 'user',
        content: [
          {
            type: 'image',
            source: {
              type: 'base64',
              media_type: 'image/jpeg',
              data: base64Image
            }
          },
          {
            type: 'text',
            text: `Analyze this video frame/image and create a detailed AI video generation prompt that would recreate this shot. 

Include:
- Camera movement (static, pan, tilt, dolly, etc.)
- Lighting style (golden hour, studio, dramatic, natural, etc.)
- Composition details
- Subject matter
- Mood/atmosphere
- Technical specs (4K, shallow depth of field, etc.)
- Color grade style

Format as a single paragraph prompt optimized for Runway Gen-2 or Pika Labs. Be specific and detailed.`
          }
        ]
      }]
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ prompt: response.content[0].text })
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message })
    };
  }
};