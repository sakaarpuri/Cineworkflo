const MODEL_FALLBACK = [
  'claude-sonnet-4-6',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest',
  'claude-3-sonnet-20240229'
];

const { createClient } = require('@supabase/supabase-js');
const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com']);

const getEnvInt = (key, fallback) => {
  const raw = process.env[key];
  const value = Number.parseInt(String(raw ?? ''), 10);
  return Number.isFinite(value) ? value : fallback;
};

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  || process.env.SUPABASE_SERVICE_KEY
  || process.env.SUPABASE_SERVICE_ROLE
  || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
  || process.env.VITE_SUPABASE_ANON_KEY
  || '';
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;
const supabasePublic = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

const getBearerToken = (event) => {
  const header = event?.headers?.authorization || event?.headers?.Authorization || '';
  const value = String(header || '').trim();
  if (!value.toLowerCase().startsWith('bearer ')) return '';
  return value.slice(7).trim();
};

const isProUser = (user) => {
  const email = String(user?.email || '').trim().toLowerCase();
  if (FORCE_PRO_EMAILS.has(email)) return true;
  const meta = user?.user_metadata || {};
  if (meta.is_pro !== true) return false;
  if (!meta.pro_expires_at) return true;
  const expires = new Date(meta.pro_expires_at);
  return Number.isFinite(expires.getTime()) && expires > new Date();
};

const getDayKey = () => new Date().toISOString().slice(0, 10);
const getMonthKey = () => new Date().toISOString().slice(0, 7);

const enforceAndRecord = async ({ user, prefix, isPro, limits, monthlyCounterPrefix = prefix }) => {
  if (!supabaseAdmin) return { ok: true };

  const meta = { ...(user.user_metadata || {}) };
  const now = Date.now();

  const rpmLimit = isPro ? limits.proRpm : limits.freeRpm;
  const dayLimit = isPro ? limits.proDaily : 0;
  const monthLimit = !isPro ? limits.freeMonthly : 0;

  const rlStartKey = `${prefix}_rl_start`;
  const rlCountKey = `${prefix}_rl_count`;
  const rlStart = Number(meta[rlStartKey] || 0);
  const rlCount = Number(meta[rlCountKey] || 0);
  const inWindow = rlStart && (now - rlStart) < 60_000;
  const nextRpmCount = inWindow ? (rlCount + 1) : 1;
  if (rpmLimit > 0 && nextRpmCount > rpmLimit) {
    return { ok: false, statusCode: 429, error: 'Rate limit exceeded. Please slow down and try again.' };
  }

  if (dayLimit > 0) {
    const dayKeyName = `${prefix}_day`;
    const dayCountKey = `${prefix}_day_count`;
    const day = getDayKey();
    const storedDay = String(meta[dayKeyName] || '');
    const dayCount = Number(meta[dayCountKey] || 0);
    const nextDayCount = storedDay === day ? (dayCount + 1) : 1;
    if (nextDayCount > dayLimit) {
      return { ok: false, statusCode: 429, error: 'Daily fair-use limit reached. Please try again tomorrow.' };
    }
    meta[dayKeyName] = day;
    meta[dayCountKey] = nextDayCount;
  }

  if (monthLimit > 0) {
    const monthKeyName = `${monthlyCounterPrefix}_month`;
    const monthCountKey = `${monthlyCounterPrefix}_month_count`;
    const month = getMonthKey();
    const storedMonth = String(meta[monthKeyName] || '');
    const monthCount = Number(meta[monthCountKey] || 0);
    const nextMonthCount = storedMonth === month ? (monthCount + 1) : 1;
    if (nextMonthCount > monthLimit) {
      return { ok: false, statusCode: 403, error: `Free limit reached (${monthLimit} per month). Upgrade to continue.` };
    }
    meta[monthKeyName] = month;
    meta[monthCountKey] = nextMonthCount;
  }

  meta[rlStartKey] = inWindow ? rlStart : now;
  meta[rlCountKey] = nextRpmCount;

  const { error } = await supabaseAdmin.auth.admin.updateUserById(user.id, { user_metadata: meta });
  if (error) {
    // Keep generation working even if metadata write fails.
    return { ok: true };
  }

  return { ok: true };
};

