/**
 * Load the CU branch's martyrs (scripts/data/shaheeds.json and the photos in scripts/data/shaheeds/<slug>/)
 * into the CMS, in Bangla and English, published. Martyrs are matched by slug and photos by their
 * source key, so re-running updates them and never duplicates. Entries editors added by hand are
 * left alone.
 *
 *   npm run seed:shaheeds
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'

import config from '../src/payload.config'

type L = { bn: string; en: string }
type Part = { heading: string; text: string }
type Photo = { file: string; kind?: 'life' | 'day' | 'after' | 'place'; graphic?: boolean; caption?: L; alt?: L; credit: string }
type Shaheed = {
  slug: string
  order: number
  number: number
  rank: 'kormi' | 'sathi' | 'sodossho'
  date: string
  name: L
  affiliation: L
  role: L
  hall: L
  home: L
  born: L
  family: L
  place: L
  attackers: L
  wounds: L
  summary: L
  quote: L
  quoteBy: L
  story: { bn: Part[]; en: Part[] }
  photo: Photo
  gallery: Photo[]
  sources: { label: string; url: string }[]
}

const DATA = new URL('./data/', import.meta.url)
const { shaheeds } = JSON.parse(readFileSync(new URL('shaheeds.json', DATA), 'utf8')) as { shaheeds: Shaheed[] }

const payload = await getPayload({ config })
const context = { disableRevalidate: true }

/** Upload one photo (or find it from an earlier run) and give it both languages' text. */
async function photo(slug: string, p: Photo): Promise<number> {
  const key = `seed:shaheeds/${slug}/${p.file}`
  const alt = p.alt ?? p.caption ?? { bn: '', en: '' }
  const bn = { alt: alt.bn.slice(0, 250), caption: p.caption?.bn ?? '', credit: p.credit, sourceUrl: key }
  const { docs } = await payload.find({ collection: 'media', where: { sourceUrl: { equals: key } }, limit: 1, depth: 0 })
  let id = docs[0]?.id
  if (id) await payload.update({ collection: 'media', id, data: bn, locale: 'bn', context })
  else {
    const data = readFileSync(new URL(`shaheeds/${slug}/${p.file}`, DATA))
    const doc = await payload.create({
      collection: 'media',
      data: bn,
      file: { data, mimetype: 'image/jpeg', name: `shaheed-${slug}-${p.file}`, size: data.length },
      locale: 'bn',
      context,
    })
    id = doc.id
  }
  await payload.update({ collection: 'media', id, data: { alt: alt.en.slice(0, 250), caption: p.caption?.en ?? '' }, locale: 'en', context })
  return id
}

let created = 0
let updated = 0
for (const s of shaheeds) {
  const portrait = await photo(s.slug, s.photo)
  const gallery = []
  for (const g of s.gallery) gallery.push({ photo: await photo(s.slug, g), kind: g.kind ?? 'life', graphic: !!g.graphic })

  const text = (lang: 'bn' | 'en') => ({
    name: s.name[lang],
    affiliation: s.affiliation[lang],
    role: s.role[lang],
    hall: s.hall[lang],
    home: s.home[lang],
    born: s.born[lang],
    family: s.family[lang],
    place: s.place[lang],
    attackers: s.attackers[lang],
    wounds: s.wounds[lang],
    summary: s.summary[lang],
    quote: s.quote[lang],
    quoteBy: s.quoteBy[lang],
    story: s.story[lang],
  })
  const data = {
    ...text('bn'),
    slug: s.slug,
    order: s.order,
    number: s.number,
    rank: s.rank,
    date: s.date,
    photo: portrait,
    gallery,
    sources: s.sources,
    _status: 'published' as const,
  }
  const { docs } = await payload.find({ collection: 'martyrs', where: { slug: { equals: s.slug } }, limit: 1, depth: 0, draft: true })
  const doc = docs[0]
    ? await payload.update({ collection: 'martyrs', id: docs[0].id, data, locale: 'bn', draft: false, context })
    : await payload.create({ collection: 'martyrs', data, locale: 'bn', draft: false, context })
  await payload.update({ collection: 'martyrs', id: doc.id, data: { ...text('en'), _status: 'published' }, locale: 'en', draft: false, context })
  if (docs[0]) updated++
  else created++
  console.log(`  ${s.slug}: ${1 + gallery.length} photos`)
}
console.log(`martyrs: ${created} added, ${updated} updated`)

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const secret = process.env.REVALIDATE_SECRET
if (secret) {
  await fetch(`${site}/next/revalidate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
    body: JSON.stringify({ tags: ['martyrs'] }),
  }).catch(() => console.log('(site not reachable: pages update within the hour)'))
}
process.exit(0)
