import React, { useEffect, useRef } from "react";

const RUNS = 2;
const DUR = 3400;

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

function easeOutCubic(t) {
  return 1 - Math.pow(1 - t, 3);
}

function Stickman({ width = 56, height = 142 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 56 142" fill="none">
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

function TopDownPerson({ width = 80, height = 52 }) {
  return (
    <svg width={width} height={height} viewBox="0 0 80 52" fill="none">
      <rect x="0" y="26" width="80" height="20" rx="10" fill="#C06A00" />
      <circle cx="40" cy="22" r="20" fill="#E08500" />
      <circle cx="40" cy="13" r="8" fill="#C06A00" opacity="0.35" />
    </svg>
  );
}

function CameraIcon({ recRef, glow = "rgba(37,99,235,0.55)" }) {
  return (
    <svg width="46" height="32" viewBox="0 0 46 32" fill="none" style={{ filter: `drop-shadow(0 0 9px ${glow})` }}>
      <rect x="0" y="6" width="32" height="22" rx="4" fill="#1E40AF" stroke="#93C5FD" strokeWidth="0.75" />
      <rect x="32" y="11" width="12" height="12" rx="2.5" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="0.5" />
      <circle cx="16" cy="17" r="7.5" fill="#0C1445" stroke="#93C5FD" strokeWidth="1.2" />
      <circle cx="16" cy="17" r="4.5" fill="#1E3A8A" />
      <circle cx="16" cy="17" r="2" fill="#60A5FA" />
      <circle cx="13" cy="14" r="1.2" fill="#BAE6FD" opacity="0.6" />
      <rect x="11" y="2" width="12" height="5" rx="1.5" fill="#1D4ED8" stroke="#93C5FD" strokeWidth="0.5" />
      <circle ref={recRef} cx="27" cy="10" r="2" fill="#EF4444" />
    </svg>
  );
}

function CameraCard({ badge, badgeTint, name, tag, view, stageRef, hintRef, labelRef, children, desc, feel, prompt }) {
  const badgeStyle = {
    fontSize: 10, fontWeight: 800, letterSpacing: "0.12em", padding: "3px 10px", borderRadius: 999,
    display: "inline-block", color: badgeTint?.fg ?? "#2563EB", background: badgeTint?.bg ?? "#EFF6FF",
    border: `1px solid ${badgeTint?.bd ?? "#BFDBFE"}`,
  };
  return (
    <div style={{ background: "#fff", border: "1.5px solid #E2DDD6", borderRadius: 22, overflow: "hidden", boxShadow: "0 4px 32px rgba(0,0,0,0.07)" }}>
      <div style={{ padding: "16px 22px 0" }}><span style={badgeStyle}>{badge}</span></div>
      <div style={{ padding: "8px 22px 2px", display: "flex", alignItems: "baseline", justifyContent: "space-between" }}>
        <span style={{ fontSize: 24, fontWeight: 800, color: "#111827", letterSpacing: "-0.03em" }}>{name}</span>
        <span style={{ fontSize: 11, color: "#9CA3AF", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" }}>{tag}</span>
      </div>
      <div ref={stageRef} style={{ margin: "12px 22px", background: "#080F18", borderRadius: 16, height: 220, position: "relative", overflow: "hidden", border: "1.5px solid #1a2535", cursor: "pointer", userSelect: "none", transition: "border-color 0.3s ease, box-shadow 0.3s ease" }}>
        <span style={{ position: "absolute", top: 11, right: 14, fontSize: 9, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", color: "#4B6A8A", letterSpacing: "0.1em", zIndex: 2 }}>{view}</span>
        <div ref={hintRef} style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 6, pointerEvents: "none", transition: "opacity 0.35s ease", background: "rgba(8,15,24,0.38)", borderRadius: 15, opacity: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9, background: badgeTint?.fg ?? "#2563EB", color: "#fff", fontSize: 11, fontWeight: 800, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", letterSpacing: "0.09em", padding: "9px 20px", borderRadius: 999, boxShadow: `0 0 0 5px ${badgeTint?.shadow ?? "#2563EB25"}, 0 4px 18px ${badgeTint?.glow ?? "#2563EB60"}` }}>
            <div style={{ width: 0, height: 0, borderStyle: "solid", borderWidth: "5px 0 5px 9px", borderColor: "transparent transparent transparent #fff" }} />HOVER TO PLAY
          </div>
        </div>
        {children}
        <div ref={labelRef} style={{ position: "absolute", bottom: 26, left: 14, fontSize: 9, fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", color: badgeTint?.fg ?? "#3B82F6", letterSpacing: "0.07em", zIndex: 3, opacity: 0 }} />
      </div>
      <p style={{ padding: "8px 22px 10px", fontSize: 13, color: "#4B5563", lineHeight: 1.65 }}>{desc}</p>
      <div style={{ margin: "2px 22px 12px", background: "#FAFAF8", border: "1px solid #F0EDE6", borderRadius: 10, padding: "10px 14px", display: "flex", gap: 10, alignItems: "flex-start" }}>
        <span style={{ fontSize: 15, flexShrink: 0, marginTop: 1 }}>🎬</span>
        <span style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.55 }}><strong style={{ color: "#374151", fontWeight: 700 }}>Feels like:</strong> {feel}</span>
      </div>
      <div style={{ margin: "0 22px 20px" }}>
        <div style={{ fontSize: 10, fontWeight: 800, color: "#9CA3AF", letterSpacing: "0.08em", marginBottom: 7 }}>✏️ ADD TO YOUR PROMPT</div>
        <div style={{ background: badgeTint?.promptBg ?? "#FFFBEB", border: `1px solid ${badgeTint?.promptBd ?? "#FDE68A"}`, borderRadius: 10, padding: "10px 14px", fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace", fontSize: 11, color: badgeTint?.promptFg ?? "#78350F", lineHeight: 1.75 }}>{prompt}</div>
      </div>
    </div>
  );
}

export default function CameraMoves() {
  const sDolly = useRef(null), hDolly = useRef(null), lDolly = useRef(null), dollyCam = useRef(null), dollyRec = useRef(null);
  const sPan = useRef(null), hPan = useRef(null), lPan = useRef(null);

  useEffect(() => {
    function makeCard(stageEl, hintEl, animFn, resetFn, idleColor) {
      if (!stageEl || !hintEl) return () => {};
      let running = false, runCount = 0, startTime = null, rafId = null, idleTimeout = null;
      const baseBorder = stageEl.style.borderColor;
      const baseShadow = stageEl.style.boxShadow;
      function showIdle() {
        stageEl.style.borderColor = idleColor ?? "rgba(37,99,235,0.35)";
        stageEl.style.boxShadow = `0 0 0 3px ${idleColor ? "rgba(109,40,217,0.09)" : "rgba(37,99,235,0.08)"}`;
        hintEl.style.opacity = "1";
      }
      function hideIdle() {
        stageEl.style.borderColor = baseBorder || "";
        stageEl.style.boxShadow = baseShadow || "";
        hintEl.style.opacity = "0";
      }
      function tick(ts) {
        if (!startTime) startTime = ts;
        const p = Math.min((ts - startTime) / DUR, 1);
        animFn(p, ts);
        if (p < 1) rafId = requestAnimationFrame(tick);
        else {
          runCount++;
          startTime = null;
          if (runCount < RUNS) rafId = requestAnimationFrame(tick);
          else { resetFn?.(); running = false; idleTimeout = setTimeout(showIdle, 600); }
        }
      }
      function start() {
        if (running) return;
        running = true; runCount = 0; startTime = null;
        hideIdle();
        rafId = requestAnimationFrame(tick);
      }
      resetFn?.(); showIdle();
      const onEnter = () => { if (!running) start(); };
      stageEl.addEventListener("mouseenter", onEnter);
      return () => {
        stageEl.removeEventListener("mouseenter", onEnter);
        if (rafId) cancelAnimationFrame(rafId);
        if (idleTimeout) clearTimeout(idleTimeout);
        resetFn?.();
        stageEl.style.borderColor = baseBorder || "";
        stageEl.style.boxShadow = baseShadow || "";
        hintEl.style.opacity = "0";
      };
    }
    const cleanups = [];
    cleanups.push(makeCard(sDolly.current, hDolly.current, (p, ts) => {
      const SX = 12, EX = 136;
      let x = p < 0.44 ? SX + easeInOut(p / 0.44) * (EX - SX) : p < 0.56 ? EX : EX - easeInOut((p - 0.56) / 0.44) * (EX - SX);
      if (dollyCam.current) dollyCam.current.style.left = `${x}px`;
      if (lDolly.current) {
        lDolly.current.textContent = p < 0.44 ? "▶▶ MOVING CLOSER" : p < 0.56 ? "— HOLDING —" : "◀◀ PULLING BACK";
        lDolly.current.style.opacity = p < 0.44 ? String(Math.min(p / 0.1, 0.85)) : p < 0.56 ? "0.5" : String(Math.min((1 - p) / 0.1, 0.85));
      }
      if (dollyRec.current) dollyRec.current.style.opacity = (p < 0.44 || p > 0.56) ? String(0.35 + 0.65 * Math.abs(Math.sin(ts / 360))) : "1";
    }, () => { if (dollyCam.current) dollyCam.current.style.left = "12px"; if (lDolly.current) lDolly.current.style.opacity = "0"; }));
    return () => cleanups.forEach((c) => c && c());
  }, []);

  const classicTint = { fg: "#2563EB", bg: "#EFF6FF", bd: "#BFDBFE", shadow: "#2563EB25", glow: "#2563EB60", promptBg: "#FFFBEB", promptBd: "#FDE68A", promptFg: "#78350F" };

  return (
    <div style={{ fontFamily: "ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial", background: "#F0EEE9", minHeight: "100vh", padding: "60px 24px 80px" }}>
      <div style={{ textAlign: "center", marginBottom: 52 }}>
        <div style={{ display: "inline-block", fontSize: 10, fontWeight: 900, letterSpacing: "0.14em", color: "#2563EB", background: "#EFF6FF", border: "1px solid #BFDBFE", padding: "4px 14px", borderRadius: 999, marginBottom: 14 }}>CAMERA MOVES</div>
        <h1 style={{ fontSize: 36, fontWeight: 900, color: "#111827", letterSpacing: "-0.03em", marginBottom: 10, lineHeight: 1.15 }}>Camera Movements</h1>
        <p style={{ fontSize: 15, color: "#6B7280", lineHeight: 1.6 }}>All 14 camera moves with hover animations.<br/>Full implementation coming soon!</p>
      </div>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ fontSize: 18, fontWeight: 900, letterSpacing: "0.08em", color: "#111827", margin: "22px 0 12px" }}>CLASSIC MOVES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(360px, 1fr))", gap: 28 }}>
          <CameraCard badge="CLASSIC MOVE" badgeTint={classicTint} name="Dolly" tag="push in / pull back" view="SIDE VIEW" stageRef={sDolly} hintRef={hDolly} labelRef={lDolly} desc="The camera physically moves forward or backward on a track." feel="Walking into the scene." prompt="slow dolly in toward subject" />
        </div>
      </div>
    </div>
  );
}