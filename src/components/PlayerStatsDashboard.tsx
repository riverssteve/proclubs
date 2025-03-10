// src/components/PlayerStatsDashboard.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { Bar, BarChart, LabelList, XAxis, YAxis } from 'recharts';
import { ChartConfig, ChartContainer } from "@/components/ui/chart";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";

// Royal Rumballers club ID
const CLUB_ID = 287755;

// Define types for our data structures
interface PlayerStats {
  name: string;
  gamesPlayed: string;
  winRate: string;
  goals: string;
  assists: string;
  cleanSheetsDef: string;
  cleanSheetsGK: string;
  shotSuccessRate: string;
  passesMade: string;
  passSuccessRate: string;
  ratingAve: string;
  tacklesMade: string;
  tackleSuccessRate: string;
  proName: string;
  proPos: string;
  proStyle: string;
  proHeight: string;
  proNationality: string;
  proOverall: string;
  proOverallStr: string;
  manOfTheMatch: string;
  redCards: string;
  prevGoals: string;
  prevGoals1: string;
  prevGoals2: string;
  prevGoals3: string;
  prevGoals4: string;
  prevGoals5: string;
  prevGoals6: string;
  prevGoals7: string;
  prevGoals8: string;
  prevGoals9: string;
  prevGoals10: string;
  favoritePosition: string;
}

interface PositionCount {
  midfielder: number;
  goalkeeper: number;
  forward: number;
  defender: number;
}

interface TeamData {
  members: PlayerStats[];
  positionCount: PositionCount;
}

interface ComparisonDataPoint {
  name: string;
  value: number;
  position: string;
}

interface GoalHistoryDataPoint {
  match: string;
  goals: number;
}

interface StatOption {
  value: string;
  label: string;
}

// Mock data for when the API is unavailable
const getMockData = (): TeamData => {
  return {
    "members": [
      {
        "name": "Slaughtey",
        "gamesPlayed": "101",
        "winRate": "43",
        "goals": "20",
        "assists": "7",
        "cleanSheetsDef": "0",
        "cleanSheetsGK": "0",
        "shotSuccessRate": "14",
        "passesMade": "827",
        "passSuccessRate": "76",
        "ratingAve": "6.8",
        "tacklesMade": "65",
        "tackleSuccessRate": "12",
        "proName": "Randy Savage",
        "proPos": "10",
        "proStyle": "-1",
        "proHeight": "182",
        "proNationality": "14",
        "proOverall": "88",
        "proOverallStr": "88",
        "manOfTheMatch": "0",
        "redCards": "5",
        "prevGoals": "0",
        "prevGoals1": "0",
        "prevGoals2": "1",
        "prevGoals3": "0",
        "prevGoals4": "1",
        "prevGoals5": "0",
        "prevGoals6": "1",
        "prevGoals7": "2",
        "prevGoals8": "0",
        "prevGoals9": "1",
        "prevGoals10": "0",
        "favoritePosition": "forward"
      },
      {
        "name": "Striker99",
        "gamesPlayed": "95",
        "winRate": "52",
        "goals": "32",
        "assists": "12",
        "cleanSheetsDef": "0",
        "cleanSheetsGK": "0",
        "shotSuccessRate": "22",
        "passesMade": "654",
        "passSuccessRate": "68",
        "ratingAve": "7.4",
        "tacklesMade": "28",
        "tackleSuccessRate": "8",
        "proName": "Carlos Figueroa",
        "proPos": "9",
        "proStyle": "2",
        "proHeight": "178",
        "proNationality": "7",
        "proOverall": "92",
        "proOverallStr": "92",
        "manOfTheMatch": "6",
        "redCards": "2",
        "prevGoals": "2",
        "prevGoals1": "3",
        "prevGoals2": "2",
        "prevGoals3": "4",
        "prevGoals4": "3",
        "prevGoals5": "1",
        "prevGoals6": "2",
        "prevGoals7": "5",
        "prevGoals8": "2",
        "prevGoals9": "4",
        "prevGoals10": "4",
        "favoritePosition": "forward"
      }
    ],
    "positionCount": {
      "midfielder": 2,
      "goalkeeper": 1,
      "forward": 2,
      "defender": 1
    }
  };
};

