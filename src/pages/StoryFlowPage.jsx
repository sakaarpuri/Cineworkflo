import { useCallback, useEffect, useMemo, useState } from 'react';
import { Check, ChevronRight, Copy, Film, Layers3, Loader2, Lock, Sparkles, Wand2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import STYLE_PRESETS from '../data/stylePresets.json';

const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com']);
const MOODS = ['Epic', 'Dramatic', 'Thought-Provoking', 'Whimsical', 'Serene', 'Mysterious', 'Energetic', 'Eerie', 'Calm', 'Surreal', 'Hopeful', 'Melancholic', 'Tense', 'Playful', 'Dreamlike'];
const FEATURED_PRESETS = STYLE_PRESETS.filter((preset) => preset.featured);
const EXTRA_PRESETS = STYLE_PRESETS.filter((preset) => !preset.featured);
const STEP_META = [
  { id: 1, label: 'Idea', short: 'Idea' },
  { id: 2, label: 'Story Treatment', short: 'Story' },
  { id: 3, label: 'Concept Variables', short: 'Variables' },
  { id: 4, label: 'Scene Breakdown', short: 'Scenes' },
  { id: 5, label: 'Asset Development', short: 'Assets' },
  { id: 6, label: 'Image / Shot Review', short: 'Review' },
];
const PIPELINE_PHASES = [
  {
    label: 'Foundation',
    color: '#62A7FF',
    steps: [1, 2, 3],
    note: 'Shape the one-minute story before production planning.'
  },
  {
    label: 'Scene Map',
    color: '#8B9BFF',
    steps: [4],
    note: 'Turn the treatment into concrete visual beats and durations.'
  },
  {
    label: 'Asset Lock',
    color: '#FF8FA3',
    steps: [5],
    note: 'Build reusable character, location, and prop prompts for continuity.'
  },
  {
    label: 'Shot Review',
    color: '#34D399',
    steps: [6],
    note: 'Review image prompts and shot prompts scene by scene.'
  }
];

const emptyConceptVariables = {
  title: '',
  protagonist: '',
  setting: '',
  conflict: '',
  tone: '',
  mood: '',
  visualPreset: '',
  genreFormat: '',
};

const initialFlowState = {
  idea: '',
  treatment: null,
  conceptVariables: emptyConceptVariables,
  recommendedSceneCount: 6,
  sceneBreakdown: [],
  assetPrompts: null,
  scenePromptReview: [],
};

const promptBlockStyle = {
  background: 'var(--bg-card)',
  border: '1px solid var(--border-color)',
  borderRadius: 18,
  boxShadow: 'var(--shadow-card)',
};

const normalizeText = (value) => String(value || '').trim();

const joinScenePromptBundle = (scenePrompts) => scenePrompts.map((scene, index) => (
  `Scene ${index + 1} — ${scene.title || scene.id}

IMAGE PROMPT
${scene.imagePrompt}

SHOT PROMPT
${scene.shotPrompt}
${scene.selectionNote ? `\nSELECTION NOTE\n${scene.selectionNote}` : ''}`
)).join('\n\n---\n\n');

function CopyButton({ onClick, copied, label = 'Copy' }) {
  return (
    <button
      onClick={onClick}
      className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold transition-all neu-button"
      style={{ color: 'var(--text-secondary)' }}
      type="button"
    >
      {copied ? <Check className="h-4 w-4" style={{ color: 'var(--accent-green)' }} /> : <Copy className="h-4 w-4" />}
      {copied ? 'Copied' : label}
    </button>
  );
}

function PromptBlock({ title, body, copied, onCopy, children }) {
  return (
    <div className="rounded-[22px] p-5 sm:p-6" style={promptBlockStyle}>
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="text-xs font-bold tracking-[0.24em] uppercase" style={{ color: 'var(--accent-blue)' }}>
          {title}
        </div>
        <CopyButton onClick={onCopy} copied={copied} />
      </div>
      <div
        className="rounded-[18px] p-4 sm:p-5 whitespace-pre-wrap text-sm sm:text-[15px] leading-7"
        style={{
          background: 'var(--bg-primary)',
          border: '1px solid var(--border-color)',
          color: 'var(--text-primary)',
          boxShadow: 'var(--shadow-inset)'
        }}
      >
        {body}
      </div>
      {children ? <div className="mt-4">{children}</div> : null}
    </div>
  );
}

function GateView({ user, onAuthClick }) {
  if (!user) {
    return (
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16">
        <div className="rounded-[32px] p-8 sm:p-10 text-center" style={promptBlockStyle}>
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: 'rgba(98,167,255,0.14)', color: 'var(--accent-blue)' }}>
            <Lock className="h-7 w-7" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
            Story Flow Planner
          </h1>
          <p className="max-w-2xl mx-auto text-base sm:text-lg leading-8 mb-7" style={{ color: 'var(--text-secondary)' }}>
            This hidden test page turns one idea into a one-minute image-to-video production plan up to image and shot review. Sign in first to access the planner.
          </p>
          <button
            type="button"
            onClick={onAuthClick}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold neu-button"
            style={{ color: 'var(--text-primary)' }}
          >
            <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />
            Sign in to continue
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-12 pb-16">
      <div className="rounded-[32px] p-8 sm:p-10 text-center" style={promptBlockStyle}>
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl mb-5" style={{ background: 'rgba(255,143,163,0.16)', color: 'var(--accent-pink)' }}>
          <Lock className="h-7 w-7" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold mb-4" style={{ color: 'var(--text-primary)' }}>
          Story Flow Planner is Pro-only in v1
        </h1>
        <p className="max-w-2xl mx-auto text-base sm:text-lg leading-8 mb-7" style={{ color: 'var(--text-secondary)' }}>
          This planner makes several structured Claude calls per project. For now we are keeping it restricted while we validate the workflow.
        </p>
        <Link
          to="/pricing"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold neu-button"
          style={{ color: 'var(--text-primary)' }}
        >
          <Wand2 className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />
          View Pro plan
        </Link>
      </div>
    </div>
  );
}

