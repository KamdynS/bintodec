import React from 'react';

interface ConversionSelectorProps {
  conversionType: 'decimalToBinary' | 'binaryToDecimal';
  onConversionTypeChange: (type: 'decimalToBinary' | 'binaryToDecimal') => void;
}

const ConversionSelector: React.FC<ConversionSelectorProps> = ({ conversionType, onConversionTypeChange }) => {
  return (
    <select
      value={conversionType}
      onChange={(e) => onConversionTypeChange(e.target.value as 'decimalToBinary' | 'binaryToDecimal')}
      className="bg-gray-700 text-white px-4 py-2 rounded-md"
    >
      <option value="decimalToBinary">Decimal to Binary</option>
      <option value="binaryToDecimal">Binary to Decimal</option>
    </select>
  );
};

export default ConversionSelector;
