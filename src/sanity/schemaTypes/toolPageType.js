import { defineField, defineType } from 'sanity'
import { LANGUAGES, defaultLocale, getLocaleLabel } from '../../config/i18n'

export const toolPageType = defineType({
  name: 'toolPage',
  title: 'Tool Page',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Page Title',
      description: 'Main H1 title for the tool page',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      title: 'URL Slug',
      description: 'URL path (e.g., "redirect-checker" becomes /redirect-checker)',
      options: {
        source: 'title',
        isUnique: (slug, context) => {
          const { document, getClient } = context;
          const locale = document?.locale || 'en';
          const docId = document?._id || '';

          const publishedId = docId.replace(/^drafts\./, '');
          const draftId = `drafts.${publishedId}`;

          const client = getClient({ apiVersion: '2024-01-01' });

          const query = `
            !defined(*[
              _type == "toolPage" &&
              slug.current == $slug &&
              locale == $locale &&
              !(_id in [$publishedId, $draftId])
            ][0]._id)
          `;

          return client.fetch(query, { slug, locale, publishedId, draftId });
        },
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'metaTitle',
      type: 'string',
      title: 'Meta Title',
      description: 'SEO meta title (appears in search results)',
      validation: (rule) => rule.max(60).warning('Should be 60 characters or less'),
    }),
    defineField({
      name: 'metaDescription',
      type: 'text',
      title: 'Meta Description',
      description: 'SEO meta description (appears in search results)',
      validation: (rule) => rule.max(160).warning('Should be 160 characters or less'),
    }),
    defineField({
      name: 'widget',
      type: 'string',
      title: 'Widget Type',
      description: 'Which tool widget to display',
      options: {
        list: [
          { title: 'Redirect Checker', value: 'redirect' },
          { title: 'Block Checker', value: 'block' },
        ],
        layout: 'radio',
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroIcon',
      type: 'string',
      title: 'Hero Icon',
      description: 'React icon name (e.g., FaLink, FaBan)',
      initialValue: 'FaLink',
    }),
    defineField({
      name: 'heroHeading',
      type: 'string',
      title: 'Hero Heading',
      description: 'Main heading displayed above the widget',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'heroDescription',
      type: 'text',
      title: 'Hero Description',
      description: 'Description text displayed below the hero heading',
    }),
    defineField({
      name: 'buttonText',
      type: 'string',
      title: 'Button Text',
      description: 'Text for the main action button',
      initialValue: 'Check Now',
    }),
    defineField({
      name: 'exampleUrls',
      type: 'array',
      title: 'Example URLs',
      description: 'Example URLs to show in the widget (2-3 recommended)',
      of: [{ type: 'string' }],
      validation: (rule) => rule.max(3),
    }),
    defineField({
      name: 'contentBeforeWidget',
      type: 'array',
      title: 'Content Before Widget',
      description: 'Optional content to display before the widget',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'contentAfterWidget',
      type: 'array',
      title: 'Content After Widget',
      description: 'Optional content to display after the widget',
      of: [
        { type: 'block' },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alt text',
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
            },
          ],
        },
      ],
    }),
    defineField({
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      description: 'Frequently Asked Questions (recommended: 5-10 for SEO)',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'question',
              type: 'string',
              title: 'Question',
              validation: (rule) => rule.required(),
            },
            {
              name: 'answer',
              type: 'text',
              title: 'Answer',
              validation: (rule) => rule.required(),
            },
          ],
          preview: {
            select: { title: 'question', subtitle: 'answer' },
            prepare({ title, subtitle }) {
              return {
                title,
                subtitle: subtitle?.length > 80
                  ? subtitle.substring(0, 80) + '...'
                  : subtitle
              }
            },
          },
        },
      ],
      validation: (rule) => rule.min(5).max(15),
    }),
    defineField({
      name: 'locale',
      type: 'string',
      title: 'Language',
      description: 'Language of this tool page',
      options: {
        list: LANGUAGES.map(lang => ({
          title: lang.nativeName || lang.title,
          value: lang.id,
        })),
        layout: 'dropdown',
      },
      initialValue: defaultLocale,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'publishedAt',
      type: 'datetime',
      title: 'Published At',
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'customStructuredData',
      type: 'text',
      title: 'Custom Structured Data (JSON-LD)',
      description: 'Optional: Custom schema.org JSON-LD (advanced use only)',
      rows: 10,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      slug: 'slug',
      locale: 'locale',
      widget: 'widget',
    },
    prepare({ title, slug, locale, widget }) {
      return {
        title: title,
        subtitle: `${getLocaleLabel(locale)} • /${slug?.current || slug} • ${widget}`,
      }
    },
  },
})
