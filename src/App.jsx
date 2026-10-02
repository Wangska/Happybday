import { useEffect, useState } from 'react';
import portrait from '../img.png';

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

  return (
    <main className="scene">
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
          {opened ? '💖 Your surprise is here!' : '🎁 Click the gift to open your surprise!'}
        </p>

        <div className="message" aria-hidden={!opened}>
          <div className="cake" aria-hidden="true">🎂</div>
          <img className="portrait" src={portrait} alt="Grasya" />
          <h1>Happy Birthday!</h1>
          <h2>🥳 Grasyaaa 🥳</h2>
          <p>
            May your birthday be filled with laughter, happiness,
            wonderful memories, and all the things that make you smile.
            Here&apos;s to another amazing year ahead! ✨
          </p>
          <div className="close-note">Made with ❤️ just for you</div>
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