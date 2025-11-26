import { promises as fs } from 'fs';
import { join } from 'path';
import { NextRequest, NextResponse } from 'next/server';

const API_BASE_URL = 'https://website.anwarululoom.com/';
const PLACEHOLDER_IMAGE = '/placeholder-gallery.jpg';

const toArrayBuffer = (data: Uint8Array): ArrayBuffer => {
  // Ensure we always return an ArrayBuffer, not SharedArrayBuffer
  if (data instanceof Buffer) {
    // Node.js Buffer
    return data.buffer.slice(data.byteOffset, data.byteOffset + data.byteLength);
  }
  // Fallback for other Uint8Array
  return Uint8Array.from(data).buffer;
};

const createImageResponse = (payload: ArrayBuffer, contentType?: string | null) =>
  new NextResponse(payload, {
    status: 200,
    headers: {
      'Content-Type': contentType ?? 'image/jpeg',
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });

const loadPlaceholderImage = async () => {
  const filePath = join(process.cwd(), 'public', PLACEHOLDER_IMAGE.replace(/^\/+/, ''));
  try {
    const file = await fs.readFile(filePath);
    return createImageResponse(toArrayBuffer(file), 'image/jpg');
  } catch (error) {
    console.error('Failed to load placeholder image:', error);
    return NextResponse.json({ error: 'Image not available' }, { status: 404 });
  }
};

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ path: string[] }> }
) {
  try {
    const { path } = await context.params;
    const imagePath = path.join('/');

    // Construct the full image URL - using /storage/ path directly
    const imageUrl = `${API_BASE_URL}/storage/${imagePath}`;

    console.log(`🖼️ [Image API] Fetching image from: ${imageUrl}`);

    // Fetch the image from the server
    const response = await fetch(imageUrl, {
      method: 'GET',
      headers: {
        Accept: 'image/*',
      },
    });

    console.log(`🖼️ [Image API] Response status: ${response.status} for ${imagePath}`);

    if (!response.ok) {
      console.warn(`⚠️ [Image API] Failed to fetch image (${response.status}): ${imageUrl}`);
      return await loadPlaceholderImage();
    }

    const imageBuffer = await response.arrayBuffer();
    const contentType = response.headers.get('content-type') || 'image/jpeg';
    
    console.log(`✅ [Image API] Successfully fetched image: ${imagePath} (${imageBuffer.byteLength} bytes, ${contentType})`);

    return createImageResponse(imageBuffer, contentType);
  } catch (error) {
    console.error('❌ [Image API] Image Proxy Error:', error);
    const { path } = await context.params;
    const imagePath = path.join('/');
    console.error(`❌ [Image API] Failed path: ${imagePath}`);
    return await loadPlaceholderImage();
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
