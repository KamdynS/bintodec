import { NextResponse } from 'next/server';
import { db } from '@/lib/firebase';
import { collection, query, orderBy, limit, getDocs, where } from 'firebase/firestore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const gameMode = searchParams.get('gameMode');
    const bits = searchParams.get('bits');
    const mode = searchParams.get('mode');
    const timeLimit = searchParams.get('timeLimit');
    const targetNumber = searchParams.get('targetNumber');

    if (!gameMode || !bits || !mode || (!timeLimit && !targetNumber)) {
      return NextResponse.json({ error: 'Missing required parameters' }, { status: 400 });
    }

    const scoresRef = collection(db, 'scores');
    let q = query(scoresRef);

    q = query(q, where('gameMode', '==', gameMode));
    q = query(q, where('bits', '==', parseInt(bits)));
    q = query(q, where('mode', '==', mode));

    if (mode === 'timer') {
      q = query(q, where('timeLimit', '==', parseInt(timeLimit!)));
      q = query(q, orderBy('score', 'desc'));
    } else {
      q = query(q, where('targetNumber', '==', parseInt(targetNumber!)));
      q = query(q, orderBy('score', 'asc'));
    }

    q = query(q, limit(20));

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
