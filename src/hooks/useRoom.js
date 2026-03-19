import { db, isFirebaseConfigured } from '../firebase';
import { ref, set, get, onValue, update } from 'firebase/database';

function checkFirebase() {
  if (!isFirebaseConfigured || !db) {
    throw new Error('Firebase not configured. Please add your Firebase config to src/firebase.js');
  }
}

// Generate a 4-character room code (avoiding ambiguous chars)
function generateRoomCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // No 0/O/I/1
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

// Create a new room
export async function createRoom(mode) {
  checkFirebase();
  const roomCode = generateRoomCode();
  const playerId = crypto.randomUUID();

  console.log('🚀 Creating room:', { roomCode, mode, playerId });

  try {
    const roomRef = ref(db, `rooms/${roomCode}`);
    await set(roomRef, {
      mode,
      status: 'waiting',
      createdAt: Date.now(),
      players: {
        [playerId]: {
          joinedAt: Date.now(),
          finished: false,
          votes: {},
          isHost: true
        }
      }
    });

    console.log('✅ Room created successfully:', roomCode);
    return { roomCode, playerId };
  } catch (error) {
    console.error('❌ Failed to create room:', error);
    throw error;
  }
}

// Join an existing room
export async function joinRoom(code) {
  checkFirebase();
  const roomRef = ref(db, `rooms/${code}`);
  const snapshot = await get(roomRef);

  if (!snapshot.exists()) {
    throw new Error('Room not found');
  }

  const room = snapshot.val();
  if (room.status !== 'waiting') {
    throw new Error('Game already started');
  }

  const playerId = crypto.randomUUID();
  const playerRef = ref(db, `rooms/${code}/players/${playerId}`);
  await set(playerRef, {
    joinedAt: Date.now(),
    finished: false,
    votes: {},
    isHost: false
  });

  return { roomCode: code, playerId };
}

// Submit votes when finished swiping
export async function submitVotes(roomCode, playerId, votes) {
  checkFirebase();
  const playerRef = ref(db, `rooms/${roomCode}/players/${playerId}`);

  console.log('📝 Submitting votes:', { roomCode, playerId, votes });

  try {
    await update(playerRef, {
      votes,
      finished: true,
      finishedAt: Date.now()
    });

    console.log('✅ Votes submitted');

    // 2. Read ALL players to check if everyone is done
    const playersRef = ref(db, `rooms/${roomCode}/players`);
    const snapshot = await get(playersRef);
    if (!snapshot.exists()) return;

    const players = snapshot.val();
    const allDone = Object.values(players).every(p => p.finished === true);

    console.log('🔍 Check all done:', { allDone, playerCount: Object.keys(players).length });

    if (allDone) {
      const winner = calculateMatchWinner(players);
      console.log('🎉 All players done! Winner:', winner);

      await update(ref(db, `rooms/${roomCode}`), {
        status: 'done',
        winner: winner,
        matchCount: calculateMatchCount(players, winner),
        totalPlayers: Object.keys(players).length
      });
    }
  } catch (error) {
    console.error('❌ Failed to submit votes:', error);
    throw error;
  }
}

// Calculate how many players voted yes for the winner
function calculateMatchCount(players, winnerId) {
  if (!winnerId) return 0;

  let count = 0;
  Object.values(players).forEach(player => {
    if (player.votes && player.votes[winnerId] === true) {
      count++;
    }
  });
  return count;
}

// Calculate winner from all player votes
function calculateMatchWinner(players) {
  const playerList = Object.values(players);
  const totalPlayers = playerList.length;

  // Build score map — count yes votes per food
  const scores = {};
  playerList.forEach(player => {
    if (!player.votes) return;
    Object.entries(player.votes).forEach(([foodId, liked]) => {
      if (liked === true) {
        scores[foodId] = (scores[foodId] || 0) + 1;
      }
    });
  });

  if (Object.keys(scores).length === 0) return null;

  // Find the highest score
  const maxScore = Math.max(...Object.values(scores));

  // If any food got unanimous votes (all players said yes), prefer those
  const unanimousFoods = Object.keys(scores).filter(id => scores[id] === totalPlayers);
  if (unanimousFoods.length > 0) {
    return unanimousFoods[Math.floor(Math.random() * unanimousFoods.length)];
  }

  // Otherwise return the highest scored food (random if tie)
  const topFoods = Object.keys(scores).filter(id => scores[id] === maxScore);
  return topFoods[Math.floor(Math.random() * topFoods.length)];
}

// Watch room for real-time updates
export function watchRoom(roomCode, callback) {
  if (!isFirebaseConfigured || !db) {
    return () => {}; // Return empty unsubscribe function
  }
  const roomRef = ref(db, `rooms/${roomCode}`);
  return onValue(roomRef, (snapshot) => {
    callback(snapshot.val());
  });
}

// Start the game (host only)
export async function startGame(roomCode) {
  checkFirebase();
  const roomRef = ref(db, `rooms/${roomCode}`);
  await update(roomRef, {
    status: 'voting'
  });
}

// Delete a room
export async function deleteRoom(roomCode) {
  checkFirebase();
  const roomRef = ref(db, `rooms/${roomCode}`);
  await set(roomRef, null);
}

// Reset room for playing again
export async function resetRoom(roomCode) {
  checkFirebase();
  const roomRef = ref(db, `rooms/${roomCode}`);
  const snapshot = await get(roomRef);
  if (!snapshot.exists()) return;

  const room = snapshot.val();
  const players = room.players || {};

  // Reset all players' votes and finished status
  const updates = {};
  Object.keys(players).forEach(playerId => {
    updates[`players/${playerId}/votes`] = {};
    updates[`players/${playerId}/finished`] = false;
  });
  updates['status'] = 'voting';
  updates['winner'] = null;
  updates['matchCount'] = null;

  await update(roomRef, updates);
}
