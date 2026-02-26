import { useState } from 'react'
import { Sparkles, Copy, Check, Image as ImageIcon, X, Eye } from 'lucide-react'

// New prompts from JSON database
const sampleShots = [
  {
    id: 1,
    title: 'Minimalist Product',
    category: 'Brand & Product Ads',
    tool: 'Runway',
    prompt: 'A single white sneaker floating in a pure white void, soft directional shadow beneath it, slow 360-degree rotation, ultra-sharp texture detail on stitching and sole, clean Apple-ad aesthetic, 16:9',
    tags: ['product', 'minimalist', 'commercial'],
  },
  {
    id: 2,
    title: 'Luxury Product',
    category: 'Brand & Product Ads',
    tool: 'Kling',
    prompt: 'A luxury skincare serum bottle on a white marble surface, single overhead light casting a precise shadow, slow camera orbit around the product, hyper-realistic glass and liquid refraction, minimal and premium feel, 16:9',
    tags: ['product', 'luxury', 'premium'],
  },
  {
    id: 3,
    title: 'Sports Car Drive',
    category: 'Brand & Product Ads',
    tool: 'Luma',
    prompt: 'A sports car driving on a winding coastal road at golden hour, low angle tracking shot keeping pace with the vehicle, dust kicking up behind tires, warm dramatic lighting, cinematic color grade, 16:9',
    tags: ['vehicle', 'automotive', 'cinematic'],
  },
  {
    id: 4,
    title: 'Drink Pour',
    category: 'Brand & Product Ads',
    tool: 'Kling',
    prompt: 'A glass of whiskey being poured in slow motion, ice cubes cracking, golden liquid splashing in beautiful detail, dark wooden bar surface, warm amber lighting, cinematic macro photography style, 16:9',
    tags: ['product', 'drink', 'macro'],
  },
  {
    id: 5,
    title: 'Surreal Product',
    category: 'Brand & Product Ads',
    tool: 'Sora',
    prompt: 'A perfume bottle floating in the middle of a galaxy with stars and nebula, stars and cosmic dust swirling slowly around it, the product glowing softly from within, surreal dreamlike scale contrast, cinematic and otherworldly, 16:9',
    tags: ['product', 'surreal', 'cosmic'],
  },
  {
    id: 6,
    title: 'Golden Hour Portrait',
    category: 'Social & Short-Form Content',
    tool: 'Runway',
    prompt: 'A slow-motion close-up of a person laughing on a sun-drenched rooftop at golden hour, golden hour light wrapping around their face, shallow depth of field, warm cinematic color grade, handheld camera feel, Instagram Reels format 9:16',
    tags: ['social', 'portrait', 'golden-hour'],
  }
]

const CATEGORY_COLORS = {
  'Brand & Product Ads': '#3B82F6',
  'Social & Short-Form Content': '#F59E0B',
  'Cinematic & Storytelling': '#10B981',
  'World & Environment Building': '#06B6D4',
  'Abstract & Motion Art': '#8B5CF6',
  'AI Avatar & Character': '#EC4899'
}

export default function HeroGallery() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const [copiedId, setCopiedId] = useState(null)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedShot, setSelectedShot] = useState(null)

  const categories = ['All', 'Brand & Product Ads', 'Social & Short-Form Content', 'Cinematic & Storytelling', 'World & Environment Building', 'Abstract & Motion Art', 'AI Avatar & Character']

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
        background: 'linear-gradient(135deg, var(--bg-secondary) 0%, var(--bg-primary) 50%, var(--bg-secondary) 100%)'
      }}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'var(--accent-purple)15', border: '1px solid var(--accent-purple)30', color: 'var(--accent-purple)' }}
          >
            <Sparkles className="h-4 w-4" />
            50+ Professional AI Video Prompts
          </div>
          <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Get videos right in one <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--accent-blue)', textDecorationThickness: '4px', opacity: 0.5 }}>take</span> <span style={{ color: 'var(--accent-blue)' }}>prompt</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Professionally crafted prompts for Runway, Pika, Kling, Luma, and other AI video tools. 
            Get consistent, commercial-quality results every time.
          </p>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-2 mb-8">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: activeFilter === category ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: activeFilter === category ? '#fff' : 'var(--text-secondary)',
                  border: '1px solid var(--border-color)',
                  boxShadow: activeFilter === category ? 'var(--shadow-soft)' : 'none'
                }}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        {/* Prompt Gallery */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredShots.map((shot) => (
            <div 
              key={shot.id}
              className="group rounded-2xl overflow-hidden transition-all hover:-translate-y-1 cursor-pointer"
              style={{ 
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)'
              }}
              onClick={() => openModal(shot)}
            >
              {/* Image Placeholder */}
              <div className="h-48 relative overflow-hidden" style={{ background: `linear-gradient(135deg, ${CATEGORY_COLORS[shot.category]}20, ${CATEGORY_COLORS[shot.category]}05)` }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <ImageIcon className="h-12 w-12 opacity-20" style={{ color: CATEGORY_COLORS[shot.category] }} />
                </div>
                <div className="absolute top-3 left-3">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: CATEGORY_COLORS[shot.category] + '20', color: CATEGORY_COLORS[shot.category] }}
                  >
                    {shot.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <span 
                    className="px-2 py-1 rounded-full text-xs font-semibold"
                    style={{ background: 'var(--bg-primary)', color: 'var(--text-secondary)' }}
                  >
                    {shot.tool}
                  </span>
                </div>
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <Eye className="h-8 w-8 text-white" />
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--text-primary)' }}>{shot.title}</h3>
                <p className="text-sm line-clamp-2 mb-3" style={{ color: 'var(--text-secondary)' }}>
                  {shot.prompt}
                </p>
                <div className="flex flex-wrap gap-1">
                  {shot.tags.map((tag) => (
                    <span 
                      key={tag}
                      className="px-2 py-1 rounded text-xs"
                      style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Prompt Modal */}
        {selectedShot && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}
            onClick={closeModal}
          >
            <div 
              className="max-w-2xl w-full rounded-2xl p-6 relative"
              style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 rounded-full transition-colors"
                style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
              >
                <X className="h-5 w-5" />
              </button>

              <div className="mb-4">
                <span 
                  className="inline-block px-3 py-1 rounded-full text-sm font-semibold mb-2"
                  style={{ background: CATEGORY_COLORS[selectedShot.category] + '20', color: CATEGORY_COLORS[selectedShot.category] }}
                >
                  {selectedShot.category}
                </span>
                <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{selectedShot.title}</h2>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Best for: {selectedShot.tool}</p>
              </div>

              <div 
                className="p-4 rounded-xl mb-4 font-mono text-sm leading-relaxed"
                style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
              >
                {selectedShot.prompt}
              </div>

              <button
                onClick={() => copyPrompt(selectedShot.prompt, selectedShot.id)}
                className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                style={{ 
                  background: copiedId === selectedShot.id ? '#10B981' : 'var(--accent-blue)',
                  color: '#fff'
                }}
              >
                {copiedId === selectedShot.id ? (
                  <><Check className="h-5 w-5" /> Copied!</>
                ) : (
                  <><Copy className="h-5 w-5" /> Copy Prompt</>
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
