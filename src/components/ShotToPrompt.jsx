import { useState, useRef } from 'react'
import { Upload, Sparkles, Image as ImageIcon, Loader2, Wand2, X } from 'lucide-react'

export default function ShotToPrompt({ preview = false }) {
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [generatedPrompt, setGeneratedPrompt] = useState('')
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
    setTimeout(() => {
      setGeneratedPrompt(`Cinematic aerial drone shot, sweeping over coastal cliffs at golden hour, dramatic shadows on rock formations, gentle ocean waves below, professional travel documentary style, 4K quality, smooth gimbal movement, slight lens flare from setting sun`)
      setIsAnalyzing(false)
    }, 2000)
  }

  const clearImage = () => {
    setUploadedImage(null)
    setGeneratedPrompt('')
  }

  if (preview) {
    return (
      <section 
        className="py-16 transition-colors relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, var(--bg-secondary) 0%, #F3E8FF 50%, var(--bg-secondary) 100%)' }}
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
                    <div 
                      className="p-4 rounded-xl"
                      style={{
                        background: 'var(--bg-primary)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <p 
                        className="text-sm mb-3 italic"
                        style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
                      >
                        "{generatedPrompt}"
                      </p>
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          navigator.clipboard.writeText(generatedPrompt)
                        }}
                        className="w-full py-2 rounded-lg text-sm font-medium transition-all"
                        style={{
                          background: 'var(--accent-purple)',
                          color: '#fff'
                        }}
                      >
                        Copy Prompt
                      </button>
                    </div>
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

              {generatedPrompt && (
                <div 
                  className="p-6 rounded-xl"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <h3 
                    className="text-sm font-bold mb-3"
                    style={{ color: 'var(--accent-purple)' }}
                  >
                    Generated Prompt
                  </h3>
                  <p 
                    className="mb-4 italic leading-relaxed"
                    style={{ color: 'var(--text-primary)', fontFamily: 'Georgia, serif' }}
                  >
                    "{generatedPrompt}"
                  </p>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      navigator.clipboard.writeText(generatedPrompt)
                    }}
                    className="w-full py-3 rounded-xl font-medium transition-all"
                    style={{
                      background: 'var(--accent-purple)',
                      color: '#fff'
                    }}
                  >
                    Copy Prompt
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
