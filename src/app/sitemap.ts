import type { MetadataRoute } from 'next'

import { SYLLABUS } from '@/content/syllabus'
import { getAllAlbumSlugs, getAllPeopleSlugs, getAllPostSlugs, getMartyrs } from '@/lib/cms'
import { absoluteUrl } from '@/lib/site'

export const revalidate = 3600

/** Static pages worth indexing (form result and tracking pages are left out on purpose). */
const PAGES: { path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' | 'yearly' }[] = [
  { path: '/', priority: 1, freq: 'daily' },
  { path: '/news', priority: 0.9, freq: 'daily' },
  { path: '/about', priority: 0.8, freq: 'monthly' },
  { path: '/leadership', priority: 0.8, freq: 'monthly' },
  { path: '/services', priority: 0.8, freq: 'weekly' },
  { path: '/services/assistance', priority: 0.7, freq: 'monthly' },
  { path: '/services/campus', priority: 0.7, freq: 'monthly' },
  { path: '/join', priority: 0.7, freq: 'monthly' },
  { path: '/join/supporter', priority: 0.6, freq: 'yearly' },
  { path: '/join/feedback', priority: 0.5, freq: 'yearly' },
  { path: '/gallery', priority: 0.6, freq: 'weekly' },
  { path: '/videos', priority: 0.6, freq: 'weekly' },
  { path: '/press', priority: 0.6, freq: 'weekly' },
  { path: '/events', priority: 0.5, freq: 'weekly' },
  { path: '/syllabus', priority: 0.5, freq: 'monthly' },
  { path: '/privacy', priority: 0.2, freq: 'yearly' },
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, albums, people, martyrs] = await Promise.all([getAllPostSlugs(), getAllAlbumSlugs(), getAllPeopleSlugs(), getMartyrs('bn')])
  return [
    ...PAGES.map((p) => ({
      url: absoluteUrl(p.path),
      changeFrequency: p.freq,
      priority: p.priority,
      ...(p.path === '/' && { alternates: { languages: { 'bn-BD': absoluteUrl('/'), en: absoluteUrl('/en') } } }),
    })),
    ...SYLLABUS.map((l) => ({ url: absoluteUrl(`/syllabus/${l.key}`), changeFrequency: 'yearly' as const, priority: 0.5 })),
    ...(martyrs.length ? [{ url: absoluteUrl('/martyrs'), changeFrequency: 'yearly' as const, priority: 0.6 }] : []),
    { url: absoluteUrl('/en'), changeFrequency: 'monthly', priority: 0.6, alternates: { languages: { 'bn-BD': absoluteUrl('/'), en: absoluteUrl('/en') } } },
    ...posts.filter((p) => p.slug).map((p) => ({ url: absoluteUrl(`/news/${p.slug}`), lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...albums.filter((a) => a.slug).map((a) => ({ url: absoluteUrl(`/gallery/${a.slug}`), lastModified: a.updatedAt, changeFrequency: 'yearly' as const, priority: 0.4 })),
    // Only filled-in profiles; empty ones are noindex.
    ...people
      .filter((p) => p.slug && (p.profileCompleteness ?? 0) >= 50)
      .map((p) => ({ url: absoluteUrl(`/leadership/${p.slug}`), lastModified: p.updatedAt, changeFrequency: 'monthly' as const, priority: 0.5 })),
  ]
}
