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
  return (
    <div>
      <h3 className="text-xl font-bold mb-3">Match Statistics</h3>
      <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
        <StatRow
          label="Venue"
          value={ourClub.details.customKit?.stadName || "Unknown Stadium"}
        />
        <StatRow label="Match ID" value={match.matchId} />
        <StatRow
          label="Match Type"
          value={ourClub.matchType === "1" ? "League Match" : "Friendly"}
        />
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
