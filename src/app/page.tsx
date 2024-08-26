"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Navbar from '../components/Navbar';
import BitSelector from '../components/BitSelector';
import ConversionSelector from '../components/ConversionSelector';
import TimerSelector from '../components/timerSelector';
import GameOverModal from '../components/GameOverModal';
import { Combobox } from "@/components/ui/combobox";

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
      const endTime = Date.now() + timer * 1000;
      interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimer(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setIsGameActive(false);
          setShowGameOver(true);
        }
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isGameActive, timer]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimer(timer);
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
      generateNewNumber();
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
            <Combobox
              options={[
                { value: "30", label: "30 seconds" },
                { value: "60", label: "1 minute" },
                { value: "120", label: "2 minutes" },
                { value: "300", label: "5 minutes" },
              ]}
              value={timer.toString()}
              onChange={(value) => setTimer(parseInt(value))}
            />
            <Button onClick={startGame}>Start</Button>
          </div>
        </section>
        {isGameActive && (
          <section className="bg-muted rounded-lg p-6">
            <h2 className="text-2xl font-bold tracking-tighter mb-4">Conversion Challenge</h2>
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="text-white mb-2">
                Time remaining: <span className="font-bold">{timer}</span>s
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
        &copy; 2024 Binary Blitz. All rights reserved.
      </footer>
      {showGameOver && (
        <GameOverModal score={score} onClose={() => setShowGameOver(false)} />
      )}
    </div>
  );
}