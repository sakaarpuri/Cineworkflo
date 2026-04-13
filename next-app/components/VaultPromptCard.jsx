'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { BookmarkPlus, Check, ChevronDown, ChevronUp } from 'lucide-react'
import { CATEGORY_COLORS } from '../lib/vault-data'
import { supabase } from '../lib/supabase'

const DEFAULT_EMPTY_SAVE_STATUS = { video: 'idle', start_frame: 'idle', end_frame: 'idle' }

const createGroupId = () => globalThis.crypto?.randomUUID?.() || `cwf_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`
const normalize = (value) => String(value || '').trim().toLowerCase()

const fillTemplateText = (template, valueByNormKey) =>
  String(template || '').replace(/\[([^\]]+)\]/g, (_match, inner) => {
    const key = normalize(inner)
    const value = valueByNormKey?.[key]
    return value ? String(value) : `[${inner}]`
  })

const renderTemplateNodes = (template, valueByNormKey) => {
  const raw = String(template || '')
  const nodes = []
  let lastIndex = 0
  const tokenPattern = /\[([^\]]+)\]/g
  let match
  while ((match = tokenPattern.exec(raw))) {
    if (match.index > lastIndex) nodes.push({ type: 'text', value: raw.slice(lastIndex, match.index) })
    const inner = match[1]
    const key = normalize(inner)
    const resolved = valueByNormKey?.[key]
    nodes.push({ type: 'var', value: resolved ? String(resolved) : `[${inner}]`, missing: !resolved })
    lastIndex = match.index + match[0].length
  }
  if (lastIndex < raw.length) nodes.push({ type: 'text', value: raw.slice(lastIndex) })
  return nodes
}

