import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { ScoreEntry } from '@/types';

export async function getLeaderboardScores(
  gameMode: 'decimalToBinary' | 'binaryToDecimal',
  bits: number,
  mode: 'timer' | 'number',
  timeOrTarget: number
): Promise<ScoreEntry[]> {
  const firestore = await db();
  const scoresRef = collection(firestore, 'scores');
  let q = query(scoresRef);

  q = query(q, where('gameMode', '==', gameMode));
  q = query(q, where('bits', '==', bits));
  q = query(q, where('mode', '==', mode));

  if (mode === 'timer') {
    q = query(q, where('timeLimit', '==', timeOrTarget));
    q = query(q, orderBy('score', 'desc'));
  } else {
    q = query(q, where('targetNumber', '==', timeOrTarget));
    q = query(q, orderBy('score', 'asc'));
  }

  q = query(q, limit(20));

  try {
    const querySnapshot = await getDocs(q);
    const scores = querySnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt.toDate().toISOString() // Convert Firestore Timestamp to ISO string
      } as ScoreEntry;
    });
    return scores;
  } catch (error) {
    console.error('Error fetching leaderboard scores:', error);
    return [];
  }
}