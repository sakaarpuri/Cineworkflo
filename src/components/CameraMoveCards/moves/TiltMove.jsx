import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Tilt Move - Side view camera pivot up/down
 * Exact SVG and animation from classic.html with FOV beam
 */
export function TiltMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);
  const hitRef = useRef(null);
  const camGRef = useRef(null);
  const beamRef = useRef(null);
  const edge1Ref = useRef(null);
  const edge2Ref = useRef(null);
  const fovRef = useRef(null);
  const sweepRef = useRef(null);

  // Camera pivot on tripod
  const CX = 52;
  const CY = 148;
  const LEN = 180;
  const FOV_H = 12;
  const A_START = 10;
  const A_END = -32;

  const setTilt = useCallback((deg) => {
    const toRad = d => d * Math.PI / 180;
    const r = toRad(deg);
    
    const camG = camGRef.current;
    const beam = beamRef.current;
    const edge1 = edge1Ref.current;
    const edge2 = edge2Ref.current;
    const fov = fovRef.current;
    const sweep = sweepRef.current;

    if (camG) camG.setAttribute('transform', `translate(${CX},${CY}) rotate(${deg})`);
    
    if (beam) {
      const bx = CX + LEN * Math.cos(r);
      const by = CY + LEN * Math.sin(r);
      beam.setAttribute('x1', CX);
      beam.setAttribute('y1', CY);
      beam.setAttribute('x2', bx);
      beam.setAttribute('y2', by);
    }
    
    if (edge1 && edge2) {
      const r1 = toRad(deg - FOV_H);
      const r2 = toRad(deg + FOV_H);
      const e1x = CX + LEN * 0.85 * Math.cos(r1);
      const e1y = CY + LEN * 0.85 * Math.sin(r1);
      const e2x = CX + LEN * 0.85 * Math.cos(r2);
      const e2y = CY + LEN * 0.85 * Math.sin(r2);
      
      edge1.setAttribute('x1', CX);
      edge1.setAttribute('y1', CY);
      edge1.setAttribute('x2', e1x);
      edge1.setAttribute('y2', e1y);
      
      edge2.setAttribute('x1', CX);
      edge2.setAttribute('y1', CY);
      edge2.setAttribute('x2', e2x);
      edge2.setAttribute('y2', e2y);
      
      if (fov) {
        fov.setAttribute('d', `M${CX},${CY} L${e1x},${e1y} A${LEN*0.85},${LEN*0.85} 0 0,1 ${e2x},${e2y} Z`);
      }
    }
    
    if (sweep) {
      const rS = toRad(A_START);
      const rC = toRad(deg);
      const lf = (deg - A_START) < -180 ? 1 : 0;
      const sx1 = CX + 120 * Math.cos(rS);
      const sy1 = CY + 120 * Math.sin(rS);
      const sx2 = CX + 120 * Math.cos(rC);
      const sy2 = CY + 120 * Math.sin(rC);
      
      if (Math.abs(deg - A_START) > 1) {
        sweep.setAttribute('d', `M${sx1},${sy1} A120,120 0 ${lf},0 ${sx2},${sy2}`);
      } else {
        sweep.setAttribute('d', '');
      }
    }
    
    // Hit dot on stickman
    const hit = hitRef.current;
    if (hit) {
      const tp = (A_START - deg) / (A_START - A_END);
      const hitX = 258;
      const hitY = 172 - tp * 142;
      hit.style.left = hitX + 'px';
      hit.style.top = hitY + 'px';
      hit.style.opacity = tp > 0.02 && tp < 0.98 ? '0.8' : '0';
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

    setTilt(angle);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      if (p < 0.44) {
        label.textContent = '▲ TILTING UP';
        label.style.opacity = Math.min(p / 0.1, 0.85);
      } else if (p < 0.56) {
        label.textContent = '— HOLDING —';
        label.style.opacity = '0.5';
      } else {
        label.textContent = '▼ TILTING DOWN';
        label.style.opacity = Math.min((1 - p) / 0.1, 0.85);
      }
    }

    if (rec) {
      rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360)));
    }
  }, [setTilt]);

  const resetFn = useCallback(() => {
    setTilt(A_START);
    const label = labelRef.current;
    const rec = recRef.current;
    const hit = hitRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
    if (hit) hit.style.opacity = '0';
  }, [setTilt]);

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
      aria-label="Tilt camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>
      
      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--classic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>
      
      {/* Floor */}
      <div className="camera-move-card__floor-line" />
      <div className="camera-move-card__floor-fade" />
      
      {/* FOV Visualization SVG */}
      <svg 
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <g ref={camGRef} transform={`translate(${CX},${CY}) rotate(${A_START})`}>
          {/* Camera body */}
          <rect x="-6" y="-10" width="28" height="20" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="0.75"/>
          <rect x="22" y="-6" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"/>
          <circle cx="8" cy="0" r="7.5" fill="#0C1445" stroke="#3B82F6" strokeWidth="1.2"/>
          <circle cx="8" cy="0" r="4.5" fill="#1E3A8A"/>
          <circle cx="8" cy="0" r="2" fill="#60A5FA"/>
          <circle cx="5" cy="-3" r="1.2" fill="#BAE6FD" opacity="0.6"/>
          <rect x="3" y="-15" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"/>
        </g>
        
        {/* Main beam */}
        <line ref={beamRef} x1={CX} y1={CY} x2={CX + LEN} y2={CY} stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="2"/>
        
        {/* FOV edges */}
        <line ref={edge1Ref} x1={CX} y1={CY} x2={CX + LEN * 0.85} y2={CY - LEN * 0.15} stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="1"/>
        <line ref={edge2Ref} x1={CX} y1={CY} x2={CX + LEN * 0.85} y2={CY + LEN * 0.15} stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="1"/>
        
        {/* FOV area */}
        <path ref={fovRef} d="" fill="#3B82F6" fillOpacity="0.08"/>
        
        {/* Sweep arc */}
        <path ref={sweepRef} d="" fill="none" stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4"/>
        
        {/* Recording dot on camera */}
        <circle 
          ref={recRef}
          cx={CX + 19} 
          cy={CY - 5} 
          r="2" 
          fill="#EF4444"
          className="camera-move-card__rec-dot"
        />
      </svg>
      
      {/* Subject shadow */}
      <div 
        className="camera-move-card__sil-shadow"
        style={{ bottom: '45px', right: '28px', width: '76px', height: '9px' }}
      />
      
      {/* Stickman */}
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
      
      {/* Hit dot */}
      <div 
        ref={hitRef}
        style={{ 
          position: 'absolute',
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: '#EF4444',
          opacity: 0,
          zIndex: 4
        }}
      />
      
      <div 
        ref={labelRef}
        className="camera-move-card__dir-label camera-move-card__dir-label--classic"
      />
    </div>
  );
}
