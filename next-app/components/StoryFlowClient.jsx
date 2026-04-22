'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronRight, Copy, Film, Layers3, Loader2, Lock, Sparkles, Wand2 } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import STYLE_PRESETS from '../data/stylePresets.json'

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
  'Dreamlike',
]

const FEATURED_PRESETS = STYLE_PRESETS.filter((preset) => preset.featured)
const EXTRA_PRESETS = STYLE_PRESETS.filter((preset) => !preset.featured)

const STEP_META = [
  { id: 1, label: 'Idea' },
  { id: 2, label: 'Story Treatment' },
  { id: 3, label: 'Concept Variables' },
  { id: 4, label: 'Scene Breakdown' },
  { id: 5, label: 'Asset Development' },
  { id: 6, label: 'Image / Shot Review' },
]

const PIPELINE_PHASES = [
  {
    label: 'Foundation',
    color: '#62A7FF',
    steps: [1, 2, 3],
    note: 'Shape the one-minute story before production planning.',
  },
  {
    label: 'Scene Map',
    color: '#8B9BFF',
    steps: [4],
    note: 'Turn the treatment into concrete visual beats and durations.',
  },
  {
    label: 'Asset Lock',
    color: '#FF8FA3',
    steps: [5],
    note: 'Build reusable character, location, and prop prompts for continuity.',
  },
  {
    label: 'Shot Review',
    color: '#34D399',
    steps: [6],
    note: 'Review start-frame and shot prompts scene by scene.',
  },
]

const emptyConceptVariables = {
  title: '',
  protagonist: '',
  setting: '',
  conflict: '',
  tone: '',
  mood: '',
  visualPreset: '',
  genreFormat: '',
}

const initialFlowState = {
  idea: '',
  treatment: null,
  conceptVariables: emptyConceptVariables,
  recommendedSceneCount: 6,
  sceneBreakdown: [],
  assetPrompts: null,
  scenePromptReview: [],
}

const normalizeText = (value) => String(value || '').trim()

const joinScenePromptBundle = (scenePrompts) =>
  scenePrompts
    .map(
      (scene, index) => `Scene ${index + 1} — ${scene.title || scene.id}

START FRAME PROMPT
${scene.imagePrompt}

SHOT PROMPT
${scene.shotPrompt}${scene.selectionNote ? `\n\nSELECTION NOTE\n${scene.selectionNote}` : ''}`,
    )
    .join('\n\n---\n\n')

function CopyButton({ onClick, copied, label = 'Copy' }) {
  return (
    <button type="button" onClick={onClick} className="copy-action">
      {copied ? (
        <>
          <Check className="icon-xs" />
          Copied ✓
        </>
      ) : (
        <>
          <Copy className="icon-xs" />
          {label}
        </>
      )}
    </button>
  )
}

function PromptBlock({ title, body, copied, onCopy, children }) {
  return (
    <section className="story-card">
      <div className="story-card-head">
        <div className="card-eyebrow">{title}</div>
        <CopyButton onClick={onCopy} copied={copied} />
      </div>
      <div className="vault-mono-text">{body}</div>
      {children ? <div className="story-card-footer">{children}</div> : null}
    </section>
  )
}

