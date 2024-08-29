import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInWithCustomToken } from 'firebase/auth';
import { useAuth } from '@clerk/nextjs';

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

export const useFirebaseAuth = () => {
  const { getToken } = useAuth();

  const signIn = async () => {
    try {
      const token = await getToken({ template: 'firebase' });
      if (token) {
        await signInWithCustomToken(auth, token);
      }
    } catch (error) {
      console.error('Error signing in to Firebase:', error);
    }
  };

  return { signIn };
};