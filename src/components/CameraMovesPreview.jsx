import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Move3d, Video, Sparkles } from 'lucide-react';

const DUR = 3000;

function easeInOut(t) { return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t; }

function CameraIcon({ recRef, accent }) {
  return (
    <svg width="36" height="26" viewBox="0 0 36 26" fill="none" style={{ filter: `drop-shadow(0 0 6px ${accent}50)` }}>
      <rect x="0" y="3" width="26" height="18" rx="3" fill="#1E40AF" stroke={accent} strokeWidth="0.8" />
      <rect x="26" y="6" width="9" height="10" rx="2" fill="#1D4ED8" />
      <circle cx="13" cy="12" r="5" fill="#0C1445" stroke={accent} strokeWidth="1" />
      <circle cx="13" cy="12" r="2.5" fill="#1E3A8A" />
      <circle cx="13" cy="12" r="1" fill="#60A5FA" />
      <circle ref={recRef} cx="22" cy="6" r="1.2" fill="#EF4444" />
    </svg>
  );
}

function PersonIcon() {
  return (
    <svg width="36" height="66" viewBox="0 0 36 66" fill="none">
      <circle cx="18" cy="7" r="6" fill="#E08500" />
      <rect x="15" y="12" width="6" height="5" rx="1.5" fill="#E08500" />
      <path d="M4 17C4 14 12 13 18 13C24 13 32 14 32 17L29 38L7 38Z" fill="#E08500" />
      <path d="M7 37L5 58L12 58L14 37Z" fill="#C06A00" />
      <path d="M22 37L24 58L31 58L29 37Z" fill="#C06A00" />
    </svg>
  );
}

