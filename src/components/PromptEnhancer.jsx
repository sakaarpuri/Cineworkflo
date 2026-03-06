import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Copy, Check, Wand2, Zap, Palette, Film, Lock, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com']);
const MOODS = ["Epic", "Dramatic", "Thought-Provoking", "Whimsical", "Serene", "Mysterious", "Energetic", "Eerie", "Calm", "Surreal", "Hopeful", "Melancholic", "Tense", "Playful", "Dreamlike"];
const MOOD_COLORS = {
  "Epic": "#8B5CF6",
  "Dramatic": "#EC4899",
  "Thought-Provoking": "#F59E0B",
  "Whimsical": "#10B981",
  "Serene": "#06B6D4",
  "Mysterious": "#6366F1",
  "Energetic": "#FF7043",
  "Eerie": "#B0BEC5",
  "Calm": "#4CAF50",
  "Surreal": "#9C27B0",
  "Hopeful": "#FFC107",
  "Melancholic": "#607D8B",
  "Tense": "#F44336",
  "Playful": "#FFEB3B",
  "Dreamlike": "#9575CD"
};
// Smart prompt generator - analyzes input and creates professional prompts
const generateSmartPrompt = (idea, mood, useCase, skillLevel = 'beginner') => {
  const isBeginner = skillLevel === 'beginner';
  const lowerIdea = idea.toLowerCase();
  
  // Detect subject categories
  const hasVehicle = /car|truck|bike|motorcycle|bus|train|plane|vehicle|driving|riding/i.test(lowerIdea);
  const hasNature = /tree|plant|flower|forest|mountain|ocean|water|sky|cloud|animal|bird|insect|bug|ant|leaf|grass|sunset|sunrise/i.test(lowerIdea);
  const hasPerson = /person|people|man|woman|child|hand|face|chef|dancer|runner|walking|running|jumping|sitting|standing/i.test(lowerIdea);
  const hasUrban = /city|street|building|neon|road|highway|flyover|bridge|alley|subway|metro|urban|downtown/i.test(lowerIdea);
  const hasObject = /product|object|item|food|drink|coffee|book|phone|watch|jewelry/i.test(lowerIdea);
  
  // Mood modifiers
  const moodConfig = {
    "Epic": { lighting: "dramatic volumetric lighting with god rays", camera: "sweeping aerial drone shot descending to", lens: "wide angle", style: "cinematic, high contrast" },
    "Dramatic": { lighting: "chiaroscuro lighting with deep shadows", camera: "slow push-in on", lens: "medium telephoto", style: "film noir inspired" },
    "Thought-Provoking": { lighting: "soft diffused window light", camera: "contemplative static shot of", lens: "50mm", style: "documentary realism" },
    "Whimsical": { lighting: "bright pastel tones with lens flare", camera: "playful handheld orbit around", lens: "wide angle", style: "fantasy color grading" },
    "Serene": { lighting: "soft golden hour glow", camera: "slow glide revealing", lens: "85mm portrait", style: "peaceful, muted tones" },
    "Mysterious": { lighting: "low-key lighting with fog", camera: "slow tracking shot through shadows toward", lens: "35mm", style: "desaturated, high contrast" },
    "Energetic": { lighting: "punchy high-key with rim lights", camera: "dynamic gimbal chase following", lens: "24mm wide", style: "vibrant saturated colors" },
    "Eerie": { lighting: "sickly green-blue moonlight", camera: "low angle creeping toward", lens: "wide angle distorted", style: "horror atmosphere" },
    "Calm": { lighting: "soft overcast daylight", camera: "gentle static observation of", lens: "85mm", style: "naturalistic, minimal grade" },
    "Surreal": { lighting: "impossible multi-colored light sources", camera: "dreamlike floating through", lens: "fisheye distortion", style: "hyper-stylized, impossible physics" },
    "Hopeful": { lighting: "warm sunrise rim lighting", camera: "slow crane up from", lens: "50mm", style: "uplifting bright grade" },
    "Melancholic": { lighting: "cool blue hour with soft shadows", camera: "lingering static on", lens: "135mm compressed", style: "desaturated, film grain" },
    "Tense": { lighting: "harsh overhead creating eye shadows", camera: "unsteady handheld circling", lens: "35mm", style: "gritty documentary" },
    "Playful": { lighting: "bouncing colorful practical lights", camera: "quick whip pans between", lens: "28mm", style: "pop colors, high saturation" },
    "Dreamlike": { lighting: "ethereal soft glow with bloom", camera: "smooth floating motion toward", lens: "85mm anamorphic", style: "milky highlights, pastel shadows" }
  };
  
  const moodSettings = mood && moodConfig[mood] ? moodConfig[mood] : moodConfig["Serene"];
  
  // Subject-specific templates - different complexity for beginner vs pro
  let subjectPrompt = "";
  
  if (isBeginner) {
    // Simple beginner prompts - no technical jargon
    if (hasVehicle) {
      subjectPrompt = `A ${idea} driving through ${moodSettings.lighting}. Smooth movement with energy and flow. ${moodSettings.style}.`;
    } else if (hasNature && (lowerIdea.includes("ant") || lowerIdea.includes("insect") || lowerIdea.includes("bug"))) {
      subjectPrompt = `A close-up of ${idea} in ${moodSettings.lighting}. Tiny details visible, soft blurry background. ${moodSettings.style}.`;
    } else if (hasNature) {
      subjectPrompt = `${idea} with ${moodSettings.lighting}. Natural and organic feel. ${moodSettings.style}.`;
    } else if (hasPerson && (lowerIdea.includes("hand") || lowerIdea.includes("face") || lowerIdea.includes("eye"))) {
      subjectPrompt = `Close-up of ${idea} with ${moodSettings.lighting}. Emotional and intimate. ${moodSettings.style}.`;
    } else if (hasPerson) {
      subjectPrompt = `${idea} moving naturally with ${moodSettings.lighting}. Authentic and real. ${moodSettings.style}.`;
    } else if (hasUrban) {
      subjectPrompt = `${idea} in ${moodSettings.lighting}. Atmospheric city vibes. ${moodSettings.style}.`;
    } else if (hasObject) {
      subjectPrompt = `A shot of ${idea} with ${moodSettings.lighting}. Clean and professional. ${moodSettings.style}.`;
    } else {
      subjectPrompt = `${idea} with ${moodSettings.lighting}. Smooth camera movement exploring the subject. ${moodSettings.style}.`;
    }
  } else {
    // Pro prompts with full technical details
    if (hasVehicle) {
      subjectPrompt = `${moodSettings.camera} a ${idea}, ${moodSettings.lighting} reflecting off chrome and glass. ${moodSettings.lens} lens capturing motion blur in the background, wheels spinning with subtle speed. ${moodSettings.style}, shallow depth isolating the vehicle from environment.`;
  } else if (hasNature && (lowerIdea.includes("ant") || lowerIdea.includes("insect") || lowerIdea.includes("bug"))) {
    subjectPrompt = `Macro extreme close-up, ${moodSettings.lighting} illuminating tiny details. ${idea} with shallow depth of field, background dissolving into creamy bokeh. Microscopic textures visible, morning dew on surfaces. ${moodSettings.style}, 100mm macro lens, intimate perspective.`;
  } else if (hasNature) {
    subjectPrompt = `${moodSettings.camera} ${idea}, ${moodSettings.lighting} filtering through. Organic textures in sharp focus, natural movement in breeze. ${moodSettings.lens} lens capturing environmental depth. ${moodSettings.style}, earthy color palette.`;
  } else if (hasPerson && (lowerIdea.includes("hand") || lowerIdea.includes("face") || lowerIdea.includes("eye"))) {
    subjectPrompt = `Intimate extreme close-up, ${moodSettings.lighting} sculpting features. ${idea} with skin texture visible, shallow depth isolating from background. ${moodSettings.lens} lens, cinematic focus pull. ${moodSettings.style}, emotional intensity.`;
  } else if (hasPerson) {
    subjectPrompt = `${moodSettings.camera} ${idea}, ${moodSettings.lighting} defining form. Authentic movement captured in real-time, subtle breathing and weight shift. ${moodSettings.lens} portrait lens. ${moodSettings.style}, natural skin tones.`;
  } else if (hasUrban) {
    subjectPrompt = `${moodSettings.camera} ${idea}, ${moodSettings.lighting} casting long shadows. Architectural geometry framing the shot, atmospheric haze adding depth. ${moodSettings.lens} perspective. ${moodSettings.style}, urban texture and grit.`;
  } else if (hasObject) {
    subjectPrompt = `Studio product shot, ${moodSettings.lighting} creating dimension. ${idea} rotating slowly on invisible axis, material properties catching light. ${moodSettings.lens} lens with controlled depth. ${moodSettings.style}, commercial quality.`;
    } else {
      subjectPrompt = `${moodSettings.camera} ${idea}, ${moodSettings.lighting} revealing form. Smooth camera motion exploring the subject from multiple angles. ${moodSettings.lens} lens. ${moodSettings.style}, professional production quality.`;
    }
  }
  
  // Use case modifiers - matching shortened names
  const useModifiers = {
    "Storytelling": "Narrative pacing with motivated camera movement, emotional beats.",
    "Short-form": "Fast cuts implied, vertical composition friendly, punchy visuals.",
    "Product Showcase": "Clean backgrounds, hero lighting, feature-highlighting angles.",
    "Education": "Clear visibility, slow reveals, infographic-friendly composition.",
    "Explainer": "Clean minimal environment, focused attention, diagrammatic clarity.",
    "Social Media": "Thumb-stopping composition, bold colors, immediate visual hook.",
    "Brand Ad": "Premium polish, aspirational framing, logo-safe negative space.",
    "Short Film": "Cinematic aspect ratio implied, motivated lighting, narrative subtext.",
    "Documentary": "Observational camera, available light, authentic location texture.",
    "Visual Essay": "Editorial composition, text-friendly framing, intellectual tone.",
    "Spec Ad": "High production value, portfolio-worthy execution, attention to craft.",
    "Logo Reveal": "Centered focus, symmetrical framing, reveal-friendly camera path.",
    "Event Promo": "High energy, crowd-friendly angles, dynamic pacing.",
    "Recruitment": "Professional tone, workplace authenticity, aspirational framing.",
    "Podcast Visuals": "Static-friendly, face-focused, minimal background distraction."
  };
  
  if (useCase && useModifiers[useCase]) {
    subjectPrompt += " " + useModifiers[useCase];
  }
  
  return subjectPrompt + " 4K resolution, professional color grading.";
};

