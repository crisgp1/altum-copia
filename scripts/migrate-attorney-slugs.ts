/**
 * Migration script to add slug field to all existing attorneys in MongoDB
 * Run with: npx ts-node scripts/migrate-attorney-slugs.ts
 */

import mongoose from 'mongoose';
import { AttorneyModel } from '../app/lib/infrastructure/persistence/mongodb/models/AttorneyModel';
import { connectToDatabase } from '../app/lib/infrastructure/database/connection';

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

async function migrateAttorneySlugs() {
  try {
    console.log('Connecting to database...');
    await connectToDatabase();
    console.log('Connected to database successfully');

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
      console.log('All attorneys already have slugs. Nothing to migrate.');
      return;
    }

    let updated = 0;
    let failed = 0;

    for (const attorney of attorneys) {
      try {
        const slug = generateSlug(attorney.nombre);
        console.log(`Updating ${attorney.nombre} with slug: ${slug}`);

        // Check if slug already exists
        const existingWithSlug = await AttorneyModel.findOne({
          slug,
          _id: { $ne: attorney._id }
        });

        if (existingWithSlug) {
          // If slug exists, append the attorney's ID to make it unique
          const uniqueSlug = `${slug}-${attorney._id.toString().slice(-6)}`;
          console.log(`  Slug collision detected. Using unique slug: ${uniqueSlug}`);
          attorney.slug = uniqueSlug;
        } else {
          attorney.slug = slug;
        }

        await attorney.save();
        updated++;
        console.log(`  ✓ Updated successfully`);
      } catch (error: any) {
        failed++;
        console.error(`  ✗ Failed to update ${attorney.nombre}:`, error.message);
      }
    }

    console.log('\n=== Migration Summary ===');
    console.log(`Total attorneys processed: ${attorneys.length}`);
    console.log(`Successfully updated: ${updated}`);
    console.log(`Failed: ${failed}`);

    // List all attorneys with their slugs
    console.log('\n=== All Attorneys with Slugs ===');
    const allAttorneys = await AttorneyModel.find({}, 'nombre slug').sort({ nombre: 1 });
    allAttorneys.forEach(att => {
      console.log(`${att.nombre} -> /equipo/${att.slug}`);
    });

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  } finally {
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
  }
}

// Run the migration
migrateAttorneySlugs()
  .then(() => {
    console.log('\nMigration completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\nMigration failed:', error);
    process.exit(1);
  });
