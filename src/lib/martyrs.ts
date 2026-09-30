import { copy, type Locale } from '@/i18n/config'
import { date, num } from '@/i18n/format'
import { pickImage, type ImageInfo } from '@/lib/media'
import type { Martyr } from '@/payload-types'

export const RANKS = copy(
  { kormi: 'কর্মী', sathi: 'সাথী', sodossho: 'সদস্য' },
  { kormi: 'Worker', sathi: 'Associate', sodossho: 'Member' },
)

/** "২০তম শহীদ" / "Martyr no. 20": the place in the organisation's list of martyrs. */
export const martyrOrdinal = (lang: Locale, n: number) => (lang === 'bn' ? `${num(lang, n)}তম শহীদ` : `Martyr no. ${n}`)

/** Names are stored with the honorific; the journey sometimes shows it smaller. */
export function splitHonorific(name: string) {
  const m = name.match(/^(শহীদ|Shaheed)\s+(.+)$/)
  return m ? { honorific: m[1], rest: m[2] } : { honorific: '', rest: name }
}

export type Station = {
  slug: string
  name: string
  ordinal: string | null
  rank: string | null
  year: string
  date: string
  place: string
  affiliation: string
  summary: string
  portrait: ImageInfo | null
}

/** The published martyrs, in order, shaped for the journey (plain data, safe to pass to the client). */
export function toStations(martyrs: Martyr[], lang: Locale): Station[] {
  return martyrs
    .filter((m) => m.slug)
    .map((m) => ({
      slug: m.slug!,
      name: m.name,
      ordinal: m.number ? martyrOrdinal(lang, m.number) : null,
      rank: m.rank ? RANKS[lang][m.rank] : null,
      year: m.date ? num(lang, new Date(m.date).getUTCFullYear()) : '',
      date: m.dateText || (m.date ? date(lang, m.date) : ''),
      place: m.place ?? '',
      affiliation: m.affiliation ?? '',
      summary: m.summary ?? '',
      portrait: pickImage(m.photo, 'card'),
    }))
}
