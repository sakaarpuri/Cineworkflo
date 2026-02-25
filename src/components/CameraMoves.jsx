import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Move3d, Video, Sparkles } from 'lucide-react';

const ALL_MOVES = [
  // Classic
  {
    id: 'dolly',
    name: 'Dolly',
    tag: 'Push In / Pull Back',
    category: 'Classic',
    desc: 'The camera physically moves forward or backward on a track. Unlike zoom, perspective genuinely shifts.',
    feel: 'Walking into the scene. Builds intimacy, tension, or a slow reveal.',
    prompt: 'slow dolly in toward subject, camera pushes forward on a track, cinematic push into close-up'
  },
  {
    id: 'pan',
    name: 'Pan',
    tag: 'Rotate Left / Right',
    category: 'Classic',
    desc: 'The camera rotates left or right on a fixed axis — it stays in place, only the direction it points changes.',
    feel: 'Turning your head to follow someone walking past. Great for reveals and establishing wide shots.',
    prompt: 'slow pan left to right, camera rotates on fixed axis, wide establishing pan'
  },
  {
    id: 'tilt',
    name: 'Tilt',
    tag: 'Pivot Up / Down',
    category: 'Classic',
    desc: 'The camera pivots up or down on a fixed tripod — staying in place while the lens tilts vertically.',
    feel: 'Looking up at a skyscraper, or slowly revealing a character from shoes to eyes.',
    prompt: 'slow tilt up from feet to face, camera pivots upward, vertical reveal'
  },
  {
    id: 'zoom',
    name: 'Zoom',
    tag: 'Lens In / Lens Out',
    category: 'Classic',
    desc: 'The camera stays completely still — only the lens changes focal length, making the subject appear closer or further.',
    feel: 'Looking through binoculars. The subject gets bigger but the depth of the world flattens.',
    prompt: 'slow zoom in on subject, camera stays fixed, telephoto compression'
  },
  {
    id: 'tracking',
    name: 'Tracking Shot',
    tag: 'Follow Sideways',
    category: 'Classic',
    desc: 'Camera and subject move together sideways at the same speed, keeping the subject framed throughout.',
    feel: 'Running alongside someone. Keeps energy and the subject always centered.',
    prompt: 'tracking shot following subject, camera moves parallel, side-on follow'
  },
  {
    id: 'crane',
    name: 'Crane / Jib',
    tag: 'Rise Up / Sweep Down',
    category: 'Classic',
    desc: 'The camera is mounted on a long arm and sweeps vertically — rising high above or swooping down.',
    feel: 'A bird taking flight over the scene. Creates grandeur, scale, and epic transitions.',
    prompt: 'crane shot rising up, sweeps upward on jib, epic reveal'
  },
  // Dynamic
  {
    id: 'handheld',
    name: 'Handheld',
    tag: 'Natural / Human',
    category: 'Dynamic',
    desc: 'Handheld adds organic drift from breathing, footsteps, and micro-corrections — present and human without chaos.',
    feel: 'Immediate and intimate. Adds realism and tension.',
    prompt: 'handheld camera, smooth natural micro-drift, human-operated'
  },
  {
    id: 'steadicam',
    name: 'Steadicam',
    tag: 'Smooth Follow',
    category: 'Dynamic',
    desc: 'A stabilized rig glides behind the subject. It follows smooth walking motion with a slight delay — immersive without shake.',
    feel: 'Floating behind the action. Smooth, cinematic, and present.',
    prompt: 'steadicam follow, smooth glide, stable tracking'
  },
  {
    id: 'whip-pan',
    name: 'Whip Pan',
    tag: 'Snap Rotation',
    category: 'Dynamic',
    desc: 'A fast snap pan that creates motion blur. Often used as an energetic transition between moments or locations.',
    feel: 'Whipping your head to catch something. Punchy, urgent, and stylized.',
    prompt: 'whip pan, fast snap rotation, motion blur transition'
  },
  {
    id: 'dutch',
    name: 'Dutch Angle',
    tag: 'Tilt Axis (Roll)',
    category: 'Dynamic',
    desc: 'The camera is tilted on its roll axis, making the horizon diagonal — a classic cue for unease or imbalance.',
    feel: 'Something is off. Anxiety, instability, or a world out of balance.',
    prompt: 'dutch angle, tilted horizon, uneasy tension'
  },
  // AI-Native
  {
    id: 'orbit',
    name: 'Orbit / 360°',
    tag: 'Circles Subject',
    category: 'AI-Native',
    desc: 'The camera circles the subject while keeping them centered — bold, stylized, and often "too perfect" for real rigs.',
    feel: 'The world rotates around the character. Big, heroic, and high-impact.',
    prompt: '360 orbit around subject, smooth circle, keeps subject centered'
  },
  {
    id: 'drone',
    name: 'Drone / Aerial',
    tag: 'Rise Up + Away',
    category: 'AI-Native',
    desc: 'The camera rises and pulls away, revealing scale. In AI video, drones can fly impossible paths without safety limits.',
    feel: 'Expansion and grandeur. A reveal that opens the world.',
    prompt: 'drone aerial, rise up and pull back, overhead reveal'
  },
  {
    id: 'dolly-zoom',
    name: 'Dolly Zoom (Vertigo)',
    tag: 'Dolly Back + Zoom In',
    category: 'AI-Native',
    desc: 'Dolly out while zooming in: the subject stays near natural size, but the background perspective warps.',
    feel: 'Reality bends. Dread, vertigo, shock, or "the room closes in."',
    prompt: 'dolly zoom, vertigo effect, warped perspective'
  },
  {
    id: 'push-through',
    name: 'Push Through',
    tag: 'Through Foreground',
    category: 'AI-Native',
    desc: 'The camera pushes through a foreground element and continues past the subject plane — a reveal that breaks physical constraints.',
    feel: 'Discovery and momentum. A reveal that feels impossible.',
    prompt: 'push through foreground object, camera passes through, seamless reveal'
  },
  {
    id: 'fpv',
    name: 'FPV Racing',
    tag: 'High-Speed Flight',
    category: 'AI-Native',
    desc: 'First-person-view drone racing style — extreme speed, rapid direction changes, threading through tight spaces.',
    feel: 'Adrenaline rush. Like being inside a video game chase scene.',
    prompt: 'FPV drone racing style, high-speed flight, aggressive maneuvers through obstacles'
  },
  {
    id: 'bullet-time',
    name: 'Bullet Time',
    tag: 'Frozen Moment',
    category: 'AI-Native',
    desc: 'Time appears frozen while the camera moves around the subject — a complex multi-camera effect made easy with AI.',
    feel: 'The Matrix. Complete control over time and space.',
    prompt: 'bullet time effect, frozen moment with camera movement around subject, time slice style'
  }
];

