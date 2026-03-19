import { useState, useEffect } from 'react';
import { watchRoom, startGame, deleteRoom, joinRoom, createRoom } from '../hooks/useRoom';
import McButton from './McButton';
import './LobbyScreen.css';

export default function LobbyScreen({ roomCode, playerId, mode, squadSize, onStart, onBack, onRoomCreated, onJoined }) {
  const [room, setRoom] = useState(null);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState('');
  const [joinError, setJoinError] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [view, setView] = useState('choice'); // 'choice', 'join', 'lobby'

  useEffect(() => {
    if (!roomCode) return;

    const unsubscribe = watchRoom(roomCode, (data) => {
      setRoom(data);

      // If game started, navigate to swipe
      if (data && data.status === 'voting') {
        onStart();
      }
    });

    return () => unsubscribe();
  }, [roomCode, onStart]);

  // When roomCode is set, switch to lobby view
  useEffect(() => {
    if (roomCode) {
      setView('lobby');
    }
  }, [roomCode]);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleStartGame = async () => {
    try {
      await startGame(roomCode);
    } catch (err) {
      console.error('Failed to start game:', err);
    }
  };

  const handleBack = async () => {
    if (view === 'join') {
      setView('choice');
      setJoinCode('');
      setJoinError('');
      return;
    }

    // If host, delete the room
    if (room && room.players && room.players[playerId]?.isHost) {
      try {
        await deleteRoom(roomCode);
      } catch (err) {
        console.error('Failed to delete room:', err);
      }
    }
    onBack();
  };

  const handleCreateRoom = async () => {
    setIsCreating(true);
    setJoinError('');
    try {
      const result = await createRoom(mode);
      console.log('Room created, calling onRoomCreated with:', result);
      onRoomCreated(result.roomCode, result.playerId);
    } catch (err) {
      console.error('Failed to create room:', err);
      setJoinError(err.message || 'Failed to create room');
    } finally {
      setIsCreating(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinCode.trim()) {
      setJoinError('Enter a room code');
      return;
    }

    setIsJoining(true);
    setJoinError('');

    try {
      const result = await joinRoom(joinCode.toUpperCase());
      onJoined(result.roomCode, result.playerId);
    } catch (err) {
      setJoinError(err.message || 'Failed to join room');
    } finally {
      setIsJoining(false);
    }
  };

  const getModeLabel = () => {
    switch (mode) {
      case 'couple': return 'COUPLE MODE';
      case 'squad': return 'SQUAD MODE';
      default: return 'MULTIPLAYER';
    }
  };

  // Choice UI - Create or Join
  if (view === 'choice') {
    return (
      <div className="lobby-screen">
        <div className="lobby-bg" />
        <div className="lobby-content">
          <button className="lobby-back" onClick={onBack}>
            <span>&lt;</span>
          </button>

          <p className="lobby-mode">{getModeLabel()}</p>
          <h1 className="lobby-title">HOW TO PLAY?</h1>

          <div className="choice-section">
            <McButton
              variant="green"
              onClick={handleCreateRoom}
              className="choice-button"
            >
              {isCreating ? 'CREATING...' : 'CREATE ROOM'}
            </McButton>
            <p className="choice-or">- OR -</p>
            <McButton
              variant="default"
              onClick={() => setView('join')}
              className="choice-button"
            >
              JOIN ROOM
            </McButton>
          </div>

          {joinError && <p className="join-error">{joinError}</p>}
        </div>
      </div>
    );
  }

  // Join mode UI
  if (view === 'join') {
    return (
      <div className="lobby-screen">
        <div className="lobby-bg" />
        <div className="lobby-content">
          <button className="lobby-back" onClick={handleBack}>
            <span>&lt;</span>
          </button>

          <h1 className="lobby-title">JOIN GAME</h1>

          <div className="join-section">
            <label className="join-label">ENTER ROOM CODE</label>
            <input
              type="text"
              className="join-input"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              maxLength={4}
              placeholder="XXXX"
            />
            {joinError && <p className="join-error">{joinError}</p>}
            <McButton
              variant="green"
              onClick={handleJoinRoom}
              className="join-button"
            >
              {isJoining ? 'JOINING...' : 'JOIN ROOM'}
            </McButton>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!room) {
    return (
      <div className="lobby-screen">
        <div className="lobby-bg" />
        <div className="lobby-content">
          <p className="lobby-loading">LOADING...</p>
        </div>
      </div>
    );
  }

  const players = room.players ? Object.entries(room.players) : [];
  const playerCount = players.length;
  const isHost = room.players?.[playerId]?.isHost;
  const maxPlayers = squadSize || 2;
  const minPlayers = 2;
  const canStart = playerCount >= minPlayers;

  return (
    <div className="lobby-screen">
      <div className="lobby-bg" />

      <div className="lobby-content">
        <button className="lobby-back" onClick={handleBack}>
          <span>&lt;</span>
        </button>

        <p className="lobby-mode">{getModeLabel()}</p>
        <h1 className="lobby-title">ROOM CODE</h1>
        <div className="lobby-code">{roomCode}</div>

        <McButton
          variant="default"
          onClick={handleCopyCode}
          className="copy-button"
        >
          {copied ? 'COPIED!' : 'COPY CODE'}
        </McButton>

        <div className="lobby-share">
          <p>SHARE THIS CODE WITH YOUR</p>
          <p>FRIENDS TO JOIN</p>
        </div>

        <div className="players-section">
          <p className="players-title">PLAYERS ({playerCount}/{maxPlayers})</p>
          <div className="players-list">
            {players.map(([id, player], index) => (
              <div key={id} className="player-slot">
                <span className="player-name">
                  PLAYER {index + 1}
                  {player.isHost && <span className="host-badge">HOST</span>}
                </span>
                <span className="player-status ready">READY</span>
              </div>
            ))}
            {Array.from({ length: maxPlayers - playerCount }).map((_, i) => (
              <div key={`empty-${i}`} className="player-slot empty">
                <span className="player-name">PLAYER {playerCount + i + 1}</span>
                <span className="player-status waiting">WAITING...</span>
              </div>
            ))}
          </div>
        </div>

        {isHost ? (
          <McButton
            variant={canStart ? 'green' : 'default'}
            onClick={canStart ? handleStartGame : undefined}
            className={`start-button ${!canStart ? 'disabled' : ''}`}
          >
            {canStart ? 'START SWIPING' : `NEED ${minPlayers - playerCount} MORE`}
          </McButton>
        ) : (
          <p className="waiting-host">WAITING FOR HOST TO START...</p>
        )}
      </div>
    </div>
  );
}
