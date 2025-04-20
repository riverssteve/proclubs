import React from "react";
import { StatRow } from "@/components/atoms/StatValue";
import { Match, Club } from "@/types/match";

interface MatchStatsSummaryProps {
  match: Match;
  ourClub: Club;
}

export const MatchStatsSummary: React.FC<MatchStatsSummaryProps> = ({
  match,
  ourClub,
}) => {
  // Format match type for display
  const getMatchTypeDisplay = (): string => {
    // If matchType is available directly
    if (ourClub.matchType) {
      if (ourClub.matchType === "1") return "League Match";
      if (ourClub.matchType === "2") return "Playoff Match";
      return "Friendly Match";
    }
    return "Unknown Match Type";
  };

  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Match Statistics</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <StatRow
          label="Venue"
          value={ourClub.details.customKit?.stadName || "Unknown Stadium"}
        />
        <StatRow label="Match ID" value={match.matchId} />
        <StatRow label="Match Type" value={getMatchTypeDisplay()} />
        {match.timeAgo && (
          <StatRow
            label="Played"
            value={`${match.timeAgo.number} ${match.timeAgo.unit} ago`}
          />
        )}
      </div>
    </div>
  );
};
