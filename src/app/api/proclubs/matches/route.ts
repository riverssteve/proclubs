import { NextRequest, NextResponse } from "next/server";
import { Match, MatchResult } from "@/types/match";

export const runtime = "edge";

// Define the base URL for the EA Sports FC API
const API_BASE_URL = "https://proclubs.ea.com/api/fc/clubs";

export async function GET(request: NextRequest) {
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

    // /matches?platform=common-gen5&clubIds=287755&matchType=leagueMatch&maxResultCount=1
    const path = `${API_BASE_URL}/matches?platform=${platform}&clubIds=${clubId}&matchType=${matchType}&maxResultCount=${maxResultCount}`;

    console.log(`Fetching club data from: ${path}`);

    const headers = {
      Accept: "application/json",
    };

    // Club type has a subset of keys that are returned here so we should probably filter out and convert
    // to the known type here
    // FIXME: build currently fails with: "Object literal may only specify known properties"

    const response = await fetch(path, { headers });

    if (!response.ok) {
      throw new Error(
        `EA API returned ${response.status}: ${response.statusText}`,
      );
    }

    const rawData: any[] = await response.json();

    // Map the raw data to the Match type, picking only the fields we want
    const data: Match[] = rawData.map((match: any) => ({
      matchId: match.matchId,
      timestamp: match.timestamp,
      timeAgo: match.timeAgo,
      clubs: Object.entries(match.clubs).reduce((acc: any, [clubId, clubData]: [string, any]) => {
      acc[clubId] = {
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
        winnerByDnf: clubData.winnerByDnf,
        result: clubData.wins > clubData.losses
          ? MatchResult.win
          : clubData.wins < clubData.losses
          ? MatchResult.loss
          : MatchResult.draw,
      };
      return acc;
      }, {}),
      players: match.players,
      aggregate: match.aggregate,
    }));

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
