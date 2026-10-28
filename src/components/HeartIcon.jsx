// A crisp SVG heart that scales to its container.
export default function HeartIcon({ gold = false, className = '' }) {
  const id = gold ? 'hg-gold' : 'hg-rose';
  return (
    <svg className={className} viewBox="0 0 32 29" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          {gold ? (
            <>
              <stop offset="0" stopColor="#ffe48a" />
              <stop offset="1" stopColor="#ffa94d" />
            </>
          ) : (
            <>
              <stop offset="0" stopColor="#ff9ec6" />
              <stop offset="1" stopColor="#e0407f" />
            </>
          )}
        </linearGradient>
      </defs>
      <path
        fill={`url(#${id})`}
        d="M23.6 0c-3.4 0-6.4 1.9-7.6 4.7C14.8 1.9 11.8 0 8.4 0 3.8 0 0 3.7 0 8.3c0 9.4 16 20.7 16 20.7S32 17.700 32 8.300C32 3.700 28.200 0 23.600 0z"
      />
      <ellipse cx="9" cy="7" rx="3" ry="2" fill="#fff" opacity=".45" transform="rotate(-30 9 7)" />
    </svg>
  );
}
