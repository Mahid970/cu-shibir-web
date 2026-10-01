import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { ArrowRight, ExternalLink, Search } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { copy, langAttr, localePath, type Locale } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import { KIND_LABELS, search, type SearchHit, type SearchKind } from '@/lib/search'

const T = copy(
  {
    meta: { title: 'খুঁজুন', description: 'সংবাদ, বিবৃতি, দায়িত্বশীল, গ্যালারি ও সেবার মধ্যে খুঁজুন।' },
    title: 'খুঁজুন',
    label: 'কী খুঁজছেন',
    placeholder: 'যেমন: আবাসন, নবীনবরণ, শিক্ষাবৃত্তি',
    button: 'খুঁজুন',
    found: (q: string, n: string) => `“${q}” লিখে ${n}টি ফলাফল`,
    none: (q: string) => `“${q}” লিখে কিছু পাওয়া যায়নি। অন্য শব্দে বা ছোট করে লিখে দেখুন।`,
  },
  {
    meta: { title: 'Search', description: 'Search news, statements, leaders, the gallery and services.' },
    title: 'Search',
    label: 'What are you looking for',
    placeholder: 'For example: housing, scholarship, campus guide',
    button: 'Search',
    found: (q: string, n: string) => `${n} results for “${q}”`,
    none: (q: string) => `Nothing found for “${q}”. Try another word, or a shorter one. Bangla words work too.`,
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return { ...T[lang].meta, robots: { index: false, follow: true } }
}

type Props = { searchParams: Promise<{ q?: string }> }

const ORDER: SearchKind[] = ['page', 'person', 'martyr', 'post', 'album', 'video', 'press']

function Hit({ hit, lang }: { hit: SearchHit; lang: Locale }) {
  const inner = (
    <>
      <span className="min-w-0 flex-1">
        <span lang={langAttr(lang, hit.title)} className="block font-semibold leading-snug text-ink group-hover:text-primary">
          {hit.title}
        </span>
        {hit.meta && <span className="mt-0.5 block text-[0.88rem] text-subtle">{hit.meta}</span>}
        {hit.excerpt && (
          <span lang={langAttr(lang, hit.excerpt)} className="mt-1.5 line-clamp-2 block text-[0.95rem] text-muted">
            {hit.excerpt}
          </span>
        )}
      </span>
      {hit.external ? <ExternalLink className="mt-1 size-4 shrink-0 text-subtle" /> : <ArrowRight className="mt-1 size-4 shrink-0 text-subtle group-hover:text-primary" />}
    </>
  )
  const cls = 'group flex items-start gap-4 rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgb(11_31_51/0.06)] transition-shadow hover:shadow-[0_14px_34px_rgb(11_31_51/0.1)]'
  return hit.external ? (
    <a href={hit.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {inner}
    </a>
  ) : (
    <Link href={hit.href} className={cls}>
      {inner}
    </Link>
  )
}

export default async function SearchPage({ searchParams }: Props) {
  const { q = '' } = await searchParams
  const lang = await getLang()
  const t = T[lang]
  const query = q.trim().slice(0, 80)
  const hits = query ? await search(query, { limit: 60, lang }) : []
  const groups = ORDER.map((kind) => ({ kind, hits: hits.filter((h) => h.kind === kind) })).filter((g) => g.hits.length)

  return (
    <>
      <PageHeader title={[{ hl: t.title }]}>
        <form action={localePath(lang, '/search')} role="search" className="load-up mx-auto mt-8 flex max-w-2xl gap-2">
          <label className="relative flex-1">
            <span className="sr-only">{t.label}</span>
            <Search className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-subtle" />
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={t.placeholder}
              autoFocus={!query}
              className="h-14 w-full rounded-full border border-[#d3dee8] bg-white pl-12 pr-5 text-[1.05rem] shadow-[0_4px_24px_rgb(11_31_51/0.06)] focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15"
            />
          </label>
          <button type="submit" className="btn btn-gradient h-14 rounded-full px-6">
            {t.button}
          </button>
        </form>
      </PageHeader>

      <div className="wrap max-w-4xl py-12 md:py-16">
        {query && (
          <p className="mb-8 text-center text-muted" aria-live="polite">
            {hits.length ? t.found(query, num(lang, hits.length)) : t.none(query)}
          </p>
        )}
        {groups.map((g) => (
          <section key={g.kind} aria-labelledby={`k-${g.kind}`} className="mb-10 last:mb-0">
            <h2 id={`k-${g.kind}`} className="mb-4 text-[1.3rem] font-bold text-ink">
              {KIND_LABELS[lang][g.kind]}
            </h2>
            <ul className="grid gap-3">
              {g.hits.map((h) => (
                <li key={`${h.kind}:${h.href}:${h.title}`}>
                  <Hit hit={h} lang={lang} />
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
    </>
  )
}
