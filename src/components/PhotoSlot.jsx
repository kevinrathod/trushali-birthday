import { useEffect, useState } from 'react';
import { assetUrl } from '../utils/assets.js';

// Shows an image, or a pretty placeholder if the file is missing / not set.
export default function PhotoSlot({ src, alt, number, onStatus, focus, className = '' }) {
  const [failed, setFailed] = useState(!src);

  useEffect(() => {
    setFailed(!src);
  }, [src]);

  useEffect(() => {
    onStatus?.(!failed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [failed]);

  if (failed) {
    const file = src ? src.split('/').pop() : 'a photo';
    return (
      <div className={`photo-ph ${className}`} role="img" aria-label={`Placeholder for photo ${number}`}>
        <span className="photo-ph-icon">📷</span>
        <span className="photo-ph-title">Photo {number}</span>
        <span className="photo-ph-file">add {file}</span>
      </div>
    );
  }
  return (
    <img
      className={`photo-img ${className}`}
      src={assetUrl(src)}
      alt={alt}
      loading="lazy"
      decoding="async"
      draggable="false"
      style={focus ? { objectPosition: focus } : undefined}
      onError={() => setFailed(true)}
    />
  );
}
