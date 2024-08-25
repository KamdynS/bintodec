"use client";

import { useState, useEffect, useCallback, useRef } from 'react';
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
    setTimeout(() => inputRef.current?.focus(), 0);
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
    <main className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <Navbar />
      <div className="container mx-auto px-4 py-8 flex-grow flex flex-col items-center">
        <h1 className="text-4xl font-bold mb-4">Binary Blitz</h1>
        <p className="text-xl mb-8">
          Test your binary and decimal conversion skills in this fast-paced challenge. Can you keep up with the clock?
        </p>
        {!isGameActive ? (
          <button
            onClick={startGame}
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-md text-lg mb-8"
          >
            Start Game
          </button>
        ) : (
          <div className="w-full max-w-2xl bg-gray-800 p-8 rounded-lg shadow-lg">
            <h2 className="text-2xl font-bold mb-4">Conversion Challenge</h2>
            <p className="text-3xl font-bold mb-6">
              {conversionType === 'decimalToBinary' ? number : number.toString(2).padStart(bits, '0')}
            </p>
            <div className="flex items-center mb-4">
              <input
                ref={inputRef}
                type="text"
                value={userInput}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                className="bg-gray-700 text-white px-4 py-2 rounded-l-md w-full text-xl"
                placeholder={`Enter ${conversionType === 'decimalToBinary' ? 'binary' : 'decimal'}`}
              />
              <button
                onClick={checkAnswer}
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-r-md text-xl"
              >
                Submit
              </button>
            </div>
            <p className="text-lg">Time remaining: {timer} seconds</p>
            {feedback !== 'Nice!' && <p className="mt-4 text-xl text-red-500">{feedback}</p>}
          </div>
        )}
        <div className="mt-8 flex space-x-4">
          <BitSelector bits={bits} onBitsChange={setBits} />
          <ConversionSelector conversionType={conversionType} onConversionTypeChange={setConversionType} />
          <TimerSelector timer={timer} onTimerChange={setTimer} />
        </div>
        <div className="mt-8 text-2xl">
          Score: {score}
        </div>
      </div>
      {showGameOver && (
        <GameOverModal score={score} onClose={() => setShowGameOver(false)} />
      )}
    </main>
  );
}