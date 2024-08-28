import React, { useEffect, useState } from 'react';
import { useUser } from "@clerk/nextjs";
import { ScoreEntry } from '@/types';

const UserTopScores: React.FC = () => {
  const { user } = useUser();
  const [topScores, setTopScores] = useState<ScoreEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTopScores = async () => {
      if (!user) return;

      try {
        const response = await fetch(`/api/scores?userId=${user.id}&limit=5`);
        if (!response.ok) {
          throw new Error('Failed to fetch top scores');
        }
        const data: ScoreEntry[] = await response.json();
        setTopScores(data);
      } catch (error) {
        console.error('Error fetching top scores:', error);
        setError('Failed to load top scores. Please try again later.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopScores();
  }, [user]);

  if (isLoading) return <div>Loading top scores...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Your Top Scores</h2>
      {topScores.length === 0 ? (
        <p>You haven&apos;t played any games yet. Start playing to see your top scores!</p>
      ) : (
        <ul className="space-y-2">
          {topScores.map((score, index) => (
            <li key={score.id} className="bg-muted rounded-lg p-4">
              <div className="font-medium">Score: {score.score}</div>
              <div className="text-sm text-muted-foreground">
                Mode: {score.gameMode} | Bits: {score.bits} | Time: {score.timeLimit}s
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserTopScores;
