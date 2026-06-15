import { useState, useEffect } from 'react';
import IntroScreen from './components/IntroScreen';
import ModesScreen from './components/ModesScreen';
import FilterScreen from './components/FilterScreen';
import SquadSizeScreen from './components/SquadSizeScreen';
import LobbyScreen from './components/LobbyScreen';
import SwipeScreen from './components/SwipeScreen';
import ResultScreen from './components/ResultScreen';
import { watchRoom } from './hooks/useRoom';
import { cleanupOldRooms } from './firebase';
import './App.css';

const SCREENS = {
  INTRO: 'intro',
  MODES: 'modes',
  FILTER: 'filter',
  SQUAD_SIZE: 'squadSize',
  LOBBY: 'lobby',
  SWIPE: 'swipe',
  RESULT: 'result',
};

function App() {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.INTRO);
  const [selectedMode, setSelectedMode] = useState(null);
  const [selectedSquadSize, setSelectedSquadSize] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [roomCode, setRoomCode] = useState(null);
  const [playerId, setPlayerId] = useState(null);
  const [votes, setVotes] = useState({});
  const [winner, setWinner] = useState(null);
  const [winnerFood, setWinnerFood] = useState(null);
  const [matchCount, setMatchCount] = useState(0);
  const [totalPlayers, setTotalPlayers] = useState(1);

  useEffect(() => {
    cleanupOldRooms().catch(console.error);
  }, []);

  useEffect(() => {
    if (!roomCode || selectedMode === 'solo') return;

    const unsubscribe = watchRoom(roomCode, room => {
      if (room && room.status === 'done') {
        setWinner(room.winner);
        setMatchCount(room.matchCount || 0);
        setTotalPlayers(room.totalPlayers || 1);
        setCurrentScreen(SCREENS.RESULT);
      }
    });

    return () => unsubscribe();
  }, [roomCode, selectedMode]);

  const handleStart = () => {
    setCurrentScreen(SCREENS.MODES);
  };

  const handleSelectMode = mode => {
    setSelectedMode(mode);

    if (mode === 'solo') {
      setCurrentScreen(SCREENS.FILTER);
    } else if (mode === 'couple') {
      setSelectedSquadSize(2);
      setRoomCode(null);
      setPlayerId(null);
      setCurrentScreen(SCREENS.LOBBY);
    } else if (mode === 'squad') {
      setCurrentScreen(SCREENS.SQUAD_SIZE);
    }
  };

  const handleSelectSquadSize = size => {
    setSelectedSquadSize(size);
    setRoomCode(null);
    setPlayerId(null);
    setCurrentScreen(SCREENS.LOBBY);
  };

  const handleBackFromSquadSize = () => {
    setCurrentScreen(SCREENS.MODES);
  };

  const handleRoomCreated = (code, pid) => {
    setRoomCode(code);
    setPlayerId(pid);
  };

  const handleJoined = (code, pid) => {
    setRoomCode(code);
    setPlayerId(pid);
  };

  const handleLobbyStart = () => {
    setCurrentScreen(SCREENS.FILTER);
  };

  const handleFilterConfirm = cats => {
    setSelectedCategories(cats);
    setCurrentScreen(SCREENS.SWIPE);
  };

  const handleSwipeComplete = (votesData, likedFoods) => {
    setVotes(votesData);

    if (selectedMode === 'solo') {
      let winnerId = null;
      let winnerMeal = null;

      if (likedFoods.length > 0) {
        winnerMeal = likedFoods[Math.floor(Math.random() * likedFoods.length)];
        winnerId = winnerMeal.id;
      }

      setWinner(winnerId);
      setWinnerFood(winnerMeal);
      setMatchCount(likedFoods.length);
      setTotalPlayers(1);
      setCurrentScreen(SCREENS.RESULT);
    }
  };

  const handlePlayAgain = () => {
    setVotes({});
    setWinner(null);
    setWinnerFood(null);
    setCurrentScreen(SCREENS.SWIPE);
  };

  const handleNewGame = () => {
    setSelectedMode(null);
    setSelectedSquadSize(null);
    setSelectedCategories([]);
    setRoomCode(null);
    setPlayerId(null);
    setVotes({});
    setWinner(null);
    setWinnerFood(null);
    setMatchCount(0);
    setTotalPlayers(1);
    setCurrentScreen(SCREENS.INTRO);
  };

  const handleBackToModes = () => {
    setRoomCode(null);
    setPlayerId(null);
    setCurrentScreen(SCREENS.MODES);
  };

  return (
    <div className="app">
      {currentScreen === SCREENS.INTRO && <IntroScreen onStart={handleStart} />}
      {currentScreen === SCREENS.MODES && <ModesScreen onSelectMode={handleSelectMode} />}
      {currentScreen === SCREENS.FILTER && (
        <FilterScreen onConfirm={handleFilterConfirm} onBack={() => setCurrentScreen(SCREENS.MODES)} />
      )}
      {currentScreen === SCREENS.SQUAD_SIZE && (
        <SquadSizeScreen onSelectSize={handleSelectSquadSize} onBack={handleBackFromSquadSize} />
      )}
      {currentScreen === SCREENS.LOBBY && (
        <LobbyScreen
          roomCode={roomCode}
          playerId={playerId}
          mode={selectedMode}
          squadSize={selectedSquadSize}
          onStart={handleLobbyStart}
          onBack={handleBackToModes}
          onRoomCreated={handleRoomCreated}
          onJoined={handleJoined}
        />
      )}
      {currentScreen === SCREENS.SWIPE && (
        <SwipeScreen
          mode={selectedMode}
          roomCode={roomCode}
          playerId={playerId}
          categories={selectedCategories}
          onComplete={handleSwipeComplete}
          onBack={handleBackToModes}
        />
      )}
      {currentScreen === SCREENS.RESULT && (
        <ResultScreen
          winner={winner}
          winnerFood={winnerFood}
          matchCount={matchCount}
          totalPlayers={totalPlayers}
          mode={selectedMode}
          roomCode={roomCode}
          onPlayAgain={handlePlayAgain}
          onNewGame={handleNewGame}
        />
      )}
    </div>
  );
}

export default App;
