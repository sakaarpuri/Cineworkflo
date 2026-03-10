import { useEffect, useMemo, useRef, useState } from 'react'
import { Search, Copy, Check, Lightbulb, ChevronDown, ChevronUp, BookmarkPlus } from 'lucide-react'
import { PROMPT_LIBRARY } from '../data/promptCategories'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'
import { Link, useLocation } from 'react-router-dom'

// Use the site's theme variables (light by default, dark when user toggles).
const BG = 'transparent'
const CARD = 'var(--bg-card)'
const BORDER = 'var(--border-color)'
const PANEL = 'var(--bg-secondary)'

const COLOR = {
  blue: '#4F8EF7',
  purple: '#A47EF5',
  red: '#F25C5C',
  green: '#5CC994',
  amber: '#E8A45A',
}

const CATEGORY_COLORS = {
  'Brand & Product Ads': { fg: '#E8A45A', bg: 'rgba(232,164,90,0.12)' },
  'Social & Short-Form Content': { fg: '#5CC994', bg: 'rgba(92,201,148,0.10)' },
  'Cinematic & Storytelling': { fg: '#4F8EF7', bg: 'rgba(79,142,247,0.12)' },
  'World & Environment Building': { fg: '#2DD4BF', bg: 'rgba(45,212,191,0.10)' },
  'Abstract & Motion Art': { fg: '#A47EF5', bg: 'rgba(164,126,245,0.10)' },
  'AI Avatar & Character': { fg: '#F472B6', bg: 'rgba(244,114,182,0.10)' },
  'Sci-Fi & Concept Film': { fg: '#818CF8', bg: 'rgba(129,140,248,0.10)' },
  'Food & Cooking': { fg: '#FB923C', bg: 'rgba(251,146,60,0.10)' },
  'Real Estate & Architecture': { fg: '#A8A29E', bg: 'rgba(168,162,158,0.10)' },
}

const MONO_STACK =
  '"DM Mono", ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'

const UI_STACK =
  '"DM Sans", system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji", "Segoe UI Emoji"'
