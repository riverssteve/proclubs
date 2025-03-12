'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { StatValue } from '@/components/atoms/StatValue';
import { StatCard } from '@/components/molecules/StatCard';
import { ChartPie } from '@/components/organisms/charts';

// Royal Rumballers club ID
const CLUB_ID = 287755;

// Define types for our data structures
interface TeamStats {
  clubId: string;
  bestDivision: string;
  bestFinishGroup: string;
  gamesPlayed: string;
  gamesPlayedPlayoff: string;
  goals: string;
  goalsAgainst: string;
  promotions: string;
  relegations: string;
  losses: string;
  ties: string;
  wins: string;
  wstreak: string;
  unbeatenstreak: string;
  skillRating: string;
  reputationtier: string;
  leagueAppearances: string;
  lastMatch0: string;
  lastMatch1: string;
  lastMatch2: string;
  lastMatch3: string;
  lastMatch4: string;
  lastMatch5: string;
  lastMatch6: string;
  lastMatch7: string;
  lastMatch8: string;
  lastMatch9: string;
}

// Mock data for when the API is unavailable
const getMockData = (): TeamStats => {
  return {
    "clubId": "287755",
    "bestDivision": "3",
    "bestFinishGroup": "2",
    "gamesPlayed": "289",
    "gamesPlayedPlayoff": "47",
    "goals": "739",
    "goalsAgainst": "599",
    "promotions": "15",
    "relegations": "6",
    "losses": "99",
    "ties": "37",
    "wins": "153",
    "lastMatch0": "1",
    "lastMatch1": "1",
    "lastMatch2": "1",
    "lastMatch3": "1",
    "lastMatch4": "1",
    "lastMatch5": "-1",
    "lastMatch6": "-1",
    "lastMatch7": "-1",
    "lastMatch8": "-1",
    "lastMatch9": "-1",
    "wstreak": "8",
    "unbeatenstreak": "8",
    "skillRating": "2196",
    "reputationtier": "2",
    "leagueAppearances": "242"
  };
};

