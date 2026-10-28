import { motion } from 'framer-motion';
import config from '../config/birthdayConfig.js';
import PageShell from '../components/PageShell.jsx';
import Stars from '../components/Stars.jsx';

const MSG = config.message;
const item = { hide: { opacity: 0, y: 26 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } } };

export default function Page09Message() {
  return (
    <PageShell index={8} theme="cinema" nextLabel="To the grand finale" floaterCount={20}>
      <Stars count={30} />
      <div className="glow-orb orb-a" aria-hidden="true" />
      <div className="glow-orb orb-b" aria-hidden="true" />

      <motion.article className="message" initial="hide" animate="show" variants={{ hide: {}, show: { transition: { staggerChildren: 1.1, delayChildren: 0.4 } } }}>
        <motion.h1 className="display message-title" variants={item}>{MSG.title}</motion.h1>
        {MSG.paragraphs.map((p) => (
          <motion.p key={p} className="message-p" variants={item}>{p}</motion.p>
        ))}
      </motion.article>
    </PageShell>
  );
}
