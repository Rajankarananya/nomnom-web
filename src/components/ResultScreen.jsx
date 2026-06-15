import { useState, useEffect } from 'react';
import McButton from './McButton';
import { resetRoom } from '../hooks/useRoom';
import './ResultScreen.css';

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: (i * 23) % 100,
    top: (i * 41) % 100,
    delay: ((i * 17) % 20) / 10,
  }));

  return (
    <div className="result-stars">
      {stars.map(star => (
        <div
          key={star.id}
          className="result-star"
          style={{
            left: `${star.left}%`,
            top: `${star.top}%`,
            animationDelay: `${star.delay}s`,
          }}
        />
      ))}
    </div>
  );
}

function AchievementToast({ food, onHide }) {
  useEffect(() => {
    const timer = setTimeout(onHide, 3000);
    return () => clearTimeout(timer);
  }, [onHide]);

  return (
    <div className="achievement-toast">
      <div className="achievement-icon">
        <img
          src={food.image}
          alt={food.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }}
        />
      </div>

      <div className="achievement-text">
        <span className="achievement-title">MEAL UNLOCKED!</span>
        <span className="achievement-subtitle">{food.name}</span>
      </div>
    </div>
  );
}

export default function ResultScreen({
  winner,
  winnerFood,
  matchCount,
  totalPlayers,
  mode,
  roomCode,
  onPlayAgain,
  onNewGame,
}) {
  const [showAchievement, setShowAchievement] = useState(true);
  const [xpProgress, setXpProgress] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  const isMultiplayer = mode !== 'solo' && roomCode;
  const isFullMatch = matchCount === totalPlayers;
  const hasNoMatches = !winner || !winnerFood;

  useEffect(() => {
    const timer = setTimeout(() => setXpProgress(100), 500);
    return () => clearTimeout(timer);
  }, []);

  const handlePlayAgain = async () => {
    if (isMultiplayer) {
      setIsResetting(true);
      try {
        await resetRoom(roomCode);
        onPlayAgain();
      } catch (err) {
        console.error('Failed to reset room:', err);
      } finally {
        setIsResetting(false);
      }
    } else {
      onPlayAgain();
    }
  };

  const getSubtitle = () => {
    if (hasNoMatches) return 'NO MATCHES FOUND';
    if (isMultiplayer) {
      if (isFullMatch) return `UNANIMOUS! ${matchCount}/${totalPlayers} AGREED`;
      return `${matchCount}/${totalPlayers} PLAYERS AGREED`;
    }
    return `YOU SWIPED RIGHT ON ${matchCount} FOOD${matchCount !== 1 ? 'S' : ''}`;
  };

  const getLabel = () => {
    if (hasNoMatches) return '';
    return isMultiplayer ? 'GROUP DECISION:' : "TONIGHT'S PICK:";
  };

  return (
    <div className="result-screen">
      <StarField />

      {showAchievement && winnerFood && (
        <AchievementToast food={winnerFood} onHide={() => setShowAchievement(false)} />
      )}

      <div className="result-xp-bar">
        <div className="result-xp-fill" style={{ width: `${xpProgress}%` }} />
      </div>

      <div className="result-content">
        {hasNoMatches ? (
          <>
            <p className="result-label" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
              ??
            </p>
            <p className="result-subtitle">NO MATCHES FOUND</p>
            <p
              style={{
                fontSize: '0.75rem',
                color: '#999',
                marginTop: '1rem',
                marginBottom: '2rem',
                textAlign: 'center',
              }}
            >
              TRY AGAIN WITH LESS PICKY{isMultiplayer ? ' PLAYERS' : ' PREFERENCES'}
            </p>
          </>
        ) : (
          <>
            {getLabel() && <p className="result-label">{getLabel()}</p>}

            <div className="result-food">
              <div className="result-food-frame">
                <img
                  src={winnerFood.image}
                  alt={winnerFood.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', imageRendering: 'pixelated' }}
                />
                {isFullMatch && isMultiplayer && <div className="perfect-match-badge">PERFECT!</div>}
              </div>
            </div>

            <h1 className="result-name">{winnerFood.name}</h1>
          </>
        )}

        <p className="result-subtitle">{getSubtitle()}</p>

        <div className="result-actions">
          <McButton variant="green" onClick={handlePlayAgain} disabled={isResetting}>
            {isResetting ? 'RESETTING...' : 'PLAY AGAIN'}
          </McButton>
          <McButton variant="default" onClick={onNewGame}>
            NEW GAME
          </McButton>
        </div>
      </div>
    </div>
  );
}
