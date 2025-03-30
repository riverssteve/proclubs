"use client";

import React, { useState, useEffect } from "react";
import { MatchHistoryList } from "@/components/templates/MatchHistoryList";
import { MatchDetailLayout } from "@/components/templates/MatchDetailLayout";
import { Match, MatchResult } from "@/types/match";

// Royal Rumballers club ID
const CLUB_ID = 287755;

export const MatchTrackerPage: React.FC = () => {
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedMatch, setSelectedMatch] = useState<Match | null>(null);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      // TODO: Make this configurable via UI with a max result
      const matchType = "leagueMatch";
      const maxResultCount = 8;
      try {
        setLoading(true);
        const apiUrl = `/api/proclubs/matches?platform=common-gen5&clubId=${CLUB_ID}&matchType=${matchType}&maxResultCount=${maxResultCount}`;

        const response = await fetch(apiUrl, {
          method: "GET",
          headers: { Accept: "application/json" },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch data: ${response.status} ${response.statusText}`,
          );
        }

        const responseData = (await response.json()) as Match[];
        setMatches(responseData);
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        setError(`Failed to load match data: ${errorMessage}`);
        setLoading(false);

        // Fall back to mock data
        setMatches(getMockData());
      }
    };

    loadData();
  }, []);

  // Mock data function (simplified for this example)
  const getMockData = (): Match[] => {
    return [
      {
        matchId: "329570930660408",
        timestamp: 1742423131,
        timeAgo: {
          number: 4,
          unit: "days",
        },
        clubs: {
          "161064": {
            date: "1742423129",
            gameNumber: "0",
            goals: "3",
            goalsAgainst: "2",
            losses: "0",
            matchType: "1",
            result: MatchResult.win,
            score: "3",
            ties: "0",
            winnerByDnf: "0",
            wins: "1",
            details: {
              name: "Wokolution XI",
              clubId: 161064,
              regionId: 4344147,
              teamId: 110,
              customKit: {
                stadName: "Wok HQ",
              },
            },
          },
          "287755": {
            date: "1742423129",
            gameNumber: "0",
            goals: "2",
            goalsAgainst: "3",
            losses: "1",
            matchType: "1",
            result: MatchResult.loss,
            score: "2",
            ties: "0",
            winnerByDnf: "0",
            wins: "0",
            details: {
              name: "RoyalRumballers",
              clubId: 287755,
              regionId: 4344147,
              teamId: 1808,
              customKit: {
                stadName: "RAW is WAR",
              },
            },
          },
        },
        players: {
          "287755": {
            "1005087821492": {
              assists: "0",
              goals: "2",
              mom: "0",
              pos: "midfielder",
              rating: "9.20",
              shots: "5",
              passattempts: "15",
              passesmade: "12",
              tackleattempts: "5",
              tacklesmade: "0",
              playername: "Its_OmegaRez",
            },
            "979742783": {
              assists: "1",
              goals: "0",
              mom: "0",
              pos: "midfielder",
              rating: "8.40",
              shots: "3",
              tackleattempts: "8",
              tacklesmade: "2",
              playername: "Furious_Bearman",
            },
          },
        },
      },
    ];
  };

  // Handle match selection
  const selectMatch = (match: Match): void => {
    setSelectedMatch(match);
    window.scrollTo(0, 0);
  };

  // Handle going back to match history
  const backToHistory = (): void => {
    setSelectedMatch(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-3">Loading match history...</span>
      </div>
    );
  }

  if (error && matches.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <div>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Match History</h1>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            <span className="font-bold">Note:</span> {error} Using fallback data
            for demonstration.
          </p>
        </div>
      )}

      {selectedMatch ? (
        <MatchDetailLayout
          match={selectedMatch}
          clubId={CLUB_ID}
          onBack={backToHistory}
        />
      ) : (
        <MatchHistoryList
          matches={matches}
          clubId={CLUB_ID}
          onSelectMatch={selectMatch}
        />
      )}
    </div>
  );
};
