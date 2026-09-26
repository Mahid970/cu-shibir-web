import type { CollectionConfig } from 'payload'

import { canPublish, canWriteContent, hasRole, publishedOrStaff } from '@/access'
import { bnSlugField, legacyIdField, seoFields } from '@/fields/common'
import { ensureSlug } from '@/hooks/ensureSlug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'
import { POST_CATEGORIES } from '@/lib/taxonomy'

export const Posts: CollectionConfig = {
  slug: 'posts',
  labels: {
    singular: { bn: 'পোস্ট', en: 'Post' },
    plural: { bn: 'সংবাদ ও প্রকাশনা', en: 'News & publications' },
  },
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'category', 'publishedAt', '_status'],
    group: { bn: 'কনটেন্ট', en: 'Content' },
    listSearchableFields: ['title', 'excerpt'],
  },
  access: {
    read: publishedOrStaff,
    create: canWriteContent,
    update: canWriteContent,
    delete: canPublish,
  },
  versions: {
    drafts: { schedulePublish: true },
    maxPerDoc: 30,
  },
  defaultSort: '-publishedAt',
  hooks: {
    beforeValidate: [ensureSlug('title')],
    beforeChange: [
      // Contributors write drafts; only editors/admins can publish. (Trusted server-side
      // Local API calls — scripts, jobs — run without a user and are not restricted.)
      ({ data, req }) => {
        if (data._status === 'published' && req.user && !hasRole(req.user as never, 'admin', 'editor')) {
          data._status = 'draft'
        }
        return data
      },
    ],
    afterChange: [
      revalidateAfterChange('posts'),
      // Queue a Chromium-rendered Bangla share card when a post is published or its
      // title/category changes (Satori can't shape Bangla — docs/spikes/og-bangla.md).
      async ({ doc, previousDoc, context, req }) => {
        if (context.skipShareImage || doc._status !== 'published') return doc
        const changed =
          !doc.shareImage || doc.title !== previousDoc?.title || doc.category !== previousDoc?.category
        if (changed) {
          await req.payload.jobs.queue({ task: 'generateShareImage', input: { postId: doc.id }, req })
        }
        return doc
      },
    ],
    afterDelete: [revalidateAfterDelete('posts')],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      label: { bn: 'শিরোনাম', en: 'Title' },
    },
    {
      type: 'row',
      fields: [
        {
          name: 'category',
          type: 'select',
          required: true,
          defaultValue: 'news',
          options: POST_CATEGORIES.map((c) => ({ value: c.value, label: c.label })),
          label: { bn: 'ধরন', en: 'Category' },
        },
        {
          name: 'publishedAt',
          type: 'date',
          required: true,
          defaultValue: () => new Date().toISOString(),
          admin: { date: { pickerAppearance: 'dayAndTime' } },
          label: { bn: 'প্রকাশের তারিখ', en: 'Published at' },
        },
      ],
    },
    {
      name: 'excerpt',
      type: 'textarea',
      localized: true,
      maxLength: 320,
      label: { bn: 'সারসংক্ষেপ', en: 'Excerpt' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: { bn: 'প্রধান ছবি', en: 'Hero image' },
    },
    {
      name: 'content',
      type: 'richText',
      localized: true,
      label: { bn: 'বিস্তারিত', en: 'Content' },
    },
    {
      name: 'byline',
      type: 'group',
      label: { bn: 'লেখক', en: 'Byline' },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', localized: true, label: { bn: 'নাম', en: 'Name' } },
            {
              name: 'affiliation',
              type: 'text',
              localized: true,
              label: { bn: 'বিভাগ/সেশন', en: 'Department/session' },
            },
          ],
        },
      ],
    },
    { name: 'featured', type: 'checkbox', admin: { position: 'sidebar' }, label: { bn: 'হোমপেজে ফিচার', en: 'Feature on home' } },
    {
      name: 'shareImage',
      type: 'upload',
      relationTo: 'media',
      label: { bn: 'শেয়ার ছবি (স্বয়ংক্রিয়)', en: 'Share image (auto-generated)' },
      admin: { position: 'sidebar', readOnly: true, description: 'Generated on publish. Override in SEO → Share image.' },
    },
    bnSlugField('title'),
    legacyIdField,
    seoFields,
  ],
}
