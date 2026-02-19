/**
 * Flexible Document Translation Service
 *
 * This module provides translation functionality for all Sanity document types.
 *
 * Architecture:
 * 1. 'content' field (PortableText) - Translated using translatePortableText (if defined in config)
 * 2. Other fields - Translated in bulk using translateMetadata (if defined in config)
 * 3. All other fields - Automatically preserved from source document
 *
 * To add new document types:
 * - Simply add the type and its translatable fields to TRANSLATABLE_FIELDS config
 * - Include 'content' in the array if PortableText content should be translated
 * - No other code changes needed
 */

import OpenAI from 'openai'
import { writeClient } from '@/sanity/lib/client'
import { allLanguages } from '@/sanity/config/i18n'

// Lazy initialize OpenAI client
function getOpenAIClient() {
  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  })
}

const SUPPORTED_LOCALES = allLanguages.filter((locale) => locale !== 'en')

const LOCALE_NAMES: Record<string, string> = {
  de: 'German (Deutsch)',
  es: 'Spanish (español)',
  fr: 'French (français)',
  it: 'Italian (italiano)',
  pt: 'Portuguese (português)',
  ja: 'Japanese (日本語)',
  zh: 'Chinese (简体中文)',
  ko: 'Korean (한국어)',
}

/**
 * SINGLE SOURCE OF TRUTH: Define which fields need translation per document type
 *
 * To add a new document type:
 * - Simply add one line here: myNewType: ['title', 'content', 'otherField']
 * - That's it! No other code changes needed.
 *
 * Field handling:
 * - 'content' field → Translated using translatePortableText (if included)
 * - Other fields → Translated in bulk using translateMetadata
 * - Unlisted fields → Preserved as-is from source document
 */
export const TRANSLATABLE_FIELDS: Record<string, string[]> = {
  post: ['title', 'excerpt', 'content', 'tags', 'faqs'],
  page: ['title', 'metaTitle', 'metaDescription', 'heroHeading', 'heroDescription', 'contentAfterWidget', 'faqs', 'widgetConfig'],
}

interface AnyDocument {
  _id: string
  _type: string
  locale: string
  content?: any[]
  [key: string]: any
}

/**
 * Translates a batch of text strings in a single OpenAI call.
 * Keys are preserved so results can be mapped back to original positions.
 */
