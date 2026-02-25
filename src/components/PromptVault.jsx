import { useState } from 'react'
import { Search, Copy, Check, Lock, ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

const samplePrompts = [
  {
    id: 1,
    title: 'Cinematic Product Rotation',
    category: 'Product Demo',
    tool: 'Runway',
    prompt: 'Cinematic product shot, rotating 360° on seamless black background, studio lighting with soft reflections, shallow depth of field, 8K quality, motion blur on rotation, professional commercial aesthetic',
    tags: ['product', 'commercial', 'rotation']
  },
  {
    id: 2,
    title: 'Smooth Aerial Drone Shot',
    category: 'B-Roll',
    tool: 'Pika',
    prompt: 'Aerial drone footage, smooth gliding motion over landscape, golden hour lighting, cinematic color grade, slight lens flare, professional travel documentary style, 4K resolution',
    tags: ['drone', 'landscape', 'travel']
  },
  {
    id: 3,
    title: 'Dramatic Lighting Portrait',
    category: 'Interview',
    tool: 'Runway',
    prompt: 'Dramatic interview lighting, Rembrandt style, subject looking slightly off-camera, shallow depth of field, film grain texture, cinematic mood, dark background with rim light',
    tags: ['interview', 'portrait', 'dramatic']
  },
  {
    id: 4,
    title: 'Seamless Loop Background',
    category: 'Motion Graphics',
    tool: 'Runway',
    prompt: 'Abstract flowing particles, seamless loop, soft gradients in teal and coral, gentle organic motion, perfect for text overlay, 4K, smooth 60fps',
    tags: ['background', 'loop', 'abstract']
  },
  {
    id: 5,
    title: 'Handheld Documentary Style',
    category: 'B-Roll',
    tool: 'Pika',
    prompt: 'Handheld camera movement, subtle shake, following subject through environment, natural lighting, documentary style, authentic feel, slight motion blur on edges',
    tags: ['handheld', 'documentary', 'natural']
  },
  {
    id: 6,
    title: 'Luxury Product Showcase',
    category: 'Product Demo',
    tool: 'Runway',
    prompt: 'Luxury product cinematography, slow push-in movement, dramatic rim lighting on black background, shallow depth of field, premium aesthetic, reflections on glossy surface, high-end commercial',
    tags: ['luxury', 'product', 'premium']
  }
]

const CATEGORY_COLORS = {
  'Product Demo': '#3B82F6',
  'B-Roll': '#F59E0B',
  'Interview': '#10B981',
  'Motion Graphics': '#06B6D4',
  'Transition': '#8B5CF6'
}

export default function PromptVault({ preview = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState(null)

  const categories = ['All', 'Product Demo', 'B-Roll', 'Interview', 'Motion Graphics', 'Transition']

  const filteredPrompts = samplePrompts.filter(prompt => {
    const matchesSearch = prompt.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         prompt.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === 'All' || prompt.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const displayedPrompts = preview ? filteredPrompts.slice(0, 3) : filteredPrompts

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <section 
      className="py-16 transition-colors relative overflow-hidden"
      id="prompts"
      style={{ background: 'linear-gradient(180deg, #F5F3FF 0%, var(--bg-secondary) 30%, var(--bg-secondary) 70%, #FDF2F8 100%)' }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-b from-purple-100 to-transparent opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h2 
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Prompt Vault
          </h2>
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {preview 
              ? 'Preview of professional prompts. Get full access with Pro.' 
              : 'Browse our complete collection of tested prompts for AI video creation.'}
          </p>
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4">
          <div 
            className="relative flex-1"
            style={{ color: 'var(--text-muted)' }}
          >
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5" />
            <input
              type="text"
              placeholder="Search prompts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl outline-none transition-all"
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all"
                style={{
                  background: selectedCategory === cat ? 'var(--accent-blue)' : 'var(--bg-card)',
                  color: selectedCategory === cat ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${selectedCategory === cat ? 'var(--accent-blue)' : 'var(--border-color)'}`
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedPrompts.map((prompt) => (
            <div 
              key={prompt.id}
              className="p-5 rounded-2xl transition-all hover:-translate-y-1"
              style={{
                background: 'var(--bg-card)',
                boxShadow: 'var(--shadow-card)',
                border: '1px solid var(--border-color)'
              }}
            >
              <div className="flex items-start justify-between gap-3 mb-3">
                <div>
                  <span 
                    className="text-xs font-bold uppercase tracking-wide"
                    style={{ color: CATEGORY_COLORS[prompt.category] || 'var(--accent-blue)' }}
                  >
                    {prompt.category}
                  </span>
                  <h3 
                    className="font-bold mt-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {prompt.title}
                  </h3>
                </div>
                <span 
                  className="text-xs px-2 py-1 rounded"
                  style={{ 
                    background: 'var(--bg-primary)',
                    color: 'var(--text-muted)'
                  }}
                >
                  {prompt.tool}
                </span>
              </div>

              <p 
                className="text-sm mb-4 font-mono line-clamp-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {prompt.prompt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {prompt.tags.slice(0, 2).map(tag => (
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
                <button
                  onClick={() => copyPrompt(prompt.prompt, prompt.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: copiedId === prompt.id ? 'var(--accent-green)' : 'var(--bg-primary)',
                    color: copiedId === prompt.id ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {copiedId === prompt.id ? (
                    <><Check className="h-3.5 w-3.5" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Preview CTA */}
        {preview && (
          <div className="text-center mt-10">
            <Link
              to="/prompts"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all"
              style={{
                background: 'linear-gradient(145deg, #3B82F6, #2563EB)',
                color: '#fff',
                boxShadow: '6px 6px 12px rgba(37,99,235,0.25), -6px -6px 12px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.2)',
                border: '1px solid rgba(255,255,255,0.1)'
              }}
            >
              View All Prompts
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
