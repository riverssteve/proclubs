import React from 'react';

interface StatValueProps {
  label: string;
  value: string | number;
  valueClassName?: string;
}

export const StatValue: React.FC<StatValueProps> = ({
  label,
  value,
  valueClassName = '',
}) => {
  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className={valueClassName || 'font-bold'}>{value}</span>
    </div>
  );
};
