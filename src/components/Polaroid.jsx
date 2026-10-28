import PhotoSlot from './PhotoSlot.jsx';

// A Polaroid-style card. Clicking opens the lightbox.
export default function Polaroid({ photo, number, tilt = 0, onOpen, onStatus }) {
  const caption = photo.caption || '💗';
  const label = photo.caption || `photo ${number}`;
  return (
    <button
      type="button"
      className="polaroid"
      style={{ '--tilt': `${tilt}deg` }}
      onClick={onOpen}
      aria-label={`Open ${label}`}
    >
      <span className="polaroid-tape" aria-hidden="true" />
      <span className="polaroid-photo">
        <PhotoSlot src={photo.src} alt={photo.alt || label} number={number} focus={photo.focus} onStatus={onStatus} />
      </span>
      <span className="polaroid-caption">{caption}</span>
    </button>
  );
}
