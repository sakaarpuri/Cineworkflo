import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Crane / Jib - Side view vertical sweep on an arm
 * Ported from classic.html
 */
export function CraneMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const armRef = useRef(null);
  const camGRef = useRef(null);
  const pathRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const PX = 45;
  const PY = 178;
  const ARM_LEN = 100;
  const A_START = 20;
  const A_END = -62;

  const setCrane = useCallback((deg) => {
    const arm = armRef.current;
    const camG = camGRef.current;
    const path = pathRef.current;

    if (!arm || !camG || !path) return;

    const r = deg * Math.PI / 180;
    const ex = PX + ARM_LEN * Math.cos(r);
    const ey = PY + ARM_LEN * Math.sin(r);

    arm.setAttribute('x1', PX);
    arm.setAttribute('y1', PY);
    arm.setAttribute('x2', ex);
    arm.setAttribute('y2', ey);
    camG.setAttribute('transform', `translate(${ex},${ey}) rotate(${deg})`);

    // Dotted arc path showing travel range
    const rS = A_START * Math.PI / 180;
    const rE = deg * Math.PI / 180;
    const px1 = PX + ARM_LEN * Math.cos(rS);
    const py1 = PY + ARM_LEN * Math.sin(rS);
    const px2 = PX + ARM_LEN * Math.cos(rE);
    const py2 = PY + ARM_LEN * Math.sin(rE);
    const lf = (A_START - deg) > 180 ? 1 : 0;

    if (Math.abs(deg - A_START) > 2) {
      path.setAttribute('d', `M${px1},${py1} A${ARM_LEN},${ARM_LEN} 0 ${lf},0 ${px2},${py2}`);
    } else {
      path.setAttribute('d', '');
    }
  }, []);

  const animateFn = useCallback((p, ts) => {
    let angle;
    if (p < 0.44) angle = A_START + easeInOut(p / 0.44) * (A_END - A_START);
    else if (p < 0.56) angle = A_END;
    else angle = A_END - easeInOut((p - 0.56) / 0.44) * (A_END - A_START);

    setCrane(angle);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      label.textContent = p < 0.44 ? '▲ RISING UP' : p < 0.56 ? '— HOLDING —' : '▼ SWOOPING DOWN';
      label.style.opacity = p < 0.44
        ? String(Math.min(p / 0.1, 0.85))
        : p < 0.56
          ? '0.5'
          : String(Math.min((1 - p) / 0.1, 0.85));
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)));
    }
  }, [setCrane]);

  const resetFn = useCallback(() => {
    setCrane(A_START);
    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, [setCrane]);

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

  return (
    <div
      ref={stageRef}
      className="camera-move-card__stage camera-move-card__stage--classic camera-move-card__stage--idle"
      aria-label="Crane / Jib camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>

      <div className="camera-move-card__floor-line" />
      <div className="camera-move-card__floor-fade" />

      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--classic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>

      <div
        className="camera-move-card__sil-shadow"
        style={{ bottom: '45px', right: '55px', width: '76px', height: '9px' }}
      />
      <div className="camera-move-card__stickman-wrap" style={{ bottom: '48px', right: '65px' }}>
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

      <svg
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ zIndex: 3, overflow: 'visible' }}
      >
        {/* Crane base */}
        <polygon points="32,210 58,210 45,178" fill="#1E293B" stroke="#334155" strokeWidth="1" />
        <rect x="40" y="176" width="10" height="8" rx="2" fill="#334155" />

        {/* Arm */}
        <line ref={armRef} x1="45" y1="178" x2="45" y2="120" stroke="#475569" strokeWidth="4" strokeLinecap="round" />

        {/* Path arc */}
        <path ref={pathRef} d="" fill="none" stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="5 4" />

        {/* Camera group */}
        <g ref={camGRef}>
          <rect x="-13" y="-8" width="26" height="16" rx="3" fill="#1E40AF" stroke="#3B82F6" strokeWidth="0.75" />
          <rect x="13" y="-4" width="9" height="8" rx="2" fill="#1D4ED8" />
          <circle cx="0" cy="0" r="5.5" fill="#0C1445" stroke="#3B82F6" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#1E3A8A" />
          <circle cx="0" cy="0" r="1.2" fill="#60A5FA" />
          <circle ref={recRef} cx="11" cy="-6" r="1.8" fill="#EF4444" className="camera-move-card__rec-dot" />
          <line x1="13" y1="0" x2="100" y2="0" stroke="#2563EB" strokeOpacity="0.3" strokeWidth="1" strokeDasharray="4 4" />
        </g>
      </svg>

      <div ref={labelRef} className="camera-move-card__dir-label camera-move-card__dir-label--classic" />
    </div>
  );
}

