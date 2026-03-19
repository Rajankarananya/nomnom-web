import { useState, useEffect } from 'react';
import './IntroScreen.css';

// Pixel cell size
const CELL = 9;

// Dog color palette
const W = '#F5F0E8';  // white/cream fur
const B = '#8B4513';  // brown fur
const b = '#5C2A00';  // dark brown outline
const N = '#0A0A0A';  // black eyes / outline
const R = '#CC2200';  // red collar
const P = '#FFB6C1';  // pink tongue
const O = '#C8955A';  // tan snout
const _ = null;       // transparent

// Dog sprite - 18x22, front-facing
const DOG_MAP = [
  [_, _, _, _, B, B, B, B, B, B, B, B, B, B, _, _, _, _],  // row  0
  [_, _, _, B, B, B, B, B, B, B, B, B, B, B, B, _, _, _],  // row  1
  [_, _, B, B, B, b, B, B, B, B, B, B, b, B, B, B, _, _],  // row  2
  [_, B, B, B, b, b, B, W, W, W, W, B, b, b, B, B, B, _],  // row  3
  [_, B, B, b, b, B, W, W, W, W, W, W, B, b, b, B, B, _],  // row  4
  [_, B, B, b, B, W, W, B, B, W, W, B, B, W, B, b, B, _],  // row  5  — eye patches
  [_, B, B, B, W, W, W, B, N, W, W, N, B, W, W, B, B, _],  // row  6  — eyes
  [_, B, B, B, W, W, W, W, W, W, W, W, W, W, W, B, B, _],  // row  7
  [_, _, B, B, W, W, O, O, O, O, O, O, W, W, B, B, _, _],  // row  8  — snout start
  [_, _, B, B, W, W, O, N, N, O, O, O, W, W, B, B, _, _],  // row  9  — nose
  [_, _, B, B, W, W, O, P, P, P, P, O, W, W, B, B, _, _],  // row 10  — tongue
  [_, _, _, B, W, W, O, O, O, O, O, O, W, W, B, _, _, _],  // row 11  — snout end
  [_, _, _, R, R, R, R, R, R, R, R, R, R, R, R, _, _, _],  // row 12  — red collar
  [_, _, _, W, W, W, W, W, W, W, W, W, W, W, W, _, _, _],  // row 13  — chest
  [_, _, _, W, W, B, B, B, B, B, B, B, B, W, W, _, _, _],  // row 14  — brown chest patch
  [_, _, _, W, W, B, B, B, B, B, B, B, B, W, W, _, _, _],  // row 15  — brown chest patch
  [_, _, _, W, W, W, W, W, W, W, W, W, W, W, W, _, _, _],  // row 16  — lower body
  [_, _, _, W, W, W, W, W, W, W, W, W, W, W, W, _, _, _],  // row 17  — lower body
  [_, _, _, W, W, W, W, W, W, W, W, W, W, W, W, _, _, _],  // row 18  — lower body
  [_, _, _, W, b, b, W, _, _, _, _, W, b, b, W, _, _, _],  // row 19  — legs
  [_, _, _, b, b, b, b, _, _, _, _, b, b, b, b, _, _, _],  // row 20  — paws
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _, _],  // row 21  — ground clearance
];

// Bowl color palette
const G = '#8B8B8B';  // grey bowl
const g = '#555555';  // dark grey shadow
const F = '#D2691E';  // brown food
const f = '#8B4513';  // dark kibble
const Y = '#FFD700';  // gold highlight

