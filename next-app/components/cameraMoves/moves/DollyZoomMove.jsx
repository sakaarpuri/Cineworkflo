import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Dolly Zoom (Vertigo) - dolly back while zooming in
 * Ported from modern.html
 */
export function DollyZoomMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const topLRef = useRef(null);
  const botLRef = useRef(null);
  const worldRef = useRef(null);
  const subjRef = useRef(null);
  const noteRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const SX = 54;
  const EX = 8;
  const CAM_X = 78;
  const SUB_X = 262;
  const CY = 110;

  const setVertigo = useCallback((t) => {
    const cam = camRef.current;
    const topL = topLRef.current;
    const botL = botLRef.current;
    const world = worldRef.current;
    const subj = subjRef.current;
    const note = noteRef.current;

    if (!cam || !topL || !botL || !world || !subj || !note) return;

    const x = SX + (EX - SX) * t;
    cam.style.left = x + 'px';

    const fovHalf = 92 - t * 76;
    const camX = (CAM_X - (SX - x));
    topL.setAttribute('x1', camX);
    topL.setAttribute('y1', CY);
    topL.setAttribute('x2', SUB_X);
    topL.setAttribute('y2', CY - fovHalf);
    botL.setAttribute('x1', camX);
    botL.setAttribute('y1', CY);
    botL.setAttribute('x2', SUB_X);
    botL.setAttribute('y2', CY + fovHalf);

    const sx = 1 + t * 0.45;
    const tx = (0.5 - t) * 18;
    world.style.transform = `translateX(${tx}px) scaleX(${sx})`;

    const drift = 10 * t;
    const scale = 1 + 0.10 * t;
    subj.style.transform = `translateX(${drift}px) scale(${scale})`;

    note.setAttribute('fill-opacity', t > 0.25 ? String(Math.min((t - 0.25) / 0.2, 0.75)) : '0');
  }, []);

  const animateFn = useCallback((p, ts) => {
    let t;
    if (p < 0.44) t = easeInOut(p / 0.44);
    else if (p < 0.56) t = 1;
    else t = 1 - easeInOut((p - 0.56) / 0.44);

    setVertigo(t);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      label.textContent = p < 0.44 ? 'DOLLY OUT + ZOOM IN' : p < 0.56 ? '— VERTIGO HOLD —' : 'DOLLY IN + ZOOM OUT';
      label.style.opacity = p < 0.44
        ? String(Math.min(p / 0.12, 0.85))
        : p < 0.56
          ? '0.55'
          : String(Math.min((1 - p) / 0.12, 0.85));
    }

    if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 260)));
  }, [setVertigo]);

  const resetFn = useCallback(() => {
    setVertigo(0);
    const label = labelRef.current;
    const rec = recRef.current;
    const note = noteRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
    if (note) note.setAttribute('fill-opacity', '0');
  }, [setVertigo]);

  const { start, stop } = useCameraAnimation({
    stageRef,
    hintRef,
    animateFn,
    resetFn,
    runs: 2,
    duration: 3400
  });

  React.useEffect(() => {
    if (isHovered) start();
    else stop();
  }, [isHovered, start, stop]);

  React.useEffect(() => {
    resetFn();
  }, [resetFn]);

  return (
    <div
      ref={stageRef}
      className="camera-move-card__stage camera-move-card__stage--ainative camera-move-card__stage--idle"
      aria-label="Dolly zoom camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>

      <div className="camera-move-card__floor-line" />
      <div className="camera-move-card__floor-fade" />

      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--ainative">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>

      <div
        ref={worldRef}
        style={{ position: 'absolute', inset: 0, zIndex: 1, transformOrigin: '50% 55%' }}
      >
        <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.07, pointerEvents: 'none' }} viewBox="0 0 356 220" preserveAspectRatio="none" aria-hidden="true">
          <line x1="40" y1="0" x2="40" y2="220" stroke="white" strokeWidth="2" />
          <line x1="94" y1="0" x2="94" y2="220" stroke="white" strokeWidth="1.5" />
          <line x1="140" y1="0" x2="140" y2="220" stroke="white" strokeWidth="1.2" />
          <line x1="178" y1="0" x2="178" y2="220" stroke="white" strokeWidth="1.1" />
          <line x1="216" y1="0" x2="216" y2="220" stroke="white" strokeWidth="1.2" />
          <line x1="262" y1="0" x2="262" y2="220" stroke="white" strokeWidth="1.5" />
          <line x1="316" y1="0" x2="316" y2="220" stroke="white" strokeWidth="2" />
        </svg>
      </div>

      <div className="camera-move-card__sil-shadow" style={{ bottom: '45px', right: '28px', width: '76px', height: '9px' }} />
      <div ref={subjRef} className="camera-move-card__stickman-wrap" style={{ bottom: '48px', right: '38px', zIndex: 2 }}>
        <svg width="56" height="142" viewBox="0 0 56 142" fill="none" aria-hidden="true">
          <circle cx="28" cy="12" r="11" className="camera-move-card__fig-main" />
          <rect x="23" y="22" width="10" height="8" rx="3" className="camera-move-card__fig-main" />
          <path d="M7 30C7 27 17 25 28 25C39 25 49 27 49 30L45 66L11 66Z" className="camera-move-card__fig-main" />
          <path d="M9 32L3 72L11 73L15 34Z" className="camera-move-card__fig-dark" />
          <circle cx="6" cy="75" r="5" className="camera-move-card__fig-dark" />
          <path d="M47 32L53 72L45 73L41 34Z" className="camera-move-card__fig-dark" />
          <circle cx="50" cy="75" r="5" className="camera-move-card__fig-dark" />
          <path d="M11 64L45 64L42 78L14 78Z" className="camera-move-card__fig-dark" />
          <path d="M14 76L12 124L22 124L24 76Z" className="camera-move-card__fig-main" />
          <path d="M11 122L23 122L24 132L9 132Z" className="camera-move-card__fig-dark" />
          <path d="M32 76L34 124L44 124L42 76Z" className="camera-move-card__fig-main" />
          <path d="M32 122L44 122L46 132L31 132Z" className="camera-move-card__fig-dark" />
        </svg>
      </div>

      <div ref={camRef} className="camera-move-card__camera camera-move-card__camera-glow" style={{ position: 'absolute', bottom: '52px', left: '54px', zIndex: 4 }}>
        <svg width="46" height="32" viewBox="0 0 46 32" fill="none" aria-hidden="true">
          <rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.85" />
          <rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#A78BFA" strokeWidth="0.6" />
          <circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke="#A78BFA" strokeWidth="1.2" />
          <circle cx="16" cy="17" r="4.5" fill="#1E3A8A" />
          <circle cx="16" cy="17" r="2" fill="#60A5FA" />
          <circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6" />
          <rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#A78BFA" strokeWidth="0.6" />
          <circle ref={recRef} cx="27" cy="10" r="2" fill="#EF4444" className="camera-move-card__rec-dot" />
        </svg>
      </div>

      <svg className="camera-move-card__dotted-track" viewBox="0 0 356 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ zIndex: 3 }}>
        <line ref={topLRef} x1="0" y1="0" x2="0" y2="0" stroke="#8B5CF6" strokeOpacity="0.26" strokeWidth="1" strokeDasharray="5 4" />
        <line ref={botLRef} x1="0" y1="0" x2="0" y2="0" stroke="#8B5CF6" strokeOpacity="0.20" strokeWidth="1" strokeDasharray="5 4" />
        <text
          ref={noteRef}
          x="120"
          y="34"
          fill="#A78BFA"
          fillOpacity="0"
          fontSize="10"
          fontFamily="DM Mono, monospace"
        >
          Dolly out + zoom in warps background
        </text>
      </svg>

      <div ref={labelRef} className="camera-move-card__dir-label camera-move-card__dir-label--ainative" />
    </div>
  );
}
