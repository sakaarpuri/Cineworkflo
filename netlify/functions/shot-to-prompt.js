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
    if (!token) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Sign in required' }) };
    }

    const { user: authedUser, message: authMessage } = await resolveAuthedUser(token);
    if (!authedUser) {
      return {
        statusCode: 401,
        headers,
        body: JSON.stringify({ error: `Invalid session. Please sign in again. (${authMessage})` })
      };
    }
    const pro = isProUser(authedUser);

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
