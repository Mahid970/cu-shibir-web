import type { CollectionConfig } from 'payload'

import { canPublish, publishedOrStaff } from '@/access'
import { bnSlugField, legacyIdField } from '@/fields/common'
import { ensureSlug } from '@/hooks/ensureSlug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/** Fields that make a leader profile "complete" (the legacy site has most of these empty). */
const PROFILE_FIELDS = ['photo', 'department', 'hall', 'session', 'bio', 'email'] as const

export const People: CollectionConfig = {
  slug: 'people',
  labels: {
    singular: { bn: 'দায়িত্বশীল', en: 'Person' },
    plural: { bn: 'দায়িত্বশীলবৃন্দ', en: 'Leadership' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'position', 'group', 'order', 'profileCompleteness', '_status'],
    group: { bn: 'সংগঠন', en: 'Organisation' },
  },
  access: {
    read: publishedOrStaff,
    create: canPublish,
    update: canPublish,
    delete: canPublish,
  },
  versions: { drafts: true, maxPerDoc: 10 },
  defaultSort: 'order',
  hooks: {
    beforeValidate: [ensureSlug('name')],
    beforeChange: [
      ({ data }) => {
        const isFilled = (v: unknown): boolean => {
          if (v === undefined || v === null || v === '') return false
          if (typeof v !== 'object') return true
          if ('root' in v) return /"text":"[^"]+/.test(JSON.stringify(v)) // Lexical rich text
          return Object.keys(v).length > 0
        }
        const filled = PROFILE_FIELDS.filter((f) => isFilled((data as Record<string, unknown>)[f])).length
        data.profileCompleteness = Math.round((filled / PROFILE_FIELDS.length) * 100)
        return data
      },
    ],
    afterChange: [revalidateAfterChange('people')],
    afterDelete: [revalidateAfterDelete('people')],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, localized: true, label: { bn: 'নাম', en: 'Name' } },
        {
          name: 'position',
          type: 'text',
          required: true,
          localized: true,
          label: { bn: 'পদবি', en: 'Position' },
        },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'group',
          type: 'select',
          required: true,
          defaultValue: 'executive',
          options: [
            { value: 'executive', label: { bn: 'কার্যকরী পরিষদ', en: 'Executive council' } },
            { value: 'sub-branch', label: { bn: 'হল/অনুষদ শাখা', en: 'Hall/faculty sub-branch' } },
            { value: 'former', label: { bn: 'সাবেক দায়িত্বশীল', en: 'Former leaders' } },
          ],
          label: { bn: 'বিভাগ', en: 'Group' },
        },
        {
          name: 'term',
          type: 'text',
          defaultValue: '২০২৬',
          label: { bn: 'সেশন/মেয়াদ', en: 'Term' },
        },
        {
          name: 'order',
          type: 'number',
          defaultValue: 100,
          label: { bn: 'ক্রম', en: 'Order' },
          admin: { description: 'Lower numbers appear first (সভাপতি = 0)' },
        },
      ],
    },
    { name: 'photo', type: 'upload', relationTo: 'media', label: { bn: 'ছবি', en: 'Photo' } },
    {
      type: 'row',
      fields: [
        { name: 'department', type: 'text', localized: true, label: { bn: 'বিভাগ', en: 'Department' } },
        { name: 'hall', type: 'text', localized: true, label: { bn: 'হল', en: 'Hall' } },
        { name: 'session', type: 'text', label: { bn: 'শিক্ষাবর্ষ', en: 'Session' } },
      ],
    },
    { name: 'bio', type: 'richText', localized: true, label: { bn: 'বার্তা/পরিচিতি', en: 'Message/bio' } },
    { name: 'email', type: 'email', label: { bn: 'ইমেইল (এহতেসাব/পরামর্শ)', en: 'Email (feedback)' } },
    {
      name: 'socials',
      type: 'group',
      label: { bn: 'সোশ্যাল', en: 'Social links' },
      fields: [
        {
          type: 'row',
          fields: ['facebook', 'instagram', 'x', 'youtube', 'telegram'].map((name) => ({
            name,
            type: 'text' as const,
          })),
        },
      ],
    },
    {
      name: 'profileCompleteness',
      type: 'number',
      admin: { readOnly: true, position: 'sidebar', description: 'Auto-calculated (%)' },
      label: { bn: 'প্রোফাইল পূর্ণতা %', en: 'Profile completeness %' },
    },
    bnSlugField('name'),
    legacyIdField,
  ],
}
