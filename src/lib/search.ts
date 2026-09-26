import 'server-only'

import { unstable_cache } from 'next/cache'

import type { Locale } from '@/i18n/config'
import { date } from '@/i18n/format'

import { FACULTIES, HALLS, optionLabel } from './campus'
import { getPayloadClient } from './cms'
import { personName, personPosition } from './people'
import { outletName } from './press'
import { normalizeForSearch, snippet } from './searchText'
import { categoryLabel } from './taxonomy'

export type SearchKind = 'post' | 'person' | 'album' | 'video' | 'press' | 'page'

/** A result. `href` is the Bangla (root) path; links add /en on English pages. */
export type SearchHit = {
  kind: SearchKind
  title: string
  href: string
  meta?: string
  excerpt?: string
  external?: boolean
}

export const KIND_LABELS: Record<Locale, Record<SearchKind, string>> = {
  bn: {
    post: 'সংবাদ ও প্রকাশনা',
    person: 'দায়িত্বশীল',
    album: 'গ্যালারি',
    video: 'ভিডিও',
    press: 'মিডিয়ায় আমরা',
    page: 'পাতা ও সেবা',
  },
  en: {
    post: 'News and publications',
    person: 'Leaders',
    album: 'Gallery',
    video: 'Videos',
    press: 'In the media',
    page: 'Pages and services',
  },
}

/**
 * Pages and services people look for by name (and by what they call them). The words cover both
 * languages, so either finds the page on either site.
 */
const PAGES: { title: Record<Locale, string>; href: string; words: string }[] = [
  { title: { bn: 'সমর্থক ফরম', en: 'Supporter form' }, href: '/join/supporter', words: 'সমর্থক হোন যুক্ত হতে চাই ফরম সদস্য কর্মী join supporter member' },
  { title: { bn: 'এহতেসাব ও পরামর্শ', en: 'Ehtesab and advice' }, href: '/join/feedback', words: 'এহতেসাব পরামর্শ অভিযোগ সমস্যা মতামত feedback complaint advice ehtesab' },
  {
    title: { bn: 'শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা', en: 'Scholarships and medical aid' },
    href: '/services/assistance',
    words: 'শিক্ষাবৃত্তি বৃত্তি স্কলারশিপ চিকিৎসা সহায়তা আর্থিক scholarship medical aid financial',
  },
  { title: { bn: 'আবেদনের অবস্থা দেখুন', en: 'Check application status' }, href: '/services/assistance/status', words: 'ট্র্যাকিং আবেদন অবস্থা কোড tracking status code' },
  { title: { bn: 'ক্যাম্পাস গাইড', en: 'Campus guide' }, href: '/services/campus', words: 'ক্যাম্পাস গাইড নবীন বিভাগ অনুষদ হল হোস্টেল শাটল ট্রেন campus guide freshers department faculty hall shuttle' },
  { title: { bn: 'আমাদের কথা', en: 'About us' }, href: '/about', words: 'পরিচিতি ইতিহাস লক্ষ্য উদ্দেশ্য ৫ দফা কর্মসূচি about history goal programme' },
  { title: { bn: 'দায়িত্বশীলবৃন্দ', en: 'Leadership' }, href: '/leadership', words: 'দায়িত্বশীল সভাপতি সেক্রেটারি কমিটি পরিষদ leadership president secretary committee' },
  { title: { bn: 'যুক্ত হোন', en: 'Get involved' }, href: '/join', words: 'যুক্ত যোগাযোগ ইমেইল contact join email' },
  { title: { bn: 'গোপনীয়তা নীতি', en: 'Privacy policy' }, href: '/privacy', words: 'গোপনীয়তা তথ্য নিরাপত্তা privacy data' },
  { title: { bn: 'ইভেন্ট', en: 'Events' }, href: '/events', words: 'ইভেন্ট প্রোগ্রাম অনুষ্ঠান রেজিস্ট্রেশন events programme registration' },
  { title: { bn: 'সিলেবাস', en: 'Syllabus' }, href: '/syllabus', words: 'সিলেবাস পাঠ্যসূচি বই syllabus books worker associate member' },
]

const GUIDE: Record<Locale, string> = { bn: 'ক্যাম্পাস গাইড', en: 'Campus guide' }

