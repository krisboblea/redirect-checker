/**
 * Translation Processing API Endpoint
 *
 * This endpoint supports both manual and batch translation processing:
 *
 * 1. Manual Translation (UI):
 *    - User clicks "AI Translate" in Sanity Studio (src/sanity/plugins/languageSwitcher.tsx)
 *    - Plugin calls this API with docId
 *    - Translates single document immediately
 *
 * 2. Batch Translation (Background Jobs):
 *    - Queries for documents with needsTranslation=true
 *    - Processes up to MAX_JOBS_PER_RUN documents
 *    - Can filter by document type
 *
 * Flow:
 * 1. Validate request and fetch documents to process
 * 2. Call translateDocument() from src/lib/translation/translate-document.ts
 * 3. Translation service translates to all 8 languages in parallel
 * 4. Sets needsTranslation=false on completion
 * 5. Returns success/error response
 *
 * Usage:
 * - POST /api/sanity/process-translations?docId=XXX  (single document)
 * - POST /api/sanity/process-translations            (batch - all types)
 * - POST /api/sanity/process-translations?type=post  (batch - specific type)
 */

import { NextRequest, NextResponse } from 'next/server'
import { writeClient } from '@/sanity/lib/client'
import { translateDocument } from '@/lib/translation/translate-document'

const MAX_JOBS_PER_RUN = 10

const TRANSLATABLE_TYPES = ['post', 'page'] as const
type TranslatableType = typeof TRANSLATABLE_TYPES[number]

export async function GET(req: NextRequest) {
  return handleProcessTranslations(req)
}

export async function POST(req: NextRequest) {
  return handleProcessTranslations(req)
}

async function handleProcessTranslations(req: NextRequest) {
  const ranAt = new Date().toISOString()

  try {
    // Get parameters from either query params or request body
    const searchParams = req.nextUrl.searchParams
    let docId = searchParams.get('docId')
    let docType = searchParams.get('type') as TranslatableType | null

    if (!docId && req.method === 'POST') {
      try {
        const body = await req.json()
        docId = body.docId
        docType = body.type
      } catch (e) {
        // Body might be empty, that's okay
      }
    }

    let documentsToProcess: Array<{ _id: string; _type: string; title?: string; pageSlug?: string }> = []

    if (docId) {
      // Trigger translation for a single document
      const doc = await writeClient.fetch(
        `*[_id == $id][0]{ _id, _type, title, pageSlug }`,
        { id: docId }
      )
      if (!doc) {
        return NextResponse.json(
          { ok: false, error: 'Document not found' },
          { status: 404 }
        )
      }
      documentsToProcess.push(doc)
    } else {
      // Batch processing: fetch documents with needsTranslation=true
      const types = docType && (TRANSLATABLE_TYPES as readonly string[]).includes(docType)
        ? [docType]
        : [...TRANSLATABLE_TYPES]

      console.log(`[API] Fetching documents with needsTranslation=true for types: ${types.join(', ')}`)

      for (const type of types) {
        const query = `*[_type == "${type}" && locale == "en" && needsTranslation == true][0...${MAX_JOBS_PER_RUN}]{
          _id,
          _type,
          title,
          pageSlug
        }`

        const docs = await writeClient.fetch(query)
        if (docs && docs.length > 0) {
          console.log(`[API] Found ${docs.length} ${type} documents needing translation`)
          documentsToProcess.push(...docs)
        }
      }

      // Limit to MAX_JOBS_PER_RUN total
      documentsToProcess = documentsToProcess.slice(0, MAX_JOBS_PER_RUN)

      if (documentsToProcess.length === 0) {
        return NextResponse.json({
          ok: true,
          ranAt,
          processed: 0,
          message: 'No documents found with needsTranslation=true',
          results: [],
        })
      }
    }

    let processed = 0
    const results = []

    for (const doc of documentsToProcess) {
      try {
        const identifier = doc.title || doc.pageSlug || doc._id
        console.log(
          `[API] Processing translation for ${doc._type}: ${identifier} (${doc._id})`
        )

        // Call the generalized translation service
        // This translates the document to all supported languages in parallel
        const result = await translateDocument(doc._id)

        processed += 1
        results.push({
          documentId: doc._id,
          type: doc._type,
          title: identifier,
          status: 'success',
          result,
        })

        console.log(`[Process] ✓ Completed translation for ${doc._type}: ${identifier}`)
      } catch (error) {
        console.error(`[Process] Failed to translate ${doc._id}:`, error)
        results.push({
          documentId: doc._id,
          type: doc._type,
          title: doc.title || doc.pageSlug || doc._id,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        })
      }
    }

    return NextResponse.json({
      ok: true,
      ranAt,
      processed,
      message: `Processed ${processed} translation jobs`,
      results,
    })
  } catch (error) {
    console.error('[Process] Job failed', error)
    return NextResponse.json(
      {
        ok: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
