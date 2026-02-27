import React, { useState } from 'react';
import { ArrowRight, Move3d } from 'lucide-react';
import './CameraMoveCard.css';
import {
  DollyMove,
  PanMove,
  TiltMove,
  TrackingMove,
  ZoomMove,
  HandheldMove,
  DroneMove,
  OrbitMove
} from './moves';

// Card metadata - ONLY using moves from actual HTML pages
const CARD_DATA = [
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
    id: 'handheld',
    name: 'Handheld',
    tag: 'smooth / natural',
    badge: 'DYNAMIC / CINEMATIC',
    badgeType: 'dynamic',
    desc: 'A handheld camera has subtle, organic drift from breathing, footsteps, and micro-corrections.',
    feelText: 'Present and personal. Adds realism, tension, and immediacy.',
    prompts: ['handheld camera', 'smooth natural micro-drift', 'human-operated', 'subtle breathing sway'],
    MoveComponent: HandheldMove
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
    MoveComponent: DroneMove
  },
  {
    id: 'orbit',
    name: 'Orbit / 360',
    tag: 'circles subject',
    badge: 'AI-NATIVE MOVE',
    badgeType: 'ainative',
    desc: 'The camera circles the subject while always keeping them centered. Great for hero moments.',
    feelText: 'The world rotates around the character. Bold, stylized, and high-impact.',
    prompts: ['360 orbit around subject', 'camera circles', 'keeps subject centered', 'smooth cinematic rotation'],
    MoveComponent: OrbitMove
  }
];

function CameraMoveCard({ data }) {
  const [isHovered, setIsHovered] = useState(false);
  const { MoveComponent } = data;

  return (
    <div 
      className="camera-move-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Badge */}
      <div className="camera-move-card__badge-row">
        <span className={`camera-move-card__badge camera-move-card__badge--${data.badgeType}`}>
          {data.badge}
        </span>
      </div>

      {/* Title */}
      <div className="camera-move-card__title-row">
        <span className="camera-move-card__name">{data.name}</span>
        <span className="camera-move-card__tag">{data.tag}</span>
      </div>

      {/* Animation Stage */}
      <MoveComponent isHovered={isHovered} />

      {/* Description */}
      <p className="camera-move-card__desc">{data.desc}</p>

      {/* Feel Row */}
      <div className="camera-move-card__feel-row">
        <span className="camera-move-card__feel-icon">🎬</span>
        <span className="camera-move-card__feel-text">
          <strong>Feels like:</strong> {data.feelText}
        </span>
      </div>

      {/* Prompts */}
      <div className="camera-move-card__prompt-row">
        <div className="camera-move-card__prompt-label">ADD TO YOUR PROMPT</div>
        <div className="camera-move-card__prompt-chip">
          {data.prompts.map((p, i) => (
            <span key={i}>
              <span className="camera-move-card__prompt-var">{p}</span>
              {i < data.prompts.length - 1 ? ', ' : ''}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function CameraMoveCards() {
  return (
    <section className="py-14" style={{ background: '#F0EEE9' }}>
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider mb-3" 
               style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB' }}>
            <Move3d className="h-3.5 w-3.5" />
            CAMERA MOVES
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#111827' }}>
            Camera Movements
          </h2>
          <p className="max-w-2xl mx-auto" style={{ color: '#6B7280' }}>
            Hover cards to preview animations. Click for full details.
          </p>
        </div>
        
        <div
          className="grid gap-7 mb-10"
          style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))' }}
        >
          {CARD_DATA.map((card) => (
            <CameraMoveCard key={card.id} data={card} />
          ))}
        </div>
        
        <div className="text-center">
          <a 
            href="/camera-moves" 
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            style={{ 
              background: 'linear-gradient(145deg, #8B5CF6, #8B5CF6DD)', 
              color: '#fff',
              border: '2px solid #8B5CF650',
              boxShadow: 'inset 3px 3px 6px rgba(139,92,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(139,92,246,0.4)',
              transform: 'translateY(0) scale(1)'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translateY(2px) scale(0.96)';
              e.currentTarget.style.boxShadow = 'inset 4px 4px 8px rgba(139,92,246,0.6), inset -3px -3px 6px rgba(255,255,255,0.3), 0 2px 6px rgba(139,92,246,0.3)';
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(139,92,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(139,92,246,0.4)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0) scale(1)';
              e.currentTarget.style.boxShadow = 'inset 3px 3px 6px rgba(139,92,246,0.4), inset -3px -3px 6px rgba(255,255,255,0.3), 0 4px 12px rgba(139,92,246,0.4)';
            }}
          >
            See all camera moves
            <ArrowRight className="h-5 w-5" />
          </a>
        </div>
      </div>
    </section>
  );
}
