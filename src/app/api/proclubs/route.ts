// src/app/api/proclubs/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Add this line to specify Edge Runtime
export const runtime = 'edge';

// Define the base URL for the EA Sports FC API
const API_BASE_URL = 'https://proclubs.ea.com/api/fc/members';

export async function GET(request: NextRequest) {
  try {
    // Get query parameters
    const searchParams = request.nextUrl.searchParams;
    const platform = searchParams.get('platform') || 'common-gen5';
    const clubId = searchParams.get('clubId');

    // Validate required parameters
    if (!clubId) {
      return NextResponse.json(
        { error: 'Missing required parameter: clubId' },
        { status: 400 }
      );
    }

    const path = `${API_BASE_URL}/stats?platform=${platform}&clubId=${clubId}`;

    const headers = {
      'Accept': 'application/json',
    };

    const response = await fetch(path, { headers });

    if (!response.ok) {
      throw new Error(`EA API returned ${response.status}: ${response.statusText}`);
    }

    const data = await response.json();
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching club data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch club data', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}
