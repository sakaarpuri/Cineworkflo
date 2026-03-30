export default function HomeCameraMovePreview({ moveKey, title }) {
  const label =
    moveKey === 'dolly'
      ? '▶▶ MOVING CLOSER'
      : moveKey === 'tracking'
        ? '▶▶ TRACKING RIGHT'
        : '⟲ ORBITING'

  return (
    <div className={`move-home-thumb move-preview-${moveKey}`}>
      <span className="move-home-chip">Preview</span>
      <div className="move-home-stage">
        <div className="move-home-hud">{moveKey === 'tracking' ? 'TOP-DOWN VIEW' : 'SIDE VIEW'}</div>
        <div className="move-home-world">
          <div className="move-home-gridline move-home-gridline-top" />
          <div className="move-home-gridline move-home-gridline-mid" />
          <div className="move-home-camera" />
          <div className="move-home-subject">
            <div className="move-home-subject-head" />
            <div className="move-home-subject-body" />
          </div>
          <div className="move-home-track" />
          {moveKey === 'orbit' ? <div className="move-home-orbit-ring" /> : null}
          {moveKey === 'tracking' ? (
            <>
              <div className="move-home-parallax move-home-parallax-a" />
              <div className="move-home-parallax move-home-parallax-b" />
            </>
          ) : null}
          {moveKey === 'dolly' ? (
            <>
              <div className="move-home-depth-pill move-home-depth-a" />
              <div className="move-home-depth-pill move-home-depth-b" />
            </>
          ) : null}
        </div>
        <div className="move-home-direction">{label}</div>
      </div>
      <div className="sr-only">{title} animation preview</div>
    </div>
  )
}
