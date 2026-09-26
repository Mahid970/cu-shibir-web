import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { LevelNav } from '@/components/syllabus/LevelNav'
import { LevelProgress } from '@/components/syllabus/progress'
import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { levelItems, syllabus } from '@/content/syllabus'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    meta: {
      title: 'সিলেবাস',
      description: 'বাংলাদেশ ইসলামী ছাত্রশিবিরের কর্মী, সাথী ও সদস্য সিলেবাস — বইয়ের অনলাইন লিংক ও নিজের অগ্রগতির চেকলিস্টসহ।',
    },
    title: ['সিলেবাস ও', 'লাইব্রেরি'],
    lede: 'কর্মী থেকে সাথী, সাথী থেকে সদস্য: প্রতিটি স্তরের পাঠ্যবই, অধ্যয়ন ও মুখস্থের তালিকা। বইয়ের নামে চাপলে অনলাইনে পড়া যাবে।',
    steps: ['প্রথম ধাপ', 'দ্বিতীয় ধাপ', 'তৃতীয় ধাপ'],
    count: (s: string, b: string) => `${s}টি বিষয়, ${b}টি বই ও পাঠ`,
    open: 'খুলুন',
    library: ['বইগুলো কেন্দ্রীয় অনলাইন লাইব্রেরি', 'থেকে পড়া যায়। সিলেবাস নিয়ে প্রশ্ন থাকলে তোমার দায়িত্বশীলকে জিজ্ঞেস করো।'],
  },
  {
    meta: {
      title: 'Syllabus',
      description: 'The worker, associate and member syllabus of Bangladesh Islami Chhatrashibir, with links to read the books online and a checklist of your own progress.',
    },
    title: ['Syllabus and', 'library'],
    lede: 'From worker to associate, from associate to member: the textbooks, study and memorisation lists for each level. Tap a book to read it online (the books are in Bangla).',
    steps: ['Step one', 'Step two', 'Step three'],
    count: (s: string, b: string) => `${s} subjects, ${b} books and readings`,
    open: 'Open',
    library: ['The books can be read on the central online library,', '. If you have questions about the syllabus, ask your leader.'],
  },
)

const TONE = ['bg-[#fdf3e7]', 'bg-[#eef2ff]', 'bg-[#e9f9ff]']

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/syllabus', T[lang].meta)
}

export default async function SyllabusPage() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede}>
        <LevelNav />
      </PageHeader>
      <div className="wrap py-12 md:py-16">
        <ol className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {syllabus(lang).map((l, i) => {
            const items = levelItems(l)
            return (
              <li key={l.key} data-reveal="fade" style={vars({ '--d': `${i * 120}ms` })} className={`group relative flex flex-col gap-3 rounded-3xl p-7 ${TONE[i]}`}>
                <p className="text-[0.9rem] font-semibold text-primary">{t.steps[i]}</p>
                <h2 className="text-[1.5rem] font-bold text-ink">
                  <Link href={`/syllabus/${l.key}`} className="after:absolute after:inset-0">
                    {l.label}
                  </Link>
                </h2>
                <p className="text-muted">
                  {t.count(num(lang, l.subjects.length), num(lang, items.length))}
                </p>
                <div className="mt-auto pt-2">
                  <LevelProgress ids={items.map((x) => x.id)} compact />
                </div>
                <span className="inline-flex items-center gap-2 font-semibold text-primary">
                  {t.open}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mx-auto mt-10 max-w-2xl text-center text-[0.95rem] text-muted">
          {t.library[0]}{' '}
          <a href="https://www.icsbook.info" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
            icsbook.info
          </a>
          {lang === 'bn' && ' '}
          {t.library[1]}
        </p>
      </div>
    </>
  )
}
