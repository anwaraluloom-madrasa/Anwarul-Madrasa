import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://website.anwarululoom.com/api';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subCategoryId: string }> }
) {
  const { subCategoryId } = await params;
  try {
    const { searchParams } = new URL(request.url);
    const queryString = searchParams.toString();
    const apiUrl = `${API_BASE_URL}/darul-ifta/sub-category/${subCategoryId}${queryString ? `?${queryString}` : ''}`;

    let response: Response;
    try {
      response = await fetch(apiUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        cache: 'no-store'
      });
    } catch (fetchError) {
      console.error('❌ Network error fetching subcategory:', fetchError);
      return NextResponse.json(
        { 
          data: { sub_category_id: subCategoryId, total: 0, data: [] },
          success: false,
          error: `Network error: ${fetchError instanceof Error ? fetchError.message : 'Unknown network error'}`
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

    if (!response.ok) {
      const errorText = await response.text().catch(() => 'Unknown error');
      console.warn(`⚠️ External API responded with status: ${response.status}`, errorText);
      return NextResponse.json(
        { 
          data: { sub_category_id: subCategoryId, total: 0, data: [] },
          success: false,
          error: `API responded with status: ${response.status} - ${errorText}`
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

    let data: any;
    try {
      const responseText = await response.text();
      if (!responseText || responseText.trim() === '') {
        console.warn('⚠️ Empty response from API');
        return NextResponse.json(
          { 
            data: { sub_category_id: subCategoryId, total: 0, data: [] },
            success: false,
            error: 'Empty response from API'
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
      data = JSON.parse(responseText);
      console.log('✅ Iftah subcategory data received from API:', data);
    } catch (parseError) {
      console.error('❌ Error parsing JSON response:', parseError);
      return NextResponse.json(
        { 
          data: { sub_category_id: subCategoryId, total: 0, data: [] },
          success: false,
          error: `Failed to parse API response: ${parseError instanceof Error ? parseError.message : 'Unknown parsing error'}`
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
    
    // Handle the API response structure: { sub_category_id: "1", total: 2, data: [...] }
    if (data && typeof data === 'object') {
      // The API returns: { sub_category_id: "1", total: 2, data: [...] }
      return NextResponse.json({ 
        data: data, // Return full structure including sub_category_id, total, and data array
        success: true,
        sub_category_id: data.sub_category_id,
        total: data.total
      }, {
        status: 200,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        },
      });
    }

    return NextResponse.json({ data: data || { sub_category_id: subCategoryId, total: 0, data: [] }, success: true }, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ Error fetching iftah subcategory:', error);
    return NextResponse.json(
      { 
        data: { sub_category_id: subCategoryId, total: 0, data: [] },
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

