import React from "react";

interface StatRowProps {
  label: string;
  value: string | number;
  emphasis?: boolean;
  capitalize?: boolean;
  win?: boolean;
  loss?: boolean;
}

export const StatRow: React.FC<StatRowProps> = ({
  label,
  value,
  emphasis = false,
  capitalize = false,
  win = false,
  loss = false,
}) => {
  const valueClasses = [
    "tabular-nums",
    emphasis && "font-bold",
    capitalize && "capitalize",
    win && "text-score-win-primary",
    loss && !win && "text-score-loss-primary",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div className="flex justify-between">
      <span className="font-medium">{label}:</span>
      <span className={valueClasses}>{value}</span>
    </div>
  );
};
