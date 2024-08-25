import React from 'react';

interface TimerSelectorProps {
  timer: number;
  onTimerChange: (timer: number) => void;
}

const TimerSelector: React.FC<TimerSelectorProps> = ({ timer, onTimerChange }) => {
  return (
    <select
      value={timer}
      onChange={(e) => onTimerChange(Number(e.target.value))}
      className="bg-gray-700 text-white px-4 py-2 rounded-md"
    >
      <option value={10}>10 seconds</option>
      <option value={30}>30 seconds</option>
      <option value={60}>1 minute</option>
    </select>
  );
};

export default TimerSelector;
