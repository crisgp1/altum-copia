import { NextRequest, NextResponse } from 'next/server';
import { put, head, del, list } from '@vercel/blob';

// GET /api/site-settings - Get site settings
export async function GET(request: NextRequest) {
  try {
    // Try to get the site settings from blob storage
    const url = new URL(request.url);
    const setting = url.searchParams.get('setting');

    if (setting === 'about-hero-image') {
      try {
        // Try to get the about hero image URL from blob metadata
        const { blobs } = await list();
        const settingsBlob = blobs.find(blob => blob.pathname === 'site-settings/about-hero-image.json');
        
        if (settingsBlob) {
          const response = await fetch(settingsBlob.url);
          const data = await response.json();
          return NextResponse.json({
            success: true,
            data: data.imageUrl
          });
        }
      } catch (error) {
        console.log('No settings found, returning null');
      }
    }

    return NextResponse.json({
      success: true,
      data: null
    });
  } catch (error) {
    console.error('Error fetching site settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al cargar configuración del sitio' 
      },
      { status: 500 }
    );
  }
}

// POST /api/site-settings - Update site settings
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { setting, value } = body;

    if (!setting || value === undefined) {
      return NextResponse.json(
        { success: false, error: 'Setting y value son requeridos' },
        { status: 400 }
      );
    }

    if (setting === 'about-hero-image') {
      // Save the image URL to blob storage as JSON
      const settingsData = {
        imageUrl: value,
        updatedAt: new Date().toISOString()
      };

      try {
        // First, try to delete the existing blob if it exists
        const { blobs } = await list();
        const existingBlob = blobs.find(blob => blob.pathname === 'site-settings/about-hero-image.json');
        
        if (existingBlob) {
          await del(existingBlob.url);
        }
      } catch (error) {
        // Ignore deletion errors, blob might not exist
        console.log('No existing blob to delete or deletion failed:', error);
      }

      // Now create the new blob
      const blob = await put(
        'site-settings/about-hero-image.json',
        JSON.stringify(settingsData),
        {
          contentType: 'application/json',
          access: 'public',
          addRandomSuffix: false
        }
      );

      return NextResponse.json({
        success: true,
        message: 'Imagen de hero actualizada exitosamente'
      });
    }

    return NextResponse.json(
      { success: false, error: 'Setting no reconocido' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error updating site settings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Error al actualizar configuración del sitio' 
      },
      { status: 500 }
    );
  }
}