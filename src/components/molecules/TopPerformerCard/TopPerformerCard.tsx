// /molecules/TopPerformerCard.tsx
import React from 'react';
import { StatRow } from '@/components/atoms/StatValue';
import { PlayerRating } from '@/components/atoms/PlayerRating/PlayerRating';
import { TopPerformer } from '@/types/match';

interface TopPerformerCardProps {
  player: TopPerformer | null;
}

export const TopPerformerCard: React.FC<TopPerformerCardProps> = ({ player }) => {
  if (!player) return null;
  
  return (
    <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h4 className="font-bold mb-1">Top Performer</h4>
      <div className="grid grid-cols-2 gap-2">
        <StatRow label="Player" value={player.name} />
        <div className="flex justify-between">
          <span className="font-medium">Rating:</span>
          <PlayerRating rating={player.rating} />
        </div>
        <StatRow label="Goals" value={player.goals} />
        <StatRow label="Assists" value={player.assists} />
      </div>
    </div>
  );
};
