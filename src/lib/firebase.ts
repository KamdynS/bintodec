import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

let app: FirebaseApp | undefined;

export const initializeFirebase = async () => {
  if (!app) {
    const host = process.env.NEXT_PUBLIC_WEBSITE_URL || process.env.VERCEL_URL || 'http://localhost:3000';
    try {
      const response = await fetch(`${host}/api/firebase-config`, {
        credentials: 'include',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const config = await response.json();
      app = initializeApp(config);
    } catch (error) {
      console.error('Error fetching Firebase config:', error);
      // You might want to add some fallback behavior here
    }
  }
  return app;
};

export const db = async () => {
  const app = await initializeFirebase();
  if (!app) throw new Error('Firebase app not initialized');
  return getFirestore(app);
};

export const getFirebaseAuth = async () => {
  const app = await initializeFirebase();
  return getAuth(app);
};

export const signInWithFirebase = async () => {
  const auth = await getFirebaseAuth();
  const response = await fetch('/api/auth/firebase');
  const { token } = await response.json();
  return signInWithCustomToken(auth, token);
};