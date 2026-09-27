import type { GlobalConfig } from 'payload'

import { hasRole } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

/** নবীন গাইড: campus phone numbers the branch has checked. Shown on /services/freshers. */
export const Freshers: GlobalConfig = {
  slug: 'freshers',
  label: { bn: 'নবীন গাইড', en: 'Freshers’ guide' },
  admin: {
    group: { bn: 'শিক্ষার্থী সেবা', en: 'Student services' },
    description: 'শুধু যাচাই করা নম্বর দিন (যেমন প্রক্টর অফিস, চিকিৎসা কেন্দ্র, নিরাপত্তা দপ্তর)। জাতীয় জরুরি সেবা ৯৯৯ পাতায় আগে থেকেই আছে।',
  },
  access: { read: () => true, update: ({ req }) => hasRole(req.user as never, 'admin', 'editor', 'service-desk') },
  hooks: { afterChange: [revalidateGlobal('freshers')] },
  fields: [
    {
      name: 'contacts',
      type: 'array',
      label: { bn: 'জরুরি যোগাযোগ', en: 'Emergency contacts' },
      labels: { singular: { bn: 'নম্বর', en: 'Contact' }, plural: { bn: 'নম্বর', en: 'Contacts' } },
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'name', type: 'text', required: true, localized: true, label: { bn: 'কার নম্বর', en: 'Who' } },
            {
              name: 'phone',
              type: 'text',
              required: true,
              label: { bn: 'নম্বর', en: 'Number' },
              validate: (v: unknown) => (typeof v === 'string' && /^\+?[0-9 -]{3,20}$/.test(v) ? true : 'শুধু সংখ্যা, স্পেস বা - দিয়ে নম্বর লিখুন'),
            },
          ],
        },
        { name: 'note', type: 'text', localized: true, maxLength: 100, label: { bn: 'নোট', en: 'Note' }, admin: { description: 'যেমন: "রাত ১০টা পর্যন্ত"' } },
      ],
    },
  ],
}
