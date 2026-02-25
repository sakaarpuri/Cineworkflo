import { useState } from 'react'
import { Sparkles, Copy, Check, Image as ImageIcon, X, Eye } from 'lucide-react'

const sampleShots = [
  {
    id: 1,
    title: 'Product Showcase',
    category: 'Commercial',
    tool: 'Runway',
    prompt: 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic',
    tags: ['product', 'commercial', 'studio'],
  },
  {
    id: 2,
    title: 'Aerial Drone',
    category: 'Travel',
    tool: 'Pika',
    prompt: 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution',
    tags: ['drone', 'landscape', 'travel'],
  },
  {
    id: 3,
    title: 'Interview Setup',
    category: 'Corporate',
    tool: 'Runway',
    prompt: 'Dramatic interview lighting, Rembrandt style, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light',
    tags: ['interview', 'portrait', 'dramatic'],
  },
  {
    id: 4,
    title: 'Motion Background',
    category: 'Graphics',
    tool: 'Runway',
    prompt: 'Abstract flowing particles, seamless loop, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps, corporate presentation aesthetic',
    tags: ['background', 'loop', 'abstract'],
  },
  {
    id: 5,
    title: 'Handheld Doc',
    category: 'Documentary',
    tool: 'Pika',
    prompt: 'Handheld camera movement, subtle natural shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges',
    tags: ['handheld', 'documentary', 'authentic'],
  },
  {
    id: 6,
    title: 'Logo Reveal',
    category: 'Branding',
    tool: 'Runway',
    prompt: 'Professional logo reveal, elegant animation, particle effects forming logo, corporate style, clean background, smooth motion, premium brand introduction, 4K quality',
    tags: ['logo', 'reveal', 'corporate'],
  }
]

const CATEGORY_COLORS = {
  'Commercial': '#3B82F6',
  'Travel': '#F59E0B',
  'Corporate': '#10B981',
  'Graphics': '#06B6D4',
  'Documentary': '#8B5CF6',
  'Branding': '#EC4899'
}

