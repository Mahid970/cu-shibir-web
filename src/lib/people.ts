import { NAMES_EN, POSITIONS_EN } from '@/content/people-en'
import { hasBangla, type Locale } from '@/i18n/config'
import type { Person } from '@/payload-types'

import { toLatinDigits, transliterate } from './bn'
import { DEPARTMENTS, HALLS, type Option } from './campus'

// Keys are NFC-normalised so য়/ড় typed either way still match.
const nfc = (map: Record<string, string>) => new Map(Object.entries(map).map(([bn, en]) => [bn.normalize('NFC'), en]))
const POSITION = nfc(POSITIONS_EN)
const NAME = nfc(NAMES_EN)

const titleCase = (s: string) => s.replace(/(^|[\s.-])(\p{L})/gu, (_, sep: string, ch: string) => sep + ch.toUpperCase())

/**
 * Name in the page's language. English pages use the CMS's English name when there is one,
 * then our list of spellings, then a plain transliteration.
 */
export function personName(name: string, lang: Locale): string {
  if (lang === 'bn' || !hasBangla(name)) return name
  return NAME.get(name.normalize('NFC')) ?? titleCase(transliterate(name))
}

export function personPosition(position: string, lang: Locale): string {
  if (lang === 'bn' || !hasBangla(position)) return position
  return POSITION.get(position.normalize('NFC')) ?? position
}

// "প্রাণিবিদ্যা", "শহীদ আব্দুর রব হল" → a spelling-tolerant key that matches the campus list.
const key = (text: string) => transliterate(text.replace(/বিভাগ|হল|হোস্টেল/g, '')).toLowerCase().replace(/[^a-z]/g, '')
const match = (list: Option[], text: string) => list.find((o) => key(o.label) === key(text))

/** Department, session and hall as short lines ("প্রাণিবিদ্যা বিভাগ" / "Department of Zoology"). */
export function personDetails(person: Pick<Person, 'department' | 'session' | 'hall'>, lang: Locale): string[] {
  const { department, session, hall } = person
  if (lang === 'bn') {
    return [department && `${department} বিভাগ`, session && `সেশন ${session}`, hall].filter(Boolean) as string[]
  }
  return [
    department && (hasBangla(department) ? (match(DEPARTMENTS, department)?.en ?? department) : department),
    session && `Session ${toLatinDigits(session)}`,
    hall && (hasBangla(hall) ? (match(HALLS, hall)?.en ?? hall) : hall),
  ].filter(Boolean) as string[]
}

/** The same, labelled, for the profile page. */
export function personFacts(person: Pick<Person, 'department' | 'session' | 'hall' | 'term'>, lang: Locale): { k: string; v: string }[] {
  const en = lang === 'en'
  const { department: dept, hall } = person
  return [
    dept && { k: en ? 'Department' : 'বিভাগ', v: en && hasBangla(dept) ? (match(DEPARTMENTS, dept)?.en ?? dept) : dept },
    person.session && { k: en ? 'Session' : 'শিক্ষাবর্ষ', v: en ? toLatinDigits(person.session) : person.session },
    hall && { k: en ? 'Hall' : 'হল', v: en && hasBangla(hall) ? (match(HALLS, hall)?.en ?? hall) : hall },
    person.term && { k: en ? 'Term' : 'দায়িত্বের মেয়াদ', v: en ? toLatinDigits(person.term) : `সেশন ${person.term}` },
  ].filter(Boolean) as { k: string; v: string }[]
}
