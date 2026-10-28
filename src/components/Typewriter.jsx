import { useTypewriter } from '../hooks/useTypewriter.js';

// Typing animation. The full text is rendered invisibly so the box never changes size
// while typing, and screen readers get the whole text right away.
export default function Typewriter({ text, start = true, onDone, className = '' }) {
  const { shown, done, skip } = useTypewriter(text, { start, onDone });
  return (
    <div className={`typewriter ${className}`}>
      <span className="sr-only">{text}</span>
      <div className="tw-ghost" aria-hidden="true">{text}</div>
      <div className="tw-live" aria-hidden="true">
        {shown}
        {!done && <span className="caret" />}
      </div>
      {start && !done && (
        <button type="button" className="link-btn tw-skip" onClick={skip}>
          Show the whole letter
        </button>
      )}
    </div>
  );
}
