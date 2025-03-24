import React from 'react';
import { MatchCard } from '@/components/organisms/MatchCard/MatchCard';
import { Match, TopPerformer, MatchPlayer } from '@/types/match';

interface MatchHistoryListProps {
  matches: Match[];
  clubId: number;
  onSelectMatch: (match: Match) => void;
}

export const MatchHistoryList: React.FC<MatchHistoryListProps> = ({ matches, clubId, onSelectMatch }) => {
  // Get top performer from a match
  const getTopPerformer = (match: Match): TopPerformer | null => {
    const clubIdStr = clubId.toString();
    if (!match.players || !match.players[clubIdStr]) return null;

    const players = Object.values(match.players[clubIdStr]) as MatchPlayer[];
    if (players.length === 0) return null;

    // Sort by rating first, then goals, then assists
    const sortedPlayers = [...players].sort((a, b) => {
      const ratingDiff = parseFloat(b.rating) - parseFloat(a.rating);
      if (ratingDiff !== 0) return ratingDiff;
      
      const goalsDiff = parseInt(b.goals || '0') - parseInt(a.goals || '0');
      if (goalsDiff !== 0) return goalsDiff;
      
      return parseInt(b.assists || '0') - parseInt(a.assists || '0');
    });

    const topPlayer = sortedPlayers[0];
    return {
      name: topPlayer.playername,
      rating: topPlayer.rating,
      goals: topPlayer.goals || '0',
      assists: topPlayer.assists || '0'
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {matches.map((match) => (
        <MatchCard
          key={match.matchId}
          match={match}
          clubId={clubId}
          topPerformer={getTopPerformer(match)}
          onSelect={onSelectMatch}
        />
      ))}
    </div>
  );
};
