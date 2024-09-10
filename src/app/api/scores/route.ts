import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ScoreEntry } from '@/types';
import { getAuth } from '@clerk/nextjs/server';
import { setCorsHeaders } from '@/lib/cors';


// Initialize Firebase Admin SDK
if (!getApps().length) {
  let privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (privateKey) {
    // Replace escaped newlines with actual newlines and remove any surrounding quotes
    privateKey = privateKey.replace(/\\n/g, '\n').replace(/^["'](.+)["']$/, '$1');
  }

  try {
    initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
  } catch (error) {
    console.error('Error at line 29 in file api/scores/route.ts:', 'Error initializing Firebase:', error);
    throw error;
  }
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  
  if (!db) {
    console.error('Error at line 48 in file api/scores/route.ts:', 'Firestore instance is not initialized');
    const response = NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    setCorsHeaders(response);
    return response;
  }

  try {
    const { userId } = await getAuth(request);

    if (!userId) {
      console.log('Error at line 59 in file api/scores/route.ts:', 'Unauthorized: No user ID');
      const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      setCorsHeaders(response);
      return response;
    }

    const { username, score, gameMode, bits, mode, timeLimit, targetNumber } = await request.json();

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

    let docRef;
    try {
      docRef = await db.collection('scores').add({
        ...newScore,
        createdAt: new Date().toISOString()
      });
    } catch (firestoreError) {
      console.error('Error at line 89 in file api/scores/route.ts:', 'Firestore error:', firestoreError);
      throw firestoreError; // Re-throw to be caught in the main try-catch
    }

    const response = NextResponse.json({ message: 'Score saved successfully', id: docRef?.id }, { status: 201 });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error('Error at line 96 in file api/scores/route.ts:', 'Detailed error:', error);
    let errorMessage = 'An unknown error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error('Error at line 100 in file api/scores/route.ts:', 'Error stack:', error.stack);
    } else if (typeof error === 'string') {
      errorMessage = error;
    }
    console.error('Error at line 104 in file api/scores/route.ts:', 'Error saving score:', errorMessage);
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
