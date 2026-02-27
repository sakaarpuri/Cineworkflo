import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

/**
 * Whip Pan - fast snap rotation transition
 * Ported from dynamic.html
 */
export function WhipPanMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camGRef = useRef(null);
  const fovRef = useRef(null);
  const edge1Ref = useRef(null);
  const edge2Ref = useRef(null);
  const sweepRef = useRef(null);
  const smearRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const CX = 80;
  const CY = 110;
  const LEN = 200;
  const FOV_HALF = 22;
  const A_START = -18;
  const A_END = 62;
  const SWEEP_R = 140;

  const setWhip = useCallback((centreDeg) => {
    const camG = camGRef.current;
    const fov = fovRef.current;
    const edge1 = edge1Ref.current;
    const edge2 = edge2Ref.current;
    const sweep = sweepRef.current;

    if (!camG || !fov || !edge1 || !edge2 || !sweep) return;

    camG.setAttribute('transform', `translate(${CX},${CY}) rotate(${centreDeg})`);

    const toRad = (d) => d * Math.PI / 180;
    const a1 = toRad(centreDeg - FOV_HALF);
    const a2 = toRad(centreDeg + FOV_HALF);

    const e1x = CX + LEN * 0.9 * Math.cos(a1);
    const e1y = CY + LEN * 0.9 * Math.sin(a1);
    const e2x = CX + LEN * 0.9 * Math.cos(a2);
    const e2y = CY + LEN * 0.9 * Math.sin(a2);

    edge1.setAttribute('x1', CX);
    edge1.setAttribute('y1', CY);
    edge1.setAttribute('x2', e1x);
    edge1.setAttribute('y2', e1y);

    edge2.setAttribute('x1', CX);
    edge2.setAttribute('y1', CY);
    edge2.setAttribute('x2', e2x);
    edge2.setAttribute('y2', e2y);

    fov.setAttribute('d', `M${CX},${CY} L${e1x},${e1y} A${LEN * 0.9},${LEN * 0.9} 0 0,1 ${e2x},${e2y} Z`);

    const rS = toRad(A_START);
    const rE = toRad(centreDeg);
    const sx1 = CX + SWEEP_R * Math.cos(rS);
    const sy1 = CY + SWEEP_R * Math.sin(rS);
    const sx2 = CX + SWEEP_R * Math.cos(rE);
    const sy2 = CY + SWEEP_R * Math.sin(rE);

    if (Math.abs(centreDeg - A_START) > 1) {
      sweep.setAttribute('d', `M${sx1},${sy1} A${SWEEP_R},${SWEEP_R} 0 0,1 ${sx2},${sy2}`);
    } else {
      sweep.setAttribute('d', '');
    }
  }, []);

  const animateFn = useCallback((p, ts) => {
    let angle = A_START;
    let smear = 0;

    if (p < 0.14) {
      const t = easeOutCubic(p / 0.14);
      angle = A_START + t * (A_END - A_START);
      smear = 1;
    } else if (p < 0.56) {
      angle = A_END;
      smear = 0;
    } else if (p < 0.70) {
      const t = easeOutCubic((p - 0.56) / 0.14);
      angle = A_END - t * (A_END - A_START);
      smear = 1;
    } else {
      angle = A_START;
      smear = 0;
    }

    setWhip(angle);

    const smearG = smearRef.current;
    if (smearG) smearG.setAttribute('opacity', String(0.85 * smear));

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      label.textContent = p < 0.14 ? '≫≫ WHIP!' : p < 0.56 ? '— TRANSITION —' : p < 0.70 ? '≪≪ SNAP BACK' : '— SETTLED —';
      label.style.opacity = p < 0.14 ? String(Math.min(p / 0.06, 0.85)) : p < 0.56 ? '0.55' : p < 0.70 ? '0.75' : '0.35';
    }

    if (rec) {
      const blinkRate = smear ? 160 : 520;
      rec.style.opacity = String(0.45 + 0.55 * Math.abs(Math.sin(ts / blinkRate)));
    }
  }, [setWhip]);

  const resetFn = useCallback(() => {
    setWhip(A_START);
    const label = labelRef.current;
    const rec = recRef.current;
    const smearG = smearRef.current;

    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
    if (smearG) smearG.setAttribute('opacity', '0');
  }, [setWhip]);

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
      aria-label="Whip pan camera movement animation"
    >
      <span className="camera-move-card__view-label">TOP-DOWN VIEW</span>

      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--dynamic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>

      {/* Subtle grid */}
      <svg
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.05, pointerEvents: 'none' }}
        viewBox="0 0 356 220"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <line x1="118" y1="0" x2="118" y2="220" stroke="white" strokeWidth="1" />
        <line x1="238" y1="0" x2="238" y2="220" stroke="white" strokeWidth="1" />
        <line x1="0" y1="73" x2="356" y2="73" stroke="white" strokeWidth="1" />
        <line x1="0" y1="147" x2="356" y2="147" stroke="white" strokeWidth="1" />
      </svg>

      {/* Subject reference (top-down) */}
      <div className="camera-move-card__stickman-wrap" style={{ top: '50%', right: '44px', transform: 'translateY(-50%)' }}>
        <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-hidden="true">
          <rect x="0" y="26" width="80" height="20" rx="10" fill="#C06A00" />
          <circle cx="40" cy="22" r="20" fill="#E08500" />
          <circle cx="40" cy="13" r="8" fill="#C06A00" opacity="0.35" />
        </svg>
      </div>

      {/* Camera + FOV */}
      <svg
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ zIndex: 3, overflow: 'visible' }}
      >
        <path ref={fovRef} d="" fill="#BE185D" fillOpacity="0.05" />
        <line ref={edge1Ref} x1="80" y1="110" x2="80" y2="110" stroke="#FB7185" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="5 4" />
        <line ref={edge2Ref} x1="80" y1="110" x2="80" y2="110" stroke="#FB7185" strokeOpacity="0.22" strokeWidth="1" strokeDasharray="5 4" />
        <path ref={sweepRef} d="" fill="none" stroke="#FB7185" strokeOpacity="0.22" strokeWidth="1.5" strokeDasharray="4 4" />

        <g ref={smearRef} opacity="0">
          <line x1="64" y1="86" x2="186" y2="66" stroke="#F472B6" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
          <line x1="64" y1="110" x2="190" y2="110" stroke="#F472B6" strokeOpacity="0.18" strokeWidth="3" strokeLinecap="round" />
          <line x1="64" y1="134" x2="186" y2="154" stroke="#F472B6" strokeOpacity="0.25" strokeWidth="3" strokeLinecap="round" />
        </g>

        <g ref={camGRef}>
          <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#1E40AF" stroke="#F9A8D4" strokeWidth="0.75" />
          <rect x="14" y="-5" width="9" height="10" rx="2" fill="#1D4ED8" />
          <circle cx="0" cy="0" r="6" fill="#0C1445" stroke="#F9A8D4" strokeWidth="1" />
          <circle cx="0" cy="0" r="3" fill="#1E3A8A" />
          <circle cx="0" cy="0" r="1.2" fill="#60A5FA" />
          <circle ref={recRef} cx="11" cy="-7" r="1.8" fill="#EF4444" className="camera-move-card__rec-dot" />
        </g>
      </svg>

      <div ref={labelRef} className="camera-move-card__dir-label camera-move-card__dir-label--dynamic" />
    </div>
  );
}

