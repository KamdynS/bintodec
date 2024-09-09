"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Combobox } from "@/components/ui/combobox";
import { ScoreEntry } from '@/types';
import { useRouter } from 'next/navigation';

export default function LeaderboardClient({ initialScores }: { initialScores: ScoreEntry[] }) {
  const [gameMode, setGameMode] = useState<'decimalToBinary' | 'binaryToDecimal'>('decimalToBinary');
  const [bits, setBits] = useState<string>('8');
  const [mode, setMode] = useState<'timer' | 'number'>('timer');
  const [timeOrTarget, setTimeOrTarget] = useState<string>('2'); // Default to 1 minute (value 2)
  const [scores, setScores] = useState<ScoreEntry[]>(initialScores);
  const router = useRouter();

  const updateLeaderboard = useCallback(async () => {
    const searchParams = new URLSearchParams({
      gameMode,
      bits,
      mode,
      timeOrTarget,
    });
    router.replace(`/leaderboard?${searchParams.toString()}`, { scroll: false });
  }, [gameMode, bits, mode, timeOrTarget]);

  useEffect(() => {
    updateLeaderboard();
  }, [updateLeaderboard]);

  useEffect(() => {
    setScores(initialScores);
  }, [initialScores]);

  return (
    <div>
      <div className="flex flex-wrap gap-4 mb-6">
        <Combobox
          options={[
            { value: "decimalToBinary", label: "Decimal to Binary" },
            { value: "binaryToDecimal", label: "Binary to Decimal" },
          ]}
          value={gameMode}
          onChange={(value) => setGameMode(value as 'decimalToBinary' | 'binaryToDecimal')}
        />
        <Combobox
          options={[
            { value: "4", label: "4 bits" },
            { value: "8", label: "8 bits" },
            { value: "16", label: "16 bits" },
            { value: "32", label: "32 bits" },
          ]}
          value={bits}
          onChange={(value) => setBits(value)}
        />
        <Combobox
          options={[
            { value: "timer", label: "Timer Mode" },
            { value: "number", label: "Number Mode" },
          ]}
          value={mode}
          onChange={(value) => {
            setMode(value as 'timer' | 'number');
            setTimeOrTarget(value === 'timer' ? '60' : '10');
          }}
        />
        {mode === 'timer' && (
          <Combobox
            options={[
              { value: "1", label: "30 seconds" },
              { value: "2", label: "1 minute" },
              { value: "3", label: "2 minutes" },
              { value: "4", label: "5 minutes" },
            ]}
            value={timeOrTarget}
            onChange={(value) => setTimeOrTarget(value)}
          />
        )}
        {mode === 'number' && (
          <Combobox
            options={[
              { value: "5", label: "5 correct guesses" },
              { value: "10", label: "10 correct guesses" },
              { value: "20", label: "20 correct guesses" },
            ]}
            value={timeOrTarget}
            onChange={(value) => setTimeOrTarget(value)}
          />
        )}
        <button onClick={updateLeaderboard}>Update Leaderboard</button>
      </div>

      <div className="bg-muted rounded-lg p-6">
        <h2 className="text-2xl font-bold mb-4">Top Scores</h2>
        {scores.length === 0 ? (
          <p>No scores found for the selected filters.</p>
        ) : (
          <ul className="space-y-4">
            {scores.map((score, index) => (
              <li key={score.id} className="bg-background rounded-lg p-4 shadow">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{index + 1}. {score.username}</span>
                  <span className="font-bold">
                    {score.mode === 'timer' 
                      ? `${score.score} correct`
                      : `${score.score.toFixed(1)}s`
                    }
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  {score.gameMode} | {score.bits} bits | 
                  {score.mode === 'timer' 
                    ? `${getTimeLimitLabel(score.timeLimit)} time limit`
                    : `${score.targetNumber} correct guesses`
                  }
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// Add this helper function at the end of the file
function getTimeLimitLabel(timeLimit: number | undefined): string {
  switch (timeLimit) {
    case 1: return "30s";
    case 2: return "1m";
    case 3: return "2m";
    case 4: return "5m";
    default: return "Unknown";
  }
}