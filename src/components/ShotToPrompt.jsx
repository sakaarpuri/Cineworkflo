import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Sparkles, Image as ImageIcon, Loader2, Wand2, X, Copy, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabase'

const FORCE_PRO_EMAILS = new Set(['puri.sakaar@gmail.com'])
const FREE_USAGE_KEY = 'cwfFreeUsageTotal'
const FREE_USAGE_SCHEMA = 1
const FREE_TOTAL_LIMIT = 5

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

export default function ShotToPrompt({ preview = false }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [copiedSection, setCopiedSection] = useState('')
  const fileInputRef = useRef(null)
  const { user, session, loading: authLoading, isPro } = useAuth()
  const hasForcedProAccess = FORCE_PRO_EMAILS.has(String(user?.email || '').trim().toLowerCase())
  const canUsePro = isPro || hasForcedProAccess

  const [usage, setUsage] = useState({ count: 0, lastReset: new Date().toISOString() })
  const MAX_UPLOAD_MB = 25
  const MAX_VIDEO_SECONDS = 15
  const MAX_BYTES = MAX_UPLOAD_MB * 1024 * 1024

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

  const remainingFree = Math.max(0, FREE_TOTAL_LIMIT - usage.count)
  const isLimitReached = !canUsePro && remainingFree === 0

  const handleMediaUpload = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    // allow re-uploading the same file
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
        setUploadedImage(reader.result)
        analyzeImage(reader.result)
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

    // Video: extract a representative frame client-side and analyze as an image.
    setGeneratedPrompt(null)
    setErrorMessage('')

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

      const captureTime = Math.max(0.05, Math.min(duration * 0.5, duration - 0.05))
      await new Promise((resolve) => {
        video.currentTime = captureTime
        video.onseeked = () => resolve()
      })

      const canvas = document.createElement('canvas')
      canvas.width = video.videoWidth || 1280
      canvas.height = video.videoHeight || 720
      const ctx = canvas.getContext('2d')
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      const frameDataUrl = canvas.toDataURL('image/jpeg', 0.92)

      setUploadedImage(frameDataUrl)
      await analyzeImage(frameDataUrl)
    } catch (err) {
      setUploadedImage(null)
      setGeneratedPrompt(null)
      setErrorMessage(err.message || 'Unable to read video. Please try a shorter MP4/WEBM/MOV.')
    } finally {
      URL.revokeObjectURL(objectUrl)
    }
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

  const requestShotPrompt = async (imageData, accessToken) => {
    const requestHeaders = {
      'Content-Type': 'application/json',
    }
    if (accessToken) {
      requestHeaders.Authorization = `Bearer ${accessToken}`
    }
    const response = await fetch('/.netlify/functions/shot-to-prompt', {
      method: 'POST',
      headers: requestHeaders,
      body: JSON.stringify({ image: imageData })
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const error = new Error(data.error || `Shot to Prompt failed (${response.status})`)
      error.status = response.status
      throw error
    }
    return data
  }

  const analyzeImage = async (imageData) => {
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
      setErrorMessage(!user
        ? 'Free limit reached (5 total generations/month across Enhancer + Shot to Prompt). Sign in or upgrade to continue.'
        : 'Free limit reached (5 total generations/month across Enhancer + Shot to Prompt). Upgrade to continue.'
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
        data = await requestShotPrompt(imageData, accessToken)
      } catch (err) {
        const shouldRetryAuth = err?.status === 401 || /invalid session/i.test(String(err?.message || ''))
        if (!shouldRetryAuth) throw err

        const { data: refreshed, error: refreshError } = await supabase.auth.refreshSession()
        const refreshedToken = refreshed?.session?.access_token
        if (refreshError || !refreshedToken) {
          throw new Error('Session expired. Please sign in again.')
        }
        data = await requestShotPrompt(imageData, refreshedToken)
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

  const clearImage = () => {
    setUploadedImage(null)
    setGeneratedPrompt(null)
    setErrorMessage('')
    setCopiedSection('')
  }

  const handleCopy = (section, value) => {
    if (!value) return
    navigator.clipboard.writeText(value)
    setCopiedSection(section)
    setTimeout(() => {
      setCopiedSection((current) => (current === section ? '' : current))
    }, 2000)
  }

  const PromptSection = ({ label, value, tone, sectionKey }) => (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'var(--bg-primary)',
        border: '2px solid var(--border-color)',
      }}
    >
      <div className="flex items-center justify-between mb-3 gap-3">
        <div
          className="text-xs font-bold flex items-center gap-1.5"
          style={{ color: tone }}
        >
          <Check className="h-4 w-4" />
          {label}
        </div>
        <button
          onClick={() => handleCopy(sectionKey, value)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: copiedSection === sectionKey
              ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)'
              : 'var(--bg-card)',
            color: copiedSection === sectionKey ? '#fff' : 'var(--text-secondary)',
            border: `2px solid ${copiedSection === sectionKey ? 'var(--accent-green)50' : 'var(--border-color)'}`,
            boxShadow: copiedSection === sectionKey
              ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40'
              : 'var(--control-soft-shadow)',
            transform: copiedSection === sectionKey ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
          }}
        >
          {copiedSection === sectionKey ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copiedSection === sectionKey ? 'Copied!' : 'Copy'}
        </button>
      </div>
      <div
        className="w-full rounded-xl text-base leading-relaxed cursor-text select-all"
        style={{
          color: 'var(--text-primary)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          minHeight: '88px'
        }}
        onClick={(e) => {
          const range = document.createRange()
          range.selectNodeContents(e.currentTarget)
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        }}
      >
        {value}
      </div>
    </div>
  )

  const CopyableOutput = () => (
    <div 
      className="mt-4"
      style={{
        background: 'var(--bg-secondary)',
        boxShadow: 'var(--shadow-card)',
        border: '1px solid var(--accent-green)40',
        borderRadius: '1rem',
        padding: '1.25rem'
      }}
    >
      <div className="flex items-center justify-between mb-3">
        <div 
          className="text-xs font-bold flex items-center gap-1.5"
          style={{ color: 'var(--accent-green)' }}
        >
          <Check className="h-4 w-4" />
          STRUCTURED OUTPUT
        </div>
      </div>
      {generatedPrompt?.title ? (
        <div className="mb-4">
          <div className="text-[10px] font-bold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>
            TITLE
          </div>
          <div style={{ color: 'var(--text-primary)', fontWeight: 800, fontSize: 16, lineHeight: 1.35 }}>
            {generatedPrompt.title}
          </div>
        </div>
      ) : null}
      <div className="grid gap-4">
        <PromptSection
          label="IMAGE PROMPT"
          value={generatedPrompt?.image_prompt || ''}
          tone="var(--accent-blue)"
          sectionKey="image"
        />
        <PromptSection
          label="VIDEO PROMPT"
          value={generatedPrompt?.video_prompt || ''}
          tone="var(--accent-purple)"
          sectionKey="video"
        />
      </div>
      <p className="mt-3 text-xs" style={{ color: 'var(--text-muted)', lineHeight: 1.6 }}>
        {generatedPrompt?.tool_notes || 'Click inside a prompt block to select all, or use the Copy button.'}
      </p>
    </div>
  )

  const ErrorNotice = () => (
    <div
      className="rounded-xl p-4"
      style={{
        background: 'var(--accent-red)10',
        border: '1px solid var(--accent-red)30',
        color: 'var(--accent-red)'
      }}
    >
      <div className="text-sm font-semibold mb-1">Unable to generate prompt</div>
      <div className="text-sm" style={{ lineHeight: 1.6 }}>
        {errorMessage}
      </div>
    </div>
  )

  if (preview) {
    return (
      <section 
        className="py-16 transition-colors relative overflow-hidden"
        style={{ background: 'transparent' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="rounded-3xl p-6 lg:p-8"
            style={{
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              boxShadow: 'var(--section-shell-shadow)'
            }}
          >
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
                style={{
                  background: 'var(--accent-purple)15',
                  color: 'var(--accent-purple)'
                }}
              >
                <Wand2 className="h-4 w-4" />
                AI-Powered
              </div>
              <h2 
                className="text-3xl lg:text-4xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                See a shot you love? Steal the prompt.
              </h2>
              {!canUsePro && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: remainingFree <= 1 ? 'var(--accent-red)15' : 'var(--bg-card)',
                    border: `1px solid ${remainingFree <= 1 ? 'var(--accent-red)30' : 'var(--border-color)'}`,
                    color: remainingFree <= 1 ? 'var(--accent-red)' : 'var(--text-muted)'
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{remainingFree} free generations left this month across Enhancer + Shot to Prompt</span>
                </div>
              )}
              <p 
                className="text-xl mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                Upload any frame from a film, ad, or your own footage and we&apos;ll reverse-engineer the exact prompt to recreate it. It&apos;s like Shazam, but for camera work.
              </p>
              <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                {['Decode any shot you see into a ready-to-use prompt', 'Works on movie stills, ad frames, your own clips and more', 'Get a full prompt with camera movement, lighting and style baked in'].map((item, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div 
                      className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: 'var(--accent-purple)15',
                        color: 'var(--accent-purple)'
                      }}
                    >
                      <Sparkles className="h-3 w-3" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Upload Area */}
            <div
              className="rounded-2xl p-8 cursor-pointer transition-all"
              style={{
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)'
              }}
              onClick={() => fileInputRef.current?.click()}
            >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleMediaUpload}
                    accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
                    className="hidden"
                  />

              {uploadedImage ? (
                <div className="space-y-4">
                  <div className="relative">
                    <img 
                      src={uploadedImage} 
                      alt="Uploaded" 
                      className="w-full h-48 object-cover rounded-xl"
                      loading="lazy"
                      decoding="async"
                    />
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        clearImage()
                      }}
                      className="absolute top-2 right-2 p-1.5 rounded-lg"
                      style={{
                        background: 'var(--bg-secondary)',
                        color: 'var(--text-secondary)'
                      }}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  {isAnalyzing ? (
                    <div 
                      className="flex items-center justify-center gap-3 py-4 rounded-xl"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <Loader2 className="h-5 w-5 animate-spin" style={{ color: 'var(--accent-purple)' }} />
                      <span style={{ color: 'var(--text-secondary)' }}>Analyzing shot composition...</span>
                    </div>
                  ) : errorMessage ? (
                    <ErrorNotice />
                  ) : generatedPrompt ? (
                    <CopyableOutput />
                  ) : null}
                </div>
              ) : (
                <div className="text-center py-12 space-y-4">
                  <div>
                    <div 
                      className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '2px dashed var(--border-color)'
                      }}
                    >
                      <ImageIcon className="h-8 w-8" style={{ color: 'var(--text-muted)' }} />
                    </div>
                    <p 
                      className="font-medium mb-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      Drop an image here
                    </p>
                    <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                      {isLimitReached ? 'Free limit reached — upgrade to continue' : 'or click to browse'}
                    </p>
                    <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-2">
                      Max {MAX_UPLOAD_MB}MB • Video up to {MAX_VIDEO_SECONDS}s
                    </p>
                  </div>
                  {errorMessage ? <ErrorNotice /> : null}
                </div>
              )}
            </div>
          </div>
          </div>
        </div>
      </section>
    )
  }

  // Full page version
  return (
    <div 
      className="min-h-screen py-12 transition-colors"
      style={{ background: 'transparent' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className="rounded-3xl p-6 lg:p-8"
          style={{
            background: 'var(--bg-secondary)',
            border: '1px solid var(--border-color)',
            boxShadow: 'var(--section-shell-shadow)'
          }}
        >
        <nav
          aria-label="Breadcrumb"
          className="mb-5 text-sm flex items-center gap-2"
          style={{ color: 'var(--text-muted)' }}
        >
          <Link to="/" className="hover:underline">Home</Link>
          <span>/</span>
          <span style={{ color: 'var(--text-secondary)' }}>Shot to Prompt</span>
        </nav>

        <div className="text-center mb-8">
          <h1 
            className="text-3xl font-bold mb-2"
            style={{ color: 'var(--text-primary)' }}
          >
            See a shot you love? Steal the prompt.
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Upload any frame from a film, ad, or your own footage and we&apos;ll reverse-engineer the exact prompt to recreate it.
          </p>
          {!canUsePro && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: remainingFree <= 1 ? 'var(--accent-red)15' : 'var(--bg-card)',
                border: `1px solid ${remainingFree <= 1 ? 'var(--accent-red)30' : 'var(--border-color)'}`,
                color: remainingFree <= 1 ? 'var(--accent-red)' : 'var(--text-muted)'
              }}
            >
              <Sparkles className="h-3 w-3" />
              <span>{remainingFree} free generations left this month across Enhancer + Shot to Prompt</span>
            </div>
          )}
        </div>

        <div
          className="rounded-2xl p-8 cursor-pointer transition-all"
          style={{
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)'
          }}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleMediaUpload}
            accept="image/jpeg,image/png,image/webp,image/gif,video/mp4,video/webm,video/quicktime"
            className="hidden"
          />

          {!uploadedImage ? (
            <div className="text-center py-16">
              <div 
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                style={{
                  background: 'var(--bg-primary)',
                  border: '2px dashed var(--border-color)'
                }}
              >
                <Upload className="h-10 w-10" style={{ color: 'var(--text-muted)' }} />
              </div>
              <p 
                className="text-xl font-medium mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                Drop your image here
              </p>
              <p style={{ color: 'var(--text-muted)' }}>
                or click to browse from your device
              </p>
              <p style={{ color: 'var(--text-muted)' }} className="text-xs mt-2">
                Max {MAX_UPLOAD_MB}MB • Video up to {MAX_VIDEO_SECONDS}s
              </p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded" 
                  className="w-full max-h-96 object-contain rounded-xl"
                  style={{ minHeight: '15rem' }}
                  loading="eager"
                  decoding="async"
                />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    clearImage()
                  }}
                  className="absolute top-2 right-2 p-2 rounded-lg"
                  style={{
                    background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              {isAnalyzing && (
                <div 
                  className="flex items-center justify-center gap-3 py-6 rounded-xl"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <Loader2 className="h-6 w-6 animate-spin" style={{ color: 'var(--accent-purple)' }} />
                  <span style={{ color: 'var(--text-secondary)' }}>Analyzing shot composition...</span>
                </div>
              )}

              {!isAnalyzing && errorMessage && <ErrorNotice />}

              {generatedPrompt && <CopyableOutput />}
            </div>
          )}
        </div>

        <section
          className="neu-card mt-8 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
            How to get better prompt results
          </h2>
          <ul className="space-y-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
            <li>Use clear, well-lit frames where the subject fills enough of the image.</li>
            <li>Upload the exact moment with the composition you want to replicate.</li>
            <li>After generation, refine the result with style prompts from Prompt Vault.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <Link
              to="/prompts"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                background: 'var(--accent-blue)',
                color: '#fff'
              }}
            >
              Open Prompt Vault
            </Link>
            <Link
              to="/camera-moves"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              Learn Camera Moves
            </Link>
            <Link
              to="/pricing"
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
              style={{
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            >
              View Pricing
            </Link>
          </div>
        </section>

        <section
          className="neu-card mt-6 rounded-2xl p-6"
        >
          <h2 className="text-xl font-semibold mb-4" style={{ color: 'var(--text-primary)' }}>
            Shot to Prompt FAQ
          </h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                What image works best for analysis?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Use a clean frame with visible subject, environment, and lighting. Blurry or very dark images reduce accuracy.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                Can I use movie stills or my own footage frames?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Yes. You can upload references from films, ads, or your own shots to reverse-engineer camera language.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                What should I do after generating the first prompt?
              </h3>
              <p style={{ color: 'var(--text-secondary)' }}>
                Treat it as a base draft, then add style, lens, and motion terms to match your final look.
              </p>
            </div>
          </div>
        </section>
        </div>
      </div>
    </div>
  )
}
