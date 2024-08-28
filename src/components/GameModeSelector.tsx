import React from 'react';
import { Combobox } from "@/components/ui/combobox";

interface GameModeSelectorProps {
  gameMode: 'timer' | 'number';
  onGameModeChange: (mode: 'timer' | 'number') => void;
  targetNumber: number;
  onTargetNumberChange: (target: number) => void;
}

const GameModeSelector: React.FC<GameModeSelectorProps> = ({
  gameMode,
  onGameModeChange,
  targetNumber,
  onTargetNumberChange
}) => {
  return (
    <div className="flex space-x-2 items-center">
      <Combobox
        options={[
          { value: "timer", label: "Timer Mode" },
          { value: "number", label: "Number Mode" },
        ]}
        value={gameMode}
        onChange={(value) => onGameModeChange(value as 'timer' | 'number')}
      />
      {gameMode === 'number' && (
        <Combobox
          options={[
            { value: "5", label: "5 correct guesses" },
            { value: "10", label: "10 correct guesses" },
            { value: "20", label: "20 correct guesses" },
          ]}
          value={targetNumber.toString()}
          onChange={(value) => onTargetNumberChange(parseInt(value))}
        />
      )}
    </div>
  );
};

export default GameModeSelector;