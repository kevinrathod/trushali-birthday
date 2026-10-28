// Tiny synthesised sound effects (Web Audio) - no audio files needed.
// Sounds only play after a user gesture and only if the toggle is on.
const KEY = 'trushali-birthday-sfx';
let ctx = null;
let enabled = true;
try {
  enabled = localStorage.getItem(KEY) !== '0';
} catch {
  /* ignore */
}

export const isSoundOn = () => enabled;
export function setSoundOn(value) {
  enabled = value;
  try {
    localStorage.setItem(KEY, value ? '1' : '0');
  } catch {
    /* ignore */
  }
}

function audio() {
  if (typeof window === 'undefined') return null;
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    try {
      ctx = new AC();
    } catch {
      return null;
    }
  }
  if (ctx.state === 'suspended') ctx.resume().catch(() => {});
  return ctx;
}

function tone(freq, duration = 0.12, type = 'sine', volume = 0.12, delay = 0) {
  if (!enabled) return;
  const c = audio();
  if (!c) return;
  const t0 = c.currentTime + delay;
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, t0);
  gain.gain.setValueAtTime(0.0001, t0);
  gain.gain.exponentialRampToValueAtTime(volume, t0 + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, t0 + duration);
  osc.connect(gain).connect(c.destination);
  osc.start(t0);
  osc.stop(t0 + duration + 0.03);
}

export const sfx = {
  pop: () => tone(740 + Math.random() * 220, 0.1, 'sine', 0.12),
  gold: () => [880, 1175, 1568].forEach((f, i) => tone(f, 0.14, 'triangle', 0.1, i * 0.06)),
  win: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.22, 'triangle', 0.12, i * 0.11)),
  lose: () => [330, 262].forEach((f, i) => tone(f, 0.25, 'sine', 0.1, i * 0.16)),
  chime: () => [988, 1319].forEach((f, i) => tone(f, 0.3, 'sine', 0.08, i * 0.09)),
};
