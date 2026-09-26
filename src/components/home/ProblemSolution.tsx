import { Link } from '@/i18n/link'

import { ArrowRight, Chevrons } from '@/components/ui/Icons'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { PROBLEMS } from '@/content/home'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    title: ['সমস্যা তোমার', 'লড়াই আমাদের'],
    lede: 'ছাত্রসমস্যার সমাধান আমাদের ৫ দফার একটি। ক্যাম্পাসের কয়েকটি সমস্যা নিয়ে যা করেছি —',
    more: 'বিস্তারিত পড়ুন',
    all: 'আরও কার্যক্রম দেখুন',
  },
  {
    title: ['Your problem,', 'our fight'],
    lede: 'Solving students’ problems is one of our five points. Here is what we did about a few of them on campus.',
    more: 'Read the report',
    all: 'See more of our work',
  },
)

const TONE = {
  sky: 'bg-[#deedf7]',
  sand: 'bg-[#f7f0d8]',
  pink: 'bg-[#f1d7f3]',
}

/** Campus problems paired with what the branch did about them; each pair fades in as it arrives. */
export async function ProblemSolution() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <section className="cv-auto py-16 md:py-24" aria-labelledby="problems">
      <div className="wrap">
        <SectionTitle
          id="problems"
          parts={[t.title[0], { node: <Chevrons className="nudge size-9 text-success md:size-11" /> }, { hl: t.title[1] }]}
        />
        <p className="lede">{t.lede}</p>

        <ol className="mx-auto mt-12 max-w-5xl space-y-6 md:space-y-8">
          {PROBLEMS.map((p) => (
            <li
              key={p.href}
              data-reveal="fade"
              data-amount="0.4"
              className="grid items-center gap-3 md:grid-cols-[1fr_64px_1fr] md:gap-0"
            >
              <div className={`rounded-[28px] p-6 shadow-[0_20px_40px_rgb(31_59_115/0.06)] md:p-8 ${TONE[p.tone]}`}>
                <span className="chip bg-white/75 text-[#c2410c]">{p.tag[lang]}</span>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink md:text-[1.1rem]">{p.problem[lang]}</p>
              </div>
              <span aria-hidden="true" className="mx-auto h-8 w-0 border-l-2 border-dashed border-success md:h-0 md:w-full md:border-l-0 md:border-t-2" />
              <div className="rounded-[28px] bg-[linear-gradient(135deg,#5fcf94,#2e8b57)] p-6 text-white shadow-[0_20px_40px_rgb(46_139_87/0.25)] md:p-8">
                <span className="grid size-10 place-items-center rounded-full bg-white">
                  <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                    <path d="m6 12.5 4 4 8-9" fill="none" stroke="#2e8b57" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
                <p className="mt-4 text-[1.05rem] font-semibold leading-relaxed md:text-[1.1rem]">{p.answer[lang]}</p>
                <Link href={p.href} className="mt-3 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-white/90 hover:text-white hover:underline">
                  {t.more}
                  <ArrowRight className="size-4" />
                </Link>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex justify-center">
          <Link href="/news" className="btn btn-outline-blue">
            {t.all}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
