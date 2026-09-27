/**
 * Load the campus map's places (scripts/data/campus-places.json, from OpenStreetMap) into the CMS,
 * in Bangla and English. Places are matched by `key`, so re-running updates them and never
 * duplicates; places editors added by hand (without a key) are left alone.
 *
 *   npm run seed:places
 */
import 'dotenv/config'
import { readFileSync } from 'node:fs'
import { getPayload } from 'payload'

import { DEPARTMENTS, FACULTIES, HALLS, type Option } from '../src/lib/campus'
import config from '../src/payload.config'

type Place = { key: string; category: string; lat: number; lng: number; ref?: string; name?: { bn: string; en: string } }
const { places } = JSON.parse(readFileSync(new URL('./data/campus-places.json', import.meta.url), 'utf8')) as { places: Place[] }

const LISTS: Record<string, Option[]> = { faculty: FACULTIES, hall: HALLS, dept: DEPARTMENTS }

function nameOf(place: Place): { bn: string; en: string } {
  if (place.name) return place.name
  const [list, value] = (place.ref ?? '').split(':')
  const option = LISTS[list]?.find((o) => o.value === value)
  if (!option) throw new Error(`Unknown ref ${place.ref} for ${place.key}`)
  return { bn: option.label, en: option.en }
}

const payload = await getPayload({ config })
const context = { disableRevalidate: true }
let created = 0
let updated = 0
for (const place of places) {
  const name = nameOf(place)
  const data = { key: place.key, category: place.category as never, lat: place.lat, lng: place.lng, name: name.bn }
  const { docs } = await payload.find({ collection: 'campus-places', where: { key: { equals: place.key } }, limit: 1, depth: 0, context })
  const doc = docs[0]
    ? await payload.update({ collection: 'campus-places', id: docs[0].id, data, locale: 'bn', context })
    : await payload.create({ collection: 'campus-places', data, locale: 'bn', context })
  await payload.update({ collection: 'campus-places', id: doc.id, data: { name: name.en }, locale: 'en', context })
  if (docs[0]) updated++
  else created++
}
console.log(`campus places: ${created} added, ${updated} updated`)

const site = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
const secret = process.env.REVALIDATE_SECRET
if (secret) {
  await fetch(`${site}/next/revalidate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-revalidate-secret': secret },
    body: JSON.stringify({ tags: ['campus-places'] }),
  }).catch(() => console.log('(site not reachable: the map updates within the hour)'))
}
process.exit(0)
