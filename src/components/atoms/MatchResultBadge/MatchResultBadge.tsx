import React from 'react';
import { MatchResult } from '@/types/match'

interface MatchResultBadgeProps {
  result: MatchResult;
}

export const MatchResultBadge: React.FC<MatchResultBadgeProps> = ({ result }) => {
  let text: string, bgColor: string, textColor: string;
  
  console.log(`MatchResultBadge: result=${result}`);
  if (result === MatchResult.win ) {
    text = "WIN";
    bgColor = "bg-score-win-primary";
    textColor = "text-score-win-foreground";
  } else if (result === MatchResult.draw) {
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

