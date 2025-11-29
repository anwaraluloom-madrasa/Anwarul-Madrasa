import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    

    return NextResponse.json({
      success: true,
      message: 'Admission form submitted successfully',
      data: {
        id: Date.now(),
        ...body,
        created_at: new Date().toISOString()
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Admission API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to submit admission form',
      error: error.message
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Simulate fetching admissions from database
    // In production, replace this with actual API call to your Laravel backend
    // const response = await fetch(`https://website.anwarululoom.com/api/admissions?page=${page}&limit=${limit}`);
    // const data = await response.json();
    
    // Mock data for now
    const mockData: any[] = [];
    
    return NextResponse.json({
      success: true,
      data: mockData,
      pagination: {
        current_page: page,
        per_page: limit,
        total: mockData.length,
        total_pages: Math.ceil(mockData.length / limit),
        has_next_page: page < Math.ceil(mockData.length / limit),
        has_prev_page: page > 1,
        next_page: page < Math.ceil(mockData.length / limit) ? page + 1 : null,
        prev_page: page > 1 ? page - 1 : null,
      }
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('❌ Admission GET API error:', error);
    return NextResponse.json({
      success: false,
      message: 'Failed to fetch admissions',
      error: error.message
    }, { status: 500 });
  }
}