// Organized USES by category - one color per category
const USES_CATEGORIES = {
  "Commercial": {
    items: ["Product Showcase", "Brand Ad", "Spec Ad", "Logo Reveal"],
    color: "#8B5CF6" // Purple
  },
  "Social": {
    items: ["Short-form", "Social Media", "Event Promo", "Recruitment"],
    color: "#F59E0B" // Amber
  },
  "Story": {
    items: ["Storytelling", "Short Film", "Documentary", "Visual Essay"],
    color: "#3B82F6" // Blue
  },
  "Learn": {
    items: ["Education", "Explainer", "Podcast Visuals"],
    color: "#10B981" // Emerald
  }
};

// Flatten for rendering
const USES = Object.values(USES_CATEGORIES).flatMap(cat => cat.items);
const USE_COLORS = {};
Object.entries(USES_CATEGORIES).forEach(([category, data]) => {
  data.items.forEach(item => {
    USE_COLORS[item] = data.color;
  });
});

// Usage tracking helpers
const USAGE_SCHEMA_VERSION = 3;
const FREE_USAGE_KEY = 'cwfFreeUsageTotal';
const FREE_TOTAL_LIMIT = 5;

const getUsageData = () => {
  const data = localStorage.getItem(FREE_USAGE_KEY);
  const defaultData = { count: 0, lastReset: new Date().toISOString(), schemaVersion: USAGE_SCHEMA_VERSION };
  if (!data) return defaultData;
  try {
    const parsed = JSON.parse(data);
    if (!parsed || parsed.schemaVersion !== USAGE_SCHEMA_VERSION) {
      return defaultData;
    }
    return {
      ...defaultData,
      ...parsed,
      count: Number.isFinite(parsed.count) ? parsed.count : 0
    };
  } catch {
    return defaultData;
  }
};

const saveUsageData = (data) => {
  localStorage.setItem(FREE_USAGE_KEY, JSON.stringify({ ...data, schemaVersion: USAGE_SCHEMA_VERSION }));
};

const shouldResetMonthly = (lastReset) => {
  const last = new Date(lastReset);
  const now = new Date();
  return last.getMonth() !== now.getMonth() || last.getFullYear() !== now.getFullYear();
};

const INTERPRETATIONS = [
  { key: 'directors-cut', label: "Director's Cut", icon: Film, color: '#8B5CF6' },
  { key: 'luxury-commercial', label: 'Luxury Commercial', icon: Sparkles, color: '#0EA5E9' },
  { key: 'vfx-spectacle', label: 'VFX Spectacle', icon: Zap, color: '#10B981' },
  { key: 'prestige-animation', label: 'Prestige Animation', icon: Palette, color: '#F59E0B' }
];

const PRO_DETAILS = [
  { key: 'camera', label: '+ Camera Movement', desc: 'gimbal tracking, handheld, dolly zoom' },
  { key: 'lens', label: '+ Lens Type', desc: '24mm wide, 50mm portrait, 85mm telephoto' },
  { key: 'depth', label: '+ Depth of Field', desc: 'shallow bokeh, deep focus, f/1.4-f/22' },
  { key: 'lighting', label: '+ Lighting Setup', desc: 'key light, rim light, softbox, golden hour' }
];

const PRO_DETAIL_TEXT = {
  camera: ' Smooth gimbal tracking shot.',
  lens: ' Shot on 50mm lens, shallow depth of field.',
  depth: ' f/2.8 aperture, creamy bokeh background.',
  lighting: ' Three-point lighting with soft key light.'
};

const AUDIO_KEYWORDS_REGEX = /\b(audio|sound|sfx|music|foley|ambien|voiceover|soundscape|dialogue)\b/i;
const IMAGE_KEYWORDS_REGEX = /\b(image|still|frame|composition|framing|palette|texture|detail pass|render)\b/i;

const buildAudioSfxDetails = (mood, useCase, skillLevel = 'beginner') => {
  const moodSfx = {
    Epic: 'deep cinematic hits and rising orchestral swells',
    Dramatic: 'low tense pulses with restrained room tone',
    Whimsical: 'light playful motifs with soft foley accents',
    Serene: 'gentle ambient bed with subtle natural textures',
    Mysterious: 'subtle drones and distant textured ambience',
    Energetic: 'tight percussive rhythm with punchy transitions',
    Eerie: 'minimal unsettling drones and sparse eerie foley'
  };

  const useSfx = {
    'Product Showcase': 'clean polished foley for material details',
    'Brand Ad': 'premium branded sonic texture',
    Storytelling: 'emotion-led ambience matched to scene beats',
    Documentary: 'natural location ambience and grounded foley',
    Explainer: 'clean minimal background audio with clear focus',
    'Social Media': 'short punchy sound accents for hooks'
  };

  const moodLayer = moodSfx[mood] || 'subtle cinematic ambience';
  const useLayer = useSfx[useCase] || 'realistic environmental foley';

  if (skillLevel === 'pro') {
    return `Audio design: ${moodLayer}, ${useLayer}, balanced mix with controlled dynamics.`;
  }

  return `Audio/SFX: ${moodLayer} with ${useLayer}.`;
};

