import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import PhotoSlot from './PhotoSlot.jsx';

// Accessible full-screen photo viewer: Esc closes, arrow keys / buttons / swipe navigate.
export default function Lightbox({ photos, index, onClose, onChange }) {
  const open = index !== null && index !== undefined;
  const closeRef = useRef(null);
  const lastFocus = useRef(null);
  const touchX = useRef(null);
  const total = photos.length;

  const go = useCallback((dir) => onChange((index + dir + total) % total), [index, total, onChange]);

  useEffect(() => {
    if (!open) return undefined;
    lastFocus.current = document.activeElement;
    closeRef.current?.focus();
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
      else if (e.key === 'ArrowRight') go(1);
      else if (e.key === 'ArrowLeft') go(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
      lastFocus.current?.focus?.();
    };
  }, [open, go, onClose]);

  const photo = open ? photos[index] : null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo viewer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            touchX.current = null;
            if (Math.abs(dx) > 55) go(dx < 0 ? 1 : -1);
          }}
        >
          <button ref={closeRef} type="button" className="lb-btn lb-close" onClick={onClose} aria-label="Close photo viewer">✕</button>
          <button type="button" className="lb-btn lb-prev" onClick={(e) => { e.stopPropagation(); go(-1); }} aria-label="Previous photo">‹</button>
          <button type="button" className="lb-btn lb-next" onClick={(e) => { e.stopPropagation(); go(1); }} aria-label="Next photo">›</button>
          <motion.figure
            key={index}
            className="lb-figure"
            initial={{ opacity: 0, scale: 0.94, rotate: -1.5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 220, damping: 24 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="lb-frame">
              <PhotoSlot src={photo.src} alt={photo.alt || photo.caption || `Photo ${index + 1}`} number={index + 1} />
            </div>
            <figcaption>
              <span className="lb-caption">{photo.caption || '💗'}</span>
              <span className="lb-count" aria-live="polite">{index + 1} / {total}</span>
            </figcaption>
          </motion.figure>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
