import React from "react";
import { StatCard } from "@/components/molecules/StatCard";
import { StatRow } from "@/components/atoms/StatValue";
import { MatchResultBadge } from "@/components/atoms/MatchResultBadge";
import { TimeStamp } from "@/components/atoms/TimeStamp";
import { MatchScoreDisplay } from "@/components/molecules/MatchScoreDisplay";
import { PlayerPerformanceTable } from "@/components/organisms/PlayerPerformance/PlayerPerformanceTable";
import { MatchStatsSummary } from "@/components/organisms/MatchStatsSummary/MatchStatsSummary";
import { Match, MatchPlayer, MatchDisplay } from "@/types/match";
import { Button } from "@/components/ui/button";

interface MatchDetailLayoutProps {
  match: Match;
  clubId: number;
  onBack: () => void;
}

export const MatchDetailLayout: React.FC<MatchDetailLayoutProps> = ({
  match,
  clubId,
  onBack,
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

  if (!ourClub || !opponentClub) return null;

  // Get team players
  const getTeamPlayers = (): MatchPlayer[] => {
    if (!match.players || !match.players[clubIdStr]) return [];
    return Object.values(match.players[clubIdStr]) as MatchPlayer[];
  };

  const teamPlayers = getTeamPlayers();

  // Calculate team average rating
  const calculateTeamRating = (): string => {
    if (teamPlayers.length === 0) return "N/A";

    const sum = teamPlayers.reduce((total, player) => {
      return total + parseFloat(player.rating || "0");
    }, 0);

    return (sum / teamPlayers.length).toFixed(2) + "/10";
  };

  // Find Man of the Match
  const getManOfTheMatch = (): string => {
    const motm = teamPlayers.find((p) => p.mom === "1");
    return motm ? motm.playername : "None";
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button onClick={onBack} className="hover:cursor-pointer">
          ← Back to Match History
        </Button>
        <MatchResultBadge result={ourClub.result} />
      </div>

      <StatCard
        title={
          <>
            Match Details -{" "}
            {match.timestamp ? (
              <TimeStamp timestamp={match.timestamp} />
            ) : (
              "Unknown Date"
            )}
          </>
        }
        description={`${ourClub.details.name} vs ${opponentClub.details.name}`}
      >
        <div className="space-y-6">
          <div className="py-4 border-b border-gray-200 dark:border-gray-700">
            <MatchScoreDisplay matchData={matchData} size="lg" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <MatchStatsSummary match={match} ourClub={ourClub} />

            <div>
              <h3 className="text-xl font-bold mb-3">Team Performance</h3>
              <div className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg">
                <StatRow
                  label="Players"
                  value={teamPlayers.length.toString()}
                />
                <StatRow label="Man of the Match" value={getManOfTheMatch()} />
                <StatRow label="Team Rating" value={calculateTeamRating()} />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold mb-3">Player Performances</h3>
            <PlayerPerformanceTable players={teamPlayers} />
          </div>
        </div>
      </StatCard>
    </div>
  );
};
