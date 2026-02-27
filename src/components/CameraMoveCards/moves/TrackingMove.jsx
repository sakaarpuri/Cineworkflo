import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Tracking Shot - Exact copy from classic.html
 * Full stickman + camera move together with FOV lines
 */
export function TrackingMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const subRef = useRef(null);
  const camRef = useRef(null);
  const fov1Ref = useRef(null);
  const fov2Ref = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const SX = 6;
  const EX = 256;

  const setTrack = useCallback((x) => {
    const sub = subRef.current;
    const cam = camRef.current;
    const fov1 = fov1Ref.current;
    const fov2 = fov2Ref.current;

    if (sub) sub.style.left = x + 'px';
    if (cam) cam.style.left = x + 'px';

    // FOV from camera up toward subject — both move together
    const camCX = x + 19;
    const camCY = 138;
    const subCX = x + 40;
    const subCY = 78;

    if (fov1) {
      fov1.setAttribute('x1', camCX);
      fov1.setAttribute('y1', camCY);
      fov1.setAttribute('x2', subCX);
      fov2.setAttribute('y2', subCY);
    }
    if (fov2) {
      fov2.setAttribute('x1', camCX + 16);
      fov2.setAttribute('y1', camCY);
      fov2.setAttribute('x2', subCX + 18);
      fov2.setAttribute('y2', subCY);
    }
  }, []);

  const animateFn = useCallback((p, ts) => {
    let x;
    if (p < 0.44) {
      x = SX + easeInOut(p / 0.44) * (EX - SX);
    } else if (p < 0.56) {
      x = EX;
    } else {
      x = EX - easeInOut((p - 0.56) / 0.44) * (EX - SX);
    }

    setTrack(x);

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
  }, [setTrack]);

  const resetFn = useCallback(() => {
    setTrack(SX);
    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, [setTrack]);

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
      aria-label="Tracking shot camera movement animation"
    >
      <span className="camera-move-card__view-label">TOP-DOWN VIEW</span>
      
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
        <line 
          ref={fov1Ref}
          x1="25" y1="138" x2="46" y2="78"
          stroke="#3B82F6" 
          strokeOpacity="0.3" 
          strokeWidth="1"
        />
        <line 
          ref={fov2Ref}
          x1="41" y1="138" x2="64" y2="78"
          stroke="#3B82F6" 
          strokeOpacity="0.3" 
          strokeWidth="1"
        />
      </svg>
      
      {/* Subject */}
      <div 
        ref={subRef}
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
          left: '6px',
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
