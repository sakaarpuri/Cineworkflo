'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Check, ChevronDown, ChevronUp, Copy, Search } from 'lucide-react'
import { CATEGORY_COLORS, PROMPT_LIBRARY } from '../lib/vault-data'

const DEFAULT_ALL_CATEGORY_WEIGHTS = {
  'Sci-Fi & Concept Film': 10,
  'World & Environment Building': 8,
  'Cinematic & Storytelling': 7,
  'Brand & Product Ads': 6,
  'Food & Cooking': 5,
  'AI Avatar & Character': 4,
  'Abstract & Motion Art': 3,
  'Nature & Wildlife Documentary': 3,
  'Real Estate & Architecture': 2,
  'Social & Short-Form Content': 1,
}

const MONO_STACK = 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace'

const normalize = (value) => String(value || '').trim().toLowerCase()
const normalizeSearchText = (value) => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()
const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const matchesSearchField = (value, query) => {
  const normalizedValue = normalizeSearchText(value)
  const normalizedQuery = normalizeSearchText(query)
  if (!normalizedQuery) return true
  if (!normalizedValue) return false
  const pattern = new RegExp(`(^|\\s)${escapeRegExp(normalizedQuery).replace(/\s+/g, '\\s+')}(?=\\s|$)`, 'i')
  return pattern.test(normalizedValue)
}

const fillTemplateText = (template, valueByNormKey) =>
  String(template || '').replace(/\[([^\]]+)\]/g, (_match, inner) => {
    const key = normalize(inner)
    const value = valueByNormKey?.[key]
    return value ? String(value) : `[${inner}]`
  })

const renderTemplateNodes = (template, valueByNormKey) => {
  const raw = String(template || '')
  const nodes = []
  let last = 0
  const re = /\[([^\]]+)\]/g
  let match
  while ((match = re.exec(raw))) {
    if (match.index > last) nodes.push({ type: 'text', value: raw.slice(last, match.index) })
    const inner = match[1]
    const key = normalize(inner)
    const resolved = valueByNormKey?.[key]
    nodes.push({ type: 'var', value: resolved ? String(resolved) : `[${inner}]`, missing: !resolved })
    last = match.index + match[0].length
  }
  if (last < raw.length) nodes.push({ type: 'text', value: raw.slice(last) })
  return nodes
}

const pickKeyVariables = (variables) => {
  const keys = Object.keys(variables || {})
  const preferred = ['subject', 'character description', 'character type', 'object type', 'action', 'activity', 'location', 'background', 'mood', 'color', 'color palette', 'lens', 'time of day']
  const normalizedKeys = new Map(keys.map((key) => [normalize(key), key]))
  const picked = []
  for (const pref of preferred) {
    const found = normalizedKeys.get(pref)
    if (found && !picked.includes(found)) picked.push(found)
    if (picked.length >= 5) break
  }
  for (const key of keys) {
    if (picked.length >= 5) break
    if (!picked.includes(key)) picked.push(key)
  }
  return picked
}

const getDefaultAllPriority = (prompt, index) => {
  const categoryWeight = DEFAULT_ALL_CATEGORY_WEIGHTS[prompt.category] || 0
  const hasThumbnail = prompt.thumbnail_url ? 20 : 0
  const styleBoost = /(cinematic|photorealistic|hyper ?real|concept|documentary|editorial|luxury|surreal)/i.test(String(prompt.style || '')) ? 3 : 0
  return hasThumbnail + categoryWeight + styleBoost - index * 0.001
}

const curateDefaultAllView = (items) => {
  const buckets = new Map()
  items.forEach((prompt, index) => {
    const key = prompt.category || 'Uncategorized'
    const list = buckets.get(key) || []
    list.push({ prompt, priority: getDefaultAllPriority(prompt, index) })
    buckets.set(key, list)
  })
  for (const list of buckets.values()) list.sort((a, b) => b.priority - a.priority)
  const categoryOrder = [...buckets.entries()].sort((a, b) => (b[1][0]?.priority || 0) - (a[1][0]?.priority || 0)).map(([key]) => key)
  const mixed = []
  let added = true
  while (added) {
    added = false
    for (const key of categoryOrder) {
      const list = buckets.get(key)
      if (list?.length) {
        mixed.push(list.shift().prompt)
        added = true
      }
    }
  }
  return mixed
}

