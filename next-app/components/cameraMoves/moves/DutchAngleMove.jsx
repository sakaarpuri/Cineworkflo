import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Dutch Angle - roll camera on axis
 * Ported from dynamic.html
 */
export function DutchAngleMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const worldRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const A_MAX = 16;

  const setDutch = useCallback((deg) => {
    const world = worldRef.current;
    if (world) world.style.transform = `rotate(${deg}deg)`;
  }, []);

  const animateFn = useCallback((p, ts) => {
    let a;
    if (p < 0.44) a = easeInOut(p / 0.44) * A_MAX;
    else if (p < 0.56) a = A_MAX;
    else a = (1 - easeInOut((p - 0.56) / 0.44)) * A_MAX;

    setDutch(a);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      label.textContent = p < 0.44 ? '↻ TILTING' : p < 0.56 ? '— UNEASE —' : '↺ LEVELING';
      label.style.opacity = p < 0.44
        ? String(Math.min(p / 0.12, 0.85))
        : p < 0.56
          ? '0.55'
          : String(Math.min((1 - p) / 0.12, 0.85));
    }

    if (rec) rec.style.opacity = String(0.5 + 0.5 * Math.abs(Math.sin(ts / 520)));
  }, [setDutch]);

  const resetFn = useCallback(() => {
    setDutch(0);
    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, [setDutch]);

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
      className="camera-move-card__stage camera-move-card__stage--dynamic camera-move-card__stage--idle"
      aria-label="Dutch angle camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>

      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--dynamic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>

      <div
        ref={worldRef}
        style={{
          position: 'absolute',
          inset: 0,
          transformOrigin: '50% 55%',
          zIndex: 2
        }}
      >
        {/* Horizon / set line */}
        <div
          style={{
            position: 'absolute',
            left: '-40px',
            right: '-40px',
            top: '118px',
            height: '1px',
            background: 'linear-gradient(90deg,transparent,#ffffff10 18%,#ffffff22 50%,#ffffff10 82%,transparent)'
          }}
        />

        {/* Subject */}
        <div className="camera-move-card__sil-shadow" style={{ bottom: '45px', right: '28px', width: '76px', height: '9px' }} />
        <div className="camera-move-card__stickman-wrap" style={{ bottom: '48px', right: '38px' }}>
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

        {/* Camera */}
        <div className="camera-move-card__camera camera-move-card__camera-glow" style={{ position: 'absolute', bottom: '52px', left: '22px', zIndex: 3 }}>
          <svg width="46" height="32" viewBox="0 0 46 32" fill="none" aria-hidden="true">
            <rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke="#F9A8D4" strokeWidth="0.75" />
            <rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#F9A8D4" strokeWidth="0.5" />
            <circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke="#F9A8D4" strokeWidth="1.2" />
            <circle cx="16" cy="17" r="4.5" fill="#1E3A8A" />
            <circle cx="16" cy="17" r="2" fill="#60A5FA" />
            <circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6" />
            <rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#F9A8D4" strokeWidth="0.5" />
            <circle ref={recRef} cx="27" cy="10" r="2" fill="#EF4444" className="camera-move-card__rec-dot" />
          </svg>
        </div>
      </div>

      <div ref={labelRef} className="camera-move-card__dir-label camera-move-card__dir-label--dynamic" />
    </div>
  );
}
