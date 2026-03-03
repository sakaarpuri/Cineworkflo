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
      {/* subtle film grain */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.06] mix-blend-overlay"
        style={{
          backgroundImage:
            'repeating-radial-gradient(circle at 20% 30%, rgba(255,255,255,0.18) 0 1px, rgba(255,255,255,0) 1px 3px)',
          backgroundSize: '220px 220px',
        }}
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 items-center">
          {/* Left */}
          <div className="text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold tracking-wider mb-4"
              style={{
                background: 'var(--accent-purple)15',
                border: '1px solid var(--accent-purple)40',
                color: 'var(--accent-purple)',
              }}
            >
              AI FILMMAKER TOOLKIT
            </div>
            <h1
              className="font-display text-5xl lg:text-7xl font-bold leading-[1.06] mb-6"
              style={{ color: 'var(--text-primary)' }}
            >
              Your AI video is only as rich as your prompt.
            </h1>
            <p className="text-xl max-w-2xl mx-auto lg:mx-0 mb-8" style={{ color: 'var(--text-secondary)' }}>
              100s of battle-tested prompts for Runway, Pika, Kling, Sora and more. Copy. Paste. Get the shot you actually imagined.
            </p>

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-2.5 mb-6">
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

            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 mb-2">
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

            <div className="mt-2 text-sm" style={{ color: 'var(--text-secondary)' }}>
              Explore workflow:{' '}
              <Link to="/prompts" className="underline" style={{ color: 'var(--accent-blue)' }}>Prompt Vault</Link>
              {' '}·{' '}
              <Link to="/shot-to-prompt" className="underline" style={{ color: 'var(--accent-blue)' }}>Shot to Prompt</Link>
              {' '}·{' '}
              <Link to="/camera-moves" className="underline" style={{ color: 'var(--accent-blue)' }}>Camera Moves</Link>
              {' '}·{' '}
              <Link to="/pricing" className="underline" style={{ color: 'var(--accent-blue)' }}>Pricing</Link>
            </div>
          </div>

          {/* Right: output proof */}
          <div className="neu-card rounded-3xl p-6 lg:p-7" style={{ background: 'var(--bg-secondary)' }}>
            <div className="flex items-center justify-between gap-4 mb-4">
              <div className="text-sm font-bold" style={{ color: 'var(--text-primary)' }}>Output proof</div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold" style={{ color: 'var(--text-muted)' }}>
                <span style={{ width: 8, height: 8, borderRadius: 99, background: '#EF4444', boxShadow: '0 0 0 3px rgba(239,68,68,0.18)' }} />
                REC
              </div>
            </div>

            <div className="rounded-2xl overflow-hidden mb-4" style={{ border: '1px solid var(--border-color)', background: 'var(--bg-card)' }}>
              <div
                className="h-[180px] lg:h-[210px] relative"
                style={{
                  background:
                    'radial-gradient(80% 60% at 25% 30%, rgba(59,130,246,0.35), rgba(59,130,246,0) 60%), radial-gradient(70% 55% at 70% 65%, rgba(245,158,11,0.26), rgba(245,158,11,0) 62%), linear-gradient(180deg, rgba(2,6,23,0.82), rgba(2,6,23,0.96))',
                }}
              >
                <div
                  className="absolute inset-0 opacity-[0.35]"
                  style={{
                    backgroundImage:
                      'linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px), linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px)',
                    backgroundSize: '22px 22px',
                  }}
                />
                <div
                  className="absolute bottom-3 left-3 right-3 rounded-xl px-3 py-2"
                  style={{
                    background: 'rgba(15,23,42,0.55)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    backdropFilter: 'blur(6px)',
                    color: 'rgba(255,255,255,0.92)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: 12,
                    lineHeight: 1.45,
                  }}
                >
                  slow tracking shot, neon reflections on wet street, shallow depth of field, 16:9, 4K
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="text-[10px] font-bold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>PROMPT</div>
                <div
                  style={{
                    color: 'var(--text-primary)',
                    fontFamily: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
                    fontSize: 12.5,
                    lineHeight: 1.6,
                  }}
                >
                  “A lone driver in a neon city, rain on lens, soft bokeh, slow push-in, cinematic grade, 16:9, 4K.”
                </div>
              </div>
              <div className="rounded-2xl p-4" style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)' }}>
                <div className="text-[10px] font-bold tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>WHAT YOU GET</div>
                <div style={{ color: 'var(--text-secondary)', fontSize: 13, lineHeight: 1.6 }}>
                  A copy-ready prompt with camera movement, lighting, mood, and tool-friendly phrasing.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
