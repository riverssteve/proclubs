// Types
export interface PlayerStats {
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
  favoritePosition: string;
}

export interface PositionCount {
  midfielder: number;
  goalkeeper: number;
  forward: number;
  defender: number;
}

export interface TeamData {
  members: PlayerStats[];
  positionCount: PositionCount;
}

export interface StatOption {
  value: string;
  label: string;
  isPer90Compatible: boolean;
}

// Constants
export const CLUB_ID = 287755;

// Default stat options
export const DEFAULT_STAT_OPTIONS: StatOption[] = [
  { value: "winRate", label: "Win Rate (%)", isPer90Compatible: false },
  { value: "goals", label: "Goals", isPer90Compatible: true },
  { value: "assists", label: "Assists", isPer90Compatible: true },
  {
    value: "shotSuccessRate",
    label: "Shot Success Rate (%)",
    isPer90Compatible: false,
  },
  {
    value: "passSuccessRate",
    label: "Pass Success Rate (%)",
    isPer90Compatible: false,
  },
  { value: "ratingAve", label: "Average Rating", isPer90Compatible: false },
  {
    value: "tackleSuccessRate",
    label: "Tackle Success Rate (%)",
    isPer90Compatible: false,
  },
  { value: "proOverall", label: "Overall Rating", isPer90Compatible: false },
  {
    value: "manOfTheMatch",
    label: "Man of the Match",
    isPer90Compatible: true,
  },
  { value: "redCards", label: "Red Cards", isPer90Compatible: true },
  { value: "passesMade", label: "Passes Made", isPer90Compatible: true },
  { value: "tacklesMade", label: "Tackles Made", isPer90Compatible: true },
];

// No mock data - we'll handle API failures with error messages

// Calculate per-90 value for a stat
export const calculatePer90Value = (
  statValue: string | number,
  gamesPlayed: string | number,
): number => {
  const value =
    typeof statValue === "string" ? parseFloat(statValue) : statValue;
  const games =
    typeof gamesPlayed === "string" ? parseFloat(gamesPlayed) : gamesPlayed;

  if (isNaN(value) || isNaN(games) || games === 0) return 0;

  // Assuming each game is 90 minutes
  const totalMinutesPlayed = games * 90;

  // Calculate value per minute, then multiply by 90 to get per-90 rate
  return (value / totalMinutesPlayed) * 90;
};

// Helper function to determine player's position based on proPos value
export const determinePlayerPosition = (posValue: number): string => {
  if (posValue === 0) {
    return "goalkeeper";
  } else if (posValue >= 1 && posValue <= 5) {
    return "defender";
  } else if (posValue >= 6 && posValue <= 8) {
    return "midfielder";
  } else if (posValue >= 9 && posValue <= 11) {
    return "forward";
  }
  // Default to midfielder if unknown
  return "midfielder";
};

// Process API response to calculate position counts
export const processTeamData = (apiData: {
  members: PlayerStats[];
}): TeamData => {
  const positions: PositionCount = {
    midfielder: 0,
    goalkeeper: 0,
    forward: 0,
    defender: 0,
  };

  // Add favorite position to each member and count positions
  apiData.members.forEach((member: PlayerStats) => {
    const favoritePosition = determinePlayerPosition(parseInt(member.proPos));
    member.favoritePosition = favoritePosition;

    // Increment position count
    positions[favoritePosition as keyof PositionCount]++;
  });

  return {
    members: apiData.members,
    positionCount: positions,
  };
};
