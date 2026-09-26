import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { CampusDirectory } from '@/components/content/CampusDirectory'
import { ArrowRight, ExternalLink } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { FACULTIES, HALLS, optionLabel } from '@/lib/campus'

const T = copy(
  {
    meta: {
      title: 'ক্যাম্পাস গাইড',
      description: 'চট্টগ্রাম বিশ্ববিদ্যালয়ের অনুষদ, বিভাগ, হল ও শাটল ট্রেন — নবীন শিক্ষার্থীদের জন্য এক পাতায়।',
    },
    title: ['ক্যাম্পাস', 'গাইড'],
    lede: 'নতুন ক্যাম্পাসে প্রথম দিনগুলো সহজ করতে: কোন বিভাগ কোন অনুষদে, কোন হল কোথায়, শহর থেকে কীভাবে আসবে।',
    facts: [
      { k: 'অবস্থান', v: 'ফতেহপুর, হাটহাজারী; চট্টগ্রাম শহর থেকে প্রায় ২২ কিলোমিটার উত্তরে' },
      { k: 'আয়তন', v: 'প্রায় ২,৩১২ একর পাহাড়ি ক্যাম্পাস' },
      { k: 'শাটল ট্রেন', v: 'বটতলী (চট্টগ্রাম স্টেশন) থেকে ক্যাম্পাস পর্যন্ত শিক্ষার্থীদের প্রধান যাতায়াত' },
    ],
    departments: ['অনুষদ ও', 'বিভাগ'],
    halls: ['হল ও', 'হোস্টেল'],
    note: 'তালিকা বিশ্ববিদ্যালয়ের অফিসিয়াল ডিরেক্টরি অনুযায়ী। ভর্তি, ফি বা আসন বরাদ্দের মতো বিষয়ে সবসময় বিশ্ববিদ্যালয়ের নোটিশ দেখে নিন।',
    deptDir: 'বিভাগ ডিরেক্টরি',
    hallDir: 'হল ডিরেক্টরি',
    ask: 'প্রশ্ন আছে? আমাদের জিজ্ঞেস করো',
  },
  {
    meta: {
      title: 'Campus guide',
      description: 'Faculties, departments, halls and the shuttle train of the University of Chittagong, on one page for new students.',
    },
    title: ['Campus', 'guide'],
    lede: 'To make your first days on campus easier: which department is in which faculty, where the halls are, and how to get here from the city.',
    facts: [
      { k: 'Location', v: 'Fatehpur, Hathazari, about 22 km north of Chattogram city' },
      { k: 'Area', v: 'A hill campus of about 2,312 acres' },
      { k: 'Shuttle train', v: 'The main way in for students, from Bottoli (Chattogram station) to the campus' },
    ],
    departments: ['Faculties and', 'departments'],
    halls: ['Halls and', 'hostels'],
    note: 'The lists follow the university’s official directory. For admission, fees or seat allocation, always check the university’s own notices.',
    deptDir: 'Department directory',
    hallDir: 'Hall directory',
    ask: 'Questions? Ask us',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/services/campus', T[lang].meta)
}

export default async function CampusPage() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />

      <div className="wrap py-12 md:py-16">
        <dl className="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
          {t.facts.map((f, i) => (
            <div key={f.k} data-reveal="fade" style={vars({ '--d': `${i * 100}ms` })} className="rounded-3xl bg-white p-6 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
              <dt className="text-[0.9rem] font-semibold text-primary">{f.k}</dt>
              <dd className="mt-1 text-[1.02rem] leading-relaxed text-ink">{f.v}</dd>
            </div>
          ))}
        </dl>

        <section aria-labelledby="departments-title" className="mt-20" id="departments">
          <SectionTitle id="departments-title" parts={[t.departments[0], { hl: t.departments[1] }]} />
          <div className="mx-auto mt-10 max-w-6xl">
            <CampusDirectory faculties={FACULTIES} />
          </div>
        </section>

        <section aria-labelledby="halls-title" className="mt-20" id="halls">
          <SectionTitle id="halls-title" parts={[t.halls[0], { hl: t.halls[1] }]} />
          <ul className="mx-auto mt-10 grid max-w-5xl gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {HALLS.map((h, i) => (
              <li
                key={h.value}
                data-reveal="fade"
                style={vars({ '--d': `${(i % 3) * 80}ms` })}
                className="rounded-2xl bg-white px-5 py-4 font-semibold text-ink shadow-[0_4px_24px_rgb(11_15_46/0.06)]"
              >
                {optionLabel(h, lang)}
              </li>
            ))}
          </ul>
        </section>

        <aside className="mx-auto mt-14 max-w-5xl rounded-3xl bg-pale p-6 text-[0.95rem] leading-relaxed text-ink/80 md:flex md:items-center md:justify-between md:gap-6 md:p-8">
          <p>{t.note}</p>
          <div className="mt-4 flex shrink-0 flex-wrap gap-3 md:mt-0">
            <a href="https://cu.ac.bd/faculty-dept-inst/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              {t.deptDir}
              <ExternalLink className="size-4" />
            </a>
            <a href="https://cu.ac.bd/residence-halls/" target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              {t.hallDir}
              <ExternalLink className="size-4" />
            </a>
          </div>
        </aside>

        <div className="mt-12 flex justify-center">
          <Link href="/join/feedback" className="btn btn-outline-blue">
            {t.ask}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}
