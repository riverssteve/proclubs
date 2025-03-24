import React from 'react';

interface MatchScoreDisplayProps {
  homeTeam: string;
  awayTeam: string;
  homeScore: string;
  awayScore: string;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchScoreDisplay: React.FC<MatchScoreDisplayProps> = ({ 
  homeTeam, 
  awayTeam, 
  homeScore, 
  awayScore,
  size = 'md'
}) => {
  const sizeClasses = {
    sm: "text-lg",
    md: "text-xl md:text-2xl",
    lg: "text-2xl md:text-3xl"
  };
  
  const maxWidthClasses = {
    sm: "max-w-[80px] md:max-w-[120px]",
    md: "max-w-[100px] md:max-w-[150px]",
    lg: "max-w-[120px] md:max-w-[180px]"
  };

  return (
    <div className={`flex justify-between items-center ${sizeClasses[size]} font-bold`}>
      <span className={`truncate ${maxWidthClasses[size]}`}>{homeTeam}</span>
      <span className="px-4">{homeScore} - {awayScore}</span>
      <span className={`truncate ${maxWidthClasses[size]}`}>{awayTeam}</span>
    </div>
  );
};
