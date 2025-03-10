'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Label, Pie, PieChart } from "recharts";
import { Button } from '@/components/ui/button';

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
        color: result === "1" ? "bg-green-500" : result === "0" ? "bg-yellow-500" : "bg-red-500"
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

  const chartData = [
    { category: "wins", percentage: parseInt(data.wins || "0"), fill: "oklch(0.65 0.2 240)" },
    { category: "losses", percentage: parseInt(data.losses || "0"), fill: "oklch(0.35 0.1 240)" },
    { category: "draws", percentage: parseInt(data.ties || "0"), fill: "oklch(0.5 0.15 240)" },
  ]
  const chartConfig = {
    visitors: {
      label: "Visitors",
    },
    wins: {
      label: "Wins",
      color: "hsl(var(--chart-1))",
    },
    losses: {
      label: "Losses",
      color: "hsl(var(--chart-2))",
    },
    draws: {
      label: "Draws",
      color: "hsl(var(--chart-3))",
    },
  } satisfies ChartConfig

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
        <h1 className="text-4xl font-bold mb-7 text-center">Royal Rumballers</h1>
        <Link href="/players">
          <Button size="lg" className="bg-blue-700 hover:bg-blue-800">
            View Player Stats
          </Button>
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
        <Card>
          <CardHeader>
            <CardTitle>Team Overview</CardTitle>
            <CardDescription>General team statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Skill Rating:</span>
                <span className="font-bold">{data.skillRating}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Reputation Tier:</span>
                <span>{data.reputationtier}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Best Division:</span>
                <span>Division {data.bestDivision}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Best Finish:</span>
                <span>Group {data.bestFinishGroup}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Match Record</CardTitle>
            <CardDescription>Win/Loss statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={chartConfig}
              className="flex-1 pb-0"
            >
              <PieChart>
                <ChartTooltip
                  cursor={false}
                  content={<ChartTooltipContent hideLabel />}
                />
                <Pie
                  data={chartData}
                  dataKey="percentage"
                  nameKey="category"
                  innerRadius={50}
                >
                  <Label
                    content={({ viewBox }) => {
                      if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                        return (
                          <text
                            x={viewBox.cx}
                            y={viewBox.cy}
                            textAnchor="middle"
                            dominantBaseline="middle"
                          >
                            <tspan
                              x={viewBox.cx}
                              y={viewBox.cy}
                              className="fill-foreground text-3xl font-bold"
                            >
                              {gamesPlayed.toLocaleString()}
                            </tspan>
                            <tspan
                              x={viewBox.cx}
                              y={(viewBox.cy || 0) + 24}
                              className="fill-muted-foreground"
                            >
                              played
                            </tspan>
                          </text>
                        )
                      }
                    }}
                  />
                </Pie>
              </PieChart>
            </ChartContainer>
          </CardContent>
          <CardFooter className="flex justify-between">
            <span className="font-medium">Win Percentage:</span>
            <span className="font-bold text-green-600">
              {((parseInt(data.wins) / parseInt(data.gamesPlayed)) * 100).toFixed(1)}%
            </span>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Current Form</CardTitle>
            <CardDescription>Recent performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between">
                <span className="font-medium">Win Streak:</span>
                <span className="font-bold text-green-600">{data.wstreak}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Unbeaten Streak:</span>
                <span className="font-bold text-blue-600">{data.unbeatenstreak}</span>
              </div>
              <div className="mt-4">
                <span className="font-medium block mb-2">Last 5 Matches:</span>
                <div className="flex space-x-2">
                  {getFormResults().map((result, index) => (
                    <div
                      key={index}
                      className={`${result.color} w-8 h-8 rounded-full flex items-center justify-center text-white font-bold`}
                    >
                      {result.result}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Goals</CardTitle>
            <CardDescription>Scoring statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Goals Scored:</span>
                <span className="font-bold text-green-600">{data.goals}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Goals Against:</span>
                <span className="text-red-600">{data.goalsAgainst}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Goal Difference:</span>
                <span className={parseInt(data.goals || '0') - parseInt(data.goalsAgainst || '0') > 0 ? "text-green-600 font-bold" : "text-red-600 font-bold"}>
                  {parseInt(data.goals || '0') - parseInt(data.goalsAgainst || '0')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Avg. Goals Per Game:</span>
                <span>
                  {parseInt(data.gamesPlayed) > 0
                    ? (parseInt(data.goals) / parseInt(data.gamesPlayed)).toFixed(2)
                    : '0.00'}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>League Performance</CardTitle>
            <CardDescription>Promotion and relegation history</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">League Appearances:</span>
                <span>{data.leagueAppearances}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Promotions:</span>
                <span className="text-green-600 font-bold">{data.promotions}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Relegations:</span>
                <span className="text-red-600">{data.relegations}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Playoff Games:</span>
                <span>{data.gamesPlayedPlayoff}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default TeamSummary;