function PromptBlock({ label, colorClass, nodes, text, copied, onCopy, highlight = true }) {
  return (
    <section className="vault-prompt-block">
      <div className="vault-prompt-head">
        <div className={`output-label ${colorClass}`}>{label}</div>
        <button type="button" className="copy-action" onClick={onCopy}>
          {copied ? 'Copied ✓' : 'Copy'}
        </button>
      </div>
      <div className="vault-mono-text">
        {highlight
          ? nodes.map((part, index) =>
              part.type === 'var' ? (
                <span key={index} className="vault-var-chip">
                  {part.value}
                </span>
              ) : (
                <span key={index}>{part.value}</span>
              ),
            )
          : text}
      </div>
    </section>
  )
}

function PromptCard({ prompt }) {
  const [expanded, setExpanded] = useState(false)
  const [copiedKey, setCopiedKey] = useState('')
  const [varValues, setVarValues] = useState(() => {
    const next = {}
    for (const [key, spec] of Object.entries(prompt.variables || {})) next[key] = spec?.default ?? ''
    return next
  })

  const valueByNormKey = useMemo(() => {
    const next = {}
    for (const [key, value] of Object.entries(varValues || {})) next[normalize(key)] = value
    return next
  }, [varValues])

  const filledImage = useMemo(() => fillTemplateText(prompt.image_prompt, valueByNormKey), [prompt.image_prompt, valueByNormKey])
  const filledVideo = useMemo(() => fillTemplateText(prompt.video_prompt, valueByNormKey), [prompt.video_prompt, valueByNormKey])
  const filledSfx = useMemo(() => fillTemplateText(prompt.sfx_prompt, valueByNormKey), [prompt.sfx_prompt, valueByNormKey])
  const imageNodes = useMemo(() => renderTemplateNodes(prompt.image_prompt, valueByNormKey), [prompt.image_prompt, valueByNormKey])
  const videoNodes = useMemo(() => renderTemplateNodes(prompt.video_prompt, valueByNormKey), [prompt.video_prompt, valueByNormKey])
  const keyVars = useMemo(() => pickKeyVariables(prompt.variables), [prompt.variables])
  const categoryColor = CATEGORY_COLORS[prompt.category] || '#2563eb'

  const copyText = async (key, value) => {
    try {
      await navigator.clipboard.writeText(String(value || ''))
      setCopiedKey(key)
      window.setTimeout(() => setCopiedKey((current) => (current === key ? '' : current)), 2000)
    } catch {}
  }

  return (
    <article className="vault-card-live">
      {prompt.thumbnail_url ? <img src={prompt.thumbnail_url} alt={prompt.title} className="vault-card-thumb" loading="lazy" /> : null}
      <div className="vault-card-top">
        <div className="vault-id-row">
          <span className="vault-id-pill">#{prompt.id}</span>
          <span className="vault-category-pill" style={{ '--cat-color': categoryColor }}>{prompt.category}</span>
          <span className="vault-style-text">{prompt.style}</span>
        </div>
        <div className="vault-tool-row">
          {(prompt.best_on || []).map((tool, index) => (
            <span key={`${prompt.id}-${tool}-${index}`} className="vault-tool-pill">{tool}</span>
          ))}
        </div>
      </div>
      <h2 className="vault-card-title">{prompt.title}</h2>

      {!expanded ? (
        <>
          <div className="chip-row wrap-row compact-gap">
            {keyVars.map((item) => (
              <span key={`${prompt.id}-${item}`} className="vault-keyvar-pill">{item}</span>
            ))}
          </div>
          <div className="vault-video-preview">
            <PromptBlock
              label="Video Prompt"
              colorClass="video"
              nodes={videoNodes}
              text={filledVideo}
              copied={copiedKey === 'video'}
              onCopy={() => copyText('video', filledVideo)}
            />
          </div>
          <button type="button" className="vault-expand-button" onClick={() => setExpanded(true)}>
            Show pro controls <ChevronDown className="icon-xs" />
          </button>
        </>
      ) : (
        <>
          <div className="vault-expanded-grid">
            <div className="vault-left-stack">
              <PromptBlock
                label="Image Prompt"
                colorClass="image"
                nodes={imageNodes}
                text={filledImage}
                copied={copiedKey === 'image'}
                onCopy={() => copyText('image', filledImage)}
              />
              <PromptBlock
                label="Video Prompt"
                colorClass="video"
                nodes={videoNodes}
                text={filledVideo}
                copied={copiedKey === 'video'}
                onCopy={() => copyText('video', filledVideo)}
              />
              {filledSfx ? (
                <PromptBlock
                  label="SFX"
                  colorClass="audio"
                  nodes={[]}
                  text={filledSfx}
                  copied={copiedKey === 'sfx'}
                  onCopy={() => copyText('sfx', filledSfx)}
                  highlight={false}
                />
              ) : null}
            </div>
            <div className="vault-right-stack">
              <section className="vault-vars-shell">
                <div className="card-eyebrow">Variables</div>
                <div className="vault-vars-grid">
                  {Object.entries(prompt.variables || {}).map(([name, spec]) => (
                    <div key={`${prompt.id}-${name}`} className="vault-var-card">
                      <div className="vault-var-name">{name}</div>
                      <div className="vault-var-value">{varValues[name] ?? spec?.default ?? ''}</div>
                      <div className="chip-row wrap-row compact-gap">
                        {(spec?.examples || []).map((example) => (
                          <button key={example} type="button" className="vault-example-pill" onClick={() => setVarValues((prev) => ({ ...prev, [name]: example }))}>
                            {example}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
              {prompt.tool_notes ? (
                <section className="vault-notes-shell">
                  <div className="card-eyebrow">Tool notes</div>
                  <p>{prompt.tool_notes}</p>
                </section>
              ) : null}
            </div>
          </div>
          <button type="button" className="vault-expand-button" onClick={() => setExpanded(false)}>
            Back to beginner <ChevronUp className="icon-xs" />
          </button>
        </>
      )}
    </article>
  )
}

export default function PromptVaultClient({ initialCategory = 'All', initialStyle = 'All', initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [style, setStyle] = useState(initialStyle)

  const categories = useMemo(() => ['All', ...new Set(PROMPT_LIBRARY.map((prompt) => prompt.category))], [])
  const styles = useMemo(() => ['All', ...new Set(PROMPT_LIBRARY.map((prompt) => prompt.style))], [])

  const filtered = useMemo(() => {
    const q = normalize(query)
    const base = PROMPT_LIBRARY.filter((prompt) => {
      const matchesCategory = category === 'All' || prompt.category === category
      const matchesStyle = style === 'All' || prompt.style === style
      const matchesQuery =
        !q ||
        String(prompt.id) === q ||
        String(prompt.source_id ?? '').toLowerCase() === q ||
        matchesSearchField(prompt.title, q) ||
        matchesSearchField(prompt.image_prompt, q) ||
        matchesSearchField(prompt.video_prompt, q) ||
        matchesSearchField(prompt.sfx_prompt, q) ||
        prompt.tags.some((tag) => matchesSearchField(tag, q))
      return matchesCategory && matchesStyle && matchesQuery
    })

    const isDefaultAllView = !q && category === 'All' && style === 'All'
    return isDefaultAllView ? curateDefaultAllView(base) : base
  }, [category, query, style])

  return (
    <div className="page-stack vault-live-shell">
      <div className="section-heading left compact-heading">
        <div className="eyebrow">Prompt Vault</div>
        <h1>Prompt discovery in Next.js</h1>
        <p>
          Browse prompts by category, style, and use case. Every entry is built for image-to-video workflows, not generic prompt dumping.
        </p>
      </div>

      <section className="feature-card static-card vault-toolbar-shell">
        <div className="vault-search-wrap">
          <Search className="vault-search-icon" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="enhancer-input vault-search-input"
            placeholder="Search title, image prompt, video prompt, sfx, or prompt id…"
          />
        </div>
        <div className="vault-filter-group">
          <div className="control-label">Category</div>
          <div className="chip-row wrap-row compact-gap">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCategory(item)}
                className="filter-chip-button"
                style={{
                  '--chip-color': CATEGORY_COLORS[item] || '#6366f1',
                  background: category === item ? CATEGORY_COLORS[item] || '#6366f1' : 'rgba(255,255,255,0.82)',
                  color: category === item ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="vault-filter-group">
          <div className="control-label">Style</div>
          <div className="chip-row wrap-row compact-gap">
            {styles.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setStyle(item)}
                className="filter-chip-button"
                style={{
                  '--chip-color': '#8B5CF6',
                  background: style === item ? '#8B5CF6' : 'rgba(255,255,255,0.82)',
                  color: style === item ? '#fff' : 'var(--text-secondary)',
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      </section>

      <div className="vault-count-row">Showing {filtered.length} of {PROMPT_LIBRARY.length} prompts</div>

      <section className="vault-grid-live">
        {filtered.map((prompt) => (
          <PromptCard key={prompt.id} prompt={prompt} />
        ))}
      </section>

      <section className="feature-card static-card helper-card">
        <div className="card-eyebrow">Related routes</div>
        <div className="cta-row route-actions helper-actions">
          <Link href="/prompt-enhancer" className="cta-secondary">Open Prompt Enhancer</Link>
          <Link href="/shot-to-prompt" className="cta-secondary">Open Shot to Prompt</Link>
          <Link href="/pricing" className="cta-primary">View Pricing</Link>
        </div>
      </section>
    </div>
  )
}
