import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

// Define the base URL for the EA Sports FC API
const API_BASE_URL = 'https://proclubs.ea.com/api/fc/clubs';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform');
    const clubId = searchParams.get('clubId');

    // Validate required parameters
    if (!platform || !clubId) {
      return NextResponse.json(
        { error: 'Missing required parameters: platform and clubId are required' },
        { status: 400 }
      );
    }

    const path = `${API_BASE_URL}/overallStats?platform=${platform}&clubIds=${clubId}`
    const response = await fetch(path);

    if (!response.ok) {
      throw new Error(`EA API responded with status: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error fetching club data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch club data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

