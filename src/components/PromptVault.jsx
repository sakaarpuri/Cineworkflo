import { useEffect, useState } from 'react'
import { Search, Copy, Check, ArrowRight, Eye, X } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { CATEGORY_COLORS, PROMPT_CATEGORY_PAGES, PROMPT_LIBRARY } from '../data/promptCategories'
import { trackCtaEvent } from '../lib/marketingAttribution'

export default function PromptVault({ preview = false }) {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [copiedId, setCopiedId] = useState(null)
  const [selectedPrompt, setSelectedPrompt] = useState(null)
  const [ctaVariant, setCtaVariant] = useState('a')
  const [vaultToggle, setVaultToggle] = useState(false)
  const navigate = useNavigate()

  const categories = ['All', 'Product Demo', 'B-Roll', 'Interview', 'Motion Graphics', 'Transition']

  useEffect(() => {
    if (preview) return
    const params = new URLSearchParams(window.location.search)
    const forcedVariant = params.get('cta_variant')
    if (forcedVariant === 'a' || forcedVariant === 'b') {
      localStorage.setItem('cwf_prompt_cta_variant', forcedVariant)
      setCtaVariant(forcedVariant)
      return
    }
    const stored = localStorage.getItem('cwf_prompt_cta_variant')
    if (stored === 'a' || stored === 'b') {
      setCtaVariant(stored)
      return
    }
    const random = Math.random() < 0.5 ? 'a' : 'b'
    localStorage.setItem('cwf_prompt_cta_variant', random)
    setCtaVariant(random)
  }, [preview])

  const filteredPrompts = PROMPT_LIBRARY.filter(prompt => {
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

  const openModal = (prompt) => setSelectedPrompt(prompt)
  const closeModal = () => setSelectedPrompt(null)
  const handleVaultToggle = () => {
    trackCtaEvent('prompt_vault_toggle_preview', '/')
    setVaultToggle(true)
    setTimeout(() => {
      navigate('/prompts')
    }, 300)
  }

  return (
    <section 
      className="py-16 transition-colors relative overflow-hidden"
      id="prompts"
      style={{ background: 'transparent' }}
    >
      {/* Decorative gradient */}
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-full h-32 bg-gradient-to-b from-purple-100 to-transparent opacity-30" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {!preview && (
          <nav
            aria-label="Breadcrumb"
            className="mb-5 text-sm flex items-center gap-2"
            style={{ color: 'var(--text-muted)' }}
          >
            <Link to="/" className="hover:underline">Home</Link>
            <span>/</span>
            <span style={{ color: 'var(--text-secondary)' }}>Prompt Vault</span>
          </nav>
        )}

        <div className="text-center mb-10">
          <h2 
            className="text-3xl lg:text-4xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Explore Prompt Vault
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
          {/* Category Filters - Colorful Neumorphic Toggles */}
          <div className="flex gap-3 flex-wrap">
            {categories.map(cat => {
              const catColor = cat === 'All' ? '#6366F1' : CATEGORY_COLORS[cat]
              const isActive = selectedCategory === cat
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={{
                    background: isActive 
                      ? `linear-gradient(145deg, ${catColor}, ${catColor}DD)` 
                      : 'var(--bg-card)',
                    color: isActive ? '#fff' : 'var(--text-secondary)',
                    border: `2px solid ${isActive ? catColor + '50' : 'var(--border-color)'}`,
                    boxShadow: isActive 
                      ? `inset 3px 3px 6px ${catColor}60, inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px ${catColor}40`
                      : '8px 8px 16px rgba(0,0,0,0.08), -8px -8px 16px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                    transform: isActive ? 'translateY(1px) scale(0.98)' : 'translateY(0) scale(1)'
                  }}
                >
                  {cat}
                </button>
              )
            })}
          </div>
        </div>

        {/* Prompts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {displayedPrompts.map((prompt) => (
            <div 
              key={prompt.id}
              onClick={() => openModal(prompt)}
              className="p-5 rounded-2xl transition-all hover:-translate-y-1 cursor-pointer group"
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
                <div className="flex items-center gap-2">
                  <span 
                    className="flex items-center gap-1 text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    <Eye className="h-3.5 w-3.5" /> View
                  </span>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyPrompt(prompt.prompt, prompt.id)
                    }}
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
            </div>
          ))}
        </div>

        {/* Preview CTA */}
        {preview && (
          <div className="text-center mt-10">
            <div className="flex items-center justify-center gap-5">
              <span className="text-2xl font-bold" style={{ color: 'var(--text-primary)' }}>
                Explore Prompt Vault
              </span>
              <button
                onClick={handleVaultToggle}
                className="relative w-20 h-10 rounded-full transition-all duration-300"
                style={{
                  background: vaultToggle
                    ? 'linear-gradient(145deg, #10B981, #059669)'
                    : 'linear-gradient(145deg, #3B82F6, #2563EB)',
                  boxShadow: vaultToggle
                    ? 'inset 3px 3px 6px rgba(16,185,129,0.5), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(16,185,129,0.4)'
                    : 'inset 3px 3px 6px rgba(59,130,246,0.5), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)',
                  border: `2px solid ${vaultToggle ? '#10B98150' : '#3B82F650'}`
                }}
                aria-label="Toggle Prompt Vault"
              >
                <span
                  className="absolute top-1 left-1 w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center"
                  style={{
                    background: '#fff',
                    transform: vaultToggle ? 'translateX(38px)' : 'translateX(0)',
                    boxShadow: '2px 2px 6px rgba(0,0,0,0.2), inset 1px 1px 2px rgba(255,255,255,0.8)'
                  }}
                >
                  <ArrowRight
                    className="h-4 w-4 transition-all duration-300"
                    style={{
                      color: vaultToggle ? '#10B981' : '#3B82F6'
                    }}
                  />
                </span>
              </button>
            </div>
          </div>
        )}

        {!preview && (
          <section
            className="mt-10 rounded-2xl p-6"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border-color)'
            }}
          >
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
              Build complete shots faster
            </h2>
            <p className="mb-4" style={{ color: 'var(--text-secondary)' }}>
              Combine curated prompts with frame analysis and camera movement language for better AI video consistency.
            </p>
            <div className="flex flex-wrap gap-3 mb-6">
              <Link
                to="/shot-to-prompt"
                onClick={() => trackCtaEvent('prompt_vault_shot_to_prompt_cta', '/prompts')}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ background: 'var(--accent-purple)', color: '#fff' }}
              >
                {ctaVariant === 'a' ? 'Open Shot to Prompt' : 'Generate from Reference'}
              </Link>
              <Link
                to="/camera-moves"
                onClick={() => trackCtaEvent('prompt_vault_camera_moves_cta', '/prompts')}
                className="px-4 py-2 rounded-lg text-sm font-semibold"
                style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
              >
                Learn Camera Moves
              </Link>
            </div>

            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Browse prompt categories
            </h3>
            <div className="flex flex-wrap gap-2 mb-6">
              {PROMPT_CATEGORY_PAGES.map((categoryPage) => (
                <Link
                  key={categoryPage.slug}
                  to={`/prompts/${categoryPage.slug}`}
                  onClick={() => trackCtaEvent(`prompt_category_${categoryPage.slug}_cta`, '/prompts')}
                  className="px-3 py-2 rounded-lg text-sm font-semibold"
                  style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
                >
                  {categoryPage.name}
                </Link>
              ))}
            </div>

            <h3 className="text-xl font-semibold mb-3" style={{ color: 'var(--text-primary)' }}>
              Prompt Vault FAQ
            </h3>
            <div className="space-y-4 text-sm">
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Are these prompts specific to one tool?
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  They are optimized for AI video tools like Runway and Pika, but also work as a strong base for most text-to-video workflows.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  Should I copy prompts exactly as-is?
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Start with the base prompt, then customize subject, style, lens, and motion terms to fit your scene.
                </p>
              </div>
              <div>
                <p className="font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>
                  How do I get more consistent outputs?
                </p>
                <p style={{ color: 'var(--text-secondary)' }}>
                  Pair prompts with strong references in Shot to Prompt and use precise camera move language from the Camera Moves guide.
                </p>
              </div>
            </div>
          </section>
        )}
      </div>

      {/* Prompt Modal */}
      {selectedPrompt && (
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
                style={{ background: CATEGORY_COLORS[selectedPrompt.category] + '20', color: CATEGORY_COLORS[selectedPrompt.category] }}
              >
                {selectedPrompt.category}
              </span>
              <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>{selectedPrompt.title}</h2>
              <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>Best for: {selectedPrompt.tool}</p>
            </div>

            <div 
              className="p-4 rounded-xl mb-4 font-mono text-sm leading-relaxed"
              style={{ background: 'var(--bg-primary)', color: 'var(--text-primary)', border: '1px solid var(--border-color)' }}
            >
              {selectedPrompt.prompt}
            </div>

            <div className="flex flex-wrap gap-2 mb-4">
              {selectedPrompt.tags.map(tag => (
                <span 
                  key={tag}
                  className="text-xs px-2 py-1 rounded"
                  style={{ background: 'var(--bg-primary)', color: 'var(--text-muted)' }}
                >
                  #{tag}
                </span>
              ))}
            </div>

            <button
              onClick={() => copyPrompt(selectedPrompt.prompt, selectedPrompt.id)}
              className="w-full py-3 rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
              style={{ 
                background: copiedId === selectedPrompt.id ? '#10B981' : 'var(--accent-blue)',
                color: '#fff'
              }}
            >
              {copiedId === selectedPrompt.id ? (
                <><Check className="h-5 w-5" /> Copied!</>
              ) : (
                <><Copy className="h-5 w-5" /> Copy Prompt</>
              )}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
