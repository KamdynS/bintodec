import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ScoreEntry } from '@/types';
import { getAuth } from '@clerk/nextjs/server';
import { setCorsHeaders } from '@/lib/cors';

// Add this line to check if Firebase is already initialized
console.log('Current Firebase apps:', getApps());

// Initialize Firebase Admin SDK
if (!getApps().length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (privateKey) {
    // Remove any surrounding quotes and replace escaped newlines
    privateKey = privateKey.replace(/\\n/g, '\n').replace(/^["'](.+)["']$/, '$1');
  }

  console.log('Initializing Firebase with:', {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKeyLength: privateKey ? privateKey.length : 0
  });

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    console.log('Firebase initialized successfully');
  } catch (error) {
    console.error('Error initializing Firebase:', error);
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    throw error;
  }
}

const db = getFirestore();
console.log('Firestore instance created:', !!db);

// Check environment variables
console.log('Environment variables check:', {
  FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Not set',
  FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Not set',
  FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Not set',
  FIREBASE_PRIVATE_KEY_LENGTH: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.length : 0
});

export async function POST(request: NextRequest) {
  console.log('POST request received');
  
  if (!db) {
    console.error('Firestore instance is not initialized');
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    setCorsHeaders(response);
    return response;
  }

  try {
    const { userId } = await getAuth(request);
    console.log('User ID:', userId);

    if (!userId) {
      console.log('Unauthorized: No user ID');
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      setCorsHeaders(response);
      return response;
    }

    const { username, score, gameMode, bits, mode, timeLimit, targetNumber } = await request.json();
    console.log('Received data:', { username, score, gameMode, bits, mode, timeLimit, targetNumber });

    const newScore: Omit<ScoreEntry, 'id' | 'createdAt'> = {
      userId,
      username,
      score,
      gameMode,
      bits,
      mode,
      ...(mode === 'timer' ? { timeLimit } : { targetNumber }),
    };

    // Log the newScore object
    console.log('New score object:', newScore);

    console.log('Attempting to save to Firebase...');
    let docRef;
    try {
      docRef = await db.collection('scores').add({
        ...newScore,
        createdAt: new Date().toISOString()
      });
      console.log('Successfully saved to Firebase with ID:', docRef.id);
    } catch (firestoreError) {
      console.error('Firestore error:', firestoreError);
      throw firestoreError; // Re-throw to be caught in the main try-catch
    }

    const response = NextResponse.json({ message: 'Score saved successfully', id: docRef?.id }, { status: 201 });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error('Detailed error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error stack:', error.stack);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error('Error saving score:', errorMessage);
    const response = NextResponse.json({ error: 'Failed to save score', details: errorMessage }, { status: 500 });
    setCorsHeaders(response);
    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}