/** Small collections are indexed in memory (a few dozen rows), cached with the pages. */
const getStaticIndex = unstable_cache(
  async (lang: Locale) => {
    const payload = await getPayloadClient()
    const published = { _status: { equals: 'published' } } as const
    const [people, albums, videos, press] = await Promise.all([
      payload.find({ collection: 'people', where: published, limit: 500, depth: 0, locale: lang, select: { name: true, position: true, slug: true, department: true } }),
      payload.find({ collection: 'albums', where: published, limit: 500, depth: 0, locale: lang, select: { title: true, slug: true, date: true } }),
      payload.find({ collection: 'videos', where: published, limit: 500, depth: 0, locale: lang, select: { title: true, youtubeId: true, publishedAt: true } }),
      payload.find({ collection: 'press-coverage', where: published, limit: 1000, depth: 0, select: { headline: true, outlet: true, url: true, publishedAt: true } }),
    ])
    const entries: (SearchHit & { text: string })[] = [
      ...PAGES.map((p) => ({ kind: 'page' as const, title: p.title[lang], href: p.href, text: `${p.title.bn} ${p.title.en} ${p.words}` })),
      ...FACULTIES.flatMap((f) =>
        f.departments.map((d) => ({
          kind: 'page' as const,
          title: optionLabel(d, lang),
          href: '/services/campus#departments',
          meta: `${optionLabel(f, lang)}, ${GUIDE[lang]}`,
          text: `${d.label} ${d.en} ${f.label} ${f.en}`,
        })),
      ),
      ...HALLS.map((h) => ({ kind: 'page' as const, title: optionLabel(h, lang), href: '/services/campus#halls', meta: GUIDE[lang], text: `${h.label} ${h.en}` })),
      ...people.docs.map((p) => {
        const name = personName(p.name, lang)
        const position = personPosition(p.position, lang)
        return {
          kind: 'person' as const,
          title: name,
          href: `/leadership/${p.slug}`,
          meta: position,
          text: `${p.name} ${name} ${p.position} ${position} ${p.department ?? ''}`,
        }
      }),
      ...albums.docs.map((a) => ({ kind: 'album' as const, title: a.title, href: `/gallery/${a.slug}`, meta: date(lang, a.date), text: a.title })),
      ...videos.docs.map((v) => ({
        kind: 'video' as const,
        title: v.title,
        href: `https://www.youtube.com/watch?v=${v.youtubeId}`,
        meta: date(lang, v.publishedAt),
        text: v.title,
        external: true,
      })),
      ...press.docs.map((p) => ({
        kind: 'press' as const,
        title: p.headline,
        href: p.url,
        meta: `${outletName(p.outlet, lang)}, ${date(lang, p.publishedAt)}`,
        text: `${p.headline} ${p.outlet} ${outletName(p.outlet, 'en')}`,
        external: true,
      })),
    ]
    return entries.map((e) => ({ ...e, text: normalizeForSearch(e.text) }))
  },
  ['search-static-index'],
  { tags: ['people', 'albums', 'videos', 'press'], revalidate: 3600 },
)

const matchesAll = (text: string, words: string[]) => words.every((w) => text.includes(w))

type PostRow = { id: number; title: string; slug?: string | null; category: string; publishedAt: string; excerpt?: string | null; searchText?: string | null }

/** Posts whose text in `locale` contains every word. */
async function findPosts(words: string[], locale: Locale, limit: number) {
  const payload = await getPayloadClient()
  const { docs } = await payload.find({
    collection: 'posts',
    locale,
    limit,
    sort: '-publishedAt',
    depth: 0,
    where: { and: [{ _status: { equals: 'published' } }, { searchText: { like: words.join(' ') } }] },
    select: { title: true, slug: true, category: true, publishedAt: true, excerpt: true, searchText: true },
  })
  return docs as PostRow[]
}

export async function search(query: string, { limit = 30, lang = 'bn' }: { limit?: number; lang?: Locale } = {}): Promise<SearchHit[]> {
  const q = normalizeForSearch(query).slice(0, 80)
  if (q.length < 2) return []
  const words = q.split(' ').filter(Boolean).slice(0, 6)

  // English pages search the English text and the Bangla text (most posts are Bangla-only),
  // then show each hit as the English page shows it.
  const [primary, bangla, index] = await Promise.all([
    findPosts(words, lang, limit),
    lang === 'en' ? findPosts(words, 'bn', limit) : Promise.resolve([] as PostRow[]),
    getStaticIndex(lang),
  ])
  let posts = primary
  const missing = bangla.filter((b) => !primary.some((p) => p.id === b.id))
  if (missing.length) {
    const payload = await getPayloadClient()
    const { docs } = await payload.find({
      collection: 'posts',
      locale: 'en',
      limit: missing.length,
      depth: 0,
      sort: '-publishedAt',
      where: { id: { in: missing.map((m) => m.id) } },
      select: { title: true, slug: true, category: true, publishedAt: true, excerpt: true, searchText: true },
    })
    posts = [...primary, ...(docs as PostRow[])].sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
  }

  const postHits: SearchHit[] = posts.slice(0, limit).map((p) => ({
    kind: 'post',
    title: p.title,
    href: `/news/${p.slug}`,
    meta: `${categoryLabel(p.category, lang)}, ${date(lang, p.publishedAt)}`,
    excerpt: snippet(p.excerpt || p.searchText || '', words[0]),
  }))

  // Title matches first within the in-memory index.
  const others = index
    .filter((e) => matchesAll(e.text, words))
    .sort((a, b) => Number(matchesAll(normalizeForSearch(b.title), words)) - Number(matchesAll(normalizeForSearch(a.title), words)))
    .map(({ text: _text, ...hit }) => hit)

  const pages = others.filter((h) => h.kind === 'page' || h.kind === 'person')
  const rest = others.filter((h) => h.kind !== 'page' && h.kind !== 'person')
  return [...pages.slice(0, 8), ...postHits, ...rest].slice(0, limit)
}