const resolveAuthedUser = async (token) => {
  if (!token) return { user: null, message: 'Missing bearer token.' };

  if (supabaseAdmin) {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (!error && data?.user) return { user: data.user, message: null };
  }

  if (supabasePublic) {
    const { data, error } = await supabasePublic.auth.getUser(token);
    if (!error && data?.user) return { user: data.user, message: null };
    return { user: null, message: error?.message || 'Token validation failed.' };
  }

  return {
    user: null,
    message: 'Supabase auth verify is not configured (missing SUPABASE_ANON_KEY or SUPABASE_SERVICE_ROLE_KEY).',
  };
};

const extractJsonObject = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  const fenced = raw.match(/```(?:json)?\s*([\s\S]*?)\s*```/i);
  const candidate = fenced ? fenced[1].trim() : raw;

  const start = candidate.indexOf('{');
  const end = candidate.lastIndexOf('}');
  if (start === -1 || end === -1 || end <= start) return null;

  try {
    return JSON.parse(candidate.slice(start, end + 1));
  } catch {
    return null;
  }
};

const extractResponseText = (response) => {
  const blocks = Array.isArray(response?.content) ? response.content : [];
  return blocks
    .filter((block) => block?.type === 'text' && typeof block?.text === 'string')
    .map((block) => block.text.trim())
    .filter(Boolean)
    .join('\n')
    .trim();
};

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

const normalizeStructuredPrompt = (payload) => {
  if (!payload || typeof payload !== 'object') return null;

  const title = normalizeText(payload.title);
  const imagePrompt = normalizeText(payload.image_prompt);
  const videoPrompt = normalizeText(payload.video_prompt);
  const toolNotes = normalizeText(payload.tool_notes);

  if (!imagePrompt || !videoPrompt) return null;

  return {
    title: title || '',
    image_prompt: imagePrompt,
    video_prompt: videoPrompt,
    ...(toolNotes ? { tool_notes: toolNotes } : {})
  };
};

const parseBase64Image = (value) => {
  const raw = String(value || '').trim();
  if (!raw) return null;

  const mediaMatch = raw.match(/^data:(image\/[a-zA-Z0-9.+-]+);base64,/);
  const mediaType = mediaMatch?.[1] || 'image/jpeg';
  const allowedMediaTypes = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif']);
  if (!allowedMediaTypes.has(mediaType)) return null;

  return {
    mediaType,
    data: mediaMatch ? raw.slice(mediaMatch[0].length) : raw,
  };
};

const requestAnthropicJson = async ({ anthropicApiKey, model, system, messages, maxTokens = 500 }) => {
  const apiResponse = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': anthropicApiKey,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      temperature: 0,
      system,
      messages
    })
  });

  const apiData = await apiResponse.json();
  if (!apiResponse.ok) {
    throw new Error(apiData?.error?.message || apiData?.error || `Anthropic request failed (${apiResponse.status})`);
  }

  return apiData;
};

