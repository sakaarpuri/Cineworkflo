import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Zoom Move - Exact copy from classic.html
 * Camera fixed, subject grows bigger (lens zoom)
 */
export function ZoomMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const subjRef = useRef(null);
  const shadowRef = useRef(null);
  const topLRef = useRef(null);
  const botLRef = useRef(null);
  const noteRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const CAM_X = 94;
  const SUB_X = 262;
  const CY = 110;

  const setZoom = useCallback((t) => {
    const subj = subjRef.current;
    const shadow = shadowRef.current;
    const topL = topLRef.current;
    const botL = botLRef.current;
    const note = noteRef.current;

    // Scale subject: 1.0 → 1.8 (zoom in makes subject appear bigger)
    const scale = 1 + t * 0.85;
    
    if (subj) subj.style.transform = `scale(${scale})`;
    if (shadow) shadow.style.transform = `scale(${scale})`;

    // FOV lines narrow as zoom increases
    const fovHalf = 90 - t * 74; // 90 → 16 pixels at subject end
    
    if (topL) {
      topL.setAttribute('x1', CAM_X);
      topL.setAttribute('y1', CY);
      topL.setAttribute('x2', SUB_X);
      topL.setAttribute('y2', CY - fovHalf);
    }
    
    if (botL) {
      botL.setAttribute('x1', CAM_X);
      botL.setAttribute('y1', CY);
      botL.setAttribute('x2', SUB_X);
      botL.setAttribute('y2', CY + fovHalf);
    }

    if (note) {
      note.setAttribute('fill-opacity', t > 0.3 ? Math.min((t - 0.3) / 0.2, 0.7) : 0);
    }
  }, []);

  const animateFn = useCallback((p, ts) => {
    let t;
    if (p < 0.44) {
      t = easeInOut(p / 0.44);
    } else if (p < 0.56) {
      t = 1;
    } else {
      t = 1 - easeInOut((p - 0.56) / 0.44);
    }

    setZoom(t);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      if (p < 0.44) {
        label.textContent = '▶▶ ZOOMING IN';
        label.style.opacity = Math.min(p / 0.1, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— HOLDING —';
        label.style.opacity = '0.5';
      } else {
        label.textContent = '◀◀ ZOOMING OUT';
        label.style.opacity = Math.min((1 - p) / 0.1, 0.85);
      }
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)));
    }
  }, [setZoom]);

  const resetFn = useCallback(() => {
    setZoom(0);
    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, [setZoom]);

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
      aria-label="Zoom camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>
      
      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--classic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>
      
      {/* FOV lines SVG */}
      <svg 
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* FOV lines */}
        <line 
          ref={topLRef}
          x1={CAM_X} y1={CY} x2={SUB_X} y2={CY - 90}
          stroke="#3B82F6" 
          strokeOpacity="0.25" 
          strokeWidth="1"
        />
        <line 
          ref={botLRef}
          x1={CAM_X} y1={CY} x2={SUB_X} y2={CY + 90}
          stroke="#3B82F6" 
          strokeOpacity="0.25" 
          strokeWidth="1"
        />
        
        {/* Perspective note */}
        <text 
          ref={noteRef}
          x="178" 
          y="30" 
          textAnchor="middle" 
          fill="#60A5FA" 
          fontSize="10"
          fontFamily="DM Mono, monospace"
          fillOpacity="0"
        >
          Perspective stays fixed (unlike dolly)
        </text>
      </svg>
      
      {/* Subject shadow */}
      <div 
        ref={shadowRef}
        className="camera-move-card__sil-shadow"
        style={{ bottom: '45px', right: '28px', width: '76px', height: '9px' }}
      />
      
      {/* Subject */}
      <div 
        ref={subjRef}
        className="camera-move-card__stickman-wrap"
        style={{ 
          bottom: '48px', 
          right: '38px',
          transform: 'scale(1)',
          transformOrigin: 'center bottom'
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
      
      {/* Camera */}
      <div 
        className="camera-move-card__camera camera-move-card__camera-glow"
        style={{ 
          bottom: '52px', 
          left: '48px'
        }}
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
      
      <div 
        ref={labelRef}
        className="camera-move-card__dir-label camera-move-card__dir-label--classic"
      />
    </div>
  );
}
