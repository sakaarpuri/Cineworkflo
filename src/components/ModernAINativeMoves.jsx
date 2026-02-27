import React from "react";

export default function ModernAINativeMoves() {
  return (
    <div className="cm-root">
      <style>{css}</style>

      <header className="cm-header">
        <div className="cm-eyebrow">MODERN / AI‑NATIVE</div>
        <h1 className="cm-title">Modern Camera Movements</h1>
        <p className="cm-subtitle">
          Moves that are new, hard, or sometimes impossible in real filmmaking — but easy in AI video.
          <br />
          Hover each card to see the motion logic.
        </p>
      </header>

      <div className="cm-grid">
        {/* 1) ORBIT / 360 */}
        <article className="cm-card">
          <div className="cm-badgeRow">
            <span className="cm-badge">AI‑NATIVE MOVE</span>
          </div>
          <div className="cm-titleRow">
            <span className="cm-moveName">Orbit / 360</span>
            <span className="cm-moveTag">circles subject</span>
          </div>

          <div className="cm-stage">
            <span className="cm-viewLabel">TOP‑DOWN VIEW</span>
            <div className="cm-hoverHint">
              <div className="cm-hintPill">
                <div className="cm-playTri" />
                HOVER TO PLAY
              </div>
            </div>

            <svg className="cm-stageSvg" viewBox="0 0 356 220" aria-hidden="true">
              <circle cx="178" cy="110" r="74" fill="none" stroke="#8B5CF6" opacity="0.18" strokeWidth="1.5" strokeDasharray="6 6" />

              {/* Subject */}
              <g transform="translate(178,110)">
                <circle cx="0" cy="0" r="18" fill="#E08500" />
                <rect x="-28" y="10" width="56" height="18" rx="9" fill="#C06A00" />
                <circle cx="0" cy="-6" r="7" fill="#C06A00" opacity="0.35" />
              </g>

              {/* Orbit system */}
              <g className="cm-orbitSystem">
                {/* Camera rides the orbit */}
                <g className="cm-orbitCam" transform="translate(178,36)">
                  <path
                    className="cm-fov"
                    d="M0,0 L120,-44 L120,44 Z"
                    fill="#6D28D9"
                    fillOpacity="0.055"
                  />
                  <line x1="0" y1="0" x2="120" y2="-44" stroke="#8B5CF6" opacity="0.35" strokeWidth="1" strokeDasharray="5 4" />
                  <line x1="0" y1="0" x2="120" y2="44" stroke="#8B5CF6" opacity="0.22" strokeWidth="1" strokeDasharray="5 4" />

                  <g>
                    <rect x="-14" y="-9" width="28" height="18" rx="3" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.75" />
                    <rect x="14" y="-5" width="9" height="10" rx="2" fill="#1D4ED8" />
                    <circle cx="0" cy="0" r="6" fill="#0C1445" stroke="#A78BFA" strokeWidth="1" />
                    <circle cx="0" cy="0" r="3" fill="#1E3A8A" />
                    <circle cx="0" cy="0" r="1.2" fill="#60A5FA" />
                    <circle className="cm-rec" cx="11" cy="-7" r="1.8" fill="#EF4444" />
                  </g>
                </g>
              </g>
            </svg>

            <div className="cm-dirLabel cm-orbitLbl">↻ ORBITING</div>
          </div>

          <p className="cm-desc">
            The camera <strong>circles the subject</strong> while always keeping them centered. Great for hero moments and high‑impact reveals.
          </p>
          <div className="cm-feelRow">
            <span className="cm-feelIcon">🎬</span>
            <span className="cm-feelText">
              <strong>Feels like:</strong> The world rotates around the character. Bold, stylized, and high‑impact.
            </span>
          </div>
          <div className="cm-promptRow">
            <div className="cm-promptLabel">✏️ ADD TO YOUR PROMPT</div>
            <div className="cm-promptChip">
              <span className="cm-var">360 orbit</span> around subject, <span className="cm-var">camera circles</span>,{" "}
              <span className="cm-var">keeps subject centered</span>, <span className="cm-var">smooth cinematic rotation</span>
            </div>
          </div>
        </article>

        {/* 2) DRONE / AERIAL */}
        <article className="cm-card">
          <div className="cm-badgeRow">
            <span className="cm-badge">AI‑NATIVE MOVE</span>
          </div>
          <div className="cm-titleRow">
            <span className="cm-moveName">Drone / Aerial</span>
            <span className="cm-moveTag">rise up + away</span>
          </div>

          <div className="cm-stage cm-hasFloor">
            <span className="cm-viewLabel">AERIAL LIFT</span>
            <div className="cm-floorLine" />
            <div className="cm-floorFade" />
            <div className="cm-hoverHint">
              <div className="cm-hintPill">
                <div className="cm-playTri" />
                HOVER TO PLAY
              </div>
            </div>

            <div className="cm-shadow cm-droneShadow" />
            <div className="cm-stick cm-droneSubject">
              <Stickman />
            </div>

            <div className="cm-droneRig">
              <svg width="72" height="44" viewBox="0 0 72 44" fill="none" aria-hidden="true">
                <line x1="12" y1="22" x2="60" y2="22" stroke="#A78BFA" opacity="0.55" strokeWidth="3" strokeLinecap="round" />
                <line x1="22" y1="10" x2="50" y2="34" stroke="#A78BFA" opacity="0.4" strokeWidth="3" strokeLinecap="round" />
                <line x1="50" y1="10" x2="22" y2="34" stroke="#A78BFA" opacity="0.4" strokeWidth="3" strokeLinecap="round" />
                <rect x="28" y="16" width="16" height="12" rx="4" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.9" />
                <circle cx="36" cy="22" r="4.5" fill="#0C1445" stroke="#A78BFA" strokeWidth="0.9" />
                <circle cx="36" cy="22" r="1.8" fill="#60A5FA" />
                <circle cx="12" cy="22" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" opacity="0.35" />
                <circle cx="60" cy="22" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" opacity="0.35" />
                <circle cx="22" cy="10" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" opacity="0.35" />
                <circle cx="50" cy="34" r="6" fill="#6D28D9" fillOpacity="0.22" stroke="#A78BFA" opacity="0.35" />
                <circle className="cm-rec cm-droneRec" cx="44" cy="18" r="2" fill="#EF4444" />
              </svg>
            </div>

            <div className="cm-dirLabel cm-droneLbl">▲ RISING + PULLING BACK</div>
          </div>

          <p className="cm-desc">
            The camera <strong>rises and pulls away</strong>, revealing context and scale. The subject visibly gets smaller as distance increases.
          </p>
          <div className="cm-feelRow">
            <span className="cm-feelIcon">🎬</span>
            <span className="cm-feelText">
              <strong>Feels like:</strong> Expansion and grandeur. A reveal that opens the world.
            </span>
          </div>
          <div className="cm-promptRow">
            <div className="cm-promptLabel">✏️ ADD TO YOUR PROMPT</div>
            <div className="cm-promptChip">
              <span className="cm-var">drone aerial</span>, <span className="cm-var">rise up and pull back</span>,{" "}
              <span className="cm-var">overhead reveal</span>, <span className="cm-var">wide establishing scale</span>
            </div>
          </div>
        </article>

        {/* 3) DOLLY ZOOM */}
        <article className="cm-card">
          <div className="cm-badgeRow">
            <span className="cm-badge">AI‑NATIVE MOVE</span>
          </div>
          <div className="cm-titleRow">
            <span className="cm-moveName">Dolly Zoom (Vertigo)</span>
            <span className="cm-moveTag">dolly back + zoom in</span>
          </div>

          <div className="cm-stage cm-hasFloor">
            <span className="cm-viewLabel">SIDE VIEW</span>
            <div className="cm-floorLine" />
            <div className="cm-floorFade" />
            <div className="cm-hoverHint">
              <div className="cm-hintPill">
                <div className="cm-playTri" />
                HOVER TO PLAY
              </div>
            </div>

            <div className="cm-vertWorld" aria-hidden="true">
              <svg viewBox="0 0 356 220" preserveAspectRatio="none">
                <line x1="40" y1="0" x2="40" y2="220" stroke="white" strokeWidth="2" />
                <line x1="94" y1="0" x2="94" y2="220" stroke="white" strokeWidth="1.5" />
                <line x1="140" y1="0" x2="140" y2="220" stroke="white" strokeWidth="1.2" />
                <line x1="178" y1="0" x2="178" y2="220" stroke="white" strokeWidth="1.1" />
                <line x1="216" y1="0" x2="216" y2="220" stroke="white" strokeWidth="1.2" />
                <line x1="262" y1="0" x2="262" y2="220" stroke="white" strokeWidth="1.5" />
                <line x1="316" y1="0" x2="316" y2="220" stroke="white" strokeWidth="2" />
              </svg>
            </div>

            <div className="cm-shadow cm-vertShadow" />
            <div className="cm-stick cm-vertSubject">
              <Stickman />
            </div>

            <div className="cm-vertCam">
              <Camera />
            </div>

            {/* FOV swap is simplified: we visually narrow the FOV while the camera moves back */}
            <div className="cm-vertFovWrap" aria-hidden="true">
              <div className="cm-vertFovLine cm-vertTop" />
              <div className="cm-vertFovLine cm-vertBot" />
              <div className="cm-vertNote">PERSPECTIVE WARPS</div>
            </div>

            <div className="cm-dirLabel cm-vertLbl">
              <span className="cm-vertLblOut">DOLLY OUT + ZOOM IN</span>
              <span className="cm-vertLblIn">DOLLY IN + ZOOM OUT</span>
            </div>
          </div>

          <p className="cm-desc">
            Dolly back while zooming in: the subject <strong>feels farther</strong> yet slightly <strong>grows</strong> to stay near natural size, while the background warps.
          </p>
          <div className="cm-feelRow">
            <span className="cm-feelIcon">🎬</span>
            <span className="cm-feelText">
              <strong>Feels like:</strong> Reality bends. Dread, vertigo, shock, or “the room closes in.”
            </span>
          </div>
          <div className="cm-promptRow">
            <div className="cm-promptLabel">✏️ ADD TO YOUR PROMPT</div>
            <div className="cm-promptChip">
              <span className="cm-var">dolly zoom</span>, <span className="cm-var">vertigo effect</span>,{" "}
              <span className="cm-var">dolly out while zooming in</span>, <span className="cm-var">warped perspective</span>
            </div>
          </div>
        </article>

        {/* 4) PUSH THROUGH */}
        <article className="cm-card">
          <div className="cm-badgeRow">
            <span className="cm-badge">AI‑NATIVE MOVE</span>
          </div>
          <div className="cm-titleRow">
            <span className="cm-moveName">Push Through</span>
            <span className="cm-moveTag">through foreground</span>
          </div>

          <div className="cm-stage cm-hasFloor">
            <span className="cm-viewLabel">SIDE VIEW</span>
            <div className="cm-floorLine" />
            <div className="cm-floorFade" />
            <div className="cm-hoverHint">
              <div className="cm-hintPill">
                <div className="cm-playTri" />
                HOVER TO PLAY
              </div>
            </div>

            {/* Foreground portal/window */}
            <div className="cm-pushObj" />
            <div className="cm-pushCut" />

            {/* Subject at portal (halfway), so camera can pass through */}
            <div className="cm-shadow cm-pushShadow" />
            <div className="cm-stick cm-pushSubject">
              <Stickman />
            </div>

            {/* Camera */}
            <div className="cm-pushCam">
              <Camera glow="rgba(139,92,246,0.65)" />
            </div>

            {/* Dotted lines: "to subject" first, then "forward" after passing */}
            <div className="cm-pushFov" aria-hidden="true">
              <div className="cm-pushFovTo">
                <div className="cm-pushLine cm-pushLineTop" />
                <div className="cm-pushLine cm-pushLineBot" />
              </div>
              <div className="cm-pushFovForward">
                <div className="cm-pushLine cm-pushLineTop" />
                <div className="cm-pushLine cm-pushLineBot" />
              </div>
              <div className="cm-pushNote">THROUGH FOREGROUND</div>
            </div>

            <div className="cm-dirLabel cm-pushLbl">▶▶ PUSHING THROUGH</div>
          </div>

          <p className="cm-desc">
            The camera <strong>pushes through the foreground</strong> and continues <strong>past the subject plane</strong>. The dashed lines lock onto the subject, then switch forward.
          </p>
          <div className="cm-feelRow">
            <span className="cm-feelIcon">🎬</span>
            <span className="cm-feelText">
              <strong>Feels like:</strong> Discovery and momentum. A reveal that breaks physical camera constraints.
            </span>
          </div>
          <div className="cm-promptRow">
            <div className="cm-promptLabel">✏️ ADD TO YOUR PROMPT</div>
            <div className="cm-promptChip">
              <span className="cm-var">push through</span> foreground object, <span className="cm-var">camera passes through</span>,{" "}
              <span className="cm-var">reveal subject</span>, <span className="cm-var">seamless cinematic transition</span>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

function Stickman() {
  return (
    <svg width="56" height="142" viewBox="0 0 56 142" fill="none" aria-hidden="true">
      <circle cx="28" cy="12" r="11" fill="#E08500" />
      <rect x="23" y="22" width="10" height="8" rx="3" fill="#E08500" />
      <path d="M7 30C7 27 17 25 28 25C39 25 49 27 49 30L45 66L11 66Z" fill="#E08500" />
      <path d="M9 32L3 72L11 73L15 34Z" fill="#C06A00" />
      <circle cx="6" cy="75" r="5" fill="#C06A00" />
      <path d="M47 32L53 72L45 73L41 34Z" fill="#C06A00" />
      <circle cx="50" cy="75" r="5" fill="#C06A00" />
      <path d="M11 64L45 64L42 78L14 78Z" fill="#C06A00" />
      <path d="M14 76L12 124L22 124L24 76Z" fill="#E08500" />
      <path d="M11 122L23 122L24 132L9 132Z" fill="#C06A00" />
      <path d="M32 76L34 124L44 124L42 76Z" fill="#E08500" />
      <path d="M32 122L44 122L46 132L31 132Z" fill="#C06A00" />
    </svg>
  );
}

function Camera({ glow = "rgba(109,40,217,0.6)" }) {
  return (
    <svg
      width="46"
      height="32"
      viewBox="0 0 46 32"
      fill="none"
      aria-hidden="true"
      style={{ filter: `drop-shadow(0 0 10px ${glow})` }}
    >
      <rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke="#A78BFA" strokeWidth="0.85" />
      <rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#A78BFA" strokeWidth="0.6" />
      <circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke="#A78BFA" strokeWidth="1.2" />
      <circle cx="16" cy="17" r="4.5" fill="#1E3A8A" />
      <circle cx="16" cy="17" r="2" fill="#60A5FA" />
      <circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6" />
      <rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#A78BFA" strokeWidth="0.6" />
      <circle className="cm-rec" cx="27" cy="10" r="2" fill="#EF4444" />
    </svg>
  );
}

const css = `
.cm-root{
  font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
  background:#F0EEE9;
  padding:60px 24px 80px;
}
.cm-header{ text-align:center; margin-bottom:52px; }
.cm-eyebrow{
  display:inline-block;
  font-size:10px; font-weight:900; letter-spacing:0.14em;
  color:#6D28D9; background:#F5F3FF;
  border:1px solid #DDD6FE;
  padding:4px 14px; border-radius:999px; margin-bottom:14px;
}
.cm-title{ font-size:36px; font-weight:900; color:#111827; letter-spacing:-0.03em; margin-bottom:10px; line-height:1.15; }
.cm-subtitle{ font-size:15px; color:#6B7280; line-height:1.6; }

.cm-grid{
  display:grid;
  grid-template-columns:repeat(auto-fill,minmax(360px,1fr));
  gap:28px;
  max-width:1200px;
  margin:0 auto;
}

.cm-card{
  background:#fff;
  border:1.5px solid #E2DDD6;
  border-radius:22px;
  overflow:hidden;
  box-shadow:0 4px 32px rgba(0,0,0,0.07);
}
.cm-badgeRow{ padding:16px 22px 0; }
.cm-badge{
  font-size:10px; font-weight:900; letter-spacing:0.12em;
  color:#6D28D9; background:#F5F3FF; border:1px solid #DDD6FE;
  padding:3px 10px; border-radius:999px; display:inline-block;
}
.cm-titleRow{ padding:8px 22px 2px; display:flex; align-items:baseline; justify-content:space-between; }
.cm-moveName{ font-size:24px; font-weight:900; color:#111827; letter-spacing:-0.03em; }
.cm-moveTag{ font-size:11px; color:#9CA3AF; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace; }

.cm-stage{
  margin:12px 22px;
  background:#080F18;
  border-radius:16px;
  height:220px;
  position:relative;
  overflow:hidden;
  border:1.5px solid #1a2535;
  cursor:pointer;
  user-select:none;
}
.cm-hasFloor{ }
.cm-floorLine{
  position:absolute; bottom:48px; left:0; right:0; height:1px;
  background:linear-gradient(90deg, transparent, #ffffff08 20%, #ffffff12 50%, #ffffff08 80%, transparent);
}
.cm-floorFade{
  position:absolute; bottom:0; left:0; right:0; height:48px;
  background:linear-gradient(to bottom, transparent, #080F18);
}
.cm-viewLabel{
  position:absolute; top:11px; right:14px;
  font-size:9px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color:#4B6A8A; letter-spacing:0.1em; z-index:2;
}
.cm-hoverHint{
  position:absolute; inset:0;
  display:flex; align-items:center; justify-content:center;
  z-index:6; pointer-events:none;
  transition:opacity 0.35s ease;
  background:rgba(8,15,24,0.38);
  border-radius:15px;
}
.cm-hintPill{
  display:flex; align-items:center; gap:9px;
  background:#6D28D9; color:#fff;
  font-size:11px; font-weight:900;
  font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  letter-spacing:0.09em;
  padding:9px 20px; border-radius:999px;
  box-shadow:0 0 0 5px #6D28D925, 0 4px 18px #6D28D955;
}
.cm-playTri{ width:0;height:0;border-style:solid;border-width:5px 0 5px 9px;border-color:transparent transparent transparent #fff; }

.cm-dirLabel{
  position:absolute; bottom:26px; left:14px;
  font-size:9px; font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color:#8B5CF6; letter-spacing:0.07em; z-index:3; opacity:0;
  transition:opacity 0.2s ease;
}

.cm-desc{ padding:8px 22px 10px; font-size:13px; color:#4B5563; line-height:1.65; }
.cm-feelRow{
  margin:2px 22px 12px; background:#FAFAF8; border:1px solid #F0EDE6;
  border-radius:10px; padding:10px 14px;
  display:flex; gap:10px; align-items:flex-start;
}
.cm-feelIcon{ font-size:15px; flex-shrink:0; margin-top:1px; }
.cm-feelText{ font-size:12px; color:#6B7280; line-height:1.55; }
.cm-feelText strong{ color:#374151; font-weight:800; }
.cm-promptRow{ margin:0 22px 20px; }
.cm-promptLabel{ font-size:10px; font-weight:900; color:#9CA3AF; letter-spacing:0.08em; margin-bottom:7px; }
.cm-promptChip{
  background:#F5F3FF; border:1px solid #DDD6FE;
  border-radius:10px; padding:10px 14px;
  font-family:ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  font-size:11px; color:#4C1D95; line-height:1.75;
}
.cm-var{ color:#6D28D9; font-weight:900; }

/* Common stage bits */
.cm-stageSvg{ position:absolute; inset:0; width:100%; height:100%; z-index:3; pointer-events:none; }
.cm-rec{ opacity:0.8; }

.cm-stick{ position:absolute; z-index:2; filter: drop-shadow(0 0 6px #E0850015); }
.cm-shadow{
  position:absolute;
  background: radial-gradient(ellipse, #E0850014 0%, transparent 70%);
  border-radius:50%;
  z-index:1;
}

/* Hover triggers */
.cm-stage:hover .cm-hoverHint{ opacity:0; }
.cm-stage:hover .cm-dirLabel{ opacity:0.65; }

/* 1) Orbit */
.cm-orbitSystem{ transform-origin:178px 110px; }
.cm-stage:hover .cm-orbitSystem{
  animation: cm-orbit 3.4s ease-in-out 0s 2 both;
}
.cm-stage:hover .cm-orbitCam .cm-rec{
  animation: cm-recBlink 0.36s linear 0s infinite;
}
.cm-orbitLbl{ opacity:0.6; }
@keyframes cm-orbit{
  0%{ transform:rotate(0deg); }
  44%{ transform:rotate(360deg); }
  56%{ transform:rotate(360deg); }
  100%{ transform:rotate(0deg); }
}

/* 2) Drone */
.cm-droneSubject{ right:40px; bottom:48px; transform-origin: bottom center; }
.cm-droneShadow{ right:30px; bottom:45px; width:76px; height:9px; transform-origin:center center; }
.cm-droneRig{ position:absolute; left:68px; bottom:92px; z-index:4; transform-origin:center center; filter: drop-shadow(0 0 9px rgba(109,40,217,0.55)); }
.cm-stage:hover .cm-droneRig{ animation: cm-droneRig 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-droneSubject{ animation: cm-droneSub 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-droneShadow{ animation: cm-droneSub 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-droneRec{ animation: cm-recBlink 0.22s linear 0s infinite; }
.cm-droneLbl{ opacity:0.6; }
@keyframes cm-droneRig{
  0%{ transform: translate(0,0) scale(1); }
  44%{ transform: translate(-40px, 70px) scale(0.54); }
  56%{ transform: translate(-40px, 70px) scale(0.54); }
  100%{ transform: translate(0,0) scale(1); }
}
@keyframes cm-droneSub{
  0%{ transform: scale(1); opacity:1; }
  44%{ transform: scale(0.58); opacity:0.88; }
  56%{ transform: scale(0.58); opacity:0.88; }
  100%{ transform: scale(1); opacity:1; }
}

/* 3) Vertigo (dolly zoom) */
.cm-vertWorld{
  position:absolute; inset:0; z-index:1; transform-origin:50% 55%; opacity:0.07;
}
.cm-vertWorld svg{ position:absolute; inset:0; width:100%; height:100%; }
.cm-vertShadow{ right:28px; bottom:45px; width:76px; height:9px; }
.cm-vertSubject{ right:38px; bottom:48px; transform-origin:bottom center; }
.cm-vertCam{ position:absolute; left:54px; bottom:52px; z-index:4; }
.cm-vertFovWrap{ position:absolute; inset:0; z-index:3; pointer-events:none; }
.cm-vertFovLine{
  position:absolute;
  left:78px; top:110px;
  width:190px; height:1px;
  background: linear-gradient(90deg, rgba(139,92,246,0.28), rgba(139,92,246,0.12));
  transform-origin: left center;
  opacity:0.7;
}
.cm-vertTop{ transform: rotate(-18deg); }
.cm-vertBot{ transform: rotate(18deg); }
.cm-vertNote{
  position:absolute; left:120px; top:28px;
  font-size:8px; letter-spacing:0.05em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color:#A78BFA;
  opacity:0;
}
.cm-vertLbl{ opacity:0.6; }
.cm-vertLblIn{ display:none; }
.cm-stage:hover .cm-vertCam{ animation: cm-vertCam 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-vertWorld{ animation: cm-vertWorld 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-vertSubject{ animation: cm-vertSub 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-vertFovWrap{ animation: cm-vertFov 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-vertNote{ animation: cm-vertNote 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-vertLblOut{ display:inline; }
.cm-stage:hover .cm-vertLblIn{ display:none; }
.cm-stage:hover .cm-vertCam .cm-rec{ animation: cm-recBlink 0.26s linear 0s infinite; }
@keyframes cm-vertCam{
  0%{ transform: translateX(0); }
  44%{ transform: translateX(-46px); }
  56%{ transform: translateX(-46px); }
  100%{ transform: translateX(0); }
}
@keyframes cm-vertWorld{
  0%{ transform: translateX(0) scaleX(1); }
  44%{ transform: translateX(18px) scaleX(1.45); }
  56%{ transform: translateX(18px) scaleX(1.45); }
  100%{ transform: translateX(0) scaleX(1); }
}
@keyframes cm-vertSub{
  0%{ transform: translateX(0) scale(1); }
  44%{ transform: translateX(10px) scale(1.10); }
  56%{ transform: translateX(10px) scale(1.10); }
  100%{ transform: translateX(0) scale(1); }
}
@keyframes cm-vertFov{
  0%{ transform: scaleX(1); opacity:1; }
  44%{ transform: scaleX(0.62); opacity:1; }
  56%{ transform: scaleX(0.62); opacity:1; }
  100%{ transform: scaleX(1); opacity:1; }
}
@keyframes cm-vertNote{
  0%{ opacity:0; }
  30%{ opacity:0; }
  44%{ opacity:0.75; }
  56%{ opacity:0.75; }
  100%{ opacity:0; }
}

/* 4) Push Through */
.cm-pushObj{
  position:absolute; left:148px; bottom:58px; width:62px; height:130px;
  border-radius:18px;
  background: linear-gradient(180deg, rgba(167,139,250,0.35), rgba(109,40,217,0.16));
  border:1px solid rgba(167,139,250,0.35);
  z-index:4;
  box-shadow:0 0 0 6px rgba(109,40,217,0.10);
}
.cm-pushCut{
  position:absolute; left:160px; bottom:70px; width:38px; height:106px;
  border-radius:14px;
  background: rgba(8,15,24,0.55);
  border:1px solid rgba(255,255,255,0.06);
  z-index:5;
}
.cm-pushShadow{ left:141px; bottom:45px; width:76px; height:9px; }
.cm-pushSubject{ left:151px; bottom:48px; }
.cm-pushCam{ position:absolute; left:20px; bottom:52px; z-index:6; }

.cm-pushFov{ position:absolute; inset:0; z-index:3; pointer-events:none; }
.cm-pushLine{
  position:absolute;
  left:44px; top:110px;
  width:170px; height:1px;
  background: linear-gradient(90deg, rgba(139,92,246,0.22), rgba(139,92,246,0.12));
  transform-origin: left center;
  opacity:0.9;
}
.cm-pushLineTop{ transform: rotate(-18deg); }
.cm-pushLineBot{ transform: rotate(18deg); }
.cm-pushFovTo{ opacity:0; }
.cm-pushFovForward{ opacity:0; }
.cm-pushFovForward .cm-pushLine{ width:210px; }
.cm-pushNote{
  position:absolute; left:86px; top:26px;
  font-size:8px; letter-spacing:0.05em;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  color:#A78BFA;
  opacity:0;
}

.cm-stage:hover .cm-pushCam{ animation: cm-pushCam 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushObj{ animation: cm-pushObj 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushCut{ animation: cm-pushCut 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushSubject{ animation: cm-pushSubject 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushFovTo{ animation: cm-pushTo 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushFovForward{ animation: cm-pushForward 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushNote{ animation: cm-pushNote 3.4s ease-in-out 0s 2 both; }
.cm-stage:hover .cm-pushCam .cm-rec{ animation: cm-recBlink 0.22s linear 0s infinite; }
.cm-pushLbl{ opacity:0.6; }

@keyframes cm-pushCam{
  0%{ transform: translateX(0); }
  44%{ transform: translateX(226px); }
  56%{ transform: translateX(226px); }
  100%{ transform: translateX(0); }
}
@keyframes cm-pushObj{
  0%{ opacity:1; transform:scale(1); }
  40%{ opacity:0.92; transform:scale(1); }
  60%{ opacity:0.20; transform:scale(0.98); }
  100%{ opacity:1; transform:scale(1); }
}
@keyframes cm-pushCut{
  0%{ opacity:0.55; }
  45%{ opacity:0.55; }
  60%{ opacity:0.10; }
  100%{ opacity:0.55; }
}
@keyframes cm-pushSubject{
  0%{ opacity:1; }
  50%{ opacity:1; }
  60%{ opacity:0.78; }
  100%{ opacity:1; }
}
@keyframes cm-pushTo{
  0%{ opacity:0; }
  18%{ opacity:0; }
  30%{ opacity:1; }
  56%{ opacity:1; }
  65%{ opacity:0; }
  100%{ opacity:0; }
}
@keyframes cm-pushForward{
  0%{ opacity:0; }
  56%{ opacity:0; }
  62%{ opacity:1; }
  85%{ opacity:1; }
  100%{ opacity:0; }
}
@keyframes cm-pushNote{
  0%{ opacity:0; }
  30%{ opacity:0.8; }
  85%{ opacity:0.8; }
  100%{ opacity:0; }
}

@keyframes cm-recBlink{
  0%,100%{ opacity:0.35; }
  50%{ opacity:1; }
}
`;
