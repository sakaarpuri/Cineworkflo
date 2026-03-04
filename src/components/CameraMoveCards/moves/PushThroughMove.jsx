import React, { useRef, useCallback } from 'react';
import { useCameraAnimation, easeInOut } from '../useCameraAnimation';

/**
 * Push Through - camera pushes through foreground and past the subject plane
 * Ported from modern.html
 */
export function PushThroughMove({ isHovered }) {
  const stageRef = useRef(null);
  const hintRef = useRef(null);
  const camRef = useRef(null);
  const objRef = useRef(null);
  const cutRef = useRef(null);
  const subRef = useRef(null);
  const topLRef = useRef(null);
  const botLRef = useRef(null);
  const noteRef = useRef(null);
  const labelRef = useRef(null);
  const recRef = useRef(null);

  const SX = 20;
  const EX = 246;
  const CAM_X0 = 44;
  const SUB_X = 179;
  const CY = 110;
  const OBJ_X = 148;
  const OBJ_W = 62;

  const noteOnRef = useRef(false);

  const setPush = useCallback((x) => {
    const cam = camRef.current;
    const obj = objRef.current;
    const cut = cutRef.current;
    const sub = subRef.current;
    const topL = topLRef.current;
    const botL = botLRef.current;
    const note = noteRef.current;

    if (!cam || !obj || !cut || !sub || !topL || !botL || !note) return;

    cam.style.left = x + 'px';
    const camX = CAM_X0 + (x - SX);

    const camFront = x + 46;
    const mid = OBJ_X + OBJ_W / 2;
    const dist = Math.abs(camFront - mid);
    const near = 1 - Math.min(dist / 56, 1);
    const passed = camFront > (OBJ_X + OBJ_W);
    const passedSubject = camFront > SUB_X;

    const fovHalf = 86;
    const targetX = passedSubject ? Math.min(camX + 180, 340) : SUB_X;
    const spread = passedSubject ? 0.62 : 1.0;

    topL.setAttribute('x1', camX);
    topL.setAttribute('y1', CY);
    topL.setAttribute('x2', targetX);
    topL.setAttribute('y2', CY - fovHalf * spread);
    botL.setAttribute('x1', camX);
    botL.setAttribute('y1', CY);
    botL.setAttribute('x2', targetX);
    botL.setAttribute('y2', CY + fovHalf * spread);

    const o = passed ? 0.20 : (0.18 + 0.32 * (1 - near));
    obj.style.opacity = String(o);
    cut.style.opacity = String(passed ? 0.10 : 0.55);
    obj.style.transform = passed ? 'scale(0.98)' : 'scale(1)';

    sub.style.opacity = passedSubject ? '0.78' : '1';

    const NOTE_MAX = 0.8;
    const holdDist = 140;
    if (!noteOnRef.current && near > 0.35) noteOnRef.current = true;
    if (passedSubject) noteOnRef.current = true;
    const keepVisible = !passedSubject || (camFront - SUB_X) < holdDist;
    note.setAttribute('fill-opacity', noteOnRef.current && keepVisible ? String(NOTE_MAX) : '0');
  }, []);

  const animateFn = useCallback((p, ts) => {
    let x;
    if (p < 0.44) x = SX + easeInOut(p / 0.44) * (EX - SX);
    else if (p < 0.56) x = EX;
    else x = EX - easeInOut((p - 0.56) / 0.44) * (EX - SX);

    setPush(x);

    const label = labelRef.current;
    const rec = recRef.current;
    if (label) {
      label.textContent = p < 0.44 ? '▶▶ PUSHING THROUGH' : p < 0.56 ? '— PAST SUBJECT —' : '◀◀ RESET';
      label.style.opacity = p < 0.44
        ? String(Math.min(p / 0.12, 0.85))
        : p < 0.56
          ? '0.55'
          : String(Math.min((1 - p) / 0.12, 0.85));
    }

    if (rec) rec.style.opacity = String(0.35 + 0.65 * Math.abs(Math.sin(ts / 220)));
  }, [setPush]);

  const resetFn = useCallback(() => {
    noteOnRef.current = false;
    setPush(SX);
    const label = labelRef.current;
    const rec = recRef.current;
    const note = noteRef.current;
    if (label) {
      label.style.opacity = '0';
      label.textContent = '';
    }
    if (rec) rec.style.opacity = '1';
    if (note) note.setAttribute('fill-opacity', '0');
  }, [setPush]);

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
      className="camera-move-card__stage camera-move-card__stage--ainative camera-move-card__stage--idle"
      aria-label="Push through camera movement animation"
    >
      <span className="camera-move-card__view-label">SIDE VIEW</span>

      <div className="camera-move-card__floor-line" />
      <div className="camera-move-card__floor-fade" />

      <div className="camera-move-card__hint" ref={hintRef}>
        <div className="camera-move-card__hint-pill camera-move-card__hint-pill--ainative">
          <div className="camera-move-card__play-icon" />
          HOVER TO PLAY
        </div>
      </div>

      {/* Foreground object (like a doorway / branch) */}
      <div
        ref={objRef}
        style={{
          position: 'absolute',
          left: `${OBJ_X}px`,
          bottom: '58px',
          width: `${OBJ_W}px`,
          height: '130px',
          borderRadius: '18px',
          border: '1px solid rgba(167,139,250,0.35)',
          background: 'linear-gradient(180deg, rgba(167,139,250,0.35), rgba(109,40,217,0.16))',
          zIndex: 4,
          boxShadow: '0 10px 24px rgba(109,40,217,0.10)',
          backdropFilter: 'blur(1px)',
          opacity: 0.5,
          transition: 'opacity 0.08s linear'
        }}
      />
      <div
        ref={cutRef}
        style={{
          position: 'absolute',
          left: `${OBJ_X + 12}px`,
          bottom: '70px',
          width: `${OBJ_W - 24}px`,
          height: '106px',
          borderRadius: '14px',
          background: 'rgba(8,15,24,0.55)',
          border: '1px solid rgba(255,255,255,0.06)',
          zIndex: 5,
          opacity: 0.55,
          transition: 'opacity 0.08s linear'
        }}
      />

      {/* Subject stands inside window plane */}
      <div className="camera-move-card__sil-shadow" style={{ bottom: '45px', left: `${SUB_X - 38}px`, width: '76px', height: '9px' }} />
      <div ref={subRef} className="camera-move-card__stickman-wrap" style={{ bottom: '48px', left: `${SUB_X - 28}px`, zIndex: 2 }}>
        <svg width="56" height="142" viewBox="0 0 56 142" fill="none" aria-hidden="true">
          <circle cx="28" cy="12" r="11" className="camera-move-card__fig-main" />
          <rect x="23" y="22" width="10" height="8" rx="3" className="camera-move-card__fig-main" />
          <path d="M7 30C7 27 17 25 28 25C39 25 49 27 49 30L45 66L11 66Z" className="camera-move-card__fig-main" />
          <path d="M9 32L3 72L11 73L15 34Z" className="camera-move-card__fig-dark" />
          <circle cx="6" cy="75" r="5" className="camera-move-card__fig-dark" />
          <path d="M47 32L53 72L45 73L41 34Z" className="camera-move-card__fig-dark" />
          <circle cx="50" cy="75" r="5" className="camera-move-card__fig-dark" />
          <path d="M11 64L45 64L42 78L14 78Z" className="camera-move-card__fig-dark" />
          <path d="M14 76L12 124L22 124L24 76Z" className="camera-move-card__fig-main" />
          <path d="M11 122L23 122L24 132L9 132Z" className="camera-move-card__fig-dark" />
          <path d="M32 76L34 124L44 124L42 76Z" className="camera-move-card__fig-main" />
          <path d="M32 122L44 122L46 132L31 132Z" className="camera-move-card__fig-dark" />
        </svg>
      </div>

      {/* Camera */}
      <div ref={camRef} className="camera-move-card__camera camera-move-card__camera-glow" style={{ position: 'absolute', bottom: '52px', left: `${SX}px`, zIndex: 4 }}>
        <svg width="46" height="32" viewBox="0 0 46 32" fill="none" aria-hidden="true">
          <rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.85" />
          <rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#A78BFA" strokeWidth="0.6" />
          <circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke="#A78BFA" strokeWidth="1.2" />
          <circle cx="16" cy="17" r="4.5" fill="#1E3A8A" />
          <circle cx="16" cy="17" r="2" fill="#60A5FA" />
          <circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6" />
          <rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#A78BFA" strokeWidth="0.6" />
          <circle ref={recRef} cx="27" cy="10" r="2" fill="#EF4444" className="camera-move-card__rec-dot" />
        </svg>
      </div>

      {/* FOV lines */}
      <svg className="camera-move-card__dotted-track" viewBox="0 0 356 220" preserveAspectRatio="xMidYMid slice" aria-hidden="true" style={{ zIndex: 3 }}>
        <line ref={topLRef} x1="0" y1="0" x2="0" y2="0" stroke="#8B5CF6" strokeOpacity="0.26" strokeWidth="1" strokeDasharray="5 4" />
        <line ref={botLRef} x1="0" y1="0" x2="0" y2="0" stroke="#8B5CF6" strokeOpacity="0.20" strokeWidth="1" strokeDasharray="5 4" />
        <text
          ref={noteRef}
          x="86"
          y="32"
          fill="#A78BFA"
          fillOpacity="0"
          fontSize="8"
          fontFamily="monospace"
          letterSpacing="0.05em"
        >
          THROUGH FOREGROUND
        </text>
      </svg>

      <div ref={labelRef} className="camera-move-card__dir-label camera-move-card__dir-label--ainative" />
    </div>
  );
}
