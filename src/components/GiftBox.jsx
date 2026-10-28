// A CSS 3D gift box. The cube is built from faces; the lid hinges at the back edge.
export default function GiftBox({ open, onOpen }) {
  return (
    <div className={`gift3d${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="gift3d-btn"
        onClick={() => !open && onOpen?.()}
        aria-label={open ? 'Gift box opened' : 'Open the gift box'}
        aria-expanded={open}
      >
        <span className="gift3d-scene" aria-hidden="true">
          <span className="gift3d-box">
            <span className="gf gf-front" />
            <span className="gf gf-back" />
            <span className="gf gf-left" />
            <span className="gf gf-right" />
            <span className="gf gf-bottom" />
            <span className="gf gf-inside" />
          </span>
          <span className="gift3d-lid">
            <span className="lf lf-top" />
            <span className="lf lf-front" />
            <span className="lf lf-back" />
            <span className="lf lf-left" />
            <span className="lf lf-right" />
          </span>
        </span>
        <span className="bow" aria-hidden="true">🎀</span>
      </button>
      {!open && <p className="env-hint">Tap the gift to open it</p>}
    </div>
  );
}
