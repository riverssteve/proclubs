// src/app/api/proclubs/route.ts
import { NextRequest, NextResponse } from 'next/server';

// Add this line to specify Edge Runtime
export const runtime = 'edge';

/**
 * API route that proxies requests to the EA Pro Clubs API
 * This acts as a CORS proxy and allows our frontend to access the EA API
 */
export async function GET(request: NextRequest) {
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

  try {
    // Build the EA API URL
    const eaApiUrl = `https://proclubs.ea.com/api/fc/members/stats?platform=${platform}&clubId=${clubId}`;

    // Set up headers for the request to EA
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'application/json',
      'Origin': 'https://www.ea.com'
    };

    // Make the request to EA API
    const eaResponse = await fetch(eaApiUrl, {
      headers,
      cache: 'no-store' // Disable caching for this request
    });

    // If the response is not ok, throw an error
    if (!eaResponse.ok) {
      throw new Error(`EA API returned ${eaResponse.status}: ${eaResponse.statusText}`);
    }

    // Get the response data
    const data = await eaResponse.json();

    // Return the data with appropriate headers
    return NextResponse.json(data, {
      headers: {
        'Cache-Control': 'max-age=300', // Cache for 5 minutes
      }
    });
  } catch (error) {
    console.error('Error fetching data from EA API:', error);

    // Return an error response
    return NextResponse.json(
      { error: `Error fetching data from EA: ${error instanceof Error ? error.message : 'Unknown error'}` },
      { status: 500 }
    );
  }
}
