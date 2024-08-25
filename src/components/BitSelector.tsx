import React from 'react';

interface BitSelectorProps {
  bits: number;
  onBitsChange: (bits: number) => void;
}

const BitSelector: React.FC<BitSelectorProps> = ({ bits, onBitsChange }) => {
  const options = [4, 8, 16, 32];

  return (
    <div className="mb-4">
      <label htmlFor="bitSelect" className="mr-2">Select number of bits:</label>
      <select
        id="bitSelect"
        value={bits}
        onChange={(e) => onBitsChange(Number(e.target.value))}
        className="bg-gray-700 text-white px-2 py-1 rounded-md"
      >
        {options.map(option => (
          <option key={option} value={option}>{option}</option>
        ))}
      </select>
    </div>
  );
};

export default BitSelector;