const pickKeyVariables = (variables) => {
  const keys = Object.keys(variables || {})
  const preferred = ['subject', 'character description', 'character type', 'object type', 'action', 'activity', 'location', 'background', 'mood', 'color', 'color palette', 'lens', 'time of day']
  const normalizedKeys = new Map(keys.map((key) => [normalize(key), key]))
  const picked = []
  for (const preferredKey of preferred) {
    const found = normalizedKeys.get(preferredKey)
    if (found && !picked.includes(found)) picked.push(found)
    if (picked.length >= 5) break
  }
  for (const key of keys) {
    if (picked.length >= 5) break
    if (!picked.includes(key)) picked.push(key)
  }
  return picked
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

function SaveButton({ onSave, status, label = 'Save' }) {
  const saving = status === 'saving'
  const saved = status === 'saved' || status === 'exists'

  return (
    <button
      type="button"
      className={`vault-save-button ${saved ? 'saved' : ''}`}
      onClick={onSave}
      disabled={saving || saved}
      title={status === 'exists' ? 'Already in My Library' : 'Save to My Library'}
    >
      {saved ? <Check className="icon-xs" /> : <BookmarkPlus className="icon-xs" />}
      {saving ? 'Saving…' : saved ? 'Saved' : label}
    </button>
  )
}

export default function VaultPromptCard({ prompt, user, context = 'vault', initialExpanded = false }) {
  const [expanded, setExpanded] = useState(initialExpanded)
  const [copiedKey, setCopiedKey] = useState('')
  const [saveStatus, setSaveStatus] = useState(DEFAULT_EMPTY_SAVE_STATUS)
  const [currentGroupId, setCurrentGroupId] = useState('')
  const isHomepagePreview = context === 'home'
  const promptHref = `/prompts?prompt=${prompt.id}&expand=1`
  const [varValues, setVarValues] = useState(() => {
    const next = {}
    for (const [key, spec] of Object.entries(prompt.variables || {})) next[key] = spec?.default ?? ''
    return next
  })

  useEffect(() => {
    setExpanded(initialExpanded)
  }, [initialExpanded])

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

  const resetSaveState = () => {
    setSaveStatus(DEFAULT_EMPTY_SAVE_STATUS)
    setCurrentGroupId('')
  }

  const handleVariablePick = (name, nextValue) => {
    setVarValues((prev) => {
      if (prev?.[name] === nextValue) return prev
      return { ...prev, [name]: nextValue }
    })

    if (currentGroupId || Object.values(saveStatus).some((status) => status !== 'idle')) {
      resetSaveState()
    }
  }

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
      idea: frameLabel ? `${prompt.title} — ${frameLabel}` : prompt.title,
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
        original_idea: prompt.title,
        library_id: prompt.id,
        category: prompt.category,
        style: prompt.style,
        best_on: prompt.best_on || [],
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
      return
    }

    if (error.code === '23505') {
      setCurrentGroupId(groupId)
      setSaveStatus((previous) => ({ ...previous, [saveMode]: 'exists' }))
      return
    }

    setSaveStatus((previous) => ({ ...previous, [saveMode]: 'error' }))
    window.setTimeout(() => setSaveStatus((previous) => ({ ...previous, [saveMode]: 'idle' })), 2500)
  }

  return (
    <article id={`prompt-${prompt.id}`} className={`vault-card-live ${isHomepagePreview ? 'vault-card-home-preview' : ''}`}>
      {prompt.thumbnail_url ? <img src={prompt.thumbnail_url} alt={prompt.title} className="vault-card-thumb" loading="lazy" /> : null}
      <div className="vault-card-top">
        <div className="vault-id-row">
          <span className="vault-id-pill">#{prompt.id}</span>
          <span className="vault-category-pill" style={{ '--cat-color': categoryColor }}>{prompt.category}</span>
          <span className="vault-style-text">{prompt.style}</span>
        </div>
        {user ? (
          <div className="vault-tool-row">
            <SaveButton onSave={() => handleSave('video')} status={saveStatus.video} label="Save Prompt" />
          </div>
        ) : null}
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
          {isHomepagePreview ? (
            <div className="vault-home-action-row">
              <button type="button" className="vault-expand-button" onClick={() => setExpanded(true)}>
                Quick preview <ChevronDown className="icon-xs" />
              </button>
              <Link href={promptHref} className="vault-expand-button homepage-vault-expand-link">
                See pro controls <ChevronDown className="icon-xs" />
              </Link>
            </div>
          ) : (
            <button type="button" className="vault-expand-button" onClick={() => setExpanded(true)}>
              Show pro controls <ChevronDown className="icon-xs" />
            </button>
          )}
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
                          <button key={example} type="button" className="vault-example-pill" onClick={() => handleVariablePick(name, example)}>
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
              <section className="vault-notes-shell">
                <div className="card-eyebrow">{user ? 'Save variants' : 'Save to My Library'}</div>
                {user ? (
                  <div className="vault-save-row">
                    <SaveButton onSave={() => handleSave('start_frame')} status={saveStatus.start_frame} label="Save Start Frame" />
                    <SaveButton onSave={() => handleSave('end_frame')} status={saveStatus.end_frame} label="Save End Frame" />
                  </div>
                ) : (
                  <p>
                    <Link href={`/sign-in?next=%2Fprompts`} className="inline-text-link">
                      Sign in
                    </Link>{' '}
                    to save prompt variants and keep them grouped in My Library.
                  </p>
                )}
              </section>
            </div>
          </div>
          {isHomepagePreview ? (
            <div className="vault-home-action-row">
              <button type="button" className="vault-expand-button" onClick={() => setExpanded(false)}>
                Back to Essential <ChevronUp className="icon-xs" />
              </button>
              <Link href={promptHref} className="vault-expand-button homepage-vault-expand-link">
                See prompt in Vault <ChevronDown className="icon-xs" />
              </Link>
            </div>
          ) : (
            <button type="button" className="vault-expand-button" onClick={() => setExpanded(false)}>
              Back to Essential <ChevronUp className="icon-xs" />
            </button>
          )}
        </>
      )}
    </article>
  )
}
