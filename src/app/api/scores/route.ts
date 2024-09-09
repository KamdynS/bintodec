import { NextResponse, NextRequest } from 'next/server';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { ScoreEntry } from '@/types';
import { getAuth } from '@clerk/nextjs/server';

if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    }),
  });
}

const db = getFirestore();

export async function POST(request: NextRequest) {
  const { userId } = await getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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
      createdAt: new Date().toISOString() // Use ISO string instead of FieldValue.serverTimestamp()
    });

    return NextResponse.json({ message: 'Score saved successfully', id: docRef.id }, { status: 201 });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}