import { Link } from 'react-router-dom';
import { ArrowRight, Move3d, Video, Sparkles } from 'lucide-react';

const FEATURED_MOVES = [
  {
    id: 'dolly',
    name: 'Dolly',
    tag: 'Push In / Pull Back',
    category: 'Classic',
    desc: 'Camera physically moves forward or backward on a track. Unlike zoom, perspective genuinely shifts.',
    feel: 'Walking into the scene. Builds intimacy and tension.',
    icon: 'Track',
    color: '#2563EB'
  },
  {
    id: 'pan',
    name: 'Pan',
    tag: 'Rotate Left / Right',
    category: 'Classic',
    desc: 'Camera rotates left or right on a fixed axis — staying in place while the direction changes.',
    feel: 'Turning your head to follow action. Great for reveals.',
    icon: 'Rotate',
    color: '#2563EB'
  },
  {
    id: 'tilt',
    name: 'Tilt',
    tag: 'Pivot Up / Down',
    category: 'Classic',
    desc: 'Camera pivots up or down on a fixed tripod — vertical movement without changing position.',
    feel: 'Looking up at a skyscraper or revealing a character from shoes to eyes.',
    icon: 'MoveVertical',
    color: '#2563EB'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    tag: 'Lens In / Lens Out',
    category: 'Classic',
    desc: 'Camera stays still — only the lens changes focal length, flattening depth.',
    feel: 'Looking through binoculars. The subject gets bigger but the world flattens.',
    icon: 'Focus',
    color: '#2563EB'
  },
  {
    id: 'handheld',
    name: 'Handheld',
    tag: 'Natural / Human',
    category: 'Dynamic',
    desc: 'Adds organic drift from breathing and footsteps — present and human without chaos.',
    feel: 'Immediate and intimate. Adds realism and tension.',
    icon: 'Hand',
    color: '#BE185D'
  },
  {
    id: 'steadicam',
    name: 'Steadicam',
    tag: 'Smooth Follow',
    category: 'Dynamic',
    desc: 'Stabilized rig glides behind the subject with slight delay — immersive without shake.',
    feel: 'Floating behind the action. Smooth, cinematic, and present.',
    icon: 'Activity',
    color: '#BE185D'
  },
  {
    id: 'orbit',
    name: 'Orbit / 360°',
    tag: 'Circles Subject',
    category: 'AI-Native',
    desc: 'Camera circles the subject while keeping them centered — bold and stylized.',
    feel: 'The world rotates around the character. Big, heroic, high-impact.',
    icon: 'Orbit',
    color: '#7C3AED'
  },
  {
    id: 'drone',
    name: 'Drone / Aerial',
    tag: 'Rise Up + Away',
    category: 'AI-Native',
    desc: 'Camera rises and pulls away, revealing scale. In AI video, drones can fly impossible paths.',
    feel: 'Expansion and grandeur. A reveal that opens the world.',
    icon: 'Plane',
    color: '#7C3AED'
  }
];

const CATEGORY_STYLES = {
  'Classic': { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', icon: Move3d },
  'Dynamic': { bg: '#FDF2F8', border: '#FBCFE8', text: '#BE185D', icon: Video },
  'AI-Native': { bg: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED', icon: Sparkles }
};

export default function CameraMovesPreview() {
  return (
    <section 
      className="py-20 transition-colors"
      style={{ background: 'var(--bg-secondary)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div 
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wider mb-6"
            style={{ 
              background: 'var(--accent-purple)15',
              border: '1px solid var(--accent-purple)30',
              color: 'var(--accent-purple)'
            }}
          >
            <Move3d className="h-3.5 w-3.5" />
            CAMERA MOVEMENTS
          </div>
          <h2 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{ color: 'var(--text-primary)' }}
          >
            Master the Move.
          </h2>
          <p 
            className="max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Classic fundamentals + dynamic cinematic moves + modern AI-native motion.
            <br />
            Hover each card to see how it works.
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {FEATURED_MOVES.map((move) => {
            const style = CATEGORY_STYLES[move.category];
            const Icon = style.icon;
            
            return (
              <div
                key={move.id}
                className="group p-6 rounded-2xl transition-all cursor-pointer hover:-translate-y-1"
                style={{
                  background: 'var(--bg-card)',
                  boxShadow: 'var(--shadow-card)',
                  border: '1px solid var(--border-color)'
                }}
              >
                {/* Badge */}
                <div 
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold mb-4"
                  style={{
                    background: style.bg,
                    border: `1px solid ${style.border}`,
                    color: style.text
                  }}
                >
                  <Icon className="h-3 w-3" />
                  {move.category.toUpperCase()}
                </div>

                {/* Title */}
                <h3 
                  className="text-xl font-bold mb-1"
                  style={{ color: 'var(--text-primary)' }}
                >
                  {move.name}
                </h3>
                <p 
                  className="text-xs font-mono mb-3"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {move.tag}
                </p>

                {/* Description */}
                <p 
                  className="text-sm mb-4 line-clamp-3"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {move.desc}
                </p>

                {/* Feel */}
                <div 
                  className="p-3 rounded-lg text-sm"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Feels like: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{move.feel}</span>
                </div>

                {/* Hover hint */}
                <div 
                  className="mt-4 text-xs font-medium opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: style.text }}
                >
                  Click to explore →
                </div>
              </div>
            );
          })}
        </div>

        {/* See All Button */}
        <div className="text-center">
          <Link
            to="/camera-moves"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold transition-all hover:-translate-y-0.5"
            style={{
              background: 'var(--accent-purple)',
              color: '#fff',
              boxShadow: '0 4px 14px rgba(124,58,237,0.35)'
            }}
          >
            See All 16 Camera Moves
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
