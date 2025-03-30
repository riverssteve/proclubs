import { NextRequest, NextResponse } from "next/server";
import {
  Club,
  ClubDetails,
  Match,
  MatchResult,
  MatchPlayer,
  AggregateStats,
  TimeAgo,
} from "@/types/match";

export const runtime = "edge";

// Define the base URL for the EA Sports FC API
const API_BASE_URL = "https://proclubs.ea.com/api/fc/clubs";

interface RawClubData {
  date: string;
  gameNumber: string;
  goals: string;
  goalsAgainst: string;
  score: string;
  matchType: string;
  ties: string;
  wins: string;
  losses: string;
  details: ClubDetails;
  winnerByDnf: string | boolean; // Could be either based on your types
}

interface RawMatchData {
  matchId: string;
  timestamp: number;
  timeAgo: TimeAgo;
  clubs: Record<string, RawClubData>;
  players: {
    [key: string]: {
      [key: string]: MatchPlayer;
    };
  };
  aggregate?: {
    [key: string]: AggregateStats;
  };
}

interface ErrorResponse {
  error: string;
  details?: string;
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<Match[] | ErrorResponse>> {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get("platform");
    const clubId = searchParams.get("clubId");
    const matchType = searchParams.get("matchType");
    const maxResultCount = searchParams.get("maxResultCount");

    // Validate required parameters
    if (!platform || !clubId) {
      return NextResponse.json(
        {
          error:
            "Missing required parameters: platform and clubId are required",
        },
        { status: 400 },
      );
    }

    // Build API URL
    const path = `${API_BASE_URL}/matches?platform=${platform}&clubIds=${clubId}${
      matchType ? `&matchType=${matchType}` : ""
    }${maxResultCount ? `&maxResultCount=${maxResultCount}` : ""}`;

    console.log(`Fetching club data from: ${path}`);

    const headers = {
      Accept: "application/json",
    };

    // Fetch data from EA API
    const response = await fetch(path, { headers });

    if (!response.ok) {
      throw new Error(
        `EA API returned ${response.status}: ${response.statusText}`,
      );
    }

    const rawData: RawMatchData[] = await response.json();

    // Map the raw data to the Match type, picking only the fields we want
    const data: Match[] = rawData.map((match: RawMatchData) => {
      // Create a properly typed clubs object
      const clubs: Record<string, Club> = {};

      // Process each club entry properly - keep strings as strings according to your Club interface
      Object.entries(match.clubs).forEach(([clubId, clubData]) => {
        clubs[clubId] = {
          date: clubData.date,
          gameNumber: clubData.gameNumber,
          goals: clubData.goals,
          goalsAgainst: clubData.goalsAgainst,
          score: clubData.score,
          matchType: clubData.matchType,
          ties: clubData.ties,
          wins: clubData.wins,
          losses: clubData.losses,
          details: clubData.details,
          winnerByDnf:
            typeof clubData.winnerByDnf === "boolean"
              ? String(clubData.winnerByDnf)
              : clubData.winnerByDnf,
          result:
            parseInt(clubData.wins) > parseInt(clubData.losses)
              ? MatchResult.win
              : parseInt(clubData.wins) < parseInt(clubData.losses)
                ? MatchResult.loss
                : MatchResult.draw,
        };
      });

      // Return the properly structured match object
      return {
        matchId: match.matchId,
        timestamp: match.timestamp,
        timeAgo: match.timeAgo,
        clubs,
        players: match.players,
        aggregate: match.aggregate,
      };
    });

    return NextResponse.json(data, {
      headers: {
        "Cache-Control": "max-age=300", // Cache for 5 minutes
      },
    });
  } catch (error) {
    console.error("Error fetching club data:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch club data",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}
