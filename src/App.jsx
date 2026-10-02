import { useEffect, useRef, useState } from 'react';
import audioMessage from '../audio.m4a';
import background from '../bg.png';
import portrait from '../img.jpg';

const confettiPieces = ['🎉', '✨', '💖', '⭐', '🎊', '💫'];

function randomBetween(min, max) {
  return Math.random() * (max - min) + min;
}

function makeConfetti() {
  return Array.from({ length: 70 }, (_, index) => ({
    id: index,
    piece: confettiPieces[Math.floor(Math.random() * confettiPieces.length)],
    style: {
      left: `${Math.random() * 100}vw`,
      fontSize: `${randomBetween(12, 30)}px`,
      animationDuration: `${randomBetween(2.5, 5.5)}s`,
      animationDelay: `${Math.random() * 0.7}s`,
      '--drift': `${randomBetween(-150, 150)}px`,
    },
  }));
}

function makeSparkles() {
  return Array.from({ length: 22 }, (_, index) => ({
    id: index,
    piece: Math.random() > 0.5 ? '✨' : '💖',
    style: {
      left: '50%',
      top: '45%',
      '--x': `${randomBetween(-250, 250)}px`,
      '--y': `${randomBetween(-180, 170)}px`,
      animationDelay: `${Math.random() * 0.25}s`,
    },
  }));
}

export default function App() {
  const [opened, setOpened] = useState(false);
  const [confetti, setConfetti] = useState([]);
  const [sparkles, setSparkles] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioStatus, setAudioStatus] = useState('');
  const audioRef = useRef(null);

  useEffect(() => {
    if (!opened) return undefined;

    const confettiTimer = window.setTimeout(() => setConfetti([]), 6000);
    const sparkleTimer = window.setTimeout(() => setSparkles([]), 1500);
    return () => {
      window.clearTimeout(confettiTimer);
      window.clearTimeout(sparkleTimer);
    };
  }, [opened]);

  function openGift() {
    if (opened) return;
    setConfetti(makeConfetti());
    setSparkles(makeSparkles());
    setOpened(true);
  }

  async function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      setAudioStatus('');
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
        setAudioStatus('Could not play audio.m4a. Check that the recording is valid.');
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  }

  return (
    <main
      className={`scene${opened ? ' opened' : ''}`}
      style={{ '--birthday-photo': `url("${background}")` }}
    >
      <div className="glow" aria-hidden="true" />
      <section className={`card${opened ? ' opened' : ''}`} aria-label="Birthday surprise">
        <button
          className="gift-wrap"
          type="button"
          onClick={openGift}
          aria-label="Open birthday gift"
          aria-hidden={opened}
          tabIndex={opened ? -1 : 0}
        >
          <span className="bow" aria-hidden="true"><span className="bow-center" /></span>
          <span className="gift-lid" aria-hidden="true" />
          <span className="gift" aria-hidden="true" />
        </button>

        <p className="hint" aria-live="polite">
          {opened ? '' : '🎁 Click the gift to open your surprise!'}
        </p>

        <div className="message" aria-hidden={!opened}>
          <div className="cake" aria-hidden="true">🎂</div>
          <img className="portrait" src={portrait} alt="Grasya" />
          <h1>Happy Birthday!</h1>
          <h2>🥳 Grasyaaa 🥳</h2>
          <p>
            Wishing you a wonderful birthday filled with happiness, good health, and many blessings. May your special day be as amazing as you are!
          </p>
          <div className="close-note">Happy Birthday from the IT Team! 🎉</div>
          <audio
            ref={audioRef}
            src={audioMessage}
            preload="none"
            onEnded={() => setIsPlaying(false)}
            onError={() => {
              setIsPlaying(false);
              setAudioStatus('Could not play audio.m4a. Check that the recording is valid.');
            }}
          />
          <button className="audio-button" type="button" onClick={toggleAudio}>
            <span aria-hidden="true">{isPlaying ? '❚❚' : '▶'}</span>
            {isPlaying ? 'Pause voice message' : 'Play voice message'}
          </button>
          {audioStatus && <p className="audio-status" role="status">{audioStatus}</p>}
        </div>
      </section>

      {confetti.map(({ id, piece, style }) => (
        <span className="confetti" key={id} style={style} aria-hidden="true">{piece}</span>
      ))}
      {sparkles.map(({ id, piece, style }) => (
        <span className="sparkle" key={id} style={style} aria-hidden="true">{piece}</span>
      ))}
    </main>
  );
}