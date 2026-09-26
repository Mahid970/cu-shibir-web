/**
 * One-time (re-runnable) import of PUBLIC content from the legacy cushibir.org API:
 * posts, leaders, press coverage, videos and gallery photos (grouped into albums by caption).
 *
 *   npm run import:legacy               # import everything
 *   npm run import:legacy -- --dry-run  # fetch + map only, write nothing
 *
 * Idempotent: records are matched by `legacyId` (albums by title, media by source URL),
 * so running it again updates instead of duplicating. Private form submissions are NOT
 * imported here — the branch exports those from the old admin (plan §8).
 */
import 'dotenv/config'
import { convertHTMLToLexical, editorConfigFactory } from '@payloadcms/richtext-lexical'
import { JSDOM } from 'jsdom'
import { getPayload, type Payload } from 'payload'

import { parseLooseDate } from '../src/lib/bn'
import config from '../src/payload.config'

const LEGACY = process.env.LEGACY_API_BASE || 'https://cushibir.org/api'
const DRY_RUN = process.argv.includes('--dry-run')
const ctx = { disableRevalidate: true }

type Json = Record<string, unknown>
const str = (v: unknown): string | undefined =>
  typeof v === 'string' && v.trim() && v.trim() !== 'None' ? v.trim() : undefined

async function getJson(path: string): Promise<unknown> {
  const res = await fetch(`${LEGACY}/${path}`, { headers: { 'user-agent': 'cushibir-migration/1.0' } })
  if (!res.ok) throw new Error(`GET ${path} → ${res.status}`)
  const body = (await res.json()) as { success?: boolean; data?: unknown }
  return body.data
}

const CATEGORY_MAP: Record<string, string> = {
  প্রবন্ধ: 'article',
  বিবৃতি: 'statement',
  'বুক রিভিউ': 'book-review',
  সংগঠন: 'organisation',
  'সংবাদ সম্মেলন': 'press-conference',
  Education: 'education',
  'ছাত্র কল্যাণ': 'welfare',
}

const escapeHtml = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

