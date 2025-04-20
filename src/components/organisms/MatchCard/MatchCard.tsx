// /organisms/MatchCard.tsx
import React from "react";
import { StatCard } from "@/components/molecules/StatCard";
import { MatchResultBadge } from "@/components/atoms/MatchResultBadge";
import { TimeStamp } from "@/components/atoms/TimeStamp";
import { MatchScoreDisplay } from "@/components/molecules/MatchScoreDisplay";
import { TopPerformerCard } from "@/components/molecules/TopPerformerCard/TopPerformerCard";
import { Match, MatchDisplay, TopPerformer } from "@/types/match";

interface MatchCardProps {
  match: Match;
  clubId: number;
  topPerformer: TopPerformer | null;
  onSelect: (match: Match) => void;
}

export const MatchCard: React.FC<MatchCardProps> = ({
  match,
  clubId,
  topPerformer,
  onSelect,
}) => {
  const clubIdStr = clubId.toString();
  const ourClub = match.clubs[clubIdStr];
  const opponentClubId = Object.keys(match.clubs).find(
    (id) => id !== clubIdStr,
  );
  const opponentClub = opponentClubId ? match.clubs[opponentClubId] : null;

  const matchData: MatchDisplay = {
    homeTeam: {
      name: ourClub.details.name,
      score: ourClub.goals,
    },
    awayTeam: {
      name: opponentClub?.details.name || "",
      score: opponentClub?.goals || "",
    },
  };

  // Helper function to format match type
  const getMatchTypeLabel = (): string => {
    if (ourClub.matchType === "2") return "Playoff Match";
    if (ourClub.matchType === "1") return "League Match";
    return "Playoff Match";
  };

  if (!ourClub || !opponentClub) return null;

  return (
    <StatCard
      title={
        <div className="flex justify-between items-center">
          <TimeStamp timestamp={match.timestamp} />
          <MatchResultBadge result={ourClub.result} />
        </div>
      }
      description={
        <div className="flex justify-between items-center">
          <span>vs {opponentClub.details.name}</span>
          <span className="text-xs text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            {getMatchTypeLabel()}
          </span>
        </div>
      }
      onClick={() => onSelect(match)}
      className="cursor-pointer hover:shadow-md transition-shadow"
    >
      <div className="space-y-4">
        <MatchScoreDisplay matchData={matchData} />
        <TopPerformerCard player={topPerformer} />

        {match.timeAgo && (
          <div className="text-sm text-gray-500 mt-2">
            {match.timeAgo.number} {match.timeAgo.unit} ago
          </div>
        )}
      </div>
    </StatCard>
  );
};
