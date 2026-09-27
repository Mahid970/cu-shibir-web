import type { GlobalConfig } from 'payload'

import { hasRole } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'
import { DAYS, TIME_RE } from '@/lib/services/shuttle'

const DAY_LABELS: Record<(typeof DAYS)[number], { bn: string; en: string }> = {
  sat: { bn: 'শনি', en: 'Sat' },
  sun: { bn: 'রবি', en: 'Sun' },
  mon: { bn: 'সোম', en: 'Mon' },
  tue: { bn: 'মঙ্গল', en: 'Tue' },
  wed: { bn: 'বুধ', en: 'Wed' },
  thu: { bn: 'বৃহস্পতি', en: 'Thu' },
  fri: { bn: 'শুক্র', en: 'Fri' },
}

/**
 * শাটল ট্রেনের সময়সূচি (plan §6.1). The public page only shows it once `published` is ticked, and
 * always says where the times come from. Editors and the service desk keep it up to date.
 */
export const Shuttle: GlobalConfig = {
  slug: 'shuttle',
  label: { bn: 'শাটল ট্রেনের সময়সূচি', en: 'Shuttle timetable' },
  admin: {
    group: { bn: 'শিক্ষার্থী সেবা', en: 'Student services' },
    description:
      'বিশ্ববিদ্যালয়ের পরিবহন দপ্তরের সর্বশেষ নোটিশ থেকে সময় লিখুন। ছুটি বা শাটল বন্ধের দিনগুলো "বন্ধের দিন"-এ যোগ করুন। সাইট নিজেই পরের ট্রেন আর কত মিনিট বাকি তা দেখায়।',
  },
  access: { read: () => true, update: ({ req }) => hasRole(req.user as never, 'admin', 'editor', 'service-desk') },
  hooks: { afterChange: [revalidateGlobal('shuttle')] },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'published', type: 'checkbox', defaultValue: false, label: { bn: 'সাইটে দেখাও', en: 'Show on the site' } },
        {
          name: 'effectiveFrom',
          type: 'date',
          label: { bn: 'যেদিন থেকে কার্যকর', en: 'In effect from' },
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
      ],
    },
    {
      name: 'source',
      type: 'text',
      localized: true,
      maxLength: 160,
      label: { bn: 'সময়ের উৎস', en: 'Source of the times' },
      admin: { description: 'যেমন: "পরিবহন দপ্তরের নোটিশ, ১২ সেপ্টেম্বর ২০২৬"। পাতায় দেখানো হয়।' },
      validate: (value: unknown, { siblingData }: { siblingData: { published?: boolean } }) =>
        siblingData?.published && !value ? 'সাইটে দেখানোর আগে সময়ের উৎস লিখুন।' : true,
    },
    {
      name: 'stations',
      type: 'array',
      label: { bn: 'স্টেশন (শহর থেকে ক্যাম্পাসের দিকে, ক্রমানুসারে)', en: 'Stations (city to campus, in order)' },
      labels: { singular: { bn: 'স্টেশন', en: 'Station' }, plural: { bn: 'স্টেশন', en: 'Stations' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, localized: true, label: { bn: 'নাম', en: 'Name' } },
            {
              name: 'minutes',
              type: 'number',
              min: 0,
              max: 180,
              label: { bn: 'প্রথম স্টেশন থেকে মিনিট', en: 'Minutes from the first station' },
            },
          ],
        },
      ],
    },
    {
      name: 'trips',
      type: 'array',
      label: { bn: 'ট্রেন', en: 'Trains' },
      labels: { singular: { bn: 'ট্রেন', en: 'Train' }, plural: { bn: 'ট্রেন', en: 'Trains' } },
      admin: { initCollapsed: true },
      fields: [
        {
          type: 'row',
          fields: [
            {
              name: 'direction',
              type: 'select',
              required: true,
              defaultValue: 'to-campus',
              options: [
                { value: 'to-campus', label: { bn: 'শহর → ক্যাম্পাস', en: 'City → campus' } },
                { value: 'to-city', label: { bn: 'ক্যাম্পাস → শহর', en: 'Campus → city' } },
              ],
              label: { bn: 'দিক', en: 'Direction' },
            },
            {
              name: 'time',
              type: 'text',
              required: true,
              label: { bn: 'ছাড়ার সময় (২৪ ঘণ্টা, যেমন 07:30)', en: 'Leaves at (24-hour, e.g. 07:30)' },
              validate: (value: unknown) => (typeof value === 'string' && TIME_RE.test(value) ? true : '২৪ ঘণ্টার HH:MM লিখুন, যেমন 07:30 বা 16:45'),
            },
          ],
        },
        {
          name: 'days',
          type: 'select',
          hasMany: true,
          required: true,
          defaultValue: ['sat', 'sun', 'mon', 'tue', 'wed', 'thu'],
          options: (['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'] as const).map((d) => ({ value: d, label: DAY_LABELS[d] })),
          label: { bn: 'যেসব দিনে চলে', en: 'Runs on' },
        },
        { name: 'note', type: 'text', localized: true, maxLength: 80, label: { bn: 'নোট', en: 'Note' }, admin: { description: 'যেমন: "শুধু ছাত্রীদের বগি আছে"' } },
      ],
    },
    {
      name: 'closures',
      type: 'array',
      label: { bn: 'বন্ধের দিন', en: 'Days without service' },
      labels: { singular: { bn: 'বন্ধ', en: 'Closure' }, plural: { bn: 'বন্ধের দিন', en: 'Closures' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'from', type: 'date', required: true, label: { bn: 'থেকে', en: 'From' }, admin: { date: { pickerAppearance: 'dayOnly' } } },
            { name: 'to', type: 'date', required: true, label: { bn: 'পর্যন্ত', en: 'To' }, admin: { date: { pickerAppearance: 'dayOnly' } } },
          ],
        },
        { name: 'reason', type: 'text', localized: true, maxLength: 120, label: { bn: 'কারণ', en: 'Reason' } },
      ],
    },
    {
      name: 'notice',
      type: 'textarea',
      localized: true,
      maxLength: 400,
      label: { bn: 'বিশেষ নোটিশ', en: 'Notice' },
      admin: { description: 'পাতার উপরে দেখানো হয়, যেমন সময়সূচি বদলের খবর।' },
    },
  ],
}
