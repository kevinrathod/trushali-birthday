// CSS envelope. Click (or press Enter/Space) to open the flap and slide the card up.
export default function Envelope({ open, onOpen, label = 'Open the envelope', hint }) {
  return (
    <div className={`envelope-wrap${open ? ' is-open' : ''}`}>
      <button
        type="button"
        className="envelope"
        onClick={() => !open && onOpen?.()}
        aria-label={open ? 'Envelope opened' : label}
        aria-expanded={open}
      >
        <span className="env-back" />
        <span className="env-card">
          <span className="env-lines" />
        </span>
        <span className="env-front" />
        <span className="env-flap" />
        <span className="env-seal">💗</span>
      </button>
      {!open && hint && <p className="env-hint">{hint}</p>}
    </div>
  );
}
