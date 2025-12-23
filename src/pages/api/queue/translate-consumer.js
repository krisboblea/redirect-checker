import { queue } from '@vercel/functions';
import { processTranslationJob } from './translate';

export const config = {
  maxDuration: 300,
  // Bind this consumer to the same queue name used in the webhook
  queue: 'translate-article',
};

// Vercel Queue consumer: processes jobs enqueued by the webhook
export default queue(async (payload) => {
  const { documentId, targetLocales } = payload || {};

  if (!documentId) {
    throw new Error('documentId is required');
  }

  return await processTranslationJob(documentId, targetLocales);
});

