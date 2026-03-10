import { useEffect, useMemo, useState } from 'react'
import { Search, Copy, Check, ArrowRight, X } from 'lucide-react'
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

  const visiblePromptLibrary = useMemo(() => PROMPT_LIBRARY, [])

  const categories = useMemo(() => {
    const orderedFromPages = PROMPT_CATEGORY_PAGES.map((categoryPage) => categoryPage.name)
    const fromLibrary = [...new Set(visiblePromptLibrary.map((prompt) => prompt.category))]
    const ordered = [...orderedFromPages]
    fromLibrary.forEach((category) => {
      if (!ordered.includes(category)) ordered.push(category)
    })
    return ['All', ...ordered]
  }, [visiblePromptLibrary])

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

  const filteredPrompts = visiblePromptLibrary.filter(prompt => {
    const query = searchQuery.trim().toLowerCase()
    const matchesSearch = !query ||
      String(prompt.id) === query ||
      String(prompt.source_id ?? '').toLowerCase() === query ||
      prompt.title.toLowerCase().includes(query) ||
      prompt.tags.some(tag => tag.toLowerCase().includes(query)) ||
      prompt.prompt.toLowerCase().includes(query) ||
      prompt.image_prompt.toLowerCase().includes(query) ||
      prompt.sfx_prompt.toLowerCase().includes(query)
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
      <div
        className="absolute top-0 left-0 right-0 h-32 pointer-events-none"
        style={{ background: 'var(--section-top-fade)' }}
      />
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
          {preview ? (
            <div className="flex items-center justify-center gap-5 mb-4">
              <h2
                className="text-3xl lg:text-4xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Prompt Vault
              </h2>
              <button
                onClick={handleVaultToggle}
                className="relative w-20 h-10 rounded-full transition-all duration-300"
                style={{
                  background: vaultToggle
                    ? 'linear-gradient(145deg, #10B981, #059669)'
                    : 'linear-gradient(145deg, #6366F1, #4F46E5)',
                  boxShadow: vaultToggle
                    ? 'inset 3px 3px 6px rgba(16,185,129,0.5), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(16,185,129,0.4)'
                    : 'var(--control-soft-shadow)',
                  border: `2px solid ${vaultToggle ? '#10B98150' : '#6366F150'}`
                }}
                aria-label="Explore Prompt Vault"
              >
                <span
                  className="absolute top-1 left-1 w-7 h-7 rounded-full transition-all duration-300 flex items-center justify-center"
                  style={{
                    background: 'var(--toggle-knob-bg)',
                    transform: vaultToggle ? 'translateX(38px)' : 'translateX(0)',
                    boxShadow: 'var(--toggle-knob-shadow)'
                  }}
                >
                  <ArrowRight
                    className="h-4 w-4 transition-all duration-300"
                    style={{
                      color: vaultToggle ? '#10B981' : '#6366F1'
                    }}
                  />
                </span>
              </button>
            </div>
          ) : (
            <h2
              className="text-3xl lg:text-4xl font-bold mb-4"
              style={{ color: 'var(--text-primary)' }}
            >
              Prompt Vault
            </h2>
          )}
          <p 
            className="text-xl max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            {preview
              ? 'Explore a sample from the Prompt Vault and open the full library on the dedicated page.'
              : 'Browse by mood, genre, or use case. Every prompt is road-tested across Runway, Pika and more.'}
          </p>
          <p className="mt-3 text-sm max-w-2xl mx-auto" style={{ color: 'var(--text-muted)' }}>
            Designed for image-to-video. Lock the look with an image, then drive the shot with the video prompt.
          </p>
          {!preview && (
            <div className="mt-4">
              <Link
                to="/prompts"
                className="inline-flex items-center justify-center px-4 py-2 rounded-xl font-semibold text-sm transition-all"
                style={{
                  background: 'linear-gradient(145deg, rgba(79,142,247,0.18), rgba(164,126,245,0.18))',
                  border: '1px solid rgba(255,255,255,0.16)',
                  color: 'var(--text-primary)'
                }}
              >
                Try Prompt Vault v2
              </Link>
            </div>
          )}
        </div>

        {/* Search & Filter */}
        <div className="mb-8 flex flex-col gap-4">
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
                      : 'var(--control-soft-shadow)',
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
              className="neu-card rounded-[28px] overflow-hidden transition-all hover:-translate-y-1 cursor-pointer group"
            >
              <div
                className="aspect-[16/9] p-5"
                style={{
                  background: prompt.thumbnail_url
                    ? '#d9d9d9'
                    : `linear-gradient(135deg, ${CATEGORY_COLORS[prompt.category] || 'var(--accent-blue)'}BB, rgba(15,23,42,0.12))`
                }}
              >
                {prompt.thumbnail_url ? (
                  <img
                    src={prompt.thumbnail_url}
                    alt={prompt.title}
                    className="w-full h-full object-cover rounded-[20px]"
                    loading="lazy"
                  />
                ) : (
                  <div
                    className="w-full h-full rounded-[20px] flex items-end p-4"
                    style={{
                      background: 'rgba(255,255,255,0.78)',
                      border: '1px solid rgba(255,255,255,0.45)'
                    }}
                  >
                    <span
                      className="text-xs font-bold uppercase tracking-[0.14em]"
                      style={{ color: CATEGORY_COLORS[prompt.category] || 'var(--accent-blue)' }}
                    >
                      Thumbnail pending
                    </span>
                  </div>
                )}
              </div>

              <div className="p-6">
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div>
                    <span 
                      className="text-[11px] font-bold uppercase tracking-[0.14em]"
                      style={{ color: CATEGORY_COLORS[prompt.category] || 'var(--accent-blue)' }}
                    >
                      {prompt.category}
                    </span>
                    <h3 
                      className="font-mono text-[1.05rem] leading-8 mt-2"
                      style={{ color: 'var(--text-primary)' }}
                    >
                      {prompt.title}
                    </h3>
                  </div>
                  <span 
                    className="text-xs px-2.5 py-1 rounded-full shrink-0"
                    style={{ 
                      background: 'var(--bg-primary)',
                      color: 'var(--text-muted)',
                      border: '1px solid var(--border-color)'
                    }}
                  >
                    {prompt.tool}
                  </span>
                </div>

                <p 
                  className="text-sm mb-6 font-mono line-clamp-4 min-h-[6rem]"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {prompt.prompt}
                </p>

                <div className="flex items-center justify-between gap-3">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      copyPrompt(prompt.prompt, prompt.id)
                    }}
                    className={`flex items-center gap-2 px-5 py-3 rounded-full text-sm font-semibold transition-all ${copiedId === prompt.id ? 'cwf-rec-flash' : ''}`}
                    style={{
                      background: copiedId === prompt.id ? 'var(--accent-green)' : 'var(--bg-primary)',
                      color: copiedId === prompt.id ? '#fff' : 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--control-soft-shadow)'
                    }}
                  >
                    {copiedId === prompt.id ? (
                      <><Check className="h-4 w-4" /> Copied</>
                    ) : (
                      <><Copy className="h-4 w-4" /> Copy prompt</>
                    )}
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      openModal(prompt)
                    }}
                    className="h-12 w-12 rounded-full flex items-center justify-center transition-all"
                    style={{
                      background: 'var(--bg-primary)',
                      color: 'var(--text-secondary)',
                      border: '1px solid var(--border-color)',
                      boxShadow: 'var(--control-soft-shadow)'
                    }}
                    aria-label={`View ${prompt.title}`}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Preview CTA removed (toggle lives in section heading) */}

        {!preview && (
          <section
            className="neu-card mt-10 rounded-2xl p-6"
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
	          style={{ background: 'rgba(15,23,42,0.55)', backdropFilter: 'blur(2px)' }}
	          onClick={closeModal}
	        >
	          <div 
	            className="max-w-2xl w-full rounded-2xl p-6 relative"
	            style={{
	              background: 'var(--bg-card)',
	              border: '1px solid rgba(15,23,42,0.10)',
	              boxShadow: '0 22px 70px rgba(15,23,42,0.28), 0 2px 10px rgba(15,23,42,0.10)'
	            }}
	            onClick={(e) => e.stopPropagation()}
	          >
            <button 
              onClick={closeModal}
              className="absolute top-4 right-4 p-2 rounded-full transition-colors"
              style={{
                background: 'var(--bg-primary)',
                color: 'var(--text-muted)',
                border: '1px solid var(--border-color)'
              }}
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
	              <div className="mt-2">
	                <Link
	                  to="/prompts"
	                  onClick={() => trackCtaEvent('prompt_modal_to_vault_v2', '/')}
	                  className="inline-flex items-center gap-1.5 text-sm font-semibold hover:underline"
	                  style={{ color: 'var(--accent-purple)' }}
	                >
	                  See pro prompts in the Vault <ArrowRight className="h-4 w-4" />
	                </Link>
	              </div>
	            </div>

            {selectedPrompt.thumbnail_url && (
              <div className="mb-4 p-2 rounded-2xl" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
                <img
                  src={selectedPrompt.thumbnail_url}
                  alt={selectedPrompt.title}
                  className="w-full aspect-[16/9] object-cover rounded-xl"
                />
              </div>
            )}

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
