// A hand-drawn ribbon bow, used as the login hero.
export default function BowIcon({ className = '' }) {
  return (
    <svg className={className} viewBox="0 0 220 130" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="bow-a" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#ffb3d1" />
          <stop offset="1" stopColor="#e0407f" />
        </linearGradient>
        <linearGradient id="bow-b" x1="1" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e3d6ff" />
          <stop offset="1" stopColor="#9b7bff" />
        </linearGradient>
      </defs>
      <path d="M110 62 C 80 6, 8 4, 10 52 C 12 100, 80 98, 110 62 Z" fill="url(#bow-a)" />
      <path d="M110 62 C 140 6, 212 4, 210 52 C 208 100, 140 98, 110 62 Z" fill="url(#bow-a)" />
      <path d="M96 64 C 70 40, 40 38, 32 52 C 44 70, 76 72, 96 64 Z" fill="#fff" opacity=".28" />
      <path d="M104 70 L 78 124 L 98 112 L 110 126 Z" fill="url(#bow-b)" />
      <path d="M116 70 L 142 124 L 122 112 L 110 126 Z" fill="url(#bow-b)" />
      <ellipse cx="110" cy="62" rx="17" ry="20" fill="url(#bow-b)" />
      <ellipse cx="105" cy="55" rx="5" ry="8" fill="#fff" opacity=".4" />
    </svg>
  );
}
