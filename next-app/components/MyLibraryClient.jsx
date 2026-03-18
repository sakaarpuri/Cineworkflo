'use client'

import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const VARIANT_ORDER = { start_frame: 0, end_frame: 1, motion_prompt: 2, video_prompt: 3 }

export default function MyLibraryClient() {
  const { user, loading: authLoading } = useAuth()
  const [savedPrompts, setSavedPrompts] = useState([])
  const [loading, setLoading] = useState(true)
  const [copiedId, setCopiedId] = useState(null)
  const [error, setError] = useState('')

  const groupedPrompts = useMemo(() => {
    const groups = []
    const byGroupId = new Map()

    for (const item of savedPrompts) {
      const groupId = item.metadata?.group_id
      if (!groupId) {
        groups.push({
          id: item.id,
          groupId: null,
          title: item.idea || 'Untitled idea',
          createdAt: item.created_at,
          items: [item],
          legacy: true,
        })
        continue
      }

      if (!byGroupId.has(groupId)) {
        const nextGroup = {
          id: groupId,
          groupId,
          title: item.metadata?.original_idea || item.idea || 'Untitled idea',
          createdAt: item.created_at,
          items: [],
          legacy: false,
        }
        byGroupId.set(groupId, nextGroup)
        groups.push(nextGroup)
      }

      byGroupId.get(groupId).items.push(item)
    }

    return groups.map((group) => ({
      ...group,
      items: [...group.items].sort((a, b) => {
        const aType = a.metadata?.variant_type || a.metadata?.frame_role || 'video_prompt'
        const bType = b.metadata?.variant_type || b.metadata?.frame_role || 'video_prompt'
        return (VARIANT_ORDER[aType] ?? 99) - (VARIANT_ORDER[bType] ?? 99)
      }),
    }))
  }, [savedPrompts])

  useEffect(() => {
    const loadSavedPrompts = async () => {
      if (authLoading) return
      if (!user) {
        setSavedPrompts([])
        setLoading(false)
        return
      }

      setLoading(true)
      setError('')
      const { data, error: fetchError } = await supabase
        .from('saved_prompts')
        .select('id, idea, prompt, mood, use_case, skill_level, include_audio_sfx, include_image_details, metadata, created_at')
        .order('created_at', { ascending: false })

      if (fetchError) {
        setError(fetchError.message || 'Failed to load saved prompts.')
        setSavedPrompts([])
      } else {
        setSavedPrompts(data || [])
      }
      setLoading(false)
    }

    loadSavedPrompts()
  }, [authLoading, user])

  const getVariantLabel = (item) => {
    const type = item.metadata?.variant_type || item.metadata?.frame_role
    if (type === 'start_frame') return 'Start Frame'
    if (type === 'end_frame') return 'End Frame'
    if (type === 'motion_prompt') return 'Motion Prompt'
    if (type === 'video_prompt') return 'Video Prompt'
    return item.skill_level || 'Prompt'
  }

  const handleCopy = async (id, prompt) => {
    await navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    window.setTimeout(() => setCopiedId((current) => (current === id ? null : current)), 1800)
  }

  const handleDelete = async (id) => {
    const { error: deleteError } = await supabase.from('saved_prompts').delete().eq('id', id)
    if (deleteError) {
      setError(deleteError.message || 'Failed to delete saved prompt.')
      return
    }
    setSavedPrompts((previous) => previous.filter((item) => item.id !== id))
  }

  if (authLoading) {
    return (
      <div className="page-stack">
        <div className="status-card">Checking your library access…</div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="page-stack">
        <section className="feature-card static-card">
          <div className="card-eyebrow">My Library</div>
          <h1>Your saved prompts, all in one place.</h1>
          <p>Sign in to sync saved prompts across devices and keep your prompt variants together.</p>
          <div className="cta-row route-actions">
            <Link href="/sign-in?next=%2Fmy-library" className="cta-primary">
              Sign In
            </Link>
            <Link href="/prompt-enhancer" className="cta-secondary">
              Go to Prompt Enhancer
            </Link>
          </div>
        </section>
      </div>
    )
  }

  return (
    <div className="page-stack">
      <div className="section-heading left compact-heading">
        <div className="eyebrow">My Library</div>
        <h1>Saved prompts from your real workflow.</h1>
        <p>Everything you save from Prompt Enhancer stays grouped here, including start frames, motion prompts, and final video prompts.</p>
      </div>

      <div className="cta-row route-actions">
        <Link href="/prompt-enhancer" className="cta-primary">
          Create new prompt
        </Link>
        <Link href="/prompts" className="cta-secondary">
          Browse Prompt Vault
        </Link>
      </div>

      {loading ? <div className="status-card">Loading saved prompts…</div> : null}
      {!loading && error ? <div className="error-card">{error}</div> : null}

      {!loading && !error && savedPrompts.length === 0 ? (
        <section className="feature-card static-card">
          <div className="card-eyebrow">Nothing saved yet</div>
          <p>Generate a prompt in Prompt Enhancer, then save it to see it show up here.</p>
        </section>
      ) : null}

      {!loading && savedPrompts.length > 0 ? (
        <div className="library-grid">
          {groupedPrompts.map((group) => (
            <article key={group.id} className="feature-card static-card library-group-card">
              <div className="library-group-head">
                <div>
                  <div className="card-eyebrow">Saved set</div>
                  <h2>{group.title}</h2>
                  <p>{new Date(group.createdAt).toLocaleString()}</p>
                </div>
                {!group.legacy ? (
                  <div className="chip-row wrap-row compact-gap">
                    {group.items.map((item) => (
                      <span key={`${group.id}-${item.id}`} className="loop-chip">
                        {getVariantLabel(item)}
                      </span>
                    ))}
                  </div>
                ) : null}
              </div>

              <div className="library-item-stack">
                {group.items.map((item) => (
                  <section key={item.id} className="library-prompt-card">
                    <div className="library-prompt-head">
                      <div className="chip-row wrap-row compact-gap">
                        <span className="loop-chip">{getVariantLabel(item)}</span>
                        {item.mood ? <span className="loop-chip">{item.mood}</span> : null}
                        {item.use_case ? <span className="loop-chip">{item.use_case}</span> : null}
                        {item.include_audio_sfx ? <span className="loop-chip">SFX</span> : null}
                      </div>
                      <div className="library-action-row">
                        <button type="button" className="copy-action" onClick={() => handleCopy(item.id, item.prompt)}>
                          {copiedId === item.id ? 'Copied ✓' : 'Copy'}
                        </button>
                        <button type="button" className="library-delete-button" onClick={() => handleDelete(item.id)}>
                          <Trash2 className="icon-sm" />
                          Delete
                        </button>
                      </div>
                    </div>
                    <div className="vault-mono-text">{item.prompt}</div>
                  </section>
                ))}
              </div>
            </article>
          ))}
        </div>
      ) : null}
    </div>
  )
}
