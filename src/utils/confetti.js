// Lightweight canvas confetti. Creates a temporary full-screen canvas, animates it
// and removes it again. No dependencies. Respects prefers-reduced-motion.
const COLORS = ['#ff6fa5', '#ffb3d1', '#c9b3ff', '#9b7bff', '#ffd86f', '#ffffff', '#7fd8ff'];
const SHAPES = ['rect', 'circle', 'heart'];

const prefersReduced = () =>
  typeof window !== 'undefined' &&
  typeof window.matchMedia === 'function' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

function heartPath(ctx, s) {
  ctx.beginPath();
  ctx.moveTo(0, s * 0.35);
  ctx.bezierCurveTo(-s, -s * 0.4, -s * 0.5, -s, 0, -s * 0.45);
  ctx.bezierCurveTo(s * 0.5, -s, s, -s * 0.4, 0, s * 0.35);
  ctx.closePath();
}

export function fireConfetti({ count = 140, x = 0.5, y = 0.45, power = 1, spread = Math.PI * 2, angle = -Math.PI / 2 } = {}) {
  if (typeof document === 'undefined') return;
  const total = prefersReduced() ? Math.min(count, 24) : count;
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext && canvas.getContext('2d');
  if (!ctx) return;
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  canvas.setAttribute('aria-hidden', 'true');
  canvas.style.cssText = 'position:fixed;inset:0;width:100vw;height:100vh;pointer-events:none;z-index:9999';
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  document.body.appendChild(canvas);
  ctx.scale(dpr, dpr);

  const ox = x * window.innerWidth;
  const oy = y * window.innerHeight;
  const parts = Array.from({ length: total }, () => {
    const a = angle + (Math.random() - 0.5) * spread;
    const v = (4 + Math.random() * 9) * power;
    return {
      x: ox, y: oy, vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      size: 5 + Math.random() * 7, rot: Math.random() * 6, vr: (Math.random() - 0.5) * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
      life: 0, max: 110 + Math.random() * 70,
    };
  });

  let raf;
  const frame = () => {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    let alive = 0;
    parts.forEach((p) => {
      p.life += 1;
      if (p.life > p.max) return;
      alive += 1;
      p.vx *= 0.985; p.vy = p.vy * 0.985 + 0.22;
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, 1 - p.life / p.max);
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      ctx.fillStyle = p.color;
      if (p.shape === 'rect') ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      else if (p.shape === 'circle') { ctx.beginPath(); ctx.arc(0, 0, p.size / 2.4, 0, Math.PI * 2); ctx.fill(); }
      else { heartPath(ctx, p.size * 0.8); ctx.fill(); }
      ctx.restore();
    });
    if (alive > 0) raf = requestAnimationFrame(frame);
    else canvas.remove();
  };
  raf = requestAnimationFrame(frame);
  // Safety net in case the tab is hidden and rAF is paused.
  setTimeout(() => { cancelAnimationFrame(raf); canvas.remove(); }, 6000);
}

// A longer celebration: repeated bursts from the top. Returns a stop function.
export function confettiRain(durationMs = 6000) {
  const start = Date.now();
  fireConfetti({ count: 160, x: 0.5, y: 0.5, power: 1.3 });
  const id = setInterval(() => {
    if (Date.now() - start > durationMs) { clearInterval(id); return; }
    fireConfetti({ count: 40, x: Math.random(), y: -0.05, spread: Math.PI * 0.7, angle: Math.PI / 2, power: 0.6 });
  }, 380);
  return () => clearInterval(id);
}
