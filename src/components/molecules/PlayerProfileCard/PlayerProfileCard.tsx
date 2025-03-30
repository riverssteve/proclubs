import React from 'react';
import { StatRow } from '@/components/atoms/StatValue';
import { StatCard } from '@/components/molecules/StatCard';
import { FormattedStatValue } from '@/components/atoms/FormattedStatValue';

export interface PlayerProfile {
  name: string;
  proName: string;
  favoritePosition: string;
  proHeight: string;
  proNationality: string;
  proOverall: string;
  proStyle: string;
  gamesPlayed: string;
  winRate: string;
  manOfTheMatch: string;
  redCards: string;
  ratingAve: string;
}

interface PlayerProfileCardProps {
  player: PlayerProfile;
  isPer90: boolean;
}

export const PlayerProfileCard: React.FC<PlayerProfileCardProps> = ({ player, isPer90 }) => {
  return (
    <StatCard 
      title="Player Profile" 
      description={`${player.name} (${player.proName || 'Unknown'})`}
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <StatRow label="Position" value={player.favoritePosition} capitalize />
          <StatRow label="Height" value={`${player.proHeight || 'N/A'} cm`} />
          <StatRow label="Nationality" value={`ID: ${player.proNationality || 'N/A'}`} />
          <StatRow label="Overall Rating" value={`${player.proOverall || 'N/A'}/100`} emphasis />
          <StatRow label="Style" value={`ID: ${player.proStyle || 'N/A'}`} />
        </div>

        <div className="space-y-2">
          <StatRow label="Games Played" value={player.gamesPlayed || '0'} />
          <StatRow label="Win Rate" value={`${player.winRate || '0'}%`} />
          <StatRow 
            label="Man of the Match" 
            value={
              <FormattedStatValue 
                value={parseFloat(player.manOfTheMatch) || 0} 
                statKey="manOfTheMatch"
                isPer90={isPer90}
                isPer90Compatible={true}
              />
            } 
          />
          <StatRow 
            label="Red Cards" 
            value={
              <FormattedStatValue 
                value={parseFloat(player.redCards) || 0} 
                statKey="redCards"
                isPer90={isPer90}
                isPer90Compatible={true}
              />
            } 
          />
          <StatRow label="Average Rating" value={`${player.ratingAve || 'N/A'}/10`} emphasis />
        </div>
      </div>
    </StatCard>
  );
};
