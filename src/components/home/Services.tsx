import { Link } from '@/i18n/link'

import { ART } from '@/components/art/Icons3D'
import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { SERVICES } from '@/content/home'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

const T = copy({ live: 'চালু আছে', soon: 'শীঘ্রই', use: 'ব্যবহার করুন' }, { live: 'Available now', soon: 'Coming soon', use: 'Open' })

/** Two edges from the one palette, alternating down the grid. */
const THEMES = {
  sky: { fill: '#f3f9fd', edge: 'linear-gradient(135deg,#1fa3dc,#b5e3f7 55%,#eaf3f9)', badge: 'bg-pale-2 text-primary' },
  navy: { fill: '#f2f6fa', edge: 'linear-gradient(135deg,#114575,#9cc3e0 55%,#eaf3f9)', badge: 'bg-pale-3 text-blue-deep' },
} as const

/** Gradient-bordered service cards: live services link through, the rest say when. */
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
            key={s.icon}
            data-reveal="fade"
            style={vars({ '--d': `${(i % 3) * 120}ms`, '--fill': t.fill, '--edge': t.edge })}
            className={`edge group relative flex flex-col items-start gap-3 rounded-[18px] p-7 md:p-9 ${href ? 'transition-transform hover:-translate-y-1' : ''}`}
          >
            <div className="flex w-full items-start justify-between gap-4">
              <Art className="art-shadow w-12" />
              <span className={`chip ${href ? 'bg-[#e3f4ea] text-[#17703e]' : t.badge}`}>{href ? words.live : words.soon}</span>
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
