import { useState } from 'react'
import { Sparkles, Copy, Check, Image as ImageIcon, X, Eye, ArrowRight } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { trackCtaEvent } from '../lib/marketingAttribution'

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
  const [copiedId, setCopiedId] = useState(null)
  const [vaultToggle, setVaultToggle] = useState(false)
  const navigate = useNavigate()

  const copyPrompt = (prompt, id) => {
    navigator.clipboard.writeText(prompt)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const handleVaultToggle = () => {
    trackCtaEvent('hero_toggle_prompt_vault', '/')
    setVaultToggle(true)
    setTimeout(() => {
      navigate('/prompts')
    }, 300)
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
          <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Get <span style={{ color: 'var(--accent-blue)' }}>AI</span> videos right in one <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--accent-blue)', textDecorationThickness: '4px', opacity: 0.5 }}>take</span> <span style={{ color: 'var(--accent-blue)' }}>prompt</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Professionally crafted prompts for Runway, Pika, Kling, Luma, and other AI video tools.
            Get consistent, commercial-quality results every time.
          </p>

          {/* Explore Prompt Vault - Sliding Toggle Switch */}
          <div className="mb-8">
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
                      color: vaultToggle ? '#10B981' : '#3B82F6',
                      transform: vaultToggle ? 'rotate(0deg)' : 'rotate(0deg)'
                    }}
                  />
                </span>
              </button>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-1">
            <button
              onClick={() => {
                trackCtaEvent('hero_prompt_enhancer_primary', '/')
                document.getElementById('prompt-enhancer')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{
                background: 'linear-gradient(145deg, #3B82F6, #3B82F6DD)',
                color: '#fff',
                border: '2px solid #3B82F650',
                boxShadow: 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)',
                transform: 'translateY(0) scale(1)'
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translateY(2px) scale(0.96)'
                e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(59,130,246,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(59,130,246,0.3)'
              }}
              onMouseUp={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0) scale(1)'
                e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)'
              }}
            >
              Try Prompt Enhancer
            </button>
            <Link
              to="/camera-moves"
              onClick={() => trackCtaEvent('hero_camera_moves_secondary', '/')}
              className="px-4 py-2 rounded-lg text-sm font-semibold"
              style={{ border: '1px solid var(--border-color)', color: 'var(--text-primary)' }}
            >
              Learn Camera Moves
            </Link>
          </div>

          <div className="text-xs mb-2" style={{ color: 'var(--text-muted)' }}>
            Explore tools:{' '}
            <Link to="/shot-to-prompt" onClick={() => trackCtaEvent('hero_shot_to_prompt_link', '/')} className="underline">Shot to Prompt</Link>
          </div>

        </div>

        {/* Prompt Gallery - PromptVault Style Cards with Copy */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
          {sampleShots.map((shot) => (
            <div 
              key={shot.id}
              className="p-5 rounded-2xl transition-all hover:-translate-y-1 group"
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
                    style={{ color: CATEGORY_COLORS[shot.category] || '#3B82F6' }}
                  >
                    {shot.category}
                  </span>
                  <h3 
                    className="font-bold mt-1"
                    style={{ color: 'var(--text-primary)' }}
                  >
                    {shot.title}
                  </h3>
                </div>
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

              <p 
                className="text-sm mb-4 font-mono line-clamp-3"
                style={{ color: 'var(--text-secondary)' }}
              >
                {shot.prompt}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex gap-1.5">
                  {shot.tags.slice(0, 2).map(tag => (
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
                  onClick={() => copyPrompt(shot.prompt, shot.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-all"
                  style={{
                    background: copiedId === shot.id ? '#10B981' : 'var(--bg-primary)',
                    color: copiedId === shot.id ? '#fff' : 'var(--text-secondary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  {copiedId === shot.id ? (
                    <><Check className="h-3.5 w-3.5" /> Copied</>
                  ) : (
                    <><Copy className="h-3.5 w-3.5" /> Copy</>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
