import type { Locale } from '@/i18n/config'

import data from './syllabus.json'
import english from './syllabus.en.json'

export type SyllabusItem = { text: string; url?: string; /** progress key, from the Bangla text */ id?: string }
export type SyllabusList = { label: string; note?: string; items: SyllabusItem[] }
export type SyllabusSubject = {
  number?: string
  title: string
  objectives: string[]
  lists: SyllabusList[]
  subsections?: { heading: string; objectives: string[]; lists: SyllabusList[] }[]
}
export type SyllabusLevel = { key: 'kormi' | 'sathi' | 'sodosso'; name: string; label: string; subjects: SyllabusSubject[] }

/** কর্মী → সাথী → সদস্য syllabus, as published on the legacy site (see syllabus.json → source). */
const BANGLA = data.levels as SyllabusLevel[]
const EN = english.en as Record<string, string>

/** Stable id for a checklist item (level + text), used as the key in the reader's local progress. */
export function itemId(level: string, text: string): string {
  let h = 5381
  for (const ch of `${level}|${text}`) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0
  return `${level}-${h.toString(36)}`
}

function translate(level: SyllabusLevel, lang: Locale): SyllabusLevel {
  const t = (s: string) => (lang === 'en' ? (EN[s] ?? s) : s)
  const list = (l: SyllabusList): SyllabusList => ({
    label: t(l.label),
    note: l.note && t(l.note),
    // Ticks are keyed by the Bangla text, so progress is shared by both languages.
    items: l.items.map((item) => ({ text: t(item.text), url: item.url, id: itemId(level.key, item.text) })),
  })
  return {
    key: level.key,
    name: t(level.name),
    label: t(level.label),
    subjects: level.subjects.map((s) => ({
      number: s.number && t(s.number),
      title: t(s.title),
      objectives: s.objectives.map(t),
      lists: s.lists.map(list),
      subsections: s.subsections?.map((x) => ({ heading: t(x.heading), objectives: x.objectives.map(t), lists: x.lists.map(list) })),
    })),
  }
}

const BY_LANG: Record<Locale, SyllabusLevel[]> = {
  bn: BANGLA.map((l) => translate(l, 'bn')),
  en: BANGLA.map((l) => translate(l, 'en')),
}

/** All three levels in the page's language. */
export const syllabus = (lang: Locale = 'bn') => BY_LANG[lang]

/** Level keys, the same in both languages. */
export const SYLLABUS_KEYS = BANGLA.map((l) => l.key)

export const getLevel = (key: string, lang: Locale = 'bn') => BY_LANG[lang].find((l) => l.key === key)

/** Every checkable item of a level, including subsections. */
export function levelItems(level: SyllabusLevel): { id: string; item: SyllabusItem }[] {
  const lists = level.subjects.flatMap((s) => [...s.lists, ...(s.subsections?.flatMap((x) => x.lists) ?? [])])
  return lists.flatMap((l) => l.items.map((item) => ({ id: item.id ?? itemId(level.key, item.text), item })))
}
