import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';

// GET /api/legal-content/banners - Get active banners for frontend display
export async function GET() {
  try {
    const { db } = await connectToDatabase();
    
    const activeBanners = await db.collection('legal_content')
      .find({ bannerActive: true })
      .toArray();
    
    const formattedBanners = activeBanners.map(banner => ({
      type: banner.type,
      title: banner.title,
      bannerText: banner.bannerText,
      lastUpdated: banner.lastUpdated
    }));
    
    return NextResponse.json(formattedBanners);
  } catch (error) {
    console.error('Error fetching active banners:', error);
    return NextResponse.json(
      { error: 'Error al obtener los banners activos' },
      { status: 500 }
    );
  }
}