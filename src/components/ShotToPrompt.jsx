import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Upload, Sparkles, Image as ImageIcon, Loader2, Wand2, X, Copy, Check } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export default function ShotToPrompt({ preview = false }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)
  const { user, session, isPro } = useAuth()

  const [usage, setUsage] = useState({ count: 0, lastReset: new Date().toISOString() })
  const FREE_LIMIT = 5

  useEffect(() => {
    const raw = localStorage.getItem('shotToPromptUsage')
    if (!raw) return
    try {
      const parsed = JSON.parse(raw)
      if (parsed && typeof parsed.count === 'number' && parsed.lastReset) {
        setUsage({ count: parsed.count, lastReset: parsed.lastReset })
      }
    } catch {
      // ignore
    }
  }, [])

  useEffect(() => {
    const last = new Date(usage.lastReset)
    const now = new Date()
    const shouldReset = last.getMonth() !== now.getMonth() || last.getFullYear() !== now.getFullYear()
    if (!shouldReset) return
    const reset = { count: 0, lastReset: now.toISOString() }
    setUsage(reset)
    localStorage.setItem('shotToPromptUsage', JSON.stringify(reset))
  }, [usage.lastReset])

  const remainingFree = Math.max(0, FREE_LIMIT - usage.count)
  const isLimitReached = !isPro && remainingFree === 0

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
      if (!allowedTypes.includes(file.type)) {
        setUploadedImage(null)
        setGeneratedPrompt('Unsupported file format. Please upload JPG, PNG, WEBP, or GIF.')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
        analyzeImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData) => {
    if (!session?.access_token) {
      setGeneratedPrompt('Sign in required to use Shot to Prompt.')
      return
    }

    if (isLimitReached) {
      setGeneratedPrompt(!user
        ? 'Free limit reached (5 Shot to Prompt generations/month). Sign in or upgrade to continue.'
        : 'Free limit reached (5 Shot to Prompt generations/month). Upgrade to continue.'
      )
      return
    }

    setIsAnalyzing(true)
    setGeneratedPrompt('')

    if (!isPro) {
      const next = { count: usage.count + 1, lastReset: usage.lastReset }
      setUsage(next)
      localStorage.setItem('shotToPromptUsage', JSON.stringify(next))
    }
    
    try {
      const response = await fetch('/.netlify/functions/shot-to-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`
        },
        body: JSON.stringify({ image: imageData })
      })

      const data = await response.json().catch(() => ({}))
      if (!response.ok) {
        throw new Error(data.error || `Shot to Prompt failed (${response.status})`)
      }

      if (data.prompt) {
        setGeneratedPrompt(data.prompt)
      } else {
        throw new Error('No prompt returned by Shot to Prompt API')
      }
    } catch (err) {
      console.error('Shot to prompt error:', err)
      setGeneratedPrompt(err.message || 'Unable to generate prompt right now. Please retry in a moment.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const clearImage = () => {
    setUploadedImage(null)
    setGeneratedPrompt('')
    setCopied(false)
  }

  const handleCopy = () => {
    if (!generatedPrompt) return
    navigator.clipboard.writeText(generatedPrompt)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  // Copyable Output Component (like PromptEnhancer)
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
          GENERATED PROMPT
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
          style={{
            background: copied 
              ? 'linear-gradient(145deg, var(--accent-green), var(--accent-green)DD)' 
              : 'var(--bg-card)',
            color: copied ? '#fff' : 'var(--text-secondary)',
            border: `2px solid ${copied ? 'var(--accent-green)50' : 'var(--border-color)'}`,
            boxShadow: copied 
              ? 'inset 3px 3px 6px var(--accent-green)60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px var(--accent-green)40'
              : '8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
            transform: copied ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
          }}
        >
          {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
          {copied ? 'Copied!' : 'Copy Prompt'}
        </button>
      </div>
      <div
        className="w-full p-4 rounded-xl text-base leading-relaxed cursor-text select-all"
        style={{
          background: 'var(--bg-primary)',
          border: '2px solid var(--border-color)',
          color: 'var(--text-primary)',
          fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
          minHeight: '100px'
        }}
        onClick={(e) => {
          const range = document.createRange()
          range.selectNodeContents(e.currentTarget)
          const sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        }}
      >
        {generatedPrompt}
      </div>
      <p className="mt-2 text-xs" style={{ color: 'var(--text-muted)' }}>
        Click text to select all, or use the Copy button
      </p>
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
              boxShadow: 'inset 8px 8px 18px rgba(0,0,0,0.08), inset -8px -8px 18px rgba(255,255,255,0.85), 0 10px 28px rgba(15,23,42,0.08)'
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
                Shot to Prompt
              </h2>
              {!isPro && (
                <div className="mb-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
                  style={{
                    background: remainingFree <= 1 ? 'var(--accent-red)15' : 'var(--bg-card)',
                    border: `1px solid ${remainingFree <= 1 ? 'var(--accent-red)30' : 'var(--border-color)'}`,
                    color: remainingFree <= 1 ? 'var(--accent-red)' : 'var(--text-muted)'
                  }}
                >
                  <Sparkles className="h-3 w-3" />
                  <span>{remainingFree} free Shot to Prompt generations remaining this month</span>
                </div>
              )}
              <p 
                className="text-xl mb-6"
                style={{ color: 'var(--text-secondary)' }}
              >
                Upload any reference image or video frame. Our AI analyzes the shot 
                and generates the exact prompt to recreate it.
              </p>
              <ul className="space-y-3" style={{ color: 'var(--text-secondary)' }}>
                {['Reverse-engineer any cinematic shot', 'Upload frames from movies, ads, or your own footage', 'Get detailed prompts with camera settings'].map((item, i) => (
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
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/webp,image/gif"
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
                  ) : generatedPrompt ? (
                    <CopyableOutput />
                  ) : null}
                </div>
              ) : (
                <div className="text-center py-12">
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
            boxShadow: 'inset 8px 8px 18px rgba(0,0,0,0.08), inset -8px -8px 18px rgba(255,255,255,0.85), 0 10px 28px rgba(15,23,42,0.08)'
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
            Shot to Prompt
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Upload any image and get the AI prompt to recreate it
          </p>
          {!isPro && (
            <div className="mt-3 inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
              style={{
                background: remainingFree <= 1 ? 'var(--accent-red)15' : 'var(--bg-card)',
                border: `1px solid ${remainingFree <= 1 ? 'var(--accent-red)30' : 'var(--border-color)'}`,
                color: remainingFree <= 1 ? 'var(--accent-red)' : 'var(--text-muted)'
              }}
            >
              <Sparkles className="h-3 w-3" />
              <span>{remainingFree} free Shot to Prompt generations remaining this month</span>
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
            onChange={handleImageUpload}
            accept="image/jpeg,image/png,image/webp,image/gif"
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
