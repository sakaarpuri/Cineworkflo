import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * AI Orbit Move - Camera circles around subject
 * Exact animation from modern.html
 */
export function OrbitMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const CAM_W = 38;
  const CAM_H = 28;

  const animateFn = useCallback((p, ts) => {
    const stage = stageRef.current;
    const w = stage?.clientWidth ?? 356;
    const h = stage?.clientHeight ?? 220;
    const CX = w / 2;
    const CY = h / 2;
    const R = Math.min(w, h) * 0.34;

    const t = p < 0.44 ? easeInOut(p / 0.44) : p < 0.56 ? 1 : 1 - easeInOut((p - 0.56) / 0.44);
    
    // Calculate position on circle
    const theta = Math.PI * 2 * t;
    const camX = CX + R * Math.cos(theta);
    const camY = CY + R * Math.sin(theta);
    
    // Camera aims at center
    const aim = Math.atan2(CY - camY, CX - camX) * 180 / Math.PI;

    const cam = camRef.current;
    if (cam) {
      cam.style.transformOrigin = 'center center';
      cam.style.transform = `translate(${camX - CAM_W / 2}px, ${camY - CAM_H / 2}px) rotate(${aim}deg)`;
    }

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      if (p < 0.44) {
        label.textContent = '⟲ ORBITING';
        label.style.opacity = Math.min(p / 0.12, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— HOLDING —';
        label.style.opacity = '0.55';
      } else {
        label.textContent = '⟳ RETURNING';
        label.style.opacity = Math.min((1 - p) / 0.12, 0.85);
      }
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)));
    }
  }, []);

  const resetFn = useCallback(() => {
    const cam = camRef.current;
    const label = labelRef.current;
    const rec = recRef.current;
    const stage = stageRef.current;
    const w = stage?.clientWidth ?? 356;
    const h = stage?.clientHeight ?? 220;
    const CX = w / 2;
    const CY = h / 2;
    const R = Math.min(w, h) * 0.34;

    // Reset to starting position (right side of circle)
    if (cam) {
      const startX = CX + R;
      const startY = CY;
      const aim = Math.atan2(CY - startY, CX - startX) * 180 / Math.PI;
      cam.style.transformOrigin = 'center center';
      cam.style.transform = `translate(${startX - CAM_W / 2}px, ${startY - CAM_H / 2}px) rotate(${aim}deg)`;
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
    duration: 4200
  });

  React.useEffect(() => {
    if (isHovered) start();
    else stop();
  }, [isHovered, start, stop]);

  // Initialize position on mount
  React.useEffect(() => {
    resetFn();
  }, [resetFn]);

  return (
    <div 
      ref={stageRef}
      className="camera-move-card__stage camera-move-card__stage--ainative camera-move-card__stage--idle"
      aria-label="AI Orbit camera movement animation"
    >
      <span className="camera-move-card__view-label">TOP-DOWN VIEW</span>
      
      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--ainative">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>
      
      {/* Subject at center (top-down) */}
      <div 
        className="camera-move-card__stickman-wrap"
        style={{ 
          top: '50%', 
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 2
        }}
      >
        <svg width="84" height="56" viewBox="0 0 80 52" fill="none" aria-hidden="true">
          <rect x="0" y="26" width="80" height="20" rx="10" fill="#C06A00" />
          <circle cx="40" cy="22" r="20" fill="#E08500" />
          <circle cx="40" cy="13" r="8" fill="#C06A00" opacity="0.35" />
        </svg>
      </div>
      
      {/* Orbit Camera */}
      <div 
        ref={camRef}
        className="camera-move-card__camera"
        style={{ 
          position: 'absolute',
          top: 0,
          left: 0,
          zIndex: 3
        }}
      >
        <svg width="38" height="28" viewBox="0 0 38 28" fill="none" aria-hidden="true">
          <rect x="0" y="4" width="28" height="20" rx="3" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.75"/>
          <rect x="28" y="8" width="9" height="10" rx="2" fill="#1D4ED8"/>
          <circle cx="14" cy="14" r="6" fill="#0C1445" stroke="#A78BFA" strokeWidth="1"/>
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
        className="camera-move-card__dir-label camera-move-card__dir-label--ainative"
      />
    </div>
  );
}