export default function HeroGallery() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShot, setSelectedShot] = useState(null)

  const categories = ['All', 'Commercial', 'Travel', 'Corporate', 'Graphics', 'Documentary', 'Branding']

  const filteredShots = activeFilter === 'All' 
    ? sampleShots 
    : sampleShots.filter(shot => shot.category === activeFilter)

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const openModal = (shot) => setSelectedShot(shot)
  const closeModal = () => setSelectedShot(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    setSubmitted(true)
    setEmail('')
  }

  return (
    <section 
      className="py-16 lg:py-24 transition-colors relative overflow-hidden"
      style={{ 
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, #EEF2FF 50%, var(--bg-secondary) 100%)'
      }}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" />
      <div className="absolute bottom-20 right-10 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse" style={{ animationDelay: '2s' }} />
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Headline */}
        <div className="text-center mb-12">
          <h1 
            className="text-4xl lg:text-6xl font-bold leading-tight mb-4"
            style={{ color: 'var(--text-primary)', fontFamily: 'ui-sans-serif, system-ui, sans-serif' }}
          >
            Get videos right in one{' '}
            <span style={{ position: 'relative', display: 'inline-block' }}>
              <span style={{ 
                textDecoration: 'line-through', 
                textDecorationColor: 'var(--accent-blue)',
                textDecorationThickness: '4px',
                opacity: 0.5
              }}>take</span>
            </span>{' '}
            <span style={{ color: 'var(--accent-blue)' }}>prompt</span>
          </h1>
          <p 
            className="text-xl max-w-2xl mx-auto mb-2"
            style={{ color: 'var(--text-secondary)' }}
          >
            Professional prompts for Runway, Pika & AI video tools. 
            No more trial and error.
          </p>
          <p style={{ color: 'var(--text-muted)' }}>
            Trusted by <span style={{ color: 'var(--text-primary)' }} className="font-semibold">2,000+ filmmakers</span>
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveFilter(cat)}
              className="px-4 py-2 rounded-full text-sm font-semibold transition-all"
              style={{
                background: activeFilter === cat ? 'linear-gradient(145deg, #3B82F6, #2563EB)' : 'var(--bg-card)',
                color: activeFilter === cat ? '#fff' : 'var(--text-secondary)',
                border: `1px solid ${activeFilter === cat ? 'rgba(255,255,255,0.2)' : 'var(--border-color)'}`,
                boxShadow: activeFilter === cat 
                  ? 'inset 3px 3px 6px rgba(0,0,0,0.2), inset -3px -3px 6px rgba(255,255,255,0.1)' 
                  : '4px 4px 8px rgba(0,0,0,0.08), -4px -4px 8px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                transform: activeFilter === cat ? 'translateY(1px)' : 'translateY(0)'
              }}
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
              onClick={() => openModal(shot)}
              className="group p-5 rounded-2xl cursor-pointer transition-all hover:-translate-y-1"
              style={{
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              {/* Header with category color */}
              <div className="flex items-center justify-between mb-3">
                <span 
                  className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded"
                  style={{ 
                    background: `${CATEGORY_COLORS[shot.category]}15`,
                    color: CATEGORY_COLORS[shot.category]
                  }}
                >
                  {shot.category}
                </span>
                <span 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: 'var(--bg-primary)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {shot.tool}
                </span>
              </div>

              <h3 
                className="text-lg font-bold mb-2"
                style={{ color: 'var(--text-primary)' }}
              >
                {shot.title}
              </h3>
              
              {/* Prompt Preview */}
              <p 
                className="text-sm line-clamp-3 mb-4 font-mono"
                style={{ color: 'var(--text-secondary)' }}
              >
                {shot.prompt}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {shot.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Copy Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  copyPrompt(shot.prompt, shot.id)
                }}
                className="w-full py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 transition-all"
                style={{
                  background: 'var(--bg-primary)',
                  color: 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: '2px 2px 4px rgba(0,0,0,0.05), -2px -2px 4px rgba(255,255,255,0.5)'
                }}
              >
                {copiedId === shot.id ? (
                  <><Check className="h-4 w-4" style={{ color: 'var(--accent-green)' }} /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4" /> Copy Prompt</>
                )}
              </button>
            </div>
          ))}
        </div>

        {/* Modal */}
        {selectedShot && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}
          >
            <div 
              className="rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6"
              style={{
                background: 'var(--bg-secondary)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)'
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-4">
                <span 
                  className="text-xs font-bold uppercase tracking-wide px-2 py-1 rounded"
                  style={{ 
                    background: `${CATEGORY_COLORS[selectedShot.category]}15`,
                    color: CATEGORY_COLORS[selectedShot.category]
                  }}
                >
                  {selectedShot.category}
                </span>
                <button
                  onClick={closeModal}
                  className="p-2 rounded-lg transition-colors"
                  style={{ 
                    background: 'var(--bg-primary)',
                    color: 'var(--text-secondary)'
                  }}
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <h2 
                className="text-2xl font-bold mb-4"
                style={{ color: 'var(--text-primary)' }}
              >
                {selectedShot.title}
              </h2>

              {/* Full Prompt */}
              <div 
                className="rounded-xl p-4 mb-4 font-mono text-sm leading-relaxed"
                style={{
                  background: 'var(--bg-primary)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-primary)'
                }}
              >
                {selectedShot.prompt}
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                {selectedShot.tags.map(tag => (
                  <span 
                    key={tag} 
                    className="text-xs px-2 py-1 rounded"
                    style={{ 
                      background: 'var(--bg-primary)',
                      color: 'var(--text-muted)'
                    }}
                  >
                    #{tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <button
                onClick={() => copyPrompt(selectedShot.prompt, selectedShot.id)}
                className="w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2"
                style={{
                  background: 'var(--accent-blue)',
                  color: '#fff'
                }}
              >
                {copiedId === selectedShot.id ? (
                  <><Check className="h-4 w-4" /> Copied!</>
                ) : (
                  <><Copy className="h-4 w-4" /> Copy Prompt</>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Stats */}
        <div 
          className="flex flex-wrap justify-center gap-8 mb-12 p-8 rounded-2xl"
          style={{
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          {[
            { val: '150+', label: 'Pro Prompts' },
            { val: '6', label: 'Categories' },
            { val: '98%', label: 'Success Rate' },
            { val: '$49', label: 'One-Time' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div 
                className="text-3xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                {stat.val}
              </div>
              <div style={{ color: 'var(--text-muted)' }} className="text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Email Capture */}
        <div 
          className="max-w-xl mx-auto rounded-2xl p-8"
          style={{
            background: 'var(--bg-card)',
            boxShadow: 'var(--shadow-card)',
            border: '1px solid var(--border-color)'
          }}
        >
          <div 
            className="flex items-center justify-center gap-2 mb-4 text-sm font-bold"
            style={{ color: 'var(--accent-blue)' }}
          >
            <Sparkles className="h-4 w-4" />
            Get 25 Free Prompts
          </div>
          
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p 
                className="text-center mb-4"
                style={{ color: 'var(--text-secondary)' }}
              >
                Plus unlock the full vault of 150+ prompts
              </p>
              <div className="flex gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="flex-1 px-4 py-3 rounded-xl outline-none transition-all"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--border-color)',
                    color: 'var(--text-primary)'
                  }}
                  required
                />
                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl font-semibold transition-all whitespace-nowrap"
                  style={{
                    background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                    color: '#fff',
                    boxShadow: '6px 6px 12px rgba(37,99,235,0.3), -6px -6px 12px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)',
                    border: '1px solid rgba(255,255,255,0.1)'
                  }}
                >
                  Get Access
                </button>
              </div>
              <p 
                className="text-xs text-center"
                style={{ color: 'var(--text-muted)' }}
              >
                No spam. Unsubscribe anytime.
              </p>
            </form>
          ) : (
            <div className="text-center">
              <div 
                className="font-medium mb-2"
                style={{ color: 'var(--accent-green)' }}
              >
                ✓ Check your email!
              </div>
              <p style={{ color: 'var(--text-muted)' }} className="text-sm">
                Your 25 free prompts are on the way.
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
