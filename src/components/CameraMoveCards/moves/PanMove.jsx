import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Pan Move - Top-down view camera rotation
 * Exact SVG and animation from classic.html
 */
export function PanMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  // Animation constants
  const CX = 80;
  const CY = 110;
  const A_START = -35;
  const A_END = 35;

  const setPan = useCallback((angle) => {
    const cam = camRef.current;
    if (cam) {
      cam.style.transform = `translate(${CX}px, ${CY}px) rotate(${angle}deg)`;
    }
  }, []);

  const animateFn = useCallback((p, ts) => {
    let angle;
    if (p < 0.44) {
      angle = A_START + easeInOut(p / 0.44) * (A_END - A_START);
    } else if (p < 0.56) {
      angle = A_END;
    } else {
      angle = A_END - easeInOut((p - 0.56) / 0.44) * (A_END - A_START);
    }

    setPan(angle);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      if (p < 0.44) {
        label.textContent = '▶▶ PANNING RIGHT';
        label.style.opacity = Math.min(p / 0.1, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— HOLDING —';
        label.style.opacity = '0.5';
      } else {
        label.textContent = '◀◀ PANNING LEFT';
        label.style.opacity = Math.min((1 - p) / 0.1, 0.85);
      }
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)));
    }
  }, [setPan]);

  const resetFn = useCallback(() => {
    setPan(A_START);
    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, [setPan]);

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
      aria-label="Pan camera movement animation"
    >
      <span className="camera-move-card__view-label">TOP-DOWN VIEW</span>
      
      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--classic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>
      
      {/* Subject */}
      <div 
        className="camera-move-card__stickman-wrap"
        style={{ bottom: '48px', right: '38px' }}
      >
        <svg width="56" height="142" viewBox="0 0 56 142" fill="none" aria-hidden="true">
          <circle cx="28" cy="12" r="11" className="camera-move-card__fig-main"/>
          <rect x="23" y="22" width="10" height="8" rx="3" className="camera-move-card__fig-main"/>
          <path d="M7 30C7 27 17 25 28 25C39 25 49 27 49 30L45 66L11 66Z" className="camera-move-card__fig-main"/>
          <path d="M9 32L3 72L11 73L15 34Z" className="camera-move-card__fig-dark"/>
          <circle cx="6" cy="75" r="5" className="camera-move-card__fig-dark"/>
          <path d="M47 32L53 72L45 73L41 34Z" className="camera-move-card__fig-dark"/>
          <circle cx="50" cy="75" r="5" className="camera-move-card__fig-dark"/>
          <path d="M11 64L45 64L42 78L14 78Z" className="camera-move-card__fig-dark"/>
          <path d="M14 76L12 124L22 124L24 76Z" className="camera-move-card__fig-main"/>
          <path d="M11 122L23 122L24 132L9 132Z" className="camera-move-card__fig-dark"/>
          <path d="M32 76L34 124L44 124L42 76Z" className="camera-move-card__fig-main"/>
          <path d="M32 122L44 122L46 132L31 132Z" className="camera-move-card__fig-dark"/>
        </svg>
      </div>
      
      {/* Camera */}
      <div 
        ref={camRef}
        className="camera-move-card__camera"
        style={{ 
          top: '50%', 
          left: '80px',
          transform: `translate(${CX}px, ${CY}px) rotate(${A_START}deg)`,
          transformOrigin: 'center center'
        }}
      >
        <svg width="38" height="28" viewBox="0 0 38 28" fill="none" aria-hidden="true">
          <rect x="0" y="4" width="28" height="20" rx="3" fill="#1E40AF" stroke="#3B82F6" strokeWidth="0.75"/>
          <rect x="28" y="8" width="9" height="10" rx="2" fill="#1D4ED8"/>
          <circle cx="14" cy="14" r="6" fill="#0C1445" stroke="#3B82F6" strokeWidth="1"/>
          <circle cx="14" cy="14" r="3.5" fill="#1E3A8A"/>
          <circle cx="14" cy="14" r="1.4" fill="#60A5FA"/>
          <circle 
            ref={recRef}
            cx="25" 
            cy="6" 
            r="1.8" 
            fill="#EF4444"
            className="camera-move-card__rec-dot"
          />
        </svg>
      </div>
      
      <div 
        ref={labelRef}
        className="camera-move-card__dir-label camera-move-card__dir-label--classic"
      />
    </div>
  );
}
