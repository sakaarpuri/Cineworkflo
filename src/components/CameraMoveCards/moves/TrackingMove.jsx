import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Tracking Move - Top-down view camera and subject moving together
 * Exact SVG and animation from classic.html
 */
export function TrackingMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const subjRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const SX = 6;
  const EX = 200;

  const animateFn = useCallback((p, ts) => {
    let x;
    if (p < 0.44) {
      x = SX + easeInOut(p / 0.44) * (EX - SX);
    } else if (p < 0.56) {
      x = EX;
    } else {
      x = EX - easeInOut((p - 0.56) / 0.44) * (EX - SX);
    }

    const cam = camRef.current;
    const subj = subjRef.current;

    if (cam) cam.style.left = x + 'px';
    if (subj) subj.style.left = x + 'px';

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      if (p < 0.44) {
        label.textContent = '▶▶ TRACKING RIGHT';
        label.style.opacity = Math.min(p / 0.1, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— HOLDING —';
        label.style.opacity = '0.5';
      } else {
        label.textContent = '◀◀ TRACKING LEFT';
        label.style.opacity = Math.min((1 - p) / 0.1, 0.85);
      }
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)));
    }
  }, []);

  const resetFn = useCallback(() => {
    const cam = camRef.current;
    const subj = subjRef.current;
    const label = labelRef.current;
    const rec = recRef.current;

    if (cam) cam.style.left = SX + 'px';
    if (subj) subj.style.left = SX + 'px';
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
      className="camera-move-card__stage camera-move-card__stage--classic camera-move-card__stage--idle"
      aria-label="Tracking camera movement animation"
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
        ref={subjRef}
        className="camera-move-card__stickman-wrap"
        style={{ 
          top: '50%', 
          left: '6px',
          transform: 'translateY(-50%)',
          transformOrigin: 'center center'
        }}
      >
        <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-hidden="true">
          <rect x="0" y="26" width="80" height="20" rx="10" fill="#C06A00"/>
          <circle cx="40" cy="22" r="20" fill="#E08500"/>
          <circle cx="40" cy="13" r="8" fill="#C06A00" opacity="0.35"/>
        </svg>
      </div>
      
      {/* Camera */}
      <div 
        ref={camRef}
        className="camera-move-card__camera"
        style={{ 
          top: '50%', 
          left: '14px',
          transform: 'translateY(-50%)',
          zIndex: 3
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
