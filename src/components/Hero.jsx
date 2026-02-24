import { useState } from 'react'
import { Sparkles, Zap, Palette } from 'lucide-react'

export default function Hero() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    // TODO: Save to Supabase
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-20 lg:py-32">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-brand-500/20 text-brand-300 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Sparkles className="h-4 w-4" />
              150+ Professional AI Video Prompts
            </div>
            <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Stop Guessing.<br />
              <span className="text-brand-400">Start Creating.</span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-lg">
              Professionally crafted prompts for Runway, Pika, and AI video tools. 
              Get consistent, commercial-quality results every time.
            </p>
            
            {!submitted ? (
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-brand-500"
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-lg font-medium transition-colors"
                >
                  Get Free Prompts
                </button>
              </form>
            ) : (
              <div className="bg-green-500/20 border border-green-500/30 rounded-lg px-6 py-4 max-w-md">
                <p className="text-green-300 font-medium">✓ Check your email! Free prompts sent.</p>
              </div>
            )}
            
            <p className="text-sm text-gray-400 mt-4">
              Join 2,000+ filmmakers getting better AI video results
            </p>
          </div>

          <div className="relative">
            <div className="bg-gray-800 rounded-2xl p-6 border border-gray-700 shadow-2xl">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-4 text-sm text-gray-400">Prompt Preview</span>
              </div>
              <div className="space-y-3">
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm text-green-400">
                  <span className="text-gray-500">// Product Demo Shot</span><br />
                  Cinematic product shot, rotating 360° on black<br />
                  seamless background, studio lighting with soft<br />
                  reflections, shallow depth of field, 8K quality,<br />
                  motion blur on rotation, professional commercial<br />
                  aesthetic --ar 16:9 --style raw
                </div>
                <div className="bg-gray-700/50 rounded-lg p-3 text-sm text-gray-300">
                  <span className="text-brand-400 font-medium">Best for:</span> E-commerce ads, product launches, social content
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}