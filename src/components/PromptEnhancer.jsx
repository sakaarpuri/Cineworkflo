import { useState, useEffect, useCallback, useRef } from 'react';
import { Sparkles, Copy, Check, Wand2, Zap, Palette, Camera, Film, Lock, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

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
const getUsageData = () => {
  const data = localStorage.getItem('promptEnhancerUsage');
  if (!data) return { count: 0, lastReset: new Date().toISOString(), isPro: false };
  return JSON.parse(data);
};

const saveUsageData = (data) => {
  localStorage.setItem('promptEnhancerUsage', JSON.stringify(data));
};

const shouldResetMonthly = (lastReset) => {
  const last = new Date(lastReset);
  const now = new Date();
  return last.getMonth() !== now.getMonth() || last.getFullYear() !== now.getFullYear();
};

const INTERPRETATIONS = [
  { key: 'cinematic', label: 'Cinematic', icon: Film, color: '#8B5CF6' },
  { key: 'stylized', label: 'Stylized', icon: Palette, color: '#EC4899' },
  { key: 'photorealistic', label: 'Photoreal', icon: Camera, color: '#10B981' },
  { key: 'animated', label: 'Animated', icon: Zap, color: '#F59E0B' }
];

const PRO_DETAILS = [
  { key: 'camera', label: '+ Camera Movement', desc: 'gimbal tracking, handheld, dolly zoom' },
  { key: 'lens', label: '+ Lens Type', desc: '24mm wide, 50mm portrait, 85mm telephoto' },
  { key: 'depth', label: '+ Depth of Field', desc: 'shallow bokeh, deep focus, f/1.4-f/22' },
  { key: 'lighting', label: '+ Lighting Setup', desc: 'key light, rim light, softbox, golden hour' }
];

export default function PromptEnhancer({ onAuthClick }) {
  const [idea, setIdea] = useState("");
  const [mood, setMood] = useState("");
  const [useCase, setUseCase] = useState("");
  const [skillLevel, setSkillLevel] = useState('beginner'); // 'beginner' | 'pro'
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [copied, setCopied] = useState(false);
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false);
  const [usage, setUsage] = useState({ count: 0, isPro: false });
  const [addedDetails, setAddedDetails] = useState([]);
  const lastParamsRef = useRef({ idea: "", mood: "", useCase: "", skillLevel: "beginner" });
  const levelPulseTimeoutRef = useRef(null);
  const [levelPulse, setLevelPulse] = useState('');
  
  const { user, isPro } = useAuth();

  // Load usage on mount
  useEffect(() => {
    const data = getUsageData();
    if (shouldResetMonthly(data.lastReset)) {
      const resetData = { count: 0, lastReset: new Date().toISOString(), isPro: isPro };
      saveUsageData(resetData);
      setUsage(resetData);
    } else {
      setUsage({ ...data, isPro });
    }
  }, [isPro]);

  const remainingFree = Math.max(0, 30 - usage.count);
  const isLimitReached = !isPro && remainingFree === 0;
  const requiresAuth = !user && isLimitReached;
  const canSubmit = idea.trim().length > 3 && !loading && !isLimitReached;

  const handleEnhance = useCallback(async (isAutoUpdate = false, interpretationStyle = null) => {
    if (!canSubmit && !interpretationStyle) return;
    setLoading(true);
    // Only clear result on first generation, keep it visible during auto-updates
    if (!isAutoUpdate) {
      setResult(null);
    }
    setCopied(false);

    // Track usage for free users
    if (!isPro && !interpretationStyle) {
      const newData = { ...usage, count: usage.count + 1 };
      saveUsageData(newData);
      setUsage(newData);
    }

    try {
      const promptPayload = interpretationStyle 
        ? { idea, mood, useCase, interpretation: interpretationStyle, skillLevel }
        : { idea, mood, useCase, skillLevel };

      const response = await fetch('/.netlify/functions/enhance-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(promptPayload)
      });

      const data = await response.json();
      setResult(data.prompt || generateSmartPrompt(idea, mood, useCase, skillLevel));
      setHasGeneratedOnce(true);
    } catch (err) {
      // Fallback with smart prompt generator
      setResult(generateSmartPrompt(idea, mood, useCase, skillLevel));
    }
    setLoading(false);
  }, [canSubmit, idea, mood, useCase, skillLevel, isPro]);

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
        skillLevel !== lastParamsRef.current.skillLevel;
      
      if (!paramsChanged) return;
      
      const timeoutId = setTimeout(() => {
        handleEnhance(true); // Pass true for auto-update (keeps result visible)
        lastParamsRef.current = { idea, mood, useCase, skillLevel };
      }, 500);
      return () => clearTimeout(timeoutId);
    }
  }, [mood, useCase, idea, skillLevel, hasGeneratedOnce, canSubmit, handleEnhance]);

  useEffect(() => () => {
    if (levelPulseTimeoutRef.current) {
      clearTimeout(levelPulseTimeoutRef.current);
    }
  }, []);


  const handleCopy = () => {
    if (!result) return;
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
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
          : '8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
        transform: selected ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
      }}
    >
      {label}
    </button>
  );

  return (
    <section 
      id="prompt-enhancer"
      className="py-12 transition-colors relative overflow-hidden"
      style={{ background: 'linear-gradient(90deg, var(--bg-secondary) 0%, var(--bg-primary) 30%, var(--bg-primary) 70%, var(--bg-secondary) 100%)' }}
    >
      {/* Subtle gradient orbs */}
      <div className="absolute top-1/2 left-10 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 transform -translate-y-1/2" />
      <div className="absolute top-1/2 right-10 w-64 h-64 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-15 transform -translate-y-1/2" />
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
            Describe your idea. <span style={{ color: 'var(--accent-blue)' }}>We'll write the prompt.</span>
          </h2>
          
          {/* Usage Counter for Free Users */}
          {!isPro && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{ 
                background: remainingFree <= 5 ? 'var(--accent-red)15' : 'var(--bg-card)',
                border: `1px solid ${remainingFree <= 5 ? 'var(--accent-red)30' : 'var(--border-color)'}`,
                color: remainingFree <= 5 ? 'var(--accent-red)' : 'var(--text-muted)'
              }}
            >
              <Zap className="h-3 w-3" />
              {remainingFree > 0 ? (
                <span>{remainingFree} free prompts remaining this month</span>
              ) : (
                <span>
                  {!user ? 'Sign in to continue' : 'Free limit reached — '}
                  <button 
                    onClick={onAuthClick}
                    style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}
                  >
                    {!user ? 'Sign in' : 'Upgrade to Pro'}
                  </button>
                </span>
              )}
            </div>
          )}
          
          {/* Pro Badge */}
          {isPro && (
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

        {/* Wide Compact Card */}
        <div 
          className="p-5 rounded-2xl"
          style={{
            background: 'var(--bg-secondary)',
            boxShadow: 'var(--shadow-card)',
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
              className="px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 whitespace-nowrap"
              style={{
                background: canSubmit 
                  ? 'linear-gradient(145deg, #FF6B35, #FF6B35DD)' 
                  : 'linear-gradient(145deg, #E5E7EB, #D1D5DB)',
                color: canSubmit ? '#fff' : '#4B5563',
                cursor: 'pointer',
                border: `2px solid ${canSubmit ? '#FF6B3550' : 'var(--border-color)'}`,
                boxShadow: canSubmit 
                  ? 'inset 3px 3px 6px rgba(255,107,53,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(255,107,53,0.4)'
                  : 'inset 3px 3px 6px rgba(107,114,128,0.18), inset -3px -3px 6px rgba(255,255,255,0.72), 0 4px 12px rgba(107,114,128,0.18)',
                transform: 'translateY(0) scale(1)'
              }}
              onMouseDown={(e) => {
                if (canSubmit) {
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
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <><Wand2 className="h-4 w-4" /> Enhance</>
              )}
            </button>
          </div>

          {/* Options - Stacked for better chip wrapping */}
          <div className="space-y-3 text-sm">
            {/* Skill Level Toggle */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 pb-3 border-b" style={{ borderColor: 'var(--border-color)' }}>
              <span style={{ color: 'var(--text-muted)' }} className="text-xs font-medium flex-shrink-0 min-w-[40px]">Level</span>
              <div className="flex items-center gap-2">
                <span
                  className="text-xs font-semibold transition-all"
                  style={{
                    color: skillLevel === 'beginner' ? '#3B82F6' : 'var(--text-muted)',
                    textShadow: levelPulse === 'beginner' ? '0 0 10px rgba(59,130,246,0.65)' : 'none'
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
                      ? `inset 3px 3px 6px rgba(124,58,237,0.55), inset -3px -3px 6px rgba(255,255,255,0.25), 0 6px 16px rgba(124,58,237,0.35)${levelPulse === 'pro' ? ', 0 0 16px rgba(168,85,247,0.55)' : ''}`
                      : `inset 3px 3px 6px rgba(37,99,235,0.5), inset -3px -3px 6px rgba(255,255,255,0.25), 0 6px 16px rgba(37,99,235,0.35)${levelPulse === 'beginner' ? ', 0 0 16px rgba(96,165,250,0.55)' : ''}`
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
                      background: 'linear-gradient(145deg, #FFFFFF, #F1F5F9)',
                      boxShadow: '3px 3px 6px rgba(15,23,42,0.25), inset 1px 1px 2px rgba(255,255,255,0.95)'
                    }}
                  />
                </button>
                <span
                  className="text-xs font-semibold transition-all"
                  style={{
                    color: skillLevel === 'pro' ? '#7C3AED' : 'var(--text-muted)',
                    textShadow: levelPulse === 'pro' ? '0 0 10px rgba(124,58,237,0.65)' : 'none'
                  }}
                >
                  Pro
                </span>
              </div>
              <span className="text-xs" style={{ color: 'var(--text-muted)' }}>
                {skillLevel === 'beginner' ? 'Simple language, optional add-ons' : 'Full technical specifications'}
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
        {result && (
          <div 
            className="mt-6 p-5 rounded-2xl"
            style={{
              background: 'var(--bg-secondary)',
              boxShadow: 'var(--shadow-card)',
              border: '1px solid var(--accent-green)40'
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <div 
                className="text-xs font-bold flex items-center gap-1.5"
                style={{ color: 'var(--accent-green)' }}
              >
                <Check className="h-4 w-4" />
                YOUR PROMPT
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                style={{
                  background: copied 
                    ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' 
                    : 'var(--bg-card)',
                  color: copied ? '#fff' : 'var(--text-secondary)',
                  border: `2px solid ${copied ? 'var(--accent-green)50' : 'var(--border-color)'}`,
                  boxShadow: copied 
                    ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40'
                    : '8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                  transform: copied ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
                }}
              >
                {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied!' : 'Copy Prompt'}
              </button>
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
                        if (!addedDetails.includes(detail.key)) {
                          setAddedDetails([...addedDetails, detail.key]);
                          const detailText = {
                            camera: ' Smooth gimbal tracking shot.',
                            lens: ' Shot on 50mm lens, shallow depth of field.',
                            depth: ' f/2.8 aperture, creamy bokeh background.',
                            lighting: ' Three-point lighting with soft key light.'
                          };
                          setResult(result + detailText[detail.key]);
                        }
                      }}
                      disabled={addedDetails.includes(detail.key)}
                      className="flex items-center gap-2 px-4 py-3 rounded-xl text-xs font-semibold transition-all duration-200"
                      style={{
                        background: addedDetails.includes(detail.key)
                          ? 'linear-gradient(145deg, #F59E0B, #D97706)'
                          : 'linear-gradient(145deg, #FEF3C7, #FDE68A)',
                        border: `2px solid ${addedDetails.includes(detail.key) ? '#D9770650' : '#FCD34D'}`,
                        color: addedDetails.includes(detail.key) ? '#fff' : '#92400E',
                        boxShadow: addedDetails.includes(detail.key)
                          ? 'inset 4px 4px 8px rgba(217,119,6,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(245,158,11,0.4)'
                          : '6px 6px 12px rgba(217,119,6,0.2), -6px -6px 12px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.9)',
                        transform: addedDetails.includes(detail.key) ? 'translateY(2px) scale(0.96)' : 'translateY(0) scale(1)',
                        textShadow: addedDetails.includes(detail.key) ? '0 1px 2px rgba(0,0,0,0.2)' : 'none'
                      }}
                      onMouseDown={(e) => {
                        if (!addedDetails.includes(detail.key)) {
                          e.currentTarget.style.transform = 'translateY(3px) scale(0.94)';
                          e.currentTarget.style.boxShadow = 'inset 5px 5px 10px rgba(217,119,6,0.5), inset -3px -3px 6px rgba(255,255,255,0.4), 0 2px 4px rgba(245,158,11,0.3)';
                        }
                      }}
                      onMouseUp={(e) => {
                        if (!addedDetails.includes(detail.key)) {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '6px 6px 12px rgba(217,119,6,0.2), -6px -6px 12px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.9)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!addedDetails.includes(detail.key)) {
                          e.currentTarget.style.transform = 'translateY(0) scale(1)';
                          e.currentTarget.style.boxShadow = '6px 6px 12px rgba(217,119,6,0.2), -6px -6px 12px rgba(255,255,255,0.8), inset 0 2px 0 rgba(255,255,255,0.9)';
                        }
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
                Generate alternative interpretations:
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
                        boxShadow: '8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
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
