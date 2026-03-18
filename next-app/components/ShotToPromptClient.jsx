'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { supabase } from '../lib/supabase'

const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com'])
const FREE_USAGE_KEY = 'cwfFreeUsageTotal'
const FREE_USAGE_SCHEMA = 1
const FREE_TOTAL_LIMIT = 5
const MAX_UPLOAD_MB = 25
const MAX_VIDEO_SECONDS = 15
const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024

const getSharedUsage = () => {
  const fallback = { count: 0, lastReset: new Date().toISOString(), schemaVersion: FREE_USAGE_SCHEMA }
  const raw = localStorage.getItem(FREE_USAGE_KEY)
  if (!raw) return fallback
  try {
    const parsed = JSON.parse(raw)
    if (!parsed || parsed.schemaVersion !== FREE_USAGE_SCHEMA) return fallback
    return {
      ...fallback,
      ...parsed,
      count: Number.isFinite(parsed.count) ? parsed.count : 0,
    }
  } catch {
    return fallback
  }
}

const saveSharedUsage = (value) => {
  localStorage.setItem(FREE_USAGE_KEY, JSON.stringify({ ...value, schemaVersion: FREE_USAGE_SCHEMA }))
}

const hasProAccess = (user) => {
  if (!user) return false
  if (FORCE_PRO_EMAILS.has(String(user.email || '').trim().toLowerCase())) return true
  const proExpiresAt = user.user_metadata?.pro_expires_at
  if (proExpiresAt) {
    return new Date(proExpiresAt) > new Date()
  }
  return user.user_metadata?.is_pro === true
}

