import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'ghost';
}

export const Button: React.FC<ButtonProps> = ({ 
  children, 
  variant = 'default', 
  className = '', 
  ...props 
}) => {
  const baseStyles = 'px-4 py-2 rounded-md';
  const variantStyles = variant === 'ghost' 
    ? 'text-white hover:bg-gray-700' 
    : 'bg-gold text-gray-800 hover:bg-gold-600';

  return (
    <button 
      className={`${baseStyles} ${variantStyles} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};