// Animated Card with Hover Animation
function AnimatedCameraCard({ move }) {
  const [isHovered, setIsHovered] = useState(false);
  const stageRef = useRef(null);
  
  // Animation refs
  const animRefs = {
    dollyCam: useRef(null), dollyRec: useRef(null),
    panCam: useRef(null), panRec: useRef(null),
    tiltCam: useRef(null), tiltBeam: useRef(null), tiltRec: useRef(null),
    zoomSub: useRef(null), zoomRec: useRef(null),
    trackSub: useRef(null), trackCam: useRef(null), trackRec: useRef(null),
    craneArm: useRef(null), craneCam: useRef(null), craneRec: useRef(null),
    handCam: useRef(null), handRec: useRef(null),
    steadyCam: useRef(null), steadyRec: useRef(null),
    orbitCam: useRef(null), orbitRec: useRef(null),
    droneRig: useRef(null), droneSub: useRef(null), droneRec: useRef(null),
  };

  const colors = {
    'Classic': { bg: '#EFF6FF', border: '#BFDBFE', text: '#2563EB', accent: '#3B82F6' },
    'Dynamic': { bg: '#FDF2F8', border: '#FBCFE8', text: '#BE185D', accent: '#FB7185' },
    'AI-Native': { bg: '#F5F3FF', border: '#DDD6FE', text: '#7C3AED', accent: '#8B5CF6' }
  };
  const style = colors[move.category];

  useEffect(() => {
    if (!isHovered) return;
    let runCount = 0, startTime = null, rafId = null;

    function tick(ts) {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / DUR, 1);
      const { current: refs } = { current: animRefs };
      
      // Dolly
      if (move.id === 'dolly' && refs.dollyCam.current) {
        const x = p < 0.44 ? 15 + easeInOut(p / 0.44) * 80 : p < 0.56 ? 95 : 95 - easeInOut((p - 0.56) / 0.44) * 80;
        refs.dollyCam.current.style.transform = `translateX(${x}px)`;
        if (refs.dollyRec.current) refs.dollyRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }
      
      // Pan
      if (move.id === 'pan' && refs.panCam.current) {
        const ang = p < 0.44 ? -30 + easeInOut(p / 0.44) * 60 : p < 0.56 ? 30 : 30 - easeInOut((p - 0.56) / 0.44) * 60;
        refs.panCam.current.setAttribute('transform', `translate(85,65) rotate(${ang})`);
        if (refs.panRec.current) refs.panRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }

      // Tilt
      if (move.id === 'tilt' && refs.tiltCam.current) {
        const ang = p < 0.44 ? 8 + easeInOut(p / 0.44) * (-36) : p < 0.56 ? -28 : -28 + easeInOut((p - 0.56) / 0.44) * 36;
        refs.tiltCam.current.setAttribute('transform', `translate(45,100) rotate(${ang})`);
        if (refs.tiltBeam.current) {
          const r = (ang * Math.PI) / 180;
          refs.tiltBeam.current.setAttribute('x2', 45 + 80 * Math.cos(r));
          refs.tiltBeam.current.setAttribute('y2', 100 + 80 * Math.sin(r));
        }
        if (refs.tiltRec.current) refs.tiltRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }

      // Zoom
      if (move.id === 'zoom' && refs.zoomSub.current) {
        const s = 1 + (p < 0.44 ? easeInOut(p / 0.44) : p < 0.56 ? 1 : 1 - easeInOut((p - 0.56) / 0.44)) * 0.7;
        refs.zoomSub.current.style.transform = `scale(${s})`;
        if (refs.zoomRec.current) refs.zoomRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }

      // Tracking
      if (move.id === 'tracking' && refs.trackSub.current && refs.trackCam.current) {
        const x = p < 0.44 ? easeInOut(p / 0.44) * 70 : p < 0.56 ? 70 : 70 - easeInOut((p - 0.56) / 0.44) * 70;
        refs.trackSub.current.style.transform = `translateX(${x}px)`;
        refs.trackCam.current.style.transform = `translateX(${x}px)`;
        if (refs.trackRec.current) refs.trackRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }

      // Crane
      if (move.id === 'crane' && refs.craneArm.current && refs.craneCam.current) {
        const ang = p < 0.44 ? 18 + easeInOut(p / 0.44) * (-70) : p < 0.56 ? -52 : -52 + easeInOut((p - 0.56) / 0.44) * 70;
        const r = (ang * Math.PI) / 180, ex = 42 + 60 * Math.cos(r), ey = 125 + 60 * Math.sin(r);
        refs.craneArm.current.setAttribute('x2', ex);
        refs.craneArm.current.setAttribute('y2', ey);
        refs.craneCam.current.setAttribute('transform', `translate(${ex},${ey}) rotate(${ang})`);
        if (refs.craneRec.current) refs.craneRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }

      // Handheld
      if (move.id === 'handheld' && refs.handCam.current) {
        refs.handCam.current.setAttribute('transform', `translate(${75 + Math.sin(ts / 400) * 2.5},${75 + Math.sin(ts / 550) * 1.5}) rotate(${Math.sin(ts / 500)})`);
        if (refs.handRec.current) refs.handRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 300));
      }

      // Steadicam
      if (move.id === 'steadicam' && refs.steadyCam.current) {
        refs.steadyCam.current.setAttribute('transform', `translate(90,${90 + Math.sin(ts / 500) * 5})`);
        if (refs.steadyRec.current) refs.steadyRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 300));
      }

      // Orbit
      if (move.id === 'orbit' && refs.orbitCam.current) {
        const t = p < 0.44 ? easeInOut(p / 0.44) : p < 0.56 ? 1 : 1 - easeInOut((p - 0.56) / 0.44);
        const th = Math.PI * 2 * t, x = 95 + 40 * Math.cos(th), y = 65 + 40 * Math.sin(th);
        refs.orbitCam.current.setAttribute('transform', `translate(${x},${y}) rotate(${Math.atan2(65 - y, 95 - x) * 180 / Math.PI})`);
        if (refs.orbitRec.current) refs.orbitRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 200));
      }

      // Drone
      if (move.id === 'drone' && refs.droneRig.current) {
        const y = p < 0.44 ? 90 - easeInOut(p / 0.44) * 40 : p < 0.56 ? 50 : 50 + easeInOut((p - 0.56) / 0.44) * 40;
        const s = 1 - (p < 0.44 ? easeInOut(p / 0.44) : p < 0.56 ? 1 : 1 - easeInOut((p - 0.56) / 0.44)) * 0.2;
        refs.droneRig.current.style.transform = `translateY(${y}px) scale(${s})`;
        if (refs.droneSub.current) refs.droneSub.current.style.transform = `scale(${0.65 + 0.35 * (p < 0.44 ? easeInOut(p / 0.44) : p < 0.56 ? 1 : 1 - easeInOut((p - 0.56) / 0.44))})`;
        if (refs.droneRec.current) refs.droneRec.current.style.opacity = String(0.5 + 0.5 * Math.sin(ts / 150));
      }

      if (p < 1) rafId = requestAnimationFrame(tick);
      else {
        runCount++;
        if (runCount < 2) { startTime = null; rafId = requestAnimationFrame(tick); }
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [isHovered, move.id, animRefs]);

  const renderAnim = () => {
    switch (move.id) {
      case 'dolly': return (
        <>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'linear-gradient(to bottom, transparent, rgba(8,15,24,0.9))' }} />
          <div style={{ position: 'absolute', bottom: 25, right: 20 }}><PersonIcon /></div>
          <div ref={animRefs.dollyCam} style={{ position: 'absolute', bottom: 28, left: 10, transition: 'none' }}><CameraIcon recRef={animRefs.dollyRec} accent={style.accent} /></div>
          <div style={{ position: 'absolute', bottom: 24, left: 10, right: 20, height: 1.5, background: `repeating-linear-gradient(90deg, ${style.accent} 0, ${style.accent} 5px, transparent 5px, transparent 10px)`, opacity: 0.2 }} />
        </>);
      case 'pan': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <path d="M85,65 L135,40 L135,90 Z" fill={style.accent} fillOpacity="0.06" />
          <g ref={animRefs.panCam} transform="translate(85,65) rotate(-30)"><rect x="-10" y="-6" width="20" height="12" rx="3" fill="#1E40AF" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="4" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="1.8" fill="#1E3A8A" /><circle ref={animRefs.panRec} cx="7" cy="-3" r="1.2" fill="#EF4444" /></g>
          <circle cx="135" cy="65" r="9" fill="#E08500" />
        </svg>);
      case 'tilt': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <line x1="32" y1="98" x2="24" y2="115" stroke="#334155" strokeWidth="2.5" />
          <line x1="32" y1="98" x2="40" y2="115" stroke="#334155" strokeWidth="2.5" />
          <line ref={animRefs.tiltBeam} x1="45" y1="100" x2="45" y2="40" stroke={style.accent} strokeOpacity="0.35" strokeWidth="1.5" strokeDasharray="3 3" />
          <g ref={animRefs.tiltCam} transform="translate(45,100)"><rect x="-8" y="-5" width="16" height="10" rx="2.5" fill="#1E40AF" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="3.5" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="1.5" fill="#1E3A8A" /><circle ref={animRefs.tiltRec} cx="5" cy="-2.5" r="1.2" fill="#EF4444" /></g>
          <circle cx="108" cy="42" r="8" fill="#E08500" />
        </svg>);
      case 'zoom': return (
        <>
          <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 30, background: 'linear-gradient(to bottom, transparent, rgba(8,15,24,0.9))' }} />
          <div style={{ position: 'absolute', bottom: 25, left: 15 }}><CameraIcon recRef={animRefs.zoomRec} accent={style.accent} /></div>
          <div ref={animRefs.zoomSub} style={{ position: 'absolute', bottom: 25, right: 18, transition: 'none', transformOrigin: 'bottom center' }}><PersonIcon /></div>
        </>);
      case 'tracking': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <line x1="8" y1="48" x2="165" y2="48" stroke="#E08500" strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
          <line x1="8" y1="82" x2="165" y2="82" stroke={style.accent} strokeOpacity="0.2" strokeWidth="1.5" strokeDasharray="4 4" />
          <g ref={animRefs.trackSub}><circle cx="22" cy="48" r="8" fill="#E08500" /><rect x="11" y="56" width="22" height="6" rx="3" fill="#C06A00" /></g>
          <g ref={animRefs.trackCam}><rect x="10" y="74" width="24" height="15" rx="3" fill="#1E40AF" stroke={style.accent} strokeWidth="0.8" /><circle cx="18" cy="81.5" r="4" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle ref={animRefs.trackRec} cx="30" cy="77" r="1.2" fill="#EF4444" /></g>
        </svg>);
      case 'crane': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <polygon points="38,108 52,108 45,92" fill="#1E293B" />
          <line ref={animRefs.craneArm} x1="45" y1="92" x2="45" y2="58" stroke="#475569" strokeWidth="3.5" strokeLinecap="round" />
          <g ref={animRefs.craneCam}><rect x="-8" y="-5" width="16" height="10" rx="2.5" fill="#1E40AF" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="3.5" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="1.5" fill="#1E3A8A" /><circle ref={animRefs.craneRec} cx="5" cy="-2.5" r="1.2" fill="#EF4444" /></g>
          <circle cx="105" cy="95" r="8" fill="#E08500" />
        </svg>);
      case 'handheld': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <g ref={animRefs.handCam}><rect x="-9" y="-6" width="18" height="12" rx="2.5" fill="#1E40AF" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="3.5" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="1.5" fill="#1E3A8A" /><circle ref={animRefs.handRec} cx="6" cy="-3" r="1.2" fill="#EF4444" /></g>
          <circle cx="135" cy="60" r="9" fill="#E08500" opacity="0.7" />
        </svg>);
      case 'steadicam': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <line x1="55" y1="102" x2="85" y2="58" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="115" y1="102" x2="85" y2="58" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <circle cx="85" cy="62" r="10" fill="#E08500" />
          <g ref={animRefs.steadyCam}><rect x="-10" y="-6" width="20" height="12" rx="2.5" fill="#FDF2F8" stroke={style.accent} strokeWidth="0.8" /><rect x="-8" y="-4" width="16" height="8" rx="2" fill="#1E40AF" /><circle cx="0" cy="0" r="3" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle ref={animRefs.steadyRec} cx="6" cy="-2.5" r="1.2" fill="#EF4444" /></g>
        </svg>);
      case 'orbit': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <circle cx="90" cy="60" r="40" fill="none" stroke={style.accent} strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="4 4" />
          <circle cx="90" cy="60" r="10" fill="#E08500" />
          <g ref={animRefs.orbitCam} transform="translate(130,60)"><rect x="-9" y="-5" width="18" height="10" rx="2.5" fill="#1E40AF" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="3.5" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle cx="0" cy="0" r="1.5" fill="#1E3A8A" /><circle ref={animRefs.orbitRec} cx="6" cy="-2.5" r="1.2" fill="#EF4444" /></g>
        </svg>);
      case 'drone': return (
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} viewBox="0 0 180 120">
          <line x1="42" y1="102" x2="72" y2="62" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <line x1="138" y1="102" x2="108" y2="62" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
          <g ref={animRefs.droneSub}><ellipse cx="90" cy="98" rx="18" ry="5" fill="#E08500" opacity="0.35" /><circle cx="90" cy="94" r="10" fill="#E08500" /></g>
          <g ref={animRefs.droneRig}><line x1="70" y1="62" x2="110" y2="62" stroke={style.accent} strokeWidth="2.5" strokeLinecap="round" /><line x1="80" y1="53" x2="100" y2="71" stroke={style.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /><line x1="100" y1="53" x2="80" y2="71" stroke={style.accent} strokeWidth="1.5" strokeLinecap="round" opacity="0.5" /><rect x="82" y="57" width="14" height="10" rx="2" fill="#1E40AF" /><circle cx="90" cy="62" r="3.5" fill="#0C1445" stroke={style.accent} strokeWidth="0.8" /><circle ref={animRefs.droneRec} cx="96" cy="59" r="1.2" fill="#EF4444" /></g>
        </svg>);
      default: return null;
    }
  };

  return (
    <div className="group p-4 rounded-2xl transition-all hover:-translate-y-1" style={{ background: 'var(--bg-card)', boxShadow: 'var(--shadow-card)', border: '1px solid var(--border-color)' }}>
      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold mb-2" style={{ background: style.bg, border: `1px solid ${style.border}`, color: style.text }}>
        {move.category === 'Classic' && <Move3d className="h-3 w-3" />}
        {move.category === 'Dynamic' && <Video className="h-3 w-3" />}
        {move.category === 'AI-Native' && <Sparkles className="h-3 w-3" />}
        {move.category.toUpperCase()}
      </div>
      <h3 className="text-base font-bold mb-0.5" style={{ color: 'var(--text-primary)' }}>{move.name}</h3>
      <p className="text-xs font-mono mb-2" style={{ color: 'var(--text-muted)' }}>{move.tag}</p>
      
      <div ref={stageRef} onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)} className="relative h-32 rounded-xl mb-2 overflow-hidden cursor-pointer" style={{ background: '#080F18', border: `1.5px solid ${style.border}` }}>
        <span className="absolute top-1.5 right-1.5 text-[10px] font-mono z-10" style={{ color: 'rgba(75,106,138,0.5)' }}>{move.id === 'tracking' ? 'TOP-DOWN' : 'SIDE'}</span>
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none transition-opacity duration-300" style={{ background: 'rgba(8,15,24,0.45)', opacity: isHovered ? 0 : 1 }}>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold" style={{ background: style.text, color: '#fff' }}>
            <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '3px 0 3px 5px', borderColor: 'transparent transparent transparent #fff' }} />
            HOVER
          </div>
        </div>
        {renderAnim()}
      </div>
      
      <p className="text-xs mb-1.5 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{move.desc}</p>
      <div className="p-2 rounded-lg text-xs" style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)' }}>
        <span style={{ color: 'var(--text-muted)' }}>Feels: </span>
        <span style={{ color: 'var(--text-primary)' }}>{move.feel}</span>
      </div>
    </div>
  );
}

