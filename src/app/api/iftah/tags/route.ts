import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://website.anwarululoom.com/api';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/darul-ifta/tags${queryString ? `?${queryString}` : ''}`;


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
    console.log('✅ Iftah tags data received from API:', data);
    
    // Handle different response formats
    // API returns: {total: number, tags: [{id, name, ...}]}
    let tagsArray: any[] = [];
    
    if (Array.isArray(data)) {
      tagsArray = data;
    } else if (data && typeof data === 'object') {
      // Check for tags property (API format: {total: 1, tags: [...]})
      if (Array.isArray(data.tags)) {
        tagsArray = data.tags;
        console.log('📊 Found tags in data.tags:', tagsArray.length);
      } else if (Array.isArray(data.data)) {
        tagsArray = data.data;
        console.log('📊 Found tags in data.data:', tagsArray.length);
      } else if (Array.isArray(data)) {
        tagsArray = data;
        console.log('📊 Data is direct array:', tagsArray.length);
      }
    }
    
    console.log('📊 Final tags array to return:', tagsArray.length);
    
    return NextResponse.json({ 
      data: tagsArray, 
      success: true,
      total: data?.total || tagsArray.length
    }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Error fetching iftah tags:', error);
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

