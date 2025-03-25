import React from 'react';
import Image from "next/image";
import { MatchDisplay } from '@/types/match';

interface MatchScoreDisplayProps {
  matchData: MatchDisplay;
  size?: 'sm' | 'md' | 'lg';
}

export const MatchScoreDisplay: React.FC<MatchScoreDisplayProps> = ({ 
  matchData, size = 'md'
}) => {
  console.log(`size: ${size}`);
  return (
    <div className={`grid grid-cols-3 items-center py-4`}>
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 flex items-center justify-center mb-2">
          <span className="text-xl font-bold">
            <Image
              src="/team-logo.png"
              alt="RoyalRumballers Logo"
              width={200}
              height={200}
              priority
            />
          </span>
        </div>
        <span className="text-sm font-semibold text-center">
          {matchData.homeTeam.name}
        </span>
      </div>

      {/* Score */}
      <div className="flex justify-center items-center">
        <span className="text-4xl font-bold">{matchData.homeTeam.score}</span>
        <span className="text-4xl font-bold mx-2">-</span>
        <span className="text-4xl font-bold">{matchData.awayTeam.score}</span>
      </div>

      {/* Away Team */}
      <div className="flex flex-col items-center">
        <div className="w-16 h-16 flex items-center justify-center mb-2">
          <span className="text-xl font-bold">
              <Image
                src="/team-unknown.png"
                alt="Unknown Logo"
                width={200}
                height={200}
                priority
              />
            </span>
        </div>
        <span className="text-sm font-semibold text-center">
          {matchData.awayTeam.name}
        </span>
      </div>
    </div>
  );
};
