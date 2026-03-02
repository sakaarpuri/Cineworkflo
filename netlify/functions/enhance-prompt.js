const MODEL_FALLBACK = [
  'claude-sonnet-4-6',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest',
  'claude-3-sonnet-20240229'
];

const { createClient } = require('@supabase/supabase-js');

const normalizeText = (value) => String(value || '').trim();

const looksLikeOffTaskRequest = (idea) => {
  const text = String(idea || '');
  const offTask = /\b(essay|homework|assignment|resume|cover letter|linkedin|blog post|tweet|thread|email|letter|poem|code|javascript|typescript|python|sql|excel|business plan|press release)\b/i;
  const onTask = /\b(prompt|video|film|cinematic|shot|camera|scene|runway|pika|kling|luma|sora|meta|veo|higgsfield)\b/i;
  return offTask.test(text) && !onTask.test(text);
};

const enforcePromptShape = (raw, { maxWords = 90 } = {}) => {
  let text = normalizeText(raw);
  if (!text) return '';

  // Strip common wrappers.
  text = text
    .replace(/^```[\s\S]*?\n/, '')
    .replace(/```$/g, '')
    .replace(/^\s*(prompt|final|output)\s*:\s*/i, '')
    .trim();

  // Prefer the first paragraph if the model returns extra commentary.
  const firstParagraph = text.split(/\n\s*\n/)[0]?.trim();
  if (firstParagraph) text = firstParagraph;

  // Hard cap on word count for cost control and consistency.
  const words = text.split(/\s+/).filter(Boolean);
  if (words.length > maxWords) {
    text = words.slice(0, maxWords).join(' ').replace(/[,\s]+$/g, '').trim();
  }

  // Enforce aspect ratio + resolution as a footer if missing.
  const hasRatio = /\b(16:9|9:16|1:1|4:5)\b/.test(text);
  const hasRes = /\b(4k|8k|1080p|720p)\b/i.test(text);
  if (!hasRatio || !hasRes) {
    const suffix = `${hasRatio ? '' : '16:9'}${!hasRatio && !hasRes ? ', ' : ''}${hasRes ? '' : '4K'}`.trim();
    text = `${text.replace(/[.\s]+$/g, '')} — ${suffix}`.trim();
  }

  return text;
};

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
const supabaseAdmin = supabaseUrl && supabaseServiceRoleKey
  ? createClient(supabaseUrl, supabaseServiceRoleKey)
  : null;

const getBearerToken = (event) => {
  const header = event?.headers?.authorization || event?.headers?.Authorization || '';
  const value = String(header || '').trim();
  if (!value.toLowerCase().startsWith('bearer ')) return '';
  return value.slice(7).trim();
};

const isProUser = (user) => {
  const meta = user?.user_metadata || {};
  if (meta.is_pro !== true) return false;
  if (!meta.pro_expires_at) return true;
  const expires = new Date(meta.pro_expires_at);
  return Number.isFinite(expires.getTime()) && expires > new Date();
};

const getDayKey = () => new Date().toISOString().slice(0, 10);
const getMonthKey = () => new Date().toISOString().slice(0, 7);

const enforceAndRecord = async ({ user, prefix, isPro, limits }) => {
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
    const monthKeyName = `${prefix}_month`;
    const monthCountKey = `${prefix}_month_count`;
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
    return { ok: false, statusCode: 500, error: 'Unable to record usage. Please try again.' };
  }

  return { ok: true };
};

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

  if (!supabaseAdmin) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Supabase admin is not configured (missing SUPABASE_URL and/or SUPABASE_SERVICE_ROLE_KEY).'
      })
    };
  }

  try {
    const token = getBearerToken(event);
    if (!token) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Sign in required' }) };
    }

    const { data: authData, error: authError } = await supabaseAdmin.auth.getUser(token);
    if (authError || !authData?.user) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: 'Invalid session. Please sign in again.' }) };
    }

    const authedUser = authData.user;
    const pro = isProUser(authedUser);

    const limits = {
      freeMonthly: getEnvInt('CWF_FREE_MONTHLY_ENHANCE', 10),
      freeRpm: getEnvInt('CWF_FREE_RPM_ENHANCE', 10),
      proDaily: getEnvInt('CWF_PRO_DAILY_ENHANCE', 200),
      proRpm: getEnvInt('CWF_PRO_RPM_ENHANCE', 30),
    };

    const gate = await enforceAndRecord({
      user: authedUser,
      prefix: 'cwf_enh',
      isPro: pro,
      limits,
    });
    if (!gate.ok) {
      return { statusCode: gate.statusCode, headers, body: JSON.stringify({ error: gate.error }) };
    }

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

    const trimmedIdea = normalizeText(idea);
    if (trimmedIdea.length < 3) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Idea must be at least 3 characters' })
      };
    }

    if (trimmedIdea.length > 500) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'Idea is too long. Keep it under 500 characters.' })
      };
    }

    if (looksLikeOffTaskRequest(trimmedIdea)) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({
          error: 'Prompt Enhancer is for AI video prompt generation only. Describe a shot/scene you want to generate.'
        })
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

    const rawPrompt = response?.content?.[0]?.text;
    const prompt = enforcePromptShape(rawPrompt, { maxWords: isBeginner ? 90 : 120 });
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
