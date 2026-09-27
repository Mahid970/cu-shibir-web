/**
 * Load the English versions of the imported content into the CMS's English locale:
 * posts (title, excerpt, body), albums, videos, photo alt text and captions, press headlines,
 * the committee's names, positions and messages, and the homepage slogan. Bangla is never touched.
 *
 * Source: scripts/data/english-content.json (plus content/people-en.ts and content/home.ts).
 * Safe to re-run; run it after `npm run import:legacy` on a new server.
 *
 *   npm run seed:english
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { getPayload, type Payload } from 'payload'

import { HERO_DEFAULTS } from '../src/content/home'
import { NAMES_EN, POSITIONS_EN } from '../src/content/people-en'
import config from '../src/payload.config'

type PostEn = { title: string; excerpt?: string; paragraphs?: (string | null)[] }
type Content = {
  posts: Record<string, PostEn>
  bios: Record<string, (string | null)[]>
  albums: Record<string, string>
  videos: Record<string, string>
  press: Record<string, string>
  captions: Record<string, string>
}
type LexicalNode = { type?: string; children?: LexicalNode[]; [key: string]: unknown }
type Lexical = { root: LexicalNode }

const content = JSON.parse(readFileSync(new URL('./data/english-content.json', import.meta.url), 'utf8')) as Content
const context = { disableRevalidate: true, skipShareImage: true }
const nfc = (s: string | null | undefined) => (s ?? '').normalize('NFC').trim()

/** Same document, each top-level paragraph's text replaced by its English (null keeps the original). */
function englishBody(body: Lexical, paragraphs: (string | null)[]): Lexical | null {
  const nodes = body.root.children ?? []
  const textual = nodes.filter((n) => n.type === 'paragraph' || n.type === 'heading')
  if (textual.length !== paragraphs.length) return null
  let i = 0
  const children = nodes.map((node) => {
    if (node.type !== 'paragraph' && node.type !== 'heading') return node
    const text = paragraphs[i++]
    if (text == null) return node
    return { ...node, textFormat: 0, children: [{ type: 'text', text, format: 0, detail: 0, mode: 'normal', style: '', version: 1 }] }
  })
  return { ...body, root: { ...body.root, children } }
}

async function posts(payload: Payload, dictionary: Map<string, string>) {
  for (const [slug, en] of Object.entries(content.posts)) {
    const { docs } = await payload.find({ collection: 'posts', where: { slug: { equals: slug } }, locale: 'bn', depth: 0, limit: 1 })
    const post = docs[0]
    if (!post) {
      console.log(`  – post not found: ${slug}`)
      continue
    }
    dictionary.set(nfc(post.title), en.title)
    const body = en.paragraphs ? englishBody(post.content as unknown as Lexical, en.paragraphs) : null
    if (en.paragraphs && !body) console.log(`  ! ${slug}: paragraph count changed, body left in Bangla`)
    await payload.update({
      collection: 'posts',
      id: post.id,
      locale: 'en',
      data: { title: en.title, ...(en.excerpt && { excerpt: en.excerpt }), ...(body && { content: body as never }) },
      context,
    })
    console.log(`  ✓ post ${slug}${body ? '' : ' (title and excerpt)'}`)
  }
}

async function albums(payload: Payload, dictionary: Map<string, string>) {
  for (const [slug, title] of Object.entries(content.albums)) {
    const { docs } = await payload.find({ collection: 'albums', where: { slug: { equals: slug } }, locale: 'bn', depth: 0, limit: 1 })
    if (!docs[0]) continue
    dictionary.set(nfc(docs[0].title), title)
    await payload.update({ collection: 'albums', id: docs[0].id, locale: 'en', data: { title }, context })
  }
  console.log(`  ✓ ${Object.keys(content.albums).length} albums`)
}

async function videos(payload: Payload, dictionary: Map<string, string>) {
  for (const [youtubeId, title] of Object.entries(content.videos)) {
    const { docs } = await payload.find({ collection: 'videos', where: { youtubeId: { equals: youtubeId } }, locale: 'bn', depth: 0, limit: 1 })
    if (!docs[0]) continue
    dictionary.set(nfc(docs[0].title), title)
    await payload.update({ collection: 'videos', id: docs[0].id, locale: 'en', data: { title }, context })
  }
  console.log(`  ✓ ${Object.keys(content.videos).length} videos`)
}

