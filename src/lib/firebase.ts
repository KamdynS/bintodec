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
      const token = await getToken();
      if (token) {
        // Call the getFirebaseToken API to ensure the user is created in Firestore
        const response = await fetch('/api/getFirebaseToken', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });
        
        if (!response.ok) {
          throw new Error('Failed to get Firebase token');
        }
        
        // The user is now created in Firestore if they didn't exist before
        console.log('User checked/created in Firestore');
      }
    } catch (error) {
      console.error('Error signing in to Firebase:', error);
    }
  };

  return { signIn };
};