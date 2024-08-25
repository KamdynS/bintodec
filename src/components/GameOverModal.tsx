import React from 'react';

interface GameOverModalProps {
  score: number;
  onClose: () => void;
}

const GameOverModal: React.FC<GameOverModalProps> = ({ score, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-gray-800 p-8 rounded-lg text-center">
        <h2 className="text-2xl font-bold mb-4">Game Over!</h2>
        <p className="text-xl mb-4">Congratulations! Your score was: {score}</p>
        <button
          onClick={onClose}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md"
        >
          Play Again
        </button>
      </div>
    </div>
  );
};

export default GameOverModal;
