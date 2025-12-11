/**
 * Migration script to remove the legacy 'baseSlug' field from all post documents
 * 
 * Usage:
 * 1. Make sure you have a SANITY_TOKEN with write access in your environment
 * 2. Run: node scripts/remove-baseSlug.js
 */

const { createClient } = require('@sanity/client');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env.local or .env.development
const envLocal = dotenv.config({ path: path.join(__dirname, '..', '.env.local') });
if (envLocal.error) {
  dotenv.config({ path: path.join(__dirname, '..', '.env.development') });
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN || process.env.SANITY_TOKEN,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-12-09',
  useCdn: false,
});

async function removeBaseSlug() {
  try {
    console.log('🔍 Searching for posts with baseSlug field...\n');

    const query = '*[_type == "post" && defined(baseSlug)]{ _id, title, baseSlug }';
    const posts = await client.fetch(query);

    if (posts.length === 0) {
      console.log('✅ No posts found with baseSlug field. Nothing to clean up!');
      return;
    }

    console.log(`📋 Found ${posts.length} post(s) with baseSlug field:\n`);
    posts.forEach((post, index) => {
      console.log(`   ${index + 1}. "${post.title}" (ID: ${post._id})`);
      console.log(`      baseSlug: "${post.baseSlug?.current || post.baseSlug}"\n`);
    });

    console.log('🗑️  Starting to remove baseSlug field...\n');

    // Remove baseSlug from each document
    let successCount = 0;
    let errorCount = 0;

    for (const post of posts) {
      try {
        await client
          .patch(post._id)
          .unset(['baseSlug'])
          .commit();
        
        successCount++;
        console.log(`   ✓ Removed baseSlug from: "${post.title}"`);
      } catch (error) {
        errorCount++;
        console.error(`   ✗ Failed to remove baseSlug from "${post.title}":`, error.message);
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('✅ Migration complete!');
    console.log(`   Successfully updated: ${successCount}`);
    if (errorCount > 0) {
      console.log(`   Failed: ${errorCount}`);
    }
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error('\nTroubleshooting:');
    console.error('  1. Make sure SANITY_API_TOKEN is set in your .env.development file');
    console.error('  2. The token must have write permissions');
    console.error('  3. Check that your project ID and dataset are correct\n');
    process.exit(1);
  }
}

removeBaseSlug();