const CATEGORY_FILTERS = {
  'All': { color: '#6B7280', bg: '#F3F4F6' },
  'Classic': { color: '#2563EB', bg: '#EFF6FF' },
  'Dynamic': { color: '#BE185D', bg: '#FDF2F8' },
  'AI-Native': { color: '#7C3AED', bg: '#F5F3FF' }
};

const CATEGORY_ICONS = {
  'Classic': Move3d,
  'Dynamic': Video,
  'AI-Native': Sparkles
};

export default function CameraMoves() {
  const [activeFilter, setActiveFilter] = useState('All');

  const filteredMoves = activeFilter === 'All' 
    ? ALL_MOVES 
    : ALL_MOVES.filter(m => m.category === activeFilter);

  return (
    <div 
      className="min-h-screen transition-colors"
      style={{ background: 'var(--bg-primary)' }}
    >
      {/* Header */}
      <header 
        className="sticky top-0 z-50 border-b"
        style={{ 
          background: 'var(--bg-secondary)',
          borderColor: 'var(--border-color)'
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                to="/"
                className="flex items-center gap-2 font-medium"
                style={{ color: 'var(--text-secondary)' }}
              >
                <ArrowLeft className="h-5 w-5" />
                Back
              </Link>
              <h1 
                className="text-2xl font-bold"
                style={{ color: 'var(--text-primary)' }}
              >
                Camera Movements
              </h1>
            </div>
            <span 
              className="text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              {ALL_MOVES.length} moves
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Intro */}
        <div className="text-center mb-10">
          <p 
            className="max-w-2xl mx-auto"
            style={{ color: 'var(--text-secondary)' }}
          >
            Master classic fundamentals, dynamic cinematic techniques, and modern AI-native motion.
            Each move includes prompt examples for your AI video generator.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {Object.entries(CATEGORY_FILTERS).map(([category, style]) => {
            const Icon = category === 'All' ? Move3d : CATEGORY_ICONS[category];
            const isActive = activeFilter === category;
            
            return (
              <button
                key={category}
                onClick={() => setActiveFilter(category)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-full font-semibold transition-all"
                style={{
                  background: isActive ? `linear-gradient(145deg, ${style.bg}, ${style.color}15)` : 'var(--bg-card)',
                  border: `1.5px solid ${isActive ? style.color : 'var(--border-color)'}`,
                  color: isActive ? style.color : 'var(--text-secondary)',
                  boxShadow: isActive 
                    ? `inset 3px 3px 6px ${style.color}30, inset -3px -3px 6px rgba(255,255,255,0.5)` 
                    : '5px 5px 10px rgba(0,0,0,0.08), -5px -5px 10px rgba(255,255,255,0.8), inset 0 1px 0 rgba(255,255,255,0.5)',
                  transform: isActive ? 'translateY(1px)' : 'translateY(0)'
                }}
              >
                <Icon className="h-4 w-4" />
                {category}
                <span 
                  className="text-xs px-2 py-0.5 rounded-full font-bold"
                  style={{ 
                    background: isActive ? style.color : style.bg,
                    color: isActive ? '#fff' : style.color
                  }}
                >
                  {category === 'All' ? ALL_MOVES.length : ALL_MOVES.filter(m => m.category === category).length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredMoves.map((move) => {
            const style = CATEGORY_FILTERS[move.category];
            const Icon = CATEGORY_ICONS[move.category];
            
            return (
              <div
                key={move.id}
                className="p-6 rounded-2xl transition-all"
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
                    border: `1px solid ${style.color}30`,
                    color: style.color
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
                  className="text-xs font-mono mb-4"
                  style={{ color: 'var(--text-muted)' }}
                >
                  {move.tag}
                </p>

                {/* Description */}
                <p 
                  className="text-sm mb-4"
                  style={{ color: 'var(--text-secondary)' }}
                >
                  {move.desc}
                </p>

                {/* Feel */}
                <div 
                  className="p-3 rounded-lg text-sm mb-4"
                  style={{
                    background: 'var(--bg-primary)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <span style={{ color: 'var(--text-muted)' }}>Feels like: </span>
                  <span style={{ color: 'var(--text-primary)' }}>{move.feel}</span>
                </div>

                {/* Prompt */}
                <div>
                  <div 
                    className="text-xs font-bold mb-2"
                    style={{ color: 'var(--text-muted)' }}
                  >
                    ✏️ ADD TO YOUR PROMPT
                  </div>
                  <div 
                    className="p-3 rounded-lg text-xs font-mono leading-relaxed"
                    style={{
                      background: style.bg,
                      border: `1px solid ${style.color}30`,
                      color: style.color
                    }}
                  >
                    {move.prompt}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
