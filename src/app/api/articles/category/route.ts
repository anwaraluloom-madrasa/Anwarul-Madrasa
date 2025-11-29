import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://website.anwarululoom.com/api';

export async function GET(request: NextRequest) {
  try {
    // Since the external API doesn't have /articles/category endpoint,
    // we return fallback categories
    const fallbackCategories = [
      { id: 1, name: 'General' },
      { id: 2, name: 'Islamic Studies' },
      { id: 3, name: 'Quran' },
      { id: 4, name: 'Hadith' },
      { id: 5, name: 'Fiqh' },
      { id: 6, name: 'Tafsir' },
      { id: 7, name: 'Seerah' },
      { id: 8, name: 'Aqeedah' }
    ];
    
    
    return NextResponse.json(fallbackCategories, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  } catch (error) {
    console.error('❌ API Proxy Error:', error);
    
    // Return fallback categories instead of error
    const fallbackCategories = [
      { id: 1, name: 'General' },
      { id: 2, name: 'Islamic Studies' },
      { id: 3, name: 'Quran' },
      { id: 4, name: 'Hadith' },
      { id: 5, name: 'Fiqh' }
    ];
    
    return NextResponse.json(fallbackCategories, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
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
