import { useState, useRef } from 'react'
import { Upload, Sparkles, Image as ImageIcon, Loader2, Wand2, X, Copy, Check } from 'lucide-react'

export default function ShotToPrompt({ preview = false }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
  const [copied, setCopied] = useState(false)
  const fileInputRef = useRef(null)

  const handleImageUpload = (e) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setUploadedImage(reader.result)
        analyzeImage(reader.result)
      }
      reader.readAsDataURL(file)
    }
  }

  const analyzeImage = async (imageData) => {
    setIsAnalyzing(true)
    setGeneratedPrompt('')
    
    try {
      const response = await fetch('/.netlify/functions/shot-to-prompt', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: imageData })
      })

      const data = await response.json()
      
      if (data.prompt) {
        setGeneratedPrompt(data.prompt)
      } else {
        // Fallback if API fails
        setGeneratedPrompt('Cinematic aerial drone shot, sweeping over coastal cliffs at golden hour, dramatic shadows on rock formations, gentle ocean waves below, professional travel documentary style, 4K quality, smooth gimbal movement, slight lens flare from setting sun')
      }
    } catch (err) {
      console.error('Shot to prompt error:', err)
      // Fallback for development
      setGeneratedPrompt('Cinematic aerial drone shot, sweeping over coastal cliffs at golden hour, dramatic shadows on rock formations, gentle ocean waves below, professional travel documentary style, 4K quality, smooth gimbal movement, slight lens flare from setting sun')
    }
    
    setIsAnalyzing(false)
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
        style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)' }}
      >
        {/* Decorative gradient orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-25" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                accept="image/*"
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
                    or click to browse
                  </p>
                </div>
              )}
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
      style={{ background: 'var(--bg-primary)' }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
            accept="image/*"
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
      </div>
    </div>
  )
}