export default function ShotToPromptClient() {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedSection, setCopiedSection] = useState('')
  const [uploadKind, setUploadKind] = useState('image')
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const [usage, setUsage] = useState({ count: 0, lastReset: new Date().toISOString() })
  const fileInputRef = useRef(null)

  const canUsePro = hasProAccess(user)
  const remainingFree = Math.max(0, FREE_TOTAL_LIMIT - usage.count)
  const isLimitReached = !canUsePro && remainingFree === 0

  useEffect(() => {
    setUsage(getSharedUsage())
  }, [])

  useEffect(() => {
    const last = new Date(usage.lastReset)
    const now = new Date()
    const shouldReset = last.getMonth() !== now.getMonth() || last.getFullYear() !== now.getFullYear()
    if (!shouldReset) return
    const reset = { count: 0, lastReset: now.toISOString() }
    setUsage(reset)
    saveSharedUsage(reset)
  }, [usage.lastReset])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!mounted) return
      setSession(session)
      setUser(session?.user ?? null)
      setAuthLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession)
      setUser(nextSession?.user ?? null)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  }, [])

  const captureVideoFrame = async (video, captureTime) => {
    await new Promise((resolve) => {
      video.currentTime = captureTime
      video.onseeked = () => resolve()
    })

    const canvas = document.createElement('canvas')
    canvas.width = video.videoWidth || 1280
    canvas.height = video.videoHeight || 720
    const ctx = canvas.getContext('2d')
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    return canvas.toDataURL('image/jpeg', 0.9)
  }

  const getValidAccessToken = async () => {
    if (!user) return ''
    if (session?.access_token) return session.access_token

    const { data: latestAuth } = await supabase.auth.getSession()
    if (latestAuth?.session?.access_token) return latestAuth.session.access_token

    const { data: refreshed, error } = await supabase.auth.refreshSession()
    if (error) return ''
    return refreshed?.session?.access_token || ''
  }

  const requestShotPrompt = async (payload, accessToken) => {
    const requestHeaders = {
      'Content-Type': 'application/json',
    }
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`
    }
    const response = await fetch('/.netlify/functions/shot-to-prompt', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify(payload),
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(data.error || `Shot to Prompt failed (${response.status})`)
      error.status = response.status
      throw error
    }
    return data
  }

  const analyzeMedia = async (payload) => {
    if (authLoading) {
      setGeneratedPrompt(null)
      setErrorMessage('Checking your session…')
      return
    }

    const accessToken = await getValidAccessToken()

    if (user && !accessToken) {
      setGeneratedPrompt(null)
      setErrorMessage('Session expired. Please sign in again.')
      return
    }

    if (isLimitReached) {
      setGeneratedPrompt(null)
      setErrorMessage(
        !user
          ? 'Free limit reached (5 total generations/month across Enhancer + Shot to Prompt). Sign in or upgrade to continue.'
          : 'Free limit reached (5 total generations/month across Enhancer + Shot to Prompt). Upgrade to continue.',
      )
      return
    }

    setIsAnalyzing(true)
    setGeneratedPrompt(null)
    setErrorMessage('')
    setCopiedSection('')

    try {
      let data
      try {
        data = await requestShotPrompt(payload, accessToken)
      } catch (err) {
        const shouldRetryAuth = err?.status === 401 || /invalid session/i.test(String(err?.message || ''))
        if (!shouldRetryAuth) throw err

        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
        const refreshedToken = refreshed?.session?.access_token
        if (refreshError || !refreshedToken) {
          throw new Error('Session expired. Please sign in again.')
        }
        data = await requestShotPrompt(payload, refreshedToken)
      }

      if (data.image_prompt && data.video_prompt) {
        setGeneratedPrompt({
          title: String(data.title || '').trim(),
          image_prompt: String(data.image_prompt || '').trim(),
          video_prompt: String(data.video_prompt || '').trim(),
          tool_notes: String(data.tool_notes || '').trim(),
        })
        if (!canUsePro) {
          const next = { count: usage.count + 1, lastReset: usage.lastReset }
          setUsage(next)
          saveSharedUsage(next)
        }
      } else {
        throw new Error('No structured prompt returned by Shot to Prompt API')
      }
    } catch (err) {
      console.error('Shot to prompt error:', err)
      setGeneratedPrompt(null)
      setErrorMessage(err.message || 'Unable to generate prompt right now. Please retry in a moment.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    e.target.value = ''

    if (file.size > MAX_BYTES) {
      setUploadedImage(null)
      setGeneratedPrompt(null)
      setErrorMessage(`File too large. Max ${MAX_UPLOAD_MB}MB.`)
      return
    }

    const allowedImages = new Set(['image/jpeg', 'image/png', 'image/webp', 'image/gif'])
    const allowedVideos = new Set(['video/mp4', 'video/webm', 'video/quicktime'])

    if (allowedImages.has(file.type)) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadKind('image')
        setUploadedImage(reader.result)
        analyzeMedia({ image: reader.result, sourceType: 'image' })
      }
      reader.readAsDataURL(file)
      return
    }

    if (!allowedVideos.has(file.type)) {
      setUploadedImage(null)
      setGeneratedPrompt(null)
      setErrorMessage('Unsupported file format. Upload JPG/PNG/WEBP/GIF, or MP4/WEBM/MOV (≤15s).')
      return
    }

    setGeneratedPrompt(null)
    setErrorMessage('')
    setUploadKind('video')

    const objectUrl = URL.createObjectURL(file)
    try {
      const video = document.createElement('video')
      video.preload = 'metadata'
      video.muted = true
      video.playsInline = true
      video.src = objectUrl

      await new Promise((resolve, reject) => {
        video.onloadedmetadata = () => resolve()
        video.onerror = () => reject(new Error('Unable to read video metadata.'))
      })

      const duration = Number(video.duration || 0)
      if (!Number.isFinite(duration) || duration <= 0) {
        throw new Error('Unable to read video duration.')
      }
      if (duration > MAX_VIDEO_SECONDS) {
        throw new Error(`Video too long. Max ${MAX_VIDEO_SECONDS} seconds.`)
      }

      const captureTimes = [
        Math.max(0.05, Math.min(duration * 0.15, duration - 0.1)),
        Math.max(0.05, Math.min(duration * 0.5, duration - 0.05)),
        Math.max(0.05, Math.min(duration * 0.85, duration - 0.05)),
      ]
      const frames = []
      for (const captureTime of captureTimes) {
        frames.push(await captureVideoFrame(video, captureTime))
      }

      setUploadedImage(frames[1])
      await analyzeMedia({ image: frames[1], frames, sourceType: 'video' })
    } catch (err) {
      setUploadedImage(null)
      setUploadKind('image')
      setGeneratedPrompt(null)
      setErrorMessage(err.message || 'Unable to read video. Please try a shorter MP4/WEBM/MOV.')
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setUploadKind('image')
    setGeneratedPrompt(null)
    setErrorMessage('')
    setCopiedSection('')
  }

  const handleCopy = async (section, value) => {
    if (!value) return
    await navigator.clipboard.writeText(value)
    setCopiedSection(section)
    window.setTimeout(() => {
      setCopiedSection((current) => (current === section ? '' : current))
    }, 2000)
  }

  const renderOutputCard = (label, value, sectionKey, toneClass) => (
    <div className="output-card live-output-card">
      <div className="output-header">
        <span className={`output-label ${toneClass}`}>{label}</span>
        <button type="button" className="copy-action" onClick={() => handleCopy(sectionKey, value)}>
          {copiedSection === sectionKey ? 'Copied ✓' : `Copy ${label}`}
        </button>
      </div>
      <p className="mono-output">{value}</p>
    </div>
  )

  return (
    <div className="page-stack">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Shot to Prompt</span>
      </div>

      <section className="shot-live-shell">
        <div className="section-heading left compact-heading">
          <div className="eyebrow">Reference-first workflow</div>
          <h1>Start from a shot you love.</h1>
          <p>
            Upload a frame or a short single-shot clip and CineWorkflo reverse-engineers the still-image look plus the
            motion language behind it.
          </p>
          {!canUsePro ? (
            <div className="usage-pill warnable">
              {remainingFree} free generations left this month across Enhancer + Shot to Prompt
            </div>
          ) : (
            <div className="usage-pill success">Pro access active</div>
          )}
        </div>

        <div className="upload-shell live-upload-shell" onClick={() => fileInputRef.current?.click()}>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaUpload}
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            className="hidden-input"
          />

          {!uploadedImage ? (
            <>
              <div className="upload-icon">+</div>
              <div>
                <h2>Drop your image or short clip here</h2>
                <p>Max {MAX_UPLOAD_MB}MB · video up to {MAX_VIDEO_SECONDS}s · best for one continuous shot</p>
              </div>
            </>
          ) : (
            <div className="uploaded-preview-wrap">
              <img src={uploadedImage} alt="Uploaded reference" className="uploaded-preview" />
              <button
                type="button"
                className="clear-upload"
                onClick={(event) => {
                  event.stopPropagation()
                  clearImage()
                }}
              >
                Clear
              </button>
            </div>
          )}
        </div>

        {isAnalyzing ? (
          <div className="status-card">{uploadKind === 'video' ? 'Analyzing shot motion across the clip…' : 'Analyzing shot composition…'}</div>
        ) : null}

        {!isAnalyzing && errorMessage ? <div className="error-card">{errorMessage}</div> : null}

        {generatedPrompt ? (
          <div className="live-output-grid">
            {generatedPrompt.title ? (
              <div className="feature-card static-card output-title-card">
                <div className="card-eyebrow">Title</div>
                <h2>{generatedPrompt.title}</h2>
              </div>
            ) : null}
            {renderOutputCard('Image Prompt', generatedPrompt.image_prompt, 'image', 'image')}
            {renderOutputCard('Video Prompt', generatedPrompt.video_prompt, 'video', 'video')}
            <div className="feature-card static-card notes-card">
              <div className="card-eyebrow">Next step</div>
              <p>{generatedPrompt.tool_notes || 'Refine this result in Prompt Enhancer, then match styles or references in Prompt Vault.'}</p>
            </div>
          </div>
        ) : null}

        <section className="feature-card static-card helper-card">
          <div className="card-eyebrow">How to get better prompt results</div>
          <ul className="benefit-list compact">
            <li>Use clear, well-lit frames where the subject and environment are visible.</li>
            <li>Upload the exact composition you want to replicate — especially for still images.</li>
            <li>Video works best when it is one continuous shot, not a montage or full edit.</li>
          </ul>
          <div className="cta-row route-actions helper-actions">
            <Link href="/prompts" className="cta-primary">Open Prompt Vault</Link>
            <Link href="/pricing" className="cta-secondary">View Pricing</Link>
          </div>
        </section>
      </section>
    </div>
  )
}
