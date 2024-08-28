"use client";

import React, { useState, useEffect, useCallback } from 'react';
import { Combobox } from "@/components/ui/combobox";
import { ScoreEntry } from '@/types';
import Navbar from '../../components/Navbar';

export default function Leaderboard() {
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [gameMode, setGameMode] = useState<string>('decimalToBinary');
  const [bits, setBits] = useState<string>('8');
  const [mode, setMode] = useState<string>('timer');
  const [timeOrTarget, setTimeOrTarget] = useState<string>('60');

  const fetchScores = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      let url = `/api/leaderboard?gameMode=${gameMode}&bits=${bits}&mode=${mode}`;
      if (mode === 'timer') {
        url += `&timeLimit=${timeOrTarget}`;
      } else {
        url += `&targetNumber=${timeOrTarget}`;
      }

      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch scores');
      }
      const data: ScoreEntry[] = await response.json();
      setScores(data);
    } catch (error) {
      console.error('Error fetching scores:', error);
      setError('Failed to load scores. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  }, [gameMode, bits, mode, timeOrTarget]);

  useEffect(() => {
    fetchScores();
  }, [fetchScores]);

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl mb-6">Leaderboard</h1>
        
        <div className="flex flex-wrap gap-4 mb-6">
          <Combobox
            options={[
              { value: "decimalToBinary", label: "Decimal to Binary" },
              { value: "binaryToDecimal", label: "Binary to Decimal" },
            ]}
            value={gameMode}
            onChange={(value) => setGameMode(value)}
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
              setMode(value);
              setTimeOrTarget(value === 'timer' ? '60' : '10');
            }}
          />
          {mode === 'timer' && (
            <Combobox
              options={[
                { value: "30", label: "30 seconds" },
                { value: "60", label: "1 minute" },
                { value: "120", label: "2 minutes" },
                { value: "300", label: "5 minutes" },
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
        </div>

        {isLoading && <div>Loading scores...</div>}
        {error && <div className="text-red-500">{error}</div>}
        {!isLoading && !error && (
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
                        {mode === 'timer' 
                          ? `${score.score} correct`
                          : `${score.score.toFixed(1)}s`
                        }
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground mt-1">
                      {gameMode} | {bits} bits | 
                      {mode === 'timer' 
                        ? `${timeOrTarget}s time limit`
                        : `${timeOrTarget} correct guesses`
                      }
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </main>
    </div>
  );
}