export default function StoryFlowPage({ onAuthClick }) {
  const { user, session, isPro, displayName } = useAuth();
  const canUsePro = isPro || FORCE_PRO_EMAILS.has(String(user?.email || '').trim().toLowerCase());
  const [flowState, setFlowState] = useState(initialFlowState);
  const [currentStep, setCurrentStep] = useState(1);
  const [loadingAction, setLoadingAction] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copiedKey, setCopiedKey] = useState('');
  const [showAllPresets, setShowAllPresets] = useState(false);
  const [selectedSceneIds, setSelectedSceneIds] = useState([]);

  const getValidAccessToken = useCallback(async () => {
    if (!user) return '';
    if (session?.access_token) return session.access_token;
    const { data: latestAuth } = await supabase.auth.getSession();
    if (latestAuth?.session?.access_token) return latestAuth.session.access_token;
    const { data: refreshed, error } = await supabase.auth.refreshSession();
    if (error) return '';
    return refreshed?.session?.access_token || '';
  }, [session, user]);

  const requestStoryFlow = useCallback(async (payload, accessToken) => {
    const response = await fetch('/.netlify/functions/story-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {})
      },
      body: JSON.stringify(payload)
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      const error = new Error(data.error || `Story Flow failed (${response.status})`);
      error.status = response.status;
      throw error;
    }
    return data;
  }, []);

  const handleCopy = useCallback(async (key, value) => {
    const text = normalizeText(value);
    if (!text) return;
    await navigator.clipboard.writeText(text);
    setCopiedKey(key);
    window.clearTimeout(handleCopy.timeoutId);
    handleCopy.timeoutId = window.setTimeout(() => setCopiedKey(''), 1500);
  }, []);

  useEffect(() => () => {
    if (handleCopy.timeoutId) {
      window.clearTimeout(handleCopy.timeoutId);
    }
  }, [handleCopy]);

  const invalidateFrom = useCallback((step) => {
    setErrorMessage('');
    setSelectedSceneIds([]);
    setFlowState((prev) => {
      if (step <= 3) {
        return {
          ...prev,
          sceneBreakdown: [],
          assetPrompts: null,
          scenePromptReview: [],
        };
      }
      if (step === 4) {
        return {
          ...prev,
          assetPrompts: null,
          scenePromptReview: [],
        };
      }
      if (step === 5) {
        return {
          ...prev,
          scenePromptReview: [],
        };
      }
      return prev;
    });
  }, []);

  const unlockedStep = useMemo(() => {
    if (!flowState.treatment) return 1;
    if (!flowState.sceneBreakdown.length) return 3;
    if (!flowState.assetPrompts) return 4;
    if (!flowState.scenePromptReview.length) return 5;
    return 6;
  }, [flowState]);

  const runAction = useCallback(async (payload) => {
    setLoadingAction(payload.action);
    setErrorMessage('');
    try {
      const accessToken = await getValidAccessToken();
      if (!accessToken) {
        throw new Error('Session expired. Please sign in again.');
      }
      return await requestStoryFlow(payload, accessToken);
    } catch (error) {
      setErrorMessage(error.message || 'Unable to continue right now.');
      throw error;
    } finally {
      setLoadingAction('');
    }
  }, [getValidAccessToken, requestStoryFlow]);

  const handleDevelopStory = async () => {
    const idea = normalizeText(flowState.idea);
    if (!idea) {
      setErrorMessage('Enter an idea before building the story.');
      return;
    }
    const data = await runAction({ action: 'develop_story', idea });
    setFlowState((prev) => ({
      ...prev,
      treatment: data.treatment,
      conceptVariables: {
        ...emptyConceptVariables,
        ...data.conceptVariables,
      },
      recommendedSceneCount: Number(data.recommendedSceneCount || 6),
      sceneBreakdown: [],
      assetPrompts: null,
      scenePromptReview: [],
    }));
    setSelectedSceneIds([]);
    setCurrentStep(2);
  };

  const handleBuildScenes = async () => {
    const data = await runAction({
      action: 'build_scenes',
      idea: flowState.idea,
      treatment: flowState.treatment,
      conceptVariables: flowState.conceptVariables,
      recommendedSceneCount: flowState.recommendedSceneCount,
    });
    setFlowState((prev) => ({
      ...prev,
      sceneBreakdown: data.scenes || [],
      assetPrompts: null,
      scenePromptReview: [],
    }));
    setSelectedSceneIds([]);
    setCurrentStep(4);
  };

  const handleBuildAssets = async () => {
    const data = await runAction({
      action: 'build_assets',
      idea: flowState.idea,
      treatment: flowState.treatment,
      conceptVariables: flowState.conceptVariables,
      sceneBreakdown: flowState.sceneBreakdown,
    });
    setFlowState((prev) => ({
      ...prev,
      assetPrompts: data,
      scenePromptReview: [],
    }));
    setSelectedSceneIds([]);
    setCurrentStep(5);
  };

  const handleBuildScenePrompts = async () => {
    const data = await runAction({
      action: 'build_scene_prompts',
      idea: flowState.idea,
      treatment: flowState.treatment,
      conceptVariables: flowState.conceptVariables,
      sceneBreakdown: flowState.sceneBreakdown,
      assetPrompts: flowState.assetPrompts,
    });
    setFlowState((prev) => ({
      ...prev,
      scenePromptReview: (data.scenes || []).map((scene) => {
        const match = prev.sceneBreakdown.find((entry) => entry.id === scene.id);
        return { ...scene, title: match?.title || scene.id };
      }),
    }));
    setSelectedSceneIds([]);
    setCurrentStep(6);
  };

  const setConceptField = (key, value) => {
    setFlowState((prev) => ({
      ...prev,
      conceptVariables: {
        ...prev.conceptVariables,
        [key]: value,
      }
    }));
    invalidateFrom(3);
  };

  const updateScene = (sceneId, key, value) => {
    setFlowState((prev) => ({
      ...prev,
      sceneBreakdown: prev.sceneBreakdown.map((scene) => scene.id === sceneId ? { ...scene, [key]: value } : scene),
    }));
    invalidateFrom(4);
  };

  const toggleSceneSelection = (sceneId) => {
    setSelectedSceneIds((prev) => prev.includes(sceneId) ? prev.filter((id) => id !== sceneId) : [...prev, sceneId]);
  };

  const selectedScenePromptBlocks = useMemo(() => {
    const scenes = flowState.scenePromptReview.filter((scene) => selectedSceneIds.includes(scene.id));
    return scenes.map((scene) => ({
      ...scene,
      title: scene.title || scene.id,
    }));
  }, [flowState.scenePromptReview, selectedSceneIds]);

  const renderPresetCard = (preset) => {
    const isActive = flowState.conceptVariables.visualPreset === preset.key;
    return (
      <button
        key={preset.key}
        type="button"
        onClick={() => setConceptField('visualPreset', isActive ? '' : preset.key)}
        className="text-left rounded-[22px] overflow-hidden transition-all w-full"
        style={{
          ...promptBlockStyle,
          border: isActive ? `1px solid ${preset.accentColor}` : '1px solid var(--border-color)',
          boxShadow: isActive ? `0 18px 38px ${preset.accentColor}1F, var(--shadow-card)` : 'var(--shadow-card)',
        }}
      >
        <div className="flex gap-4 p-4">
          <img
            src={`/preset-thumbnails/${preset.key}.webp?v=6`}
            alt={preset.label}
            className="w-[64px] h-[64px] rounded-2xl object-cover flex-shrink-0"
            style={{ border: '1px solid var(--border-color)', background: 'var(--bg-primary)' }}
          />
          <div className="min-w-0">
            <div className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: preset.accentColor }}>
              {isActive ? 'Selected' : 'Style'}
            </div>
            <div className="font-semibold leading-tight text-lg" style={{ color: 'var(--text-primary)' }}>
              {preset.label}
            </div>
            <div className="text-sm leading-6 mt-1" style={{ color: 'var(--text-secondary)' }}>
              {preset.subtitle}
            </div>
          </div>
        </div>
      </button>
    );
  };

  const renderStepNav = () => (
    <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
      {STEP_META.map((step) => {
        const isActive = step.id === currentStep;
        const isUnlocked = step.id <= unlockedStep;
        const isDone = step.id < currentStep && step.id < unlockedStep;
        return (
          <button
            key={step.id}
            type="button"
            disabled={!isUnlocked}
            onClick={() => isUnlocked && setCurrentStep(step.id)}
            className="rounded-2xl px-3 py-3 text-left transition-all"
            style={{
              ...promptBlockStyle,
              opacity: isUnlocked ? 1 : 0.5,
              border: isActive ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
            }}
          >
            <div className="text-xs font-bold tracking-[0.2em] uppercase mb-1" style={{ color: isActive ? 'var(--accent-blue)' : 'var(--text-muted)' }}>
              Step {step.id}
            </div>
            <div className="font-semibold text-sm" style={{ color: 'var(--text-primary)' }}>{step.short}</div>
            {isDone ? <Check className="h-4 w-4 mt-2" style={{ color: 'var(--accent-green)' }} /> : null}
          </button>
        );
      })}
    </div>
  );

  const renderPipelineSidebar = () => (
    <div className="space-y-4">
      <div className="rounded-[26px] p-5" style={promptBlockStyle}>
        <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>
          Story Flow
        </div>
        <h2 className="text-xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>
          {flowState.conceptVariables.title || 'One-minute planner'}
        </h2>
        <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
          Build the story, lock the concept variables, plan the assets, then review image and shot prompts scene by scene.
        </p>
      </div>

      {PIPELINE_PHASES.map((phase) => {
        const phaseActive = phase.steps.includes(currentStep);
        return (
          <div
            key={phase.label}
            className="rounded-[22px] p-4"
            style={{
              ...promptBlockStyle,
              border: `1px solid ${phaseActive ? phase.color : 'var(--border-color)'}`,
            }}
          >
            <div className="text-xs font-bold tracking-[0.2em] uppercase mb-2" style={{ color: phase.color }}>
              {phase.label}
            </div>
            <div className="flex flex-wrap gap-2 mb-3">
              {phase.steps.map((stepId) => {
                const step = STEP_META.find((entry) => entry.id === stepId);
                const active = currentStep === stepId;
                return (
                  <span
                    key={stepId}
                    className="px-3 py-1.5 rounded-full text-xs font-semibold"
                    style={{
                      background: active ? `${phase.color}20` : 'var(--bg-primary)',
                      color: active ? phase.color : 'var(--text-secondary)',
                      border: `1px solid ${active ? phase.color : 'var(--border-color)'}`,
                    }}
                  >
                    {step.short}
                  </span>
                );
              })}
            </div>
            <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
              {phase.note}
            </p>
          </div>
        );
      })}
    </div>
  );

  if (!user || !canUsePro) {
    return <GateView user={user} onAuthClick={onAuthClick} />;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      <div className="rounded-[30px] p-6 sm:p-8 mb-6" style={promptBlockStyle}>
        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5">
          <div>
            <div className="text-xs font-bold tracking-[0.24em] uppercase mb-3" style={{ color: 'var(--accent-blue)' }}>
              Hidden test page
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold leading-tight mb-3" style={{ color: 'var(--text-primary)' }}>
              Story Flow Planner
            </h1>
            <p className="max-w-3xl text-base sm:text-lg leading-8" style={{ color: 'var(--text-secondary)' }}>
              Turn one idea into a one-minute image-to-video production plan up to approved image and shot prompt review. No image generation, no video generation, just the planning layer.
            </p>
          </div>
          <div className="rounded-[24px] px-5 py-4 flex items-center gap-4" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-inset)' }}>
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(98,167,255,0.16)', color: 'var(--accent-blue)' }}>
              <Film className="h-5 w-5" />
            </div>
            <div>
              <div className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>Signed in as</div>
              <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{displayName}</div>
            </div>
          </div>
        </div>
      </div>

      <div className="lg:hidden mb-6">
        {renderStepNav()}
      </div>

      {errorMessage ? (
        <div className="mb-6 rounded-[22px] px-5 py-4" style={{ ...promptBlockStyle, border: '1px solid rgba(255,107,107,0.4)', color: 'var(--accent-red)' }}>
          {errorMessage}
        </div>
      ) : null}

      <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <div className="space-y-6">
          {renderStepNav()}

          <div className="rounded-[30px] p-6 sm:p-8" style={promptBlockStyle}>
            {currentStep === 1 ? (
              <div className="space-y-5">
                <div>
                  <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>Step 1</div>
                  <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Start with the core idea</h2>
                  <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                    Keep it focused. This planner builds a one-minute production flow up to image and shot prompt review, not final generation.
                  </p>
                </div>
                <textarea
                  value={flowState.idea}
                  onChange={(e) => {
                    setFlowState((prev) => ({ ...prev, idea: e.target.value }));
                    setErrorMessage('');
                  }}
                  rows={6}
                  placeholder="A girl discovers an impossible stepwell at dusk and realizes the descent changes her memory of home."
                  className="w-full rounded-[24px] p-5 text-base leading-7 outline-none resize-y"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    boxShadow: 'var(--shadow-inset)'
                  }}
                />
                <div className="flex flex-wrap items-center gap-3 justify-between">
                  <p className="text-sm leading-6" style={{ color: 'var(--text-muted)' }}>
                    We will shape the story, extract editable concept variables, then build scenes, assets, and review prompts.
                  </p>
                  <button
                    type="button"
                    onClick={handleDevelopStory}
                    disabled={!normalizeText(flowState.idea) || loadingAction === 'develop_story'}
                    className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold neu-button disabled:opacity-60"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {loadingAction === 'develop_story' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />}
                    Build story foundation
                  </button>
                </div>
              </div>
            ) : null}

            {currentStep === 2 && flowState.treatment ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>Step 2</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Story treatment</h2>
                    <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                      This gives us the 1-minute narrative spine before we lock variables and scenes.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CopyButton copied={copiedKey === 'treatment'} onClick={() => handleCopy('treatment', `${flowState.treatment.title}\n\nLogline\n${flowState.treatment.logline}\n\nStory Arc\n${flowState.treatment.storyArc}\n\nCreative Approach\n${flowState.treatment.creativeApproach}`)} />
                    <button
                      type="button"
                      onClick={handleDevelopStory}
                      disabled={loadingAction === 'develop_story'}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold neu-button"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingAction === 'develop_story' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                  <PromptBlock title="Title" body={flowState.treatment.title} copied={copiedKey === 'title'} onCopy={() => handleCopy('title', flowState.treatment.title)} />
                  <PromptBlock title="Logline" body={flowState.treatment.logline} copied={copiedKey === 'logline'} onCopy={() => handleCopy('logline', flowState.treatment.logline)} />
                  <PromptBlock title="Story Arc" body={flowState.treatment.storyArc} copied={copiedKey === 'storyArc'} onCopy={() => handleCopy('storyArc', flowState.treatment.storyArc)} />
                </div>
                <PromptBlock title="Creative Approach" body={flowState.treatment.creativeApproach} copied={copiedKey === 'creativeApproach'} onCopy={() => handleCopy('creativeApproach', flowState.treatment.creativeApproach)} />

                <div className="flex justify-end">
                  <button type="button" onClick={() => setCurrentStep(3)} className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold neu-button" style={{ color: 'var(--text-primary)' }}>
                    Continue to variables
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>Step 3</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Concept variables</h2>
                    <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                      Edit the core story variables now. Any change here resets scenes, assets, and prompt review so the downstream plan stays coherent.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={handleBuildScenes}
                    disabled={loadingAction === 'build_scenes'}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold neu-button"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {loadingAction === 'build_scenes' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers3 className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />}
                    Build scenes
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[
                    ['title', 'Title'],
                    ['protagonist', 'Protagonist'],
                    ['setting', 'Setting / world'],
                    ['conflict', 'Conflict / objective'],
                    ['tone', 'Tone'],
                    ['genreFormat', 'Genre / format'],
                  ].map(([key, label]) => (
                    <label key={key} className="block">
                      <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                      <input
                        value={flowState.conceptVariables[key]}
                        onChange={(e) => setConceptField(key, e.target.value)}
                        className="w-full rounded-[18px] px-4 py-3 outline-none"
                        style={{
                          background: 'var(--bg-primary)',
                          border: '1px solid var(--border-color)',
                          color: 'var(--text-primary)',
                          boxShadow: 'var(--shadow-inset)'
                        }}
                      />
                    </label>
                  ))}
                </div>

                <div>
                  <div className="text-sm font-semibold mb-3" style={{ color: 'var(--text-secondary)' }}>Mood</div>
                  <div className="flex flex-wrap gap-2">
                    {MOODS.map((mood) => {
                      const active = flowState.conceptVariables.mood === mood;
                      return (
                        <button
                          key={mood}
                          type="button"
                          onClick={() => setConceptField('mood', active ? '' : mood)}
                          className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
                          style={{
                            background: active ? 'rgba(98,167,255,0.18)' : 'var(--bg-card)',
                            border: active ? '1px solid var(--accent-blue)' : '1px solid var(--border-color)',
                            color: active ? 'var(--accent-blue)' : 'var(--text-secondary)',
                            boxShadow: active ? '0 10px 18px rgba(98,167,255,0.18)' : 'var(--control-soft-shadow)'
                          }}
                        >
                          {mood}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div className="rounded-[26px] p-5" style={{ ...promptBlockStyle, background: 'var(--bg-elevated)' }}>
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3 mb-5">
                    <div>
                      <div className="text-sm font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>Style Preset</div>
                      <p className="text-sm leading-6" style={{ color: 'var(--text-secondary)' }}>
                        Choose a cinematic visual grammar. This shapes lensing, framing, lighting, palette, and movement language for the whole one-minute plan.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowAllPresets((prev) => !prev)}
                      className="self-start px-4 py-2 rounded-full text-sm font-semibold neu-button"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {showAllPresets ? 'Show fewer' : 'More styles'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
                    {FEATURED_PRESETS.map((preset) => renderPresetCard(preset))}
                  </div>

                  {showAllPresets ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      {EXTRA_PRESETS.map((preset) => renderPresetCard(preset))}
                    </div>
                  ) : null}
                </div>
              </div>
            ) : null}

            {currentStep === 4 ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>Step 4</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Scene breakdown</h2>
                    <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                      The model sets the scene count for a one-minute arc. You can edit titles, beats, durations, and references before assets are built.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={handleBuildScenes}
                      disabled={loadingAction === 'build_scenes'}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-full font-semibold neu-button"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingAction === 'build_scenes' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
                      Regenerate scenes
                    </button>
                    <button
                      type="button"
                      onClick={handleBuildAssets}
                      disabled={!flowState.sceneBreakdown.length || loadingAction === 'build_assets'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold neu-button"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingAction === 'build_assets' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Layers3 className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />}
                      Build assets
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {flowState.sceneBreakdown.map((scene, index) => (
                    <div key={scene.id} className="rounded-[24px] p-5" style={promptBlockStyle}>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-2xl flex items-center justify-center text-sm font-bold" style={{ background: 'rgba(98,167,255,0.14)', color: 'var(--accent-blue)' }}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-xs font-bold tracking-[0.2em] uppercase" style={{ color: 'var(--text-muted)' }}>
                            {scene.durationSeconds}s
                          </div>
                          <div className="font-semibold" style={{ color: 'var(--text-primary)' }}>{scene.title}</div>
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                          ['title', 'Scene title'],
                          ['durationSeconds', 'Duration (seconds)'],
                          ['location', 'Location'],
                        ].map(([key, label]) => (
                          <label key={key} className="block">
                            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                            <input
                              value={key === 'durationSeconds' ? String(scene[key] ?? '') : scene[key]}
                              onChange={(e) => updateScene(scene.id, key, key === 'durationSeconds' ? e.target.value.replace(/[^\d]/g, '') : e.target.value)}
                              className="w-full rounded-[16px] px-4 py-3 outline-none"
                              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-inset)' }}
                            />
                          </label>
                        ))}
                      </div>
                      <div className="grid grid-cols-1 gap-4 mt-4">
                        {[
                          ['purpose', 'Dramatic purpose'],
                          ['visualBeat', 'Visual beat'],
                          ['characters', 'Key characters / subject references'],
                        ].map(([key, label]) => (
                          <label key={key} className="block">
                            <div className="text-sm font-semibold mb-2" style={{ color: 'var(--text-secondary)' }}>{label}</div>
                            <textarea
                              value={Array.isArray(scene[key]) ? scene[key].join(', ') : scene[key]}
                              onChange={(e) => updateScene(scene.id, key, key === 'characters'
                                ? e.target.value.split(/\s*,\s*/).filter(Boolean)
                                : e.target.value)}
                              rows={key === 'visualBeat' ? 4 : 3}
                              className="w-full rounded-[16px] px-4 py-3 outline-none resize-y"
                              style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', color: 'var(--text-primary)', boxShadow: 'var(--shadow-inset)' }}
                            />
                          </label>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {currentStep === 5 && flowState.assetPrompts ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>Step 5</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Asset development prompts</h2>
                    <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                      These prompts are written for reusable continuity locks, not one-off scene generation.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <CopyButton
                      copied={copiedKey === 'asset-all'}
                      label="Copy all assets"
                      onClick={() => handleCopy('asset-all', JSON.stringify(flowState.assetPrompts, null, 2))}
                    />
                    <button
                      type="button"
                      onClick={handleBuildScenePrompts}
                      disabled={!flowState.assetPrompts || loadingAction === 'build_scene_prompts'}
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full font-semibold neu-button"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {loadingAction === 'build_scene_prompts' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Film className="h-4 w-4" style={{ color: 'var(--accent-blue)' }} />}
                      Build image / shot review
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                  {[
                    ['Character assets', flowState.assetPrompts.characterPrompts],
                    ['Location assets', flowState.assetPrompts.locationPrompts],
                    ['Prop assets', flowState.assetPrompts.propPrompts],
                  ].map(([label, entries]) => (
                    <div key={label} className="rounded-[24px] p-5" style={promptBlockStyle}>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--accent-blue)' }}>{label}</div>
                        <CopyButton copied={copiedKey === label} onClick={() => handleCopy(label, entries.map((entry) => `${entry.name}\n${entry.prompt}\nUsage: ${entry.usage}`).join('\n\n'))} />
                      </div>
                      <div className="space-y-3">
                        {entries.length ? entries.map((entry) => (
                          <div key={`${label}-${entry.name}`} className="rounded-[18px] p-4" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-inset)' }}>
                            <div className="font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>{entry.name}</div>
                            <div className="text-sm leading-7 whitespace-pre-wrap" style={{ color: 'var(--text-secondary)' }}>{entry.prompt}</div>
                            {entry.usage ? <div className="mt-3 text-xs uppercase tracking-[0.18em]" style={{ color: 'var(--text-muted)' }}>{entry.usage}</div> : null}
                          </div>
                        )) : <div className="text-sm" style={{ color: 'var(--text-muted)' }}>No prompts returned for this asset group.</div>}
                      </div>
                    </div>
                  ))}

                  <div className="rounded-[24px] p-5 xl:col-span-2" style={promptBlockStyle}>
                    <div className="flex items-center justify-between gap-3 mb-4">
                      <div className="text-xs font-bold tracking-[0.22em] uppercase" style={{ color: 'var(--accent-blue)' }}>Continuity notes</div>
                      <CopyButton copied={copiedKey === 'continuity'} onClick={() => handleCopy('continuity', (flowState.assetPrompts.continuityNotes || []).join('\n'))} />
                    </div>
                    <div className="grid gap-3">
                      {(flowState.assetPrompts.continuityNotes || []).map((note, index) => (
                        <div key={index} className="rounded-[18px] p-4 text-sm leading-7" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', boxShadow: 'var(--shadow-inset)', color: 'var(--text-secondary)' }}>
                          {note}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ) : null}

            {currentStep === 6 && flowState.scenePromptReview.length ? (
              <div className="space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                  <div>
                    <div className="text-xs font-bold tracking-[0.22em] uppercase mb-2" style={{ color: 'var(--accent-blue)' }}>Step 6</div>
                    <h2 className="text-2xl sm:text-3xl font-semibold mb-2" style={{ color: 'var(--text-primary)' }}>Image / shot prompt review</h2>
                    <p className="text-base leading-7" style={{ color: 'var(--text-secondary)' }}>
                      Review each scene’s image prompt and companion shot prompt. Mark any scene locally as selected, then copy selected or copy all.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <CopyButton copied={copiedKey === 'selected-scenes'} label="Copy selected" onClick={() => handleCopy('selected-scenes', joinScenePromptBundle(selectedScenePromptBlocks))} />
                    <CopyButton copied={copiedKey === 'all-scenes'} label="Copy all" onClick={() => handleCopy('all-scenes', joinScenePromptBundle(flowState.scenePromptReview))} />
                  </div>
                </div>

                <div className="space-y-4">
                  {flowState.scenePromptReview.map((scene, index) => {
                    const selected = selectedSceneIds.includes(scene.id);
                    return (
                      <div key={scene.id} className="rounded-[26px] p-5 sm:p-6" style={promptBlockStyle}>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5">
                          <div>
                            <div className="text-xs font-bold tracking-[0.22em] uppercase mb-1" style={{ color: 'var(--text-muted)' }}>
                              Scene {index + 1}
                            </div>
                            <div className="text-xl font-semibold" style={{ color: 'var(--text-primary)' }}>{scene.title || `Scene ${index + 1}`}</div>
                          </div>
                          <button
                            type="button"
                            onClick={() => toggleSceneSelection(scene.id)}
                            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold neu-button"
                            style={{ color: selected ? 'var(--accent-green)' : 'var(--text-secondary)' }}
                          >
                            {selected ? <Check className="h-4 w-4" /> : <Film className="h-4 w-4" />}
                            {selected ? 'Selected' : 'Mark selected'}
                          </button>
                        </div>

                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                          <PromptBlock title="Image Prompt" body={scene.imagePrompt} copied={copiedKey === `${scene.id}-image`} onCopy={() => handleCopy(`${scene.id}-image`, scene.imagePrompt)} />
                          <PromptBlock title="Shot Prompt" body={scene.shotPrompt} copied={copiedKey === `${scene.id}-shot`} onCopy={() => handleCopy(`${scene.id}-shot`, scene.shotPrompt)} />
                        </div>
                        {scene.selectionNote ? (
                          <div className="mt-4 rounded-[18px] px-4 py-3 text-sm leading-7" style={{ background: 'rgba(98,167,255,0.10)', border: '1px solid rgba(98,167,255,0.22)', color: 'var(--text-secondary)' }}>
                            <span className="font-semibold" style={{ color: 'var(--text-primary)' }}>Selection note:</span> {scene.selectionNote}
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>
        </div>

        <aside className="hidden lg:block sticky top-24">
          {renderPipelineSidebar()}
        </aside>
      </div>
    </div>
  );
}
