import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import { PAGES } from '../config/pages.js';
import { useProgress } from '../context/ProgressContext.jsx';
import PageShell from '../components/PageShell.jsx';
import Stars from '../components/Stars.jsx';

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(`${iso}T00:00:00`);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleDateString(undefined, { day: 'numeric', month: 'long', year: 'numeric' });
}

const ORBITS = [
  { r: 'orbit-1', items: ['🦋', '⭐'] },
  { r: 'orbit-2', items: ['🌸', '💗', '✨'] },
  { r: 'orbit-3', items: ['🎀', '🌷'] },
];

export default function Page02Welcome() {
  const { unlock } = useProgress();
  const date = formatDate(config.birthdayDate);

  return (
    <PageShell index={1} theme="dream" hideNext>
      <Stars count={50} />
      <div className="cloud cloud-a" aria-hidden="true" />
      <div className="cloud cloud-b" aria-hidden="true" />
      <div className="cloud cloud-c" aria-hidden="true" />

      <div className="universe" aria-hidden="true">
        <div className="universe-core">💗</div>
        {ORBITS.map((o) => (
          <div key={o.r} className={`orbit ${o.r}`}>
            {o.items.map((e, i) => (
              <span key={e} className="orbit-body" style={{ '--a': `${(360 / o.items.length) * i}deg` }}>
                <span className="orbit-emoji">{e}</span>
              </span>
            ))}
          </div>
        ))}
      </div>

      <motion.h1 className="display welcome-title" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}>
        {config.welcomeTitle}
      </motion.h1>
      <motion.p className="lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8, duration: 0.8 }}>
        {config.welcomeSubtitle}
      </motion.p>
      {date && <p className="date-chip">🎂 {date}</p>}

      <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.3 }}>
        <WelcomeButton onStart={() => unlock(2)} />
      </motion.div>
    </PageShell>
  );
}

function WelcomeButton({ onStart }) {
  const navigate = useNavigate();
  return (
    <button
      type="button"
      className="btn btn-glow btn-xl"
      onClick={() => {
        onStart();
        navigate(PAGES[2].path);
      }}
    >
      ✨ Start the adventure
    </button>
  );
}
