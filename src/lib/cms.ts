import 'server-only'

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@payload-config'

import type { Locale } from '@/i18n/config'
import { BLOOD_GROUPS, eligible, GROUP_VALUES } from '@/lib/services/blood'
import { summarise } from '@/lib/services/issueStats'

export type { Locale }

export const getPayloadClient = () => getPayload({ config })

/** Cached read tagged for on-demand revalidation (see hooks/revalidate.ts). */
function cached<A extends unknown[], R>(fn: (...args: A) => Promise<R>, key: string, tags: string[]) {
  return unstable_cache(fn, [key], { tags, revalidate: 3600 })
}

export const getSiteSettings = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'site-settings', locale, depth: 1 })
  },
  'site-settings',
  ['site-settings'],
)

export const getLatestPosts = cached(
  async (limit: number = 7, locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      locale,
      limit,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      depth: 1,
      select: { title: true, slug: true, excerpt: true, category: true, publishedAt: true, heroImage: true },
    })
    return docs
  },
  'latest-posts',
  ['posts'],
)

export const getPostBySlug = (slug: string, locale: Locale = 'bn') =>
  cached(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'posts',
        locale,
        limit: 1,
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        depth: 1,
      })
      return docs[0] ?? null
    },
    `post:${slug}:${locale}`,
    ['posts', `posts:${slug}`],
  )()

export const getLeaders = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'people',
      locale,
      limit: 100,
      sort: 'order',
      where: { and: [{ _status: { equals: 'published' } }, { group: { equals: 'executive' } }] },
      depth: 1,
    })
    return docs
  },
  'leaders',
  ['people'],
)

export const getPressCoverage = cached(
  async (limit: number = 6) => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'press-coverage',
      limit,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      depth: 0,
    })
    return docs
  },
  'press',
  ['press'],
)

export const getPostsPage = (opts: { category?: string; page?: number; limit?: number; locale?: Locale }) => {
  const { category, page = 1, limit = 12, locale = 'bn' } = opts
  return cached(
    async () => {
      const payload = await getPayloadClient()
      return payload.find({
        collection: 'posts',
        locale,
        page,
        limit,
        sort: '-publishedAt',
        where: {
          and: [{ _status: { equals: 'published' } }, ...(category ? [{ category: { equals: category } }] : [])],
        },
        depth: 1,
        select: { title: true, slug: true, excerpt: true, category: true, publishedAt: true, heroImage: true },
      })
    },
    `posts-page:${category ?? 'all'}:${page}:${limit}:${locale}`,
    ['posts'],
  )()
}

export const getAllPostSlugs = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      limit: 1000,
      where: { _status: { equals: 'published' } },
      depth: 0,
      select: { slug: true, updatedAt: true },
    })
    return docs
  },
  'post-slugs',
  ['posts'],
)

/** Most recent public statement / press conference — shown in the strip under the hero. */
export const getLatestStatement = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      locale,
      limit: 1,
      sort: '-publishedAt',
      where: {
        and: [{ _status: { equals: 'published' } }, { category: { in: ['statement', 'press-conference'] } }],
      },
      depth: 0,
      select: { title: true, slug: true, category: true, publishedAt: true },
    })
    return docs[0] ?? null
  },
  'latest-statement',
  ['posts'],
)

export const getAlbums = cached(
  async (limit: number = 5, locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'albums',
      locale,
      limit,
      sort: '-date',
      where: { _status: { equals: 'published' } },
      depth: 1,
    })
    return docs
  },
  'albums',
  ['albums'],
)


export const getVideos = cached(
  async (limit: number = 3, locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'videos',
      locale,
      limit,
      sort: ['-featured', '-publishedAt'],
      where: { _status: { equals: 'published' } },
      depth: 0,
    })
    return docs
  },
  'videos',
  ['videos'],
)

export const getAlbumBySlug = (slug: string, locale: Locale = 'bn') =>
  cached(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'albums',
        locale,
        limit: 1,
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        depth: 1,
      })
      return docs[0] ?? null
    },
    `album:${slug}:${locale}`,
    ['albums', `albums:${slug}`],
  )()

export const getAllAlbumSlugs = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'albums',
      limit: 1000,
      where: { _status: { equals: 'published' } },
      depth: 0,
      select: { slug: true, updatedAt: true },
    })
    return docs
  },
  'album-slugs',
  ['albums'],
)