const PlayerStatsDashboard: React.FC = () => {
  const [data, setData] = useState<TeamData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerStats | null>(null);
  const [comparisonStat, setComparisonStat] = useState<string>('winRate');

  useEffect(() => {
    console.log("Component mounted, fetching data");

    const loadData = async (): Promise<void> => {
      try {
        setLoading(true);

        // Use the internal API route instead of the external Cloudflare Worker
        const apiUrl = `/api/proclubs?platform=common-gen5&clubId=${CLUB_ID}`;
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

        const responseData = await response.json() as { members: PlayerStats[] };


        // Process position counts
        const positions: PositionCount = {
          midfielder: 0,
          goalkeeper: 0,
          forward: 0,
          defender: 0
        };

        // Add favorite position to each member and count positions
        responseData.members.forEach((member: PlayerStats) => {
          // Determine favorite position based on proPos
          let favoritePosition = "midfielder"; // default
          const posValue = parseInt(member.proPos);

          if (posValue === 0) {
            favoritePosition = "goalkeeper";
            positions.goalkeeper++;
          } else if (posValue >= 1 && posValue <= 5) {
            favoritePosition = "defender";
            positions.defender++;
          } else if (posValue >= 6 && posValue <= 8) {
            favoritePosition = "midfielder";
            positions.midfielder++;
          } else if (posValue >= 9 && posValue <= 11) {
            favoritePosition = "forward";
            positions.forward++;
          } else {
            // If unknown, default to midfielder
            positions.midfielder++;
          }

          member.favoritePosition = favoritePosition;
        });

        // Add position count to data
        const processedData: TeamData = {
          members: responseData.members,
          positionCount: positions
        };

        setData(processedData);
        if (processedData.members && processedData.members.length > 0) {
          setSelectedPlayer(processedData.members[0]);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setError(`Failed to load player data: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setLoading(false);

        // Fall back to mock data for development/testing
        console.log("Falling back to mock data");
        const mockData = getMockData(); // Use the renamed function
        setData(mockData);
        setSelectedPlayer(mockData.members[0]);
      }
    };

    loadData();
  }, []);

  const getComparisonData = (): ComparisonDataPoint[] => {
    if (!data) return [];

    return data.members.map(player => ({
      name: player.name,
      value: parseInt(player[comparisonStat as keyof PlayerStats] as string) || 0,
      position: player.favoritePosition
    })).sort((a, b) => b.value - a.value);
  };

  const getRecentGoalsData = (): GoalHistoryDataPoint[] => {
    if (!selectedPlayer) return [];

    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
      const key = `prevGoals${i}` as keyof PlayerStats;
      return {
        match: `Match ${i}`,
        goals: parseInt(selectedPlayer[key] as string) || 0
      };
    }).reverse();
  };

  const positionColors: Record<string, string> = {
    forward: "#1e40af",
    midfielder: "#2563eb",
    defender: "#60a5fa",
    goalkeeper: "#bfdbfe"
  };

  const statOptions: StatOption[] = [
    { value: "winRate", label: "Win Rate (%)" },
    { value: "goals", label: "Goals" },
    { value: "assists", label: "Assists" },
    { value: "shotSuccessRate", label: "Shot Success Rate (%)" },
    { value: "passSuccessRate", label: "Pass Success Rate (%)" },
    { value: "ratingAve", label: "Average Rating" },
    { value: "tackleSuccessRate", label: "Tackle Success Rate (%)" },
    { value: "proOverall", label: "Overall Rating" },
    { value: "manOfTheMatch", label: "Man of the Match" },
    { value: "redCards", label: "Red Cards" }
  ];

  if (loading) return (
    <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      <span className="ml-3">Loading stats...</span>
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

  const chartConfig = {
    value: {
      label: "Value",
      color: "oklch(0.55 0.22 263)",
    }
  } satisfies ChartConfig

  const chartConfigGoals = {
    goals: {
      label: "Goals",
      color: "oklch(0.55 0.22 263)",
    }
  } satisfies ChartConfig


  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Pro Players Statistics Dashboard</h1>

      {error && (
        <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
          <p className="text-yellow-700">
            <span className="font-bold">Note:</span> {error} Using fallback data for demonstration.
          </p>
          <p className="text-yellow-700 mt-2">
            Trying to connect to: /api/proclubs?platform=common-gen5&clubId={CLUB_ID}
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="col-span-1 md:col-span-3">
          <CardHeader>
            <CardTitle>Players Comparison</CardTitle>
            <CardDescription>Compare players across different statistics</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-8">
              <label className="block mb-2 font-medium">Select Stat to Compare:</label>
              <Select
                value={comparisonStat}
                onValueChange={(value) => setComparisonStat(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select a stat to compare" />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectLabel>Statistics</SelectLabel>
                    {statOptions.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                </SelectContent>
              </Select>
            </div>

            <ChartContainer config={chartConfig}>
              <BarChart
                accessibilityLayer
                data={getComparisonData()}
                layout="vertical"
                margin={{
                  left: 60,
                  right: 30
                }}
              >
                <XAxis
                  type="number"
                  dataKey="value"
                  domain={[0, 'dataMax']}
                  tickCount={5}
                  interval={0}
                  hide
                />
                <YAxis
                  dataKey="name"
                  type="category"
                  tickLine={false}
                  tickMargin={10}
                  axisLine={false}
                  interval={0}
                  includeHidden
                />
                <Bar
                  dataKey="value"
                  fill="oklch(0.55 0.22 263)"
                  radius={4}
                >
                  <LabelList
                    dataKey="value"
                    position="right"
                    offset={8}
                    className="fill-foreground"
                    fontSize={12}
                    formatter={(value: number) => value > 0 ? value : ''}
                  />
                </Bar>
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Position Distribution</CardTitle>
            <CardDescription>Player positions in team</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 p-6">
              {Object.entries(data.positionCount).map(([position, count]) => (
                <div key={position} className="flex items-center">
                  <div
                    className="w-4 h-4 rounded-full mr-2"
                    style={{ backgroundColor: positionColors[position] }}
                  ></div>
                  <span className="capitalize">{position}:</span>
                  <span className="ml-auto font-bold">{count}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mb-8">
        <label className="block mb-2 font-medium">Select Player:</label>
        <Select
          value={selectedPlayer?.name}
          onValueChange={(value) => {
            const player = data.members.find(p => p.name === value);
            if (player) setSelectedPlayer(player);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a player" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Players</SelectLabel>
              {data.members.map(player => (
                <SelectItem key={player.name} value={player.name}>
                  {player.name} ({player.proName || 'Unknown'}) - {player.favoritePosition}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      {selectedPlayer && (
        <Tabs defaultValue="profile" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="profile">Player Profile</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Player Profile</CardTitle>
                <CardDescription>{selectedPlayer.name} ({selectedPlayer.proName || 'Unknown'})</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Position:</span>
                      <span className="capitalize">{selectedPlayer.favoritePosition}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Height:</span>
                      <span>{selectedPlayer.proHeight || 'N/A'} cm</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Nationality:</span>
                      <span>ID: {selectedPlayer.proNationality || 'N/A'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Overall Rating:</span>
                      <span className="font-bold">{selectedPlayer.proOverall || 'N/A'}/100</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Style:</span>
                      <span>ID: {selectedPlayer.proStyle || 'N/A'}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Games Played:</span>
                      <span>{selectedPlayer.gamesPlayed || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Win Rate:</span>
                      <span>{selectedPlayer.winRate || '0'}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Man of the Match:</span>
                      <span>{selectedPlayer.manOfTheMatch || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Red Cards:</span>
                      <span>{selectedPlayer.redCards || '0'}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Average Rating:</span>
                      <span>{selectedPlayer.ratingAve || 'N/A'}/10</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Performance Statistics</CardTitle>
                <CardDescription>Detailed stats for {selectedPlayer.name}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2 text-green-800">Offensive Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Goals:</span>
                        <span className="font-bold">{selectedPlayer.goals || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Assists:</span>
                        <span className="font-bold">{selectedPlayer.assists || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Shot Success:</span>
                        <span className="font-bold">{selectedPlayer.shotSuccessRate || '0'}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2 text-blue-800">Passing Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Passes Made:</span>
                        <span className="font-bold">{selectedPlayer.passesMade || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Pass Success:</span>
                        <span className="font-bold">{selectedPlayer.passSuccessRate || '0'}%</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg">
                    <h3 className="text-lg font-bold mb-2 text-red-800">Defensive Stats</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span>Tackles Made:</span>
                        <span className="font-bold">{selectedPlayer.tacklesMade || '0'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Tackle Success:</span>
                        <span className="font-bold">{selectedPlayer.tackleSuccessRate || '0'}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Clean Sheets:</span>
                        <span className="font-bold">
                          {selectedPlayer.favoritePosition === 'goalkeeper'
                            ? (selectedPlayer.cleanSheetsGK || '0')
                            : (selectedPlayer.cleanSheetsDef || '0')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Recent Goal History</CardTitle>
                <CardDescription>Last 10 matches goal performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ChartContainer config={chartConfigGoals}>
                  <BarChart
                    accessibilityLayer
                    data={getRecentGoalsData()}
                    layout="vertical"
                    margin={{
                      left: 20,
                      right: 50
                    }}
                  >
                    <XAxis
                      interval={0}
                      hide
                    />
                    <YAxis
                      dataKey="match"
                      type="category"
                      tickLine={false}
                      tickMargin={10}
                      interval={0}
                      axisLine={false}
                    />
                    <Bar
                      dataKey="goals"
                      fill="oklch(0.55 0.22 263)"
                      radius={4}
                    >
                      <LabelList
                        dataKey="goals"
                        position="right"
                        offset={8}
                        className="fill-foreground"
                        fontSize={12}
                        formatter={(value: number) => value > 0 ? value : ''}
                      />
                    </Bar>
                  </BarChart>
                </ChartContainer>
                <div className="mt-4">
                  <p className="font-medium">Total goals in last 10 matches: {
                    [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((sum, i) => {
                      const key = `prevGoals${i}` as keyof PlayerStats;
                      return sum + (parseInt(selectedPlayer[key] as string) || 0);
                    }, 0)
                  }</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PlayerStatsDashboard;
