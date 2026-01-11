/**
 * Tool Page Service
 *
 * Handles all data fetching operations for tool pages from Sanity CMS
 */

import { client } from "@/sanity/lib/client";

/**
 * Fetch all published tool pages for footer links
 *
 * @param {string} locale - The locale to fetch tool pages for (default: 'en')
 * @returns {Promise<Array>} - Array of tool pages with title and slug
 */
export async function fetchToolPagesForFooter(locale = 'en') {
  try {
    const query = `*[
      _type == "toolPage" &&
      defined(slug.current) &&
      locale == $locale
    ] | order(publishedAt desc) {
      title,
      "slug": slug.current
    }`;

    const toolPages = await client.fetch(query, { locale });
    return toolPages || [];
  } catch (error) {
    console.error('Error fetching tool pages for footer:', error);
    return [];
  }
}

/**
 * Fetch a single tool page by slug
 *
 * @param {string} slug - The slug of the tool page
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Object|null>} - Tool page data or null if not found
 */
export async function fetchToolPageBySlug(slug, locale = 'en') {
  try {
    const query = `*[
      _type == "toolPage" &&
      slug.current == $slug &&
      locale == $locale
    ][0] {
      _id,
      title,
      slug,
      metaTitle,
      metaDescription,
      widget,
      heroIcon,
      heroHeading,
      heroDescription,
      buttonText,
      exampleUrls,
      contentBeforeWidget,
      contentAfterWidget,
      faqs,
      locale,
      publishedAt,
      customStructuredData
    }`;

    let toolPage = await client.fetch(query, { slug, locale });

    // Fallback to English if not found in current locale
    if (!toolPage && locale !== 'en') {
      toolPage = await client.fetch(query, { slug, locale: 'en' });
    }

    return toolPage;
  } catch (error) {
    console.error('Error fetching tool page by slug:', error);
    return null;
  }
}

/**
 * Fetch all tool page slugs for static path generation
 *
 * @returns {Promise<Array>} - Array of objects with slug and locale
 */
export async function fetchAllToolPageSlugs() {
  try {
    const query = `*[
      _type == "toolPage" && defined(slug.current)
    ] {
      "slug": slug.current,
      locale
    }`;

    const slugs = await client.fetch(query);
    return slugs || [];
  } catch (error) {
    console.error('Error fetching tool page slugs:', error);
    return [];
  }
}

/**
 * Fetch tool pages by widget type
 *
 * @param {string} widgetType - The widget type (redirect, block)
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Array>} - Array of tool pages
 */
export async function fetchToolPagesByWidget(widgetType, locale = 'en') {
  try {
    const query = `*[
      _type == "toolPage" &&
      widget == $widgetType &&
      locale == $locale &&
      defined(slug.current)
    ] | order(publishedAt desc) {
      title,
      "slug": slug.current,
      heroDescription,
      publishedAt
    }`;

    const toolPages = await client.fetch(query, { widgetType, locale });
    return toolPages || [];
  } catch (error) {
    console.error('Error fetching tool pages by widget:', error);
    return [];
  }
}

/**
 * Fetch recent tool pages
 *
 * @param {number} limit - Maximum number of tool pages to fetch (default: 5)
 * @param {string} locale - The locale to fetch (default: 'en')
 * @returns {Promise<Array>} - Array of recent tool pages
 */
export async function fetchRecentToolPages(limit = 5, locale = 'en') {
  try {
    const query = `*[
      _type == "toolPage" &&
      locale == $locale &&
      defined(slug.current)
    ] | order(publishedAt desc) [0...${limit}] {
      title,
      "slug": slug.current,
      heroDescription,
      publishedAt
    }`;

    const toolPages = await client.fetch(query, { locale });
    return toolPages || [];
  } catch (error) {
    console.error('Error fetching recent tool pages:', error);
    return [];
  }
}
