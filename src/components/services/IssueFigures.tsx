import { copy, type Locale } from '@/i18n/config'
import { num } from '@/i18n/format'
import { ISSUE_CATEGORIES } from '@/lib/forms/options'
import type { IssueStats } from '@/lib/services/issueStats'

const T = copy(
  {
    total: 'জমা পড়েছে',
    resolved: 'সমাধান হয়েছে',
    rate: (p: string) => `${p}% সমাধান`,
    open: 'কাজ চলছে',
    median: 'সমাধানে সময়',
    days: (d: string) => `${d} দিন`,
    medianNone: 'এখনো হিসাব হয়নি',
    medianHint: 'মাঝামাঝি সময়, জমা থেকে সমাধান পর্যন্ত',
    byCategory: 'বিষয় অনুযায়ী',
    ofResolved: (r: string, t: string) => `${t}টির মধ্যে ${r}টি সমাধান`,
    byMonth: 'গত ছয় মাস',
    received: 'জমা',
    resolvedShort: 'সমাধান',
    empty: 'এখনো কোনো সমস্যা জমা পড়েনি। প্রথম সমস্যাগুলো আসার পর থেকেই হিসাব এখানে দেখা যাবে।',
    note: 'গোপনীয় হয়রানির অভিযোগ এবং স্প্যাম এই হিসাবে ধরা হয় না। হিসাব এক ঘণ্টার মধ্যে হালনাগাদ হয়।',
  },
  {
    total: 'Reported',
    resolved: 'Resolved',
    rate: (p: string) => `${p}% resolved`,
    open: 'In progress',
    median: 'Time to resolve',
    days: (d: string) => `${d} days`,
    medianNone: 'Not measured yet',
    medianHint: 'The median, from report to resolution',
    byCategory: 'By subject',
    ofResolved: (r: string, t: string) => `${r} of ${t} resolved`,
    byMonth: 'The last six months',
    received: 'Reported',
    resolvedShort: 'Resolved',
    empty: 'No problems have been reported yet. The figures will appear here as soon as the first reports come in.',
    note: 'Confidential harassment reports and spam are not counted. The figures update within an hour.',
  },
)

const monthName = (lang: Locale, iso: string) =>
  new Intl.DateTimeFormat(lang === 'bn' ? 'bn-BD' : 'en-GB', { month: 'short', timeZone: 'UTC' }).format(new Date(iso))

/** The desk's public record: counts, resolution rate and time, by subject and by month. No personal data. */
export function IssueFigures({ stats, lang }: { stats: IssueStats; lang: Locale }) {
  const t = T[lang]
  if (stats.total === 0) {
    return <p className="mx-auto max-w-2xl rounded-3xl bg-white p-8 text-center text-[1.05rem] leading-relaxed text-muted shadow-[0_4px_24px_rgb(11_15_46/0.06)]">{t.empty}</p>
  }
  const rate = Math.round((stats.resolved / stats.total) * 100)
  const peak = Math.max(1, ...stats.months.map((m) => Math.max(m.received, m.resolved)))
  const tiles = [
    { k: t.total, v: num(lang, stats.total) },
    { k: t.resolved, v: num(lang, stats.resolved), sub: t.rate(num(lang, rate)) },
    { k: t.open, v: num(lang, stats.open) },
    { k: t.median, v: stats.medianDays === null ? '—' : t.days(num(lang, stats.medianDays)), sub: stats.medianDays === null ? t.medianNone : t.medianHint },
  ]

  return (
    <div className="mx-auto grid max-w-5xl gap-6">
      <dl className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {tiles.map((tile) => (
          <div key={tile.k} className="rounded-3xl bg-white p-5 shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:p-6">
            <dt className="text-[0.92rem] font-semibold text-muted">{tile.k}</dt>
            <dd className="mt-1 text-[1.9rem] font-bold leading-tight text-ink md:text-[2.2rem]">{tile.v}</dd>
            {tile.sub && <dd className="mt-1 text-[0.88rem] text-subtle">{tile.sub}</dd>}
          </div>
        ))}
      </dl>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <section aria-labelledby="by-category" className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:p-8">
          <h3 id="by-category" className="text-[1.15rem] font-bold text-ink">
            {t.byCategory}
          </h3>
          <ul className="mt-5 grid gap-4">
            {stats.categories.map((c) => {
              const option = ISSUE_CATEGORIES.find((o) => o.value === c.value)!
              const share = (c.total / stats.categories[0].total) * 100
              return (
                <li key={c.value}>
                  <div className="flex items-baseline justify-between gap-3 text-[0.95rem]">
                    <span className="font-semibold text-ink">{lang === 'en' ? option.en : option.label}</span>
                    <span className="shrink-0 text-subtle">{t.ofResolved(num(lang, c.resolved), num(lang, c.total))}</span>
                  </div>
                  <div aria-hidden="true" className="mt-1.5 h-2.5 rounded-full bg-pale-2">
                    <div className="relative h-full rounded-full bg-pale-4" style={{ width: `${share}%` }}>
                      <div className="absolute inset-y-0 left-0 rounded-full bg-success" style={{ width: `${(c.resolved / c.total) * 100}%` }} />
                    </div>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>

        <section aria-labelledby="by-month" className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:p-8">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <h3 id="by-month" className="text-[1.15rem] font-bold text-ink">
              {t.byMonth}
            </h3>
            <p aria-hidden="true" className="flex gap-4 text-[0.85rem] text-muted">
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-blue" />
                {t.received}
              </span>
              <span className="flex items-center gap-1.5">
                <span className="size-2.5 rounded-full bg-success" />
                {t.resolvedShort}
              </span>
            </p>
          </div>
          <ol className="mt-6 grid h-44 grid-cols-6 items-end gap-2">
            {stats.months.map((m) => (
              <li key={m.month} className="flex h-full flex-col items-center justify-end gap-2">
                <span className="sr-only">
                  {monthName(lang, m.month)}: {t.received} {num(lang, m.received)}, {t.resolvedShort} {num(lang, m.resolved)}
                </span>
                <div aria-hidden="true" className="flex h-full w-full items-end justify-center gap-1">
                  <span className="w-3 rounded-t bg-blue md:w-4" style={{ height: `${(m.received / peak) * 100}%` }} />
                  <span className="w-3 rounded-t bg-success md:w-4" style={{ height: `${(m.resolved / peak) * 100}%` }} />
                </div>
                <span aria-hidden="true" className="text-[0.8rem] text-subtle">
                  {monthName(lang, m.month)}
                </span>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <p className="text-center text-[0.9rem] text-subtle">{t.note}</p>
    </div>
  )
}
