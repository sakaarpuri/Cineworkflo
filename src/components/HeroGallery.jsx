import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trackCtaEvent } from '../lib/marketingAttribution'

export default function HeroGallery() {
  const [cameraCtaPressed, setCameraCtaPressed] = useState(false)

  return (
    <section 
      className="pt-16 pb-4 lg:pt-24 lg:pb-6 transition-colors relative overflow-hidden"
      style={{ 
        background: 'transparent'
      }}
    >
      {/* Decorative gradient orbs */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Get <span style={{ color: 'var(--accent-blue)' }}>AI</span> videos right in one <span style={{ textDecoration: 'line-through', textDecorationColor: 'var(--accent-blue)', textDecorationThickness: '4px', opacity: 0.5 }}>take</span> <span style={{ color: 'var(--accent-blue)' }}>prompt</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            Professionally crafted prompts for Runway, Pika, Kling, Luma, Sora, Meta, and other AI video tools.
            Get consistent, commercial-quality results every time.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3 mb-1">
            <Link
              to="/camera-moves"
              onClick={() => trackCtaEvent('hero_camera_moves_primary', '/')}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(145deg, #3B82F6, #3B82F6DD)',
                color: '#fff',
                border: '2px solid #3B82F650',
                boxShadow: cameraCtaPressed
                  ? 'inset 4px 4px 8px rgba(59,130,246,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(59,130,246,0.3)'
                  : 'inset 3px 3px 6px rgba(59,130,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(59,130,246,0.4)',
                transform: cameraCtaPressed ? 'translateY(2px) scale(0.96)' : 'translateY(0) scale(1)'
              }}
              onMouseDown={() => setCameraCtaPressed(true)}
              onMouseUp={() => setCameraCtaPressed(false)}
              onMouseLeave={() => setCameraCtaPressed(false)}
            >
              Learn Camera Moves
            </Link>
            <Link
              to="/shot-to-prompt"
              onClick={() => trackCtaEvent('hero_shot_to_prompt_secondary', '/')}
              className="px-4 py-2 rounded-lg text-sm font-semibold transition-all duration-200"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.88), rgba(255,255,255,0.64))',
                color: 'var(--text-secondary)',
                border: '1.5px solid var(--border-color)',
                boxShadow: 'inset 2px 2px 5px rgba(255,255,255,0.65), inset -2px -2px 5px rgba(255,255,255,0.38), 0 3px 10px rgba(15,23,42,0.08)'
              }}
            >
              Shot to Prompt
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