async function translateBlocks(
  texts: Record<string, string>,
  targetLocale: string
): Promise<Record<string, string>> {
  const targetLanguage = LOCALE_NAMES[targetLocale]
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the text values in the following JSON object to ${targetLanguage}. Return ONLY a valid JSON object with the same keys and translated values. Preserve formatting and do not add explanations.`,
      },
      {
        role: 'user',
        content: JSON.stringify(texts),
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  return JSON.parse(response.choices[0].message.content || '{}')
}

/**
 * Translates metadata fields in bulk
 * Accepts any fields object and returns translated version with same structure
 */
async function translateMetadata(
  fieldsToTranslate: Record<string, any>,
  targetLocale: string,
  documentType: string
): Promise<Record<string, any>> {
  // If no fields to translate, return empty object
  if (Object.keys(fieldsToTranslate).length === 0) {
    return {}
  }

  const targetLanguage = LOCALE_NAMES[targetLocale]
  const openai = getOpenAIClient()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: `You are a professional translator. Translate the following document metadata to ${targetLanguage}. Maintain the tone, style, and context. Return ONLY a valid JSON object with the same structure. Rules:
- Translate only natural language text (titles, descriptions, headlines, labels, questions, answers, notes)
- Preserve ALL _key, _type, and _ref fields exactly as they are
- Preserve URLs (starting with http/https or /) exactly as they are
- Preserve slug values, code identifiers, and enum strings (e.g. "default", "redirect", "customerLogos", "with-widgets") exactly as they are
- Preserve image and file reference objects (objects containing _type: "image" or asset._ref) exactly as they are
- Preserve boolean values and numbers exactly as they are
- For widgetConfig arrays, only translate the "value" field when the "key" ends with "Text"; keep all other values unchanged
Do not add any explanations or markdown formatting.`,
      },
      {
        role: 'user',
        content: JSON.stringify(fieldsToTranslate, null, 2),
      },
    ],
    temperature: 0.3,
    response_format: { type: 'json_object' },
  })

  const translatedFields = JSON.parse(
    response.choices[0].message.content || '{}'
  )

  // Post-process to preserve _key fields in arrays (FAQs, etc.)
  for (const [key, value] of Object.entries(translatedFields)) {
    if (Array.isArray(value) && Array.isArray(fieldsToTranslate[key])) {
      translatedFields[key] = value.map((item: any, index: number) => {
        const originalItem = fieldsToTranslate[key][index]
        return {
          ...item,
          ...(originalItem?._key && { _key: originalItem._key }),
          ...(originalItem?._type && { _type: originalItem._type }),
        }
      })
    }
  }

  return translatedFields
}

const PORTABLE_TEXT_BATCH_SIZE = 10

/**
 * Returns true for natural language text that should be translated.
 * Filters out URLs, CSS values, single-word identifiers, enum strings, etc.
 * Requires at least 2 words with 3+ alphabetic characters.
 */
function isTranslatableString(s: string): boolean {
  if (!s?.trim()) return false
  if (/^https?:\/\/|^\/[\w/-]/.test(s)) return false // URLs / paths
  const words = s.match(/[a-zA-Z]{3,}/g) || []
  return words.length >= 2
}

/**
 * Recursively extracts all translatable string values from any value into a flat
 * key→string map. Skips Sanity image/file/reference objects and internal fields.
 */
function extractTranslatableStrings(
  value: any,
  prefix: string,
  result: Record<string, string>
): void {
  if (typeof value === 'string') {
    if (isTranslatableString(value)) result[prefix] = value
    return
  }
  if (Array.isArray(value)) {
    value.forEach((item, i) => extractTranslatableStrings(item, `${prefix}_${i}`, result))
    return
  }
  if (value && typeof value === 'object') {
    if (value._type === 'image' || value._type === 'file' || value._ref) return
    for (const [key, val] of Object.entries(value)) {
      if (['_key', '_type', '_ref', '_id', '_rev'].includes(key)) continue
      extractTranslatableStrings(val, `${prefix}_${key}`, result)
    }
  }
}

/**
 * Recursively applies translated strings back onto a value using the same key scheme
 * as extractTranslatableStrings. Non-translated values are preserved as-is.
 */
function applyTranslatedStrings(
  value: any,
  prefix: string,
  translatedMap: Record<string, string>
): any {
  if (typeof value === 'string') {
    return translatedMap[prefix] ?? value
  }
  if (Array.isArray(value)) {
    return value.map((item, i) => applyTranslatedStrings(item, `${prefix}_${i}`, translatedMap))
  }
  if (value && typeof value === 'object') {
    if (value._type === 'image' || value._type === 'file' || value._ref) return value
    const out: any = {}
    for (const [key, val] of Object.entries(value)) {
      out[key] = ['_key', '_type', '_ref', '_id', '_rev'].includes(key)
        ? val
        : applyTranslatedStrings(val, `${prefix}_${key}`, translatedMap)
    }
    return out
  }
  return value
}

async function translatePortableText(
  content: any[],
  targetLocale: string
): Promise<any[]> {
  if (!content || !Array.isArray(content)) return content

  // Collect all translatable text with unique string keys.
  // Standard 'block' items: spans are joined and keyed as b_{i}.
  // All other non-image block types: walked recursively to extract text fields.
  const texts: Record<string, string> = {}

  for (let i = 0; i < content.length; i++) {
    const block = content[i]
    if (block._type === 'block' && block.children) {
      const text = block.children
        .filter((child: any) => child._type === 'span' && child.text)
        .map((child: any) => child.text)
        .join(' ')
      if (text.trim()) texts[`b_${i}`] = text
    } else if (block._type !== 'image') {
      extractTranslatableStrings(block, `obj_${i}`, texts)
    }
  }

  if (Object.keys(texts).length === 0) return content

  // Split into chunks and translate all chunks in parallel
  const entries = Object.entries(texts)
  const chunks: Record<string, string>[] = []
  for (let i = 0; i < entries.length; i += PORTABLE_TEXT_BATCH_SIZE) {
    chunks.push(Object.fromEntries(entries.slice(i, i + PORTABLE_TEXT_BATCH_SIZE)))
  }

  const chunkResults = await Promise.all(
    chunks.map((chunk) => translateBlocks(chunk, targetLocale))
  )

  const translatedMap: Record<string, string> = {}
  for (const result of chunkResults) {
    Object.assign(translatedMap, result)
  }

  // Rebuild content, substituting translations where available
  return content.map((block, i) => {
    if (block._type === 'block' && translatedMap[`b_${i}`] !== undefined) {
      return {
        ...block,
        children: [{ _type: 'span', text: translatedMap[`b_${i}`], marks: [] }],
      }
    }
    if (block._type !== 'image') {
      return applyTranslatedStrings(block, `obj_${i}`, translatedMap)
    }
    return block
  })
}

/**
 * Creates a translated version of a document
 * Preserves ALL fields and only translates the configured ones
 */
async function createTranslatedDocument(
  sourceDoc: AnyDocument,
  targetLocale: string
): Promise<any> {
  const documentType = sourceDoc._type

  // Get translatable fields for this document type
  const translatableFieldNames = TRANSLATABLE_FIELDS[documentType] || []

  // Check if 'content' field should be translated
  const shouldTranslateContent = translatableFieldNames.includes('content')

  // Extract only the fields that need translation (excluding 'content')
  const fieldsToTranslate: Record<string, any> = {}
  for (const fieldName of translatableFieldNames) {
    if (fieldName !== 'content' && sourceDoc[fieldName] !== undefined) {
      fieldsToTranslate[fieldName] = sourceDoc[fieldName]
    }
  }

  // Translate metadata fields and content in parallel
  const [translatedFields, translatedContent] = await Promise.all([
    translateMetadata(fieldsToTranslate, targetLocale, documentType),
    shouldTranslateContent && sourceDoc.content
      ? translatePortableText(sourceDoc.content, targetLocale)
      : Promise.resolve(undefined),
  ])

  // Build the translated document by preserving ALL original fields
  const translatedDoc: any = {
    ...sourceDoc, // Copy ALL fields from source
    locale: targetLocale, // Override locale
    ...translatedFields, // Override translated fields
  }

  // Override content if it was translated
  if (translatedContent !== undefined) {
    translatedDoc.content = translatedContent
  }

  // Remove internal Sanity fields that shouldn't be copied to new documents
  delete translatedDoc._id
  delete translatedDoc._createdAt
  delete translatedDoc._updatedAt
  delete translatedDoc._rev
  delete translatedDoc.needsTranslation

  // Check if translation already exists
  // Use slug.current for most types, pageSlug for faqSet
  const identifier = sourceDoc.slug?.current || sourceDoc.pageSlug
  if (identifier) {
    const queryField = sourceDoc.pageSlug ? 'pageSlug' : 'slug.current'
    const existingTranslation = await writeClient.fetch(
      `*[_type == $type && locale == $locale && ${queryField} == $identifier][0]`,
      {
        type: documentType,
        locale: targetLocale,
        identifier,
      }
    )

    // Update or create the document
    if (existingTranslation) {
      return await writeClient
        .patch(existingTranslation._id)
        .set(translatedDoc)
        .commit()
    }
  }

  // Create new document
  return await writeClient.create(translatedDoc)
}

/**
 * Main translation function
 * Translates a document to target locales (all supported locales by default)
 */
export async function translateDocument(
  documentId: string,
  targetLocales?: string[]
): Promise<{ success: boolean; results: any[] }> {
  console.log(`[Translate] Processing translation for document: ${documentId}`)

  // Fetch ALL fields from the document
  const sourceDoc = await writeClient.fetch(
    `*[_id == $id][0]`,
    { id: documentId }
  )

  if (!sourceDoc) {
    const message = `Document not found: ${documentId}`
    console.error(`[Translate] ${message}`)
    throw new Error(message)
  }

  if (sourceDoc.locale !== 'en') {
    const message = 'Only English documents can be translated'
    console.error(`[Translate] ${message}`)
    throw new Error(message)
  }

  // Check if document type is supported
  if (!TRANSLATABLE_FIELDS[sourceDoc._type]) {
    const message = `Document type '${sourceDoc._type}' is not configured for translation. Add it to TRANSLATABLE_FIELDS.`
    console.error(`[Translate] ${message}`)
    throw new Error(message)
  }

  const identifier =
    sourceDoc.slug?.current || sourceDoc.pageSlug || sourceDoc.title || 'unknown'
  const locales = targetLocales || SUPPORTED_LOCALES

  console.log(
    `[Translate] Starting parallel translation for ${sourceDoc._type}: ${identifier} to ${locales.length} languages`
  )

  // Translate all languages in parallel for maximum speed
  const results = await Promise.all(
    locales.map(async (locale) => {
      try {
        console.log(`[Translate] [${identifier}] Translating to ${locale}...`)
        const translatedDoc = await createTranslatedDocument(sourceDoc, locale)
        console.log(`[Translate] [${identifier}] ✓ Translated to ${locale}`)
        return {
          locale,
          status: 'success',
          documentId: translatedDoc._id,
        }
      } catch (error) {
        console.error(
          `[Translate] [${identifier}] Error translating to ${locale}:`,
          error
        )
        return {
          locale,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
        }
      }
    })
  )

  // Mark the source document as no longer needing translation
  try {
    await writeClient
      .patch(documentId)
      .set({ needsTranslation: false })
      .commit()
    console.log(`[Translate] [${identifier}] Marked needsTranslation=false`)
  } catch (error) {
    console.warn(
      `[Translate] [${identifier}] Could not update needsTranslation flag:`,
      error
    )
    // Don't fail the whole translation just because we couldn't update the flag
  }

  console.log(
    `[Translate] [${identifier}] Translation complete for document: ${documentId}`
  )
  return { success: true, results }
}
