import { useState } from 'react'
import { Link } from 'react-router-dom'
import { trackCtaEvent } from '../lib/marketingAttribution'

const TOOL_LOGOS = ['Runway', 'Pika', 'Sora', 'Kling', 'Luma', 'Higgsfield', 'Seedance']

export default function HeroGallery() {
  const [cameraCtaPressed, setCameraCtaPressed] = useState(false)

  return (
    <section 
      className="pt-16 pb-4 lg:pt-24 lg:pb-6 transition-colors relative overflow-hidden"
      style={{ 
        background: 'transparent'
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="font-display text-4xl lg:text-6xl font-bold leading-tight mb-6" style={{ color: 'var(--text-primary)' }}>
            Your <span style={{ color: 'var(--accent-blue)' }}>AI</span> footage deserves better than
            {' '}
            <span style={{ color: 'var(--accent-blue)' }}>&ldquo;a cinematic shot of a thing.&rdquo;</span>
          </h1>
          <p className="text-xl max-w-2xl mx-auto mb-8" style={{ color: 'var(--text-secondary)' }}>
            150+ battle-tested prompts for Runway, Pika, Kling, Sora and more. Copy. Paste. Get the shot you actually imagined.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2.5 mb-6">
            {TOOL_LOGOS.map((tool) => (
              <span
                key={tool}
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold"
                style={{
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border-color)',
                  color: 'var(--text-secondary)',
                  boxShadow: 'var(--shadow-soft)',
                }}
              >
                <span
                  className="inline-flex items-center justify-center w-5 h-5 rounded-full text-[10px] font-bold"
                  style={{
                    background: 'linear-gradient(145deg, rgba(79,142,247,0.18), rgba(164,126,245,0.20))',
                    color: 'var(--text-primary)',
                  }}
                >
                  {tool.slice(0, 1)}
                </span>
                {tool}
              </span>
            ))}
          </div>

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

          <div className="mt-3 text-sm" style={{ color: 'var(--text-secondary)' }}>
            Explore workflow:
            {' '}
            <Link to="/prompts" className="underline" style={{ color: 'var(--accent-blue)' }}>Prompt Vault</Link>
            {' '}
            ·
            {' '}
            <Link to="/shot-to-prompt" className="underline" style={{ color: 'var(--accent-blue)' }}>Shot to Prompt</Link>
            {' '}
            ·
            {' '}
            <Link to="/camera-moves" className="underline" style={{ color: 'var(--accent-blue)' }}>Camera Moves</Link>
            {' '}
            ·
            {' '}
            <Link to="/pricing" className="underline" style={{ color: 'var(--accent-blue)' }}>Pricing</Link>
          </div>
        </div>
      </div>
    </section>
  )
}
