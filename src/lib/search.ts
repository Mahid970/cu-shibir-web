import 'server-only'

import { unstable_cache } from 'next/cache'

import { FACULTIES, HALLS } from './campus'
import { formatDate } from './bn'
import { getPayloadClient } from './cms'
import { normalizeForSearch, snippet } from './searchText'
import { categoryLabel } from './taxonomy'

export type SearchKind = 'post' | 'person' | 'album' | 'video' | 'press' | 'page'

export type SearchHit = {
  kind: SearchKind
  title: string
  href: string
  meta?: string
  excerpt?: string
  external?: boolean
}

export const KIND_LABELS: Record<SearchKind, string> = {
  post: 'সংবাদ ও প্রকাশনা',
  person: 'দায়িত্বশীল',
  album: 'গ্যালারি',
  video: 'ভিডিও',
  press: 'মিডিয়ায় আমরা',
  page: 'পাতা ও সেবা',
}

/** Pages and services people look for by name (and by what they call them). */
const PAGES: { title: string; href: string; words: string }[] = [
  { title: 'সমর্থক ফরম', href: '/join/supporter', words: 'সমর্থক হোন যুক্ত হতে চাই ফরম সদস্য কর্মী join supporter' },
  { title: 'এহতেসাব ও পরামর্শ', href: '/join/feedback', words: 'এহতেসাব পরামর্শ অভিযোগ সমস্যা মতামত feedback complaint' },
  { title: 'শিক্ষাবৃত্তি ও চিকিৎসা সহায়তা', href: '/services/assistance', words: 'শিক্ষাবৃত্তি বৃত্তি স্কলারশিপ চিকিৎসা সহায়তা আর্থিক scholarship medical' },
  { title: 'আবেদনের অবস্থা দেখুন', href: '/services/assistance/status', words: 'ট্র্যাকিং আবেদন অবস্থা কোড tracking status' },
  { title: 'ক্যাম্পাস গাইড', href: '/services/campus', words: 'ক্যাম্পাস গাইড নবীন বিভাগ অনুষদ হল হোস্টেল শাটল ট্রেন campus' },
  { title: 'আমাদের কথা', href: '/about', words: 'পরিচিতি ইতিহাস লক্ষ্য উদ্দেশ্য ৫ দফা কর্মসূচি about history' },
  { title: 'দায়িত্বশীলবৃন্দ', href: '/leadership', words: 'দায়িত্বশীল সভাপতি সেক্রেটারি কমিটি পরিষদ leadership' },
  { title: 'যুক্ত হোন', href: '/join', words: 'যুক্ত যোগাযোগ ইমেইল contact' },
  { title: 'গোপনীয়তা নীতি', href: '/privacy', words: 'গোপনীয়তা তথ্য নিরাপত্তা privacy' },
  { title: 'ইভেন্ট', href: '/events', words: 'ইভেন্ট প্রোগ্রাম অনুষ্ঠান রেজিস্ট্রেশন events' },
  { title: 'সিলেবাস', href: '/syllabus', words: 'সিলেবাস পাঠ্যসূচি বই syllabus' },
]

/** Small collections are indexed in memory (a few dozen rows), cached with the pages. */
const getStaticIndex = unstable_cache(
  async () => {
    const payload = await getPayloadClient()
    const published = { _status: { equals: 'published' } } as const
    const [people, albums, videos, press] = await Promise.all([
      payload.find({ collection: 'people', where: published, limit: 500, depth: 0, locale: 'bn', select: { name: true, position: true, slug: true, department: true } }),
      payload.find({ collection: 'albums', where: published, limit: 500, depth: 0, locale: 'bn', select: { title: true, slug: true, date: true } }),
      payload.find({ collection: 'videos', where: published, limit: 500, depth: 0, locale: 'bn', select: { title: true, youtubeId: true, publishedAt: true } }),
      payload.find({ collection: 'press-coverage', where: published, limit: 1000, depth: 0, select: { headline: true, outlet: true, url: true, publishedAt: true } }),
    ])
    const entries: (SearchHit & { text: string })[] = [
      ...PAGES.map((p) => ({ kind: 'page' as const, title: p.title, href: p.href, text: `${p.title} ${p.words}` })),
      ...FACULTIES.flatMap((f) =>
        f.departments.map((d) => ({ kind: 'page' as const, title: d.label, href: '/services/campus#departments', meta: `${f.label}, ক্যাম্পাস গাইড`, text: `${d.label} ${f.label}` })),
      ),
      ...HALLS.map((h) => ({ kind: 'page' as const, title: h.label, href: '/services/campus#halls', meta: 'ক্যাম্পাস গাইড', text: h.label })),
      ...people.docs.map((p) => ({ kind: 'person' as const, title: p.name, href: `/leadership/${p.slug}`, meta: p.position, text: `${p.name} ${p.position} ${p.department ?? ''}` })),
      ...albums.docs.map((a) => ({ kind: 'album' as const, title: a.title, href: `/gallery/${a.slug}`, meta: formatDate(a.date), text: a.title })),
      ...videos.docs.map((v) => ({ kind: 'video' as const, title: v.title, href: `https://www.youtube.com/watch?v=${v.youtubeId}`, meta: formatDate(v.publishedAt), text: v.title, external: true })),
      ...press.docs.map((p) => ({ kind: 'press' as const, title: p.headline, href: p.url, meta: `${p.outlet}, ${formatDate(p.publishedAt)}`, text: `${p.headline} ${p.outlet}`, external: true })),
    ]
    return entries.map((e) => ({ ...e, text: normalizeForSearch(e.text) }))
  },
  ['search-static-index'],
  { tags: ['people', 'albums', 'videos', 'press'], revalidate: 3600 },
)

const matchesAll = (text: string, words: string[]) => words.every((w) => text.includes(w))

export async function search(query: string, { limit = 30 }: { limit?: number } = {}): Promise<SearchHit[]> {
  const q = normalizeForSearch(query).slice(0, 80)
  if (q.length < 2) return []
  const words = q.split(' ').filter(Boolean).slice(0, 6)

  const payload = await getPayloadClient()
  const [posts, index] = await Promise.all([
    payload.find({
      collection: 'posts',
      locale: 'bn',
      limit,
      sort: '-publishedAt',
      depth: 0,
      where: { and: [{ _status: { equals: 'published' } }, { searchText: { like: words.join(' ') } }] },
      select: { title: true, slug: true, category: true, publishedAt: true, excerpt: true, searchText: true },
    }),
    getStaticIndex(),
  ])

  const postHits: SearchHit[] = posts.docs.map((p) => ({
    kind: 'post',
    title: p.title,
    href: `/news/${p.slug}`,
    meta: `${categoryLabel(p.category)}, ${formatDate(p.publishedAt)}`,
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
