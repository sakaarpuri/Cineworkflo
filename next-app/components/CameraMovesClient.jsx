'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Move3d } from 'lucide-react'
import { AI_NATIVE_MOVES, CLASSIC_MOVES, DYNAMIC_MOVES } from './cameraMoves/cameraMoveData'

function CameraMoveCard({ data }) {
  const [isHovered, setIsHovered] = useState(false)
  const { MoveComponent } = data

  return (
    <article className="camera-move-card" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <div className="camera-move-card__badge-row">
        <span className={`camera-move-card__badge camera-move-card__badge--${data.badgeType}`}>{data.badge}</span>
      </div>

      <div className="camera-move-card__title-row">
        <span className="camera-move-card__name">{data.name}</span>
        <span className="camera-move-card__tag">{data.tag}</span>
      </div>

      <MoveComponent isHovered={isHovered} />

      <p className="camera-move-card__desc">{data.desc}</p>

      <div className="camera-move-card__feel-row">
        <span className="camera-move-card__feel-icon">🎬</span>
        <span className="camera-move-card__feel-text">
          <strong>Feels like:</strong> {data.feelText}
        </span>
      </div>

      <div className="camera-move-card__prompt-row">
        <div className="camera-move-card__prompt-label">ADD TO YOUR PROMPT</div>
        <div className="camera-move-card__prompt-chip">
          {data.prompts.map((prompt, index) => (
            <span key={prompt}>
              <span className="camera-move-card__prompt-var">{prompt}</span>
              {index < data.prompts.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function MoveGrid({ moves }) {
  return (
    <div className="camera-moves-grid">
      {moves.map((move) => (
        <CameraMoveCard key={move.id} data={move} />
      ))}
    </div>
  )
}

export default function CameraMovesClient() {
  return (
    <div className="page-stack">
      <div className="breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        <span>Camera Moves</span>
      </div>

      <section className="camera-moves-page-shell">
        <div className="camera-moves-heading">
          <div className="camera-moves-badge">
            <Move3d className="icon-xs" />
            CAMERA MOVES
          </div>
          <h1>Camera Movements</h1>
          <p>Learn the language of the Camera to master the language of prompts</p>
        </div>

        <section className="camera-moves-section">
          <h2>CLASSIC MOVES</h2>
          <MoveGrid moves={CLASSIC_MOVES} />
        </section>

        <section className="camera-moves-section">
          <h2>DYNAMIC / CINEMATIC MOVES</h2>
          <MoveGrid moves={DYNAMIC_MOVES} />
        </section>

        <section className="camera-moves-section">
          <h2>AI-NATIVE MOVES</h2>
          <MoveGrid moves={AI_NATIVE_MOVES} />
        </section>
      </section>
    </div>
  )
}
