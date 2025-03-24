export interface AggregateStats {
  assists: number;
  cleansheetsany: number;
  cleansheetsdef: number;
  cleansheetsgk: number;
  goals: number;
  goalsconceded: number;
  losses: number;
  mom: number;
  namespace: number;
  passattempts: number;
  passesmade: number;
  pos: number;
  rating: number;
  realtimegame: number;
  realtimeidle: number;
  redcards: number;
  saves: number;
  SCORE: number;
  shots: number;
  tackleattempts: number;
  tacklesmade: number;
  vproattr: number;
  vprohackreason: number;
  wins: number;
}

export interface MatchPlayer {
  assists: string;
  goals: string;
  mom: string;
  playername: string;
  pos: string;
  rating: string;
  shots: string;
  passattempts?: string;
  passesmade?: string;
  tackleattempts?: string;
  tacklesmade?: string;
  realtimegame?: string;
  realtimeidle?: string;
  redcards?: string;
}

export interface CustomKit {
  stadName?: string;
  kitId?: string;
  seasonalTeamId?: string;
  seasonalKitId?: string;
  selectedKitType?: string;
  customKitId?: string;
  customAwayKitId?: string;
  customThirdKitId?: string;
  customKeeperKitId?: string;
  kitColor1?: string;
  kitColor2?: string;
  kitColor3?: string;
  kitColor4?: string;
  kitAColor1?: string;
  kitAColor2?: string;
  kitAColor3?: string;
  kitAColor4?: string;
  kitThrdColor1?: string;
  kitThrdColor2?: string;
  kitThrdColor3?: string;
  kitThrdColor4?: string;
  dCustomKit?: string;
  crestColor?: string;
  crestAssetId?: string;

  // For any other string properties we might not have explicitly listed
  [key: string]: string | undefined;
}

export interface ClubDetails {
  name: string;
  clubId: number;
  regionId?: number;
  teamId?: number;
  customKit?: CustomKit;
}

export interface Club {
  date: string;
  gameNumber: string;
  goals: string;
  goalsAgainst: string;
  result: string;
  score: string;
  matchType?: string;
  ties?: string;
  wins?: string;
  losses?: string;
  details: ClubDetails;
  winnerByDnf?: string;
}

export interface TimeAgo {
  number: number;
  unit: string;
}

export interface Match {
  matchId: string;
  timestamp: number;
  timeAgo?: TimeAgo;
  clubs: {
    [key: string]: Club;
  };
  players: {
    [key: string]: {
      [key: string]: MatchPlayer;
    };
  };
  aggregate?: {
    [key: string]: AggregateStats;
  };
}

export interface TopPerformer {
  name: string;
  rating: string;
  goals: string;
  assists: string;
}
