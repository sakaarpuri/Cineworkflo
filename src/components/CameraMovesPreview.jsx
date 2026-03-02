import { ArrowRight, Move3d } from 'lucide-react';
import { Link } from 'react-router-dom';

const PREVIEW_MOVES = [
  {
    name: 'Dolly',
    tag: 'push in / pull back',
    badge: 'CLASSIC MOVE',
    color: '#2563EB',
    desc: 'Camera moves on track. Perspective shifts unlike zoom.',
    feelsLike: 'Drawing viewer into subject\'s emotional space',
    prompts: ['Dolly in on character\'s face', 'Pull back to reveal scene']
  },
  {
    name: 'Pan', 
    tag: 'rotate left / right',
    badge: 'CLASSIC MOVE',
    color: '#2563EB',
    desc: 'Camera rotates on fixed axis to follow action.',
    feelsLike: 'Following the action, keeping subject in frame',
    prompts: ['Pan with moving car', 'Slow pan across landscape']
  },
  {
    name: 'Tilt',
    tag: 'pivot up / down',
    badge: 'CLASSIC MOVE',
    color: '#2563EB',
    desc: 'Camera pivots vertically while staying in place.',
    feelsLike: 'Revealing height or depth gradually',
    prompts: ['Tilt up from feet to full body', 'Tilt down from sky to ground']
  },
  {
    name: 'Zoom',
    tag: 'lens in / out',
    badge: 'CLASSIC MOVE',
    color: '#2563EB',
    desc: 'Lens changes focal length, flattening perspective.',
    feelsLike: 'Dramatic emphasis or sudden reveal',
    prompts: ['Zoom into eyes for intensity', 'Quick zoom out for comedy']
  },
  {
    name: 'Handheld',
    tag: 'smooth / natural', 
    badge: 'DYNAMIC',
    color: '#BE185D',
    desc: 'Organic drift from breathing and footsteps.',
    feelsLike: 'Being there, documentary authenticity',
    prompts: ['Handheld through crowd', 'Intimate close-up']
  },
  {
    name: 'Steadicam',
    tag: 'follow behind',
    badge: 'DYNAMIC',
    color: '#BE185D',
    desc: 'Stabilized rig glides smoothly behind subject.',
    feelsLike: 'Floating through space, dreamlike following',
    prompts: ['Through hallway chase', 'Entering grand space']
  },
  {
    name: 'Orbit',
    tag: 'circles subject',
    badge: 'AI-NATIVE', 
    color: '#6D28D9',
    desc: 'Camera circles subject, keeping them centered.',
    feelsLike: 'Revealing all angles, emphasizing importance',
    prompts: ['Orbit around product', '360 around moment']
  },
  {
    name: 'Drone',
    tag: 'rise + reveal',
    badge: 'AI-NATIVE',
    color: '#6D28D9',
    desc: 'Rises and pulls away for epic scale reveals.',
    feelsLike: 'Epic scale, breathtaking grandeur',
    prompts: ['Rise to reveal cityscape', 'Ascending over landscape']
  }
];

