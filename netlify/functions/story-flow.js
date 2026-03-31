const { createClient } = require('@supabase/supabase-js');
const STYLE_PRESETS = require('../../src/data/stylePresets.json');

const MODEL_FALLBACK = [
  'claude-sonnet-4-6',
  'claude-3-5-sonnet-latest',
  'claude-3-5-haiku-latest',
  'claude-3-sonnet-20240229'
];

const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com']);
const STYLE_PRESET_KEYS = STYLE_PRESETS.map((preset) => preset.key);
const STYLE_PRESET_LABEL_MAP = new Map(
  STYLE_PRESETS.flatMap((preset) => [
    [preset.key.toLowerCase(), preset.key],
    [preset.label.toLowerCase(), preset.key],
  ])
);
const MOODS = [
  'Epic',
  'Dramatic',
  'Thought-Provoking',
  'Whimsical',
  'Serene',
  'Mysterious',
  'Energetic',
  'Eerie',
  'Calm',
  'Surreal',
  'Hopeful',
  'Melancholic',
  'Tense',
  'Playful',
  'Dreamlike'
];

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

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  'Access-Control-Allow-Methods': 'POST, OPTIONS'
};

const normalizeText = (value) => String(value || '').replace(/\s+/g, ' ').trim();

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

const getBearerToken = (event) => {
  const header = event?.headers?.authorization || event?.headers?.Authorization || '';
  const value = String(header || '').trim();
  if (!value.toLowerCase().startsWith('bearer ')) return '';
  return value.slice(7).trim();
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

const isProUser = (user) => {
  const email = String(user?.email || '').trim().toLowerCase();
  if (FORCE_PRO_EMAILS.has(email)) return true;
  const meta = user?.user_metadata || {};
  if (meta.is_pro !== true) return false;
  if (!meta.pro_expires_at) return true;
  const expires = new Date(meta.pro_expires_at);
  return Number.isFinite(expires.getTime()) && expires > new Date();
};

const runAnthropicPrompt = async ({ anthropicApiKey, systemPrompt, userPrompt, maxTokens }) => {
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
          max_tokens: maxTokens,
          system: systemPrompt,
          messages: [{ role: 'user', content: userPrompt }]
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

  return extractResponseText(response);
};

const normalizeMood = (value) => {
  const text = normalizeText(value);
  const match = MOODS.find((mood) => mood.toLowerCase() === text.toLowerCase());
  return match || '';
};

const normalizePreset = (value) => {
  const text = normalizeText(value).toLowerCase();
  return STYLE_PRESET_LABEL_MAP.get(text) || '';
};

const normalizeTreatment = (payload, idea) => {
  const treatment = payload?.treatment || {};
  return {
    title: normalizeText(treatment.title || payload?.conceptVariables?.title || idea),
    logline: normalizeText(treatment.logline),
    storyArc: normalizeText(treatment.storyArc),
    creativeApproach: normalizeText(treatment.creativeApproach),
  };
};

const normalizeConceptVariables = (payload, treatment, idea) => {
  const concept = payload?.conceptVariables || {};
  return {
    title: normalizeText(concept.title || treatment.title || idea),
    protagonist: normalizeText(concept.protagonist),
    setting: normalizeText(concept.setting),
    conflict: normalizeText(concept.conflict),
    tone: normalizeText(concept.tone),
    mood: normalizeMood(concept.mood),
    visualPreset: normalizePreset(concept.visualPreset),
    genreFormat: normalizeText(concept.genreFormat),
  };
};

const normalizeSceneCount = (value) => {
  const number = Number.parseInt(String(value || ''), 10);
  if (!Number.isFinite(number)) return 6;
  return Math.min(8, Math.max(5, number));
};

const buildFallbackScene = (index, conceptVariables, priorScene = null) => ({
  id: `scene-${index + 1}`,
  title: `Scene ${index + 1}`,
  durationSeconds: 10,
  purpose: index === 0
    ? `Introduce ${conceptVariables.protagonist || 'the protagonist'} and establish the central world.`
    : index === 5
      ? 'Deliver the final emotional payoff and visual resolution.'
      : 'Bridge the story to the next major beat while preserving continuity.',
  visualBeat: priorScene?.visualBeat
    ? `Continue from ${priorScene.title.toLowerCase()} with a stronger visual escalation.`
    : `A cinematic beat in ${conceptVariables.setting || 'the main setting'}.`,
  characters: priorScene?.characters?.length ? priorScene.characters : [conceptVariables.protagonist || 'Protagonist'],
  location: priorScene?.location || conceptVariables.setting || 'Primary setting',
});

const normalizeDurationsToMinute = (scenes) => {
  if (!scenes.length) return scenes;
  const rawDurations = scenes.map((scene) => {
    const value = Number.parseInt(String(scene.durationSeconds || ''), 10);
    return Number.isFinite(value) && value > 0 ? value : Math.round(60 / scenes.length);
  });
  const sum = rawDurations.reduce((total, value) => total + value, 0) || 1;
  const scaled = rawDurations.map((value) => Math.max(5, Math.round((value / sum) * 60)));
  let total = scaled.reduce((acc, value) => acc + value, 0);
  let index = scaled.length - 1;

  while (total !== 60 && scaled.length) {
    if (total > 60 && scaled[index] > 5) {
      scaled[index] -= 1;
      total -= 1;
    } else if (total < 60) {
      scaled[index] += 1;
      total += 1;
    }
    index = index === 0 ? scaled.length - 1 : index - 1;
  }

  return scenes.map((scene, idx) => ({ ...scene, durationSeconds: scaled[idx] }));
};

const normalizeScenePayload = (payload, conceptVariables) => {
  const rawScenes = Array.isArray(payload?.scenes) ? payload.scenes : [];
  const sliced = rawScenes.slice(0, 8).map((scene, index) => ({
    id: normalizeText(scene?.id) || `scene-${index + 1}`,
    title: normalizeText(scene?.title) || `Scene ${index + 1}`,
    durationSeconds: scene?.durationSeconds,
    purpose: normalizeText(scene?.purpose),
    visualBeat: normalizeText(scene?.visualBeat),
    characters: Array.isArray(scene?.characters)
      ? scene.characters.map((entry) => normalizeText(entry)).filter(Boolean)
      : normalizeText(scene?.characters)
        ? normalizeText(scene.characters).split(/\s*,\s*/).filter(Boolean)
        : [],
    location: normalizeText(scene?.location),
  }));

  const scenes = [...sliced];
  while (scenes.length < 5) {
    scenes.push(buildFallbackScene(scenes.length, conceptVariables, scenes[scenes.length - 1] || null));
  }

  return normalizeDurationsToMinute(scenes);
};

const normalizePromptGroups = (entries, fallbackName) => {
  if (!Array.isArray(entries)) return [];
  return entries
    .map((entry, index) => ({
      name: normalizeText(entry?.name) || `${fallbackName} ${index + 1}`,
      prompt: normalizeText(entry?.prompt),
      usage: normalizeText(entry?.usage),
    }))
    .filter((entry) => entry.prompt);
};

const normalizeAssetPayload = (payload) => ({
  characterPrompts: normalizePromptGroups(payload?.characterPrompts, 'Character'),
  locationPrompts: normalizePromptGroups(payload?.locationPrompts, 'Location'),
  propPrompts: normalizePromptGroups(payload?.propPrompts, 'Prop'),
  continuityNotes: Array.isArray(payload?.continuityNotes)
    ? payload.continuityNotes.map((entry) => normalizeText(entry)).filter(Boolean)
    : [],
});

const normalizeScenePromptPayload = (payload, scenes) => {
  const raw = Array.isArray(payload?.scenes) ? payload.scenes : [];
  const mapped = new Map(
    raw
      .map((scene) => ({
        id: normalizeText(scene?.id),
        imagePrompt: normalizeText(scene?.imagePrompt),
        shotPrompt: normalizeText(scene?.shotPrompt),
        selectionNote: normalizeText(scene?.selectionNote),
      }))
      .filter((scene) => scene.id && scene.imagePrompt && scene.shotPrompt)
      .map((scene) => [scene.id, scene])
  );

  return scenes.map((scene) => {
    const resolved = mapped.get(scene.id);
    if (resolved) return resolved;
    return {
      id: scene.id,
      imagePrompt: `${scene.visualBeat}. Cinematic still frame, cohesive production design, readable subject hierarchy, lighting continuity, premium image-to-video start frame, 16:9, 4K.`,
      shotPrompt: `${scene.visualBeat}. Animate the frame with motivated subject movement and camera behavior that preserves ${scene.location || 'the location'} and lands the dramatic purpose: ${scene.purpose}.`,
      selectionNote: 'Fallback review prompt generated because the model response was incomplete.',
    };
  });
};

const buildDevelopStoryPrompts = ({ idea }) => ({
  systemPrompt: `You are CineWorkFlo's story flow planner.

Return valid JSON only. No markdown. No explanation.

Generate a 1-minute cinematic story package. Keep it practical for image-to-video planning and stop before final video generation.

Required JSON shape:
{
  "treatment": {
    "title": "short title",
    "logline": "1-2 sentence logline",
    "storyArc": "brief 1-minute arc summary",
    "creativeApproach": "how this should feel visually and narratively"
  },
  "conceptVariables": {
    "title": "same or cleaner title",
    "protagonist": "main subject or character",
    "setting": "world / location",
    "conflict": "core dramatic problem or objective",
    "tone": "short tonal phrase",
    "mood": "one approved mood only",
    "visualPreset": "one approved style preset key only",
    "genreFormat": "genre + format description"
  },
  "recommendedSceneCount": 6
}

Approved moods: ${MOODS.join(', ')}.
Approved style preset keys: ${STYLE_PRESET_KEYS.join(', ')}.

Rules:
- Design for approximately 60 seconds total.
- Keep the idea intact while making it more cinematic and producible.
- Recommended scene count must be between 5 and 8.
- The chosen mood and style preset must be defensible for the idea, not random.`,
  userPrompt: `Idea:\n${idea}`,
  maxTokens: 1200,
});

const buildScenesPrompts = ({ idea, treatment, conceptVariables, recommendedSceneCount }) => ({
  systemPrompt: `You are CineWorkFlo's scene planner.

Return valid JSON only. No markdown. No explanation.

Required JSON shape:
{
  "scenes": [
    {
      "id": "scene-1",
      "title": "scene title",
      "durationSeconds": 10,
      "purpose": "dramatic purpose",
      "visualBeat": "what we should see",
      "characters": ["character names"],
      "location": "primary location"
    }
  ]
}

Rules:
- Create between 5 and 8 scenes.
- Total runtime should land at 60 seconds.
- Every scene must move the story forward.
- Write visual beats in language that can later become image prompts and shot prompts.
- Preserve continuity across subject, world, and tone.
- Keep durations practical and cinematic.`,
  userPrompt: `Idea:
${idea}

Treatment:
${JSON.stringify(treatment, null, 2)}

Concept Variables:
${JSON.stringify(conceptVariables, null, 2)}

Recommended scene count: ${recommendedSceneCount}`,
  maxTokens: 2200,
});

const buildAssetsPrompts = ({ idea, treatment, conceptVariables, scenes }) => ({
  systemPrompt: `You are CineWorkFlo's asset-development planner.

Return valid JSON only. No markdown. No explanation.

Required JSON shape:
{
  "characterPrompts": [{ "name": "asset name", "prompt": "reusable asset prompt", "usage": "where it is used" }],
  "locationPrompts": [{ "name": "asset name", "prompt": "reusable asset prompt", "usage": "where it is used" }],
  "propPrompts": [{ "name": "asset name", "prompt": "reusable asset prompt", "usage": "where it is used" }],
  "continuityNotes": ["note 1", "note 2"]
}

Rules:
- These prompts are for reusable asset development, not one-off shots.
- Character prompts should lock identity, wardrobe, silhouette, and recurring details.
- Location prompts should lock environment design, lighting logic, and repeatable visual cues.
- Prop prompts should only include meaningful recurring objects.
- Continuity notes should help keep a 1-minute story visually consistent.`,
  userPrompt: `Idea:
${idea}

Treatment:
${JSON.stringify(treatment, null, 2)}

Concept Variables:
${JSON.stringify(conceptVariables, null, 2)}

Scenes:
${JSON.stringify(scenes, null, 2)}`,
  maxTokens: 2200,
});

const buildScenePromptsRequest = ({ idea, treatment, conceptVariables, scenes, assetPrompts }) => ({
  systemPrompt: `You are CineWorkFlo's scene prompt reviewer.

Return valid JSON only. No markdown. No explanation.

Required JSON shape:
{
  "scenes": [
    {
      "id": "scene-1",
      "imagePrompt": "cinematic still-image prompt",
      "shotPrompt": "companion shot / image-to-video motion prompt",
      "selectionNote": "brief review note"
    }
  ]
}

Rules:
- Every scene must produce one image prompt and one shot prompt.
- The image prompt should function as a start frame or approved still.
- The shot prompt should describe how to stage or animate the approved still while preserving continuity.
- Write with pro-level filmmaking detail similar to premium prompt tools.
- Keep continuity with character, setting, tone, and style preset.
- Do not output variables or SFX.
- Keep selectionNote short and practical.`,
  userPrompt: `Idea:
${idea}

Treatment:
${JSON.stringify(treatment, null, 2)}

Concept Variables:
${JSON.stringify(conceptVariables, null, 2)}

Scenes:
${JSON.stringify(scenes, null, 2)}

Asset Prompts:
${JSON.stringify(assetPrompts, null, 2)}`,
  maxTokens: 2600,
});

const parseStagePayload = (text, normalizer) => {
  const parsed = extractJsonObject(text);
  if (!parsed) return null;
  return normalizer(parsed);
};

const repairStagePayload = async ({ anthropicApiKey, rawText, requiredShape, normalizer }) => {
  if (!rawText) return null;

  for (const model of MODEL_FALLBACK) {
    try {
      const repaired = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model,
          max_tokens: 900,
          temperature: 0,
          system: `You repair malformed model output into valid JSON only.

Return valid JSON only. No markdown. No explanation.

Required JSON shape:
${requiredShape}`,
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: `Repair this output into valid JSON with the exact required structure. Keep the creative content intact.\n\n${rawText}`
                }
              ]
            }
          ]
        })
      });

      const repairedData = await repaired.json();
      if (!repaired.ok) {
        continue;
      }

      const repairedText = extractResponseText(repairedData);
      const parsed = parseStagePayload(repairedText, normalizer);
      if (parsed) return parsed;
    } catch {
      // Try next fallback model.
    }
  }

  return null;
};

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
  if (!anthropicApiKey) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }) };
  }

  try {
    const token = getBearerToken(event);
    const { user, message } = await resolveAuthedUser(token);
    if (!user) {
      return { statusCode: 401, headers, body: JSON.stringify({ error: `Invalid session. Please sign in again. (${message})` }) };
    }

    if (!isProUser(user)) {
      return { statusCode: 403, headers, body: JSON.stringify({ error: 'Story Flow Planner is currently available to Pro users only.' }) };
    }

    const body = JSON.parse(event.body || '{}');
    const action = normalizeText(body.action);
    const idea = normalizeText(body.idea);

    if (!action) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Action is required.' }) };
    }

    if (!idea) {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Idea is required.' }) };
    }

    let promptConfig;
    if (action === 'develop_story') {
      promptConfig = buildDevelopStoryPrompts({ idea });
    } else if (action === 'build_scenes') {
      promptConfig = buildScenesPrompts({
        idea,
        treatment: body.treatment || {},
        conceptVariables: body.conceptVariables || {},
        recommendedSceneCount: normalizeSceneCount(body.recommendedSceneCount),
      });
    } else if (action === 'build_assets') {
      promptConfig = buildAssetsPrompts({
        idea,
        treatment: body.treatment || {},
        conceptVariables: body.conceptVariables || {},
        scenes: Array.isArray(body.sceneBreakdown) ? body.sceneBreakdown : [],
      });
    } else if (action === 'build_scene_prompts') {
      promptConfig = buildScenePromptsRequest({
        idea,
        treatment: body.treatment || {},
        conceptVariables: body.conceptVariables || {},
        scenes: Array.isArray(body.sceneBreakdown) ? body.sceneBreakdown : [],
        assetPrompts: body.assetPrompts || {},
      });
    } else {
      return { statusCode: 400, headers, body: JSON.stringify({ error: 'Unsupported action.' }) };
    }

    const rawText = await runAnthropicPrompt({
      anthropicApiKey,
      systemPrompt: promptConfig.systemPrompt,
      userPrompt: promptConfig.userPrompt,
      maxTokens: promptConfig.maxTokens,
    });

    if (action === 'develop_story') {
      const normalizer = (payload) => {
        const treatment = normalizeTreatment(payload, idea);
        const conceptVariables = normalizeConceptVariables(payload, treatment, idea);
        return {
          treatment,
          conceptVariables,
          recommendedSceneCount: normalizeSceneCount(payload?.recommendedSceneCount),
        };
      };
      let parsed = parseStagePayload(rawText, normalizer);
      if (!parsed) {
        parsed = await repairStagePayload({
          anthropicApiKey,
          rawText,
          requiredShape: `{
  "treatment": {
    "title": "short title",
    "logline": "1-2 sentence logline",
    "storyArc": "brief 1-minute arc summary",
    "creativeApproach": "how this should feel visually and narratively"
  },
  "conceptVariables": {
    "title": "same or cleaner title",
    "protagonist": "main subject or character",
    "setting": "world / location",
    "conflict": "core dramatic problem or objective",
    "tone": "short tonal phrase",
    "mood": "one approved mood only",
    "visualPreset": "one approved style preset key only",
    "genreFormat": "genre + format description"
  },
  "recommendedSceneCount": 6
}`,
          normalizer,
        });
      }
      if (!parsed || !parsed.treatment.logline || !parsed.treatment.storyArc) {
        return { statusCode: 502, headers, body: JSON.stringify({ error: 'No structured story response returned from model.' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(parsed) };
    }

    if (action === 'build_scenes') {
      const conceptVariables = normalizeConceptVariables({ conceptVariables: body.conceptVariables || {} }, body.treatment || {}, idea);
      const normalizer = (payload) => ({
        scenes: normalizeScenePayload(payload, conceptVariables),
      });
      let parsed = parseStagePayload(rawText, normalizer);
      if (!parsed) {
        parsed = await repairStagePayload({
          anthropicApiKey,
          rawText,
          requiredShape: `{
  "scenes": [
    {
      "id": "scene-1",
      "title": "scene title",
      "durationSeconds": 10,
      "purpose": "dramatic purpose",
      "visualBeat": "what we should see",
      "characters": ["character names"],
      "location": "primary location"
    }
  ]
}`,
          normalizer,
        });
      }
      if (!parsed?.scenes?.length) {
        return { statusCode: 502, headers, body: JSON.stringify({ error: 'No scene breakdown returned from model.' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(parsed) };
    }

    if (action === 'build_assets') {
      let parsed = parseStagePayload(rawText, normalizeAssetPayload);
      if (!parsed) {
        parsed = await repairStagePayload({
          anthropicApiKey,
          rawText,
          requiredShape: `{
  "characterPrompts": [{ "name": "asset name", "prompt": "reusable asset prompt", "usage": "where it is used" }],
  "locationPrompts": [{ "name": "asset name", "prompt": "reusable asset prompt", "usage": "where it is used" }],
  "propPrompts": [{ "name": "asset name", "prompt": "reusable asset prompt", "usage": "where it is used" }],
  "continuityNotes": ["note 1", "note 2"]
}`,
          normalizer: normalizeAssetPayload,
        });
      }
      if (!parsed) {
        return { statusCode: 502, headers, body: JSON.stringify({ error: 'No asset prompts returned from model.' }) };
      }
      return { statusCode: 200, headers, body: JSON.stringify(parsed) };
    }

    const scenes = normalizeScenePayload(
      { scenes: body.sceneBreakdown || [] },
      normalizeConceptVariables({ conceptVariables: body.conceptVariables || {} }, body.treatment || {}, idea)
    );
    const normalizer = (payload) => ({
      scenes: normalizeScenePromptPayload(payload, scenes),
    });
    let parsed = parseStagePayload(rawText, normalizer);
    if (!parsed) {
      parsed = await repairStagePayload({
        anthropicApiKey,
        rawText,
        requiredShape: `{
  "scenes": [
    {
      "id": "scene-1",
      "imagePrompt": "cinematic still-image prompt",
      "shotPrompt": "companion shot / image-to-video motion prompt",
      "selectionNote": "brief review note"
    }
  ]
}`,
        normalizer,
      });
    }
    if (!parsed?.scenes?.length) {
      return { statusCode: 502, headers, body: JSON.stringify({ error: 'No scene prompts returned from model.' }) };
    }
    return { statusCode: 200, headers, body: JSON.stringify(parsed) };
  } catch (error) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: error.message || 'Failed to generate story flow output.' })
    };
  }
};
