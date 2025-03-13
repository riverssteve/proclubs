'use client';

import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { StatCard } from '@/components/molecules/StatCard';
import { StatValue } from '@/components/atoms/StatValue';
import { ChartBar } from '@/components/organisms/charts';

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
      value: parseFloat(player[comparisonStat as keyof PlayerStats] as string) || 0,
      position: player.favoritePosition
    })).sort((a, b) => b.value - a.value);
  };

  const getRecentGoalsData = (): GoalHistoryDataPoint[] => {
    if (!selectedPlayer) return [];

    return [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => {
      const key = `prevGoals${i}` as keyof PlayerStats;
      return {
        match: `Match ${i}`,
        goals: parseFloat(selectedPlayer[key] as string) || 0
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
      color: "var(--chart-1)",
    }
  };

  const chartConfigGoals = {
    goals: {
      label: "Goals",
      color: "var(--chart-1)"
    }
  };

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
        <StatCard 
          title="Players Comparison" 
          description="Compare players across different statistics"
          className="col-span-1 md:col-span-3"
        >
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

          <ChartBar 
            data={getComparisonData()} 
            layout="vertical" 
            margin={{ left: 60, right: 30 }}
            chartConfig={chartConfig}
          />
        </StatCard>

        <StatCard title="Position Distribution" description="Player positions in team">
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
        </StatCard>
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
        <Tabs defaultValue="profile" className="w-full ">
          <div className="flex justify-center">
            <TabsList className="grid grid-cols-3 mb-6 md:w-150 centre">
              <TabsTrigger value="profile">Player Profile</TabsTrigger>
              <TabsTrigger value="stats">Stats</TabsTrigger>
              <TabsTrigger value="history">History</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="profile" className="space-y-4">
            <StatCard 
              title="Player Profile" 
              description={`${selectedPlayer.name} (${selectedPlayer.proName || 'Unknown'})`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <StatRow label="Position" value={selectedPlayer.favoritePosition} capitalize/>
                  <StatRow label="Height" value={`${selectedPlayer.proHeight || 'N/A'} cm`} />
                  <StatRow label="Nationality" value={`ID: ${selectedPlayer.proNationality || 'N/A'}`} />
                  <StatRow label="Overall Rating" value={`${selectedPlayer.proOverall || 'N/A'}/100`} emphasis />
                  <StatRow label="Style" value={`ID: ${selectedPlayer.proStyle || 'N/A'}`} />
                </div>

                <div className="space-y-2">
                  <StatRow label="Games Played" value={selectedPlayer.gamesPlayed || '0'} />
                  <StatRow label="Win Rate" value={`${selectedPlayer.winRate || '0'}%`} />
                  <StatRow label="Man of the Match" value={selectedPlayer.manOfTheMatch || '0'} />
                  <StatRow label="Red Cards" value={selectedPlayer.redCards || '0'} />
                  <StatRow label="Average Rating" value={`${selectedPlayer.ratingAve || 'N/A'}/10`} emphasis />
                </div>
              </div>
            </StatCard>
          </TabsContent>

          <TabsContent value="stats" className="space-y-4">
            <StatCard 
              title="Performance Statistics" 
              description={`Detailed stats for ${selectedPlayer.name}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-green-800 dark:text-green-200">Offensive Stats</h3>
                  <div className="space-y-2">
                    <StatRow label="Goals" value={selectedPlayer.goals || '0'} emphasis />
                    <StatRow label="Assists" value={selectedPlayer.assists || '0'} emphasis />
                    <StatRow label="Shot Success" value={`${selectedPlayer.shotSuccessRate || '0'}%`} emphasis />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-blue-800 dark:text-blue-200">Passing Stats</h3>
                  <div className="space-y-2">
                    <StatRow label="Passes Made" value={selectedPlayer.passesMade || '0'} emphasis />
                    <StatRow label="Pass Success" value={`${selectedPlayer.passSuccessRate || '0'}%`} emphasis />
                  </div>
                </div>

                <div className="bg-red-50 dark:bg-red-950 p-4 rounded-lg">
                  <h3 className="text-lg font-bold mb-2 text-red-800 dark:text-red-200">Defensive Stats</h3>
                  <div className="space-y-2">
                    <StatRow label="Tackles Made" value={selectedPlayer.tacklesMade || '0'} emphasis />
                    <StatRow label="Tackle Success" value={`${selectedPlayer.tackleSuccessRate || '0'}%`} emphasis />
                    <StatRow 
                      label="Clean Sheets" 
                      value={selectedPlayer.favoritePosition === 'goalkeeper'
                        ? (selectedPlayer.cleanSheetsGK || '0')
                        : (selectedPlayer.cleanSheetsDef || '0')} 
                      emphasis
                    />
                  </div>
                </div>
              </div>
            </StatCard>
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <StatCard 
              title="Recent Goal History" 
              description="Last 10 matches goal performance"
            >
              <ChartBar 
                data={getRecentGoalsData()} 
                dataKey="goals"
                layout="vertical" 
                margin={{ left: 20, right: 20 }}
                chartConfig={chartConfigGoals}
              />
              
              <div className="mt-4">
                <p className="font-medium">Total goals in last 10 matches: {
                  [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].reduce((sum, i) => {
                    const key = `prevGoals${i}` as keyof PlayerStats;
                    const value = parseFloat(selectedPlayer[key] as string) || 0;
                    return sum + value;
                  }, 0).toFixed(1).replace(/\.0$/, '')
                }</p>
              </div>
            </StatCard>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default PlayerStatsDashboard;
