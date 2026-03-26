'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { Check, Copy, Sparkles, Wand2, Zap, Palette, Film, Plus } from 'lucide-react'
import STYLE_PRESETS from '../data/stylePresets.json'
import { useAuth } from '../contexts/AuthContext'
const MOODS = ['Epic', 'Dramatic', 'Thought-Provoking', 'Whimsical', 'Serene', 'Mysterious', 'Energetic', 'Eerie', 'Calm', 'Surreal', 'Hopeful', 'Melancholic', 'Tense', 'Playful', 'Dreamlike']
const MOOD_COLORS = {
  Epic: '#8B5CF6',
  Dramatic: '#EC4899',
  'Thought-Provoking': '#F59E0B',
  Whimsical: '#10B981',
  Serene: '#06B6D4',
  Mysterious: '#6366F1',
  Energetic: '#FF7043',
  Eerie: '#B0BEC5',
  Calm: '#4CAF50',
  Surreal: '#9C27B0',
  Hopeful: '#FFC107',
  Melancholic: '#607D8B',
  Tense: '#F44336',
  Playful: '#FFEB3B',
  Dreamlike: '#9575CD',
}

const USES_CATEGORIES = {
  Commercial: { items: ['Product Showcase', 'Brand Ad', 'Spec Ad', 'Logo Reveal'], color: '#8B5CF6' },
  Social: { items: ['Short-form', 'Social Media', 'Event Promo', 'Recruitment'], color: '#F59E0B' },
  Story: { items: ['Storytelling', 'Short Film', 'Documentary', 'Visual Essay'], color: '#3B82F6' },
  Learn: { items: ['Education', 'Explainer', 'Podcast Visuals'], color: '#10B981' },
}
const USES = Object.values(USES_CATEGORIES).flatMap((category) => category.items)
const USE_COLORS = Object.fromEntries(
  Object.values(USES_CATEGORIES).flatMap((category) => category.items.map((item) => [item, category.color])),
)

const INTERPRETATIONS = [
  { key: 'directors-cut', label: "Director's Cut", icon: Film, color: '#8B5CF6' },
  { key: 'luxury-commercial', label: 'Luxury Commercial', icon: Sparkles, color: '#0EA5E9' },
  { key: 'vfx-spectacle', label: 'VFX Spectacle', icon: Zap, color: '#10B981' },
  { key: 'prestige-animation', label: 'Prestige Animation', icon: Palette, color: '#F59E0B' },
]

const PRO_DETAILS = [
  { key: 'camera', label: '+ Camera Movement' },
  { key: 'lens', label: '+ Lens Type' },
]

const PRO_DETAIL_TEXT = {
  camera: ' Smooth gimbal tracking shot.',
  lens: ' Shot on 50mm lens, shallow depth of field.',
}

const STYLE_PRESET_MAP = new Map(STYLE_PRESETS.map((preset) => [preset.key, preset]))
const FEATURED_STYLE_PRESETS = STYLE_PRESETS.filter((preset) => preset.featured)
const EXTRA_STYLE_PRESETS = STYLE_PRESETS.filter((preset) => !preset.featured)

const AUDIO_KEYWORDS_REGEX = /\b(audio|sound|sfx|music|foley|ambien|voiceover|soundscape|dialogue)\b/i
const IMAGE_KEYWORDS_REGEX = /\b(image|still|frame|composition|framing|palette|texture|detail pass|render)\b/i

const USAGE_SCHEMA_VERSION = 3
const FREE_USAGE_KEY = 'cwfFreeUsageTotal'
const FREE_TOTAL_LIMIT = 5
const ENHANCER_CACHE_STORAGE_KEY = 'cwf_prompt_enhancer_cache_v1'
const ENHANCER_CACHE_TTL_MS = 30 * 60 * 1000

