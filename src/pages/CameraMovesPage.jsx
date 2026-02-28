import React from 'react';
import { Move3d } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../components/CameraMoveCards/CameraMoveCard.css';
import { CameraMoveCard } from '../components/CameraMoveCards';
import {
  DollyMove,
  PanMove,
  TiltMove,
  ZoomMove,
  TrackingMove,
  CraneMove,
  HandheldMove,
  SteadicamMove,
  WhipPanMove,
  DutchAngleMove,
  OrbitMove,
  DroneMove,
  DollyZoomMove,
  PushThroughMove
} from '../components/CameraMoveCards/moves';

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
    MoveComponent: DollyMove
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
    MoveComponent: PanMove
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
    MoveComponent: TiltMove
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
    MoveComponent: ZoomMove
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
    MoveComponent: TrackingMove
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
    MoveComponent: CraneMove
  }
];

const DYNAMIC_MOVES = [
  {
    id: 'handheld',
    name: 'Handheld',
    tag: 'smooth / natural',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'A handheld camera has subtle, organic drift from breathing, footsteps, and micro-corrections. It feels intimate and human without looking chaotic.',
    feelText: 'Present and personal. Adds realism, tension, and immediacy.',
    prompts: ['handheld camera', 'smooth natural micro-drift', 'human-operated', 'subtle breathing sway'],
    MoveComponent: HandheldMove
  },
  {
    id: 'steadicam',
    name: 'Steadicam',
    tag: 'follow behind',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'A stabilised rig creates a gliding follow that feels human but controlled. The camera moves with the subject without the jitter of handheld.',
    feelText: 'Floating alongside the action. Smooth, immersive, and cinematic.',
    prompts: ['steadicam follow', 'smooth glide', 'stable tracking', 'no shake'],
    MoveComponent: SteadicamMove
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
    MoveComponent: WhipPanMove
  },
  {
    id: 'dutch',
    name: 'Dutch Angle',
    tag: 'tilt axis (roll)',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'The camera is tilted on its roll axis, making the horizon diagonal. A classic way to suggest unease, imbalance, or psychological tension.',
    feelText: 'Something is off. Anxiety, instability, or a world out of balance.',
    prompts: ['dutch angle', 'tilted horizon', 'camera roll', 'uneasy tension'],
    MoveComponent: DutchAngleMove
  }
];

const MODERN_MOVES = [
  {
    id: 'orbit',
    name: 'Orbit / 360',
    tag: 'circles subject',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'The camera circles the subject while always keeping them centered. Great for hero moments, reveals, and “time-freeze” energy.',
    feelText: 'The world rotates around the character. Bold, stylized, and high-impact.',
    prompts: ['360 orbit around subject', 'camera circles', 'keeps subject centered', 'smooth cinematic rotation'],
    MoveComponent: OrbitMove
  },
  {
    id: 'drone',
    name: 'Drone / Aerial',
    tag: 'rise up + away',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'The camera rises and pulls away, revealing context and scale. In AI video, the “drone” can fly impossible paths without safety limits.',
    feelText: 'Expansion and grandeur. A reveal that opens the world.',
    prompts: ['drone aerial', 'rise up and pull back', 'overhead reveal', 'wide establishing scale'],
    MoveComponent: DroneMove
  },
  {
    id: 'dolly-zoom',
    name: 'Dolly Zoom (Vertigo)',
    tag: 'dolly back + zoom in',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'Dolly out while zooming in: the subject stays near natural size, but the background perspective warps.',
    feelText: 'Reality bends. Dread, vertigo, shock, or “the room closes in.”',
    prompts: ['dolly zoom', 'vertigo effect', 'warped perspective', 'dolly out + zoom in'],
    MoveComponent: DollyZoomMove
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
    MoveComponent: PushThroughMove
  }
];

function Grid({ moves }) {
  return (
    <div
      className="grid"
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))',
        gap: 28,
        maxWidth: 1200,
        margin: '0 auto'
      }}
    >
      {moves.map((m) => (
        <CameraMoveCard key={m.id} data={m} />
      ))}
    </div>
  );
}

