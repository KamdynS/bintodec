import { Timestamp } from 'firebase/firestore';

export interface UserData {
  id: string;
  username: string;
  email: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ScoreData {
  id: string;
  userId: string;
  username: string;
  score: number;
  gameMode: 'decimalToBinary' | 'binaryToDecimal';
  bits: number;
  timeLimit: number;
  mode: 'timer' | 'number';
  createdAt: Timestamp;
}

export interface ScoreEntry extends Omit<ScoreData, 'id'> {}