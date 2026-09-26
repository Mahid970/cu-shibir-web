import type { CollectionConfig } from 'payload'

import { canPublish, publishedOrStaff } from '@/access'
import { bnSlugField } from '@/fields/common'
import { ensureSlug } from '@/hooks/ensureSlug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/**
 * শহীদ স্মরণ. The /martyrs page stays hidden until at least one entry is published, so the
 * list only goes live once the branch has verified names and details (plan §11).
 */
export const Martyrs: CollectionConfig = {
  slug: 'martyrs',
  labels: { singular: { bn: 'শহীদ', en: 'Martyr' }, plural: { bn: 'শহীদ স্মরণ', en: 'Martyrs' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'date', 'order', '_status'],
    group: { bn: 'সংগঠন', en: 'Organisation' },
    description: 'প্রকাশের আগে প্রতিটি তথ্য দায়িত্বশীলদের দিয়ে যাচাই করে নিন।',
  },
  access: { read: publishedOrStaff, create: canPublish, update: canPublish, delete: canPublish },
  versions: { drafts: true, maxPerDoc: 10 },
  defaultSort: 'order',
  hooks: {
    beforeValidate: [ensureSlug('name')],
    afterChange: [revalidateAfterChange('martyrs')],
    afterDelete: [revalidateAfterDelete('martyrs')],
  },
  fields: [
    { name: 'name', type: 'text', required: true, localized: true, label: { bn: 'নাম', en: 'Name' } },
    {
      type: 'row',
      fields: [
        { name: 'date', type: 'date', label: { bn: 'শাহাদাতের তারিখ', en: 'Date' } },
        { name: 'dateText', type: 'text', localized: true, label: { bn: 'তারিখ (লেখায়, ঐচ্ছিক)', en: 'Date as text' }, admin: { description: 'যেমন: "১৯৮৪ সালের মার্চ" — সঠিক দিন জানা না থাকলে' } },
        { name: 'order', type: 'number', defaultValue: 100, label: { bn: 'ক্রম', en: 'Order' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'affiliation', type: 'text', localized: true, label: { bn: 'বিভাগ/সেশন বা পরিচয়', en: 'Department/session' } },
        { name: 'place', type: 'text', localized: true, label: { bn: 'স্থান', en: 'Place' } },
      ],
    },
    { name: 'summary', type: 'textarea', localized: true, maxLength: 400, label: { bn: 'সংক্ষিপ্ত পরিচিতি', en: 'Short note' } },
    { name: 'bio', type: 'richText', localized: true, label: { bn: 'বিস্তারিত', en: 'Biography' } },
    { name: 'photo', type: 'upload', relationTo: 'media', label: { bn: 'ছবি', en: 'Photo' } },
    bnSlugField('name'),
  ],
}
