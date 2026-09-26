import { slugField, type Field } from 'payload'

import { slugify } from '@/lib/bn'

/** Latin, shareable slug generated from the (Bangla) title — see plan §6.3 SEO. */
export const bnSlugField = (useAsSlug = 'title') =>
  slugField({
    useAsSlug,
    position: 'sidebar',
    slugify: ({ valueToSlugify }) =>
      typeof valueToSlugify === 'string' ? slugify(valueToSlugify) : undefined,
  })

/** Keeps the old site's numeric id so imports are idempotent and old URLs can redirect. */
export const legacyIdField: Field = {
  name: 'legacyId',
  type: 'number',
  index: true,
  admin: { position: 'sidebar', readOnly: true, description: 'cushibir.org legacy id' },
}

export const seoFields: Field = {
  name: 'seo',
  type: 'group',
  label: { bn: 'এসইও ও শেয়ার', en: 'SEO & sharing' },
  admin: { position: 'sidebar' },
  fields: [
    { name: 'title', type: 'text', localized: true, label: { bn: 'মেটা শিরোনাম', en: 'Meta title' } },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      maxLength: 200,
      label: { bn: 'মেটা বর্ণনা', en: 'Meta description' },
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      label: { bn: 'শেয়ার ছবি (না দিলে স্বয়ংক্রিয়)', en: 'Share image (auto if empty)' },
    },
  ],
}