const getUsageData = () => {
  const data = localStorage.getItem(FREE_USAGE_KEY)
  const defaultData = { count: 0, lastReset: new Date().toISOString(), schemaVersion: USAGE_SCHEMA_VERSION }
  if (!data) return defaultData
  try {
    const parsed = JSON.parse(data)
    if (!parsed || parsed.schemaVersion !== USAGE_SCHEMA_VERSION) return defaultData
    return { ...defaultData, ...parsed, count: Number.isFinite(parsed.count) ? parsed.count : 0 }
  } catch {
    return defaultData
  }
}

const saveUsageData = (data) => {
  localStorage.setItem(FREE_USAGE_KEY, JSON.stringify({ ...data, schemaVersion: USAGE_SCHEMA_VERSION }))
}

const shouldResetMonthly = (lastReset) => {
  const last = new Date(lastReset)
  const now = new Date()
  return last.getMonth() !== now.getMonth() || last.getFullYear() !== now.getFullYear()
}

const readSessionEnhancerCache = () => {
  try {
    const raw = sessionStorage.getItem(ENHANCER_CACHE_STORAGE_KEY)
    const parsed = raw ? JSON.parse(raw) : {}
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

const writeSessionEnhancerCache = (cache) => {
  try {
    sessionStorage.setItem(ENHANCER_CACHE_STORAGE_KEY, JSON.stringify(cache))
  } catch {}
}

const buildCacheKey = (mode, payload, userId = 'anon') =>
  JSON.stringify({
    userId,
    mode,
    idea: String(payload.idea || '').trim(),
    mood: String(payload.mood || '').trim(),
    useCase: String(payload.useCase || '').trim(),
    preset: String(payload.preset || '').trim(),
    skillLevel: String(payload.skillLevel || '').trim(),
    interpretation: String(payload.interpretation || '').trim(),
    includeAudioSfx: Boolean(payload.includeAudioSfx),
    includeImages: Boolean(payload.includeImages),
  })

const buildAudioSfxDetails = (mood, useCase, skillLevel = 'beginner', presetKey = '') => {
  const moodSfx = {
    Epic: 'deep cinematic hits and rising orchestral swells',
    Dramatic: 'low tense pulses with restrained room tone',
    Whimsical: 'light playful motifs with soft foley accents',
    Serene: 'gentle ambient bed with subtle natural textures',
    Mysterious: 'subtle drones and distant textured ambience',
    Energetic: 'tight percussive rhythm with punchy transitions',
    Eerie: 'minimal unsettling drones and sparse eerie foley',
  }

  const useSfx = {
    'Product Showcase': 'clean polished foley for material details',
    'Brand Ad': 'premium branded sonic texture',
    Storytelling: 'emotion-led ambience matched to scene beats',
    Documentary: 'natural location ambience and grounded foley',
    Explainer: 'clean minimal background audio with clear focus',
    'Social Media': 'short punchy sound accents for hooks',
  }

  const preset = STYLE_PRESET_MAP.get(String(presetKey || '').trim())
  const presetLayer = preset?.sfxTraits ? `, ${preset.sfxTraits}` : ''
  const moodLayer = moodSfx[mood] || 'subtle cinematic ambience'
  const useLayer = useSfx[useCase] || 'realistic environmental foley'

  if (skillLevel === 'pro') {
    return `Audio design: ${moodLayer}, ${useLayer}${presetLayer}, balanced mix with controlled dynamics.`
  }
  return `Audio/SFX: ${moodLayer} with ${useLayer}${presetLayer}.`
}

const buildImageDetails = (mood, useCase, skillLevel = 'beginner', presetKey = '') => {
  const moodVisual = {
    Epic: 'hero composition with dramatic scale and layered depth',
    Dramatic: 'high-contrast framing with intentional negative space',
    Whimsical: 'playful color palette with stylized texture accents',
    Serene: 'balanced composition with soft gradients and calm spacing',
    Mysterious: 'low-key framing with silhouette-led depth separation',
    Energetic: 'dynamic diagonals with punchy color contrast',
    Eerie: 'off-center framing with unsettling tonal control',
  }
  const useVisual = {
    'Product Showcase': 'clean product hero framing with material realism',
    'Brand Ad': 'premium ad-grade composition with polished highlights',
    Storytelling: 'cinematic scene composition with clear focal hierarchy',
    Documentary: 'naturalistic framing and grounded visual texture',
    Explainer: 'clear educational framing with readable visual priority',
    'Social Media': 'scroll-stopping composition with strong subject isolation',
  }

  const preset = STYLE_PRESET_MAP.get(String(presetKey || '').trim())
  const presetLayer = preset?.imageTraits ? `, ${preset.imageTraits}` : ''
  const moodLayer = moodVisual[mood] || 'intentional composition and clean visual hierarchy'
  const useLayer = useVisual[useCase] || 'balanced composition for versatile generation'

  if (skillLevel === 'pro') {
    return `Image details: ${moodLayer}, ${useLayer}${presetLayer}, controlled color palette and texture fidelity.`
  }
  return `Image details: ${moodLayer} with ${useLayer}${presetLayer}.`
}

const applyAudioPreference = (prompt, includeAudioSfx, mood, useCase, skillLevel, presetKey = '') => {
  const normalizedPrompt = String(prompt || '').trim()
  if (!normalizedPrompt) return normalizedPrompt
  if (includeAudioSfx) {
    if (AUDIO_KEYWORDS_REGEX.test(normalizedPrompt)) return normalizedPrompt
    return `${normalizedPrompt} ${buildAudioSfxDetails(mood, useCase, skillLevel, presetKey)}`.trim()
  }
  const cleaned = normalizedPrompt
    .split(/(?<=[.!?])\s+/)
    .filter((line) => !AUDIO_KEYWORDS_REGEX.test(line))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return cleaned || normalizedPrompt
}

const applyImagePreference = (prompt, includeImageDetails, mood, useCase, skillLevel, presetKey = '') => {
  const normalizedPrompt = String(prompt || '').trim()
  if (!normalizedPrompt) return normalizedPrompt
  if (includeImageDetails) {
    if (IMAGE_KEYWORDS_REGEX.test(normalizedPrompt)) return normalizedPrompt
    return `${normalizedPrompt} ${buildImageDetails(mood, useCase, skillLevel, presetKey)}`.trim()
  }
  const cleaned = normalizedPrompt
    .split(/(?<=[.!?])\s+/)
    .filter((line) => !/^Image details:/i.test(line.trim()))
    .join(' ')
    .replace(/\s{2,}/g, ' ')
    .trim()
  return cleaned || normalizedPrompt
}

const applySelectedProDetails = (prompt, detailKeys) => {
  const base = String(prompt || '').trim()
  if (!base) return base
  if (!Array.isArray(detailKeys) || detailKeys.length === 0) return base
  return detailKeys.reduce((current, key) => `${current}${PRO_DETAIL_TEXT[key] || ''}`, base).trim()
}

const parsePromptSections = (prompt) => {
  const raw = String(prompt || '').trim()
  if (!raw) return { videoPrompt: '', imagePrompt: '', sfxPrompt: '' }

  let working = raw
  let imagePrompt = ''
  let sfxPrompt = ''

  const imageMatch = working.match(/Image details:\s*([\s\S]*?)(?=(?:Audio\/SFX:)|$)/i)
  if (imageMatch) {
    imagePrompt = String(imageMatch[1] || '').trim().replace(/[.\s]+$/g, '').trim()
    working = working.replace(imageMatch[0], ' ').trim()
  }

  const sfxMatch = working.match(/Audio\/SFX:\s*([\s\S]*?)(?=(?:Image details:)|$)/i)
  if (sfxMatch) {
    sfxPrompt = String(sfxMatch[1] || '').trim().replace(/[.\s]+$/g, '').trim()
    working = working.replace(sfxMatch[0], ' ').trim()
  }

  const videoPrompt = working.replace(/\s{2,}/g, ' ').replace(/[.\s]+$/g, '').trim()
  return { videoPrompt, imagePrompt, sfxPrompt }
}

const buildStartFramePrompt = ({ videoPrompt, imagePrompt }) => {
  const parts = [videoPrompt, imagePrompt ? `Image details: ${imagePrompt}` : ''].filter(Boolean)
  return parts.join('. ').replace(/\.\s*Image details:/, '. Image details:')
}

export default function PromptEnhancerClient() {
  const [idea, setIdea] = useState('')
  const [mood, setMood] = useState('')
  const [useCase, setUseCase] = useState('')
  const [preset, setPreset] = useState('')
  const [showAllPresets, setShowAllPresets] = useState(false)
  const [skillLevel, setSkillLevel] = useState('beginner')
  const [includeAudioSfx, setIncludeAudioSfx] = useState(false)
  const [includeImageDetails, setIncludeImageDetails] = useState(false)
  const [addedDetails, setAddedDetails] = useState([])
  const [loading, setLoading] = useState(false)
  const [loadingMode, setLoadingMode] = useState('')
  const [result, setResult] = useState('')
  const [baseResult, setBaseResult] = useState('')
  const [usage, setUsage] = useState({ count: 0, lastReset: new Date().toISOString() })
  const [hasGeneratedOnce, setHasGeneratedOnce] = useState(false)
  const [generationError, setGenerationError] = useState('')
  const [copiedSection, setCopiedSection] = useState('')
  const { user, loading: authLoading, isPro: canUsePro, getValidAccessToken, refreshAuthSession } = useAuth()
  const requestIdRef = useRef(0)
  const enhancerCacheRef = useRef({})
  const lastParamsRef = useRef({ idea: '', mood: '', useCase: '', preset: '', skillLevel: 'beginner', includeAudioSfx: false, includeImageDetails: false })

  const remainingFree = Math.max(0, FREE_TOTAL_LIMIT - usage.count)
  const isLimitReached = !canUsePro && remainingFree === 0
  const canSubmit = idea.trim().length > 3 && !loading && !isLimitReached
  const selectedPreset = useMemo(() => STYLE_PRESET_MAP.get(preset) || null, [preset])
  const standardSections = useMemo(() => parsePromptSections(result), [result])
  const startFramePrompt = useMemo(() => buildStartFramePrompt(standardSections), [standardSections])

  useEffect(() => {
    enhancerCacheRef.current = readSessionEnhancerCache()
    const data = getUsageData()
    if (shouldResetMonthly(data.lastReset)) {
      const resetData = { count: 0, lastReset: new Date().toISOString() }
      saveUsageData(resetData)
      setUsage(resetData)
    } else {
      setUsage(data)
    }
  }, [])

  const requestEnhancedPrompt = useCallback(async (payload, accessToken) => {
    const requestHeaders = { 'Content-Type': 'application/json' }
    if (accessToken) requestHeaders.Authorization = `Bearer ${accessToken}`
    const response = await fetch('/.netlify/functions/enhance-prompt', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    })
    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(data?.error || `Enhancer failed (${response.status})`)
      error.status = response.status
      throw error
    }
    return data
  }, [])

  const getCachedEnhancerResponse = useCallback((mode, payload) => {
    const key = buildCacheKey(mode, payload, user?.id)
    const existing = enhancerCacheRef.current[key]
    if (!existing) return null
    if (Date.now() - Number(existing.storedAt || 0) > ENHANCER_CACHE_TTL_MS) {
      delete enhancerCacheRef.current[key]
      writeSessionEnhancerCache(enhancerCacheRef.current)
      return null
    }
    return existing.value ?? null
  }, [user?.id])

  const setCachedEnhancerResponse = useCallback((mode, payload, value) => {
    const key = buildCacheKey(mode, payload, user?.id)
    enhancerCacheRef.current = { ...enhancerCacheRef.current, [key]: { storedAt: Date.now(), value } }
    writeSessionEnhancerCache(enhancerCacheRef.current)
  }, [user?.id])

  const handleEnhance = useCallback(async (isAutoUpdate = false, interpretationStyle = null) => {
    if (!canSubmit && !interpretationStyle) return
    const requestId = ++requestIdRef.current
    setLoading(true)
    setLoadingMode(interpretationStyle ? 'interpretation' : 'enhance')
    setGenerationError('')

    try {
      const promptPayload = interpretationStyle
        ? { idea, mood, useCase, preset, interpretation: interpretationStyle, skillLevel, includeAudioSfx, includeImages: includeImageDetails }
        : { idea, mood, useCase, preset, skillLevel, includeAudioSfx, includeImages: includeImageDetails }

      const cached = getCachedEnhancerResponse('enhance', promptPayload)
      let data = cached

      if (!data) {
        const accessToken = await getValidAccessToken()
        if (user && !accessToken) {
          setLoading(false)
          setLoadingMode('')
          setGenerationError('Session expired. Please sign in again.')
          return
        }
        try {
          data = await requestEnhancedPrompt(promptPayload, accessToken)
        } catch (err) {
          const shouldRetryAuth = err?.status === 401 || /invalid session/i.test(String(err?.message || ''))
          if (!shouldRetryAuth) throw err
          const { data: refreshed, error: refreshError } = await refreshAuthSession()
          const refreshedToken = refreshed?.session?.access_token
          if (refreshError || !refreshedToken) throw new Error('Session expired. Please sign in again.')
          data = await requestEnhancedPrompt(promptPayload, refreshedToken)
        }
        setCachedEnhancerResponse('enhance', promptPayload, data)
      }

      if (!cached && !canUsePro && !interpretationStyle && !isAutoUpdate) {
        const nextUsage = { ...usage, count: usage.count + 1 }
        saveUsageData(nextUsage)
        setUsage(nextUsage)
      }

      const enhancedPrompt = String(data?.prompt || '').trim()
      if (!enhancedPrompt) throw new Error('Prompt generation returned an empty response. Please retry.')
      const withAudio = applyAudioPreference(enhancedPrompt, includeAudioSfx, mood, useCase, skillLevel, preset)
      const nextBaseResult = applyImagePreference(withAudio, includeImageDetails, mood, useCase, skillLevel, preset)
      if (requestId !== requestIdRef.current) return
      const nextResult = applySelectedProDetails(nextBaseResult, addedDetails)
      setBaseResult(nextBaseResult)
      setResult(nextResult)
      setHasGeneratedOnce(true)
      setCopiedSection('')
      lastParamsRef.current = { idea, mood, useCase, preset, skillLevel, includeAudioSfx, includeImageDetails }
    } catch (err) {
      if (requestId !== requestIdRef.current) return
      setGenerationError(err?.message || 'Unable to generate prompt right now. Please retry.')
    }

    if (requestId === requestIdRef.current) {
      setLoading(false)
      setLoadingMode('')
    }
  }, [addedDetails, canSubmit, canUsePro, getCachedEnhancerResponse, getValidAccessToken, idea, includeAudioSfx, includeImageDetails, mood, preset, refreshAuthSession, requestEnhancedPrompt, setCachedEnhancerResponse, skillLevel, usage, useCase, user])

  useEffect(() => {
    if (!baseResult) return
    setResult(applySelectedProDetails(baseResult, addedDetails))
  }, [addedDetails, baseResult])

  useEffect(() => {
    if (!(hasGeneratedOnce && canSubmit)) return
    const paramsChanged =
      idea !== lastParamsRef.current.idea ||
      mood !== lastParamsRef.current.mood ||
      useCase !== lastParamsRef.current.useCase ||
      preset !== lastParamsRef.current.preset ||
      skillLevel !== lastParamsRef.current.skillLevel ||
      includeAudioSfx !== lastParamsRef.current.includeAudioSfx ||
      includeImageDetails !== lastParamsRef.current.includeImageDetails
    if (!paramsChanged) return
    const timeoutId = window.setTimeout(() => handleEnhance(true), 500)
    return () => window.clearTimeout(timeoutId)
  }, [canSubmit, handleEnhance, hasGeneratedOnce, idea, includeAudioSfx, includeImageDetails, mood, preset, skillLevel, useCase])

  const handleCopySection = async (key, text) => {
    if (!text) return
    await navigator.clipboard.writeText(text)
    setCopiedSection(key)
    window.setTimeout(() => setCopiedSection((current) => (current === key ? '' : current)), 2000)
  }

  const enhanceButtonLabel = loading
    ? loadingMode === 'interpretation'
      ? 'Enhancing...'
      : includeImageDetails
        ? 'Building Start Frame...'
        : 'Building Prompt...'
    : 'Enhance'

  return (
    <div className="page-stack enhancer-live-shell">
      <div className="section-heading left compact-heading">
        <div className="eyebrow">AI Prompt Enhancer</div>
        <h1>Describe the shot in your head. We&apos;ll translate it for the machine.</h1>
        <p>
          Start from your own idea, then shape it with mood, style presets, and pro-level prompt detail before you move into production.
        </p>
        {!canUsePro ? (
          <div className="usage-pill warnable">
            {remainingFree > 0
              ? `${remainingFree} free generations left this month across Enhancer + Shot to Prompt`
              : 'Free limit reached — upgrade to continue'}
          </div>
        ) : (
          <div className="usage-pill success">Pro access active</div>
        )}
      </div>

      {generationError ? <div className="error-card">{generationError}</div> : null}

      <section className="feature-card static-card enhancer-card">
        <div className="enhancer-top-row">
          <input
            value={idea}
            onChange={(event) => setIdea(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && canSubmit) handleEnhance(false)
            }}
            placeholder="e.g. a lone boxer wrapping hands in a fluorescent locker room before the fight..."
            className="enhancer-input"
          />
          <button type="button" onClick={() => handleEnhance(false)} disabled={!canSubmit} className="enhance-primary">
            <Wand2 className="icon-sm" />
            {enhanceButtonLabel}
          </button>
        </div>

        <div className="enhancer-control-stack">
          <div className="toggle-row enhancer-settings-row">
            <div className="home-setting-stack enhancer-setting-stack">
              <div className="home-setting-row">
                <span className="setting-label sentence">Level</span>
                <div className="switch-pair">
                  <button
                    type="button"
                    onClick={() => setSkillLevel('beginner')}
                    className={`switch-side interactive ${skillLevel === 'beginner' ? 'active blue' : ''}`}
                  >
                    Essential
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillLevel((current) => (current === 'beginner' ? 'pro' : 'beginner'))}
                    className={`soft-switch interactive ${skillLevel === 'beginner' ? 'static blue' : 'static purple on'}`}
                    aria-label={`Toggle level, currently ${skillLevel === 'beginner' ? 'Essential' : 'Pro'}`}
                  >
                    <span className="soft-switch-knob" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setSkillLevel('pro')}
                    className={`switch-side interactive ${skillLevel === 'pro' ? 'active purple-text' : ''}`}
                  >
                    Pro
                  </button>
                  <span className="setting-note-pill">camera + lens</span>
                </div>

                <div className="switch-pair">
                  <button
                    type="button"
                    onClick={() => setIncludeImageDetails(false)}
                    className={`switch-side interactive ${!includeImageDetails ? 'active subtle' : ''}`}
                  >
                    Images Off
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeImageDetails((prev) => !prev)}
                    className={`soft-switch interactive ${includeImageDetails ? 'static green on' : ''}`}
                    aria-label={`Toggle images ${includeImageDetails ? 'on' : 'off'}`}
                  >
                    <span className="soft-switch-knob" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeImageDetails(true)}
                    className={`switch-side interactive ${includeImageDetails ? 'active green-text' : ''}`}
                  >
                    On
                  </button>
                  <span className="setting-note-pill">create a START FRAME</span>
                </div>
              </div>

              <div className="home-setting-caption">Simple language, optional add-ons</div>

              <div className="home-setting-row secondary enhancer-secondary-row">
                <span className="setting-label sentence">SFX</span>
                <div className="switch-pair">
                  <button
                    type="button"
                    onClick={() => setIncludeAudioSfx(false)}
                    className={`switch-side interactive ${!includeAudioSfx ? 'active subtle' : ''}`}
                  >
                    Off
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeAudioSfx((prev) => !prev)}
                    className={`soft-switch interactive ${includeAudioSfx ? 'static amber on' : ''}`}
                    aria-label={`Toggle SFX ${includeAudioSfx ? 'on' : 'off'}`}
                  >
                    <span className="soft-switch-knob" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setIncludeAudioSfx(true)}
                    className={`switch-side interactive ${includeAudioSfx ? 'active amber-text' : ''}`}
                  >
                    On
                  </button>
                </div>
                <span className="home-setting-caption">Output stays visual-only</span>
              </div>
            </div>
          </div>

          <div className="control-block">
            <span className="control-label">Mood</span>
            <div className="chip-row wrap-row">
              {MOODS.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setMood(mood === item ? '' : item)}
                  className={`filter-chip enhancer-chip-button ${mood === item ? 'selected' : ''}`}
                  style={{ '--chip-color': MOOD_COLORS[item], '--chip-selected': MOOD_COLORS[item] }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          <div className="control-block">
            <div className="preset-header-row">
              <span className="control-label">Style Presets</span>
              <span className="preset-helper">
                Choose a cinematic visual grammar inspired by iconic filmmakers. Mood sets emotional tone; presets shape lensing, framing, lighting, palette, and movement language.
              </span>
            </div>
            <div className="preset-grid live-preset-grid">
              {FEATURED_STYLE_PRESETS.map((item) => (
                <button
                  key={item.key}
                  type="button"
                  onClick={() => setPreset(preset === item.key ? '' : item.key)}
                  className={`preset-card live-preset-card ${preset === item.key ? 'selected' : ''}`}
                  style={{ '--preset-accent': item.accentColor }}
                >
                  <div className="preset-thumb" style={{ backgroundImage: `url(/preset-thumbnails/${item.key}.webp)` }} />
                  <div>
                    <strong>{item.label}</strong>
                    <span>{item.subtitle}</span>
                    <em>{item.whenToUse}</em>
                  </div>
                </button>
              ))}
            </div>
            <div className="more-styles-row live-more-row">
              <button type="button" className="more-styles-pill" onClick={() => setShowAllPresets((prev) => !prev)}>
                {showAllPresets ? 'Hide extra styles' : 'More styles'}
              </button>
              {!showAllPresets ? <span className="muted-inline">Nordic Noir · Dreamscape · Tokyo Night Drift</span> : null}
            </div>
            {showAllPresets ? (
              <div className="preset-grid live-preset-grid expanded">
                {EXTRA_STYLE_PRESETS.map((item) => (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => setPreset(preset === item.key ? '' : item.key)}
                    className={`preset-card live-preset-card ${preset === item.key ? 'selected' : ''}`}
                    style={{ '--preset-accent': item.accentColor }}
                  >
                    <div className="preset-thumb" style={{ backgroundImage: `url(/preset-thumbnails/${item.key}.webp)` }} />
                    <div>
                      <strong>{item.label}</strong>
                      <span>{item.subtitle}</span>
                      <em>{item.whenToUse}</em>
                    </div>
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="control-block">
            <span className="control-label">Use</span>
            <div className="chip-row wrap-row">
              {USES.map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setUseCase(useCase === item ? '' : item)}
                  className={`filter-chip enhancer-chip-button ${useCase === item ? 'selected' : ''}`}
                  style={{ '--chip-color': USE_COLORS[item], '--chip-selected': USE_COLORS[item] }}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {result ? (
        <section className="feature-card static-card enhancer-output-shell">
          {includeImageDetails ? (
            <div className="output-card live-output-card">
              <div className="output-header">
                <span className="output-label image">Start Frame Prompt</span>
                <button type="button" className="copy-action" onClick={() => handleCopySection('start_frame', startFramePrompt)}>
                  {copiedSection === 'start_frame' ? 'Copied ✓' : 'Copy Start Frame'}
                </button>
              </div>
              <p className="mono-output">{startFramePrompt}</p>
            </div>
          ) : null}

          {standardSections.videoPrompt ? (
            <div className="output-card live-output-card">
              <div className="output-header">
                <span className="output-label video">Video Prompt</span>
                <button type="button" className="copy-action" onClick={() => handleCopySection('video_prompt', standardSections.videoPrompt)}>
                  {copiedSection === 'video_prompt' ? 'Copied ✓' : 'Copy Video Prompt'}
                </button>
              </div>
              <p className="mono-output">{standardSections.videoPrompt}</p>
            </div>
          ) : null}

          {standardSections.sfxPrompt ? (
            <div className="output-card live-output-card">
              <div className="output-header">
                <span className="output-label audio">SFX Prompt</span>
                <button type="button" className="copy-action" onClick={() => handleCopySection('sfx_prompt', standardSections.sfxPrompt)}>
                  {copiedSection === 'sfx_prompt' ? 'Copied ✓' : 'Copy SFX Prompt'}
                </button>
              </div>
              <p className="mono-output">{standardSections.sfxPrompt}</p>
            </div>
          ) : null}

          {skillLevel === 'beginner' ? (
            <div className="pro-details-shell">
              <div className="card-eyebrow">Want more control?</div>
              <div className="chip-row wrap-row">
                {PRO_DETAILS.map((detail) => (
                  <button
                    key={detail.key}
                    type="button"
                    onClick={() =>
                      setAddedDetails((previous) =>
                        previous.includes(detail.key)
                          ? previous.filter((key) => key !== detail.key)
                          : [...previous, detail.key],
                      )
                    }
                    className={`pill-toggle ${addedDetails.includes(detail.key) ? 'active amber' : ''}`}
                  >
                    {addedDetails.includes(detail.key) ? <Check className="icon-xs" /> : <Plus className="icon-xs" />}
                    {detail.label}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          <div className="interpretation-shell">
            <div className="card-eyebrow">Generate interpretation passes</div>
            <div className="chip-row wrap-row">
              {INTERPRETATIONS.map((item) => {
                const Icon = item.icon
                return (
                  <button key={item.key} type="button" onClick={() => handleEnhance(false, item.key)} className="interpretation-button" disabled={loading} style={{ '--interp-color': item.color }}>
                    <Icon className="icon-xs" />
                    {item.label}
                  </button>
                )
              })}
            </div>
          </div>
        </section>
      ) : null}

      {!result ? (
        <section className="enhancer-preview-grid">
          <div className="output-card live-output-card preview-output-card">
            <div className="output-header">
              <span className="output-label image">Start Frame Prompt</span>
              <span className="output-preview-tag">Essential</span>
            </div>
            <p>
              Visual grammar, palette, lensing, and composition anchored to the chosen mood and preset.
            </p>
          </div>
          <div className="output-card live-output-card preview-output-card">
            <div className="output-header">
              <span className="output-label video">Video Prompt</span>
              <span className="output-preview-tag">Pro-ready</span>
            </div>
            <p>
              Camera movement, pacing, and continuity layered onto the same visual identity.
            </p>
          </div>
        </section>
      ) : (
        <section className="feature-card static-card helper-card">
          <div className="card-eyebrow">What works best next</div>
          <ul className="benefit-list compact">
            <li>Use Shot to Prompt when you have a film still or reference frame instead of a written idea.</li>
            <li>Use Prompt Vault when you want variable-driven prompt structures and pro controls.</li>
            <li>Stay in Essential for cleaner outputs, then move to Pro when you need stronger production detail.</li>
          </ul>
          <div className="cta-row route-actions helper-actions">
            <Link href="/shot-to-prompt" className="cta-secondary">Open Shot to Prompt</Link>
            <Link href="/prompts" className="cta-primary">Open Prompt Vault</Link>
          </div>
        </section>
      )}
    </div>
  )
}