/** Legacy content is sometimes HTML, sometimes plain text with \r\n — normalise to HTML. */
function toHtml(content: string): string {
  if (/<\/?(p|div|br|a|strong|em|h\d|ul|ol|li)\b/i.test(content)) return content
  return content
    .replace(/\r\n/g, '\n')
    .replace(/\u00a0/g, ' ')
    // Legacy authors separate paragraphs with a single newline.
    .split(/\n+/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${escapeHtml(p)}</p>`)
    .join('')
}

function cleanUrl(url: string): string {
  try {
    const u = new URL(url)
    for (const k of [...u.searchParams.keys()]) if (/^(fbclid|utm_)/.test(k)) u.searchParams.delete(k)
    return u.toString()
  } catch {
    return url
  }
}

const toIso = (display: unknown, fallback: unknown): string => {
  const parsed = typeof display === 'string' ? parseLooseDate(display, 2026) : null
  return (parsed ?? new Date(String(fallback))).toISOString()
}

async function main() {
  const payload = await getPayload({ config })
  const editorConfig = await editorConfigFactory.default({ config: payload.config })
  const richText = (html: string) => convertHTMLToLexical({ editorConfig, html, JSDOM })

  const mediaCache = new Map<string, number>()
  async function importImage(url: string | undefined, alt: string): Promise<number | undefined> {
    if (!url) return undefined
    if (mediaCache.has(url)) return mediaCache.get(url)
    const existing = await payload.find({ collection: 'media', where: { sourceUrl: { equals: url } }, limit: 1 })
    if (existing.docs[0]) {
      mediaCache.set(url, existing.docs[0].id)
      return existing.docs[0].id
    }
    if (DRY_RUN) return undefined
    const res = await fetch(url)
    if (!res.ok) {
      console.warn(`  ! image ${res.status}: ${url}`)
      return undefined
    }
    const data = Buffer.from(await res.arrayBuffer())
    const mimetype = res.headers.get('content-type') || 'image/jpeg'
    const name = decodeURIComponent(new URL(url).pathname.split('/').pop() || 'image.jpg')
    const doc = await payload.create({
      collection: 'media',
      data: { alt: alt.slice(0, 250), sourceUrl: url },
      file: { data, mimetype, name, size: data.length },
      context: ctx,
    })
    mediaCache.set(url, doc.id)
    return doc.id
  }

  async function upsert(
    collection: 'posts' | 'people' | 'press-coverage' | 'videos',
    legacyId: number,
    data: Json,
    published: boolean,
  ) {
    const existing = await payload.find({
      collection,
      where: { legacyId: { equals: legacyId } },
      limit: 1,
      draft: true,
    })
    const doc = { ...data, legacyId, _status: published ? 'published' : 'draft' }
    if (DRY_RUN) return console.log(`  [dry] ${collection} #${legacyId}`)
    if (existing.docs[0]) {
      await payload.update({ collection, id: existing.docs[0].id, data: doc as never, context: ctx })
      console.log(`  ~ updated ${collection} #${legacyId}`)
    } else {
      await payload.create({ collection, data: doc as never, context: ctx })
      console.log(`  + created ${collection} #${legacyId}`)
    }
  }

  // --- Posts ---------------------------------------------------------------
  const blogData = (await getJson('blogs')) as { blogs: Json[] }
  console.log(`Posts: ${blogData.blogs.length}`)
  for (const b of blogData.blogs) {
    const title = str(b.title) ?? 'শিরোনামহীন'
    const heroImage = await importImage(str(b.image), title)
    const publishedAt = str(b.dateRaw)
      ? new Date(`${b.dateRaw}T12:00:00+06:00`).toISOString()
      : toIso(b.date, b.createdAt)
    await upsert(
      'posts',
      Number(b.id),
      {
        title,
        category: CATEGORY_MAP[String(b.category)] ?? 'news',
        publishedAt,
        excerpt: str(b.excerpt)?.replace(/\s+/g, ' ').slice(0, 300),
        heroImage,
        content: str(b.content) ? richText(toHtml(String(b.content))) : undefined,
      },
      String(b.isPublished) !== 'false',
    )
  }

  // --- People --------------------------------------------------------------
  const people = (await getJson('people')) as Json[]
  console.log(`People: ${people.length}`)
  for (const p of people) {
    const name = (str(p.name) ?? '').replace(/^নাম\s*[:ঃ]\s*/, '')
    const statement = str(p.statement)
    const email = statement?.match(/mailto:([^"'>\s]+)/)?.[1]
    await upsert(
      'people',
      Number(p.id),
      {
        name,
        position: str(p.role) ?? '',
        group: 'executive',
        term: '২০২৬',
        order: Number(p.displayOrder ?? 100),
        photo: await importImage(str(p.image), name),
        department: str(p.department),
        hall: str(p.hall),
        session: str(p.session),
        bio: statement ? richText(statement) : undefined,
        email,
        socials: {
          facebook: str(p.facebook),
          instagram: str(p.instagram),
          x: str(p.twitter),
          youtube: str(p.youtube),
          telegram: str(p.telegram),
        },
      },
      String(p.isPublished) !== 'false',
    )
  }

  // --- Press coverage --------------------------------------------------------
  const press = (await getJson('newspapers')) as Json[]
  console.log(`Press coverage: ${press.length}`)
  for (const n of press) {
    await upsert(
      'press-coverage',
      Number(n.id),
      {
        headline: str(n.headline) ?? '',
        outlet: str(n.source) ?? '',
        publishedAt: toIso(n.date, n.createdAt),
        url: cleanUrl(String(n.url)),
        externalImageUrl: str(n.image),
      },
      String(n.isPublished) !== 'false',
    )
  }

  // --- Videos ----------------------------------------------------------------
  const videos = (await getJson('videos')) as Json[]
  console.log(`Videos: ${videos.length}`)
  for (const v of videos) {
    await upsert(
      'videos',
      Number(v.id),
      {
        title: str(v.title) ?? '',
        youtubeId: str(v.youtubeId),
        publishedAt: new Date(String(v.createdAt)).toISOString(),
      },
      String(v.isPublished) !== 'false',
    )
  }

  // --- Gallery → albums (grouped by identical caption) ------------------------
  const photos = (await getJson('photos')) as Json[]
  const groups = new Map<string, Json[]>()
  for (const ph of photos) {
    const caption = (str(ph.caption) ?? 'গ্যালারি').replace(/\s+/g, ' ')
    groups.set(caption, [...(groups.get(caption) ?? []), ph])
  }
  console.log(`Photos: ${photos.length} → ${groups.size} albums`)
  for (const [caption, items] of groups) {
    const ids = (await Promise.all(items.map((ph) => importImage(str(ph.src), caption)))).filter(
      (id): id is number => typeof id === 'number',
    )
    const date = items.map((ph) => String(ph.createdAt)).sort()[0]
    const data = {
      title: caption,
      date: new Date(date).toISOString(),
      photos: ids,
      legacyIds: items.map((ph) => Number(ph.id)),
      _status: 'published' as const,
    }
    if (DRY_RUN || !ids.length) {
      console.log(`  [${DRY_RUN ? 'dry' : 'skip'}] album "${caption.slice(0, 40)}…" (${items.length})`)
      continue
    }
    const existing = await payload.find({ collection: 'albums', where: { title: { equals: caption } }, limit: 1, draft: true })
    if (existing.docs[0]) await payload.update({ collection: 'albums', id: existing.docs[0].id, data: data as never, context: ctx })
    else await payload.create({ collection: 'albums', data: data as never, context: ctx })
    console.log(`  ✓ album "${caption.slice(0, 40)}…" (${ids.length} photos)`)
  }

  await report(payload)
  if (!DRY_RUN) await purgeSiteCache()
}

/** Best-effort: tell a running Next.js server to drop cached pages (scripts run outside Next). */
async function purgeSiteCache() {
  const site = process.env.NEXT_PUBLIC_SITE_URL
  const secret = process.env.REVALIDATE_SECRET
  if (!site || !secret) return
  try {
    const res = await fetch(`${site}/next/revalidate`, {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
      body: JSON.stringify({ tags: ['posts', 'people', 'press', 'videos', 'albums'] }),
    })
    console.log(res.ok ? 'Site cache purged.' : `Cache purge skipped (${res.status}).`)
  } catch {
    console.log('Site not running — no cache to purge.')
  }
}

async function report(payload: Payload) {
  console.log('\nTotals in CMS:')
  for (const c of ['posts', 'people', 'press-coverage', 'videos', 'albums', 'media'] as const) {
    const { totalDocs } = await payload.count({ collection: c })
    console.log(`  ${c.padEnd(15)} ${totalDocs}`)
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
