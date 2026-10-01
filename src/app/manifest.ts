import type { MetadataRoute } from 'next'

import { SITE } from '@/lib/site'

/** Installable app: opens like an app from the home screen and works offline for pages already read. */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: '/',
    name: SITE.name,
    short_name: 'চবি ছাত্রশিবির',
    description: SITE.description,
    lang: 'bn',
    dir: 'ltr',
    start_url: '/?source=pwa',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#f5f8fb',
    theme_color: '#ffffff',
    categories: ['education', 'news'],
    icons: [
      { src: '/icons/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icons/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'সর্বশেষ সংবাদ', url: '/news', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'শিক্ষার্থী সেবা', url: '/services', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
      { name: 'সমর্থক ফরম', url: '/join/supporter', icons: [{ src: '/icons/icon-192.png', sizes: '192x192' }] },
    ],
  }
}
