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
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

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
    throw error; // Re-throw to be caught in the main try-catch
  }
}

const db = getFirestore();
console.log('Firestore instance created:', !!db);

// Check environment variables
console.log('Environment variables check:', {
  FIREBASE_PROJECT_ID: !!process.env.FIREBASE_PROJECT_ID,
  FIREBASE_CLIENT_EMAIL: !!process.env.FIREBASE_CLIENT_EMAIL,
  FIREBASE_PRIVATE_KEY: !!process.env.FIREBASE_PRIVATE_KEY
});

export async function POST(request: NextRequest) {
  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      setCorsHeaders(response);
      return response;
    }

    const { username, score, gameMode, bits, mode, timeLimit, targetNumber } = await request.json();

    // Log the received data
    console.log('Received data:', { username, score, gameMode, bits, mode, timeLimit, targetNumber });

    const newScore: Omit<ScoreEntry, 'id' | 'createdAt'> = {
      userId,
      username,
      score,
      gameMode,
      bits,
      mode,
    };

    if (mode === 'timer') {
      newScore.timeLimit = timeLimit;
    } else if (mode === 'number') {
      newScore.targetNumber = targetNumber;
    }

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
