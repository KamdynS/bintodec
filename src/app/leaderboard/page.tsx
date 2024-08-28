"use client";

import { useState, useEffect, useCallback } from 'react';
import Navbar from '@/components/Navbar';
import { ScoreEntry } from '@/types';
import { Combobox } from "@/components/ui/combobox";

type ScoreEntryWithId = ScoreEntry & { id: string | number };

export default function LeaderboardPage() {
  const [scores, setScores] = useState<ScoreEntryWithId[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState('timerScore');
  const [gameMode, setGameMode] = useState('all');
  const [bits, setBits] = useState('all');

  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/leaderboard?limit=20&sortBy=${sortBy}&gameMode=${gameMode}&bits=${bits}`);
      if (!response.ok) throw new Error('Failed to fetch scores');
      const data: ScoreEntry[] = await response.json();
      setScores(data.map((score, index) => ({ ...score, id: index })));
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError('Failed to load leaderboard. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [sortBy, gameMode, bits]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Leaderboard</h1>
        <div className="flex justify-center space-x-4 mb-8">
          <Combobox
            options={[
              { value: "timerScore", label: "Timer Mode (Highest Score)" },
              { value: "numberTime", label: "Number Mode (Fastest Time)" },
            ]}
            value={sortBy}
            onChange={(value) => setSortBy(value)}
          />
          <Combobox
            options={[
              { value: "all", label: "All Modes" },
              { value: "decimalToBinary", label: "Decimal to Binary" },
              { value: "binaryToDecimal", label: "Binary to Decimal" },
            ]}
            value={gameMode}
            onChange={(value) => setGameMode(value)}
          />
          <Combobox
            options={[
              { value: "all", label: "All Bits" },
              { value: "4", label: "4 bits" },
              { value: "8", label: "8 bits" },
              { value: "16", label: "16 bits" },
              { value: "32", label: "32 bits" },
            ]}
            value={bits}
            onChange={(value) => setBits(value)}
          />
        </div>
        {isLoading ? (
          <p>Loading leaderboard...</p>
        ) : error ? (
          <p className="text-red-500">{error}</p>
        ) : (
          <div className="grid gap-2">
            {scores.map((score, index) => (
              <div key={score.id} className="grid grid-cols-[auto_1fr_auto] items-center gap-4 bg-muted rounded-lg p-4">
                <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center font-bold">
                  {index + 1}
                </div>
                <div>
                  <div className="font-medium">{score.username}</div>
                  <div className="text-muted-foreground text-sm">
                    Mode: {score.gameMode} | Bits: {score.bits}
                  </div>
                </div>
                <div className="font-medium">
                  {sortBy === 'timerScore' 
                    ? `Score: ${score.score}`
                    : `Time: ${score.timeLimit.toFixed(1)}s`
                  }
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}