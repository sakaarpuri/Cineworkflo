import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Pan Move - Exact copy from classic.html
 * Top-down with FOV sweep visualization
 */
export function PanMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);
  const camGRef = useRef(null);
  const fovRef = useRef(null);
  const edge1Ref = useRef(null);
  const edge2Ref = useRef(null);
  const sweepRef = useRef(null);

  // Camera sits left-centre in viewBox 356x220
  const CX = 80, CY = 110;
  const FOV_HALF = 22; // degrees each side of centre line
  const LEN = 200;
  const SWEEP_R = 150;
  const A_START = -35, A_END = 35;

  const setPan = useCallback((centreDeg) => {
    const camG = camGRef.current;
    const fov = fovRef.current;
    const edge1 = edge1Ref.current;
    const edge2 = edge2Ref.current;
    const sweep = sweepRef.current;

    if (camG) {
      camG.setAttribute('transform', `translate(${CX},${CY}) rotate(${centreDeg})`);
    }

    const toRad = d => d * Math.PI / 180;
    const a1 = toRad(centreDeg - FOV_HALF);
    const a2 = toRad(centreDeg + FOV_HALF);
    const ac = toRad(centreDeg);

    // Centre beam
    if (edge1) {
      const bx = CX + LEN * Math.cos(ac);
      const by = CY + LEN * Math.sin(ac);
      edge1.setAttribute('x1', CX);
      edge1.setAttribute('y1', CY);
      edge1.setAttribute('x2', bx);
      edge1.setAttribute('y2', by);
    }

    // FOV edges
    if (edge2 && fov) {
      const e1x = CX + LEN * 0.9 * Math.cos(a1);
      const e1y = CY + LEN * 0.9 * Math.sin(a1);
      const e2x = CX + LEN * 0.9 * Math.cos(a2);
      const e2y = CY + LEN * 0.9 * Math.sin(a2);
      
      edge2.setAttribute('x1', CX);
      edge2.setAttribute('y1', CY);
      edge2.setAttribute('x2', e2x);
      edge2.setAttribute('y2', e2y);
      
      fov.setAttribute('d', `M${CX},${CY} L${e1x},${e1y} A${LEN * 0.9},${LEN * 0.9} 0 0,1 ${e2x},${e2y} Z`);
    }

    // Sweep arc shows where we came from
    if (sweep) {
      const saStart = toRad(A_START);
      const saEnd = toRad(centreDeg);
      const lf = (centreDeg - A_START) > 180 ? 1 : 0;
      const sx1 = CX + SWEEP_R * Math.cos(saStart);
      const sy1 = CY + SWEEP_R * Math.sin(saStart);
      const sx2 = CX + SWEEP_R * Math.cos(saEnd);
      const sy2 = CY + SWEEP_R * Math.sin(saEnd);
      
      if (Math.abs(centreDeg - A_START) > 1) {
        sweep.setAttribute('d', `M${sx1},${sy1} A${SWEEP_R},${SWEEP_R} 0 ${lf},1 ${sx2},${sy2}`);
      } else {
        sweep.setAttribute('d', '');
      }
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

  // Initialize
  React.useEffect(() => {
    setPan(A_START);
  }, [setPan]);

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
      
      {/* Subject (top-down) */}
      <div 
        className="camera-move-card__stickman-wrap"
        style={{ top: '50%', right: '38px', transform: 'translateY(-50%)' }}
      >
        <svg width="80" height="52" viewBox="0 0 80 52" fill="none" aria-hidden="true">
          <rect x="0" y="26" width="80" height="20" rx="10" fill="#C06A00"/>
          <circle cx="40" cy="22" r="20" fill="#E08500"/>
          <circle cx="40" cy="13" r="8" fill="#C06A00" opacity="0.35"/>
        </svg>
      </div>
      
      {/* FOV Visualization SVG */}
      <svg 
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        {/* Camera group */}
        <g ref={camGRef} transform={`translate(${CX},${CY}) rotate(${A_START})`}>
          <rect x="-6" y="-10" width="28" height="20" rx="4" fill="#1E40AF" stroke="#3B82F6" strokeWidth="0.75"/>
          <rect x="22" y="-6" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"/>
          <circle cx="8" cy="0" r="7.5" fill="#0C1445" stroke="#3B82F6" strokeWidth="1.2"/>
          <circle cx="8" cy="0" r="4.5" fill="#1E3A8A"/>
          <circle cx="8" cy="0" r="2" fill="#60A5FA"/>
          <circle cx="5" cy="-3" r="1.2" fill="#BAE6FD" opacity="0.6"/>
          <rect x="3" y="-15" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#3B82F6" strokeWidth="0.5"/>
        </g>
        
        {/* Centre beam */}
        <line ref={edge1Ref} x1={CX} y1={CY} x2={CX + LEN} y2={CY} stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="2"/>
        
        {/* FOV edge */}
        <line ref={edge2Ref} x1={CX} y1={CY} x2={CX + LEN * 0.9} y2={CY} stroke="#3B82F6" strokeOpacity="0.2" strokeWidth="1"/>
        
        {/* FOV area */}
        <path ref={fovRef} d="" fill="#3B82F6" fillOpacity="0.08"/>
        
        {/* Sweep arc */}
        <path ref={sweepRef} d="" fill="none" stroke="#3B82F6" strokeOpacity="0.25" strokeWidth="1.5" strokeDasharray="4 4"/>
        
        {/* Recording dot */}
        <circle 
          ref={recRef}
          cx={CX + 19} 
          cy={CY - 5} 
          r="2" 
          fill="#EF4444"
          className="camera-move-card__rec-dot"
        />
      </svg>
      
      <div 
        ref={labelRef}
        className="camera-move-card__dir-label camera-move-card__dir-label--classic"
      />
    </div>
  );
}