const createGroupId = () => (
  globalThis.crypto?.randomUUID?.() || `cwf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
)

const normalize = (value) => String(value || '').trim().toLowerCase()

const fillTemplateText = (template, valueByNormKey) => {
  const raw = String(template || '')
  return raw.replace(/\[([^\]]+)\]/g, (_m, inner) => {
    const key = normalize(inner)
    const value = valueByNormKey?.[key]
    return value ? String(value) : `[${inner}]`
  })
}

const renderTemplateNodes = (template, valueByNormKey) => {
  const raw = String(template || '')
  const nodes = []
  let last = 0
  const re = /\[([^\]]+)\]/g
  let m
  while ((m = re.exec(raw))) {
    if (m.index > last) nodes.push({ type: 'text', value: raw.slice(last, m.index) })
    const inner = m[1]
    const key = normalize(inner)
    const resolved = valueByNormKey?.[key]
    nodes.push({ type: 'var', value: resolved ? String(resolved) : `[${inner}]`, missing: !resolved })
    last = m.index + m[0].length
  }
  if (last < raw.length) nodes.push({ type: 'text', value: raw.slice(last) })
  return nodes
}

const TOOL_NAMES = new Set(['Runway', 'Kling', 'Luma', 'Pika', 'Sora', 'Higgsfield', 'Google Veo', 'HeyGen'])
const TOOL_BOLD_RE = /\b(Runway|Kling|Luma|Pika|Sora|Higgsfield|Google Veo|HeyGen)\b/g
const EMPTY_SAVE_STATUS = { video: 'idle', start_frame: 'idle', end_frame: 'idle' }

function ToolNotes({ text }) {
  const raw = String(text || '')
  const parts = raw.split(TOOL_BOLD_RE)
  return (
    <p style={{ color: 'var(--text-secondary)', fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
      {parts.map((p, idx) =>
        TOOL_NAMES.has(p) ? (
          <strong key={idx} style={{ color: 'var(--text-primary)' }}>
            {p}
          </strong>
        ) : (
          <span key={idx}>{p}</span>
        )
      )}
    </p>
  )
}

function CopyButton({ onCopy, copied }) {
  return (
    <button
      type="button"
      onClick={onCopy}
      className={copied ? 'cwf-rec-flash' : undefined}
      style={{
        fontFamily: UI_STACK,
        fontSize: 12,
        fontWeight: 800,
        padding: '6px 10px',
        borderRadius: 10,
        background: copied ? 'rgba(5,150,105,0.10)' : 'var(--bg-primary)',
        border: copied ? '1px solid rgba(5,150,105,0.35)' : `1px solid ${BORDER}`,
        color: copied ? 'var(--accent-green)' : 'var(--text-secondary)',
        cursor: 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      {copied ? <Check size={16} /> : <Copy size={16} />}
      {copied ? 'Copied ✓' : 'Copy'}
    </button>
  )
}

function SaveButton({ onSave, status, label = 'Save' }) {
  const saving = status === 'saving'
  const saved = status === 'saved' || status === 'exists'

  return (
    <button
      type="button"
      onClick={onSave}
      disabled={saving}
      title={status === 'exists' ? 'Already in My Library' : 'Save to My Library'}
      style={{
        fontFamily: UI_STACK,
        fontSize: 12,
        fontWeight: 800,
        padding: '6px 10px',
        borderRadius: 10,
        background: saved ? 'rgba(5,150,105,0.10)' : 'var(--bg-primary)',
        border: saved ? '1px solid rgba(5,150,105,0.35)' : `1px solid ${BORDER}`,
        color: saved ? 'var(--accent-green)' : 'var(--text-secondary)',
        cursor: saving || saved ? 'default' : 'pointer',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 8,
        opacity: saving ? 0.8 : 1,
      }}
    >
      {saved ? <Check size={16} /> : <BookmarkPlus size={16} />}
      {saving ? 'Saving…' : saved ? 'Saved' : label}
    </button>
  )
}

function PromptBlock({ label, color, nodes, text, onCopy, copied, highlight = true }) {
  return (
    <section
      style={{
        background: 'var(--bg-secondary)',
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: 12,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10, alignItems: 'center', marginBottom: 10 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            fontSize: 10,
            fontWeight: 900,
            letterSpacing: '0.16em',
            textTransform: 'uppercase',
            color,
          }}
        >
          {label}
        </div>
        <CopyButton onCopy={onCopy} copied={copied} />
      </div>

      <div
        style={{
          fontFamily: MONO_STACK,
          fontSize: 14,
          lineHeight: 1.8,
          color: 'var(--text-primary)',
          whiteSpace: 'pre-wrap',
        }}
      >
        {highlight
          ? nodes.map((p, idx) =>
              p.type === 'var' ? (
                <span
                  key={idx}
                  style={{
                    color: COLOR.amber,
                    background: 'rgba(232,164,90,0.12)',
                    padding: '1px 4px',
                    borderRadius: 4,
                  }}
                >
                  {p.value}
                </span>
              ) : (
                <span key={idx}>{p.value}</span>
              )
            )
          : String(text || '')}
      </div>
    </section>
  )
}

function VariableCard({ name, spec, value, onPick }) {
  return (
    <div
      style={{
        background: 'var(--bg-card)',
        border: `1px solid ${BORDER}`,
        borderRadius: 14,
        padding: 10,
      }}
    >
      <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: COLOR.amber, fontWeight: 700, marginBottom: 6 }}>
        {name}
      </div>
      <div style={{ color: 'var(--text-primary)', fontSize: 14.5, lineHeight: 1.55, marginBottom: 10 }}>
        {value}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(spec?.examples || []).map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onPick(ex)}
            style={{
              fontSize: 12.5,
              padding: '7px 10px',
              borderRadius: 999,
              background: 'var(--bg-primary)',
              border: `1px solid ${BORDER}`,
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
          >
            {ex}
          </button>
        ))}
      </div>
    </div>
  )
}

function pickKeyVariables(variables) {
  const keys = Object.keys(variables || {})
  const preferred = [
    'subject',
    'character description',
    'character type',
    'object type',
    'action',
    'activity',
    'location',
    'background',
    'mood',
    'color',
    'color palette',
    'lens',
    'time of day',
  ]
  const normalizedKeys = new Map(keys.map((k) => [normalize(k), k]))
  const picked = []
  for (const pref of preferred) {
    const found = normalizedKeys.get(pref)
    if (found && !picked.includes(found)) picked.push(found)
    if (picked.length >= 5) break
  }
  for (const k of keys) {
    if (picked.length >= 5) break
    if (!picked.includes(k)) picked.push(k)
  }
  return picked
}

function PromptCard({ prompt, globalView }) {
  const { user } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null) // 'image' | 'video' | 'sfx' | null
  const [saveStatus, setSaveStatus] = useState(EMPTY_SAVE_STATUS)
  const [lastSavedText, setLastSavedText] = useState('')
  const [currentGroupId, setCurrentGroupId] = useState('')
  const [varValues, setVarValues] = useState(() => {
    const next = {}
    for (const [k, spec] of Object.entries(prompt.variables || {})) next[k] = spec?.default ?? ''
    return next
  })

  const proMode = globalView === 'pro' || expanded

  const valueByNormKey = useMemo(() => {
    const next = {}
    for (const [k, v] of Object.entries(varValues || {})) next[normalize(k)] = v
    return next
  }, [varValues])

  const filledImage = useMemo(() => fillTemplateText(prompt.image_prompt, valueByNormKey), [prompt.image_prompt, valueByNormKey])
  const filledVideo = useMemo(() => fillTemplateText(prompt.video_prompt, valueByNormKey), [prompt.video_prompt, valueByNormKey])
  const filledSfx = useMemo(() => fillTemplateText(prompt.sfx_prompt, valueByNormKey), [prompt.sfx_prompt, valueByNormKey])

  useEffect(() => {
    if (!lastSavedText) return
    const savedText = String(lastSavedText || '').trim()
    const currentVideo = String(filledVideo || '').trim()
    const currentImage = String(filledImage || '').trim()
    if (savedText !== currentVideo && savedText !== currentImage) {
      setSaveStatus(EMPTY_SAVE_STATUS)
      setLastSavedText('')
      setCurrentGroupId('')
    }
  }, [filledVideo, filledImage, lastSavedText])

  const imageNodes = useMemo(() => renderTemplateNodes(prompt.image_prompt, valueByNormKey), [prompt.image_prompt, valueByNormKey])
  const videoNodes = useMemo(() => renderTemplateNodes(prompt.video_prompt, valueByNormKey), [prompt.video_prompt, valueByNormKey])

  const heading = useMemo(() => {
    const getVar = (...keys) => {
      for (const k of keys) {
        const v = valueByNormKey[normalize(k)]
        if (v) return String(v).trim()
      }
      return ''
    }

    const compact = (s) =>
      String(s || '')
        .replace(/\s+/g, ' ')
        .replace(/\s*[,.;:!?]\s*$/g, '')
        .trim()

    const clamp = (s, max = 56) => {
      const text = compact(s)
      if (text.length <= max) return text
      return text.slice(0, max - 1).trimEnd() + '…'
    }

    const product = getVar('product type')
    if (product) return clamp(`${product} ad`)

    const liquid = getVar('liquid or sauce')
    if (liquid) return clamp(`Slow-motion ${liquid} pour`)

    const city = getVar('futuristic city type')
    if (city) return clamp(`${city} descent`)

    const futureLocation = getVar('proposed future location')
    if (futureLocation) return clamp(`Documentary expedition at ${futureLocation}`)

    const neonForm = getVar('neon architectural form')
    if (neonForm) return clamp(`Neon impossible architecture: ${neonForm}`)

    const property = getVar('property type')
    const impossible = getVar('impossible context', 'specific impossibility')
    if (property && impossible) return clamp(`${property} in ${impossible}`)

    const objectType = getVar('object type')
    const stimulus = getVar('stimulus')
    if (objectType && stimulus) return clamp(`${objectType} reacts to ${stimulus}`)
    if (objectType) return clamp(objectType)

    const familiar = getVar('familiar object')
    const becomes = getVar('something else entirely')
    if (familiar && becomes) return clamp(`${familiar} becomes ${becomes}`)
    if (familiar) return clamp(`${familiar} transforms`)

    const landscape = getVar('natural landscape element')
    const substance = getVar('different substance')
    if (landscape && substance) return clamp(`${landscape} as ${substance}`)

    const abstractVisual = getVar('abstract visual type')
    const decade = getVar('decade')
    if (abstractVisual && decade) return clamp(`${abstractVisual} (${decade})`)
    if (abstractVisual) return clamp(abstractVisual)

    const character = getVar('character description', 'character type', 'person type', 'user type')
    const action = getVar('action', 'activity', 'specific task')
    if (character && action) return clamp(`${character} — ${action}`)
    if (character) return clamp(character)

    // Fallback: short summary from filled prompt (strip aspect ratio + any leading lens clause).
    const candidate = String(filledImage || filledVideo || '')
      .replace(/\s*,\s*(16:9|9:16|1:1|4:5)\s*$/i, '')
      .trim()

    const first = candidate.split('—')[0]?.trim() || candidate
    const withoutLensLead = first
      .replace(/^\s*\d{1,3}mm\s+lens\s+framing\s*[-—]\s*/i, '')
      .replace(/^\s*lens\s+framing\s*[-—]\s*/i, '')
      .replace(/\b\d{1,3}mm\b/gi, '')
      .replace(/\b(telephoto|macro)\b/gi, '')
      .replace(/\b(lens|framing|locked)\b/gi, '')
      .replace(/\s{2,}/g, ' ')
      .replace(/^\s*(an|a)\s+/i, '')
      .trim()

    return clamp(withoutLensLead || first || prompt.category)
  }, [filledImage, filledVideo, prompt.category, valueByNormKey])

  const copyText = async (key, raw) => {
    try {
      await navigator.clipboard.writeText(String(raw || ''))
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      // ignore
    }
  }

  const categoryColor = CATEGORY_COLORS[prompt.category] || { fg: 'var(--text-primary)', bg: 'rgba(37,99,235,0.10)' }

  const bestOn = Array.isArray(prompt.best_on) ? prompt.best_on : []

  const keyVars = useMemo(() => pickKeyVariables(prompt.variables), [prompt.variables])

  const handleSave = async (saveMode = 'video') => {
    if (!user) return
    if (saveStatus[saveMode] === 'saving' || saveStatus[saveMode] === 'saved' || saveStatus[saveMode] === 'exists') return
    setSaveStatus((previous) => ({ ...previous, [saveMode]: 'saving' }))
    const isFrameSave = saveMode === 'start_frame' || saveMode === 'end_frame'
    const variantType = saveMode === 'video' ? 'video_prompt' : saveMode
    const framePrompt = String(filledImage || '').trim()
    const promptToSave = isFrameSave ? framePrompt : String(filledVideo || '').trim()
    const frameLabel = saveMode === 'start_frame' ? 'Start Frame' : saveMode === 'end_frame' ? 'End Frame' : null
    const groupId = currentGroupId || createGroupId()
    if (!promptToSave) {
      setSaveStatus((previous) => ({ ...previous, [saveMode]: 'error' }))
      window.setTimeout(() => setSaveStatus((previous) => ({ ...previous, [saveMode]: 'idle' })), 2500)
      return
    }

    const payload = {
      user_id: user.id,
      idea: frameLabel ? `${heading || `Prompt #${prompt.id}`} — ${frameLabel}` : heading || `Prompt #${prompt.id}`,
      prompt: promptToSave,
      mood: null,
      use_case: null,
      skill_level: 'vault',
      include_audio_sfx: Boolean(String(filledSfx || '').trim()),
      include_image_details: Boolean(framePrompt),
      metadata: {
        group_id: groupId,
        variant_type: variantType,
        source: 'prompt_vault',
        original_idea: heading || `Prompt #${prompt.id}`,
        library_id: prompt.id,
        category: prompt.category,
        style: prompt.style,
        best_on: bestOn,
        image_prompt: framePrompt,
        sfx_prompt: String(filledSfx || '').trim(),
        variables: varValues,
        save_mode: saveMode,
        frame_role: isFrameSave ? saveMode : null,
        linked_from_variant: saveMode === 'end_frame' ? 'start_frame' : null,
        video_prompt: String(filledVideo || '').trim(),
      },
    }

    const { error } = await supabase.from('saved_prompts').insert(payload)
    if (!error) {
      setCurrentGroupId(groupId)
      setSaveStatus((previous) => ({ ...previous, [saveMode]: 'saved' }))
      setLastSavedText(payload.prompt)
      return
    }
    if (error.code === '23505') {
      setSaveStatus((previous) => ({ ...previous, [saveMode]: 'exists' }))
      setLastSavedText(payload.prompt)
      return
    }
    setSaveStatus((previous) => ({ ...previous, [saveMode]: 'error' }))
    window.setTimeout(() => setSaveStatus((previous) => ({ ...previous, [saveMode]: 'idle' })), 2500)
  }

  return (
    <article
      className="cwf-scanline-hover"
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: 16,
      }}
    >
      {prompt.thumbnail_url && (
        <div
          style={{
            marginBottom: 14,
            padding: 10,
            background: 'var(--bg-primary)',
            border: `1px solid ${BORDER}`,
            borderRadius: 18,
          }}
        >
          <img
            src={prompt.thumbnail_url}
            alt={prompt.title}
            style={{
              width: '100%',
              aspectRatio: '16 / 9',
              objectFit: 'cover',
              borderRadius: 14,
              maxHeight: 180,
              display: 'block',
            }}
            loading="lazy"
          />
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span
            style={{
              fontFamily: MONO_STACK,
              fontSize: 12,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'var(--bg-primary)',
              border: `1px solid ${BORDER}`,
              color: 'var(--text-muted)',
            }}
          >
            #{prompt.id}
          </span>
          <span
            style={{
              fontSize: 12,
              fontWeight: 800,
              padding: '6px 10px',
              borderRadius: 999,
              color: categoryColor.fg,
              background: categoryColor.bg,
              border: `1px solid ${categoryColor.bg}`,
              lineHeight: 1,
              whiteSpace: 'nowrap',
            }}
          >
            {prompt.category}
          </span>
          <span
            title={prompt.style}
            style={{
              fontSize: 12,
              color: 'var(--text-secondary)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 260,
            }}
          >
            {prompt.style}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end', alignItems: 'center' }}>
          {user && <SaveButton onSave={() => handleSave('video')} status={saveStatus.video} />}
          {bestOn.map((tool, idx) => (
            <span
              key={`${prompt.id}-${tool}-${idx}`}
              style={{
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 999,
                border: `1px solid ${BORDER}`,
                color: idx === 0 ? 'var(--text-primary)' : 'var(--text-secondary)',
                background: idx === 0 ? 'var(--bg-primary)' : 'var(--bg-secondary)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      <div
        style={{
          fontSize: 16,
          fontWeight: 900,
          letterSpacing: '-0.02em',
          color: 'var(--text-primary)',
          marginBottom: 10,
          lineHeight: 1.2,
        }}
      >
        {heading}
      </div>

      {!proMode && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {keyVars.map((k) => (
              <span
                key={`${prompt.id}-kv-${k}`}
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 13,
                  color: COLOR.amber,
                  background: 'rgba(232,164,90,0.08)',
                  border: '1px solid rgba(232,164,90,0.18)',
                  padding: '8px 12px',
                  borderRadius: 999,
                }}
              >
                {k}
              </span>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setExpanded(true)}
            style={{
              background: 'transparent',
              border: `1px solid ${BORDER}`,
              color: 'var(--text-primary)',
              borderRadius: 12,
              padding: '8px 10px',
              fontWeight: 800,
              fontSize: 12,
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 6,
              whiteSpace: 'nowrap',
            }}
          >
            Show pro controls <ChevronDown size={16} />
          </button>
        </div>
      )}

      {proMode && (
        <>
          {globalView !== 'pro' && (
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 10 }}>
              <button
                type="button"
                onClick={() => setExpanded(false)}
                style={{
                  background: 'transparent',
                  border: `1px solid ${BORDER}`,
                  color: 'var(--text-secondary)',
                  borderRadius: 12,
                  padding: '8px 10px',
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                Back to beginner <ChevronUp size={16} />
              </button>
            </div>
          )}

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1.35fr 0.95fr',
            gap: 12,
            alignItems: 'start',
          }}
        >
          <div style={{ display: 'grid', gap: 12 }}>
            <PromptBlock
              label="🖼️ IMAGE PROMPT"
              color={COLOR.blue}
              nodes={imageNodes}
              text={filledImage}
              copied={copiedKey === 'image'}
              onCopy={() => copyText('image', filledImage)}
              highlight={true}
            />
            {user && String(filledImage || '').trim() && (
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <SaveButton onSave={() => handleSave('start_frame')} status={saveStatus.start_frame} label="Save Start Frame" />
                <SaveButton onSave={() => handleSave('end_frame')} status={saveStatus.end_frame} label="Save End Frame" />
              </div>
            )}
            <PromptBlock
              label="🎥 VIDEO PROMPT"
              color={COLOR.purple}
              nodes={videoNodes}
              text={filledVideo}
              copied={copiedKey === 'video'}
              onCopy={() => copyText('video', filledVideo)}
              highlight={true}
            />
            <PromptBlock
              label="🔊 SFX"
              color={COLOR.red}
              nodes={[]}
              text={filledSfx}
              copied={copiedKey === 'sfx'}
              onCopy={() => copyText('sfx', filledSfx)}
              highlight={false}
            />
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            <section
              style={{
                background: PANEL,
                border: `1px solid ${BORDER}`,
                borderRadius: 16,
                padding: 12,
              }}
            >
              <div
                style={{
                  color: 'var(--text-muted)',
                  fontWeight: 900,
                  fontSize: 10,
                  letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  marginBottom: 10,
                }}
              >
                VARIABLES
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 10 }}>
                {Object.entries(prompt.variables || {}).map(([name, spec]) => (
                  <VariableCard
                    key={`${prompt.id}-${name}`}
                    name={name}
                    spec={spec}
                    value={varValues[name] ?? spec?.default ?? ''}
                    onPick={(next) => setVarValues((prev) => ({ ...prev, [name]: next }))}
                  />
                ))}
              </div>
            </section>

            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
              <Lightbulb size={18} color="var(--text-secondary)" style={{ marginTop: 2, flex: '0 0 auto' }} />
              <ToolNotes text={prompt.tool_notes} />
            </div>

          </div>
        </div>
        </>
      )}

      {!proMode && (
        <div style={{ marginTop: 12 }}>
          <PromptBlock
            label="🎥 VIDEO PROMPT"
            color={COLOR.purple}
            nodes={videoNodes}
            text={filledVideo}
            copied={copiedKey === 'video'}
            onCopy={() => copyText('video', filledVideo)}
            highlight={true}
          />
        </div>
      )}
    </article>
  )
}