const applyAudioPreference = (prompt, includeAudioSfx, mood, useCase, skillLevel) => {
  const normalizedPrompt = (prompt || '').trim();
  if (!normalizedPrompt) return normalizedPrompt;

  if (includeAudioSfx) {
    if (AUDIO_KEYWORDS_REGEX.test(normalizedPrompt)) return normalizedPrompt;
    return `${normalizedPrompt} ${buildAudioSfxDetails(mood, useCase, skillLevel)}`.trim();
  }

  const cleaned = normalizedPrompt
    .split(/(?<=[.!?])\s+/)
    .filter((line) => !AUDIO_KEYWORDS_REGEX.test(line))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned || normalizedPrompt;
};

const buildImageDetails = (mood, useCase, skillLevel = 'beginner') => {
  const moodVisual = {
    Epic: 'hero composition with dramatic scale and layered depth',
    Dramatic: 'high-contrast framing with intentional negative space',
    Whimsical: 'playful color palette with stylized texture accents',
    Serene: 'balanced composition with soft gradients and calm spacing',
    Mysterious: 'low-key framing with silhouette-led depth separation',
    Energetic: 'dynamic diagonals with punchy color contrast',
    Eerie: 'off-center framing with unsettling tonal control'
  };

  const useVisual = {
    'Product Showcase': 'clean product hero framing with material realism',
    'Brand Ad': 'premium ad-grade composition with polished highlights',
    Storytelling: 'cinematic scene composition with clear focal hierarchy',
    Documentary: 'naturalistic framing and grounded visual texture',
    Explainer: 'clear educational framing with readable visual priority',
    'Social Media': 'scroll-stopping composition with strong subject isolation'
  };

  const moodLayer = moodVisual[mood] || 'intentional composition and clean visual hierarchy';
  const useLayer = useVisual[useCase] || 'balanced composition for versatile generation';

  if (skillLevel === 'pro') {
    return `Image details: ${moodLayer}, ${useLayer}, controlled color palette and texture fidelity.`;
  }

  return `Image details: ${moodLayer} with ${useLayer}.`;
};

const applyImagePreference = (prompt, includeImageDetails, mood, useCase, skillLevel) => {
  const normalizedPrompt = (prompt || '').trim();
  if (!normalizedPrompt) return normalizedPrompt;

  if (includeImageDetails) {
    if (IMAGE_KEYWORDS_REGEX.test(normalizedPrompt)) return normalizedPrompt;
    return `${normalizedPrompt} ${buildImageDetails(mood, useCase, skillLevel)}`.trim();
  }

  const cleaned = normalizedPrompt
    .split(/(?<=[.!?])\s+/)
    .filter((line) => !/^Image details:/i.test(line.trim()))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return cleaned || normalizedPrompt;
};

const applySelectedProDetails = (prompt, detailKeys) => {
  const base = (prompt || '').trim();
  if (!base) return base;
  if (!Array.isArray(detailKeys) || detailKeys.length === 0) return base;
  return detailKeys.reduce((current, key) => `${current}${PRO_DETAIL_TEXT[key] || ''}`, base).trim();
};

const buildFramePrompt = (prompt) => {
  const raw = String(prompt || '').trim();
  if (!raw) return '';
  return raw
    .split(/(?<=[.!?])\s+/)
    .filter((line) => !/^Audio\/SFX:/i.test(line.trim()))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim();
};

