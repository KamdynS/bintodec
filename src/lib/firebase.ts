import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { FirebaseApp } from 'firebase/app';

let app: FirebaseApp | undefined;

const DOMAIN = 'https://bintodec.com';

export const initializeFirebase = async () => {
  if (!app) {
    try {
      const response = await fetch(`${DOMAIN}/api/firebase-config`, {
        credentials: 'same-origin',
      });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const config = await response.json();
      app = initializeApp(config);
    } catch (error) {
      console.error('Error fetching Firebase config:', error);
      throw error;
    }
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
  try {
    const response = await fetch('/api/auth/firebase', {
      method: 'POST',
      credentials: 'same-origin',
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const { token } = await response.json();
    return signInWithCustomToken(auth, token);
  } catch (error) {
    console.error('Error signing in with Firebase:', error);
    throw error;
  }
};