export default function VaultPage() {
  const prompts = useMemo(() => PROMPT_LIBRARY, [])
  const location = useLocation()

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const globalView = 'beginner'
  const prevCategoryRef = useRef(null)
  const prevStyleRef = useRef(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const search = params.get('search')
    if (search) setQuery(search)
  }, [location.search])

  const categories = useMemo(() => {
    const list = [...new Set(prompts.map((p) => p.category))].sort()
    return ['All', ...list]
  }, [prompts])

  const styles = useMemo(() => {
    const list = [...new Set(prompts.map((p) => p.style))].sort()
    return ['All', ...list]
  }, [prompts])

  const filtered = useMemo(() => {
    const q = normalize(query)
    return prompts.filter((p) => {
      const matchesCategory = category === 'All' || p.category === category
      const matchesStyle = style === 'All' || p.style === style
      const matchesQuery =
        !q ||
        String(p.id) === q ||
        String(p.source_id ?? '').toLowerCase() === q ||
        normalize(p.title).includes(q) ||
        normalize(p.image_prompt).includes(q) ||
        normalize(p.video_prompt).includes(q) ||
        normalize(p.sfx_prompt).includes(q)
      return matchesCategory && matchesStyle && matchesQuery
    })
  }, [prompts, query, category, style])

  return (
    <div
      style={{
        background: BG,
        minHeight: '100vh',
        padding: '28px 18px 70px',
        fontFamily: UI_STACK,
      }}
    >
      <style>{`
        .cwf-neu-pill {
          -webkit-tap-highlight-color: transparent;
          user-select: none;
          border-radius: 999px;
          padding: 9px 12px;
          font-weight: 900;
          font-size: 12px;
          cursor: pointer;
          border: 1px solid var(--border-color);
          color: var(--text-secondary);
          background: var(--bg-card);
          box-shadow:
            10px 10px 18px rgba(15,23,42,0.06),
            6px 6px 12px rgba(15,23,42,0.08),
            -6px -6px 12px rgba(255,255,255,0.72),
            inset 0 1px 0 rgba(255,255,255,0.92);
          transform: translateY(0) scale(1);
          transition: transform 140ms ease, box-shadow 140ms ease, background 140ms ease, border-color 140ms ease, color 140ms ease;
        }

        .cwf-neu-pill:active {
          transform: translateY(1px) scale(0.99);
          box-shadow:
            var(--shadow-inset);
        }

        .cwf-neu-pill--active {
          color: var(--pill-fg, rgba(255,255,255,0.92));
          border-color: var(--border-color);
          background: linear-gradient(145deg, var(--pill-bg, rgba(37,99,235,0.10)), rgba(255,255,255,0.85));
          box-shadow:
            10px 10px 18px rgba(15,23,42,0.06),
            6px 6px 12px rgba(15,23,42,0.08),
            -6px -6px 12px rgba(255,255,255,0.72),
            inset 0 1px 0 rgba(255,255,255,0.92),
            0 0 0 1px rgba(37,99,235,0.06);
        }

        .cwf-neu-pill--active:active {
          box-shadow:
            var(--shadow-inset);
        }

        /* Night mode: remove any bright "glow" from pill shadows. */
        [data-theme="dark"] .cwf-neu-pill {
          box-shadow:
            4px 4px 8px rgba(0,0,0,0.55),
            -4px -4px 8px rgba(255,255,255,0.03),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }

        [data-theme="dark"] .cwf-neu-pill:active {
          box-shadow:
            inset 4px 4px 8px rgba(0,0,0,0.60),
            inset -4px -4px 8px rgba(255,255,255,0.03);
        }

        [data-theme="dark"] .cwf-neu-pill--active {
          background: rgba(255,255,255,0.06);
          box-shadow:
            4px 4px 8px rgba(0,0,0,0.55),
            -4px -4px 8px rgba(255,255,255,0.03),
            inset 0 1px 0 rgba(255,255,255,0.06);
        }
      `}</style>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
              a vault of prompts.....
            </div>
            <div style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
              Designed for image-to-video. Lock the look with an image, then drive the shot with the video prompt.
            </div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 6 }}>
              Vault is currently open to all users.
            </div>
            <div style={{ marginTop: 10 }}>
              <a
                href="/vault"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 8,
                  padding: '8px 12px',
                  borderRadius: 999,
                  background: 'var(--bg-card)',
                  border: `1px solid ${BORDER}`,
                  color: 'var(--text-primary)',
                  fontWeight: 900,
                  fontSize: 12,
                  textDecoration: 'none',
                }}
              >
                Open Prompt Vault v1
              </a>
            </div>
          </div>
          <div style={{ color: 'var(--text-secondary)', fontSize: 13, whiteSpace: 'nowrap' }}>
            Showing {filtered.length} of {prompts.length} prompts
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 360px', minWidth: 280 }}>
              <Search
                size={18}
                color="var(--text-muted)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search title/image/video/sfx…"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: 14,
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  color: 'var(--text-primary)',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: 10,
            }}
          >
            {categories.map((c) => {
              const active = category === c
                  const cc = c === 'All'
                ? { fg: 'var(--text-primary)', bg: 'rgba(37,99,235,0.10)' }
                : (CATEGORY_COLORS[c] || { fg: 'var(--text-primary)', bg: 'rgba(37,99,235,0.10)' })
                  return (
                    <button
                      key={c}
                  type="button"
                  onClick={() => {
                    if (c === category) {
                      if (c === 'All') return
                      const previous = prevCategoryRef.current || 'All'
                      prevCategoryRef.current = category
                      setCategory(previous)
                      return
                    }
                    prevCategoryRef.current = category
                    setCategory(c)
                  }}
                  className={`cwf-neu-pill${active ? ' cwf-neu-pill--active' : ''}`}
                  style={active ? { '--pill-fg': cc.fg, '--pill-bg': cc.bg } : undefined}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              gap: 10,
              background: PANEL,
              border: `1px solid ${BORDER}`,
              borderRadius: 16,
              padding: 10,
            }}
          >
            {styles.map((s) => {
              const active = style === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    if (s === style) {
                      if (s === 'All') return
                      const previous = prevStyleRef.current || 'All'
                      prevStyleRef.current = style
                      setStyle(previous)
                      return
                    }
                    prevStyleRef.current = style
                    setStyle(s)
                  }}
                  className={`cwf-neu-pill${active ? ' cwf-neu-pill--active' : ''}`}
                >
                  {s}
                </button>
              )
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(520px, 1fr))', gap: 18 }}>
          {filtered.map((p) => (
            <PromptCard key={p.id} prompt={p} globalView={globalView} />
          ))}
        </div>

        <section
          style={{
            marginTop: 20,
            background: PANEL,
            border: `1px solid ${BORDER}`,
            borderRadius: 16,
            padding: 14,
          }}
        >
          <div style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Related pages:
            {' '}
            <Link to="/shot-to-prompt" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Shot to Prompt</Link>
            {' '}
            ·
            {' '}
            <Link to="/camera-moves" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Camera Moves</Link>
            {' '}
            ·
            {' '}
            <Link to="/pricing" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>Pricing</Link>
            {' '}
            ·
            {' '}
            <Link to="/about" style={{ color: 'var(--accent-blue)', textDecoration: 'underline' }}>About</Link>
          </div>
        </section>
      </div>
    </div>
  )
}
