import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://website.anwarululoom.com/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/blogs${queryString ? `?${queryString}` : ''}`;

    console.log('=== BLOG API CALL ===');
    console.log('API URL:', apiUrl);
    console.log('Query params:', Object.fromEntries(searchParams.entries()));

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      // Use Next.js fetch caching
      next: { revalidate: 60 }, // Revalidate every 60 seconds
    });

    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }

    const data = await response.json();
    
    console.log('API Response:', JSON.stringify(data, null, 2));
    console.log('=== END BLOG API CALL ===');
    
    return NextResponse.json(data, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        // Add caching headers for better performance
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=300',
      },
    });
  } catch (error) {
    console.error('Blog API Proxy Error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch blogs',
        message: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
