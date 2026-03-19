import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, remove } from 'firebase/database';

const firebaseConfig = {
  apiKey: "AIzaSyDNrNqcVrh7L5cP2OWID5aqCnI4RSnuB-0",
  authDomain: "nomnom-app-b19df.firebaseapp.com",
  databaseURL: "https://nomnom-app-b19df-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "nomnom-app-b19df",
  storageBucket: "nomnom-app-b19df.firebasestorage.app",
  messagingSenderId: "162118250543",
  appId: "1:162118250543:web:12500a989f988ce9fb16da"
};

// Check if Firebase is configured
const isConfigured = firebaseConfig.apiKey !== "YOUR_API_KEY";

let app = null;
let db = null;

if (isConfigured) {
  try {
    app = initializeApp(firebaseConfig);
    db = getDatabase(app);
    console.log('✅ Firebase initialized successfully');
  } catch (error) {
    console.error('❌ Firebase initialization failed:', error);
  }
} else {
  console.warn('⚠️ Firebase config not set - using placeholder values');
}

export { db };
export const isFirebaseConfigured = isConfigured;

// Cleanup rooms older than 2 hours
export async function cleanupOldRooms() {
  if (!db) return;

  const cutoff = Date.now() - (2 * 60 * 60 * 1000);
  const roomsRef = ref(db, 'rooms');
  try {
    const snapshot = await get(roomsRef);
    if (!snapshot.exists()) return;
    const rooms = snapshot.val();
    Object.entries(rooms).forEach(([code, room]) => {
      if (room.createdAt < cutoff) {
        remove(ref(db, `rooms/${code}`));
      }
    });
  } catch (error) {
    console.error('Error cleaning up old rooms:', error);
  }
}
