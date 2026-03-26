'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Move3d } from 'lucide-react'
import {
  CraneMove,
  DollyMove,
  DollyZoomMove,
  DroneMove,
  DutchAngleMove,
  HandheldMove,
  OrbitMove,
  PanMove,
  PushThroughMove,
  SteadicamMove,
  TiltMove,
  TrackingMove,
  WhipPanMove,
  ZoomMove,
} from './cameraMoves/moves'

const CLASSIC_MOVES = [
  {
    id: 'dolly',
    name: 'Dolly',
    tag: 'push in / pull back',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    desc: 'The camera physically moves forward or backward on a track. Unlike zoom, perspective genuinely shifts.',
    feelText: 'Walking into the scene. Builds intimacy, tension, or a slow reveal.',
    prompts: ['slow dolly in toward subject', 'camera pushes forward on a track', 'cinematic push into close-up'],
    MoveComponent: DollyMove,
  },
  {
    id: 'pan',
    name: 'Pan',
    tag: 'rotate left / right',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    desc: 'The camera rotates left or right on a fixed axis — staying in place while the direction changes.',
    feelText: 'Turning your head to follow action. Great for reveals and wide shots.',
    prompts: ['slow pan left to right', 'camera rotates on fixed axis', 'wide establishing pan across the scene'],
    MoveComponent: PanMove,
  },
  {
    id: 'tilt',
    name: 'Tilt',
    tag: 'pivot up / down',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    desc: 'The camera pivots up or down on a fixed tripod — staying in place while the lens tilts vertically.',
    feelText: 'Looking up at a skyscraper, or slowly revealing a character from shoes to eyes.',
    prompts: ['slow tilt up from feet to face', 'camera pivots upward on fixed tripod', 'low-to-high vertical reveal'],
    MoveComponent: TiltMove,
  },
  {
    id: 'zoom',
    name: 'Zoom',
    tag: 'lens in / lens out',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    desc: 'The camera stays fixed while the lens zooms in or out. Perspective stays the same, only magnification changes.',
    feelText: 'Quickly focusing attention. More abrupt than dolly, but easier to execute.',
    prompts: ['slow zoom in', 'camera zooms toward subject', 'gradual magnification'],
    MoveComponent: ZoomMove,
  },
  {
    id: 'tracking',
    name: 'Tracking Shot',
    tag: 'follow sideways',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    desc: 'Camera and subject move together sideways at the same speed, keeping the subject perfectly framed.',
    feelText: 'Running alongside someone. Keeps energy and the subject always centred in frame.',
    prompts: ['tracking shot following subject', 'camera moves parallel sideways', 'side-on tracking as character walks'],
    MoveComponent: TrackingMove,
  },
  {
    id: 'crane',
    name: 'Crane / Jib',
    tag: 'rise up / sweep down',
    badge: 'CLASSIC MOVE',
    badgeType: 'classic',
    desc: 'The camera is mounted on a long arm and sweeps vertically — rising high above or swooping down to ground level, keeping the subject in frame.',
    feelText: 'A bird taking flight over the scene. Creates grandeur, scale, and epic transitions.',
    prompts: ['crane shot rising up', 'camera sweeps upward on jib arm', 'epic rising reveal pulling back and up'],
    MoveComponent: CraneMove,
  },
]

const DYNAMIC_MOVES = [
  {
    id: 'handheld',
    name: 'Handheld',
    tag: 'smooth / natural',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'A handheld camera has subtle, organic drift from breathing, footsteps, and micro-corrections.',
    feelText: 'Present and personal. Adds realism, tension, and immediacy.',
    prompts: ['handheld camera', 'smooth natural micro-drift', 'human-operated', 'subtle breathing sway'],
    MoveComponent: HandheldMove,
  },
  {
    id: 'steadicam',
    name: 'Steadicam',
    tag: 'follow behind',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'A stabilised rig creates a gliding follow that feels human but controlled.',
    feelText: 'Floating alongside the action. Smooth, immersive, and cinematic.',
    prompts: ['steadicam follow', 'smooth glide', 'stable tracking', 'no shake'],
    MoveComponent: SteadicamMove,
  },
  {
    id: 'whip-pan',
    name: 'Whip Pan',
    tag: 'snap rotation',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'A fast snap pan that creates motion blur. Often used as an energetic transition between moments or locations.',
    feelText: 'Whipping your head to catch something. Punchy, urgent, and stylised.',
    prompts: ['whip pan', 'fast snap rotation', 'motion blur transition', 'energetic cut'],
    MoveComponent: WhipPanMove,
  },
  {
    id: 'dutch',
    name: 'Dutch Angle',
    tag: 'tilt axis (roll)',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'The camera is tilted on its roll axis, making the horizon diagonal.',
    feelText: 'Something is off. Anxiety, instability, or a world out of balance.',
    prompts: ['dutch angle', 'tilted horizon', 'camera roll', 'uneasy tension'],
    MoveComponent: DutchAngleMove,
  },
]

const AI_NATIVE_MOVES = [
  {
    id: 'orbit',
    name: 'Orbit / 360',
    tag: 'circles subject',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'The camera circles the subject while always keeping them centered. Great for hero moments, reveals, and time-freeze energy.',
    feelText: 'The world rotates around the character. Bold, stylized, and high-impact.',
    prompts: ['360 orbit around subject', 'camera circles', 'keeps subject centered', 'smooth cinematic rotation'],
    MoveComponent: OrbitMove,
  },
  {
    id: 'drone',
    name: 'Drone / Aerial',
    tag: 'rise up + away',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'The camera rises and pulls away, revealing context and scale. In AI video, the drone can fly impossible paths.',
    feelText: 'Expansion and grandeur. A reveal that opens the world.',
    prompts: ['drone aerial', 'rise up and pull back', 'overhead reveal', 'wide establishing scale'],
    MoveComponent: DroneMove,
  },
  {
    id: 'dolly-zoom',
    name: 'Dolly Zoom',
    tag: 'dolly back + zoom in',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'Dolly out while zooming in: the subject stays near natural size, but the background perspective warps.',
    feelText: 'Reality bends. Dread, vertigo, shock, or the room closes in.',
    prompts: ['dolly zoom', 'vertigo effect', 'warped perspective', 'dolly out + zoom in'],
    MoveComponent: DollyZoomMove,
  },
  {
    id: 'push-through',
    name: 'Push Through',
    tag: 'through foreground',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'The camera pushes through a foreground element and continues past the subject plane — a reveal that breaks physical constraints.',
    feelText: 'Discovery and momentum. A reveal that feels impossible.',
    prompts: ['push through foreground object', 'camera passes through', 'seamless reveal', 'impossible move'],
    MoveComponent: PushThroughMove,
  },
]

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
