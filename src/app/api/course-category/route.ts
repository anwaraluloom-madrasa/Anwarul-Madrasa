import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000/api'
  : 'https://website.anwarululoom.com/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/course-category${queryString ? `?${queryString}` : ''}`;

    console.log('🔄 Fetching course categories from:', apiUrl);

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
          data: { total: 0, categories: [] },
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
    console.log('✅ Course categories data received from API:', data);
    
    // Handle different response formats
    interface CategoryData {
      total: number;
      categories: Array<{
        id: number;
        name: string;
        slug: string;
        created_at: string;
        updated_at: string;
        courses_count: number;
      }>;
    }
    let categoriesData: CategoryData = { total: 0, categories: [] };
    
    if (data && typeof data === 'object') {
      if (data.categories && Array.isArray(data.categories)) {
        categoriesData = {
          total: data.total || data.categories.length,
          categories: data.categories
        };
      } else if (Array.isArray(data.data)) {
        categoriesData = {
          total: data.total || data.data.length,
          categories: data.data
        };
      } else if (Array.isArray(data)) {
        categoriesData = {
          total: data.length,
          categories: data
        };
      }
    }
    
    console.log('📊 Final categories data to return:', categoriesData);
    
    return NextResponse.json({ 
      data: categoriesData, 
      success: true,
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Error fetching course categories:', error);
    return NextResponse.json(
      { 
        data: { total: 0, categories: [] },
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
