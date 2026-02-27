import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * FPV Drone Move - Aerial lift and reveal
 * Exact animation from modern.html
 */
export function DroneMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const subjRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const animateFn = useCallback((p, ts) => {
    // Drone rises and pulls back
    const t = p < 0.44 ? easeInOut(p / 0.44) : p < 0.56 ? 1 : 1 - easeInOut((p - 0.56) / 0.44);
    
    // Camera movement: rises up and scales down (appears smaller as it pulls away)
    const x = 68 + (28 - 68) * t;
    const b = 92 + (162 - 92) * t;
    const s = 1 - 0.46 * t;

    const cam = camRef.current;
    if (cam) {
      cam.style.left = x + 'px';
      cam.style.bottom = b + 'px';
      cam.style.transform = `scale(${s})`;
    }

    // Subject scales down as drone pulls away
    const subScale = 1 - 0.42 * t;
    const subj = subjRef.current;
    if (subj) {
      subj.style.transform = `scale(${subScale})`;
      subj.style.opacity = String(0.98 - 0.10 * t);
    }

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      if (p < 0.44) {
        label.textContent = '▲ RISING + PULLING BACK';
        label.style.opacity = Math.min(p / 0.12, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— WIDE REVEAL —';
        label.style.opacity = '0.55';
      } else {
        label.textContent = '▼ DROPPING IN';
        label.style.opacity = Math.min((1 - p) / 0.12, 0.85);
      }
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 220)));
    }
  }, []);

  const resetFn = useCallback(() => {
    const cam = camRef.current;
    const subj = subjRef.current;
    const label = labelRef.current;
    const rec = recRef.current;

    if (cam) {
      cam.style.left = '68px';
      cam.style.bottom = '92px';
      cam.style.transform = 'scale(1)';
    }
    if (subj) {
      subj.style.transform = 'scale(1)';
      subj.style.opacity = '0.98';
    }
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

  React.useEffect(() => {
    if (isHovered) start();
    else stop();
  }, [isHovered, start, stop]);

  return (
    <div 
      ref={stageRef}
      className="camera-move-card__stage camera-move-card__stage--ainative camera-move-card__stage--idle"
      aria-label="FPV Drone aerial lift animation"
    >
      <span className="camera-move-card__view-label">AERIAL LIFT</span>
      
      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--ainative">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>
      
      {/* Subject */}
      <div 
        ref={subjRef}
        className="camera-move-card__stickman-wrap"
        style={{ 
          bottom: '48px', 
          right: '38px',
          transform: 'scale(1)',
          opacity: 0.98
        }}
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
      
      {/* FPV Drone Camera */}
      <div 
        ref={camRef}
        className="camera-move-card__camera"
        style={{ 
          bottom: '92px', 
          left: '68px',
          zIndex: 3
        }}
      >
        <svg width="72" height="44" viewBox="0 0 72 44" fill="none" aria-hidden="true">
          {/* Drone body */}
          <line x1="12" y1="22" x2="60" y2="22" stroke="#A78BFA" strokeOpacity="0.55" strokeWidth="3" strokeLinecap="round"/>
          <line x1="22" y1="10" x2="50" y2="34" stroke="#A78BFA" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round"/>
          <line x1="50" y1="10" x2="22" y2="34" stroke="#A78BFA" strokeOpacity="0.4" strokeWidth="3" strokeLinecap="round"/>
          <rect x="28" y="16" width="16" height="12" rx="4" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.9"/>
          <circle cx="36" cy="22" r="4.5" fill="#0C1445" stroke="#A78BFA" strokeWidth="0.9"/>
          <circle cx="36" cy="22" r="1.8" fill="#60A5FA"/>
          {/* Motors */}
          <circle cx="12" cy="22" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/>
          <circle cx="60" cy="22" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/>
          <circle cx="22" cy="10" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/>
          <circle cx="50" cy="34" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" strokeOpacity="0.35"/>
          {/* Recording dot */}
          <circle 
            ref={recRef}
            cx="44" 
            cy="18" 
            r="2" 
            fill="#EF4444"
            className="camera-move-card__rec-dot"
          />
        </svg>
      </div>
      
      <div 
        ref={labelRef}
        className="camera-move-card__dir-label camera-move-card__dir-label--ainative"
      />
    </div>
  );
}
