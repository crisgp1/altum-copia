import { NextRequest, NextResponse } from 'next/server';
import { put } from '@vercel/blob';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { data, filename, folder = 'data' } = body;

    if (!data) {
      return NextResponse.json(
        { error: 'No data provided' },
        { status: 400 }
      );
    }

    if (!filename) {
      return NextResponse.json(
        { error: 'Filename is required' },
        { status: 400 }
      );
    }

    // Generate unique filename with timestamp
    const timestamp = Date.now();
    const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fullPath = `${folder}/${timestamp}_${sanitizedFilename}`;

    // Convert data to string if it's an object
    const dataString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

    // Upload to Vercel Blob
    const { url } = await put(fullPath, dataString, {
      access: 'public',
      contentType: filename.endsWith('.json') ? 'application/json' : 'text/plain',
    });

    return NextResponse.json({
      success: true,
      url,
      filename: sanitizedFilename,
      path: fullPath,
      size: dataString.length
    });

  } catch (error) {
    console.error('Error uploading data:', error);
    return NextResponse.json(
      { error: 'Failed to upload data' },
      { status: 500 }
    );
  }
}

// GET method to retrieve data
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const url = searchParams.get('url');

    if (!url) {
      return NextResponse.json(
        { error: 'URL parameter is required' },
        { status: 400 }
      );
    }

    // Fetch data from the blob URL
    const response = await fetch(url);
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch data from blob' },
        { status: 404 }
      );
    }

    const data = await response.text();
    
    // Try to parse as JSON, fallback to plain text
    let parsedData;
    try {
      parsedData = JSON.parse(data);
    } catch {
      parsedData = data;
    }

    return NextResponse.json({
      success: true,
      data: parsedData
    });

  } catch (error) {
    console.error('Error retrieving data:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve data' },
      { status: 500 }
    );
  }
}