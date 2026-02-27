import React, { useRef, useCallback } from 'react';
import { ArrowRight, Move3d } from 'lucide-react';

const easeInOut = (t) => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

const CARD_DATA = [
  {
    id: 'dolly', name: 'Dolly', tag: 'push in / pull back', badge: 'CLASSIC MOVE',
    badgeColor: '#2563EB', badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE',
    stageColor: '#2563EB', viewLabel: 'SIDE VIEW',
    desc: 'The camera physically moves forward or backward on a track. Unlike zoom, perspective genuinely shifts.',
    feelText: 'Walking into the scene. Builds intimacy, tension, or a slow reveal.',
    prompts: ['slow dolly in toward subject', 'camera pushes forward on a track', 'cinematic push into close-up'],
    type: 'side'
  },
  {
    id: 'pan', name: 'Pan', tag: 'rotate left / right', badge: 'CLASSIC MOVE',
    badgeColor: '#2563EB', badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE',
    stageColor: '#2563EB', viewLabel: 'TOP-DOWN VIEW',
    desc: 'The camera rotates left or right on a fixed axis — staying in place while the direction changes.',
    feelText: 'Turning your head to follow action. Great for reveals and wide shots.',
    prompts: ['slow pan left to right', 'camera rotates on fixed axis', 'wide establishing pan across the scene'],
    type: 'top'
  },
  {
    id: 'tilt', name: 'Tilt', tag: 'pivot up / down', badge: 'CLASSIC MOVE',
    badgeColor: '#2563EB', badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE',
    stageColor: '#2563EB', viewLabel: 'SIDE VIEW',
    desc: 'The camera pivots up or down on a fixed tripod — staying in place while the lens tilts vertically.',
    feelText: 'Looking up at a skyscraper, or slowly revealing a character from shoes to eyes.',
    prompts: ['slow tilt up from feet to face', 'camera pivots upward on fixed tripod', 'low-to-high vertical reveal'],
    type: 'tilt'
  },
  {
    id: 'tracking', name: 'Tracking', tag: 'follow sideways', badge: 'CLASSIC MOVE',
    badgeColor: '#2563EB', badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE',
    stageColor: '#2563EB', viewLabel: 'TOP-DOWN VIEW',
    desc: 'Camera and subject move together sideways at the same speed, keeping the subject perfectly framed.',
    feelText: 'Running alongside someone. Keeps energy and the subject always centred in frame.',
    prompts: ['tracking shot following subject', 'camera moves parallel sideways', 'side-on tracking as character walks'],
    type: 'tracking'
  },
  {
    id: 'truck', name: 'Truck', tag: 'side push / pull', badge: 'CLASSIC MOVE',
    badgeColor: '#2563EB', badgeBg: '#EFF6FF', badgeBorder: '#BFDBFE',
    stageColor: '#2563EB', viewLabel: 'TOP-DOWN VIEW',
    desc: 'The camera moves laterally left or right on a track — perpendicular to where it points.',
    feelText: 'Sliding past the action. Reveals layers of the scene with smooth lateral motion.',
    prompts: ['truck left along scene', 'camera tracks sideways perpendicular', 'lateral push revealing landscape'],
    type: 'truck'
  },
  {
    id: 'handheld', name: 'Handheld', tag: 'smooth / natural', badge: 'DYNAMIC / CINEMATIC',
    badgeColor: '#BE185D', badgeBg: '#FDF2F8', badgeBorder: '#FBCFE8',
    stageColor: '#BE185D', viewLabel: 'SIDE VIEW',
    desc: 'A handheld camera has subtle, organic drift from breathing, footsteps, and micro-corrections.',
    feelText: 'Present and personal. Adds realism, tension, and immediacy.',
    prompts: ['handheld camera', 'smooth natural micro-drift', 'human-operated', 'subtle breathing sway'],
    type: 'handheld'
  },
  {
    id: 'drone', name: 'FPV Drone', tag: 'rise up + reveal', badge: 'AI-NATIVE MOVE',
    badgeColor: '#6D28D9', badgeBg: '#F5F3FF', badgeBorder: '#DDD6FE',
    stageColor: '#6D28D9', viewLabel: 'AERIAL LIFT',
    desc: 'The camera rises and pulls away, revealing context and scale. In AI video, the drone can fly impossible paths.',
    feelText: 'Expansion and grandeur. A reveal that opens the world.',
    prompts: ['drone aerial', 'rise up and pull back', 'overhead reveal', 'wide establishing scale'],
    type: 'drone'
  },
  {
    id: 'orbit', name: 'AI Orbit', tag: 'circles subject', badge: 'AI-NATIVE MOVE',
    badgeColor: '#6D28D9', badgeBg: '#F5F3FF', badgeBorder: '#DDD6FE',
    stageColor: '#6D28D9', viewLabel: 'TOP-DOWN VIEW',
    desc: 'The camera circles the subject while always keeping them centered. Great for hero moments.',
    feelText: 'The world rotates around the character. Bold, stylized, and high-impact.',
    prompts: ['360 orbit around subject', 'camera circles', 'keeps subject centered', 'smooth cinematic rotation'],
    type: 'orbit'
  }
];

