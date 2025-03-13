import React from 'react';

interface StatValueProps {
  label: string;
  value: number;
}

export const StatValue: React.FC<StatValueProps> = ({ label, value }) => {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className="tabular-nums"> 
        {value}
      </span>
    </div>
  );
};
