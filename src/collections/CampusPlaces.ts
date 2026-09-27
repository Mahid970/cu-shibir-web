import type { CollectionConfig } from 'payload'

import { hasRole } from '@/access'
import { purge } from '@/hooks/revalidate'

export const PLACE_CATEGORIES = [
  { value: 'faculty', label: { bn: 'অনুষদ ও ইনস্টিটিউট', en: 'Faculties and institutes' } },
  { value: 'hall', label: { bn: 'হল', en: 'Halls' } },
  { value: 'study', label: { bn: 'পড়াশোনা', en: 'Study' } },
  { value: 'health', label: { bn: 'চিকিৎসা', en: 'Health' } },
  { value: 'mosque', label: { bn: 'মসজিদ', en: 'Mosques' } },
  { value: 'transport', label: { bn: 'যাতায়াত', en: 'Transport' } },
  { value: 'office', label: { bn: 'দপ্তর ও সেবা', en: 'Offices and services' } },
  { value: 'open', label: { bn: 'মাঠ ও বাগান', en: 'Fields and gardens' } },
] as const

/** Places on the freshers' campus map. Seeded from OpenStreetMap (scripts/data/campus-places.json). */
export const CampusPlaces: CollectionConfig = {
  slug: 'campus-places',
  labels: {
    singular: { bn: 'ক্যাম্পাসের জায়গা', en: 'Campus place' },
    plural: { bn: 'ক্যাম্পাস ম্যাপ', en: 'Campus map' },
  },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'category', 'lat', 'lng'],
    group: { bn: 'শিক্ষার্থী সেবা', en: 'Student services' },
    description:
      'নবীন গাইডের ম্যাপে দেখানো জায়গা। অবস্থান পেতে Google Maps বা OpenStreetMap-এ জায়গাটির ওপর চাপ দিয়ে অক্ষাংশ (lat) ও দ্রাঘিমাংশ (lng) কপি করুন।',
  },
  access: {
    read: () => true,
    create: ({ req }) => hasRole(req.user as never, 'admin', 'editor', 'service-desk'),
    update: ({ req }) => hasRole(req.user as never, 'admin', 'editor', 'service-desk'),
    delete: ({ req }) => hasRole(req.user as never, 'admin', 'editor', 'service-desk'),
  },
  defaultSort: 'category',
  fields: [
    { name: 'key', type: 'text', unique: true, index: true, admin: { position: 'sidebar', description: 'Seed key (optional)' } },
    {
      type: 'row',
      fields: [
        { name: 'name', type: 'text', required: true, localized: true, label: { bn: 'নাম', en: 'Name' } },
        { name: 'category', type: 'select', required: true, index: true, options: PLACE_CATEGORIES.map((c) => ({ ...c })), label: { bn: 'ধরন', en: 'Category' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'lat', type: 'number', required: true, min: 22.4, max: 22.55, label: { bn: 'অক্ষাংশ (lat)', en: 'Latitude' } },
        { name: 'lng', type: 'number', required: true, min: 91.72, max: 91.85, label: { bn: 'দ্রাঘিমাংশ (lng)', en: 'Longitude' } },
      ],
    },
    { name: 'note', type: 'text', localized: true, maxLength: 160, label: { bn: 'নোট', en: 'Note' } },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await purge(['campus-places'])
      },
    ],
    afterDelete: [
      async ({ context }) => {
        if (!context.disableRevalidate) await purge(['campus-places'])
      },
    ],
  },
}
