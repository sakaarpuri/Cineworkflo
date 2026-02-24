import { useState, useRef } from 'react'
import { Upload, Sparkles, Image as ImageIcon, Loader2, Lock } from 'lucide-react'

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
    // TODO: Call Claude API
    setTimeout(() => {
      setGeneratedPrompt(`Cinematic aerial drone shot, sweeping over coastal cliffs at golden hour, dramatic shadows on rock formations, gentle ocean waves below, professional travel documentary style, 4K quality, smooth gimbal movement, slight lens flare from setting sun`)
      setIsAnalyzing(false)
    }, 2000)
  }

  if (preview) {
    return (
      <section className="py-20 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered
              </div>
              <h2 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                Shot to Prompt
              </h2>
              <p className="text-xl text-gray-300 mb-6">
                Upload any reference image or video frame. Our AI analyzes the shot 
                and generates the exact prompt to recreate it.
              </p>
              <ul className="space-y-3 text-gray-300">
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-brand-500/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-400 text-sm">1</span>
                  </div>
                  Upload your reference shot
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-brand-500/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-400 text-sm">2</span>
                  </div>
                  AI analyzes composition, lighting, camera movement
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-brand-500/20 rounded-full flex items-center justify-center">
                    <span className="text-brand-400 text-sm">3</span>
                  </div>
                  Get optimized prompt for your AI video tool
                </li>
              </ul>
            </div>
            <div className="bg-gray-800 rounded-2xl p-8 border border-gray-700">
              <div className="text-center">
                <div className="w-20 h-20 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-gray-500" />
                </div>
                <h3 className="font-display font-bold text-xl mb-2">Pro Feature</h3>
                <p className="text-gray-400 mb-6">
                  Upload unlimited shots and get AI-generated prompts
                </p>
                <a 
                  href="#pricing"
                  className="inline-block bg-brand-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                >
                  Upgrade to Pro
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    )
  }

  return (
    <section className="py-20 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="font-display text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
            Shot to Prompt
          </h1>
          <p className="text-xl text-gray-600">
            Upload a reference image and get the AI prompt to recreate it
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          {!uploadedImage ? (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center cursor-pointer hover:border-brand-500 hover:bg-brand-50/50 transition-colors"
            >
              <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="font-display font-bold text-lg text-gray-900 mb-2">
                Upload Reference Shot
              </h3>
              <p className="text-gray-500 mb-4">
                Drag and drop or click to upload an image
              </p>
              <span className="inline-flex items-center gap-2 text-sm text-brand-600">
                <Upload className="h-4 w-4" />
                Supported: JPG, PNG, WebP
              </span>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
          ) : (
            <div className="space-y-6">
              <div className="relative">
                <img 
                  src={uploadedImage} 
                  alt="Uploaded reference" 
                  className="w-full max-h-96 object-contain rounded-lg"
                />
                <button
                  onClick={() => {
                    setUploadedImage(null)
                    setGeneratedPrompt('')
                  }}
                  className="absolute top-2 right-2 bg-gray-900/50 text-white px-3 py-1 rounded-full text-sm hover:bg-gray-900/70"
                >
                  Change
                </button>
              </div>

              {isAnalyzing ? (
                <div className="text-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-brand-600 mx-auto mb-4" />
                  <p className="text-gray-600">Analyzing shot composition, lighting, and style...</p>
                </div>
              ) : generatedPrompt && (
                <div className="bg-gray-50 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <Sparkles className="h-5 w-5 text-brand-600" />
                    <h3 className="font-display font-bold text-gray-900">Generated Prompt</h3>
                  </div>
                  <p className="font-mono text-sm text-gray-700 bg-white p-4 rounded border border-gray-200 mb-4">
                    {generatedPrompt}
                  </p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => navigator.clipboard.writeText(generatedPrompt)}
                      className="flex-1 bg-brand-600 text-white py-2 rounded-lg font-medium hover:bg-brand-700 transition-colors"
                    >
                      Copy Prompt
                    </button>
                    <button className="flex-1 border border-gray-300 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                      Try in Runway
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}