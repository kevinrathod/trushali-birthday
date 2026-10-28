// A pastel three-tier cake drawn in CSS with flickering candles.
export default function Cake({ candles = 5, lit = true, onCandleClick }) {
  return (
    <div className={`cake${lit ? '' : ' is-out'}`} role="img" aria-label={lit ? `Birthday cake with ${candles} lit candles` : 'Birthday cake with the candles blown out'}>
      <div className="cake-candles">
        {Array.from({ length: candles }, (_, i) => (
          <button
            key={i}
            type="button"
            className="candle"
            style={{ '--i': i, '--c': ['#ff8fbd', '#b79cff', '#ffd86f', '#7fd8ff', '#ff9d9d'][i % 5] }}
            onClick={onCandleClick}
            aria-label={lit ? 'Candle' : 'Candle (blown out)'}
            tabIndex={-1}
          >
            <span className="flame" />
            <span className="smoke" />
            <span className="stick" />
          </button>
        ))}
      </div>
      <div className="tier tier-top"><i className="drip" /><i className="cherry" /></div>
      <div className="tier tier-mid"><i className="drip" /></div>
      <div className="tier tier-bot"><i className="drip" /></div>
      <div className="plate" />
    </div>
  );
}