function CameraMoveCard({ data }) {
  const animRef = useRef(null);
  const startTimeRef = useRef(null);
  const runCountRef = useRef(0);
  const isRunningRef = useRef(false);
  const camRef = useRef(null);
  const subjRef = useRef(null);
  const recRef = useRef(null);
  const labelRef = useRef(null);
  const [showHint, setShowHint] = React.useState(true);

  const RUNS = 2;
  const DUR = 3400;

  const tick = (ts) => {
    if (!startTimeRef.current) startTimeRef.current = ts;
    const p = Math.min((ts - startTimeRef.current) / DUR, 1);
    
    const cam = camRef.current;
    const subj = subjRef.current;
    const rec = recRef.current;
    const label = labelRef.current;

    if (data.type === 'side' && cam) {
      const SX = 12, EX = 136;
      let x = p < 0.44 ? SX + easeInOut(p/0.44)*(EX-SX) : p < 0.56 ? EX : EX - easeInOut((p-0.56)/0.44)*(EX-SX);
      cam.style.left = x + 'px';
      if (label) { label.textContent = p < 0.44 ? 'MOVING CLOSER' : p < 0.56 ? 'HOLDING' : 'PULLING BACK'; label.style.opacity = p < 0.44 ? Math.min(p/0.1,0.85) : p < 0.56 ? 0.5 : Math.min((1-p)/0.1,0.85); }
      if (rec) rec.style.opacity = (p < 0.44 || p > 0.56) ? String(0.35 + 0.65 * Math.abs(Math.sin(ts/360))) : '1';
    }
    
    if (data.type === 'top' && cam) {
      const CX = 80, CY = 110;
      let angle = p < 0.44 ? -35 + easeInOut(p/0.44)*70 : p < 0.56 ? 35 : 35 - easeInOut((p-0.56)/0.44)*70;
      cam.style.transform = 'translate(' + CX + 'px, ' + CY + 'px) rotate(' + angle + 'deg)';
      if (label) { label.textContent = p < 0.44 ? 'PANNING RIGHT' : p < 0.56 ? 'HOLDING' : 'PANNING LEFT'; label.style.opacity = p < 0.44 ? Math.min(p/0.1,0.85) : p < 0.56 ? 0.5 : Math.min((1-p)/0.1,0.85); }
      if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts/360)));
    }

    if (data.type === 'tilt' && cam) {
      const CX = 52, CY = 148;
      let angle = p < 0.44 ? 10 + easeInOut(p/0.44)*(-42) : p < 0.56 ? -32 : -32 + easeInOut((p-0.56)/0.44)*42;
      cam.style.transform = 'translate(' + CX + 'px, ' + CY + 'px) rotate(' + angle + 'deg)';
      if (label) { label.textContent = p < 0.44 ? 'TILTING UP' : p < 0.56 ? 'HOLDING' : 'TILTING DOWN'; label.style.opacity = p < 0.44 ? Math.min(p/0.1,0.85) : p < 0.56 ? 0.5 : Math.min((1-p)/0.1,0.85); }
      if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts/360)));
    }

    if (data.type === 'tracking' && cam && subj) {
      const SX = 6, EX = 200;
      let x = p < 0.44 ? SX + easeInOut(p/0.44)*(EX-SX) : p < 0.56 ? EX : EX - easeInOut((p-0.56)/0.44)*(EX-SX);
      cam.style.left = x + 'px'; subj.style.left = x + 'px';
      if (label) { label.textContent = p < 0.44 ? 'TRACKING RIGHT' : p < 0.56 ? 'HOLDING' : 'TRACKING LEFT'; label.style.opacity = p < 0.44 ? Math.min(p/0.1,0.85) : p < 0.56 ? 0.5 : Math.min((1-p)/0.1,0.85); }
      if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts/360)));
    }

    if (data.type === 'truck' && cam) {
      const SX = 8, EX = 160;
      let x = p < 0.44 ? SX + easeInOut(p/0.44)*(EX-SX) : p < 0.56 ? EX : EX - easeInOut((p-0.56)/0.44)*(EX-SX);
      cam.style.left = x + 'px';
      if (label) { label.textContent = p < 0.44 ? 'TRUCKING RIGHT' : p < 0.56 ? 'HOLDING' : 'TRUCKING LEFT'; label.style.opacity = p < 0.44 ? Math.min(p/0.1,0.85) : p < 0.56 ? 0.5 : Math.min((1-p)/0.1,0.85); }
      if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts/360)));
    }

    if (data.type === 'handheld' && cam) {
      const t = ts / 1000;
      const dx = Math.sin(t * 2.3) * 3 + Math.sin(t * 4.7) * 1.5 + Math.sin(t * 1.1) * 2;
      const dy = Math.cos(t * 1.8) * 2.5 + Math.cos(t * 3.5) * 1 + Math.sin(t * 2.9) * 1.5;
      const rot = Math.sin(t * 1.5) * 0.8 + Math.cos(t * 2.8) * 0.4;
      cam.style.transform = 'translate(' + dx + 'px, ' + dy + 'px) rotate(' + rot + 'deg)';
      if (label) { label.textContent = 'HANDHELD DRIFT'; label.style.opacity = 0.7 + Math.sin(t * 3) * 0.2; }
      if (rec) rec.style.opacity = String(0.5 + 0.5 * Math.abs(Math.sin(ts/200)));
    }

    if (data.type === 'drone' && cam && subj) {
      const t = p < 0.44 ? easeInOut(p/0.44) : p < 0.56 ? 1 : 1 - easeInOut((p-0.56)/0.44);
      const x = 68 + (28 - 68) * t, b = 92 + (162 - 92) * t, s = 1 - 0.46 * t;
      cam.style.left = x + 'px'; cam.style.bottom = b + 'px'; cam.style.transform = 'scale(' + s + ')';
      const subScale = 1 - 0.42 * t;
      subj.style.transform = 'scale(' + subScale + ')'; subj.style.opacity = String(0.98 - 0.10 * t);
      if (label) { label.textContent = p < 0.44 ? 'RISING + PULLING BACK' : p < 0.56 ? 'WIDE REVEAL' : 'DROPPING IN'; label.style.opacity = p < 0.44 ? Math.min(p/0.12,0.85) : p < 0.56 ? 0.55 : Math.min((1-p)/0.12,0.85); }
      if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts/220)));
    }

    if (data.type === 'orbit' && cam) {
      const t = p < 0.44 ? easeInOut(p/0.44) : p < 0.56 ? 1 : 1 - easeInOut((p-0.56)/0.44);
      const theta = Math.PI * 2 * t;
      const CX = 178, CY = 110, R = 74;
      const camX = CX + R * Math.cos(theta), camY = CY + R * Math.sin(theta);
      const aim = Math.atan2(CY - camY, CX - camX) * 180 / Math.PI;
      cam.style.transform = 'translate(' + camX + 'px, ' + camY + 'px) rotate(' + aim + 'deg)';
      if (label) { label.textContent = p < 0.44 ? 'ORBITING' : p < 0.56 ? 'HOLDING' : 'RETURNING'; label.style.opacity = p < 0.44 ? Math.min(p/0.12,0.85) : p < 0.56 ? 0.55 : Math.min((1-p)/0.12,0.85); }
      if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts/360)));
    }

    if (p < 1) { animRef.current = requestAnimationFrame(tick); }
    else {
      runCountRef.current++; startTimeRef.current = null;
      if (runCountRef.current < RUNS) { animRef.current = requestAnimationFrame(tick); }
      else {
        isRunningRef.current = false; setShowHint(true);
        if (cam) { cam.style.transform = ''; cam.style.left = ''; cam.style.bottom = ''; }
        if (subj) { subj.style.transform = ''; subj.style.left = ''; subj.style.opacity = ''; }
        if (rec) rec.style.opacity = '1'; if (label) label.style.opacity = '0';
      }
    }
  };

  const start = () => { if (isRunningRef.current) return; isRunningRef.current = true; setShowHint(false); runCountRef.current = 0; startTimeRef.current = null; animRef.current = requestAnimationFrame(tick); };
  const stop = () => { if (animRef.current) cancelAnimationFrame(animRef.current); isRunningRef.current = false; setShowHint(true); if (camRef.current) { camRef.current.style.transform = ''; camRef.current.style.left = ''; camRef.current.style.bottom = ''; } if (subjRef.current) { subjRef.current.style.transform = ''; subjRef.current.style.left = ''; subjRef.current.style.opacity = ''; } if (recRef.current) recRef.current.style.opacity = '1'; if (labelRef.current) labelRef.current.style.opacity = '0'; };
  React.useEffect(() => () => stop(), []);

  const isSideView = data.type === 'side' || data.type === 'tilt' || data.type === 'handheld' || data.type === 'drone';
  const strokeColor = data.stageColor === '#6D28D9' ? '#A78BFA' : data.stageColor === '#BE185D' ? '#F472B6' : '#3B82F6';
  const labelColor = data.stageColor === '#6D28D9' ? '#8B5CF6' : data.stageColor === '#BE185D' ? '#F472B6' : '#3B82F6';

  return (
    <div className="camera-move-card" onMouseEnter={start} onMouseLeave={stop} style={{ background: 'linear-gradient(180deg, #ffffff 0%, #fafaf9 100%)', border: '1.5px solid #E2DDD6', borderRadius: '22px', overflow: 'hidden', boxShadow: '0 4px 32px rgba(0,0,0,0.07)', transition: 'transform 0.3s ease, box-shadow 0.3s ease' }}>
      <div style={{ padding: '16px 22px 0' }}>
        <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.1em', color: data.badgeColor, background: data.badgeBg, border: '1px solid ' + data.badgeBorder, padding: '3px 10px', borderRadius: '99px', display: 'inline-block' }}>{data.badge}</span>
      </div>
      <div style={{ padding: '8px 22px 2px', display: 'flex', alignItems: 'baseline', justifyContent: 'space-between' }}>
        <span style={{ fontSize: '24px', fontWeight: 700, color: '#111827', letterSpacing: '-0.03em' }}>{data.name}</span>
        <span style={{ fontSize: '11px', color: '#9CA3AF', fontFamily: 'DM Mono, monospace' }}>{data.tag}</span>
      </div>
      <div style={{ margin: '12px 22px', background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)', borderRadius: '16px', height: '220px', position: 'relative', overflow: 'hidden', border: '1.5px solid ' + data.stageColor + '55', boxShadow: '0 0 0 3px ' + data.stageColor + '14', cursor: 'pointer' }}>
        <span style={{ position: 'absolute', top: '11px', right: '14px', fontSize: '9px', fontFamily: 'DM Mono, monospace', color: '#4B6A8A', letterSpacing: '0.1em', zIndex: 2 }}>{data.viewLabel}</span>
        {showHint && (
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 6, background: 'rgba(15,23,42,0.45)', backdropFilter: 'blur(2px)', borderRadius: '15px', pointerEvents: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '9px', background: data.stageColor, color: '#fff', fontSize: '11px', fontWeight: 700, fontFamily: 'DM Mono, monospace', letterSpacing: '0.09em', padding: '9px 20px', borderRadius: '99px', boxShadow: '0 0 0 5px ' + data.stageColor + '25, 0 4px 18px ' + data.stageColor + '60' }}>
              <div style={{ width: 0, height: 0, borderStyle: 'solid', borderWidth: '5px 0 5px 9px', borderColor: 'transparent transparent transparent #fff' }} />
              HOVER TO PLAY
            </div>
          </div>
        )}
        {isSideView && (<><div style={{ position: 'absolute', bottom: '48px', left: 0, right: 0, height: '1px', background: 'linear-gradient(90deg, transparent, #ffffff08 20%, #ffffff12 50%, #ffffff08 80%, transparent)' }} /><div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '48px', background: 'linear-gradient(to bottom, transparent, rgba(15,23,42,0.9))' }} /></>)}
        {data.type !== 'orbit' && (
          <div ref={subjRef} style={{ position: 'absolute', bottom: data.type === 'tracking' || data.type === 'truck' ? 'auto' : '48px', right: data.type === 'tracking' || data.type === 'truck' ? 'auto' : '38px', left: data.type === 'tracking' || data.type === 'truck' ? '6px' : 'auto', top: data.type === 'tracking' || data.type === 'truck' ? '50%' : 'auto', transform: data.type === 'tracking' || data.type === 'truck' ? 'translateY(-50%)' : 'none', zIndex: 2, transformOrigin: 'center center' }}>
            {data.type === 'tracking' || data.type === 'truck' ? (
              <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-label="Subject" title="Subject"><rect x="0" y="26" width="80" height="20" rx="10" fill="#C06A00"/><circle cx="40" cy="22" r="20" fill="#E08500"/><circle cx="40" cy="13" r="8" fill="#C06A00" opacity="0.35"/></svg>
            ) : (
              <svg width="56" height="142" viewBox="0 0 56 142" fill="none" aria-label="Subject" title="Subject"><circle cx="28" cy="12" r="11" fill="#E08500"/><rect x="23" y="22" width="10" height="8" rx="3" fill="#E08500"/><path d="M7 30C7 27 17 25 28 25C39 25 49 27 49 30L45 66L11 66Z" fill="#E08500"/><path d="M9 32L3 72L11 73L15 34Z" fill="#C06A00"/><circle cx="6" cy="75" r="5" fill="#C06A00"/><path d="M47 32L53 72L45 73L41 34Z" fill="#C06A00"/><circle cx="50" cy="75" r="5" fill="#C06A00"/><path d="M11 64L45 64L42 78L14 78Z" fill="#C06A00"/><path d="M14 76L12 124L22 124L24 76Z" fill="#E08500"/><path d="M11 122L23 122L24 132L9 132Z" fill="#C06A00"/><path d="M32 76L34 124L44 124L42 76Z" fill="#E08500"/><path d="M32 122L44 122L46 132L31 132Z" fill="#C06A00"/></svg>
            )}
          </div>
        )}
        {data.type !== 'orbit' && data.type !== 'handheld' && (<div style={{ position: 'absolute', bottom: '45px', right: '28px', width: '76px', height: '9px', background: 'radial-gradient(ellipse, #E0850014 0%, transparent 70%)', borderRadius: '50%', zIndex: 1 }} />)}
        <div ref={camRef} style={{ position: 'absolute', bottom: data.type === 'drone' ? '92px' : '52px', left: data.type === 'side' ? '12px' : data.type === 'tracking' ? '14px' : data.type === 'truck' ? '8px' : data.type === 'drone' ? '68px' : data.type === 'handheld' ? '48px' : data.type === 'tilt' ? '52px' : '80px', top: data.type === 'top' || data.type === 'orbit' || data.type === 'truck' || data.type === 'tracking' ? '50%' : 'auto', transform: data.type === 'top' || data.type === 'orbit' || data.type === 'truck' || data.type === 'tracking' ? 'translateY(-50%)' : 'none', zIndex: 3, transformOrigin: 'center center' }}>
          {data.type === 'drone' ? (
            <svg width="72" height="44" viewBox="0 0 72 44" fill="none" aria-label="FPV Drone" title="FPV Drone"><line x1="12" y1="22" x2="60" y2="22" stroke="#A78BFA" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round"/><line x1="22" y1="10" x2="50" y2="34" stroke="#A78BFA" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round"/><line x1="50" y1="10" x2="22" y2="34" stroke="#A78BFA" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round"/><rect x="28" y="16" width="16" height="12" rx="4" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.9"/><circle cx="36" cy="22" r="4.5" fill="#0C1445" stroke="#A78BFA" strokeWidth="0.9"/><circle cx="36" cy="22" r="1.8" fill="#60A5FA"/><circle cx="12" cy="22" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/><circle cx="60" cy="22" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/><circle cx="22" cy="10" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/><circle cx="50" cy="34" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/><circle ref={recRef} cx="44" cy="18" r="2" fill="#EF4444"/></svg>
          ) : data.type === 'top' || data.type === 'tracking' || data.type === 'truck' ? (
            <svg width="38" height="28" viewBox="0 0 38 28" fill="none" aria-label="Camera" title="Camera"><rect x="0" y="4" width="28" height="20" rx="3" fill="#1E40AF" stroke={strokeColor} strokeWidth="0.75"/><rect x="28" y="8" width="9" height="10" rx="2" fill="#1D4ED8"/><circle cx="14" cy="14" r="6" fill="#0C1445" stroke={strokeColor} strokeWidth="1"/><circle cx="14" cy="14" r="3.5" fill="#1E3A8A"/><circle cx="14" cy="14" r="1.4" fill="#60A5FA"/><circle ref={recRef} cx="25" cy="6" r="1.8" fill="#EF4444"/></svg>
          ) : (
            <svg width="46" height="32" viewBox="0 0 46 32" fill="none" aria-label="Camera" title="Camera"><rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke={strokeColor} strokeWidth="0.75"/><rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke={strokeColor} strokeWidth="0.5"/><circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke={strokeColor} strokeWidth="1.2"/><circle cx="16" cy="17" r="4.5" fill="#1E3A8A"/><circle cx="16" cy="17" r="2" fill="#60A5FA"/><circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6"/><rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke={strokeColor} strokeWidth="0.5"/><circle ref={recRef} cx="27" cy="10" r="2" fill="#EF4444"/></svg>
          )}
        </div>
        <div ref={labelRef} style={{ position: 'absolute', bottom: '26px', left: '14px', fontSize: '9px', fontFamily: 'DM Mono, monospace', color: labelColor, letterSpacing: '0.07em', zIndex: 3, opacity: 0, transition: 'opacity 0.1s' }} />
      </div>
      <p style={{ padding: '8px 22px 10px', fontSize: '13px', color: '#4B5563', lineHeight: 1.65 }}>{data.desc}</p>
      <div style={{ margin: '2px 22px 12px', background: '#FAFAF8', border: '1px solid #F0EDE6', borderRadius: '10px', padding: '10px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
        <span style={{ fontSize: '15px', flexShrink: 0, marginTop: '1px' }}>🎬</span>
        <span style={{ fontSize: '12px', color: '#6B7280', lineHeight: 1.55 }}><strong style={{ color: '#374151', fontWeight: 600 }}>Feels like:</strong> {data.feelText}</span>
      </div>
      <div style={{ margin: '0 22px 20px' }}>
        <div style={{ fontSize: '10px', fontWeight: 700, color: '#9CA3AF', letterSpacing: '0.08em', marginBottom: '7px' }}>ADD TO YOUR PROMPT</div>
        <div style={{ background: data.badgeBg, border: '1px solid ' + data.badgeBorder, borderRadius: '10px', padding: '10px 14px', fontFamily: 'DM Mono, monospace', fontSize: '11px', color: data.badgeColor === '#2563EB' ? '#78350F' : data.badgeColor === '#6D28D9' ? '#4C1D95' : '#9D174D', lineHeight: 1.75 }}>
          {data.prompts.map((p, i) => (<span key={i}><span style={{ color: data.badgeColor === '#2563EB' ? '#D97706' : data.badgeColor, fontWeight: 500 }}>{p}</span>{i < data.prompts.length - 1 ? ', ' : ''}</span>))}
        </div>
      </div>
    </div>
  );
}

export default function CameraMoveCards() {
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          {CARD_DATA.map((card) => (<CameraMoveCard key={card.id} data={card} />))}
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
