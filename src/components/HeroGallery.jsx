import { useState } from 'react'
import { Sparkles, Copy, Check, Image as ImageIcon } from 'lucide-react'

const sampleShots = [
  {
    id: 1,
    title: 'Product Showcase',
    category: 'Commercial',
    tool: 'Runway',
    prompt: 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic',
    tags: ['product', 'commercial', 'studio'],
    color: 'from-blue-500 to-purple-600'
  },
  {
    id: 2,
    title: 'Aerial Drone',
    category: 'Travel',
    tool: 'Pika',
    prompt: 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution',
    tags: ['drone', 'landscape', 'travel'],
    color: 'from-orange-400 to-pink-500'
  },
  {
    id: 3,
    title: 'Interview Setup',
    category: 'Corporate',
    tool: 'Runway',
    prompt: 'Dramatic interview lighting, Rembrandt style, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light',
    tags: ['interview', 'portrait', 'dramatic'],
    color: 'from-emerald-500 to-teal-600'
  },
  {
    id: 4,
    title: 'Motion Background',
    category: 'Graphics',
    tool: 'Runway',
    prompt: 'Abstract flowing particles, seamless loop, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps, corporate presentation aesthetic',
    tags: ['background', 'loop', 'abstract'],
    color: 'from-cyan-400 to-blue-500'
  },
  {
    id: 5,
    title: 'Handheld Doc',
    category: 'Documentary',
    tool: 'Pika',
    prompt: 'Handheld camera movement, subtle natural shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges',
    tags: ['handheld', 'documentary', 'authentic'],
    color: 'from-amber-400 to-orange-500'
  },
  {
    id: 6,
    title: 'Logo Reveal',
    category: 'Branding',
    tool: 'Runway',
    prompt: 'Professional logo reveal, elegant animation, particle effects forming logo, corporate style, clean background, smooth motion, premium brand introduction, 4K quality',
    tags: ['logo', 'reveal', 'corporate'],
    color: 'from-violet-500 to-purple-600'
  }
]

export default function HeroGallery() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')

  const categories = ['All', 'Commercial', 'Travel', 'Corporate', 'Graphics', 'Documentary', 'Branding']

  const filteredShots = activeFilter === 'All' 
    ? sampleShots 
    : sampleShots.filter(shot => shot.category === activeFilter)

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section className="bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SEO-Optimized Headline */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-4">
            AI Video Prompts That <span className="text-brand-400">Actually Work</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-2">
            Professional prompts for Runway, Pika & AI video tools. 
            No more trial and error.
          </p>
          <p className="text-gray-400">
            Trusted by <span className="text-white font-semibold">2,000+ filmmakers</span> creating content for Netflix, BBC, and top brands.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeFilter === cat
                  ? 'bg-brand-600 text-white'
                  : 'bg-white/10 text-gray-300 hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredShots.map((shot) => (
            <div 
              key={shot.id}
              className="group bg-gray-800/50 backdrop-blur rounded-xl overflow-hidden border border-gray-700 hover:border-brand-500/50 transition-all hover:transform hover:scale-[1.02]"
            >
              {/* Visual Placeholder */}
              <div className={`h-48 bg-gradient-to-br ${shot.color} relative flex items-center justify-center`}>
                <ImageIcon className="h-16 w-16 text-white/30" />
                <span className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                  {shot.tool}
                </span>
              </div>

              {/* Content */}
              <div className="p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-brand-400 uppercase tracking-wide">
                    {shot.category}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-white mb-3">
                  {shot.title}
                </h3>
                
                {/* Prompt Preview */}
                <p className="text-sm text-gray-400 line-clamp-3 mb-4 font-mono text-xs">
                  {shot.prompt}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {shot.tags.map(tag => (
                    <span key={tag} className="text-xs text-gray-500">
                      #{tag}
                    </span>
                  ))}
                </div>

                {/* Copy Button */}
                <button
                  onClick={() => copyPrompt(shot.prompt, shot.id)}
                  className="w-full py-2 rounded-lg bg-white/10 hover:bg-white/20 text-white text-sm font-medium flex items-center justify-center gap-2 transition-colors"
                >
                  {copiedId === shot.id ? (
                    <><Check className="h-4 w-4" /> Copied!</>
                  ) : (
                    <><Copy className="h-4 w-4" /> Copy Prompt</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Social Proof */}
        <div className="flex flex-wrap justify-center gap-8 mb-12 text-center">
          <div>
            <div className="text-3xl font-bold text-white">150+</div>
            <div className="text-gray-400 text-sm">Pro Prompts</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">6</div>
            <div className="text-gray-400 text-sm">Categories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">98%</div>
            <div className="text-gray-400 text-sm">Success Rate</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">$49</div>
            <div className="text-gray-400 text-sm">One-Time</div>
          </div>
        </div>

        {/* Email Capture */}
        <div className="max-w-xl mx-auto bg-white/5 backdrop-blur rounded-2xl p-8 border border-white/10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="h-5 w-5 text-brand-400" />
            <span className="text-brand-400 font-medium">Get 25 Free Prompts</span>
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-center text-gray-300 mb-4">
                Plus unlock the full vault of 150+ prompts and Shot-to-Prompt AI tool
              </p>
              <div className="flex gap-3">
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
                  className="px-6 py-3 bg-brand-600 hover:bg-brand-700 rounded-lg font-medium transition-colors whitespace-nowrap"
                >
                  Get Access
                </button>
              </div>
              <p className="text-xs text-center text-gray-500">
                No spam. Unsubscribe anytime. 2,000+ filmmakers already joined.
              </p>
            </form>
          ) : (
            <div className="text-center">
              <div className="text-green-400 font-medium mb-2">✓ Check your email!</div>
              <p className="text-gray-400 text-sm">Your 25 free prompts are on the way.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}