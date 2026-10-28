import { useCallback, useMemo, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import PageShell from '../components/PageShell.jsx';
import Polaroid from '../components/Polaroid.jsx';
import Lightbox from '../components/Lightbox.jsx';

const TILTS = [-3, 2, -1.5, 3, -2.5, 1.5, -3.5, 2.5, -1, 3.5, -2, 1];

export default function Page05Gallery() {
  const photos = config.photos;
  const [index, setIndex] = useState(null);
  const [found, setFound] = useState({});
  const closeLb = useCallback(() => setIndex(null), []);

  // Remember which photo files exist so we can show a friendly note when frames are empty.
  const statusFns = useRef({});
  const getStatus = (i) => {
    if (!statusFns.current[i]) {
      statusFns.current[i] = (ok) => setFound((f) => (f[i] === ok ? f : { ...f, [i]: ok }));
    }
    return statusFns.current[i];
  };
  const missing = useMemo(
    () => photos.filter((_, i) => found[i] === false || (found[i] === undefined && !photos[i].src)).length,
    [found, photos],
  );

  return (
    <PageShell index={4} theme="garden" nextLabel="Reasons you are amazing" floaterCount={16}>
      <h1 className="display page-title">The Memory Garden</h1>
      <p className="lead">Every photo is a flower that grew from a happy moment. Tap one to look closer.</p>

      {missing > 0 && (
        <p className="note glass" role="note">
          📷 {missing} of {photos.length} frames are waiting for photos. Add your pictures to <code>public/assets/photos/</code> (see README).
        </p>
      )}

      <ul className="polaroids">
        {photos.map((photo, i) => (
          <motion.li
            key={photo.src + i}
            initial={{ opacity: 0, y: 24, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: '0px 0px -40px 0px' }}
            transition={{ duration: 0.5, delay: (i % 4) * 0.07 }}
          >
            <Polaroid photo={photo} number={i + 1} tilt={TILTS[i % TILTS.length]} onOpen={() => setIndex(i)} onStatus={getStatus(i)} />
          </motion.li>
        ))}
      </ul>

      <Lightbox photos={photos} index={index} onClose={closeLb} onChange={setIndex} />
    </PageShell>
  );
}
