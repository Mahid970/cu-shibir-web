'use client'

import { useDeferredValue, useState } from 'react'

import { Search } from '@/components/ui/Icons'
import { toBnDigits } from '@/lib/bn'
import type { Faculty } from '@/lib/campus'

const fold = (s: string) => s.normalize('NFC').toLowerCase().replace(/[‌‍]/g, '')

/** Faculties and their departments with a find-as-you-type box (freshers search by department). */
export function CampusDirectory({ faculties }: { faculties: Faculty[] }) {
  const [query, setQuery] = useState('')
  const q = fold(useDeferredValue(query).trim())
  const shown = faculties
    .map((f) => ({ ...f, departments: q ? f.departments.filter((d) => fold(d.label).includes(q) || fold(f.label).includes(q)) : f.departments }))
    .filter((f) => f.departments.length > 0)
  const count = shown.reduce((n, f) => n + f.departments.length, 0)

  return (
    <div>
      <label className="relative mx-auto block max-w-xl">
        <span className="sr-only">বিভাগ খুঁজুন</span>
        <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="বিভাগের নাম লিখুন, যেমন: গণিত"
          className="h-13 w-full rounded-full border border-[#d9dde8] bg-white pl-12 pr-5 text-[1rem] shadow-[0_4px_24px_rgb(11_15_46/0.06)] focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15"
        />
      </label>
      <p className="mt-3 text-center text-[0.92rem] text-subtle" aria-live="polite">
        {q ? `${toBnDigits(count)}টি মিলেছে` : `${toBnDigits(faculties.length)}টি অনুষদে ${toBnDigits(count)}টি বিভাগ ও ইনস্টিটিউট`}
      </p>
      <div className="mt-8 grid gap-4 md:grid-cols-2">
        {shown.map((f) => (
          <section key={f.value} aria-labelledby={`fac-${f.value}`} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
            <h3 id={`fac-${f.value}`} className="flex items-baseline justify-between gap-3 text-[1.15rem] font-bold text-ink">
              {f.label}
              <span className="shrink-0 text-[0.85rem] font-semibold text-subtle">{toBnDigits(f.departments.length)}টি</span>
            </h3>
            <ul className="mt-4 flex flex-wrap gap-2">
              {f.departments.map((d) => (
                <li key={d.value} className="rounded-full bg-pale-2 px-3 py-1.5 text-[0.92rem] text-ink/85">
                  {d.label}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      {shown.length === 0 && (
        <p className="mt-8 rounded-2xl bg-white p-6 text-center text-muted">
          এই নামে কোনো বিভাগ পাওয়া যায়নি। বানান বদলে চেষ্টা করুন।
        </p>
      )}
    </div>
  )
}
