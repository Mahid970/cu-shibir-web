import type { CSSProperties } from 'react'

import { ART } from '@/components/art/Icons3D'
import { EyebrowTab, StarGlyph, SweepTitle, vars } from '@/components/ui/SectionTitle'
import { FIVE_POINTS } from '@/content/home'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'

import { StackDepth } from './StackDepth'

const T = copy(
  {
    eyebrow: 'আমাদের কর্মসূচি',
    title: ['আমাদের', '৫ দফা', 'কর্মসূচি'],
    lede: 'আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন — এই লক্ষ্যে আমাদের কাজ পাঁচ ভাগে।',
    point: 'দফা',
    recent: 'সাম্প্রতিক কাজ',
  },
  {
    eyebrow: 'Our programme',
    title: ['Our', 'five-point', 'programme'],
    lede: 'To attain the pleasure of Allah by rebuilding every aspect of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him). Our work towards this goal has five parts.',
    point: 'Point',
    recent: 'Recent work',
  },
)

/**
 * ৫ দফা as stacked cards on the night background: each card pins under the header and the next
 * slides over it, leaving the coloured tabs visible, while the covered card sinks back a little.
 * Each card's contents rise in as it arrives.
 */
export async function FivePoints() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <section className="relative isolate bg-deep pb-20 text-white md:pb-28" aria-labelledby="five-points">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="lattice-night absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_20%,#000,transparent)]" />
        <div className="absolute left-1/2 top-40 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(11_111_164/0.4),transparent)] blur-2xl" />
      </div>
      <EyebrowTab text={t.eyebrow} />
      <div className="wrap mt-8 text-center md:mt-10">
        <SweepTitle id="five-points" className="mx-auto max-w-3xl text-[2rem] font-bold leading-snug text-white sm:text-[2.75rem]">
          {t.title[0]} <span className="glow">{t.title[1]}</span> {t.title[2]}
        </SweepTitle>
        <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-slate-400 sm:text-[1.1rem]">{t.lede}</p>
      </div>

      <StackDepth className="five-stack wrap mt-14 space-y-6 md:space-y-10">
        {FIVE_POINTS.map((p, i) => {
          const Art = ART[p.icon]
          return (
            <li key={p.icon} className="md:sticky" style={{ top: `calc(96px + ${i * 16}px)` }}>
              <div className="relative pt-10">
                <span
                  className="absolute left-6 top-0 flex h-11 items-center gap-2 rounded-t-2xl px-5 pb-1 text-[0.88rem] font-bold md:left-[var(--tab-x)]"
                  style={{ '--tab-x': `${4 + i * 17}%`, background: p.color, color: p.ink } as CSSProperties}
                >
                  <StarGlyph className="size-3.5" />
                  {t.point} {num(lang, String(i + 1).padStart(2, '0'))}
                </span>
                <div
                  data-reveal="card"
                  data-amount="0.3"
                  className="five-card relative grid items-center gap-6 rounded-[28px] p-5 shadow-[0_-16px_40px_rgb(0_0_0/0.35)] md:grid-cols-[minmax(0,400px)_1fr] md:gap-10 md:p-8 lg:min-h-[400px]"
                  style={{ background: p.color, color: p.ink }}
                >
                  <div className="five-art relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-white/15">
                    <div aria-hidden="true" className={`absolute inset-0 opacity-60 ${p.ink === '#ffffff' ? 'lattice-night' : 'lattice'}`} />
                    <span aria-hidden="true" className="five-num absolute -bottom-10 -right-2 text-[13rem] font-bold leading-none opacity-15" style={{ fontFamily: 'var(--font-display)' }}>
                      {num(lang, i + 1)}
                    </span>
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_40%_35%,rgb(255_255_255/0.35),transparent)]" />
                    <Art className="five-icon art-shadow relative w-28 md:w-36" />
                  </div>
                  <div>
                    <h3 className="five-rise text-[1.7rem] font-bold leading-snug md:text-[2.3rem]" style={{ color: p.ink }}>
                      {p.title[lang]}
                    </h3>
                    <p className="five-rise mt-3 max-w-xl text-[1.02rem] leading-relaxed md:text-[1.1rem]" style={vars({ '--d': '120ms' })}>
                      {p.body[lang]}
                    </p>
                    <p className="five-rise mt-5 font-bold" style={vars({ '--d': '220ms' })}>
                      {t.recent}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {p.items[lang].map((item, k) => (
                        <li key={item} className="five-rise flex items-start gap-2.5 text-[1rem]" style={vars({ '--d': `${300 + k * 90}ms` })}>
                          <StarGlyph className="mt-[0.35em] size-3.5 shrink-0 opacity-80" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          )
        })}
      </StackDepth>
    </section>
  )
}
