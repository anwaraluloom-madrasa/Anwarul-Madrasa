import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/api'
  : 'https://website.anwarululoom.com/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/book/categories${queryString ? `?${queryString}` : ''}`;

    console.log('🔄 Fetching book categories from:', apiUrl);

    const response = await fetch(apiUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.warn(`⚠️ External API responded with status: ${response.status}`);
      return NextResponse.json(
        { 
          data: [],
          success: false,
          error: `API responded with status: ${response.status}`
        },
        { 
          status: 200,
          headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Authorization',
          },
        }
      );
    }

    const data = await response.json();
    console.log('✅ Book categories data received from API:', data);
    
    // Handle different response formats
    let categoriesData: any[] = [];
    
    if (data && typeof data === 'object') {
      if (Array.isArray(data)) {
        categoriesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        categoriesData = data.data;
      } else if (data.categories && Array.isArray(data.categories)) {
        categoriesData = data.categories;
      }
    }

    return NextResponse.json(
      { 
        data: categoriesData,
        success: true
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
    );
  } catch (error) {
    console.error('❌ Book Categories API Error:', error);
    
    return NextResponse.json(
      { 
        data: [],
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { 
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      }
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
