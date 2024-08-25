"use client";

import { useState, useEffect, useCallback } from 'react';
import Navbar from '../components/Navbar';
import BitSelector from '../components/BitSelector';
import ConversionSelector from '../components/ConversionSelector';
import TimerSelector from '../components/timerSelector';
import GameOverModal from '../components/GameOverModal';

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

  const generateNewNumber = useCallback(() => {
    const maxNumber = Math.pow(2, bits) - 1;
    const newNumber = Math.floor(Math.random() * (maxNumber + 1));
    setNumber(newNumber);
    setUserInput('');
    setFeedback('');
  }, [bits]);

  useEffect(() => {
    if (isGameActive) {
      const endTime = Date.now() + timer * 1000;
      const interval = setInterval(() => {
        const remaining = Math.max(0, Math.ceil((endTime - Date.now()) / 1000));
        setTimer(remaining);
        if (remaining <= 0) {
          clearInterval(interval);
          setIsGameActive(false);
          setShowGameOver(true);
        }
      }, 100);
      return () => clearInterval(interval);
    }
  }, [isGameActive, timer]);

  const startGame = () => {
    setIsGameActive(true);
    setScore(0);
    setTimer(timer); // Reset timer to initial value
    generateNewNumber();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && isGameActive) {
      checkAnswer();
    }
  };

  const checkAnswer = () => {
    const correctAnswer = conversionType === 'decimalToBinary' 
      ? number.toString(2).padStart(bits, '0') 
      : parseInt(number.toString(2), 2);
    if (userInput === correctAnswer.toString()) {
      setScore((prevScore) => prevScore + 1);
      setFeedback('Nice!');
      generateNewNumber();
    } else {
      setFeedback('Incorrect. Try again!');
    }
  };

  return (
    <main className="min-h-screen bg-gray-900 text-gray-100">
      <Navbar />
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Binary-Decimal Conversion Practice</h1>
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-4">
            <BitSelector bits={bits} onBitsChange={setBits} />
            <ConversionSelector conversionType={conversionType} onConversionTypeChange={setConversionType} />
            <TimerSelector timer={timer} onTimerChange={setTimer} />
          </div>
          <div className="text-xl">
            Score: {score} {feedback === 'Nice!' && <span className="text-green-500 ml-2">{feedback}</span>}
          </div>
        </div>
        {!isGameActive ? (
          <button
            onClick={startGame}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
          >
            Start Game
          </button>
        ) : (
          <>
            <p className="mb-4">Time remaining: {timer} seconds</p>
            <p className="mb-4">Convert the following {conversionType === 'decimalToBinary' ? 'decimal to binary' : 'binary to decimal'}:</p>
            <p className="text-2xl font-bold mb-4">
              {conversionType === 'decimalToBinary' ? number : number.toString(2).padStart(bits, '0')}
            </p>
            <input
              type="text"
              value={userInput}
              onChange={handleInputChange}
              onKeyPress={handleKeyPress}
              className="bg-gray-700 text-white px-4 py-2 rounded-md mr-2"
              placeholder="Enter your answer"
            />
            {feedback !== 'Nice!' && <p className="mt-4 text-xl text-red-500">{feedback}</p>}
          </>
        )}
      </div>
      {showGameOver && (
        <GameOverModal score={score} onClose={() => setShowGameOver(false)} />
      )}
    </main>
  );
}