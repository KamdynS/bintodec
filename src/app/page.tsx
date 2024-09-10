"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from '../components/Navbar';
import GameOverModal from '../components/GameOverModal';
import { Combobox } from "@/components/ui/combobox";
import { useUser } from "@clerk/nextjs";
import GameModeSelector from '../components/GameModeSelector';
import { db, signInWithFirebase } from '@/lib/firebase';

const DOMAIN = 'https://www.bintodec.com';

export default function Home() {
  const [number, setNumber] = useState<number>(0);
  const [userInput, setUserInput] = useState<string>('');
  const [feedback, setFeedback] = useState<string>('');
  const [bits, setBits] = useState<number>(8);
  const [conversionType, setConversionType] = useState<'decimalToBinary' | 'binaryToDecimal'>('decimalToBinary');
  const [score, setScore] = useState<number>(0);
  const [timer, setTimer] = useState<number>(30);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [showGameOver, setShowGameOver] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { isSignedIn, user } = useUser();
  const [gameMode, setGameMode] = useState<'timer' | 'number'>('timer');
  const [targetNumber, setTargetNumber] = useState<number>(5);
  const [elapsedTime, setElapsedTime] = useState<number>(0);
  const [mode, setMode] = useState<'timer' | 'number'>('timer');
  const [isFirebaseSignedIn, setIsFirebaseSignedIn] = useState<boolean>(false);
  const [timerOption, setTimerOption] = useState<string>("2"); // Default to 1 minute

  useEffect(() => {
    const attemptSignIn = async () => {
      // Check if we've already signed in during this session
      const firebaseSignedIn = localStorage.getItem('firebaseSignedIn');
      
      if (firebaseSignedIn === 'true') {
        setIsFirebaseSignedIn(true);
        return;
      }

      try {
        await signInWithFirebase();
        setIsFirebaseSignedIn(true);
        localStorage.setItem('firebaseSignedIn', 'true');
      } catch (error) {
        console.error('Error at line 48 in file page.tsx:', 'Failed to sign in to Firebase:', error);
      }
    };

    if (isSignedIn && !isFirebaseSignedIn) {
      attemptSignIn();
    }
  }, [isSignedIn, isFirebaseSignedIn]);

  const saveScore = useCallback(async () => {
    if (!isSignedIn || !user) {
      return;
    }

    try {
      const timerValue = mode === 'timer' ? 
        (timer === 30 ? 1 : timer === 60 ? 2 : timer === 120 ? 3 : 4) : undefined;

      const scoreData = {
        username: user.username || 'Anonymous',
        score: mode === 'timer' ? score : elapsedTime,
        gameMode: conversionType,
        bits,
        mode,
        ...(mode === 'timer' 
          ? { timeLimit: timerValue } 
          : { targetNumber: targetNumber }),
      };


      const response = await fetch(`${DOMAIN}/api/scores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'same-origin',
        body: JSON.stringify(scoreData),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(`Failed to save score: ${responseData.error || response.statusText}`);
      }

    } catch (error) {
      if (error instanceof Error) {
        console.error('Error at line 94 in file page.tsx:', 'Error stack:', error.stack);
      }
    }
  }, [isSignedIn, user, mode, score, elapsedTime, conversionType, bits, timer, targetNumber]);

  const generateNewNumber = useCallback(() => {
    const maxNumber = Math.pow(2, bits) - 1;
    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * (maxNumber + 1));
    } while (newNumber === number);
    setNumber(newNumber);
    setUserInput('');
    setFeedback('');
  }, [bits, number]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isGameActive) {
      if (gameMode === 'timer') {
        const endTime = Date.now() + timer * 1000;
        interval = setInterval(() => {
          const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
          setTimer(remaining);
          if (remaining <= 0) {
            clearInterval(interval);
            setIsGameActive(false);
            setShowGameOver(true);
            saveScore();
          }
        }, 100);
      } else {
        interval = setInterval(() => {
          setElapsedTime((prevTime) => prevTime + 0.1);
        }, 100);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, timer, gameMode, saveScore]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setElapsedTime(0);
    if (gameMode === 'timer') {
      setTimer(timer);
    }
    generateNewNumber();
    setFeedback('');
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isGameActive) {
      checkAnswer();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
    setFeedback('');
  };

  const checkAnswer = () => {
    const correctAnswer = conversionType === 'decimalToBinary' 
      ? number.toString(2).padStart(bits, '0') 
      : parseInt(number.toString(2), 2);
    if (userInput === correctAnswer.toString()) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Correct!');
      if (gameMode === 'number' && score + 1 >= targetNumber) {
        setIsGameActive(false);
        setShowGameOver(true);
        saveScore();
      } else {
        generateNewNumber();
      }
      setUserInput('');
    } else {
      setFeedback('Incorrect. Try again!');
    }
  };

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background">
      <Navbar />
      <main className="flex-1 container max-w-5xl mx-auto px-4 py-12 sm:px-6 lg:px-8 grid gap-8">
        <section>
          <h1 className="text-3xl font-bold tracking-tighter sm:text-4xl">Bin to Dec</h1>
          <p className="mt-4 max-w-[600px] text-muted-foreground md:text-xl/relaxed">
            Test your binary and decimal conversion skills in this fast-paced challenge. Can you keep up with the clock?
          </p>
          <div className="flex space-x-2 items-center">
            <Combobox
              options={[
                { value: "decimalToBinary", label: "Decimal to Binary" },
                { value: "binaryToDecimal", label: "Binary to Decimal" },
              ]}
              value={conversionType}
              onChange={(value) => setConversionType(value as 'decimalToBinary' | 'binaryToDecimal')}
            />
            <Combobox
              options={[
                { value: "4", label: "4 bits" },
                { value: "8", label: "8 bits" },
                { value: "16", label: "16 bits" },
                { value: "32", label: "32 bits" },
              ]}
              value={bits.toString()}
              onChange={(value) => setBits(parseInt(value))}
            />
            <GameModeSelector
              gameMode={gameMode}
              onGameModeChange={(newMode) => {
                setGameMode(newMode);
                setMode(newMode);  // Update both gameMode and mode
              }}
              targetNumber={targetNumber}
              onTargetNumberChange={setTargetNumber}
            />
            {gameMode === 'timer' && (
              <Combobox
                options={[
                  { value: "1", label: "30 seconds" },
                  { value: "2", label: "1 minute" },
                  { value: "3", label: "2 minutes" },
                  { value: "4", label: "5 minutes" },
                ]}
                value={timerOption}
                onChange={(value) => {
                  setTimerOption(value);
                  const timerValue = parseInt(value);
                  setTimer(timerValue === 1 ? 30 : timerValue === 2 ? 60 : timerValue === 3 ? 120 : 300);
                }}
              />
            )}
            <Button onClick={startGame}>Start</Button>
          </div>
        </section>
        {isGameActive && (
          <section className="bg-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold tracking-tighter mb-4">Conversion Challenge</h2>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-white mb-2">
                {gameMode === 'timer' ? (
                  <>Time remaining: <span className="font-bold">{timer}</span>s</>
                ) : (
                  <>Time elapsed: <span className="font-bold">{elapsedTime.toFixed(1)}</span>s</>
                )}
              </div>
              <div className="text-4xl font-bold mb-4">
                {conversionType === 'decimalToBinary' ? number : number.toString(2).padStart(bits, '0')}
              </div>
              <div className="w-full flex flex-col items-center">
                <Input
                  type="text"
                  value={userInput}
                  onChange={handleInputChange}
                  onKeyPress={handleKeyPress}
                  placeholder={`Enter ${conversionType === 'decimalToBinary' ? 'binary' : 'decimal'}`}
                  className="w-1/2 text-center"
                  ref={inputRef}
                />
                <p className="text-white mt-2">Press enter to submit</p>
                {feedback && (
                  <p className={`mt-2 ${feedback === 'Incorrect. Try again!' ? 'text-red-500' : 'text-green-500'}`}>
                    {feedback}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      <footer className="bg-muted p-4 text-center text-sm text-muted-foreground">
        &copy; 2024 Bin to Dec. All rights reserved.
      </footer>
      {showGameOver && (
        <GameOverModal 
          score={score} 
          onClose={() => setShowGameOver(false)} 
          gameMode={gameMode}
          elapsedTime={elapsedTime}
        />
      )}
    </div>
  );
}