const FEATURED_MOVES = [
  { id: 'dolly', name: 'Dolly', tag: 'Push In / Pull Back', category: 'Classic', desc: 'Camera moves on track. Unlike zoom, perspective shifts.', feel: 'Walking into the scene.' },
  { id: 'pan', name: 'Pan', tag: 'Rotate Left / Right', category: 'Classic', desc: 'Camera rotates on fixed axis.', feel: 'Turning head to follow.' },
  { id: 'tilt', name: 'Tilt', tag: 'Pivot Up / Down', category: 'Classic', desc: 'Camera pivots vertically.', feel: 'Looking up at skyscraper.' },
  { id: 'zoom', name: 'Zoom', tag: 'Lens In / Out', category: 'Classic', desc: 'Lens changes focal length.', feel: 'Looking through binoculars.' },
  { id: 'handheld', name: 'Handheld', tag: 'Natural', category: 'Dynamic', desc: 'Organic drift from breathing.', feel: 'Immediate and intimate.' },
  { id: 'steadicam', name: 'Steadicam', tag: 'Smooth Follow', category: 'Dynamic', desc: 'Stabilized rig glides behind.', feel: 'Floating behind action.' },
  { id: 'orbit', name: 'Orbit', tag: '360° Around', category: 'AI-Native', desc: 'Circles subject, keeping centered.', feel: 'World rotates around character.' },
  { id: 'drone', name: 'Drone', tag: 'Rise + Reveal', category: 'AI-Native', desc: 'Rises and pulls away.', feel: 'Expansion and grandeur.' },
];