// Bowl sprite - 14x10
const BOWL_MAP = [
  [_, _, G, G, G, G, G, G, G, G, G, G, _, _],
  [_, G, G, F, f, F, Y, f, F, Y, F, G, G, _],
  [_, G, G, f, Y, f, F, Y, f, F, f, G, G, _],
  [_, G, G, F, f, Y, f, F, f, Y, F, G, G, _],
  [_, G, G, G, G, G, G, G, G, G, G, G, G, _],
  [_, _, G, G, G, G, G, G, G, G, G, G, _, _],
  [_, _, _, G, G, G, G, G, G, G, G, _, _, _],
  [_, _, _, g, g, g, g, g, g, g, g, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
  [_, _, _, _, _, _, _, _, _, _, _, _, _, _],
];

function StarField() {
  const [stars] = useState(() =>
    Array.from({ length: 70 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      delay: Math.random() * 3,
      shouldBlink: Math.random() > 0.5
    }))
  );

  return (
    <div className="star-field">
      {stars.map(star => (
        <div
          key={star.id}
          className={`star ${star.shouldBlink ? 'star--blink' : ''}`}
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`
          }}
        />
      ))}
    </div>
  );
}

function PixelDog() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(18, ${CELL}px)`,
        gridTemplateRows: `repeat(22, ${CELL}px)`,
        imageRendering: 'pixelated',
        animation: 'eatBob 0.85s steps(2) infinite',
      }}
    >
      {DOG_MAP.flat().map((color, i) => (
        <div
          key={i}
          style={{
            width: `${CELL}px`,
            height: `${CELL}px`,
            background: color ?? 'transparent',
          }}
        />
      ))}
    </div>
  );
}

function PixelBowl() {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(14, ${CELL}px)`,
        gridTemplateRows: `repeat(10, ${CELL}px)`,
        imageRendering: 'pixelated',
      }}
    >
      {BOWL_MAP.flat().map((color, i) => (
        <div
          key={i}
          style={{
            width: CELL,
            height: CELL,
            background: color || 'transparent',
          }}
        />
      ))}
    </div>
  );
}

function Steam() {
  return (
    <div className="bowl-steam">
      <div className="steam-line" style={{ animationDelay: '0s' }} />
      <div className="steam-line" style={{ animationDelay: '0.4s' }} />
      <div className="steam-line" style={{ animationDelay: '0.8s' }} />
    </div>
  );
}

function LogoLetter({ letter, color, delay }) {
  return (
    <span
      className="logo-letter"
      style={{
        color,
        animationDelay: `${delay}ms`
      }}
    >
      {letter}
    </span>
  );
}

export default function IntroScreen({ onStart }) {
  const [showSubtext, setShowSubtext] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);

  useEffect(() => {
    // Logo animation: 7 letters × 120ms = 840ms, then wait 400ms
    const subtextTimer = setTimeout(() => {
      setShowSubtext(true);
    }, 840 + 400);

    // Button appears 300ms after subtext
    const buttonTimer = setTimeout(() => {
      setShowButton(true);
    }, 840 + 400 + 300);

    return () => {
      clearTimeout(subtextTimer);
      clearTimeout(buttonTimer);
    };
  }, []);

  const handleStart = () => {
    setIsFlashing(true);
    setTimeout(() => {
      onStart();
    }, 250);
  };

  return (
    <div className="intro-screen">
      <StarField />

      <div className="intro-content">
        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'center',
            gap: '8px',
            marginBottom: '20px',
          }}
        >
          <PixelDog />
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 0,
              position: 'relative',
            }}
          >
            <Steam />
            <PixelBowl />
          </div>
        </div>

        <div className="logo-text">
          <LogoLetter letter="N" color="#FFD700" delay={0} />
          <LogoLetter letter="O" color="#FFD700" delay={120} />
          <LogoLetter letter="M" color="#FFD700" delay={240} />
          <LogoLetter letter="N" color="#5D8A32" delay={360} />
          <LogoLetter letter="O" color="#5D8A32" delay={480} />
          <LogoLetter letter="M" color="#5D8A32" delay={600} />
          <LogoLetter letter="." color="#7F7F7F" delay={720} />
        </div>

        <p className={`swipe-text ${showSubtext ? 'swipe-text--visible' : ''}`}>
          SWIPE TO START
        </p>

        {showButton && (
          <button className="start-button" onClick={handleStart}>
            TAP TO START
          </button>
        )}
      </div>

      {isFlashing && <div className="white-flash" />}
    </div>
  );
}
