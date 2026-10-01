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
  sky: { card: 'bg-[#e6f3f8]', chip: 'text-[#0b5f8c]' },
  sand: { card: 'bg-[#fff3dd]', chip: 'text-[#9a5b00]' },
  pink: { card: 'bg-[#fbe8e6]', chip: 'text-[#b23a2e]' },
}

/**
 * Campus problems chained to what the branch did about them. As each row arrives the problem
 * slides in, a line draws across with a spark running along it, the answer card lights up and
 * its tick draws itself.
 */
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
            <li key={p.href} data-reveal="chain" data-amount="0.35" className="ps-row grid items-center gap-3 md:grid-cols-[1fr_88px_1fr] md:gap-0">
              <div className={`ps-problem rounded-[28px] p-6 shadow-[0_20px_40px_rgb(10_34_51/0.06)] md:p-8 ${TONE[p.tone].card}`}>
                <span className={`chip bg-white/80 ${TONE[p.tone].chip}`}>{p.tag[lang]}</span>
                <p className="mt-4 text-[1.05rem] leading-relaxed text-ink md:text-[1.1rem]">{p.problem[lang]}</p>
              </div>
              <span aria-hidden="true" className="ps-link relative mx-auto block h-10 w-0.5 md:h-0.5 md:w-full">
                <span className="ps-line absolute inset-0 rounded-full bg-[linear-gradient(90deg,#ffb35e,var(--cta))] max-md:bg-[linear-gradient(180deg,#ffb35e,var(--cta))]" />
                <span className="ps-spark absolute left-1/2 top-0 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_4px_rgb(25_195_125/0.8)] md:left-0 md:top-1/2" />
              </span>
              <div className="ps-answer rounded-[28px] bg-[linear-gradient(135deg,#119160,#075a3a)] p-6 text-white shadow-[0_20px_40px_rgb(7_90_58/0.28)] md:p-8">
                <span className="grid size-10 place-items-center rounded-full bg-white">
                  <svg viewBox="0 0 24 24" className="size-6" aria-hidden="true">
                    <path className="ps-check" d="m6 12.5 4 4 8-9" fill="none" stroke="#119160" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" pathLength={1} />
                  </svg>
                </span>
                <p className="mt-4 text-[1.05rem] font-semibold leading-relaxed md:text-[1.1rem]">{p.answer[lang]}</p>
                <Link href={p.href} className="group mt-3 inline-flex items-center gap-1.5 text-[0.95rem] font-semibold text-white/90 hover:text-white hover:underline">
                  {t.more}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
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