const TeamSummary: React.FC = () => {
  const [data, setData] = useState<TeamStats | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const gamesPlayed = React.useMemo(() => {
    return data?.gamesPlayed || "0";
  }, [data]);

  useEffect(() => {
    console.log("Component mounted, fetching data");

    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Use the internal API route instead of the external Cloudflare Worker
        const apiUrl = `/api/proclubs/team?platform=common-gen5&clubId=${CLUB_ID}`;
        console.log(`Fetching data from: ${apiUrl}`);

        // Fetch data through our Next.js API route
        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Accept': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch data: ${response.status} ${response.statusText}`);
        }

        const responseData = await response.json() as TeamStats[] | TeamStats;

        // Handle the case where the API returns an array
        if (Array.isArray(responseData)) {
          // Use the first item if available, otherwise null
          setData(responseData.length > 0 ? responseData[0] : null);
        } else {
          // Direct object response
          setData(responseData);
        }

        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(`Failed to load team data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);

        // Fall back to mock data for development/testing
        console.log("Falling back to mock data");
        const mockData = getMockData();
        setData(mockData);
      }
    };

    loadData();
  }, []);

  // Function to get form results (last 5 matches)
  const getFormResults = () => {
    if (!data) return [];

    return [0, 1, 2, 3, 4].map(i => {
      const key = `lastMatch${i}` as keyof TeamStats;
      const result = data[key];
      return {
        result: result === "1" ? "W" : result === "0" ? "D" : "L",
        color: result === "1" ? "bg-score-win-primary" : result === "0" ? "bg-score-draw-primary" : "bg-score-loss-primary",
        colorText: result === "1" ? "text-score-win-foreground" : result === "0" ? "text-score-draw-foreground" : "text-score-loss-foreground"
      };
    });
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3">Loading team stats...</span>
    </div>
  );

  if (error && !data) return (
    <div className="flex items-center justify-center h-screen text-red-500">
      <div>Error: {error}</div>
    </div>
  );

  if (!data) return (
    <div className="flex items-center justify-center h-screen">
      No data available
    </div>
  );

  // Prepare data for pie chart
  const chartData = [
    { category: "wins", percentage: parseInt(data.wins || "0"), fill: "var(--color-wins)" },
    { category: "losses", percentage: parseInt(data.losses || "0"), fill: "var(--color-losses)" },
    { category: "draws", percentage: parseInt(data.ties || "0"), fill: "var(--color-draws)" },
  ];
  
  const chartConfig = {
    wins: {
      label: "Wins",
      color: "var(--chart-1)",
    },
    losses: {
      label: "Losses",
      color: "var(--chart-2)",
    },
    draws: {
      label: "Draws",
      color: "var(--chart-3)",
    },
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center justify-center mb-12">
        <div className="mb-8">
          <Image
            src="/team-logo.png"
            alt="Royal Rumballers Logo"
            width={200}
            height={200}
            priority
          />
        </div>
        <h1 className="text-4xl font-extrablack mb-7 text-center">Royal Rumballers</h1>
        <Link href="/players">
          <Button size="lg" className="hover:cursor-pointer">View Player Stats</Button>
        </Link>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            <span className="font-bold">Note:</span> {error} Using fallback data for demonstration.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <StatCard title="Team Overview" description="General team statistics">
          <div className="space-y-2">
            <StatValue label="Skill Rating" value={data.skillRating} valueClassName="font-bold" />
            <StatValue label="Reputation Tier" value={data.reputationtier} />
            <StatValue label="Best Division" value={`Division ${data.bestDivision}`} />
            <StatValue label="Best Finish" value={`Group ${data.bestFinishGroup}`} />
          </div>
        </StatCard>

        <StatCard 
          title="Match Record" 
          description="Win/Loss statistics"
          footer={
            <div className="flex justify-between w-full">
              <span className="font-medium">Win Percentage:</span>
              <span className="font-bold text-score-win-primary">
                {((parseInt(data.wins) / parseInt(data.gamesPlayed)) * 100).toFixed(1)}%
              </span>
            </div>
          }
        >
          <ChartPie 
            data={chartData} 
            centerLabel={gamesPlayed.toLocaleString()}
            centerSubLabel="played"
            chartConfig={chartConfig}
          />
        </StatCard>

        <StatCard title="Current Form" description="Recent performance">
          <div className="space-y-4">
            <StatValue 
              label="Win Streak" 
              value={data.wstreak} 
              valueClassName="font-bold text-score-win-primary" 
            />
            <StatValue 
              label="Unbeaten Streak" 
              value={data.unbeatenstreak}
              valueClassName={parseInt(data.unbeatenstreak || '0') > 1 ? "text-score-win-primary font-bold proportional-nums" : "text-zinc-500 font-semibold proportional-nums"}
            />
            <div className="mt-4">
              <span className="font-medium block mb-2">Last 5 Matches:</span>
              <div className="flex space-x-2">
                {getFormResults().map((result, index) => (
                  <div
                    key={index}
                    className={`${result.color} w-8 h-8 rounded-full flex items-center justify-center ${result.colorText} font-bold`}
                  >
                    {result.result}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </StatCard>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StatCard title="Goals" description="Scoring statistics">
          <div className="space-y-2">
            <StatValue 
              label="Goals Scored" 
              value={data.goals} 
              valueClassName="proportional-nums font-extrabold text-score-win-primary"
            />
            <StatValue 
              label="Goals Against" 
              value={data.goalsAgainst} 
              valueClassName="proportional-nums font-bold text-score-loss-primary"
            />
            <StatValue 
              label="Goal Difference" 
              value={parseInt(data.goals || '0') - parseInt(data.goalsAgainst || '0')}
              valueClassName={parseInt(data.goals || '0') - parseInt(data.goalsAgainst || '0') > 0 ? "text-score-win-primary font-bold proportional-nums" : "text-score-loss-primary font-semibold proportional-nums"}
            />
            <StatValue 
              label="Avg. Goals Per Game" 
              value={parseInt(data.gamesPlayed) > 0
                ? (parseInt(data.goals) / parseInt(data.gamesPlayed)).toFixed(2)
                : '0.00'}
              valueClassName="proportional-nums"
            />
          </div>
        </StatCard>

        <StatCard title="League Performance" description="Promotion and relegation history">
          <div className="space-y-2">
            <StatValue 
              label="League Appearances" 
              value={data.leagueAppearances}
              valueClassName="proportional-nums"
            />
            <StatValue 
              label="Promotions" 
              value={data.promotions}
              valueClassName="text-score-win-primary font-semibold proportional-nums"
            />
            <StatValue 
              label="Relegations" 
              value={data.relegations}
              valueClassName="text-score-loss-primary font-semibold proportional-nums"
            />
            <StatValue 
              label="Playoff Games" 
              value={data.gamesPlayedPlayoff}
              valueClassName="proportional-nums"
            />
          </div>
        </StatCard>
      </div>
    </div>
  );
};

export default TeamSummary;
