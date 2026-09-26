import type { Metadata } from 'next'
import Link from 'next/link'

import { CampusDirectory } from '@/components/content/CampusDirectory'
import { ArrowRight, ExternalLink } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { FACULTIES, HALLS } from '@/lib/campus'

export const metadata: Metadata = {
  title: 'ক্যাম্পাস গাইড',
  description: 'চট্টগ্রাম বিশ্ববিদ্যালয়ের অনুষদ, বিভাগ, হল ও শাটল ট্রেন — নবীন শিক্ষার্থীদের জন্য এক পাতায়।',
  alternates: { canonical: '/services/campus' },
}

const FACTS = [
  { k: 'অবস্থান', v: 'ফতেহপুর, হাটহাজারী; চট্টগ্রাম শহর থেকে প্রায় ২২ কিলোমিটার উত্তরে' },
  { k: 'আয়তন', v: 'প্রায় ২,৩১২ একর পাহাড়ি ক্যাম্পাস' },
  { k: 'শাটল ট্রেন', v: 'বটতলী (চট্টগ্রাম স্টেশন) থেকে ক্যাম্পাস পর্যন্ত শিক্ষার্থীদের প্রধান যাতায়াত' },
]

export default function CampusPage() {
  return (
    <>
      <PageHeader
        title={['ক্যাম্পাস', { hl: 'গাইড' }]}
        lede="নতুন ক্যাম্পাসে প্রথম দিনগুলো সহজ করতে: কোন বিভাগ কোন অনুষদে, কোন হল কোথায়, শহর থেকে কীভাবে আসবে।"
      />

      <div className="wrap py-12 md:py-16">
        <dl className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {FACTS.map((f, i) => (
            <div key={f.k} data-reveal="fade" style={vars({ '--d': `${i * 100}ms` })} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
              <dt className="text-[0.9rem] font-semibold text-primary">{f.k}</dt>
              <dd className="mt-1 text-[1.02rem] leading-relaxed text-ink">{f.v}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="departments-title" className="mt-20" id="departments">
          <SectionTitle id="departments-title" parts={['অনুষদ ও', { hl: 'বিভাগ' }]} />
          <div className="mx-auto mt-10 max-w-6xl">
            <CampusDirectory faculties={FACULTIES} />
          </div>
        </section>

        <section aria-labelledby="halls-title" className="mt-20" id="halls">
          <SectionTitle id="halls-title" parts={['হল ও', { hl: 'হোস্টেল' }]} />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HALLS.map((h, i) => (
              <li
                key={h.value}
                data-reveal="fade"
                style={vars({ '--d': `${(i % 3) * 80}ms` })}
                className="rounded-2xl bg-white px-5 py-4 font-semibold text-ink shadow-[0_4px_24px_rgb(11_15_46/0.06)]"
              >
                {h.label}
              </li>
            ))}
          </ul>
        </section>

        <aside className="mx-auto mt-14 max-w-5xl rounded-3xl bg-pale p-6 text-[0.95rem] leading-relaxed text-ink/80 md:flex md:items-center md:justify-between md:gap-6 md:p-8">
          <p>
            তালিকা বিশ্ববিদ্যালয়ের অফিসিয়াল ডিরেক্টরি অনুযায়ী। ভর্তি, ফি বা আসন বরাদ্দের মতো বিষয়ে সবসময় বিশ্ববিদ্যালয়ের নোটিশ দেখে নিন।
          </p>
          <div className="mt-4 flex shrink-0 flex-wrap gap-3 md:mt-0">
            <a href="https://cu.ac.bd/faculty-dept-inst/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              বিভাগ ডিরেক্টরি
              <ExternalLink className="size-4" />
            </a>
            <a href="https://cu.ac.bd/residence-halls/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              হল ডিরেক্টরি
              <ExternalLink className="size-4" />
            </a>
          </div>
        </aside>

        <div className="mt-12 flex justify-center">
          <Link href="/join/feedback" className="btn btn-outline-blue">
            প্রশ্ন আছে? আমাদের জিজ্ঞেস করো
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}
