import React from 'react';
import { ScoreEntry } from '@/types';
import Navbar from '../../components/Navbar';
import LeaderboardClient from './LeaderboardClient';
import { getLeaderboardScores } from '@/lib/firestore';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

async function getScores(searchParams: { [key: string]: string | string[] | undefined }) {
  const gameMode = (searchParams.gameMode as 'decimalToBinary' | 'binaryToDecimal') || 'decimalToBinary';
  const bits = parseInt(searchParams.bits as string || '8');
  const mode = (searchParams.mode as 'timer' | 'number') || 'timer';
  const timeOrTarget = parseInt(searchParams.timeOrTarget as string || '2');

  try {
    const headersList = headers();
    const protocol = headersList.get('x-forwarded-proto') || 'http';
    const host = headersList.get('host') || '';
    const baseUrl = `${protocol}://${host}`;

    const apiUrl = `${baseUrl}/api/scores?gameMode=${gameMode}&bits=${bits}&mode=${mode}&timeOrTarget=${timeOrTarget}`;
    
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching scores:', error);
    throw error;
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