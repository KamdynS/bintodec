import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ScoreEntry } from '@/types';
import { getAuth } from '@clerk/nextjs/server';
import { setCorsHeaders } from '@/lib/cors';

// Initialize Firebase Admin SDK
if (!getApps().length) {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;

  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: privateKey,
    }),
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);

  if (!userId) {
    const response = NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    setCorsHeaders(response);
    return response;
  }

  try {
    const { username, score, gameMode, bits, mode, timeLimit, targetNumber } = await request.json();

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

    const docRef = await db.collection('scores').add({
      ...newScore,
      createdAt: new Date().toISOString()
    });

    const response = NextResponse.json({ message: 'Score saved successfully', id: docRef.id }, { status: 201 });
    setCorsHeaders(response);
    return response;
  } catch (error) {
    console.error('Error saving score:', error);
    const response = NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
    setCorsHeaders(response);
    return response;
  }
}

export async function OPTIONS(request: NextRequest) {
  const response = new NextResponse(null, { status: 200 });
  setCorsHeaders(response);
  return response;
}
