import type { CollectionConfig } from 'payload'

import { canPublish, publishedOrStaff } from '@/access'
import { bnSlugField } from '@/fields/common'
import { ensureSlug } from '@/hooks/ensureSlug'
import { revalidateAfterChange, revalidateAfterDelete } from '@/hooks/revalidate'

/**
 * শহীদ স্মরণ: the martyrs of the CU branch. Published entries appear in the shaheed journey (home and
 * /martyrs) and each has its own page (/martyrs/[slug]). The /martyrs page stays hidden while none is
 * published. Seeded by `npm run seed:shaheeds` from scripts/data/shaheeds.json.
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
    {
      type: 'row',
      fields: [
        { name: 'number', type: 'number', label: { bn: 'শাহাদাত ক্রম', en: 'Martyr number' }, admin: { description: 'কেন্দ্রীয় শহীদ তালিকার ক্রম' } },
        {
          name: 'rank',
          type: 'select',
          label: { bn: 'সাংগঠনিক মান', en: 'Level' },
          options: [
            { label: { bn: 'কর্মী', en: 'Worker' }, value: 'kormi' },
            { label: { bn: 'সাথী', en: 'Associate' }, value: 'sathi' },
            { label: { bn: 'সদস্য', en: 'Member' }, value: 'sodossho' },
          ],
        },
        { name: 'role', type: 'text', localized: true, label: { bn: 'দায়িত্ব', en: 'Responsibility' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'hall', type: 'text', localized: true, label: { bn: 'হল', en: 'Hall' } },
        { name: 'home', type: 'text', localized: true, label: { bn: 'বাড়ি', en: 'Home' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'born', type: 'text', localized: true, label: { bn: 'জন্ম', en: 'Born' } },
        { name: 'family', type: 'text', localized: true, label: { bn: 'পরিবার', en: 'Family' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'attackers', type: 'text', localized: true, label: { bn: 'যাদের হামলায় শহীদ', en: 'Killed by' } },
        { name: 'wounds', type: 'text', localized: true, label: { bn: 'আঘাতের ধরন', en: 'How he was attacked' } },
      ],
    },
    { name: 'summary', type: 'textarea', localized: true, maxLength: 400, label: { bn: 'সংক্ষিপ্ত পরিচিতি', en: 'Short note' } },
    {
      type: 'row',
      fields: [
        { name: 'quote', type: 'textarea', localized: true, label: { bn: 'স্মরণীয় কথা', en: 'Words to remember' } },
        { name: 'quoteBy', type: 'text', localized: true, label: { bn: 'যিনি বলেছেন', en: 'Said by' } },
      ],
    },
    {
      name: 'story',
      type: 'array',
      localized: true,
      label: { bn: 'গল্প (অংশে অংশে)', en: 'Story (in parts)' },
      labels: { singular: { bn: 'অংশ', en: 'Part' }, plural: { bn: 'অংশ', en: 'Parts' } },
      admin: { description: 'প্রতিটি অংশের একটি শিরোনাম ও লেখা; ফাঁকা লাইন দিয়ে অনুচ্ছেদ আলাদা করুন।' },
      fields: [
        { name: 'heading', type: 'text', required: true, label: { bn: 'শিরোনাম', en: 'Heading' } },
        { name: 'text', type: 'textarea', required: true, label: { bn: 'লেখা', en: 'Text' } },
      ],
    },
    { name: 'bio', type: 'richText', localized: true, label: { bn: 'আরও লেখা', en: 'More text' } },
    { name: 'photo', type: 'upload', relationTo: 'media', label: { bn: 'প্রতিকৃতি', en: 'Portrait' } },
    {
      name: 'gallery',
      type: 'array',
      label: { bn: 'ছবি', en: 'Photos' },
      labels: { singular: { bn: 'ছবি', en: 'Photo' }, plural: { bn: 'ছবি', en: 'Photos' } },
      admin: { description: 'ক্যাপশন ও কৃতজ্ঞতা মিডিয়াতেই লিখুন। কষ্টদায়ক ছবি চিহ্নিত করলে পাতায় ঝাপসা থাকে, ক্লিক করলে দেখা যায়।' },
      fields: [
        { name: 'photo', type: 'upload', relationTo: 'media', required: true, label: { bn: 'ছবি', en: 'Photo' } },
        {
          type: 'row',
          fields: [
            {
              name: 'kind',
              type: 'select',
              defaultValue: 'life',
              label: { bn: 'ধরন', en: 'Kind' },
              options: [
                { label: { bn: 'জীবন', en: 'Life' }, value: 'life' },
                { label: { bn: 'শাহাদাতের দিন', en: 'The day' }, value: 'day' },
                { label: { bn: 'পরবর্তী', en: 'Afterwards' }, value: 'after' },
                { label: { bn: 'স্থান', en: 'Place' }, value: 'place' },
              ],
            },
            { name: 'graphic', type: 'checkbox', label: { bn: 'কষ্টদায়ক দৃশ্য', en: 'Graphic' } },
          ],
        },
      ],
    },
    {
      name: 'sources',
      type: 'array',
      label: { bn: 'তথ্যসূত্র', en: 'Sources' },
      fields: [
        { name: 'label', type: 'text', required: true, label: { bn: 'নাম', en: 'Name' } },
        { name: 'url', type: 'text', label: { bn: 'লিংক', en: 'Link' } },
      ],
    },
    bnSlugField('name'),
  ],
}
