import type { CollectionConfig } from 'payload'

import { canWriteContent } from '@/access'

export const Media: CollectionConfig = {
  slug: 'media',
  labels: {
    singular: { bn: 'মিডিয়া', en: 'Media' },
    plural: { bn: 'মিডিয়া', en: 'Media' },
  },
  admin: { group: { bn: 'কনটেন্ট', en: 'Content' } },
  access: {
    read: () => true,
    create: canWriteContent,
    update: canWriteContent,
    delete: canWriteContent,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      localized: true,
      label: { bn: 'বিকল্প লেখা (ছবির বর্ণনা)', en: 'Alt text' },
    },
    { name: 'caption', type: 'text', localized: true, label: { bn: 'ক্যাপশন', en: 'Caption' } },
    { name: 'credit', type: 'text', label: { bn: 'ছবি: কৃতজ্ঞতা', en: 'Photo credit' } },
    {
      name: 'sourceUrl',
      type: 'text',
      admin: { readOnly: true, position: 'sidebar', description: 'Original URL (legacy import)' },
    },
  ],
  upload: {
    // Originals are kept; the site always serves resized WebP/AVIF through next/image.
    mimeTypes: ['image/*'],
    focalPoint: true,
    formatOptions: { format: 'webp', options: { quality: 82 } },
    imageSizes: [
      { name: 'thumb', width: 400, formatOptions: { format: 'webp', options: { quality: 75 } } },
      { name: 'card', width: 800, formatOptions: { format: 'webp', options: { quality: 78 } } },
      { name: 'hero', width: 1600, formatOptions: { format: 'webp', options: { quality: 80 } } },
      {
        name: 'og',
        width: 1200,
        height: 630,
        position: 'centre',
        formatOptions: { format: 'jpeg', options: { quality: 82 } },
      },
    ],
    adminThumbnail: 'thumb',
  },
}