export default function CameraMovesPreview() {
  return (
    <section className="py-14" style={{ background: '#F0EEE9' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider mb-3" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#2563EB' }}>
            <Move3d className="h-3.5 w-3.5" />
            CAMERA MOVES
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: '#111827' }}>Camera Movements</h2>
          <p className="max-w-2xl mx-auto" style={{ color: '#6B7280' }}>Hover cards to preview animations. Click for full details.</p>
        </div>

        <style>{`
          @keyframes dolly-anim {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(15px); }
          }
          @keyframes pan-anim {
            0%, 100% { transform: translateX(0); }
            50% { transform: translateX(-20px); }
          }
          @keyframes tilt-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-15px); }
          }
          @keyframes zoom-anim {
            0%, 100% { transform: scale(1); }
            50% { transform: scale(1.4); }
          }
          @keyframes handheld-anim {
            0%, 100% { transform: translate(0, 0) rotate(0deg); }
            25% { transform: translate(-1px, 1px) rotate(-0.5deg); }
            50% { transform: translate(1px, -1px) rotate(0.5deg); }
            75% { transform: translate(-1px, -1px) rotate(-0.3deg); }
          }
          @keyframes steadicam-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-5px); }
          }
          @keyframes orbit-anim {
            0% { transform: rotate(0deg) translateX(16px) rotate(0deg); }
            100% { transform: rotate(360deg) translateX(16px) rotate(-360deg); }
          }
          @keyframes drone-anim {
            0%, 100% { transform: translateY(0); }
            50% { transform: translateY(-20px); }
          }
          .move-card:hover .dolly-icon { animation: dolly-anim 1.5s ease-in-out infinite; }
          .move-card:hover .pan-icon { animation: pan-anim 2s ease-in-out infinite; }
          .move-card:hover .tilt-icon { animation: tilt-anim 2s ease-in-out infinite; }
          .move-card:hover .zoom-icon { animation: zoom-anim 1.5s ease-in-out infinite; }
          .move-card:hover .handheld-icon { animation: handheld-anim 0.3s ease-in-out infinite; }
          .move-card:hover .steadicam-icon { animation: steadicam-anim 2s ease-in-out infinite; }
          .move-card:hover .orbit-icon { animation: orbit-anim 2.5s linear infinite; }
          .move-card:hover .drone-icon { animation: drone-anim 2s ease-in-out infinite; }
          .move-card:hover .play-btn { opacity: 0; }
          .move-card:hover .anim-preview { opacity: 1; }
        `}</style>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {PREVIEW_MOVES.map((move) => (
            <Link
              key={move.name}
              to="/camera-moves"
              className="move-card group block"
              style={{ 
                background: '#fff', 
                border: '1.5px solid #E2DDD6', 
                borderRadius: 16, 
                overflow: 'hidden', 
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
                textDecoration: 'none',
                color: 'inherit'
              }}
            >
              {/* Animation area */}
              <div style={{ 
                height: 90, 
                background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', 
                position: 'relative', 
                display: 'flex', 
                alignItems: 'center', 
                justifyContent: 'center' 
              }}>
                {/* Play button - shown by default */}
                <div className="play-btn" style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 6, 
                  background: move.color, 
                  color: '#fff', 
                  fontSize: 10, 
                  fontWeight: 700, 
                  fontFamily: 'ui-monospace, monospace', 
                  padding: '5px 10px', 
                  borderRadius: 99,
                  transition: 'opacity 0.2s'
                }}>
                  <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '3px 0 3px 6px', borderColor: 'transparent transparent transparent #fff' }} />
                  PLAY
                </div>

                {/* Animation preview - shown on hover */}
                <div className="anim-preview" style={{ 
                  position: 'absolute',
                  inset: 0,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: 0,
                  transition: 'opacity 0.2s'
                }}>
                  {move.name === 'Dolly' && (
                    <div className="dolly-icon" style={{ width: 50, height: 36, position: 'relative' }}>
                      <div style={{ width: 30, height: 20, background: 'rgba(255,255,255,0.9)', borderRadius: 3, position: 'absolute', top: 8, left: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 8, fontWeight: 700, color: '#0f172a' }}>SUB</div>
                      <div style={{ width: 10, height: 10, background: move.color, borderRadius: '50%', position: 'absolute', top: 13, left: 2, boxShadow: `0 0 8px ${move.color}` }} />
                    </div>
                  )}
                  {move.name === 'Pan' && (
                    <div style={{ width: 60, height: 40, position: 'relative', overflow: 'hidden' }}>
                      <div className="pan-icon" style={{ display: 'flex', gap: 6, position: 'absolute', top: 12, left: 0 }}>
                        <div style={{ width: 20, height: 14, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                        <div style={{ width: 20, height: 14, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
                        <div style={{ width: 20, height: 14, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                      </div>
                      <div style={{ position: 'absolute', top: 2, right: 4, width: 16, height: 12, border: '2px solid rgba(255,255,255,0.4)', borderRadius: 2 }} />
                    </div>
                  )}
                  {move.name === 'Tilt' && (
                    <div style={{ width: 40, height: 50, position: 'relative', overflow: 'hidden' }}>
                      <div className="tilt-icon" style={{ display: 'flex', flexDirection: 'column', gap: 4, position: 'absolute', left: 12, top: 0 }}>
                        <div style={{ width: 14, height: 10, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                        <div style={{ width: 14, height: 10, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
                        <div style={{ width: 14, height: 10, background: 'rgba(255,255,255,0.3)', borderRadius: 2 }} />
                      </div>
                      <div style={{ position: 'absolute', bottom: 2, left: '50%', transform: 'translateX(-50%)', width: 16, height: 10, border: '2px solid rgba(255,255,255,0.4)', borderRadius: 2 }} />
                    </div>
                  )}
                  {move.name === 'Zoom' && (
                    <div className="zoom-icon" style={{ width: 40, height: 40, border: '3px solid rgba(255,255,255,0.9)', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 16, height: 16, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
                    </div>
                  )}
                  {move.name === 'Handheld' && (
                    <div className="handheld-icon" style={{ width: 40, height: 28, background: 'rgba(255,255,255,0.2)', borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: 24, height: 16, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
                    </div>
                  )}
                  {move.name === 'Steadicam' && (
                    <div className="steadicam-icon" style={{ width: 44, height: 32, position: 'relative' }}>
                      <div style={{ width: 40, height: 24, background: 'rgba(255,255,255,0.15)', borderRadius: 4, position: 'absolute', top: 0, left: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <div style={{ width: 24, height: 16, background: 'rgba(255,255,255,0.9)', borderRadius: 2 }} />
                      </div>
                      <div style={{ position: 'absolute', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: 44, height: 2, background: 'rgba(255,255,255,0.3)', borderRadius: 1 }} />
                    </div>
                  )}
                  {move.name === 'Orbit' && (
                    <div style={{ width: 50, height: 50, position: 'relative' }}>
                      <div style={{ width: 18, height: 18, background: 'rgba(255,255,255,0.9)', borderRadius: '50%', position: 'absolute', top: 16, left: 16 }} />
                      <div className="orbit-icon" style={{ width: 10, height: 10, background: move.color, borderRadius: '50%', position: 'absolute', top: 8, left: 20, boxShadow: `0 0 10px ${move.color}` }} />
                    </div>
                  )}
                  {move.name === 'Drone' && (
                    <div style={{ width: 50, height: 50, position: 'relative', overflow: 'hidden' }}>
                      <div className="drone-icon" style={{ width: 28, height: 18, background: 'rgba(255,255,255,0.9)', borderRadius: 3, position: 'absolute', top: 28, left: 11 }} />
                      <div style={{ position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, background: move.color, borderRadius: '50%', boxShadow: `0 0 10px ${move.color}` }} />
                    </div>
                  )}
                </div>
              </div>
              
              <div style={{ padding: '10px 12px' }}>
                <span style={{ 
                  fontSize: 8, 
                  fontWeight: 700, 
                  letterSpacing: '0.08em', 
                  padding: '2px 6px', 
                  borderRadius: 99, 
                  display: 'inline-block', 
                  color: move.color, 
                  background: move.color + '12', 
                  border: `1px solid ${move.color}25`,
                  marginBottom: 5
                }}>
                  {move.badge}
                </span>
                
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#111827', marginBottom: 1 }}>{move.name}</h3>
                <p style={{ fontSize: 9, color: '#9CA3AF', fontFamily: 'ui-monospace, monospace', marginBottom: 5 }}>{move.tag}</p>
                
                <p style={{ fontSize: 11, color: '#4B5563', lineHeight: 1.4, marginBottom: 6 }}>{move.desc}</p>
                
                <div style={{ borderTop: '1px solid #E5E7EB', paddingTop: 6, marginBottom: 6 }}>
                  <p style={{ fontSize: 10, color: '#6B7280', fontStyle: 'italic' }}>Feels like: {move.feelsLike}</p>
                </div>
                
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3 }}>
                  {move.prompts.map((prompt, idx) => (
                    <span key={idx} style={{ fontSize: 9, color: '#2563EB', background: '#EFF6FF', padding: '2px 6px', borderRadius: 4, border: '1px solid #BFDBFE' }}>{prompt}</span>
                  ))}
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center">
          <Link
            to="/camera-moves"
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
          </Link>
        </div>
      </div>
    </section>
  );
}
