import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, addDoc, query, orderBy, limit, getDocs, Timestamp, where } from 'firebase/firestore';
import { ScoreEntry } from '@/types';

export async function POST(request: Request) {
  const { userId, username, score, gameMode, bits, timeLimit, mode } = await request.json();

  const newScore: Omit<ScoreEntry, 'id'> = {
    userId,
    username,
    score,
    gameMode,
    bits,
    timeLimit,
    mode,
    createdAt: Timestamp.now()
  };

  try {
    await addDoc(collection(db, 'scores'), newScore);
    return NextResponse.json({ message: 'Score saved successfully' }, { status: 201 });
  } catch (error) {
    console.error('Error saving score:', error);
    return NextResponse.json({ error: 'Failed to save score' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const limitParam = searchParams.get('limit') || '10';
  const limitNumber = parseInt(limitParam, 10);

  try {
    const scoresRef = collection(db, 'scores');
    let q = query(scoresRef, orderBy('score', 'desc'), limit(limitNumber));
    
    if (userId) {
      q = query(q, where('userId', '==', userId));
    }

    const querySnapshot = await getDocs(q);
    const scores: ScoreEntry[] = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...(doc.data() as ScoreEntry)
    }));
    return NextResponse.json(scores);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch scores' }, { status: 500 });
  }
}