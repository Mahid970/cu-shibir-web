import type { MetadataRoute } from 'next'

import { SYLLABUS_KEYS } from '@/content/syllabus'
import { localePath } from '@/i18n/config'
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
  { path: '/services/issues', priority: 0.7, freq: 'weekly' },
  { path: '/services/issues/report', priority: 0.6, freq: 'yearly' },
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

type Entry = { path: string; priority: number; freq: 'daily' | 'weekly' | 'monthly' | 'yearly'; lastModified?: string }

/** Each page twice, Bangla and English, each pointing at the other (hreflang). */
function both({ path, priority, freq, lastModified }: Entry): MetadataRoute.Sitemap {
  const languages = { 'bn-BD': absoluteUrl(path), en: absoluteUrl(localePath('en', path)) }
  return (['bn', 'en'] as const).map((lang) => ({
    url: absoluteUrl(localePath(lang, path)),
    lastModified,
    changeFrequency: freq,
    // The English copy of a page is a translation of the interface; the Bangla one comes first.
    priority: lang === 'bn' ? priority : Math.round(priority * 6) / 10,
    alternates: { languages },
  }))
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, albums, people, martyrs] = await Promise.all([getAllPostSlugs(), getAllAlbumSlugs(), getAllPeopleSlugs(), getMartyrs('bn')])
  const entries: Entry[] = [
    ...PAGES.map((p) => ({ path: p.path, priority: p.priority, freq: p.freq })),
    ...SYLLABUS_KEYS.map((key) => ({ path: `/syllabus/${key}`, freq: 'yearly' as const, priority: 0.5 })),
    ...(martyrs.length ? [{ path: '/martyrs', freq: 'yearly' as const, priority: 0.6 }] : []),
    ...posts.filter((p) => p.slug).map((p) => ({ path: `/news/${p.slug}`, lastModified: p.updatedAt, freq: 'monthly' as const, priority: 0.7 })),
    ...albums.filter((a) => a.slug).map((a) => ({ path: `/gallery/${a.slug}`, lastModified: a.updatedAt, freq: 'yearly' as const, priority: 0.4 })),
    // Only filled-in profiles; empty ones are noindex.
    ...people
      .filter((p) => p.slug && (p.profileCompleteness ?? 0) >= 50)
      .map((p) => ({ path: `/leadership/${p.slug}`, lastModified: p.updatedAt, freq: 'monthly' as const, priority: 0.5 })),
  ]
  return entries.flatMap(both)
}
