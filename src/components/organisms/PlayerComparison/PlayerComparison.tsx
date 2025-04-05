import React from "react";
import { StatCard } from "@/components/molecules/StatCard";
import { ChartBar } from "@/components/organisms/charts";
import { StatSelect, StatOption } from "@/components/molecules/StatSelect";
import { GameAverageToggle } from "@/components/atoms/GameAverageToggle";
import { calculatePer90Value } from "@/utils/PlayerStatsUtils";

export interface PlayerStats {
  name: string;
  favoritePosition: string;
  gamesPlayed: string;
  [key: string]: string;
}

interface ComparisonDataPoint {
  name: string;
  value: number;
  position: string;
}

interface PlayerComparisonProps {
  players: PlayerStats[];
  comparisonStat: string;
  setComparisonStat: (value: string) => void;
  isPer90: boolean;
  setIsPer90: (value: boolean) => void;
  statOptions: StatOption[];
  className?: string;
}

export const PlayerComparison: React.FC<PlayerComparisonProps> = ({
  players,
  comparisonStat,
  setComparisonStat,
  isPer90,
  setIsPer90,
  statOptions,
  className = "",
}) => {
  // Calculate comparison value based on current setting
  const calculateComparisonValue = (
    player: PlayerStats,
    statKey: string,
  ): number => {
    const rawValue = parseFloat(player[statKey]) || 0;

    // If per-90 is not enabled, or the stat isn't compatible with per-90 calculations,
    // return the raw value
    if (!isPer90 || !isPer90CompatibleStat(statKey)) {
      return rawValue;
    }

    // Use the shared utility function to calculate per-90 value
    return calculatePer90Value(rawValue, player.gamesPlayed);
  };

  // Check if a stat is compatible with per-90 calculations
  const isPer90CompatibleStat = (statKey: string): boolean => {
    const option = statOptions.find((opt) => opt.value === statKey);
    return option ? option.isPer90Compatible : false;
  };

  // Get comparison data for chart
  const getComparisonData = (): ComparisonDataPoint[] => {
    return players
      .map((player) => ({
        name: player.name,
        value: calculateComparisonValue(player, comparisonStat),
        position: player.favoritePosition,
      }))
      .sort((a, b) => b.value - a.value);
  };

  // Get selected stat display name
  const getSelectedStatLabel = (): string => {
    const option = statOptions.find((opt) => opt.value === comparisonStat);
    const baseName = option?.label || "Value";

    // If per-90 is enabled and the stat supports it, add "per 90" to the label
    if (isPer90 && isPer90CompatibleStat(comparisonStat)) {
      return `${baseName} (per 90)`;
    }

    return baseName;
  };

  const chartConfig = {
    value: {
      label: getSelectedStatLabel(),
      color: "var(--chart-1)",
      formatter: (value: number) => {
        // Format to 2 decimal places when in per-90 mode for compatible stats
        if (isPer90 && isPer90CompatibleStat(comparisonStat)) {
          return value.toFixed(2);
        }

        // For percentages, round to whole number
        if (comparisonStat.includes("Rate")) {
          return Math.round(value) + "%";
        }

        // For rating, show 1 decimal place
        if (comparisonStat === "ratingAve") {
          return value.toFixed(1);
        }

        // Default to rounded value for non-per-90 stats
        return isPer90 ? value.toFixed(2) : Math.round(value).toString();
      },
    },
  };

  return (
    <StatCard
      title="Players Comparison"
      description="Compare players across different statistics"
      className={className}
    >
      <div className="mb-4 flex flex-col md:flex-row items-start md:items-center gap-4">
        <StatSelect
          selectedStat={comparisonStat}
          onStatChange={setComparisonStat}
          options={statOptions}
          className="flex-grow"
        />

        <GameAverageToggle
          isPer90={isPer90}
          setIsPer90={setIsPer90}
          disabled={!isPer90CompatibleStat(comparisonStat)}
          className="mt-4 md:mt-8"
        />
      </div>

      <ChartBar
        data={getComparisonData()}
        layout="vertical"
        margin={{ left: 60, right: 20 }}
        chartConfig={chartConfig}
      />
    </StatCard>
  );
};
