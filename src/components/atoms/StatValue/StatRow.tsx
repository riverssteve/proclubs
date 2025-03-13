import React from 'react';

interface StatRowProps {
  label: string;
  value: string | number;
  emphasis?: boolean;
  capitalize?: boolean;
} 

export const StatRow: React.FC<StatRowProps> = ({
  label, value, emphasis = false, capitalize = false
}) => {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className={`${emphasis ? 'font-bold' : ''}  ${capitalize ? 'capitalize' : ''}`}> 
        {value}
      </span>
    </div>
  )
}
