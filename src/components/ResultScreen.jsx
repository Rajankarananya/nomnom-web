import { useState, useEffect } from 'react';
import PixelFood from './PixelFood';
import McButton from './McButton';
import { getFoodById, FOODS } from '../data/foods';
import { resetRoom } from '../hooks/useRoom';
import './ResultScreen.css';

function StarField() {
  const stars = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    top: Math.random() * 100,
    delay: Math.random() * 2
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
            animationDelay: `${star.delay}s`
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
        <PixelFood food={food.key} size="small" />
      </div>
      <div className="achievement-text">
        <span className="achievement-title">MEAL UNLOCKED!</span>
        <span className="achievement-subtitle">{food.name}</span>
      </div>
    </div>
  );
}

export default function ResultScreen({ winner, matchCount, totalPlayers, mode, roomCode, onPlayAgain, onNewGame }) {
  const [showAchievement, setShowAchievement] = useState(true);
  const [xpProgress, setXpProgress] = useState(0);
  const [isResetting, setIsResetting] = useState(false);

  // Get winner food object from id
  const winnerFood = winner ? getFoodById(winner) : null;
  const isMultiplayer = mode !== 'solo' && roomCode;
  const isFullMatch = matchCount === totalPlayers;
  const hasNoMatches = !winner;

  useEffect(() => {
    const timer = setTimeout(() => {
      setXpProgress(100);
    }, 500);
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
    if (hasNoMatches) {
      return 'NO MATCHES FOUND';
    }

    if (isMultiplayer) {
      if (isFullMatch) {
        return `UNANIMOUS! ${matchCount}/${totalPlayers} AGREED`;
      }
      return `${matchCount}/${totalPlayers} PLAYERS AGREED`;
    }

    return `YOU SWIPED RIGHT ON ${matchCount} FOOD${matchCount !== 1 ? 'S' : ''}`;
  };

  const getLabel = () => {
    if (hasNoMatches) {
      return '';
    }
    return isMultiplayer ? 'GROUP DECISION:' : "TONIGHT'S PICK:";
  };

  return (
    <div className="result-screen">
      <StarField />

      {showAchievement && winnerFood && (
        <AchievementToast
          food={winnerFood}
          onHide={() => setShowAchievement(false)}
        />
      )}

      <div className="result-xp-bar">
        <div className="result-xp-fill" style={{ width: `${xpProgress}%` }} />
      </div>

      <div className="result-content">
        {hasNoMatches ? (
          <>
            <p className="result-label" style={{ fontSize: '3rem', marginBottom: '2rem' }}>
              🤷
            </p>
            <p className="result-subtitle">NO MATCHES FOUND</p>
            <p style={{
              fontSize: '0.75rem',
              color: '#999',
              marginTop: '1rem',
              marginBottom: '2rem',
              textAlign: 'center'
            }}>
              TRY AGAIN WITH LESS PICKY{isMultiplayer ? ' PLAYERS' : ' PREFERENCES'}
            </p>
          </>
        ) : (
          <>
            {getLabel() && <p className="result-label">{getLabel()}</p>}

            <div className="result-food">
              <div
                className="result-food-frame"
                style={{ backgroundColor: winnerFood.bgColor }}
              >
                <PixelFood food={winnerFood.key} size="large" />
              </div>
              {isFullMatch && isMultiplayer && (
                <div className="perfect-match-badge">PERFECT!</div>
              )}
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
