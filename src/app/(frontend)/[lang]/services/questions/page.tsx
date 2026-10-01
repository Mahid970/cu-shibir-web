import type { Metadata } from 'next'

import { ArrowRight, Search } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { DEPARTMENTS, FACULTIES, optionLabel } from '@/lib/campus'
import { getPapers } from '@/lib/cms'
import { EXAMS, LEVELS } from '@/lib/services/questions'

const T = copy(
  {
    meta: {
      title: 'প্রশ্ন ব্যাংক',
      description: 'চট্টগ্রাম বিশ্ববিদ্যালয়ের বিভাগ ও কোর্স অনুযায়ী আগের বছরের পরীক্ষার প্রশ্নপত্র, শিক্ষার্থীদের পাঠানো ও যাচাই করা।',
    },
    title: ['প্রশ্ন', 'ব্যাংক'],
    lede: 'বিভাগ ও কোর্স অনুযায়ী আগের বছরের প্রশ্নপত্র। শিক্ষার্থীরা পাঠান, দায়িত্বপ্রাপ্তরা যাচাই করে খোলেন।',
    upload: 'প্রশ্নপত্র পাঠান',
    department: 'বিভাগ',
    all: 'সব বিভাগ',
    q: 'কোর্স কোড বা নাম',
    find: 'খুঁজুন',
    found: (n: string) => `${n}টি প্রশ্নপত্র`,
    open: (kind: string) => `${kind} খুলুন`,
    pdf: 'PDF',
    image: 'ছবি',
    none: 'এই খোঁজে কোনো প্রশ্নপত্র পাওয়া যায়নি। অন্য কোড দিয়ে খুঁজুন, অথবা আপনার কাছে থাকলে পাঠান।',
    empty: 'প্রশ্ন ব্যাংক এখনো ফাঁকা। আপনার কাছে থাকা আগের পরীক্ষার প্রশ্ন দিয়ে শুরু করুন।',
    note: 'প্রশ্নপত্র শিক্ষার্থীদের পাঠানো; বিশ্ববিদ্যালয়ের অফিসিয়াল সংগ্রহ নয়। ভুল বা আপত্তিকর কিছু চোখে পড়লে ছাত্র সমস্যা ডেস্কে জানান।',
  },
  {
    meta: {
      title: 'Question bank',
      description: 'Past University of Chittagong exam papers by department and course, sent in by students and checked before they are published.',
    },
    title: ['Question', 'bank'],
    lede: 'Past exam papers by department and course. Students send them in; they are checked before they open to everyone.',
    upload: 'Send a paper',
    department: 'Department',
    all: 'All departments',
    q: 'Course code or title',
    find: 'Search',
    found: (n: string) => `${n} ${n === '1' ? 'paper' : 'papers'}`,
    open: (kind: string) => `Open ${kind}`,
    pdf: 'PDF',
    image: 'photo',
    none: 'No papers match this search. Try another code, or send one if you have it.',
    empty: 'The question bank is empty so far. Start it with a past paper you have.',
    note: 'The papers are sent in by students; this is not the university’s official collection. If you see something wrong or offensive, tell the student issues desk.',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/questions', T[lang].meta)
}

const VALID = new Set(DEPARTMENTS.map((d) => d.value))

export default async function QuestionsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const lang = await getLang()
  const t = T[lang]
  const sp = await searchParams
  const department = typeof sp.dept === 'string' && VALID.has(sp.dept) ? sp.dept : undefined
  const q = typeof sp.q === 'string' ? sp.q.trim().slice(0, 40) : ''
  const { docs, totalDocs } = await getPapers({ department, q: q || undefined })
  const filtered = Boolean(department || q)

  // One card per course, newest exam first inside it.
  const courses = new Map<string, typeof docs>()
  for (const d of docs) {
    const key = `${d.department}|${d.courseCode}`
    courses.set(key, [...(courses.get(key) ?? []), d])
  }
  const label = <V extends string>(list: readonly { value: V; label: string; en: string }[], value?: string | null) => {
    const o = list.find((x) => x.value === value)
    return o ? (lang === 'en' ? o.en : o.label) : ''
  }

  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede}>
        <div className="load-rise mt-8 flex justify-center" style={vars({ '--d': '350ms' })}>
          <Link href="/services/questions/upload" className="btn btn-yellow">
            {t.upload}
            <ArrowRight />
          </Link>
        </div>
      </PageHeader>

      <div className="wrap max-w-5xl py-12 md:py-16">
        <form role="search" className="grid gap-3 rounded-3xl bg-white p-5 shadow-[0_4px_24px_rgb(11_15_46/0.06)] sm:grid-cols-[1.2fr_1fr_auto] sm:items-end md:p-6">
          <label className="grid min-w-0 gap-1.5">
            <span className="font-semibold text-ink">{t.department}</span>
            <select name="dept" defaultValue={department ?? ''} className="h-12 w-full min-w-0 rounded-xl border border-[#d9dde8] bg-white px-3 text-ink">
              <option value="">{t.all}</option>
              {FACULTIES.map((f) => (
                <optgroup key={f.value} label={optionLabel(f, lang)}>
                  {f.departments.map((d) => (
                    <option key={d.value} value={d.value}>
                      {optionLabel(d, lang)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </label>
          <label className="grid min-w-0 gap-1.5">
            <span className="font-semibold text-ink">{t.q}</span>
            <input name="q" defaultValue={q} placeholder="CSE 211" className="h-12 w-full min-w-0 rounded-xl border border-[#d9dde8] px-4 text-ink" />
          </label>
          <button type="submit" className="btn btn-gradient h-12">
            <Search className="size-5" />
            {t.find}
          </button>
        </form>

        {totalDocs === 0 ? (
          <p className="mt-10 rounded-3xl bg-pale p-8 text-center text-[1.05rem] leading-relaxed text-muted">{filtered ? t.none : t.empty}</p>
        ) : (
          <>
            <p className="mt-8 text-subtle" aria-live="polite">
              {t.found(num(lang, totalDocs))}
            </p>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {[...courses.values()].map((papers) => {
                const first = papers[0]
                const dept = DEPARTMENTS.find((d) => d.value === first.department)
                return (
                  <li key={`${first.department}-${first.courseCode}`} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
                    <h2 className="text-[1.15rem] font-bold text-ink">
                      <span className="font-[family-name:var(--font-en)]">{first.courseCode}</span>
                      {first.courseTitle && <span className="font-semibold text-ink/80">: {first.courseTitle}</span>}
                    </h2>
                    {dept && <p className="mt-0.5 text-[0.9rem] text-subtle">{optionLabel(dept, lang)}</p>}
                    <ul className="mt-4 grid gap-2">
                      {papers.map((p) => {
                        const kind = p.mimeType === 'application/pdf' ? t.pdf : t.image
                        return (
                          <li key={p.id} className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-pale px-4 py-3">
                            <span className="text-ink">
                              <span className="font-semibold">{num(lang, p.examYear)}</span> {label(EXAMS, p.exam)}
                              {p.level && <span className="text-subtle"> ({label(LEVELS, p.level)})</span>}
                            </span>
                            {p.url && (
                              <a href={p.url} target="_blank" rel="noopener" className="font-semibold text-primary underline">
                                {t.open(kind)}
                              </a>
                            )}
                          </li>
                        )
                      })}
                    </ul>
                  </li>
                )
              })}
            </ul>
          </>
        )}

        <p className="mt-10 text-center text-[0.92rem] text-subtle">{t.note}</p>
      </div>
    </>
  )
}
