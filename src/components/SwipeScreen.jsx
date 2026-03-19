import { useState, useRef, useEffect } from 'react';
import PixelFood from './PixelFood';
import { FOODS, shuffleArray } from '../data/foods';
import { submitVotes, watchRoom } from '../hooks/useRoom';

export default function SwipeScreen({ mode, roomCode, playerId, onComplete, onBack }) {
  const [foods] = useState(() => shuffleArray(FOODS));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [liked, setLiked] = useState([]);
  const [dragX, setDragX] = useState(0);
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isExiting, setIsExiting] = useState(false);
  const [userFinished, setUserFinished] = useState(false);
  const [roomPlayers, setRoomPlayers] = useState({});

  const dragStartRef = useRef({ x: 0, y: 0 });
  const votesRef = useRef({}); // Always up-to-date vote tracking

  const currentFood = foods[currentIndex];
  const isMultiplayer = mode !== 'solo' && roomCode;

  const recordVote = (foodId, voted) => {
    votesRef.current[foodId] = voted;
  };

  const vote = async (liked_vote) => {
    if (isExiting) return;

    setIsExiting(true);
    const foodId = currentFood.id;

    // Record vote for this food
    if (liked_vote === true) {
      setDragX(500);
      setLiked(prev => [...prev, currentFood]);
      recordVote(foodId, true);
    } else if (liked_vote === false) {
      setDragX(-500);
      recordVote(foodId, false);
    } else {
      // Skip counts as NO
      setDragX(-500);
      recordVote(foodId, false);
    }

    setTimeout(async () => {
      if (currentIndex < foods.length - 1) {
        setCurrentIndex(prev => prev + 1);
        setDragX(0);
        setDragY(0);
        setIsExiting(false);
      } else {
        // All done - submit votes using the ref (always up-to-date)
        const finalVotes = votesRef.current;
        const finalLiked = liked_vote === true ? [...liked, currentFood] : liked;

        if (isMultiplayer) {
          try {
            await submitVotes(roomCode, playerId, finalVotes);
            setUserFinished(true);
            // Don't call onComplete yet - wait for room to be marked 'done'
          } catch (err) {
            console.error('Failed to submit votes:', err);
          }
        } else {
          // Solo mode - complete immediately
          onComplete(finalVotes, finalLiked);
        }
      }
    }, 300);
  };

  const handlePointerDown = (e) => {
    if (isExiting) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - dragX, y: e.clientY - dragY };
  };

  const handlePointerMove = (e) => {
    if (!isDragging || isExiting) return;
    const newX = e.clientX - dragStartRef.current.x;
    const newY = e.clientY - dragStartRef.current.y;
    setDragX(newX);
    setDragY(newY);
  };

  const handlePointerUp = () => {
    if (!isDragging || isExiting) return;
    setIsDragging(false);

    if (dragX > 80) {
      vote(true);
    } else if (dragX < -80) {
      vote(false);
    } else {
      setDragX(0);
      setDragY(0);
    }
  };

  // Watch for multiplayer room status
  useEffect(() => {
    if (!isMultiplayer || !userFinished) return;

    const unsubscribe = watchRoom(roomCode, (room) => {
      if (room?.players) {
        setRoomPlayers(room.players);
      }
      if (room?.status === 'done') {
        // Game is done, notify parent to show result
        onComplete({}, []);
      }
    });

    return () => unsubscribe();
  }, [isMultiplayer, userFinished, roomCode, onComplete]);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('pointermove', handlePointerMove);
      window.addEventListener('pointerup', handlePointerUp);
      return () => {
        window.removeEventListener('pointermove', handlePointerMove);
        window.removeEventListener('pointerup', handlePointerUp);
      };
    }
  }, [isDragging, dragX, dragY]);

  const getModeLabel = () => {
    switch (mode) {
      case 'solo': return 'SOLO';
      case 'couple': return 'COUPLE';
      case 'squad': return 'SQUAD';
      default: return 'MULTIPLAYER';
    }
  };

  const yumOpacity = Math.min(Math.max(dragX / 80, 0), 1);
  const nopeOpacity = Math.min(Math.max(-dragX / 80, 0), 1);

  return (
    <div className="bg-[#4A4A4A] pixel-grid h-screen overflow-hidden text-on-surface font-body">
      {/* Show waiting screen if user finished in multiplayer */}
      {userFinished && isMultiplayer && (
        <div className="fixed inset-0 z-50 bg-[#4A4A4A] flex flex-col items-center justify-center gap-8">
          <p className="text-[#FFD700] font-headline text-sm text-center leading-loose px-6">
            VOTES SUBMITTED!
            <br />
            WAITING FOR
            <br />
            OTHER PLAYERS...
          </p>

          {/* Spinning animation */}
          <div
            style={{
              animation: 'spin 1s steps(4) infinite',
              fontSize: '3rem'
            }}
          >
            ⬛
          </div>

          {/* Player status list */}
          <div className="flex flex-col gap-4">
            {Object.entries(roomPlayers).map(([id, player], i) => (
              <div key={id} className="flex items-center gap-4">
                <span className="font-headline text-[10px] text-[#7F7F7F] w-20">
                  PLAYER {i + 1}
                </span>
                <span
                  className={`font-headline text-[10px] ${
                    player.finished ? 'text-[#5D8A32]' : 'text-[#7F7F7F]'
                  }`}
                >
                  {player.finished ? '✔ DONE' : '... SWIPING'}
                </span>
              </div>
            ))}
          </div>

          <style>{`
            @keyframes spin {
              0% { transform: rotate(0deg); }
              25% { transform: rotate(90deg); }
              50% { transform: rotate(180deg); }
              75% { transform: rotate(270deg); }
              100% { transform: rotate(360deg); }
            }
          `}</style>
        </div>
      )}

      {/* Regular swipe screen - only show if user hasn't finished */}
      {!userFinished && (
        <>
      {/* Decorative corner pixels */}
      <div className="fixed top-24 left-4 w-4 h-4 bg-tertiary opacity-30" />
      <div className="fixed top-32 right-8 w-8 h-8 bg-primary opacity-20" />
      <div className="fixed bottom-32 left-12 w-6 h-6 bg-secondary opacity-25" />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 h-20 bg-[#efeded] border-b-4 border-[#1a1a1a] shadow-[4px_4px_0px_#1a1a1a] px-6 flex justify-between items-center z-50">
        {/* Left side */}
        <div className="flex items-center gap-4">
          <button
            onClick={onBack}
            className="hover:-translate-y-0.5 active:translate-y-1 transition-transform"
          >
            <span className="material-symbols-outlined text-[#3c6711] text-[2rem]">arrow_back</span>
          </button>
          <span className="text-[0.875rem] text-[#3c6711] uppercase font-headline">{getModeLabel()}</span>
        </div>

        {/* Center - XP Bar */}
        <div className="max-w-[200px] w-full mx-4 flex-1">
          <div className="xp-bar-container bg-[#313131] h-6 w-full relative">
            <div
              className="xp-bar-fill-gradient h-full transition-all duration-300"
              style={{ width: `${(currentIndex / foods.length) * 100}%` }}
            />
            <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white drop-shadow-[2px_2px_0px_#000] font-headline">
              {currentIndex + 1}/{foods.length}
            </span>
          </div>
        </div>

        {/* Right side */}
        <span className="material-symbols-outlined text-[#3c6711] text-[2rem]">account_circle</span>
      </header>

      {/* Main Content */}
      <main
        className="pt-20 flex flex-col items-center justify-center px-4 w-full max-w-lg mx-auto"
        style={{ height: 'calc(100vh - 0px)' }}
      >
        {/* Swipe Card Container */}
        <div
          className="relative w-full max-w-sm mx-auto"
          style={{ height: 'min(520px, calc(100vh - 200px))' }}
        >
          {/* YUM Stamp */}
          <div
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
            style={{ opacity: yumOpacity }}
          >
            <div className="rotate-[-12deg] bg-primary border-8 border-on-primary-container p-4 pixel-shadow-box">
              <span className="text-white text-2xl font-headline">✔ YUM!</span>
            </div>
          </div>

          {/* NOPE Stamp */}
          <div
            className="absolute inset-0 pointer-events-none z-30 flex items-center justify-center"
            style={{ opacity: nopeOpacity }}
          >
            <div className="rotate-[12deg] bg-error border-8 border-[#93000a] p-4 pixel-shadow-box">
              <span className="text-white text-2xl font-headline">✘ NOPE</span>
            </div>
          </div>

          {/* The Card */}
          {currentFood && (
            <div
              className="w-full h-full bg-[#1a1a1a] p-1 pixel-shadow-box flex flex-col select-none touch-none"
              style={{
                cursor: isDragging ? 'grabbing' : 'grab',
                transform: `translate(${dragX}px, ${dragY}px) rotate(${dragX * 0.05}deg)`,
                transition: isDragging ? 'none' : 'transform 0.4s cubic-bezier(0.34,1.56,0.64,1)'
              }}
              onPointerDown={handlePointerDown}
            >
              {/* Inner frame */}
              <div className="flex-1 border-4 border-[#7b563a] bg-surface-container-lowest flex flex-col">
                {/* Top section - food visual */}
                <div className="h-3/5 dithered-bg relative flex items-center justify-center overflow-hidden">
                  <div className="w-28 h-28 bg-white/20 p-2 border-4 border-white/40 flex items-center justify-center">
                    <PixelFood food={currentFood.key} size="medium" />
                  </div>
                  {/* Tag chip */}
                  <div className="absolute top-4 right-4 bg-tertiary px-3 py-1 border-2 border-black">
                    <span className="text-[10px] text-white uppercase font-headline">{currentFood.tags[0]}</span>
                  </div>
                </div>

                {/* Bottom section - food info */}
                <div className="h-2/5 bg-[#efeded] p-4 flex flex-col justify-start border-t-4 border-[#1a1a1a]">
                  <h2 className="text-on-surface text-sm font-headline mb-2 leading-tight uppercase">{currentFood.name}</h2>
                  <div className="flex flex-wrap gap-2">
                    {currentFood.tags.map((tag, i) => (
                      <span key={i} className="bg-[#1a1a1a] text-white text-[8px] px-2 py-1 uppercase font-headline">{tag}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3 flex items-center justify-center gap-4 w-full max-w-sm">
          {/* Dislike */}
          <button
            onClick={() => vote(false)}
            className="w-14 h-14 bg-error border-4 border-[#93000a] flex items-center justify-center pixel-shadow-box hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined bold text-white text-2xl">close</span>
          </button>

          {/* Like */}
          <button
            onClick={() => vote(true)}
            className="w-16 h-16 bg-[#3c6711] border-4 border-[#bef28c] flex items-center justify-center pixel-shadow-box hover:-translate-y-2 active:translate-y-1 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined filled text-white text-3xl">favorite</span>
          </button>

          {/* Skip */}
          <button
            onClick={() => vote(null)}
            className="w-14 h-14 bg-[#73796a] border-4 border-[#43493b] flex items-center justify-center pixel-shadow-box hover:-translate-y-1 active:translate-y-1 active:shadow-none transition-all"
          >
            <span className="material-symbols-outlined bold text-white text-2xl">arrow_forward</span>
          </button>
        </div>
      </main>
        </>
      )}
    </div>
  );
}
