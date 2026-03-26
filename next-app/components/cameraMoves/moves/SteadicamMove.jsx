import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Steadicam - smooth follow behind subject (rear follow)
 * Ported from dynamic.html
 */
export function SteadicamMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camGRef = useRef(null);
  const subGRef = useRef(null);
  const fovRef = useRef(null);
  const edge1Ref = useRef(null);
  const edge2Ref = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const X = 178;
  const SUB_Y0 = 126;
  const SUB_Y1 = 88;
  const CAM_Y0 = 208;
  const CAM_Y1 = 182;

  const setSteadicam = useCallback((subX, subY, camX, camY, subScale, swayDeg) => {
    const camG = camGRef.current;
    const subG = subGRef.current;
    const fov = fovRef.current;
    const edge1 = edge1Ref.current;
    const edge2 = edge2Ref.current;

    if (!camG || !subG || !fov || !edge1 || !edge2) return;

    camG.setAttribute('transform', `translate(${camX},${camY})`);
    subG.setAttribute('transform', `translate(${subX},${subY}) scale(${subScale}) rotate(${swayDeg})`);

    const camY2 = camY;
    const tgtX = subX;
    const tgtY = subY - 12 * subScale;
    const halfW = 44 * subScale;
    const x1 = tgtX - halfW;
    const y1 = tgtY;
    const x2 = tgtX + halfW;
    const y2 = tgtY;

    edge1.setAttribute('x1', camX);
    edge1.setAttribute('y1', camY2);
    edge1.setAttribute('x2', x1);
    edge1.setAttribute('y2', y1);

    edge2.setAttribute('x1', camX);
    edge2.setAttribute('y1', camY2);
    edge2.setAttribute('x2', x2);
    edge2.setAttribute('y2', y2);

    fov.setAttribute('d', `M${camX},${camY2} L${x1},${y1} L${x2},${y2} Z`);
  }, []);

  const animateFn = useCallback((p, ts) => {
    let s;
    if (p < 0.44) s = easeInOut(p / 0.44);
    else if (p < 0.56) s = 1;
    else s = 1 - easeInOut((p - 0.56) / 0.44);

    const lead = Math.min(1, s * 1.06);
    const catchUp = Math.max(0, Math.min(1, (s - 0.14) / 0.86));

    const subY = SUB_Y0 + lead * (SUB_Y1 - SUB_Y0);
    const camY = CAM_Y0 + easeInOut(catchUp) * (CAM_Y1 - CAM_Y0);

    const moving = (p < 0.44 || p > 0.56);
    const intensity = moving ? 1 : 0.35;
    const WALK_MS = 560;
    const LAG_MS = 130;

    const bobSub = Math.sin(ts / WALK_MS * Math.PI * 2) * (1.15 * intensity);
    const bobCam = Math.sin((ts - LAG_MS) / WALK_MS * Math.PI * 2) * (0.85 * intensity);

    const swayXSub = Math.sin(ts / (WALK_MS * 1.35) * Math.PI * 2) * (2.6 * intensity);
    const swayXCam = Math.sin((ts - LAG_MS) / (WALK_MS * 1.35) * Math.PI * 2) * (1.9 * intensity);

    const swayDegSub = Math.sin(ts / (WALK_MS * 1.55) * Math.PI * 2) * (1.35 * intensity);
    const subScale = 1.02 - 0.10 * lead;

    setSteadicam(X + swayXSub, subY + bobSub, X + swayXCam, camY + bobCam * 0.7, subScale, swayDegSub);

    const label = labelRef.current;
    const rec = recRef.current;

    if (label) {
      label.textContent = p < 0.44 ? '▶▶ GLIDING BEHIND' : p < 0.56 ? '— LOCKED IN —' : '◀◀ GLIDING BACK';
      label.style.opacity = p < 0.44
        ? String(Math.min(p / 0.12, 0.85))
        : p < 0.56
          ? '0.5'
          : String(Math.min((1 - p) / 0.12, 0.85));
    }

    if (rec) rec.style.opacity = String(0.5 + 0.5 * Math.abs(Math.sin(ts / 520)));
  }, [setSteadicam]);

  const resetFn = useCallback(() => {
    setSteadicam(X, SUB_Y0, X, CAM_Y0, 1.02, 0);
    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
  }, [setSteadicam]);

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
      aria-label="Steadicam camera movement animation"
    >
      <span className="camera-move-card__view-label">REAR FOLLOW</span>

      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--dynamic">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>

      <div className="camera-move-card__floor-fade" />

      <svg
        className="camera-move-card__dotted-track"
        viewBox="0 0 356 220"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
        style={{ zIndex: 3 }}
      >
        {/* Perspective guides */}
        <line x1="36" y1="214" x2="178" y2="48" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="320" y1="214" x2="178" y2="48" stroke="#ffffff" strokeOpacity="0.06" strokeWidth="1" />
        <line x1="120" y1="214" x2="178" y2="48" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
        <line x1="236" y1="214" x2="178" y2="48" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
        {/* Cross lines */}
        <line x1="80" y1="84" x2="276" y2="84" stroke="#ffffff" strokeOpacity="0.035" strokeWidth="1" />
        <line x1="70" y1="104" x2="286" y2="104" stroke="#ffffff" strokeOpacity="0.04" strokeWidth="1" />
        <line x1="58" y1="128" x2="298" y2="128" stroke="#ffffff" strokeOpacity="0.045" strokeWidth="1" />
        <line x1="44" y1="156" x2="312" y2="156" stroke="#ffffff" strokeOpacity="0.05" strokeWidth="1" />
        <line x1="30" y1="188" x2="326" y2="188" stroke="#ffffff" strokeOpacity="0.055" strokeWidth="1" />

        {/* Centre travel line */}
        <line x1="178" y1="214" x2="178" y2="56" stroke="#BE185D" strokeOpacity="0.18" strokeWidth="1.5" strokeDasharray="7 7" />

        {/* FOV */}
        <path ref={fovRef} d="" fill="#BE185D" fillOpacity="0.055" />
        <line ref={edge1Ref} x1="0" y1="0" x2="0" y2="0" stroke="#FB7185" strokeOpacity="0.28" strokeWidth="1" strokeDasharray="5 4" />
        <line ref={edge2Ref} x1="0" y1="0" x2="0" y2="0" stroke="#FB7185" strokeOpacity="0.18" strokeWidth="1" strokeDasharray="5 4" />

        {/* Camera (behind) */}
        <g ref={camGRef} transform="translate(178,208)" className="camera-move-card__camera-glow">
          <rect x="-18" y="-13" width="36" height="26" rx="9" fill="#FDF2F8" stroke="#FB7185" strokeWidth="1" />
          <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#2563EB" stroke="#1D4ED8" strokeWidth="0.9" />
          <rect x="14" y="-5" width="9" height="10" rx="2" fill="#1D4ED8" />
          <circle cx="0" cy="0" r="6" fill="#0C1445" stroke="#93C5FD" strokeWidth="1.15" />
          <circle cx="0" cy="0" r="3" fill="#1E3A8A" />
          <circle cx="0" cy="0" r="1.2" fill="#60A5FA" />
          <circle ref={recRef} cx="11" cy="-7" r="1.8" fill="#EF4444" className="camera-move-card__rec-dot" />
        </g>

        {/* Subject (walking away) */}
        <g ref={subGRef} transform="translate(178,126) scale(1.02)">
          <circle cx="0" cy="-30" r="10.5" fill="#E08500" />
          <circle cx="0" cy="-35.5" r="4.5" fill="#C06A00" opacity="0.35" />
          <rect x="-18" y="-18" width="36" height="24" rx="12" fill="#C06A00" />
          <path d="M-16 2 C-10 16, 10 16, 16 2 L12 26 L-12 26 Z" fill="#E08500" />
          <path d="M-10 24 L-4 58 L-14 58 L-18 28 Z" fill="#C06A00" opacity="0.9" />
          <path d="M10 24 L16 58 L6 58 L2 28 Z" fill="#C06A00" opacity="0.9" />
          <rect x="-18" y="56" width="18" height="6" rx="3" fill="#C06A00" />
          <rect x="0" y="56" width="18" height="6" rx="3" fill="#C06A00" />
        </g>
      </svg>

      <div ref={labelRef} className="camera-move-card__dir-label camera-move-card__dir-label--dynamic" />
    </div>
  );
}