const repairStructuredPrompt = async ({ anthropicApiKey, rawText }) => {
  if (!rawText) return null;

  for (const model of MODEL_FALLBACK) {
    try {
      const repaired = await requestAnthropicJson({
        anthropicApiKey,
        model,
        maxTokens: 400,
        system: `You repair malformed model output into valid JSON only.

Return valid JSON only. No markdown. No explanation.

Required JSON shape:
{
  "title": "short readable title",
  "image_prompt": "string",
  "video_prompt": "string",
  "tool_notes": "optional string"
}`,
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Repair this output into valid JSON with the exact required keys. Keep the creative content intact.\n\n${rawText}`
              }
            ]
          }
        ]
      });

      const repairedText = extractResponseText(repaired);
      const parsed = normalizeStructuredPrompt(extractJsonObject(repairedText));
      if (parsed) return parsed;
    } catch {
      // Try next fallback model.
    }
  }

  return null;
};

exports.handler = async (event) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
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
    const token = getBearerToken(event);
    let authedUser = null;
    if (token) {
      const { user, message: authMessage } = await resolveAuthedUser(token);
      if (!user) {
        return {
          statusCode: 401,
          headers,
          body: JSON.stringify({ error: `Invalid session. Please sign in again. (${authMessage})` })
        };
      }
      authedUser = user;
    }
    const pro = authedUser ? isProUser(authedUser) : false;

    if (authedUser) {
      const limits = {
        freeMonthly: getEnvInt('CWF_FREE_MONTHLY_TOTAL', 5),
        freeRpm: getEnvInt('CWF_FREE_RPM_SHOT', 6),
        proDaily: getEnvInt('CWF_PRO_DAILY_SHOT', 60),
        proRpm: getEnvInt('CWF_PRO_RPM_SHOT', 12),
      };

      const gate = await enforceAndRecord({
        user: authedUser,
        prefix: 'cwf_shot',
        isPro: pro,
        limits,
        monthlyCounterPrefix: 'cwf_free_total',
      });
      if (!gate.ok) {
        return { statusCode: gate.statusCode, headers, body: JSON.stringify({ error: gate.error }) };
      }
    }

    const { image, frames = [], sourceType = 'image' } = JSON.parse(event.body || '{}');
    if (!image) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Image payload is required' })
      };
    }

    const primaryImage = parseBase64Image(image);
    if (!primaryImage) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Unsupported image format. Use JPG, PNG, WEBP, or GIF.' })
      };
    }
    const parsedFrames = Array.isArray(frames) ? frames.map(parseBase64Image).filter(Boolean).slice(0, 3) : [];
    const isVideoInput = sourceType === 'video' && parsedFrames.length >= 3;

    let response = null;
    let lastError = null;
    for (const model of MODEL_FALLBACK) {
      try {
        response = await requestAnthropicJson({
          anthropicApiKey,
          model,
          maxTokens: 500,
          system: `You analyze either a single uploaded frame or three key frames from one continuous video shot and turn it into a structured image-to-video prompt package.

Return valid JSON only. No markdown. No explanation.

Required JSON shape:
{
  "title": "short readable title",
  "image_prompt": "a still-image prompt that accurately recreates this uploaded frame with rich filmmaking detail",
  "video_prompt": "a video prompt that starts from this exact frame and turns it into a plausible cinematic shot while preserving subject, environment, lighting family, and visual style",
  "tool_notes": "optional brief note about why this motion/camera continuation fits the uploaded frame"
}

Rules:
- If three frames are provided, treat them as start, middle, and end moments from one continuous shot.
- The image_prompt must describe the representative still accurately. When three frames are provided, use the middle frame as the visual anchor while preserving continuity from the other two.
- The video_prompt must feel like a continuation of the uploaded image, not a new concept. If three frames are provided, infer actual motion, pacing, and camera behavior from their progression.
- Use strong filmmaking detail: subject, setting, composition, lens/framing, lighting, mood, texture, continuity, motion, and camera behavior where relevant.
- Do not include variables, placeholders, bullet points, labels outside JSON, or SFX.
- Keep tool_notes short and practical if present.
- This tool is for one shot only. Do not break the clip into scenes or describe edits/montages.`,
          messages: [
            {
              role: 'user',
              content: [
                ...(isVideoInput ? [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: parsedFrames[0].mediaType,
                      data: parsedFrames[0].data
                    }
                  },
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: parsedFrames[1].mediaType,
                      data: parsedFrames[1].data
                    }
                  },
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: parsedFrames[2].mediaType,
                      data: parsedFrames[2].data
                    }
                  },
                  {
                    type: 'text',
                    text: `These three images are start, middle, and end moments from one continuous shot. Return structured JSON. The image_prompt should recreate the representative middle-frame still accurately. The video_prompt should capture the actual motion, camera behavior, and pacing implied across the three frames while preserving subject, environment, lighting family, and visual identity.`
                  }
                ] : [
                  {
                    type: 'image',
                    source: {
                      type: 'base64',
                      media_type: primaryImage.mediaType,
                      data: primaryImage.data
                    }
                  },
                  {
                    type: 'text',
                    text: `Analyze this uploaded frame and return the structured JSON response. The image prompt should recreate the still accurately. The video prompt should animate that exact still into a plausible shot with continuity preserved.`
                  }
                ])
              ]
            }
          ]
        });
        break;
      } catch (error) {
        lastError = error;
      }
    }

    if (!response) {
      throw lastError || new Error('Model request failed');
    }

    const contentText = extractResponseText(response);
    let parsed = normalizeStructuredPrompt(extractJsonObject(contentText));
    if (!parsed) {
      parsed = await repairStructuredPrompt({ anthropicApiKey, rawText: contentText });
    }
    if (!parsed) {
      return {
        statusCode: 502,
        headers,
        body: JSON.stringify({ error: 'No structured prompt returned from model' })
      };
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify(parsed)
    };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to generate prompt' })
    };
  }
};
