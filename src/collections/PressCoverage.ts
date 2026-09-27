import type { CollectionConfig } from 'payload'

import { canPublish, publishedOrStaff } from '@/access'
import { legacyIdField } from '@/fields/common'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/** "মিডিয়ায় আমরা" — links to national press coverage of the branch. */
export const PressCoverage: CollectionConfig = {
  slug: 'press-coverage',
  labels: {
    singular: { bn: 'মিডিয়া কভারেজ', en: 'Press coverage' },
    plural: { bn: 'মিডিয়ায় আমরা', en: 'Press coverage' },
  },
  admin: {
    useAsTitle: 'headline',
    defaultColumns: ['headline', 'outlet', 'publishedAt', '_status'],
    group: { bn: 'কনটেন্ট', en: 'Content' },
  },
  access: { read: publishedOrStaff, create: canPublish, update: canPublish, delete: canPublish },
  versions: { drafts: true, maxPerDoc: 5 },
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [revalidateAfterChange('press')],
    afterDelete: [revalidateAfterDelete('press')],
  },
  fields: [
    { name: 'headline', type: 'text', required: true, label: { bn: 'শিরোনাম', en: 'Headline' } },
    {
      name: 'headlineEn',
      type: 'text',
      label: { bn: 'শিরোনাম (ইংরেজি)', en: 'Headline in English' },
      admin: { description: 'Optional. Shown on the English site; the original headline is used if this is empty.' },
    },
    {
      type: 'row',
      fields: [
        { name: 'outlet', type: 'text', required: true, label: { bn: 'সংবাদমাধ্যম', en: 'Outlet' } },
        {
          name: 'publishedAt',
          type: 'date',
          required: true,
          label: { bn: 'প্রকাশের তারিখ', en: 'Published at' },
        },
      ],
    },
    {
      name: 'url',
      type: 'text',
      required: true,
      label: { bn: 'লিংক', en: 'URL' },
      validate: (v: unknown) => (typeof v === 'string' && /^https?:\/\//.test(v)) || 'Must be an http(s) URL',
    },
    {
      name: 'externalImageUrl',
      type: 'text',
      label: { bn: 'সংবাদের ছবির লিংক (ঐচ্ছিক)', en: 'Article image URL (optional)' },
      admin: { description: 'Shown only if the outlet allows it; otherwise a typographic card is used.' },
    },
    legacyIdField,
  ],
}
