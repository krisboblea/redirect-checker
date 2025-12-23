import { createClient } from '@sanity/client';
import { processTranslationJob } from './translate-post';

const sanityClient = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
});

const MAX_JOBS_PER_RUN = 10;

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const ranAt = new Date().toISOString();

  try {
    // Find English posts that need translation
    const postsNeedingTranslation = await sanityClient.fetch(
      `*[_type == "post" && locale == "en" && needsTranslation == true][0...${MAX_JOBS_PER_RUN}]{
        _id,
        title
      }`
    );

    let processed = 0;
    const results = [];

    for (const post of postsNeedingTranslation) {
      try {
        console.log(`[Cron] Processing translation for: ${post.title} (${post._id})`);

        const result = await processTranslationJob(post._id, null);

        processed += 1;
        results.push({
          documentId: post._id,
          title: post.title,
          status: 'success',
          result,
        });

        console.log(`[Cron] ✓ Completed translation for: ${post.title}`);
      } catch (error) {
        console.error(`[Cron] Failed to translate ${post._id}:`, error);
        results.push({
          documentId: post._id,
          title: post.title,
          status: 'error',
          error: error.message,
        });
      }
    }

    return res.status(200).json({
      ok: true,
      ranAt,
      processed,
      message: `Processed ${processed} translation jobs`,
      results,
    });
  } catch (error) {
    console.error('[Cron] Job failed', error);
    return res.status(500).json({
      ok: false,
      error: error.message,
    });
  }
}