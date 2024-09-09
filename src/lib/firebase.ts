import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const signInWithFirebase = async () => {
  try {
    const response = await fetch('/api/auth/firebase', { method: 'POST' });
    if (!response.ok) {
      throw new Error('Failed to get Firebase token');
    }
    const { token } = await response.json();
    await signInWithCustomToken(auth, token);
    console.log('Successfully signed in to Firebase');
  } catch (error) {
    console.error('Error signing in to Firebase:', error);
    throw error;
  }
};