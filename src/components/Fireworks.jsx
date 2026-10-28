import { useEffect, useRef } from 'react';
import { useReducedMotion } from '../hooks/useMedia.js';

const COLORS = ['#ff6fa5', '#ffb3d1', '#c9b3ff', '#ffe48a', '#9fe3ff', '#ffffff'];

// Full-screen fireworks on a transparent canvas (sits above the night sky).
export default function Fireworks({ active = true }) {
  const canvasRef = useRef(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas && canvas.getContext && canvas.getContext('2d');
    if (!ctx || !active || reduced) return undefined;

    let w = 0;
    let h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);

    const rockets = [];
    const sparks = [];
    let last = 0;
    let raf;

    const launch = () => {
      rockets.push({
        x: w * (0.15 + Math.random() * 0.7), y: h + 10,
        vx: (Math.random() - 0.5) * 1.2, vy: -(h / 55 + Math.random() * 3),
        targetY: h * (0.15 + Math.random() * 0.35),
        color: COLORS[Math.floor(Math.random() * COLORS.length)],
      });
    };
    const explode = (r) => {
      const n = w < 640 ? 44 : 70;
      const color2 = COLORS[Math.floor(Math.random() * COLORS.length)];
      for (let i = 0; i < n; i += 1) {
        const a = (Math.PI * 2 * i) / n;
        const v = 1.5 + Math.random() * 3.2;
        sparks.push({ x: r.x, y: r.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 0, max: 60 + Math.random() * 30, color: i % 3 ? r.color : color2 });
      }
    };

    const frame = (t) => {
      // fade previous frame to leave soft trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,0.18)';
      ctx.fillRect(0, 0, w, h);
      ctx.globalCompositeOperation = 'lighter';

      if (t - last > 1100) { launch(); last = t; }

      for (let i = rockets.length - 1; i >= 0; i -= 1) {
        const r = rockets[i];
        r.x += r.vx; r.y += r.vy; r.vy += 0.045;
        ctx.fillStyle = r.color;
        ctx.beginPath(); ctx.arc(r.x, r.y, 2, 0, Math.PI * 2); ctx.fill();
        if (r.y <= r.targetY || r.vy >= -1) { explode(r); rockets.splice(i, 1); }
      }
      for (let i = sparks.length - 1; i >= 0; i -= 1) {
        const s = sparks[i];
        s.life += 1; s.x += s.vx; s.y += s.vy; s.vx *= 0.97; s.vy = s.vy * 0.97 + 0.04;
        ctx.globalAlpha = Math.max(0, 1 - s.life / s.max);
        ctx.fillStyle = s.color;
        ctx.beginPath(); ctx.arc(s.x, s.y, 2, 0, Math.PI * 2); ctx.fill();
        if (s.life > s.max) sparks.splice(i, 1);
      }
      ctx.globalAlpha = 1;
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, [active, reduced]);

  return <canvas ref={canvasRef} className="fireworks" aria-hidden="true" />;
}
