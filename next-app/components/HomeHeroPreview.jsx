'use client'

import { useEffect, useState } from 'react'

const HERO_OVERLAY_PROMPTS = [
  'prompt id #247 · Stepwell descent',
  'prompt id #248 · Alien planet survivor portrait',
  'prompt id #249 · Mustang desert drive',
]

export default function HomeHeroPreview() {
  const [videoOk, setVideoOk] = useState(true)
  const [overlayIndex, setOverlayIndex] = useState(0)
  const [overlayFinished, setOverlayFinished] = useState(false)
  const [typedOverlay, setTypedOverlay] = useState('')
  const currentOverlayLabel = HERO_OVERLAY_PROMPTS[overlayIndex] || ''

  useEffect(() => {
    if (overlayFinished) {
      setTypedOverlay('')
      return
    }

    let index = 0
    setTypedOverlay('')

    const timer = window.setInterval(() => {
      index += 1
      setTypedOverlay(currentOverlayLabel.slice(0, index))
      if (index >= currentOverlayLabel.length) {
        window.clearInterval(timer)
      }
    }, 26)

    return () => window.clearInterval(timer)
  }, [currentOverlayLabel, overlayFinished])

  const handleTimeUpdate = (event) => {
    if (overlayFinished) return

    const currentTime = event.currentTarget.currentTime
    if (currentTime >= 9) {
      setOverlayIndex(2)
      setOverlayFinished(true)
      return
    }

    if (currentTime >= 6) {
      setOverlayIndex(2)
      return
    }

    if (currentTime >= 3) {
      setOverlayIndex(1)
      return
    }

    setOverlayIndex(0)
  }

  return (
    <div className="panel hero-preview-redesign">
      <div className="hero-preview-header">
        <div className="panel-title">Output Preview</div>
        <div className="hero-rec">
          <span className="hero-rec-dot" />
          REC
        </div>
      </div>

      <div className="hero-preview-media hero-preview-video-shell">
        {videoOk ? (
          <video
            className="hero-preview-video"
            preload="metadata"
            src="/hero-demo.mp4"
            muted
            autoPlay
            loop
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onError={() => setVideoOk(false)}
          />
        ) : (
          <div className="hero-preview-fallback" />
        )}

        <div className="hero-preview-grid" />
        <div className={`hero-preview-chip ${overlayFinished ? 'fade' : ''}`}>
          {typedOverlay}
          {!overlayFinished && typedOverlay.length < currentOverlayLabel.length ? <span className="hero-preview-caret">▋</span> : null}
        </div>
      </div>

      <div className="panel-card">
        <div className="panel-eyebrow">WHAT YOU GET</div>
        <p className="panel-copy">
          Still-frame language, motion-aware direction, and prompt structures that stay useful across Shot to Prompt,
          Prompt Enhancer, and the Vault.
        </p>
        <div className="loop-list">
          {HERO_OVERLAY_PROMPTS.map((label) => (
            <span key={label} className="loop-chip active-home-chip">
              {label}
            </span>
          ))}
        </div>
      </div>
    </div>
  )
}
