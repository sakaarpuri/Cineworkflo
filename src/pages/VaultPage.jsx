import { useEffect, useMemo, useState } from 'react'
import { Search, Copy, Check, Lightbulb, ChevronDown, ChevronUp } from 'lucide-react'
import PROMPTS_RAW from '../data/ai_video_prompt_library.json'

const BG = '#0E0E0F'
const CARD = '#161618'
const BORDER = '#2A2A2E'
const PANEL = '#1E1E21'

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

function ToolNotes({ text }) {
  const raw = String(text || '')
  const parts = raw.split(TOOL_BOLD_RE)
  return (
    <p style={{ color: 'rgba(231,231,234,0.65)', fontSize: 12.5, lineHeight: 1.55, margin: 0 }}>
      {parts.map((p, idx) =>
        TOOL_NAMES.has(p) ? (
          <strong key={idx} style={{ color: 'rgba(255,255,255,0.92)' }}>
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
      style={{
        fontFamily: UI_STACK,
        fontSize: 12,
        fontWeight: 800,
        padding: '6px 10px',
        borderRadius: 10,
        background: copied ? 'rgba(92,201,148,0.08)' : 'rgba(255,255,255,0.08)',
        border: copied ? '1px solid rgba(92,201,148,0.35)' : '1px solid rgba(255,255,255,0.12)',
        color: copied ? COLOR.green : 'rgba(255,255,255,0.82)',
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

function PromptBlock({ label, color, nodes, text, onCopy, copied, highlight = true }) {
  return (
    <section
      style={{
        background: 'rgba(14, 14, 15, 0.35)',
        border: '1px solid rgba(255,255,255,0.10)',
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
          fontSize: 12.5,
          lineHeight: 1.75,
          color: 'rgba(255,255,255,0.88)',
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
        background: 'rgba(22, 22, 24, 0.75)',
        border: '1px solid rgba(255,255,255,0.10)',
        borderRadius: 14,
        padding: 10,
      }}
    >
      <div style={{ fontFamily: MONO_STACK, fontSize: 12, color: COLOR.amber, fontWeight: 700, marginBottom: 6 }}>
        {name}
      </div>
      <div style={{ color: 'rgba(255,255,255,0.90)', fontSize: 12.5, lineHeight: 1.5, marginBottom: 8 }}>
        {value}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
        {(spec?.examples || []).map((ex) => (
          <button
            key={ex}
            type="button"
            onClick={() => onPick(ex)}
            style={{
              fontSize: 11,
              padding: '5px 8px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.06)',
              border: '1px solid rgba(255,255,255,0.10)',
              color: 'rgba(255,255,255,0.78)',
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
  const [expanded, setExpanded] = useState(false)
  const [copiedKey, setCopiedKey] = useState(null) // 'image' | 'video' | 'sfx' | null
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

  const imageNodes = useMemo(() => renderTemplateNodes(prompt.image_prompt, valueByNormKey), [prompt.image_prompt, valueByNormKey])
  const videoNodes = useMemo(() => renderTemplateNodes(prompt.video_prompt, valueByNormKey), [prompt.video_prompt, valueByNormKey])

  const copyText = async (key, raw) => {
    try {
      await navigator.clipboard.writeText(String(raw || ''))
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey(null), 2000)
    } catch {
      // ignore
    }
  }

  const categoryColor = CATEGORY_COLORS[prompt.category] || { fg: 'rgba(231,231,234,0.85)', bg: 'rgba(231,231,234,0.08)' }

  const bestOn = Array.isArray(prompt.best_on) ? prompt.best_on : []

  const keyVars = useMemo(() => pickKeyVariables(prompt.variables), [prompt.variables])

  return (
    <article
      style={{
        background: CARD,
        border: `1px solid ${BORDER}`,
        borderRadius: 20,
        padding: 16,
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8, minWidth: 0 }}>
          <span
            style={{
              fontFamily: MONO_STACK,
              fontSize: 12,
              padding: '6px 10px',
              borderRadius: 999,
              background: 'rgba(30,30,33,0.75)',
              border: `1px solid ${BORDER}`,
              color: 'rgba(231,231,234,0.45)',
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
              color: 'rgba(231,231,234,0.65)',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              maxWidth: 260,
            }}
          >
            {prompt.style}
          </span>
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'flex-end' }}>
          {bestOn.map((tool, idx) => (
            <span
              key={`${prompt.id}-${tool}-${idx}`}
              style={{
                fontSize: 12,
                padding: '6px 10px',
                borderRadius: 999,
                border: '1px solid rgba(255,255,255,0.10)',
                color: idx === 0 ? 'rgba(255,255,255,0.92)' : 'rgba(231,231,234,0.65)',
                background: idx === 0 ? 'rgba(255,255,255,0.12)' : 'rgba(14,14,15,0.35)',
                lineHeight: 1,
                userSelect: 'none',
              }}
            >
              {tool}
            </span>
          ))}
        </div>
      </div>

      {!proMode && (
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
            {keyVars.map((k) => (
              <span
                key={`${prompt.id}-kv-${k}`}
                style={{
                  fontFamily: MONO_STACK,
                  fontSize: 11.5,
                  color: COLOR.amber,
                  background: 'rgba(232,164,90,0.08)',
                  border: '1px solid rgba(232,164,90,0.18)',
                  padding: '6px 10px',
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
              border: '1px solid rgba(255,255,255,0.14)',
              color: 'rgba(255,255,255,0.86)',
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
                  border: '1px solid rgba(255,255,255,0.14)',
                  color: 'rgba(231,231,234,0.82)',
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
                  color: 'rgba(231,231,234,0.45)',
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
              <Lightbulb size={18} color="rgba(231,231,234,0.75)" style={{ marginTop: 2, flex: '0 0 auto' }} />
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
  const prompts = PROMPTS_RAW

  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')
  const [style, setStyle] = useState('All')
  const [globalView, setGlobalView] = useState('beginner') // 'beginner' | 'pro'

  useEffect(() => {
    const stored = localStorage.getItem('cwf_vault_view')
    if (stored === 'beginner' || stored === 'pro') setGlobalView(stored)
  }, [])

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
        normalize(p.image_prompt).includes(q) ||
        normalize(p.video_prompt).includes(q) ||
        normalize(p.sfx_prompt).includes(q)
      return matchesCategory && matchesStyle && matchesQuery
    })
  }, [prompts, query, category, style])

  const setView = (next) => {
    setGlobalView(next)
    localStorage.setItem('cwf_vault_view', next)
  }

  return (
    <div
      style={{
        background: BG,
        minHeight: '100vh',
        padding: '28px 18px 70px',
        fontFamily: UI_STACK,
      }}
    >
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', gap: 12, marginBottom: 18 }}>
          <div>
            <div style={{ fontSize: 24, fontWeight: 900, letterSpacing: '-0.02em', color: 'rgba(255,255,255,0.92)' }}>
              Prompt Vault (v2)
            </div>
            <div style={{ color: 'rgba(231,231,234,0.65)', fontSize: 13, marginTop: 6 }}>
              Pro prompts start with image generation — the foundation for strong video generations.
            </div>
          </div>
          <div style={{ color: 'rgba(231,231,234,0.65)', fontSize: 13, whiteSpace: 'nowrap' }}>
            Showing {filtered.length} of {prompts.length} prompts
          </div>
        </div>

        <div style={{ display: 'grid', gap: 12, marginBottom: 18 }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ position: 'relative', flex: '1 1 360px', minWidth: 280 }}>
              <Search
                size={18}
                color="rgba(231,231,234,0.55)"
                style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}
              />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search image/video/sfx…"
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 38px',
                  borderRadius: 14,
                  background: CARD,
                  border: `1px solid ${BORDER}`,
                  color: 'rgba(255,255,255,0.90)',
                  outline: 'none',
                }}
              />
            </div>

            <div
              style={{
                display: 'inline-flex',
                gap: 8,
                alignItems: 'center',
                background: CARD,
                border: `1px solid ${BORDER}`,
                borderRadius: 14,
                padding: 8,
              }}
            >
              <button
                type="button"
                onClick={() => setView('beginner')}
                style={{
                  borderRadius: 12,
                  padding: '8px 10px',
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: globalView === 'beginner' ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: globalView === 'beginner' ? 'rgba(255,255,255,0.92)' : 'rgba(231,231,234,0.70)',
                }}
              >
                Beginner view
              </button>
              <button
                type="button"
                onClick={() => setView('pro')}
                style={{
                  borderRadius: 12,
                  padding: '8px 10px',
                  fontWeight: 900,
                  fontSize: 12,
                  cursor: 'pointer',
                  border: '1px solid rgba(255,255,255,0.10)',
                  background: globalView === 'pro' ? 'rgba(255,255,255,0.12)' : 'transparent',
                  color: globalView === 'pro' ? 'rgba(255,255,255,0.92)' : 'rgba(231,231,234,0.70)',
                }}
              >
                Pro controls
              </button>
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
              const cc = c === 'All' ? { fg: 'rgba(255,255,255,0.88)', bg: 'rgba(255,255,255,0.10)' } : CATEGORY_COLORS[c]
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCategory(c)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontWeight: 900,
                    fontSize: 12,
                    border: active ? `1px solid ${cc.bg}` : `1px solid ${BORDER}`,
                    background: active ? cc.bg : 'transparent',
                    color: active ? cc.fg : 'rgba(231,231,234,0.72)',
                  }}
                >
                  {c}
                </button>
              )
            })}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
            {styles.map((s) => {
              const active = style === s
              return (
                <button
                  key={s}
                  type="button"
                  onClick={() => setStyle(s)}
                  style={{
                    padding: '7px 12px',
                    borderRadius: 999,
                    cursor: 'pointer',
                    fontWeight: 800,
                    fontSize: 12,
                    border: active ? '1px solid rgba(255,255,255,0.18)' : `1px solid ${BORDER}`,
                    background: active ? 'rgba(255,255,255,0.10)' : 'transparent',
                    color: active ? 'rgba(255,255,255,0.88)' : 'rgba(231,231,234,0.65)',
                  }}
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
      </div>
    </div>
  )
}