export default function CameraMovesPreview() {
  return (
    <section className="py-14 transition-colors relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #FEF3C7 0%, var(--bg-secondary) 50%, #DBEAFE 100%)' }}>
      {/* Decorative elements */}
      <div className="absolute -top-10 -left-10 w-64 h-64 bg-amber-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="absolute -bottom-10 -right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold tracking-wider mb-3" style={{ background: 'var(--accent-purple)15', border: '1px solid var(--accent-purple)30', color: 'var(--accent-purple)' }}>
            <Move3d className="h-3.5 w-3.5" />
            CAMERA MOVES
          </div>
          <h2 className="text-3xl lg:text-4xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Master the Move.</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--text-secondary)' }}>Classic + dynamic + AI-native motion. Hover to animate.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {FEATURED_MOVES.map((move) => <AnimatedCameraCard key={move.id} move={move} />)}
        </div>

        <div className="text-center">
          <Link to="/camera-moves" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all hover:-translate-y-0.5" style={{ background: 'linear-gradient(145deg, #8B5CF6, #7C3AED)', color: '#fff', boxShadow: '6px 6px 12px rgba(124,58,237,0.3), -6px -6px 12px rgba(255,255,255,0.1), inset 0 1px 0 rgba(255,255,255,0.2)', border: '1px solid rgba(255,255,255,0.1)' }}>
            See All 16 Camera Moves
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}
