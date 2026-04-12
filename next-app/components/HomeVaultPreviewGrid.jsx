'use client'

import Link from 'next/link'
import { ArrowRight, ChevronDown } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { CATEGORY_COLORS, PROMPT_LIBRARY } from '../lib/vault-data'
import { FEATURED_VAULT_CARD_IDS } from '../lib/prompt-data'

const normalize = (value) => String(value || '').trim().toLowerCase()

const fillTemplateText = (template, valueByNormKey) =>
  String(template || '').replace(/\[([^\]]+)\]/g, (_match, inner) => {
    const key = normalize(inner)
    const value = valueByNormKey?.[key]
    return value ? String(value) : `[${inner}]`
  })

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

const FEATURED_PROMPTS = FEATURED_VAULT_CARD_IDS.map((id) => PROMPT_LIBRARY.find((prompt) => Number(prompt.id) === Number(id))).filter(Boolean)

export default function HomeVaultPreviewGrid() {
  const router = useRouter()
  const [vaultToggle, setVaultToggle] = useState(false)

  const handleVaultToggle = () => {
    setVaultToggle(true)
    window.setTimeout(() => router.push('/prompts'), 280)
  }

  return (
    <>
      <div className="vault-preview-toggle-row">
        <div className="vault-preview-toggle-copy">
          <h3>Prompt Vault</h3>
          <p>Browse a curated slice of the Vault, then open the full library for pro prompt controls, variables, and category filters.</p>
        </div>
        <button
          type="button"
          onClick={handleVaultToggle}
          className={`vault-preview-toggle ${vaultToggle ? 'active' : ''}`}
          aria-label="Explore Prompt Vault"
        >
          <span className="vault-preview-toggle-track">
            <span className="vault-preview-toggle-knob">
              <ArrowRight className="icon-xs" />
            </span>
          </span>
        </button>
      </div>

      <div className="vault-grid-live homepage-vault-grid">
        {FEATURED_PROMPTS.map((prompt) => {
          const categoryColor = CATEGORY_COLORS[prompt.category] || '#2563eb'
          const keyVars = pickKeyVariables(prompt.variables)
          const valueByNormKey = Object.fromEntries(
            Object.entries(prompt.variables || {}).map(([key, spec]) => [normalize(key), spec?.default ?? ''])
          )
          const filledVideo = fillTemplateText(prompt.video_prompt, valueByNormKey)

          return (
            <article key={prompt.id} className="vault-card-live homepage-vault-card">
              {prompt.thumbnail_url ? <img src={prompt.thumbnail_url} alt={prompt.title} className="vault-card-thumb" loading="lazy" /> : null}
              <div className="vault-card-top">
                <div className="vault-id-row">
                  <span className="vault-id-pill">#{prompt.id}</span>
                  <span className="vault-category-pill" style={{ '--cat-color': categoryColor }}>{prompt.category}</span>
                  <span className="vault-style-text">{prompt.style}</span>
                </div>
              </div>

              <h3 className="vault-card-title">{prompt.title}</h3>

              <div className="chip-row wrap-row compact-gap">
                {keyVars.map((item) => (
                  <span key={`${prompt.id}-${item}`} className="vault-keyvar-pill">{item}</span>
                ))}
              </div>

              <section className="vault-prompt-block homepage-vault-prompt-block">
                <div className="vault-prompt-head">
                  <div className="output-label video">Video Prompt</div>
                  <span className="copy-action static">Preview</span>
                </div>
                <div className="vault-mono-text">{filledVideo}</div>
              </section>

              <Link href="/prompts" className="vault-expand-button homepage-vault-expand-link">
                Show pro controls <ChevronDown className="icon-xs" />
              </Link>
            </article>
          )
        })}
      </div>
    </>
  )
}
