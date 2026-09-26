import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { LevelNav } from '@/components/syllabus/LevelNav'
import { LevelProgress } from '@/components/syllabus/progress'
import { ArrowRight } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { SYLLABUS, levelItems } from '@/content/syllabus'
import { toBnDigits } from '@/lib/bn'

export const metadata: Metadata = {
  title: 'সিলেবাস',
  description: 'বাংলাদেশ ইসলামী ছাত্রশিবিরের কর্মী, সাথী ও সদস্য সিলেবাস — বইয়ের অনলাইন লিংক ও নিজের অগ্রগতির চেকলিস্টসহ।',
  alternates: { canonical: '/syllabus' },
}

const STEP = ['প্রথম ধাপ', 'দ্বিতীয় ধাপ', 'তৃতীয় ধাপ']
const TONE = ['bg-[#fdf3e7]', 'bg-[#eef2ff]', 'bg-[#e9f9ff]']

export default function SyllabusPage() {
  return (
    <>
      <PageHeader title={['সিলেবাস ও', { hl: 'লাইব্রেরি' }]} lede="কর্মী থেকে সাথী, সাথী থেকে সদস্য: প্রতিটি স্তরের পাঠ্যবই, অধ্যয়ন ও মুখস্থের তালিকা। বইয়ের নামে চাপলে অনলাইনে পড়া যাবে।">
        <LevelNav />
      </PageHeader>
      <div className="wrap py-12 md:py-16">
        <ol className="mx-auto grid max-w-5xl gap-5 md:grid-cols-3">
          {SYLLABUS.map((l, i) => {
            const items = levelItems(l)
            return (
              <li key={l.key} data-reveal="fade" style={vars({ '--d': `${i * 120}ms` })} className={`group relative flex flex-col gap-3 rounded-3xl p-7 ${TONE[i]}`}>
                <p className="text-[0.9rem] font-semibold text-primary">{STEP[i]}</p>
                <h2 className="text-[1.5rem] font-bold text-ink">
                  <Link href={`/syllabus/${l.key}`} className="after:absolute after:inset-0">
                    {l.label}
                  </Link>
                </h2>
                <p className="text-muted">
                  {toBnDigits(l.subjects.length)}টি বিষয়, {toBnDigits(items.length)}টি বই ও পাঠ
                </p>
                <div className="mt-auto pt-2">
                  <LevelProgress ids={items.map((x) => x.id)} compact />
                </div>
                <span className="inline-flex items-center gap-2 font-semibold text-primary">
                  খুলুন
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                </span>
              </li>
            )
          })}
        </ol>
        <p className="mx-auto mt-10 max-w-2xl text-center text-[0.95rem] text-muted">
          বইগুলো কেন্দ্রীয় অনলাইন লাইব্রেরি{' '}
          <a href="https://www.icsbook.info" target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline">
            icsbook.info
          </a>{' '}
          থেকে পড়া যায়। সিলেবাস নিয়ে প্রশ্ন থাকলে তোমার দায়িত্বশীলকে জিজ্ঞেস করো।
        </p>
      </div>
    </>
  )
}
