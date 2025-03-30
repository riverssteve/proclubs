import React from 'react';

interface FormattedStatValueProps {
  value: number;
  statKey: string;
  isPer90: boolean;
  isPer90Compatible: boolean;
}

export const FormattedStatValue: React.FC<FormattedStatValueProps> = ({ 
  value, 
  statKey, 
  isPer90, 
  isPer90Compatible 
}) => {
  // Format with appropriate precision based on stat type and settings
  const formattedValue = (): string => {
    // If per-90 is enabled and the stat supports it, use decimal precision
    if (isPer90 && isPer90Compatible) {
      return value.toFixed(2);
    }
    
    // For percentage values, maintain as integer with % sign
    if (statKey.includes('Rate')) {
      return Math.round(value).toString() + '%';
    }
    
    // For average rating, show with one decimal place
    if (statKey === 'ratingAve') {
      return value.toFixed(1);
    }
    
    // For other values, return as whole numbers
    return Math.round(value).toString();
  };

  return <>{formattedValue()}</>;
};
