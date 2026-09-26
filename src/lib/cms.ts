import 'server-only'

import { unstable_cache } from 'next/cache'
import { getPayload } from 'payload'

import config from '@payload-config'

export type Locale = 'bn' | 'en'

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
