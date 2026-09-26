import data from './syllabus.json'

export type SyllabusItem = { text: string; url?: string }
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
export const SYLLABUS = data.levels as SyllabusLevel[]

export const getLevel = (key: string) => SYLLABUS.find((l) => l.key === key)

/** Stable id for a checklist item (level + text), used as the key in the reader's local progress. */
export function itemId(level: string, text: string): string {
  let h = 5381
  for (const ch of `${level}|${text}`) h = ((h << 5) + h + ch.codePointAt(0)!) >>> 0
  return `${level}-${h.toString(36)}`
}

/** Every checkable item of a level, including subsections. */
export function levelItems(level: SyllabusLevel): { id: string; item: SyllabusItem }[] {
  const lists = level.subjects.flatMap((s) => [...s.lists, ...(s.subsections?.flatMap((x) => x.lists) ?? [])])
  return lists.flatMap((l) => l.items.map((item) => ({ id: itemId(level.key, item.text), item })))
}
