import { useEffect, useRef, useState } from 'react';
import config from '../config/birthdayConfig.js';
import { assetUrl } from '../utils/assets.js';

const read = (k, d) => {
  try {
    const v = localStorage.getItem(`trushali-music-${k}`);
    return v === null ? d : JSON.parse(v);
  } catch {
    return d;
  }
};
const write = (k, v) => {
  try {
    localStorage.setItem(`trushali-music-${k}`, JSON.stringify(v));
  } catch {
    /* ignore */
  }
};

// Persistent (mounted once at app level) optional music player.
// Audio only starts after the visitor presses play (browser autoplay rules).
// If public/assets/birthday-music.mp3 is missing, everything else keeps working.
export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [missing, setMissing] = useState(false);
  const [muted, setMuted] = useState(() => read('muted', false));
  const [volume, setVolume] = useState(() => read('volume', 0.6));
  const [note, setNote] = useState('');

  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = volume;
    a.muted = muted;
    write('volume', volume);
    write('muted', muted);
  }, [volume, muted]);

  useEffect(() => {
    if (!note) return undefined;
    const id = setTimeout(() => setNote(''), 4500);
    return () => clearTimeout(id);
  }, [note]);

  const showMissing = () => {
    setMissing(true);
    setNote('Music is optional. Add birthday-music.mp3 to public/assets/ to turn it on.');
  };

  // The login page asks for music the moment "Unlock the surprise" is pressed.
  useEffect(() => {
    const start = () => {
      const a = audioRef.current;
      if (!a || missing || !a.paused) return;
      a.play().catch(() => {});
    };
    window.addEventListener('birthday-music-start', start);
    return () => window.removeEventListener('birthday-music-start', start);
  }, [missing]);

  const toggle = async () => {
    const a = audioRef.current;
    if (!a) return;
    if (missing) {
      showMissing();
      return;
    }
    if (playing) {
      a.pause();
      return;
    }
    try {
      await a.play();
    } catch {
      showMissing();
    }
  };

  return (
    <div className="music" role="group" aria-label="Background music">
      <audio
        ref={audioRef}
        src={assetUrl(config.musicFile)}
        loop
        preload="metadata"
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
        onError={() => setMissing(true)}
      />
      <button type="button" className="music-btn" onClick={toggle} aria-pressed={playing} aria-label={playing ? 'Pause music' : 'Play music'} title={missing ? 'No music file added yet' : playing ? 'Pause music' : 'Play music'}>
        <span aria-hidden="true">{playing ? '⏸' : '🎵'}</span>
      </button>
      <button type="button" className="music-btn" onClick={() => setMuted((m) => !m)} aria-pressed={muted} aria-label={muted ? 'Unmute music' : 'Mute music'}>
        <span aria-hidden="true">{muted || volume === 0 ? '🔇' : '🔊'}</span>
      </button>
      <input
        className="music-vol"
        type="range"
        min="0"
        max="1"
        step="0.05"
        value={volume}
        onChange={(e) => {
          setVolume(Number(e.target.value));
          if (muted && Number(e.target.value) > 0) setMuted(false);
        }}
        aria-label="Music volume"
      />
      {note && <p className="music-note" role="status">{note}</p>}
    </div>
  );
}