export default function CameraMovesPage() {
  return (
    <div style={{ background: '#F0EEE9', padding: '60px 24px 80px' }}>
      <nav
        aria-label="Breadcrumb"
        style={{
          maxWidth: 1200,
          margin: '0 auto 16px',
          fontSize: 14,
          color: '#6B7280',
          display: 'flex',
          gap: 8,
          alignItems: 'center'
        }}
      >
        <Link to="/" style={{ textDecoration: 'underline' }}>Home</Link>
        <span>/</span>
        <span style={{ color: '#374151' }}>Camera Moves</span>
      </nav>

      <div style={{ textAlign: 'center', marginBottom: 52 }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            fontSize: 10,
            fontWeight: 800,
            letterSpacing: '0.14em',
            color: '#2563EB',
            background: '#EFF6FF',
            border: '1px solid #BFDBFE',
            padding: '4px 14px',
            borderRadius: 99,
            marginBottom: 14
          }}
        >
          <Move3d className="h-3.5 w-3.5" />
          CAMERA MOVES
        </div>
        <h1 style={{ fontSize: 36, fontWeight: 800, color: '#111827', letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.15 }}>
          Camera Movements
        </h1>
        <p style={{ fontSize: 15, color: '#6B7280', lineHeight: 1.6 }}>
          Learn the language of the Camera to master the language of prompts
        </p>
      </div>

      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.08em', color: '#111827', margin: '30px auto 20px', maxWidth: 1200 }}>
        CLASSIC MOVES
      </div>
      <Grid moves={CLASSIC_MOVES} />

      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.08em', color: '#111827', margin: '30px auto 20px', maxWidth: 1200 }}>
        DYNAMIC / CINEMATIC MOVES
      </div>
      <Grid moves={DYNAMIC_MOVES} />

      <div style={{ fontSize: 18, fontWeight: 800, letterSpacing: '0.08em', color: '#111827', margin: '30px auto 20px', maxWidth: 1200 }}>
        MODERN / AI-NATIVE MOVES
      </div>
      <Grid moves={MODERN_MOVES} />

      <section
        style={{
          maxWidth: 1200,
          margin: '28px auto 0',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: 24
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 8 }}>
          Apply these moves in your prompts
        </h2>
        <p style={{ color: '#6B7280', marginBottom: 16 }}>
          Use camera-language terms directly in your generation workflow, then refine from visual references.
        </p>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <Link
            to="/prompts"
            style={{
              background: '#2563EB',
              color: '#fff',
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700
            }}
          >
            Browse Prompt Vault
          </Link>
          <Link
            to="/shot-to-prompt"
            style={{
              border: '1px solid #D1D5DB',
              color: '#111827',
              background: '#fff',
              padding: '10px 14px',
              borderRadius: 10,
              fontWeight: 700
            }}
          >
            Try Shot to Prompt
          </Link>
        </div>
      </section>

      <section
        style={{
          maxWidth: 1200,
          margin: '20px auto 0',
          background: '#FFFFFF',
          border: '1px solid #E5E7EB',
          borderRadius: 16,
          padding: 24
        }}
      >
        <h2 style={{ fontSize: 24, fontWeight: 800, color: '#111827', marginBottom: 14 }}>
          Camera Moves FAQ
        </h2>
        <div style={{ display: 'grid', gap: 14 }}>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              What is the difference between tracking and steadicam?
            </h3>
            <p style={{ color: '#6B7280', lineHeight: 1.6 }}>
              Tracking usually means camera and subject move together on a matched path; steadicam means stabilized free movement that still follows naturally.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              Which camera moves are best for beginners?
            </h3>
            <p style={{ color: '#6B7280', lineHeight: 1.6 }}>
              Start with dolly, pan, tilt, and zoom. They are easy to describe in prompts and build a solid camera-language foundation.
            </p>
          </div>
          <div>
            <h3 style={{ fontSize: 16, fontWeight: 700, color: '#111827', marginBottom: 4 }}>
              When should I use AI-native moves like push through or dolly zoom?
            </h3>
            <p style={{ color: '#6B7280', lineHeight: 1.6 }}>
              Use them for stylized transitions, dramatic tension, and shots that are expensive or physically difficult in real production.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
