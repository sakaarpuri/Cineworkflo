import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Dolly Move - Side view camera push in/pull back
 * Exact SVG and animation from classic.html
 */
export function DollyMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  // Animation constants
  const SX = 12;
  const EX = 136;

  const animateFn = useCallback((p, ts) => {
    const cam = camRef.current;
    const label = labelRef.current;
    const rec = recRef.current;

    if (!cam) return;

    // Calculate position with ease
    let x;
    if (p < 0.44) {
      x = SX + easeInOut(p / 0.44) * (EX - SX);
    } else if (p < 0.56) {
      x = EX;
    } else {
      x = EX - easeInOut((p - 0.56) / 0.44) * (EX - SX);
    }

    cam.style.left = x + 'px';

    // Update label
    if (label) {
      if (p < 0.44) {
        label.textContent = '▶▶ MOVING CLOSER';
        label.style.opacity = Math.min(p / 0.1, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— HOLDING —';
        label.style.opacity = '0.5';
      } else {
        label.textContent = '◀◀ PULLING BACK';
        label.style.opacity = Math.min((1 - p) / 0.1, 0.85);
      }
    }

    // Pulse recording dot
    if (rec) {
      rec.style.opacity = (p < 0.44 || p > 0.56) 
        ? String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)))
        : '1';
    }
  }, []);

  const resetFn = useCallback(() => {
    const cam = camRef.current;
    const label = labelRef.current;
    const rec = recRef.current;

    if (cam) cam.style.left = SX + 'px';
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, []);

  const { start, stop } = useCameraAnimation({
    stageRef,
    hintRef,
    animateFn,
    resetFn,
    runs: 2,
    duration: 3400
  });

  // Handle hover
  React.useEffect(() => {
    if (isHovered) {
      start();
    } else {
      stop();
    }
  }, [isHovered, start, stop]);

  return (
    <div 
      ref={stageRef}
      className="camera-move-card__stage camera-move-card__stage--classic camera-move-card__stage--idle"
      aria-label="Dolly camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>
      
      {/* Floor elements */}
      <div className="camera-move-card__floor-line" />
      <div className="camera-move-card__floor-fade" />
      
      {/* Hover hint */}
      <div ref={hintRef} className="camera-move-card__hint">
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--classic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>
      
      {/* Dotted track line */}
      <svg 
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <line 
          x1="18" y1="168" x2="290" y2="168" 
          stroke="#3B82F6" 
          strokeOpacity="0.25" 
          strokeWidth="1.5" 
          strokeDasharray="5 5"
        />
        <polyline 
          points="282,163 290,168 282,173" 
          fill="none" 
          stroke="#3B82F6" 
          strokeOpacity="0.35" 
          strokeWidth="1.5"
        />
      </svg>
      
      {/* Subject shadow */}
      <div 
        className="camera-move-card__sil-shadow"
        style={{ bottom: '45px', right: '28px', width: '76px', height: '9px' }}
      />
      
      {/* Stickman subject */}
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
        className="camera-move-card__camera camera-move-card__camera-glow"
        style={{ bottom: '52px', left: '12px' }}
      >
        <svg width="46" height="32" viewBox="0 0 46 32" fill="none" aria-hidden="true">
          <rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="0.75"/>
          <rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"/>
          <circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke="#3B82F6" strokeWidth="1.2"/>
          <circle cx="16" cy="17" r="4.5" fill="#1E3A8A"/>
          <circle cx="16" cy="17" r="2" fill="#60A5FA"/>
          <circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6"/>
          <rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"/>
          <circle 
            ref={recRef}
            cx="27" 
            cy="10" 
            r="2" 
            fill="#EF4444"
            className="camera-move-card__rec-dot"
          />
        </svg>
      </div>
      
      {/* Direction label */}
      <div 
        ref={labelRef}
        className="camera-move-card__dir-label camera-move-card__dir-label--classic"
      />
    </div>
  );
}
