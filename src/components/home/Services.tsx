import { Link } from '@/i18n/link'

import { ART } from '@/components/art/Icons3D'
import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { SERVICES } from '@/content/home'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

const T = copy({ live: 'চালু আছে', soon: 'শীঘ্রই', use: 'ব্যবহার করুন' }, { live: 'Available now', soon: 'Coming soon', use: 'Open' })

const THEMES = {
  blue: { fill: '#f3f6ff', edge: 'linear-gradient(135deg,#3564ff,#a9bcff 55%,#eef2ff)', badge: 'bg-[#e0e8ff] text-[#2446c7]' },
  teal: { fill: '#effbf9', edge: 'linear-gradient(135deg,#14b8a6,#99f6e4 55%,#effbf9)', badge: 'bg-[#ccfbf1] text-[#0f766e]' },
  purple: { fill: '#f6f2ff', edge: 'linear-gradient(135deg,#8b5cf6,#d6c8ff 55%,#f6f2ff)', badge: 'bg-[#ede9fe] text-[#6d28d9]' },
  pink: { fill: '#fff1f5', edge: 'linear-gradient(135deg,#ec4899,#fbcfe8 55%,#fff1f5)', badge: 'bg-[#fce7f3] text-[#be185d]' },
  orange: { fill: '#fff6ed', edge: 'linear-gradient(135deg,#f97316,#fed7aa 55%,#fff6ed)', badge: 'bg-[#ffedd5] text-[#c2410c]' },
  green: { fill: '#effaf3', edge: 'linear-gradient(135deg,#22c55e,#bbf7d0 55%,#effaf3)', badge: 'bg-[#dcfce7] text-[#15803d]' },
} as const

/** Gradient-bordered "ecosystem" cards (Phitron): live services link through, the rest say when. */
export async function ServiceCards() {
  const lang = await getLang()
  const words = T[lang]
  const sorted = [...SERVICES].sort((a, b) => Number('href' in b) - Number('href' in a))
  return (
    <ul className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2 lg:grid-cols-3">
      {sorted.map((s, i) => {
        const t = THEMES[s.theme]
        const Art = ART[s.icon]
        const href = 'href' in s ? s.href : undefined
        return (
          <li
            key={s.icon + s.theme}
            data-reveal="fade"
            style={vars({ '--d': `${(i % 3) * 120}ms`, '--fill': t.fill, '--edge': t.edge })}
            className={`edge group relative flex flex-col items-start gap-3 rounded-[18px] p-7 md:p-9 ${href ? 'transition-transform hover:-translate-y-1' : ''}`}
          >
            <div className="flex w-full items-start justify-between gap-4">
              <Art className="art-shadow w-12" />
              <span className={`chip ${href ? 'bg-[#dcfce7] text-[#15803d]' : t.badge}`}>{href ? words.live : words.soon}</span>
            </div>
            <h3 className="mt-2 text-[1.25rem] font-bold leading-snug text-ink">
              {href ? (
                <Link href={href} className="after:absolute after:inset-0">
                  {s.title[lang]}
                </Link>
              ) : (
                s.title[lang]
              )}
            </h3>
            <p className="text-[0.98rem] leading-relaxed text-muted">{s.text[lang]}</p>
            {href && (
              <span className="mt-auto inline-flex items-center gap-2 pt-1 font-semibold text-primary">
                {words.use}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </span>
            )}
          </li>
        )
      })}
    </ul>
  )
}
