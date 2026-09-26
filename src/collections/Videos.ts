import type { CollectionConfig } from 'payload'

import { canPublish, publishedOrStaff } from '@/access'
import { legacyIdField } from '@/fields/common'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

const YOUTUBE_ID = /^[A-Za-z0-9_-]{11}$/

/** Accepts a full YouTube URL or a bare id and stores the 11-char id. */
export function parseYouTubeId(input: string): string | null {
  const trimmed = input.trim()
  if (YOUTUBE_ID.test(trimmed)) return trimmed
  try {
    const url = new URL(trimmed)
    const id =
      url.hostname === 'youtu.be'
        ? url.pathname.slice(1)
        : (url.searchParams.get('v') ?? url.pathname.split('/').filter(Boolean).pop() ?? '')
    return YOUTUBE_ID.test(id) ? id : null
  } catch {
    return null
  }
}

export const Videos: CollectionConfig = {
  slug: 'videos',
  labels: { singular: { bn: 'ভিডিও', en: 'Video' }, plural: { bn: 'ভিডিও', en: 'Videos' } },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'youtubeId', 'publishedAt', '_status'],
    group: { bn: 'কনটেন্ট', en: 'Content' },
  },
  access: { read: publishedOrStaff, create: canPublish, update: canPublish, delete: canPublish },
  versions: { drafts: true, maxPerDoc: 5 },
  defaultSort: '-publishedAt',
  hooks: {
    afterChange: [revalidateAfterChange('videos')],
    afterDelete: [revalidateAfterDelete('videos')],
  },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true, label: { bn: 'শিরোনাম', en: 'Title' } },
    {
      name: 'youtubeId',
      type: 'text',
      required: true,
      label: { bn: 'ইউটিউব লিংক বা আইডি', en: 'YouTube URL or id' },
      hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? (parseYouTubeId(value) ?? value) : value)] },
      validate: (v: unknown) => (typeof v === 'string' && YOUTUBE_ID.test(v)) || 'Not a valid YouTube video',
    },
    {
      name: 'publishedAt',
      type: 'date',
      required: true,
      defaultValue: () => new Date().toISOString(),
      label: { bn: 'তারিখ', en: 'Date' },
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' } },
    legacyIdField,
  ],
}
