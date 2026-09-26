import { Link } from '@/i18n/link'

import { ArrowRight } from './Icons'
import { PageHeader } from './PageHeader'
import { vars, type TitlePart } from './SectionTitle'

const EDGES = [
  ['#f3f6ff', 'linear-gradient(135deg,#3564ff,#a9bcff 55%,#eef2ff)'],
  ['#effbf9', 'linear-gradient(135deg,#14b8a6,#99f6e4 55%,#effbf9)'],
  ['#f6f2ff', 'linear-gradient(135deg,#8b5cf6,#d6c8ff 55%,#f6f2ff)'],
  ['#fff6ed', 'linear-gradient(135deg,#f97316,#fed7aa 55%,#fff6ed)'],
  ['#fff1f5', 'linear-gradient(135deg,#ec4899,#fbcfe8 55%,#fff1f5)'],
  ['#effaf3', 'linear-gradient(135deg,#22c55e,#bbf7d0 55%,#effaf3)'],
]

/** Placeholder for sections scheduled in later roadmap phases (plan §9). */
export function ComingSoon({
  title,
  intro,
  features,
  children,
}: {
  title: string | TitlePart[]
  intro: string
  features?: string[]
  children?: React.ReactNode
}) {
  return (
    <>
      <PageHeader title={title} lede={intro} />
      <div className="wrap py-14 md:py-20">
        {children}
        {features && (
          <>
            <h2 className="text-center text-[1.6rem] font-bold text-ink md:text-[2rem]">এই পাতায় যা আসছে</h2>
            <ul className="mx-auto mt-8 grid max-w-5xl gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f, i) => (
                <li
                  key={f}
                  data-reveal="fade"
                  style={vars({ '--d': `${(i % 3) * 120}ms`, '--fill': EDGES[i % 6][0], '--edge': EDGES[i % 6][1] })}
                  className="edge flex items-start justify-between gap-3 rounded-[18px] p-6"
                >
                  <span className="text-[1.1rem] font-semibold text-ink">{f}</span>
                  <span className="chip shrink-0">শীঘ্রই</span>
                </li>
              ))}
            </ul>
          </>
        )}
        <div className="mt-12 flex flex-wrap justify-center gap-3">
          <Link href="/news" className="btn btn-outline-blue">
            সর্বশেষ সংবাদ
            <ArrowRight />
          </Link>
          <Link href="/join" className="btn btn-yellow">
            সমর্থক হোন
            <ArrowRight />
          </Link>
        </div>
      </div>
    </>
  )
}
