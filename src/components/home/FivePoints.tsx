import type { CSSProperties } from 'react'

import { ART } from '@/components/art/Icons3D'
import { EyebrowTab, SweepTitle } from '@/components/ui/SectionTitle'
import { FIVE_POINTS } from '@/content/home'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'

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
 * ৫ দফা as stacked "folder" cards on a deep night background: each card pins
 * under the header and the next one slides over it, leaving the coloured tabs visible.
 */
export async function FivePoints() {
  const lang = await getLang()
  const t = T[lang]
  return (
    <section className="relative isolate bg-deep pb-20 text-white md:pb-28" aria-labelledby="five-points">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_20%,#000,transparent)]" />
        <div className="absolute left-1/2 top-40 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_96_250/0.35),transparent)] blur-2xl" />
      </div>
      <EyebrowTab text={t.eyebrow} />
      <div className="wrap mt-8 text-center md:mt-10">
        <SweepTitle id="five-points" className="mx-auto max-w-3xl text-[2rem] font-bold leading-snug text-white sm:text-[2.75rem]">
          {t.title[0]} <span className="lime">{t.title[1]}</span> {t.title[2]}
        </SweepTitle>
        <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-slate-400 sm:text-[1.1rem]">{t.lede}</p>
      </div>

      <ol className="wrap mt-14 space-y-6 md:space-y-10">
        {FIVE_POINTS.map((p, i) => {
          const Art = ART[p.icon]
          return (
            <li key={p.icon} className="md:sticky" style={{ top: `calc(96px + ${i * 16}px)` }}>
              <div className="relative pt-10">
                <span
                  className="absolute left-6 top-0 flex h-11 items-start rounded-t-2xl px-6 pt-2.5 text-[0.85rem] font-bold tracking-[0.2em] md:left-[var(--tab-x)]"
                  style={{ '--tab-x': `${4 + i * 17}%`, background: p.color, color: p.ink } as CSSProperties}
                >
                  {t.point} {num(lang, String(i + 1).padStart(2, '0'))}
                </span>
                <div
                  className="relative grid items-center gap-6 rounded-[28px] p-5 shadow-[0_-16px_40px_rgb(0_0_0/0.35)] md:grid-cols-[minmax(0,400px)_1fr] md:gap-10 md:p-8 lg:min-h-[400px]"
                  style={{ background: p.color, color: p.ink }}
                >
                  <div className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-2xl bg-white/15">
                    <span aria-hidden="true" className="absolute -bottom-10 -right-2 text-[13rem] font-bold leading-none opacity-15">
                      {num(lang, i + 1)}
                    </span>
                    <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_40%_35%,rgb(255_255_255/0.35),transparent)]" />
                    <Art className="art-shadow relative w-28 md:w-36" />
                  </div>
                  <div>
                    <h3 className="text-[1.7rem] font-bold leading-snug md:text-[2.3rem]" style={{ color: p.ink }}>
                      {p.title[lang]}
                    </h3>
                    <p className="mt-3 max-w-xl text-[1.02rem] leading-relaxed md:text-[1.1rem]">{p.body[lang]}</p>
                    <p className="mt-5 font-bold">{t.recent}</p>
                    <ul className="mt-2 space-y-1.5">
                      {p.items[lang].map((item) => (
                        <li key={item} className="flex items-start gap-2.5 text-[1rem]">
                          <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-current" />
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
      </ol>
    </section>
  )
}
