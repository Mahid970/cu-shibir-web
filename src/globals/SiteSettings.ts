import type { GlobalConfig } from 'payload'

import { isAdmin } from '@/access'
import { revalidateGlobal } from '@/hooks/revalidate'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  label: { bn: 'সাইট সেটিংস', en: 'Site settings' },
  admin: { group: { bn: 'প্রশাসন', en: 'Administration' } },
  access: { read: () => true, update: isAdmin },
  hooks: { afterChange: [revalidateGlobal('site-settings')] },
  fields: [
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      defaultValue: 'আমরা তরুণ, আমরাই পারি',
      label: { bn: 'স্লোগান', en: 'Tagline' },
    },
    {
      name: 'heroIntro',
      type: 'textarea',
      localized: true,
      defaultValue:
        'সৎ, দক্ষ ও দেশপ্রেমিক নাগরিক গড়ার লক্ষ্যে চট্টগ্রাম বিশ্ববিদ্যালয়ের শিক্ষার্থীদের পাশে — ক্লাসে, হলে, শাটলে, আন্দোলনে।',
      label: { bn: 'হিরো ভূমিকা', en: 'Hero intro' },
      admin: { description: 'Wrap words in **double asterisks** to highlight them in blue.' },
    },
    {
      name: 'heroImage',
      type: 'upload',
      relationTo: 'media',
      label: { bn: 'হিরো ছবি', en: 'Hero photo' },
      admin: { description: 'The large photo on the homepage. A wide photo of students works best.' },
    },
    {
      name: 'heroGallery',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      maxRows: 2,
      label: { bn: 'হিরোর ছোট ছবি (২টি)', en: 'Hero side photos (2)' },
      admin: { description: 'Two smaller event photos that float beside the main photo. Falls back to recent albums.' },
    },
    {
      name: 'stats',
      type: 'array',
      label: { bn: 'পরিসংখ্যান (হোমপেজ)', en: 'Homepage stats' },
      maxRows: 6,
      fields: [
        {
          type: 'row',
          fields: [
            { name: 'value', type: 'number', required: true },
            { name: 'suffix', type: 'text', admin: { description: 'e.g. "+", "/২৬"' } },
            { name: 'label', type: 'text', required: true, localized: true },
          ],
        },
      ],
    },
    {
      name: 'contact',
      type: 'group',
      label: { bn: 'যোগাযোগ', en: 'Contact' },
      fields: [
        { name: 'email', type: 'email', defaultValue: 'cuchhatrashibir@gmail.com' },
        { name: 'address', type: 'text', localized: true },
      ],
    },
    {
      name: 'socials',
      type: 'group',
      label: { bn: 'সোশ্যাল মিডিয়া', en: 'Social media' },
      fields: [
        { name: 'facebook', type: 'text', defaultValue: 'https://www.facebook.com/cushibir' },
        { name: 'x', type: 'text', defaultValue: 'https://x.com/CUshibir77' },
        { name: 'instagram', type: 'text', defaultValue: 'https://www.instagram.com/cuchhatrashibir/' },
        { name: 'youtube', type: 'text', defaultValue: 'https://www.youtube.com/@CuShibir777' },
        { name: 'telegram', type: 'text', defaultValue: 'https://t.me/cushibir' },
      ],
    },
  ],
}