export const getAllVideos = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'videos',
      locale,
      limit: 200,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      depth: 0,
    })
    return docs
  },
  'all-videos',
  ['videos'],
)

export const getAllPress = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'press-coverage',
      limit: 500,
      sort: '-publishedAt',
      where: { _status: { equals: 'published' } },
      depth: 0,
    })
    return docs
  },
  'all-press',
  ['press'],
)

export const getPersonBySlug = (slug: string, locale: Locale = 'bn') =>
  cached(
    async () => {
      const payload = await getPayloadClient()
      const { docs } = await payload.find({
        collection: 'people',
        locale,
        limit: 1,
        where: { and: [{ slug: { equals: slug } }, { _status: { equals: 'published' } }] },
        depth: 1,
      })
      return docs[0] ?? null
    },
    `person:${slug}:${locale}`,
    ['people', `people:${slug}`],
  )()

export const getAllPeopleSlugs = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'people',
      limit: 1000,
      where: { _status: { equals: 'published' } },
      depth: 0,
      select: { slug: true, updatedAt: true, profileCompleteness: true },
    })
    return docs
  },
  'people-slugs',
  ['people'],
)

export const getMartyrs = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'martyrs',
      locale,
      limit: 500,
      sort: 'order',
      where: { _status: { equals: 'published' } },
      depth: 1,
    })
    return docs
  },
  'martyrs',
  ['martyrs'],
)

/** Public issues-desk figures, recomputed when an issue changes (tag `issues`) or hourly. */
export const getIssueStats = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'issues',
      pagination: false,
      depth: 0,
      overrideAccess: true,
      where: { status: { not_equals: 'spam' } },
      select: { category: true, status: true, createdAt: true, resolvedAt: true },
    })
    return summarise(docs)
  },
  'issue-stats',
  ['issues'],
)

/** শাটল ট্রেনের সময়সূচি (purged on save via the `shuttle` tag). */
export const getShuttle = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    return payload.findGlobal({ slug: 'shuttle', locale, depth: 0 })
  },
  'shuttle',
  ['shuttle'],
)

/** Donors on the list per blood group, and how many could give today. Counts only. */
export const getBloodStats = cached(
  async () => {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'blood-donors',
      pagination: false,
      depth: 0,
      overrideAccess: true,
      where: { available: { equals: true } },
      select: { bloodGroup: true, lastDonation: true },
    })
    const now = new Date()
    return {
      total: docs.length,
      groups: BLOOD_GROUPS.map((group) => {
        const mine = docs.filter((d) => d.bloodGroup === GROUP_VALUES[group])
        return { group, donors: mine.length, ready: mine.filter((d) => eligible(d.lastDonation, now)).length }
      }),
    }
  },
  'blood-stats',
  ['blood'],
)

/** Approved question papers, newest exams first, filtered by department and course code/title. */
export const getPapers = (opts: { department?: string; q?: string }) => {
  const { department, q } = opts
  return cached(
    async () => {
      const payload = await getPayloadClient()
      const { docs, totalDocs } = await payload.find({
        collection: 'question-papers',
        limit: 200,
        depth: 0,
        sort: ['courseCode', '-examYear'],
        where: {
          and: [
            { status: { equals: 'approved' } },
            ...(department ? [{ department: { equals: department } }] : []),
            ...(q ? [{ or: [{ courseCode: { like: q } }, { courseTitle: { like: q } }] }] : []),
          ],
        },
        select: { department: true, courseCode: true, courseTitle: true, examYear: true, exam: true, level: true, url: true, mimeType: true, filesize: true },
      })
      return { docs, totalDocs }
    },
    `papers:${department ?? ''}:${q ?? ''}`,
    ['questions'],
  )()
}

/** The freshers' page: checked campus phone numbers and the map's places. */
export const getFreshers = cached(
  async (locale: Locale = 'bn') => {
    const payload = await getPayloadClient()
    const [guide, places] = await Promise.all([
      payload.findGlobal({ slug: 'freshers', locale, depth: 0 }),
      payload.find({ collection: 'campus-places', locale, pagination: false, depth: 0, sort: 'category' }),
    ])
    return { contacts: guide.contacts ?? [], places: places.docs.map(({ id, name, category, lat, lng, note }) => ({ id, name, category, lat, lng, note })) }
  },
  'freshers',
  ['freshers', 'campus-places'],
)
