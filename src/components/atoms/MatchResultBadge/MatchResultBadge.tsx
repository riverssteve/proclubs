// /atoms/MatchResultBadge.tsx
import React from 'react';

interface MatchResultBadgeProps {
  result: string;
}

export const MatchResultBadge: React.FC<MatchResultBadgeProps> = ({ result }) => {
  let text: string, bgColor: string, textColor: string;
  
  if (result === "1") {
    text = "WIN";
    bgColor = "bg-score-win-primary";
    textColor = "text-score-win-foreground";
  } else if (result === "0") {
    text = "DRAW";
    bgColor = "bg-score-draw-primary";
    textColor = "text-score-draw-foreground";
  } else {
    text = "LOSS";
    bgColor = "bg-score-loss-primary";
    textColor = "text-score-loss-foreground";
  }

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-bold ${bgColor} ${textColor}`}>
      {text}
    </span>
  );
};

