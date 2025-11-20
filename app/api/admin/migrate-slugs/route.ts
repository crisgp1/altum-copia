import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/app/lib/infrastructure/database/connection';
import { AttorneyModel } from '@/app/lib/infrastructure/persistence/mongodb/models/AttorneyModel';

// Utility function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();
}

// POST /api/admin/migrate-slugs
export async function POST(request: NextRequest) {
  try {
    console.log('Starting attorney slug migration...');
    await connectToDatabase();

    // Find all attorneys without a slug or with empty slug
    const attorneys = await AttorneyModel.find({
      $or: [
        { slug: { $exists: false } },
        { slug: null },
        { slug: '' }
      ]
    });

    console.log(`Found ${attorneys.length} attorneys without slugs`);

    if (attorneys.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'All attorneys already have slugs. Nothing to migrate.',
        updated: 0,
        failed: 0,
        attorneys: []
      });
    }

    let updated = 0;
    let failed = 0;
    const results: any[] = [];

    for (const attorney of attorneys) {
      try {
        const slug = generateSlug(attorney.nombre);
        console.log(`Updating ${attorney.nombre} with slug: ${slug}`);

        // Check if slug already exists
        const existingWithSlug = await AttorneyModel.findOne({
          slug,
          _id: { $ne: attorney._id }
        });

        let finalSlug = slug;
        if (existingWithSlug) {
          // If slug exists, append the attorney's ID to make it unique
          finalSlug = `${slug}-${attorney._id.toString().slice(-6)}`;
          console.log(`  Slug collision detected. Using unique slug: ${finalSlug}`);
        }

        attorney.slug = finalSlug;
        await attorney.save();
        updated++;

        results.push({
          nombre: attorney.nombre,
          slug: finalSlug,
          status: 'success'
        });

        console.log(`  ✓ Updated successfully`);
      } catch (error: any) {
        failed++;
        results.push({
          nombre: attorney.nombre,
          status: 'failed',
          error: error.message
        });
        console.error(`  ✗ Failed to update ${attorney.nombre}:`, error.message);
      }
    }

    // Get all attorneys with their slugs
    const allAttorneys = await AttorneyModel.find({}, 'nombre slug').sort({ nombre: 1 });
    const attorneyList = allAttorneys.map(att => ({
      nombre: att.nombre,
      slug: att.slug,
      url: `/equipo/${att.slug}`
    }));

    return NextResponse.json({
      success: true,
      message: 'Migration completed',
      total: attorneys.length,
      updated,
      failed,
      results,
      allAttorneys: attorneyList
    }, { status: 200 });

  } catch (error: any) {
    console.error('Migration failed:', error);
    return NextResponse.json({
      success: false,
      error: 'Migration failed',
      details: error.message
    }, { status: 500 });
  }
}

// GET /api/admin/migrate-slugs - Check current status
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const totalAttorneys = await AttorneyModel.countDocuments();
    const attorneysWithSlug = await AttorneyModel.countDocuments({
      slug: { $exists: true, $ne: null, $ne: '' }
    });
    const attorneysWithoutSlug = totalAttorneys - attorneysWithSlug;

    const allAttorneys = await AttorneyModel.find({}, 'nombre slug').sort({ nombre: 1 });
    const attorneyList = allAttorneys.map(att => ({
      nombre: att.nombre,
      slug: att.slug || 'NO SLUG',
      url: att.slug ? `/equipo/${att.slug}` : 'N/A'
    }));

    return NextResponse.json({
      success: true,
      totalAttorneys,
      attorneysWithSlug,
      attorneysWithoutSlug,
      needsMigration: attorneysWithoutSlug > 0,
      attorneys: attorneyList
    }, { status: 200 });

  } catch (error: any) {
    console.error('Error checking migration status:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to check migration status',
      details: error.message
    }, { status: 500 });
  }
}
