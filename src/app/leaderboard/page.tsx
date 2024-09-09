import React from 'react';
import { ScoreEntry } from '@/types';
import Navbar from '../../components/Navbar';
import LeaderboardClient from './LeaderboardClient';
import { getLeaderboardScores } from '@/lib/firestore';

export const dynamic = 'force-dynamic';

async function getScores(searchParams: { [key: string]: string | string[] | undefined }) {
  const gameMode = (searchParams.gameMode as 'decimalToBinary' | 'binaryToDecimal') || 'decimalToBinary';
  const bits = parseInt(searchParams.bits as string || '8');
  const mode = (searchParams.mode as 'timer' | 'number') || 'timer';
  const timeOrTarget = parseInt(searchParams.timeOrTarget as string || '2'); // Default to 1 minute (value 2)

  try {
    const scores = await getLeaderboardScores(gameMode, bits, mode, timeOrTarget);
    return scores;
  } catch (error) {
    console.error('Error fetching scores:', error);
    return [];
  }
}

export default async function Leaderboard({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const scores = await getScores(searchParams);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Leaderboard</h1>
        <LeaderboardClient initialScores={scores} />
      </main>
    </div>
  );
}