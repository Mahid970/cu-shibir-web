import type { CollectionConfig } from 'payload'

import { canPublish, publishedOrStaff } from '@/access'
import { bnSlugField } from '@/fields/common'
import { ensureSlug } from '@/hooks/ensureSlug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/** Photo gallery albums — one per program/event (the legacy site had a flat photo list). */
export const Albums: CollectionConfig = {
  slug: 'albums',
  labels: { singular: { bn: 'অ্যালবাম', en: 'Album' }, plural: { bn: 'গ্যালারি', en: 'Gallery' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'date', '_status'],
    group: { bn: 'কনটেন্ট', en: 'Content' },
  },
  access: { read: publishedOrStaff, create: canPublish, update: canPublish, delete: canPublish },
  versions: { drafts: true, maxPerDoc: 5 },
  defaultSort: '-date',
  hooks: {
    beforeValidate: [ensureSlug('title')],
    afterChange: [revalidateAfterChange('albums')],
    afterDelete: [revalidateAfterDelete('albums')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { bn: 'শিরোনাম', en: 'Title' } },
    { name: 'date', type: 'date', required: true, label: { bn: 'তারিখ', en: 'Date' } },
    { name: 'description', type: 'textarea', localized: true, label: { bn: 'বিবরণ', en: 'Description' } },
    {
      name: 'photos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      required: true,
      label: { bn: 'ছবিসমূহ', en: 'Photos' },
    },
    {
      name: 'legacyIds',
      type: 'json',
      admin: { readOnly: true, position: 'sidebar', description: 'Legacy photo ids (import)' },
    },
    bnSlugField('title'),
  ],
}
