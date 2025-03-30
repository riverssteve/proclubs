import React from "react";
import { StatRow } from "@/components/atoms/StatValue";
import { StatCard } from "@/components/molecules/StatCard";
import { FormattedStatValue } from "@/components/atoms/FormattedStatValue";
import { GameAverageToggle } from "@/components/atoms/GameAverageToggle";

export interface PlayerDetailedStats {
  name: string;
  goals: string;
  assists: string;
  shotSuccessRate: string;
  passesMade: string;
  passSuccessRate: string;
  tacklesMade: string;
  tackleSuccessRate: string;
  cleanSheetsDef: string;
  cleanSheetsGK: string;
  favoritePosition: string;
}

interface PlayerStatsCardProps {
  player: PlayerDetailedStats;
  isPer90: boolean;
  setIsPer90: (value: boolean) => void;
}

export const PlayerStatsCard: React.FC<PlayerStatsCardProps> = ({
  player,
  isPer90,
  setIsPer90,
}) => {
  return (
    <>
      <div className="mb-4 flex items-center justify-end">
        <GameAverageToggle
          isPer90={isPer90}
          setIsPer90={setIsPer90}
          label="Show Per 90 Minutes Stats"
        />
      </div>

      <StatCard
        title="Performance Statistics"
        description={`Detailed stats for ${player.name}${isPer90 ? " (per 90 minutes)" : ""}`}
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-200">
              Offensive Stats
            </h3>
            <div className="space-y-2">
              <StatRow
                label="Goals"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.goals) || 0}
                    statKey="goals"
                    isPer90={isPer90}
                    isPer90Compatible={true}
                  />
                }
                emphasis
              />
              <StatRow
                label="Assists"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.assists) || 0}
                    statKey="assists"
                    isPer90={isPer90}
                    isPer90Compatible={true}
                  />
                }
                emphasis
              />
              <StatRow
                label="Shot Success"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.shotSuccessRate) || 0}
                    statKey="shotSuccessRate"
                    isPer90={isPer90}
                    isPer90Compatible={false}
                  />
                }
                emphasis
              />
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-200">
              Passing Stats
            </h3>
            <div className="space-y-2">
              <StatRow
                label="Passes Made"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.passesMade) || 0}
                    statKey="passesMade"
                    isPer90={isPer90}
                    isPer90Compatible={true}
                  />
                }
                emphasis
              />
              <StatRow
                label="Pass Success"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.passSuccessRate) || 0}
                    statKey="passSuccessRate"
                    isPer90={isPer90}
                    isPer90Compatible={false}
                  />
                }
                emphasis
              />
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
            <h3 className="text-lg font-bold mb-2 text-red-800 dark:text-red-200">
              Defensive Stats
            </h3>
            <div className="space-y-2">
              <StatRow
                label="Tackles Made"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.tacklesMade) || 0}
                    statKey="tacklesMade"
                    isPer90={isPer90}
                    isPer90Compatible={true}
                  />
                }
                emphasis
              />
              <StatRow
                label="Tackle Success"
                value={
                  <FormattedStatValue
                    value={parseFloat(player.tackleSuccessRate) || 0}
                    statKey="tackleSuccessRate"
                    isPer90={isPer90}
                    isPer90Compatible={false}
                  />
                }
                emphasis
              />
              <StatRow
                label="Clean Sheets"
                value={
                  <FormattedStatValue
                    value={
                      parseFloat(
                        player.favoritePosition === "goalkeeper"
                          ? player.cleanSheetsGK
                          : player.cleanSheetsDef,
                      ) || 0
                    }
                    statKey="cleanSheets"
                    isPer90={isPer90}
                    isPer90Compatible={true}
                  />
                }
                emphasis
              />
            </div>
          </div>
        </div>
      </StatCard>
    </>
  );
};
