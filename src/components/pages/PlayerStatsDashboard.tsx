"use client";

import React, { useState, useEffect } from "react";
import {
  CLUB_ID,
  DEFAULT_STAT_OPTIONS,
  PlayerStats,
  TeamData,
  processTeamData,
} from "@/utils/PlayerStatsUtils";
import { PlayerSelect } from "@/components/molecules/PlayerSelect";
import { PositionDistribution } from "@/components/molecules/PositionDistribution";
import { PlayerComparison } from "@/components/organisms/PlayerComparison";
import { PlayerDetailTabs } from "@/components/organisms/PlayerDetailTabs";

const PlayerStatsDashboard: React.FC = () => {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(
    null,
  );
  const [comparisonStat, setComparisonStat] = useState<string>("winRate");
  const [isPer90, setIsPer90] = useState<boolean>(false);

  useEffect(() => {
    console.log("Component mounted, fetching data");

    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Use the internal API route
        const apiUrl = `/api/proclubs?platform=common-gen5&clubId=${CLUB_ID}`;
        console.log(`Fetching data from: ${apiUrl}`);

        // Fetch data through our Next.js API route
        const response = await fetch(apiUrl, {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`,
          );
        }

        const responseData = (await response.json()) as {
          members: PlayerStats[];
        };

        // Process the data to add positions and count them
        const processedData = processTeamData(responseData);

        setData(processedData);

        // Select the first player by default
        if (processedData.members && processedData.members.length > 0) {
          setSelectedPlayer(processedData.members[0]);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(
          `Failed to load player data: ${error instanceof Error ? error.message : "Unknown error"}`,
        );
        setLoading(false);
        // No fallback to mock data, we'll show an error message instead
        setData(null);
        setSelectedPlayer(null);
      }
    };

    loadData();
  }, []);

  // Handle player selection change
  const handlePlayerChange = (playerName: string) => {
    if (data) {
      const player = data.members.find((p) => p.name === playerName);
      if (player) setSelectedPlayer(player);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading stats...</span>
      </div>
    );

  if (error || !data)
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-red-500 text-xl mb-4">
          <span className="font-bold">Error:</span>{" "}
          {error || "Failed to load player data"}
        </div>
        <div className="max-w-md text-center text-gray-700">
          <p>
            Unable to connect to the data API. Please check your connection and
            try again later.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            API endpoint: /api/proclubs?platform=common-gen5&clubId={CLUB_ID}
          </p>
        </div>
      </div>
    );

  // Combined with the error check above

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Pro Players Statistics Dashboard
      </h1>

      {/* No error banner needed as we now show a full error page */}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {/* Player Comparison Chart */}
        <PlayerComparison
          players={data.members}
          comparisonStat={comparisonStat}
          setComparisonStat={setComparisonStat}
          isPer90={isPer90}
          setIsPer90={setIsPer90}
          statOptions={DEFAULT_STAT_OPTIONS}
          className="col-span-1 md:col-span-3"
        />

        {/* Position Distribution */}
        <PositionDistribution positionCount={data.positionCount} />
      </div>

      {/* Player Selector */}
      <PlayerSelect
        players={data.members}
        selectedPlayer={selectedPlayer?.name}
        onPlayerChange={handlePlayerChange}
        className="mb-8"
      />

      {/* Player Detail Tabs */}
      {selectedPlayer && (
        <PlayerDetailTabs player={selectedPlayer} isPer90={isPer90} />
      )}
    </div>
  );
};

export default PlayerStatsDashboard;
