import { Timestamp } from 'firebase/firestore';

export interface ScoreEntry {
  id: string;
  userId: string;
  username: string;
  score: number;
  gameMode: 'decimalToBinary' | 'binaryToDecimal';
  bits: number;
  mode: 'timer' | 'number';
  timeLimit?: number;
  targetNumber?: number;
  createdAt: Timestamp;
}