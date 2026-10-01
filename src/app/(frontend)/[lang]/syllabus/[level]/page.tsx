import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { LevelNav } from '@/components/syllabus/LevelNav'
import { LevelProgress, ProgressCheck } from '@/components/syllabus/progress'
import { CheckCircle, ExternalLink } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { SYLLABUS_KEYS, getLevel, levelItems, type SyllabusList } from '@/content/syllabus'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

type Props = { params: Promise<{ level: string }> }

export const dynamicParams = false

export function generateStaticParams() {
  return SYLLABUS_KEYS.map((level) => ({ level }))
}

const T = copy(
  {
    about: (label: string) => `${label}: বিষয়ভিত্তিক লক্ষ্য, পাঠ্যবই, অধ্যয়ন ও মুখস্থের তালিকা, অনলাইন লিংকসহ।`,
    title: 'সিলেবাস',
    lede: (n: string) => `${n}টি বিষয়। পড়া শেষ হলে টিক দাও, অগ্রগতি এই ডিভাইসে জমা থাকবে।`,
    online: '(অনলাইনে পড়ুন, নতুন ট্যাবে)',
    subjects: 'বিষয়সমূহ',
  },
  {
    about: (label: string) => `${label}: goals by subject, textbooks, study and memorisation lists, with links to read online.`,
    title: 'syllabus',
    lede: (n: string) => `${n} subjects. Tick each one off when you finish it; your progress is saved on this device.`,
    online: '(read online, opens in a new tab)',
    subjects: 'Subjects',
  },
)

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = await getLang()
  const level = getLevel((await params).level, lang)
  if (!level) return {}
  return pageMeta(lang, `/syllabus/${level.key}`, { title: level.label, description: T[lang].about(level.label) })
}

function Lists({ lists, online, heading: H = 'h3' }: { lists: SyllabusList[]; online: string; heading?: 'h3' | 'h4' }) {
  return (
    <div className="mt-5 grid gap-5">
      {lists.map((list) => (
        <div key={list.label}>
          <H className="w-fit rounded-lg bg-pale-2 px-3 py-1 text-[0.88rem] font-bold text-primary">{list.label}</H>
          <ul className="mt-3 grid gap-2">
            {list.items.map((item) => (
              <li key={item.text} className="flex items-start gap-3 rounded-xl px-1 py-1">
                <ProgressCheck id={item.id!} label={item.text} />
                {item.url ? (
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="group inline-flex flex-1 items-start gap-1.5 leading-relaxed text-ink hover:text-primary">
                    <span>{item.text}</span>
                    <ExternalLink className="mt-1.5 size-3.5 shrink-0 text-subtle group-hover:text-primary" />
                    <span className="sr-only">{online}</span>
                  </a>
                ) : (
                  <span className="flex-1 leading-relaxed text-ink">{item.text}</span>
                )}
              </li>
            ))}
          </ul>
          {list.note && <p className="mt-2 text-[0.9rem] text-subtle">{list.note}</p>}
        </div>
      ))}
    </div>
  )
}

function Objectives({ items }: { items: string[] }) {
  if (!items.length) return null
  return (
    <ul className="mt-4 grid gap-1.5">
      {items.map((o) => (
        <li key={o} className="flex items-start gap-2 text-[0.98rem] leading-relaxed text-ink/80">
          <CheckCircle className="mt-1 size-4 shrink-0 text-success" />
          {o}
        </li>
      ))}
    </ul>
  )
}

export default async function LevelPage({ params }: Props) {
  const lang = await getLang()
  const t = T[lang]
  const level = getLevel((await params).level, lang)
  if (!level) notFound()
  const ids = levelItems(level).map((x) => x.id)

  return (
    <>
      <PageHeader title={[{ hl: level.name }, t.title]} lede={t.lede(num(lang, level.subjects.length))}>
        <LevelNav active={level.key} />
      </PageHeader>
      <div className="wrap grid max-w-6xl gap-6 py-12 md:py-16 lg:grid-cols-[1fr_300px] lg:items-start">
        <div className="grid gap-5">
          {level.subjects.map((s, i) => (
            <section key={s.title} aria-labelledby={`s-${i}`} data-reveal="fade" style={vars({ '--d': `${(i % 2) * 80}ms` })} className="card p-6 md:p-8">
              <h2 id={`s-${i}`} className="flex items-baseline gap-3 text-[1.35rem] font-bold text-ink md:text-[1.5rem]">
                <span className="text-primary">{s.number ?? num(lang, i + 1)}.</span>
                {s.title}
              </h2>
              <Objectives items={s.objectives} />
              {s.lists.length > 0 && <Lists lists={s.lists} online={t.online} />}
              {s.subsections?.map((x) => (
                <div key={x.heading} className="mt-6 border-t border-border pt-5">
                  <h3 className="text-[1.1rem] font-bold text-ink">{x.heading}</h3>
                  <Objectives items={x.objectives} />
                  {x.lists.length > 0 && <Lists lists={x.lists} online={t.online} heading="h4" />}
                </div>
              ))}
            </section>
          ))}
        </div>
        <aside className="lg:sticky lg:top-24">
          <LevelProgress ids={ids} />
          <nav aria-label={t.subjects} className="mt-4 hidden rounded-2xl bg-white p-5 shadow-[0_4px_24px_rgb(11_31_51/0.06)] lg:block">
            <p className="font-semibold text-ink">{t.subjects}</p>
            <ol className="mt-2 grid gap-1 text-[0.95rem]">
              {level.subjects.map((s, i) => (
                <li key={s.title}>
                  <a href={`#s-${i}`} className="block rounded-lg px-2 py-1 text-muted hover:bg-pale hover:text-primary">
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>
      </div>
    </>
  )
}
