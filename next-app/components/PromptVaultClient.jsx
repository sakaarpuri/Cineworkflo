'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Search } from 'lucide-react'
import { CATEGORY_COLORS, PROMPT_LIBRARY } from '../lib/vault-data'
import { useAuth } from '../contexts/AuthContext'
import VaultPromptCard from './VaultPromptCard'

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

export default function PromptVaultClient({ initialCategory = 'All', initialStyle = 'All', initialQuery = '' }) {
  const [query, setQuery] = useState(initialQuery)
  const [category, setCategory] = useState(initialCategory)
  const [style, setStyle] = useState(initialStyle)
  const { user } = useAuth()

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
        <h1>Curated prompts for real image-to-video work.</h1>
        <p>Browse prompts by category, style, and use case, then refine them with variables and pro prompt controls.</p>
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
                  '--chip-selected': CATEGORY_COLORS[item] || '#6366f1',
                  background:
                    category === item
                      ? `linear-gradient(145deg, color-mix(in srgb, ${CATEGORY_COLORS[item] || '#6366f1'} 92%, white 8%), color-mix(in srgb, ${CATEGORY_COLORS[item] || '#6366f1'} 86%, black 14%))`
                      : 'rgba(255,255,255,0.045)',
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
                  '--chip-selected': '#8B5CF6',
                  background:
                    style === item
                      ? 'linear-gradient(145deg, color-mix(in srgb, #8B5CF6 92%, white 8%), color-mix(in srgb, #8B5CF6 86%, black 14%))'
                      : 'rgba(255,255,255,0.045)',
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
          <VaultPromptCard key={prompt.id} prompt={prompt} user={user} />
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