const createGroupId = () => (
  globalThis.crypto?.randomUUID?.() || `cwf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
);

const EMPTY_SAVE_STATUS = { video: 'idle', start_frame: 'idle', end_frame: 'idle', motion_prompt: 'idle' };

export default function PromptEnhancer({ onAuthClick }) {
  const [idea, setIdea] = useState("");
  const [mood, setMood] = useState("");
  const [useCase, setUseCase] = useState("");
  const [skillLevel, setSkillLevel] = useState('beginner'); // 'beginner' | 'pro'
  const [loading, setLoading] = useState(false);
  const [loadingMode, setLoadingMode] = useState('');
  const [baseResult, setBaseResult] = useState(null);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [usage, setUsage] = useState({ count: 0, lastReset: new Date().toISOString() });
  const [addedDetails, setAddedDetails] = useState([]);
  const [includeAudioSfx, setIncludeAudioSfx] = useState(false);
  const [includeImageDetails, setIncludeImageDetails] = useState(false);
  const lastParamsRef = useRef({ idea: "", mood: "", useCase: "", skillLevel: "beginner", includeAudioSfx: false, includeImageDetails: false });
  const levelPulseTimeoutRef = useRef(null);
  const [levelPulse, setLevelPulse] = useState('');
  const [saveStatus, setSaveStatus] = useState(EMPTY_SAVE_STATUS);
  const [saveError, setSaveError] = useState('');
  const [generationError, setGenerationError] = useState('');
  const [outputMode, setOutputMode] = useState('standard');
  const [startFramePrompt, setStartFramePrompt] = useState('');
  const [endFrameDirection, setEndFrameDirection] = useState('');
  const [motionDirection, setMotionDirection] = useState('');
  const [endFramePrompt, setEndFramePrompt] = useState('');
  const [motionPrompt, setMotionPrompt] = useState('');
  const [currentGroupId, setCurrentGroupId] = useState('');
  const [copiedSection, setCopiedSection] = useState('');
  const requestIdRef = useRef(0);
  
  const { user, session, isPro } = useAuth();
  const hasForcedProAccess = FORCE_PRO_EMAILS.has(String(user?.email || '').trim().toLowerCase());
  const canUsePro = isPro || hasForcedProAccess;

  const [themeMode, setThemeMode] = useState(() => {
    try {
      return document.documentElement.getAttribute('data-theme') || 'light'
    } catch {
      return 'light'
    }
  })

  useEffect(() => {
    const el = document.documentElement
    if (!el) return
    const observer = new MutationObserver(() => {
      setThemeMode(el.getAttribute('data-theme') || 'light')
    })
    observer.observe(el, { attributes: true, attributeFilter: ['data-theme'] })
    return () => observer.disconnect()
  }, [])

  const isDarkTheme = themeMode === 'dark'

  // Load usage on mount
  useEffect(() => {
    const data = getUsageData();
    if (shouldResetMonthly(data.lastReset)) {
      const resetData = { count: 0, lastReset: new Date().toISOString() };
      saveUsageData(resetData);
      setUsage(resetData);
    } else {
      setUsage(data);
    }
  }, [canUsePro]);

  const remainingFree = Math.max(0, FREE_TOTAL_LIMIT - usage.count);
  const isLimitReached = !canUsePro && remainingFree === 0;
  const canSubmit = idea.trim().length > 3 && !loading && !isLimitReached;
  const enhanceButtonLabel = loading
    ? (loadingMode === 'motion'
        ? 'Building Motion...'
        : loadingMode === 'interpretation'
          ? 'Enhancing...'
          : includeImageDetails
            ? 'Building Start Frame...'
            : 'Building Prompt...')
    : 'Enhance';

  const getValidAccessToken = useCallback(async () => {
    if (session?.access_token) return session.access_token;

    const { data: latestAuth } = await supabase.auth.getSession();
    if (latestAuth?.session?.access_token) return latestAuth.session.access_token;

    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (error) return '';
    return refreshed?.session?.access_token || '';
  }, [session]);

  const requestEnhancedPrompt = useCallback(async (payload, accessToken) => {
    const response = await fetch('/.netlify/functions/enhance-prompt', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data?.error || `Enhancer failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return data;
  }, []);

  const handleEnhance = useCallback(async (isAutoUpdate = false, interpretationStyle = null) => {
    if (!canSubmit && !interpretationStyle) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setLoadingMode(interpretationStyle ? 'interpretation' : 'enhance');
    setCopied(false);
    setGenerationError('');

    try {
      const promptPayload = interpretationStyle 
        ? { idea, mood, useCase, interpretation: interpretationStyle, skillLevel, includeAudioSfx, includeImages: includeImageDetails }
        : { idea, mood, useCase, skillLevel, includeAudioSfx, includeImages: includeImageDetails };

      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        onAuthClick?.()
        setLoading(false);
        setLoadingMode('');
        return;
      }

      let data;
      try {
        data = await requestEnhancedPrompt(promptPayload, accessToken);
      } catch (err) {
        const shouldRetryAuth = err?.status === 401 || /invalid session/i.test(String(err?.message || ''));
        if (!shouldRetryAuth) throw err;

        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        const refreshedToken = refreshed?.session?.access_token;
        if (refreshError || !refreshedToken) {
          throw new Error('Session expired. Please sign in again.');
        }
        data = await requestEnhancedPrompt(promptPayload, refreshedToken);
      }

      if (!canUsePro && !interpretationStyle && !isAutoUpdate) {
        const nextUsage = { ...usage, count: usage.count + 1 };
        saveUsageData(nextUsage);
        setUsage(nextUsage);
      }

      const enhancedPrompt = data.prompt || generateSmartPrompt(idea, mood, useCase, skillLevel);
      const withAudio = applyAudioPreference(enhancedPrompt, includeAudioSfx, mood, useCase, skillLevel);
      const nextBaseResult = applyImagePreference(withAudio, includeImageDetails, mood, useCase, skillLevel);
      if (requestId !== requestIdRef.current) return;
      const nextResult = applySelectedProDetails(nextBaseResult, addedDetails);
      setBaseResult(nextBaseResult);
      setResult(nextResult);
      if (includeImageDetails) {
        setStartFramePrompt(buildFramePrompt(nextResult));
        setEndFramePrompt('');
        setMotionPrompt('');
        setMotionDirection('');
        setOutputMode('frame');
        setCurrentGroupId('');
      } else {
        setStartFramePrompt('');
        setEndFramePrompt('');
        setMotionPrompt('');
        setOutputMode('standard');
        setCurrentGroupId('');
        setEndFrameDirection('');
        setMotionDirection('');
      }
      setHasGeneratedOnce(true);
      setSaveStatus(EMPTY_SAVE_STATUS);
      setSaveError('');
      setCopiedSection('');
      lastParamsRef.current = { idea, mood, useCase, skillLevel, includeAudioSfx, includeImageDetails };
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setGenerationError(err?.message || 'Unable to generate prompt right now. Please retry.');
    }
    if (requestId === requestIdRef.current) {
      setLoading(false);
      setLoadingMode('');
    }
  }, [canSubmit, idea, mood, useCase, skillLevel, canUsePro, includeAudioSfx, includeImageDetails, addedDetails, getValidAccessToken, onAuthClick, requestEnhancedPrompt, usage]);

  const generateInterpretation = (style) => {
    handleEnhance(false, style);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && canSubmit) {
      handleEnhance(false);
    }
  };

  const handleToggleSkillLevel = () => {
    const nextLevel = skillLevel === 'beginner' ? 'pro' : 'beginner';
    setSkillLevel(nextLevel);
    setLevelPulse(nextLevel);
    if (levelPulseTimeoutRef.current) {
      clearTimeout(levelPulseTimeoutRef.current);
    }
    levelPulseTimeoutRef.current = setTimeout(() => {
      setLevelPulse('');
      levelPulseTimeoutRef.current = null;
    }, 450);
  };

  useEffect(() => {
    if (hasGeneratedOnce && canSubmit) {
      // Only trigger if params actually changed
      const paramsChanged = 
        idea !== lastParamsRef.current.idea ||
        mood !== lastParamsRef.current.mood ||
        useCase !== lastParamsRef.current.useCase ||
        skillLevel !== lastParamsRef.current.skillLevel ||
        includeAudioSfx !== lastParamsRef.current.includeAudioSfx ||
        includeImageDetails !== lastParamsRef.current.includeImageDetails;
      
      if (!paramsChanged) return;
      
      const timeoutId = setTimeout(() => {
        handleEnhance(true); // Pass true for auto-update (keeps result visible)
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [mood, useCase, idea, skillLevel, includeAudioSfx, includeImageDetails, hasGeneratedOnce, canSubmit, handleEnhance]);

  useEffect(() => () => {
    if (levelPulseTimeoutRef.current) {
      clearTimeout(levelPulseTimeoutRef.current);
    }
  }, []);

  useEffect(() => {
    if (!baseResult) return;
    const nextResult = applySelectedProDetails(baseResult, addedDetails);
    setResult(nextResult);
    if (includeImageDetails) {
      setStartFramePrompt(buildFramePrompt(nextResult));
      setEndFramePrompt('');
      setMotionPrompt('');
      setMotionDirection('');
      setOutputMode('frame');
      setCurrentGroupId('');
      setSaveStatus((previous) => ({ ...previous, end_frame: 'idle', motion_prompt: 'idle' }));
    }
  }, [baseResult, addedDetails, includeImageDetails]);

  useEffect(() => {
    if (!includeImageDetails) {
      setStartFramePrompt('');
      setEndFramePrompt('');
      setMotionPrompt('');
      setOutputMode('standard');
      setEndFrameDirection('');
      setMotionDirection('');
      setCurrentGroupId('');
    }
  }, [includeImageDetails]);


  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopySection = (key, text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedSection(key);
    setTimeout(() => setCopiedSection(''), 2000);
  };

  const getMotionGuidanceText = () => {
    if (motionDirection.trim()) {
      return 'We’ll use your motion direction and clean it into a stronger motion prompt.';
    }
    if (endFrameDirection.trim()) {
      return 'We’ll bridge your start frame to the derived end frame.';
    }
    return 'We’ll infer a natural motion path from your start frame.';
  };

  const savePromptVariant = async ({ saveMode, promptText, ideaLabel, variantType, linkedFromVariant = null, framePromptText = null, targetFramePrompt = null }) => {
    if (!user || !promptText) return;
    setSaveStatus((previous) => ({ ...previous, [saveMode]: 'saving' }));
    setSaveError('');
    const groupId = currentGroupId || createGroupId();
    const payload = {
      user_id: user.id,
      idea: ideaLabel,
      prompt: String(promptText || '').trim(),
      mood: mood || null,
      use_case: useCase || null,
      skill_level: skillLevel,
      include_audio_sfx: includeAudioSfx,
      include_image_details: includeImageDetails || variantType !== 'video_prompt',
      metadata: {
        group_id: groupId,
        variant_type: variantType,
        source: 'prompt_enhancer',
        original_idea: idea.trim(),
        frame_prompt: framePromptText ? String(framePromptText).trim() : null,
        end_frame_direction: endFrameDirection.trim() || null,
        target_frame_prompt: targetFramePrompt ? String(targetFramePrompt).trim() : null,
        linked_from_variant: linkedFromVariant,
        added_details: addedDetails,
        save_mode: saveMode,
        frame_role: variantType === 'start_frame' || variantType === 'end_frame' ? variantType : null,
        source_prompt: result.trim()
      }
    };
    const { error } = await supabase.from('saved_prompts').insert(payload);
    if (!error) {
      setCurrentGroupId(groupId);
      setSaveStatus((previous) => ({ ...previous, [saveMode]: 'saved' }));
      return;
    }
    if (error.code === '23505') {
      setSaveStatus((previous) => ({ ...previous, [saveMode]: 'exists' }));
      return;
    }
    setSaveStatus((previous) => ({ ...previous, [saveMode]: 'error' }));
    setSaveError(error.message || 'Unable to save prompt right now.');
  };

  const handleGenerateMotionPrompt = async () => {
    if (!startFramePrompt) return;
    const requestId = ++requestIdRef.current;
    setLoading(true);
    setLoadingMode('motion');
    setGenerationError('');
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        onAuthClick?.();
        setLoading(false);
        return;
      }

      let data;
      try {
        data = await requestEnhancedPrompt({
          mode: 'frame_to_motion',
          idea,
          framePrompt: startFramePrompt,
          endFrameDirection,
          motionDirection,
          mood,
          useCase,
          skillLevel
        }, accessToken);
      } catch (err) {
        const shouldRetryAuth = err?.status === 401 || /invalid session/i.test(String(err?.message || ''));
        if (!shouldRetryAuth) throw err;
        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession();
        const refreshedToken = refreshed?.session?.access_token;
        if (refreshError || !refreshedToken) {
          throw new Error('Session expired. Please sign in again.');
        }
        data = await requestEnhancedPrompt({
          mode: 'frame_to_motion',
          idea,
          framePrompt: startFramePrompt,
          endFrameDirection,
          motionDirection,
          mood,
          useCase,
          skillLevel
        }, refreshedToken);
      }

      if (requestId !== requestIdRef.current) return;
      if (!canUsePro) {
        const nextUsage = { ...usage, count: usage.count + 1 };
        saveUsageData(nextUsage);
        setUsage(nextUsage);
      }
      setStartFramePrompt(data.startFramePrompt || startFramePrompt);
      setEndFramePrompt(data.endFramePrompt || '');
      setMotionPrompt(data.motionPrompt || '');
      setOutputMode('frame_plus_motion');
      setSaveStatus((previous) => ({ ...previous, end_frame: 'idle', motion_prompt: 'idle' }));
    } catch (err) {
      if (requestId !== requestIdRef.current) return;
      setGenerationError(err?.message || 'Unable to generate motion prompt right now.');
    }
    if (requestId === requestIdRef.current) {
      setLoading(false);
      setLoadingMode('');
    }
  };

  const Chip = ({ label, selected, onClick, color }) => (
    <button
      onClick={onClick}
      className="px-3 py-1.5 rounded-full text-xs font-semibold transition-all whitespace-nowrap"
      style={{
        background: selected 
          ? `linear-gradient(145deg, ${color}, ${color}DD)` 
          : 'var(--bg-primary)',
        border: `2px solid ${selected ? color + '50' : 'var(--border-color)'}`,
        color: selected ? '#fff' : 'var(--text-secondary)',
        boxShadow: selected 
          ? `inset 3px 3px 6px ${color}60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px ${color}40`
          : 'var(--control-soft-shadow)',
        transform: selected ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
      }}
    >
      {label}
    </button>
  );

  return (
    <section 
      id="prompt-enhancer"
      className="pt-16 pb-12 transition-colors relative overflow-hidden"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Compact Header */}
        <div className="text-center mb-6">
          <div 
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider mb-3"
            style={{ 
              background: 'var(--accent-blue)15',
              border: '1px solid var(--accent-blue)30',
              color: 'var(--accent-blue)'
            }}
          >
            <Sparkles className="h-3 w-3" />
            AI PROMPT ENHANCER
          </div>
          <h2 
            className="text-2xl md:text-3xl font-bold"
            style={{ color: 'var(--text-primary)' }}
          >
            Describe the shot in your head. <span style={{ color: 'var(--accent-blue)' }}>We'll translate it for the machine.</span>
          </h2>
          
          {/* Usage Counter for Free Users */}
          {!canUsePro && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ 
                background: remainingFree <= 1 ? 'var(--accent-red)15' : 'var(--bg-card)',
                border: `1px solid ${remainingFree <= 1 ? 'var(--accent-red)30' : 'var(--border-color)'}`,
                color: remainingFree <= 1 ? 'var(--accent-red)' : 'var(--text-muted)'
              }}
            >
              <Zap className="h-3 w-3" />
              {remainingFree > 0 ? (
                <span>{remainingFree} free generations left this month across Enhancer + Shot to Prompt</span>
              ) : (
                <span>
                  {!user ? 'Sign in to continue' : 'Free limit reached — '}
                  <button 
                    onClick={() => (user ? window.location.assign('/pricing') : onAuthClick?.())}
                    style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
                  >
                    {!user ? 'Sign in' : 'Upgrade to Pro'}
                  </button>
                </span>
              )}
            </div>
          )}
          
          {/* Pro Badge */}
          {canUsePro && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ 
                background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
                color: '#fff'
              }}
            >
              <Zap className="h-3 w-3" />
              <span>Pro — Unlimited prompts + Interpretations</span>
            </div>
          )}
        </div>
        {generationError && (
          <div className="text-center mb-3">
            <p className="text-sm" style={{ color: 'var(--accent-red)' }}>
              {generationError}
            </p>
          </div>
        )}

        {/* Wide Compact Card */}
        <div 
          className="neu-card p-5 rounded-2xl"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)'
          }}
        >
          {/* Main Input Row */}
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            {/* Idea Input - Takes more space */}
            <div className="flex-1">
              <input
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="e.g. a car driving through a neon-lit city at night..."
                className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Enhance Button - Orange Neumorphic Main Button */}
            <button
              onClick={() => handleEnhance(false)}
              disabled={loading || !canSubmit}
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{
                background: loading || canSubmit
                  ? 'linear-gradient(145deg, #FF6B35, #FF6B35DD)' 
                  : 'linear-gradient(145deg, #E5E7EB, #D1D5DB)',
                color: loading || canSubmit ? '#fff' : '#4B5563',
                cursor: loading ? 'progress' : (canSubmit ? 'pointer' : 'not-allowed'),
                border: `2px solid ${loading || canSubmit ? '#FF6B3550' : 'var(--border-color)'}`,
                boxShadow: loading || canSubmit
                  ? 'inset 3px 3px 6px rgba(255,107,53,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(255,107,53,0.4)'
                  : 'inset 3px 3px 6px rgba(107,114,128,0.18), inset -3px -3px 6px rgba(255,255,255,0.72), 0 4px 12px rgba(107,114,128,0.18)',
                transform: loading ? 'translateY(1px) scale(0.985)' : 'translateY(0) scale(1)',
                opacity: 1
              }}
              onMouseDown={(e) => {
                if (loading || canSubmit) {
                  e.currentTarget.style.transform = 'translateY(2px) scale(0.96)';
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(255,107,53,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(255,107,53,0.3)';
                } else {
                  e.currentTarget.style.transform = 'translateY(2px) scale(0.97)';
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(107,114,128,0.24), inset -3px -3px 6px rgba(255,255,255,0.72), 0 2px 6px rgba(107,114,128,0.18)';
                }
              }}
              onMouseUp={(e) => {
                if (canSubmit) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(255,107,53,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(255,107,53,0.4)';
                } else {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(107,114,128,0.18), inset -3px -3px 6px rgba(255,255,255,0.72), 0 4px 12px rgba(107,114,128,0.18)';
                }
              }}
              onMouseLeave={(e) => {
                if (canSubmit) {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(255,107,53,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(255,107,53,0.4)';
                } else {
                  e.currentTarget.style.transform = 'translateY(0) scale(1)';
                  e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(107,114,128,0.18), inset -3px -3px 6px rgba(255,255,255,0.72), 0 4px 12px rgba(107,114,128,0.18)';
                }
              }}
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  {enhanceButtonLabel}
                </>
              ) : (
                <><Wand2 className="h-4 w-4" /> {enhanceButtonLabel}</>
              )}
            </button>
          </div>

          {/* Options - Stacked for better chip wrapping */}
          <div className="space-y-3 text-sm">
            {/* Skill Level Toggle */}
            <div className="pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }} className="text-xs font-medium flex-shrink-0 min-w-[40px]">Level</span>
              <div className="mt-2 flex flex-col gap-3">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold transition-all"
                  style={{
                    color: skillLevel === 'beginner' ? '#3B82F6' : 'var(--text-muted)',
                    textShadow: !isDarkTheme && levelPulse === 'beginner' ? '0 0 10px rgba(59,130,246,0.65)' : 'none'
                  }}
                >
                  Beginner
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={skillLevel === 'pro'}
                  aria-label="Toggle prompt level"
                  onClick={handleToggleSkillLevel}
                  className="relative w-[68px] h-[34px] rounded-full transition-all duration-250"
                  style={{
                    background: skillLevel === 'pro'
                      ? 'linear-gradient(145deg, #A855F7, #7C3AED)'
                      : 'linear-gradient(145deg, #60A5FA, #2563EB)',
                    border: `2px solid ${skillLevel === 'pro' ? '#A855F750' : '#60A5FA50'}`,
                    boxShadow: skillLevel === 'pro'
                      ? `inset 3px 3px 6px rgba(124,58,237,0.55), inset -3px -3px 6px rgba(255,255,255,0.25), 0 6px 16px rgba(124,58,237,0.35)${!isDarkTheme && levelPulse === 'pro' ? ', 0 0 16px rgba(168,85,247,0.55)' : ''}`
                      : `inset 3px 3px 6px rgba(37,99,235,0.5), inset -3px -3px 6px rgba(255,255,255,0.25), 0 6px 16px rgba(37,99,235,0.35)${!isDarkTheme && levelPulse === 'beginner' ? ', 0 0 16px rgba(96,165,250,0.55)' : ''}`
                  }}
                  onMouseDown={(e) => {
                    e.currentTarget.style.transform = 'translateY(2px) scale(0.97)'
                  }}
                  onMouseUp={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)'
                  }}
                >
                  <span
                    className="absolute top-[3px] h-[24px] w-[24px] rounded-full transition-all duration-250"
                    style={{
                      left: skillLevel === 'pro' ? '38px' : '4px',
                      background: 'var(--toggle-knob-bg)',
                      boxShadow: 'var(--toggle-knob-shadow)'
                    }}
                  />
                </button>
                <span
                  className="text-xs font-semibold transition-all"
                  style={{
                    color: skillLevel === 'pro' ? '#7C3AED' : 'var(--text-muted)',
                    textShadow: !isDarkTheme && levelPulse === 'pro' ? '0 0 10px rgba(124,58,237,0.65)' : 'none'
                  }}
                >
                  Pro
                </span>
                <span
                  className="text-[11px] px-2 py-1 rounded-full font-semibold"
                  style={{
                    background: 'var(--bg-primary)',
                    color: 'var(--text-muted)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  camera + lens
                </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-nowrap min-w-0">
                  <span
                    className="text-xs font-semibold transition-all"
                    style={{ color: includeImageDetails ? 'var(--text-muted)' : '#6B7280' }}
                  >
                    Images Off
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={includeImageDetails}
                    aria-label="Toggle image details"
                    onClick={() => setIncludeImageDetails((prev) => !prev)}
                    className="relative w-[62px] h-[32px] rounded-full transition-all duration-250"
                    style={{
                      background: includeImageDetails
                        ? 'linear-gradient(145deg, #22C55E, #16A34A)'
                        : 'var(--toggle-off-bg)',
                      border: `2px solid ${includeImageDetails ? '#22C55E50' : 'var(--toggle-off-border)'}`,
                      boxShadow: includeImageDetails
                        ? 'inset 3px 3px 6px rgba(22,163,74,0.55), inset -3px -3px 6px rgba(255,255,255,0.25), 0 6px 16px rgba(34,197,94,0.35)'
                        : 'var(--toggle-off-shadow)'
                    }}
                  >
                    <span
                      className="absolute top-[3px] h-[22px] w-[22px] rounded-full transition-all duration-250"
                      style={{
                        left: includeImageDetails ? '35px' : '4px',
                        background: 'var(--toggle-knob-bg)',
                        boxShadow: 'var(--toggle-knob-shadow)'
                      }}
                    />
                  </button>
                  <span
                    className="text-xs font-semibold transition-all"
                    style={{ color: includeImageDetails ? '#16A34A' : 'var(--text-muted)' }}
                  >
                    On
                  </span>
                  <span
                    className="text-[11px] px-2 py-1 rounded-full font-semibold"
                    style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    create a START FRAME
                  </span>
                </div>

                {includeImageDetails && (
                  <div className="pl-0 sm:pl-[43px]">
                    <span className="text-xs block" style={{ color: 'var(--text-muted)' }}>
                      Create your shot’s start frame. Optionally define how it ends, then generate motion between them.
                    </span>
                  </div>
                )}
              </div>
              {!includeImageDetails && (
                <span className="text-xs block mt-2" style={{ color: 'var(--text-muted)' }}>
                  {skillLevel === 'beginner' ? 'Simple language, optional add-ons' : 'Full technical specifications'}
                </span>
              )}
            </div>

            {/* SFX Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }} className="text-xs font-medium flex-shrink-0 min-w-[40px]">SFX</span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold transition-all"
                  style={{ color: includeAudioSfx ? 'var(--text-muted)' : '#6B7280' }}
                >
                  Off
                </span>
                <button
                  type="button"
                  role="switch"
                  aria-checked={includeAudioSfx}
                  aria-label="Toggle audio and sfx details"
                  onClick={() => setIncludeAudioSfx((prev) => !prev)}
                  className="relative w-[62px] h-[32px] rounded-full transition-all duration-250"
                  style={{
                    background: includeAudioSfx
                      ? 'linear-gradient(145deg, #F97316, #EA580C)'
                      : 'var(--toggle-off-bg)',
                    border: `2px solid ${includeAudioSfx ? '#F9731650' : 'var(--toggle-off-border)'}`,
                    boxShadow: includeAudioSfx
                      ? 'inset 3px 3px 6px rgba(194,65,12,0.55), inset -3px -3px 6px rgba(255,255,255,0.25), 0 6px 16px rgba(249,115,22,0.35)'
                      : 'var(--toggle-off-shadow)'
                  }}
                >
                  <span
                    className="absolute top-[3px] h-[22px] w-[22px] rounded-full transition-all duration-250"
                    style={{
                      left: includeAudioSfx ? '35px' : '4px',
                      background: 'var(--toggle-knob-bg)',
                      boxShadow: 'var(--toggle-knob-shadow)'
                    }}
                  />
                </button>
                <span
                  className="text-xs font-semibold transition-all"
                  style={{ color: includeAudioSfx ? '#EA580C' : 'var(--text-muted)' }}
                >
                  On
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {includeAudioSfx ? 'Include sound effects cues in output' : 'Output stays visual-only'}
              </span>
            </div>

            {/* Mood */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs font-medium flex-shrink-0 pt-1.5 min-w-[40px]">Mood</span>
              <div className="flex flex-wrap gap-1.5">
                {MOODS.map(m => (
                  <Chip
                    key={m}
                    label={m}
                    selected={mood === m}
                    onClick={() => setMood(mood === m ? '' : m)}
                    color={MOOD_COLORS[m]}
                  />
                ))}
              </div>
            </div>

            {/* Use Case - Same style as Mood buttons */}
            <div className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-3">
              <span style={{ color: 'var(--text-muted)' }} className="text-xs font-medium flex-shrink-0 pt-1.5 min-w-[40px]">Use</span>
              <div className="flex flex-wrap gap-1.5">
                {USES.map(u => (
                  <Chip
                    key={u}
                    label={u}
                    selected={useCase === u}
                    onClick={() => setUseCase(useCase === u ? '' : u)}
                    color={USE_COLORS[u]}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Removed Tool-specific info */}

        </div>

        {/* Result - Copyable Text Field */}
        {(result || startFramePrompt) && (
          <div 
            className="neu-card mt-6 p-5 rounded-2xl"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--accent-green)40'
            }}
          >
            {outputMode === 'standard' && (
              <>
                <div className="flex items-center justify-between mb-3 gap-3">
                  <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--accent-green)' }}>
                    <Check className="h-4 w-4" />
                    YOUR PROMPT
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {user && (
                      <button
                        onClick={() => savePromptVariant({
                          saveMode: 'video',
                          promptText: result.trim(),
                          ideaLabel: idea.trim() || 'Prompt',
                          variantType: 'video_prompt'
                        })}
                        disabled={saveStatus.video === 'saving'}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{
                          background: saveStatus.video === 'saved' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                          color: saveStatus.video === 'saved' ? '#fff' : 'var(--text-secondary)',
                          border: `2px solid ${saveStatus.video === 'saved' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                          boxShadow: saveStatus.video === 'saved' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                        }}
                      >
                        {saveStatus.video === 'saving' ? 'Saving...' : saveStatus.video === 'saved' ? 'Saved' : saveStatus.video === 'exists' ? 'Already Saved' : 'Save Prompt'}
                      </button>
                    )}
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{
                        background: copied ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                        color: copied ? '#fff' : 'var(--text-secondary)',
                        border: `2px solid ${copied ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                        boxShadow: copied ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)',
                        transform: copied ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
                      }}
                    >
                      {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                      {copied ? 'Copied!' : 'Copy Prompt'}
                    </button>
                  </div>
                </div>
                <div
                  className="w-full p-4 rounded-xl text-base leading-relaxed cursor-text select-all"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    minHeight: '100px'
                  }}
                  onClick={(e) => {
                    const range = document.createRange();
                    range.selectNodeContents(e.currentTarget);
                    const sel = window.getSelection();
                    sel.removeAllRanges();
                    sel.addRange(range);
                  }}
                >
                  {result}
                </div>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Click text to select all, or use the Copy button
                </p>
              </>
            )}

            {outputMode !== 'standard' && startFramePrompt && (
              <div className="space-y-4">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="text-xs font-bold flex items-center gap-1.5" style={{ color: 'var(--accent-green)' }}>
                    <Check className="h-4 w-4" />
                    FRAME-FIRST WORKFLOW
                  </div>
                  <div className="flex items-center gap-2 flex-wrap justify-end">
                    {user && (
                      <button
                        onClick={() => savePromptVariant({
                          saveMode: 'start_frame',
                          promptText: startFramePrompt,
                          ideaLabel: `${idea.trim() || 'Prompt'} — Start Frame`,
                          variantType: 'start_frame',
                          framePromptText: startFramePrompt
                        })}
                        disabled={saveStatus.start_frame === 'saving'}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                        style={{
                          background: saveStatus.start_frame === 'saved' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                          color: saveStatus.start_frame === 'saved' ? '#fff' : 'var(--text-secondary)',
                          border: `2px solid ${saveStatus.start_frame === 'saved' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                          boxShadow: saveStatus.start_frame === 'saved' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                        }}
                      >
                        {saveStatus.start_frame === 'saving' ? 'Saving...' : saveStatus.start_frame === 'saved' ? 'Saved as Start Frame' : saveStatus.start_frame === 'exists' ? 'Start Frame Saved' : 'Save as Start Frame'}
                      </button>
                    )}
                    <button
                      onClick={() => handleCopySection('start_frame', startFramePrompt)}
                      className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                      style={{
                        background: copiedSection === 'start_frame' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                        color: copiedSection === 'start_frame' ? '#fff' : 'var(--text-secondary)',
                        border: `2px solid ${copiedSection === 'start_frame' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                        boxShadow: copiedSection === 'start_frame' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                      }}
                    >
                      {copiedSection === 'start_frame' ? 'Copied!' : 'Copy Start Frame'}
                    </button>
                  </div>
                </div>

                <div className="rounded-xl p-4 text-base leading-relaxed" style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                  <div className="text-xs font-bold mb-2" style={{ color: 'var(--accent-blue)' }}>START FRAME PROMPT</div>
                  {startFramePrompt}
                </div>

                <div className="rounded-xl p-4" style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)' }}>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Optional end frame
                  </label>
                  <input
                    value={endFrameDirection}
                    onChange={(event) => {
                      setEndFrameDirection(event.target.value);
                      setEndFramePrompt('');
                      setMotionPrompt('');
                      setOutputMode('frame');
                      setSaveStatus((previous) => ({ ...previous, end_frame: 'idle', motion_prompt: 'idle' }));
                    }}
                    placeholder="camera ends tighter on her face"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '2px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Describe how the shot should end. Keep the same scene, subject, and style — only describe what changes.
                  </p>
                </div>

                <div className="rounded-xl p-4" style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)' }}>
                  <label className="block text-xs font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                    Optional motion direction
                  </label>
                  <input
                    value={motionDirection}
                    onChange={(event) => {
                      setMotionDirection(event.target.value);
                      setMotionPrompt('');
                      setSaveStatus((previous) => ({ ...previous, motion_prompt: 'idle' }));
                    }}
                    placeholder="slow push in as she turns toward camera"
                    className="w-full px-4 py-3 rounded-xl outline-none transition-all"
                    style={{
                      background: 'var(--bg-secondary)',
                      border: '2px solid var(--border-color)',
                      color: 'var(--text-primary)'
                    }}
                  />
                  <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                    Describe the movement in your own words. We’ll convert it into a cleaner motion prompt.
                  </p>
                </div>

                <div className="flex items-center gap-2 flex-wrap">
                  <button
                    onClick={handleGenerateMotionPrompt}
                    disabled={loading}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                    style={{
                      background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)',
                      color: '#fff',
                      border: '2px solid #8B5CF650',
                      boxShadow: 'inset 3px 3px 6px rgba(124,58,237,0.55), inset -3px -3px 6px rgba(255,255,255,0.2), 0 4px 12px rgba(124,58,237,0.3)'
                    }}
                  >
                    {loading ? 'Generating...' : motionPrompt ? 'Regenerate Motion Prompt' : 'Generate Motion Prompt'}
                  </button>
                  <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                    {getMotionGuidanceText()}
                  </span>
                </div>

                {endFramePrompt && (
                  <div className="rounded-xl p-4 text-base leading-relaxed" style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <div className="text-xs font-bold" style={{ color: '#F59E0B' }}>END FRAME PROMPT</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {user && (
                          <button
                            onClick={() => savePromptVariant({
                              saveMode: 'end_frame',
                              promptText: endFramePrompt,
                              ideaLabel: `${idea.trim() || 'Prompt'} — End Frame`,
                              variantType: 'end_frame',
                              linkedFromVariant: 'start_frame',
                              framePromptText: startFramePrompt,
                              targetFramePrompt: endFramePrompt
                            })}
                            disabled={saveStatus.end_frame === 'saving'}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                              background: saveStatus.end_frame === 'saved' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                              color: saveStatus.end_frame === 'saved' ? '#fff' : 'var(--text-secondary)',
                              border: `2px solid ${saveStatus.end_frame === 'saved' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                              boxShadow: saveStatus.end_frame === 'saved' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                            }}
                          >
                            {saveStatus.end_frame === 'saving' ? 'Saving...' : saveStatus.end_frame === 'saved' ? 'Saved as End Frame' : saveStatus.end_frame === 'exists' ? 'End Frame Saved' : 'Save as End Frame'}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopySection('end_frame', endFramePrompt)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                          style={{
                            background: copiedSection === 'end_frame' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                            color: copiedSection === 'end_frame' ? '#fff' : 'var(--text-secondary)',
                            border: `2px solid ${copiedSection === 'end_frame' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                            boxShadow: copiedSection === 'end_frame' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                          }}
                        >
                          {copiedSection === 'end_frame' ? 'Copied!' : 'Copy End Frame'}
                        </button>
                      </div>
                    </div>
                    {endFramePrompt}
                  </div>
                )}

                {motionPrompt && (
                  <div className="rounded-xl p-4 text-base leading-relaxed" style={{ background: 'var(--bg-primary)', border: '2px solid var(--border-color)', color: 'var(--text-primary)', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' }}>
                    <div className="flex items-center justify-between gap-3 mb-2 flex-wrap">
                      <div className="text-xs font-bold" style={{ color: '#A855F7' }}>MOTION PROMPT</div>
                      <div className="flex items-center gap-2 flex-wrap">
                        {user && (
                          <button
                            onClick={() => savePromptVariant({
                              saveMode: 'motion_prompt',
                              promptText: motionPrompt,
                              ideaLabel: `${idea.trim() || 'Prompt'} — Motion Prompt`,
                              variantType: 'motion_prompt',
                              framePromptText: startFramePrompt,
                              targetFramePrompt: endFramePrompt || null
                            })}
                            disabled={saveStatus.motion_prompt === 'saving'}
                            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                            style={{
                              background: saveStatus.motion_prompt === 'saved' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                              color: saveStatus.motion_prompt === 'saved' ? '#fff' : 'var(--text-secondary)',
                              border: `2px solid ${saveStatus.motion_prompt === 'saved' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                              boxShadow: saveStatus.motion_prompt === 'saved' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                            }}
                          >
                            {saveStatus.motion_prompt === 'saving' ? 'Saving...' : saveStatus.motion_prompt === 'saved' ? 'Saved Motion Prompt' : saveStatus.motion_prompt === 'exists' ? 'Motion Prompt Saved' : 'Save Motion Prompt'}
                          </button>
                        )}
                        <button
                          onClick={() => handleCopySection('motion_prompt', motionPrompt)}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                          style={{
                            background: copiedSection === 'motion_prompt' ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' : 'var(--bg-card)',
                            color: copiedSection === 'motion_prompt' ? '#fff' : 'var(--text-secondary)',
                            border: `2px solid ${copiedSection === 'motion_prompt' ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                            boxShadow: copiedSection === 'motion_prompt' ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40' : 'var(--control-soft-shadow)'
                          }}
                        >
                          {copiedSection === 'motion_prompt' ? 'Copied!' : 'Copy Motion Prompt'}
                        </button>
                      </div>
                    </div>
                    {motionPrompt}
                  </div>
                )}
              </div>
            )}

            {(saveStatus.video === 'error' || saveStatus.start_frame === 'error' || saveStatus.end_frame === 'error' || saveStatus.motion_prompt === 'error') && (
              <p className="mt-1 text-xs" style={{ color: 'var(--accent-red)' }}>
                {saveError}
              </p>
            )}
            
            {/* Beginner: Add Pro Details - 3D Neumorphic with Amber accent */}
            {skillLevel === 'beginner' && (
              <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
                <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                  Want more control? Add pro details:
                </p>
                <div className="flex flex-wrap gap-3">
                  {PRO_DETAILS.map((detail) => (
                    <button
                      key={detail.key}
                      onClick={() => {
                        setAddedDetails((previous) => (
                          previous.includes(detail.key)
                            ? previous.filter((key) => key !== detail.key)
                            : [...previous, detail.key]
                        ));
                      }}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        background: addedDetails.includes(detail.key)
                          ? 'linear-gradient(145deg, #F59E0B, #D97706)'
                          : 'linear-gradient(145deg, #FEF3C7, #FDE68A)',
                        border: `2px solid ${addedDetails.includes(detail.key) ? '#D9770650' : '#FCD34D'}`,
                        color: addedDetails.includes(detail.key) ? '#fff' : '#92400E',
                        boxShadow: addedDetails.includes(detail.key)
                          ? 'inset 4px 4px 8px rgba(217,119,6,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(245,158,11,0.4)'
                          : 'var(--control-soft-shadow)',
                        transform: addedDetails.includes(detail.key) ? 'translateY(2px) scale(0.96)' : 'translateY(0) scale(1)',
                        textShadow: addedDetails.includes(detail.key) ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                      }}
                      onMouseDown={(e) => {
                        e.currentTarget.style.transform = 'translateY(3px) scale(0.94)';
                        e.currentTarget.style.boxShadow = 'inset 5px 5px 10px rgba(217,119,6,0.5), inset -3px -3px 6px rgba(255,255,255,0.4), 0 2px 4px rgba(245,158,11,0.3)';
                      }}
                      onMouseUp={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '6px 6px 12px rgba(217,119,6,0.2), -6px -6px 12px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.9)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0) scale(1)';
                        e.currentTarget.style.boxShadow = '6px 6px 12px rgba(217,119,6,0.2), -6px -6px 12px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.9)';
                      }}
                    >
                      {addedDetails.includes(detail.key) ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                      {detail.label}
                    </button>
                  ))}
                </div>
                <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
                  Click to append technical specs to your prompt
                </p>
              </div>
            )}
            
            {/* Pro Interpretations - Available to all users */}
            <div className="mt-5 pt-4 border-t" style={{ borderColor: 'var(--border-color)' }}>
              <p className="text-xs font-medium mb-3" style={{ color: 'var(--text-muted)' }}>
                Generate high-end interpretation passes:
              </p>
              <div className="flex flex-wrap gap-3">
                {INTERPRETATIONS.map((interp) => {
                  const Icon = interp.icon;
                  return (
                    <button
                      key={interp.key}
                      onClick={() => generateInterpretation(interp.key)}
                      disabled={loading}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        background: 'var(--bg-card)',
                        border: `2px solid ${interp.color}30`,
                        color: interp.color,
                        boxShadow: 'var(--control-soft-shadow)',
                        transform: 'translateY(0) scale(1)'
                      }}
                    >
                      <Icon className="h-3.5 w-3.5" />
                      {interp.label}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
