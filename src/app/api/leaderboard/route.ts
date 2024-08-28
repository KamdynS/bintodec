import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limitParam = searchParams.get('limit') || '20';
    const limitNumber = parseInt(limitParam, 10);
    const sortBy = searchParams.get('sortBy') || 'score';
    const gameMode = searchParams.get('gameMode') || 'all';
    const bits = searchParams.get('bits') || 'all';
    const mode = searchParams.get('mode') || 'all';

    const scoresRef = collection(db, 'scores');
    let q = query(scoresRef);

    if (sortBy === 'numberTime') {
      q = query(q, where('mode', '==', 'number'), orderBy('timeLimit', 'asc'));
    } else {
      q = query(q, where('mode', '==', 'timer'), orderBy('score', 'desc'));
    }

    if (gameMode !== 'all') {
      q = query(q, where('gameMode', '==', gameMode));
    }

    if (bits !== 'all') {
      q = query(q, where('bits', '==', parseInt(bits)));
    }

    if (mode !== 'all') {
      q = query(q, where('mode', '==', mode));
    }

    q = query(q, limit(limitNumber));

    const querySnapshot = await getDocs(q);
    const scores = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    return NextResponse.json(scores);
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