async function press(payload: Payload) {
  const { docs } = await payload.find({ collection: 'press-coverage', limit: 1000, depth: 0 })
  let n = 0
  for (const doc of docs) {
    const key = Object.keys(content.press).find((url) => doc.url.startsWith(url))
    if (!key || doc.headlineEn === content.press[key]) continue
    await payload.update({ collection: 'press-coverage', id: doc.id, data: { headlineEn: content.press[key] }, context })
    n++
  }
  console.log(`  ✓ ${n} press headlines`)
}

async function people(payload: Payload) {
  const names = new Map(Object.entries(NAMES_EN).map(([bn, en]) => [nfc(bn), en]))
  const positions = new Map(Object.entries(POSITIONS_EN).map(([bn, en]) => [nfc(bn), en]))
  const { docs } = await payload.find({ collection: 'people', limit: 500, depth: 0, locale: 'bn' })
  let n = 0
  for (const person of docs) {
    const name = names.get(nfc(person.name))
    const position = positions.get(nfc(person.position))
    const paragraphs = person.slug ? content.bios[person.slug] : undefined
    const bio = paragraphs && person.bio ? englishBody(person.bio as unknown as Lexical, paragraphs) : null
    if (!name && !position && !bio) continue
    await payload.update({
      collection: 'people',
      id: person.id,
      locale: 'en',
      data: { ...(name && { name }), ...(position && { position }), ...(bio && { bio: bio as never }) },
      context,
    })
    n++
  }
  console.log(`  ✓ ${n} people`)
}

/** Photo alt text and captions are usually the album or post title, or a leader's name. */
async function media(payload: Payload, dictionary: Map<string, string>) {
  for (const [bn, en] of Object.entries(NAMES_EN)) dictionary.set(nfc(bn), en)
  for (const [bn, en] of Object.entries(content.captions)) dictionary.set(nfc(bn), en)
  const { docs } = await payload.find({ collection: 'media', limit: 1000, depth: 0, locale: 'bn' })
  let n = 0
  const missing = new Set<string>()
  for (const doc of docs) {
    const bangla = /[\u0980-\u09FF]/.test(doc.alt ?? '')
    // Alt text is required in every language: reuse it when it is already English.
    const alt = dictionary.get(nfc(doc.alt)) ?? (bangla ? undefined : doc.alt)
    const caption = doc.caption ? dictionary.get(nfc(doc.caption)) : undefined
    if (bangla && !alt) missing.add(doc.alt)
    if (!alt) continue
    await payload.update({ collection: 'media', id: doc.id, locale: 'en', data: { ...(alt && { alt }), ...(caption && { caption }) }, context })
    n++
  }
  console.log(`  ✓ ${n} photos${missing.size ? ` (${missing.size} alt texts without English: ${[...missing].slice(0, 3).join(' | ')})` : ''}`)
}

async function siteSettings(payload: Payload) {
  await payload.updateGlobal({
    slug: 'site-settings',
    locale: 'en',
    data: { tagline: HERO_DEFAULTS.en.tagline, heroIntro: HERO_DEFAULTS.en.intro },
    context,
  })
  console.log('  ✓ site settings (slogan and intro)')
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
      body: JSON.stringify({ tags: ['posts', 'people', 'press', 'videos', 'albums', 'site-settings'] }),
    })
    console.log(res.ok ? 'Site cache purged.' : `Cache purge skipped (${res.status}).`)
  } catch {
    console.log('Site not running — no cache to purge.')
  }
}

async function main() {
  const payload = await getPayload({ config })
  const dictionary = new Map<string, string>()
  console.log('English content:')
  await posts(payload, dictionary)
  await albums(payload, dictionary)
  await videos(payload, dictionary)
  await press(payload)
  await people(payload)
  await media(payload, dictionary)
  await siteSettings(payload)
  await purgeSiteCache()
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