function GateView({ user }) {
  if (!user) {
    return (
      <div className="page-stack story-flow-shell">
        <section className="feature-card static-card story-hero-card">
          <div className="story-gate-icon">
            <Lock className="icon-md" />
          </div>
          <div className="eyebrow">Story Flow</div>
          <h1>Story Flow Planner</h1>
          <p>
            This page turns one idea into a one-minute image-to-video production plan up to start-frame and shot review.
            Sign in first to access the planner.
          </p>
          <div className="cta-row route-actions">
            <Link href="/sign-in?next=%2Fstory-flow" className="cta-primary">
              Sign in to continue
            </Link>
            <Link href="/" className="cta-secondary">
              Back home
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack story-flow-shell">
      <section className="feature-card static-card story-hero-card">
        <div className="story-gate-icon premium">
          <Lock className="icon-md" />
        </div>
        <div className="eyebrow">Pro access required</div>
        <h1>Story Flow Planner is Pro-only in v1</h1>
        <p>
          This planner makes several structured Claude calls per project. We&apos;re keeping it Pro-only while we refine
          the workflow.
        </p>
        <div className="cta-row route-actions">
          <Link href="/pricing" className="cta-primary">
            View Pro plan
          </Link>
        </div>
      </section>
    </div>
  )
}

export default function StoryFlowClient() {
  const { user, displayName, isPro, getValidAccessToken, refreshAuthSession } = useAuth()
  const [flowState, setFlowState] = useState(initialFlowState)
  const [currentStep, setCurrentStep] = useState(1)
  const [loadingAction, setLoadingAction] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedKey, setCopiedKey] = useState('')
  const [showAllPresets, setShowAllPresets] = useState(false)
  const [selectedSceneIds, setSelectedSceneIds] = useState([])

  const unlockedStep = useMemo(() => {
    if (!flowState.treatment) return 1
    if (!flowState.sceneBreakdown.length) return 3
    if (!flowState.assetPrompts) return 4
    if (!flowState.scenePromptReview.length) return 5
    return 6
  }, [flowState])

  const requestStoryFlow = useCallback(async (payload, accessToken) => {
    const response = await fetch('/.netlify/functions/story-flow', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      },
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(data.error || `Story Flow failed (${response.status})`)
      error.status = response.status
      throw error
    }
    return data
  }, [])

  const runAction = useCallback(
    async (payload) => {
      setLoadingAction(payload.action)
      setErrorMessage('')
      try {
        let accessToken = await getValidAccessToken()
        if (!accessToken) throw new Error('Session expired. Please sign in again.')
        try {
          return await requestStoryFlow(payload, accessToken)
        } catch (error) {
          const shouldRetry = error?.status === 401 || /invalid session/i.test(String(error?.message || ''))
          if (!shouldRetry) throw error
          const { data: refreshed, error: refreshError } = await refreshAuthSession()
          accessToken = refreshed?.session?.access_token || ''
          if (refreshError || !accessToken) throw new Error('Session expired. Please sign in again.')
          return await requestStoryFlow(payload, accessToken)
        }
      } catch (error) {
        setErrorMessage(error.message || 'Unable to continue right now.')
        throw error
      } finally {
        setLoadingAction('')
      }
    },
    [getValidAccessToken, refreshAuthSession, requestStoryFlow],
  )

  const handleCopy = useCallback(async (key, value) => {
    const text = normalizeText(value)
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopiedKey(key)
    window.setTimeout(() => setCopiedKey((current) => (current === key ? '' : current)), 1500)
  }, [])

  const invalidateFrom = useCallback((step) => {
    setErrorMessage('')
    setSelectedSceneIds([])
    setFlowState((prev) => {
      if (step <= 3) {
        return { ...prev, sceneBreakdown: [], assetPrompts: null, scenePromptReview: [] }
      }
      if (step === 4) {
        return { ...prev, assetPrompts: null, scenePromptReview: [] }
      }
      if (step === 5) {
        return { ...prev, scenePromptReview: [] }
      }
      return prev
    })
  }, [])

  const handleDevelopStory = async () => {
    const idea = normalizeText(flowState.idea)
    if (!idea) {
      setErrorMessage('Enter an idea before building the story.')
      return
    }
    const data = await runAction({ action: 'develop_story', idea })
    setFlowState((prev) => ({
      ...prev,
      treatment: data.treatment,
      conceptVariables: { ...emptyConceptVariables, ...data.conceptVariables },
      recommendedSceneCount: Number(data.recommendedSceneCount || 6),
      sceneBreakdown: [],
      assetPrompts: null,
      scenePromptReview: [],
    }))
    setSelectedSceneIds([])
    setCurrentStep(2)
  }

  const handleBuildScenes = async () => {
    const data = await runAction({
      action: 'build_scenes',
      idea: flowState.idea,
      treatment: flowState.treatment,
      conceptVariables: flowState.conceptVariables,
      recommendedSceneCount: flowState.recommendedSceneCount,
    })
    setFlowState((prev) => ({
      ...prev,
      sceneBreakdown: data.scenes || [],
      assetPrompts: null,
      scenePromptReview: [],
    }))
    setSelectedSceneIds([])
    setCurrentStep(4)
  }

  const handleBuildAssets = async () => {
    const data = await runAction({
      action: 'build_assets',
      idea: flowState.idea,
      treatment: flowState.treatment,
      conceptVariables: flowState.conceptVariables,
      sceneBreakdown: flowState.sceneBreakdown,
    })
    setFlowState((prev) => ({ ...prev, assetPrompts: data, scenePromptReview: [] }))
    setSelectedSceneIds([])
    setCurrentStep(5)
  }

  const handleBuildScenePrompts = async () => {
    const data = await runAction({
      action: 'build_scene_prompts',
      idea: flowState.idea,
      treatment: flowState.treatment,
      conceptVariables: flowState.conceptVariables,
      sceneBreakdown: flowState.sceneBreakdown,
      assetPrompts: flowState.assetPrompts,
    })
    setFlowState((prev) => ({
      ...prev,
      scenePromptReview: (data.scenes || []).map((scene) => {
        const match = prev.sceneBreakdown.find((entry) => entry.id === scene.id)
        return { ...scene, title: match?.title || scene.id }
      }),
    }))
    setSelectedSceneIds([])
    setCurrentStep(6)
  }

  const setConceptField = (key, value) => {
    setFlowState((prev) => ({
      ...prev,
      conceptVariables: { ...prev.conceptVariables, [key]: value },
    }))
    invalidateFrom(3)
  }

  const updateScene = (sceneId, key, value) => {
    setFlowState((prev) => ({
      ...prev,
      sceneBreakdown: prev.sceneBreakdown.map((scene) => (scene.id === sceneId ? { ...scene, [key]: value } : scene)),
    }))
    invalidateFrom(4)
  }

  const toggleSceneSelection = (sceneId) => {
    setSelectedSceneIds((prev) => (prev.includes(sceneId) ? prev.filter((id) => id !== sceneId) : [...prev, sceneId]))
  }

  const selectedScenePromptBlocks = useMemo(
    () => flowState.scenePromptReview.filter((scene) => selectedSceneIds.includes(scene.id)),
    [flowState.scenePromptReview, selectedSceneIds],
  )

  useEffect(() => {
    if (selectedSceneIds.length && !flowState.scenePromptReview.length) {
      setSelectedSceneIds([])
    }
  }, [flowState.scenePromptReview.length, selectedSceneIds.length])

  const renderPresetCard = (preset) => {
    const isActive = flowState.conceptVariables.visualPreset === preset.key
    return (
      <button
        key={preset.key}
        type="button"
        onClick={() => setConceptField('visualPreset', isActive ? '' : preset.key)}
        className={`preset-card live-preset-card ${isActive ? 'selected' : ''}`}
        style={{ '--preset-accent': preset.accentColor }}
      >
        <img src={`/preset-thumbnails/${preset.key}.webp?v=6`} alt={preset.label} className="preset-thumb-image" />
        <div>
          <strong>{preset.label}</strong>
          <span>{preset.subtitle}</span>
          <em>{preset.whenToUse}</em>
        </div>
      </button>
    )
  }

  const renderStepNav = () => (
    <div className="story-step-grid">
      {STEP_META.map((step) => {
        const isActive = step.id === currentStep
        const isUnlocked = step.id <= unlockedStep
        const isDone = step.id < currentStep && step.id < unlockedStep
        return (
          <button
            key={step.id}
            type="button"
            disabled={!isUnlocked}
            onClick={() => isUnlocked && setCurrentStep(step.id)}
            className={`story-step-pill ${isActive ? 'active' : ''}`}
          >
            <span>Step {step.id}</span>
            <strong>{step.label}</strong>
            {isDone ? <Check className="icon-xs done" /> : null}
          </button>
        )
      })}
    </div>
  )

  const renderPipelineSidebar = () => (
    <div className="story-sidebar">
      <section className="story-card">
        <div className="card-eyebrow">Story Flow</div>
        <h2>{flowState.conceptVariables.title || 'One-minute planner'}</h2>
        <p>
          Build the story, lock the concept variables, plan the assets, then review start-frame and shot prompts scene
          by scene.
        </p>
      </section>

      {PIPELINE_PHASES.map((phase) => {
        const phaseActive = phase.steps.includes(currentStep)
        return (
          <section
            key={phase.label}
            className={`story-card story-pipeline-card ${phaseActive ? 'active' : ''}`}
            style={{ '--phase-accent': phase.color }}
          >
            <div className="card-eyebrow" style={{ color: phase.color }}>
              {phase.label}
            </div>
            <div className="chip-row wrap-row compact-gap">
              {phase.steps.map((stepId) => {
                const step = STEP_META.find((entry) => entry.id === stepId)
                return (
                  <span key={stepId} className="loop-chip">
                    {step.label}
                  </span>
                )
              })}
            </div>
            <p>{phase.note}</p>
          </section>
        )
      })}
    </div>
  )

  if (!user || !isPro) {
    return <GateView user={user} />
  }

  return (
    <div className="page-stack story-flow-shell">
      <section className="feature-card static-card story-hero-card">
        <div className="story-hero-head">
          <div>
            <div className="eyebrow">Story Flow</div>
            <h1>Story Flow Planner</h1>
            <p>
              Turn one idea into a one-minute image-to-video production plan up to approved start-frame and shot prompt
              review.
            </p>
          </div>
          <div className="story-signed-in">
            <div className="story-gate-icon">
              <Film className="icon-md" />
            </div>
            <div>
              <span>Signed in as</span>
              <strong>{displayName}</strong>
            </div>
          </div>
        </div>
      </section>

      {errorMessage ? <div className="error-card">{errorMessage}</div> : null}

      <div className="story-flow-grid">
        <div className="story-main">
          {renderStepNav()}

          <section className="feature-card static-card story-main-card">
            {currentStep === 1 ? (
              <div className="story-section-stack">
                <div>
                  <div className="card-eyebrow">Step 1</div>
                  <h2>Start with the core idea</h2>
                  <p>Keep it focused. This planner stops at prompt review, not final generation.</p>
                </div>
                <textarea
                  value={flowState.idea}
                  onChange={(event) => {
                    setFlowState((prev) => ({ ...prev, idea: event.target.value }))
                    setErrorMessage('')
                  }}
                  rows={6}
                  className="story-textarea"
                  placeholder="A girl discovers an impossible stepwell at dusk and realizes the descent changes her memory of home."
                />
                <div className="story-section-actions">
                  <p>We’ll shape the story, extract editable concept variables, then build scenes, assets, and prompt review.</p>
                  <button type="button" onClick={handleDevelopStory} disabled={!normalizeText(flowState.idea) || loadingAction === 'develop_story'} className="cta-primary">
                    {loadingAction === 'develop_story' ? <Loader2 className="icon-sm spin" /> : <Sparkles className="icon-sm" />}
                    Build story foundation
                  </button>
                </div>
              </div>
            ) : null}

            {currentStep === 2 && flowState.treatment ? (
              <div className="story-section-stack">
                <div className="story-section-actions">
                  <div>
                    <div className="card-eyebrow">Step 2</div>
                    <h2>Story treatment</h2>
                    <p>This gives us the one-minute narrative spine before we lock variables and scenes.</p>
                  </div>
                  <div className="cta-row">
                    <CopyButton
                      copied={copiedKey === 'treatment'}
                      onClick={() =>
                        handleCopy(
                          'treatment',
                          `${flowState.treatment.title}\n\nLogline\n${flowState.treatment.logline}\n\nStory Arc\n${flowState.treatment.storyArc}\n\nCreative Approach\n${flowState.treatment.creativeApproach}`,
                        )
                      }
                    />
                    <button type="button" onClick={handleDevelopStory} disabled={loadingAction === 'develop_story'} className="cta-secondary">
                      {loadingAction === 'develop_story' ? <Loader2 className="icon-sm spin" /> : <Wand2 className="icon-sm" />}
                      Regenerate
                    </button>
                  </div>
                </div>

                <div className="story-three-up">
                  <PromptBlock title="Title" body={flowState.treatment.title} copied={copiedKey === 'title'} onCopy={() => handleCopy('title', flowState.treatment.title)} />
                  <PromptBlock title="Logline" body={flowState.treatment.logline} copied={copiedKey === 'logline'} onCopy={() => handleCopy('logline', flowState.treatment.logline)} />
                  <PromptBlock title="Story Arc" body={flowState.treatment.storyArc} copied={copiedKey === 'storyArc'} onCopy={() => handleCopy('storyArc', flowState.treatment.storyArc)} />
                </div>
                <PromptBlock
                  title="Creative Approach"
                  body={flowState.treatment.creativeApproach}
                  copied={copiedKey === 'creativeApproach'}
                  onCopy={() => handleCopy('creativeApproach', flowState.treatment.creativeApproach)}
                />

                <div className="story-section-actions end">
                  <button type="button" onClick={() => setCurrentStep(3)} className="cta-primary">
                    Continue to variables
                    <ChevronRight className="icon-sm" />
                  </button>
                </div>
              </div>
            ) : null}

            {currentStep === 3 ? (
              <div className="story-section-stack">
                <div className="story-section-actions">
                  <div>
                    <div className="card-eyebrow">Step 3</div>
                    <h2>Concept variables</h2>
                    <p>Edit the story variables now. Changes here reset scenes, assets, and prompt review.</p>
                  </div>
                  <button type="button" onClick={handleBuildScenes} disabled={loadingAction === 'build_scenes'} className="cta-primary">
                    {loadingAction === 'build_scenes' ? <Loader2 className="icon-sm spin" /> : <Layers3 className="icon-sm" />}
                    Build scenes
                  </button>
                </div>

                <div className="story-input-grid">
                  {[
                    ['title', 'Title'],
                    ['protagonist', 'Protagonist'],
                    ['setting', 'Setting / world'],
                    ['conflict', 'Conflict / objective'],
                    ['tone', 'Tone'],
                    ['genreFormat', 'Genre / format'],
                  ].map(([key, label]) => (
                    <label key={key} className="story-input-label">
                      <span>{label}</span>
                      <input
                        value={flowState.conceptVariables[key]}
                        onChange={(event) => setConceptField(key, event.target.value)}
                        className="enhancer-input"
                      />
                    </label>
                  ))}
                </div>

                <div>
                  <div className="control-label">Mood</div>
                  <div className="chip-row wrap-row">
                    {MOODS.map((mood) => (
                      <button
                        key={mood}
                        type="button"
                        onClick={() => setConceptField('mood', flowState.conceptVariables.mood === mood ? '' : mood)}
                        className="filter-chip-button"
                        style={{
                          '--chip-color': '#62A7FF',
                          background: flowState.conceptVariables.mood === mood ? '#62A7FF' : 'rgba(255,255,255,0.82)',
                          color: flowState.conceptVariables.mood === mood ? '#fff' : 'var(--text-secondary)',
                        }}
                      >
                        {mood}
                      </button>
                    ))}
                  </div>
                </div>

                <section className="story-card">
                  <div className="story-section-actions">
                    <div>
                      <div className="control-label">Style Preset</div>
                      <p>Choose the visual grammar that should guide the entire one-minute plan.</p>
                    </div>
                    <button type="button" onClick={() => setShowAllPresets((prev) => !prev)} className="more-styles-pill">
                      {showAllPresets ? 'Show fewer' : 'More styles'}
                    </button>
                  </div>
                  <div className="preset-grid live-preset-grid">
                    {FEATURED_PRESETS.map((preset) => renderPresetCard(preset))}
                  </div>
                  {showAllPresets ? <div className="preset-grid live-preset-grid expanded">{EXTRA_PRESETS.map((preset) => renderPresetCard(preset))}</div> : null}
                </section>
              </div>
            ) : null}

            {currentStep === 4 ? (
              <div className="story-section-stack">
                <div className="story-section-actions">
                  <div>
                    <div className="card-eyebrow">Step 4</div>
                    <h2>Scene breakdown</h2>
                    <p>Edit the scenes if needed, then lock the reusable assets for continuity.</p>
                  </div>
                  <button type="button" onClick={handleBuildAssets} disabled={loadingAction === 'build_assets'} className="cta-primary">
                    {loadingAction === 'build_assets' ? <Loader2 className="icon-sm spin" /> : <Sparkles className="icon-sm" />}
                    Build assets
                  </button>
                </div>

                <div className="story-scene-list">
                  {flowState.sceneBreakdown.map((scene, index) => (
                    <section key={scene.id} className="story-card story-scene-card">
                      <div className="story-scene-head">
                        <div>
                          <div className="card-eyebrow">Scene {index + 1}</div>
                          <h3>{scene.title}</h3>
                        </div>
                        <label className="story-duration-pill">
                          <span>Duration</span>
                          <input
                            type="number"
                            min="5"
                            max="20"
                            value={scene.durationSeconds}
                            onChange={(event) => updateScene(scene.id, 'durationSeconds', Number(event.target.value || 10))}
                          />
                        </label>
                      </div>
                      <div className="story-input-grid">
                        {[
                          ['title', 'Scene title'],
                          ['purpose', 'Dramatic purpose'],
                          ['visualBeat', 'Visual beat'],
                          ['location', 'Location'],
                        ].map(([key, label]) => (
                          <label key={`${scene.id}-${key}`} className="story-input-label">
                            <span>{label}</span>
                            <textarea
                              rows={key === 'visualBeat' ? 4 : 2}
                              value={scene[key] || ''}
                              onChange={(event) => updateScene(scene.id, key, event.target.value)}
                              className="story-textarea compact"
                            />
                          </label>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>
              </div>
            ) : null}

            {currentStep === 5 && flowState.assetPrompts ? (
              <div className="story-section-stack">
                <div className="story-section-actions">
                  <div>
                    <div className="card-eyebrow">Step 5</div>
                    <h2>Asset development</h2>
                    <p>These prompts lock characters, locations, props, and continuity before shot review.</p>
                  </div>
                  <button type="button" onClick={handleBuildScenePrompts} disabled={loadingAction === 'build_scene_prompts'} className="cta-primary">
                    {loadingAction === 'build_scene_prompts' ? <Loader2 className="icon-sm spin" /> : <Film className="icon-sm" />}
                    Build review prompts
                  </button>
                </div>

                <div className="story-asset-grid">
                  {[
                    ['Character prompts', flowState.assetPrompts.characterPrompts],
                    ['Location prompts', flowState.assetPrompts.locationPrompts],
                    ['Prop prompts', flowState.assetPrompts.propPrompts],
                  ].map(([title, entries]) => (
                    <section key={title} className="story-card">
                      <div className="card-eyebrow">{title}</div>
                      <div className="story-asset-list">
                        {(entries || []).map((entry) => (
                          <div key={`${title}-${entry.name}`} className="story-asset-item">
                            <strong>{entry.name}</strong>
                            <p>{entry.prompt}</p>
                            {entry.usage ? <span>{entry.usage}</span> : null}
                          </div>
                        ))}
                      </div>
                    </section>
                  ))}
                </div>

                <section className="story-card">
                  <div className="story-card-head">
                    <div className="card-eyebrow">Continuity notes</div>
                    <CopyButton
                      copied={copiedKey === 'continuity'}
                      onClick={() => handleCopy('continuity', (flowState.assetPrompts.continuityNotes || []).join('\n'))}
                    />
                  </div>
                  <ul className="benefit-list compact">
                    {(flowState.assetPrompts.continuityNotes || []).map((note) => (
                      <li key={note}>{note}</li>
                    ))}
                  </ul>
                </section>
              </div>
            ) : null}

            {currentStep === 6 ? (
              <div className="story-section-stack">
                <div className="story-section-actions">
                  <div>
                    <div className="card-eyebrow">Step 6</div>
                    <h2>Image / shot prompt review</h2>
                    <p>Select the strongest scenes locally, then copy the full set or just the selected ones.</p>
                  </div>
                  <div className="cta-row">
                    <CopyButton
                      copied={copiedKey === 'all-scenes'}
                      onClick={() => handleCopy('all-scenes', joinScenePromptBundle(flowState.scenePromptReview))}
                      label="Copy All"
                    />
                    <CopyButton
                      copied={copiedKey === 'selected-scenes'}
                      onClick={() => handleCopy('selected-scenes', joinScenePromptBundle(selectedScenePromptBlocks))}
                      label="Copy Selected"
                    />
                  </div>
                </div>

                <div className="story-review-list">
                  {flowState.scenePromptReview.map((scene, index) => {
                    const selected = selectedSceneIds.includes(scene.id)
                    return (
                      <section key={scene.id} className={`story-card story-review-card ${selected ? 'selected' : ''}`}>
                        <div className="story-section-actions">
                          <div>
                            <div className="card-eyebrow">Scene {index + 1}</div>
                            <h3>{scene.title || scene.id}</h3>
                          </div>
                          <button type="button" onClick={() => toggleSceneSelection(scene.id)} className={`more-styles-pill ${selected ? 'selected' : ''}`}>
                            {selected ? 'Selected' : 'Select'}
                          </button>
                        </div>
                        <div className="story-two-up">
                          <PromptBlock
                            title="Start Frame Prompt"
                            body={scene.imagePrompt}
                            copied={copiedKey === `${scene.id}-image`}
                            onCopy={() => handleCopy(`${scene.id}-image`, scene.imagePrompt)}
                          />
                          <PromptBlock
                            title="Shot Prompt"
                            body={scene.shotPrompt}
                            copied={copiedKey === `${scene.id}-shot`}
                            onCopy={() => handleCopy(`${scene.id}-shot`, scene.shotPrompt)}
                          >
                            {scene.selectionNote ? <div className="story-selection-note">{scene.selectionNote}</div> : null}
                          </PromptBlock>
                        </div>
                      </section>
                    )
                  })}
                </div>
              </div>
            ) : null}
          </section>
        </div>

        {renderPipelineSidebar()}
      </div>
    </div>
  )
}
