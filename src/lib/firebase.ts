import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

let app: FirebaseApp | undefined;

export const initializeFirebase = async () => {
  if (!app) {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    const host = process.env.VERCEL_URL || 'localhost:3000';
    const response = await fetch(`${protocol}://${host}/api/firebase-config`);
    const config = await response.json();
    app = initializeApp(config);
  }
  return app;
};

export const db = async () => {
  const app = await initializeFirebase();
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