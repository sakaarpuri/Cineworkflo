'use client'

import { ArrowRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import VaultPromptCard from './VaultPromptCard'
import { PROMPT_LIBRARY } from '../lib/vault-data'
import { FEATURED_VAULT_CARD_IDS } from '../lib/prompt-data'

const FEATURED_PROMPTS = FEATURED_VAULT_CARD_IDS.map((id) => PROMPT_LIBRARY.find((prompt) => Number(prompt.id) === Number(id))).filter(Boolean)

export default function HomeVaultPreviewGrid() {
  const router = useRouter()
  const { user } = useAuth()
  const [vaultToggle, setVaultToggle] = useState(false)

  const handleVaultToggle = () => {
    setVaultToggle(true)
    window.setTimeout(() => router.push('/prompts'), 280)
  }

  return (
    <>
      <div className="vault-preview-toggle-row">
        <div className="vault-preview-toggle-copy">
          <h2>Prompt Vault</h2>
          <p>Browse a curated slice of the Vault, then open the full library for pro prompt controls, variables, and category filters.</p>
          <span className="vault-preview-note">Designed for image-to-video. Lock the look with an image, then drive the shot with the video prompt.</span>
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

      <section className="vault-grid-live homepage-vault-grid">
        {FEATURED_PROMPTS.map((prompt) => (
          <VaultPromptCard key={prompt.id} prompt={prompt} user={user} context="home" />
        ))}
      </section>
    </>
  )
}
