'use client'

import { useDeferredValue, useState } from 'react'

import { Search } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { useLang } from '@/i18n/LangProvider'
import { optionLabel, type Faculty, type Option } from '@/lib/campus'

const fold = (s: string) => s.normalize('NFC').toLowerCase().replace(/[\u200C\u200D]/g, '')

const T = copy(
  {
    find: 'বিভাগ খুঁজুন',
    placeholder: 'বিভাগের নাম লিখুন, যেমন: গণিত',
    matches: (n: string) => `${n}টি মিলেছে`,
    total: (f: string, d: string) => `${f}টি অনুষদে ${d}টি বিভাগ ও ইনস্টিটিউট`,
    count: (n: string) => `${n}টি`,
    none: 'এই নামে কোনো বিভাগ পাওয়া যায়নি। বানান বদলে চেষ্টা করুন।',
  },
  {
    find: 'Find a department',
    placeholder: 'Type a department, e.g. Mathematics',
    matches: (n: string) => `${n} found`,
    total: (f: string, d: string) => `${d} departments and institutes in ${f} faculties`,
    count: (n: string) => n,
    none: 'No department found with that name. Try another spelling.',
  },
)

/** Either language finds a department: "গণিত" and "math" both work on both pages. */
const matches = (o: Option, q: string) => fold(o.label).includes(q) || fold(o.en).includes(q)

/** Faculties and their departments with a find-as-you-type box (freshers search by department). */
export function CampusDirectory({ faculties }: { faculties: Faculty[] }) {
  const lang = useLang()
  const t = T[lang]
  const [query, setQuery] = useState('')
  const q = fold(useDeferredValue(query).trim())
  const shown = faculties
    .map((f) => ({ ...f, departments: q ? f.departments.filter((d) => matches(d, q) || matches(f, q)) : f.departments }))
    .filter((f) => f.departments.length > 0)
  const count = shown.reduce((n, f) => n + f.departments.length, 0)

  return (
    <div>
      <label className="relative mx-auto block max-w-xl">
        <span className="sr-only">{t.find}</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t.placeholder}
          className="h-13 w-full rounded-full border border-[#d9dde8] bg-white pl-12 pr-5 text-[1rem] shadow-[0_4px_24px_rgb(11_15_46/0.06)] focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15"
        />
      </label>
      <p className="mt-3 text-center text-[0.92rem] text-subtle" aria-live="polite">
        {q ? t.matches(num(lang, count)) : t.total(num(lang, faculties.length), num(lang, count))}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {shown.map((f) => (
          <section key={f.value} aria-labelledby={`fac-${f.value}`} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
            <h3 id={`fac-${f.value}`} className="flex items-baseline justify-between gap-3 text-[1.15rem] font-bold text-ink">
              {optionLabel(f, lang)}
              <span className="shrink-0 text-[0.85rem] font-semibold text-subtle">{t.count(num(lang, f.departments.length))}</span>
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {f.departments.map((d) => (
                <li key={d.value} className="rounded-full bg-pale-2 px-3 py-1.5 text-[0.92rem] text-ink/85">
                  {optionLabel(d, lang)}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-6 text-center text-muted">{t.none}</p>
      )}
    </div>
  )
}
