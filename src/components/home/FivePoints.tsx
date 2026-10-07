import { ART } from '@/components/art/Icons3D'
import { EyebrowTab, SweepTitle, vars } from '@/components/ui/SectionTitle'
import { FIVE_POINTS } from '@/content/home'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'

import { FolderStack } from './FolderStack'

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

// Folder-tab outlines from phitron's syllabus stack: the outer two run down into the card's rounded
// corner, the middle ones stand on two curved feet.
const TAB_EDGE = 'M234.49 30.68 228.6 17.81C223.61 6.89 213.33 0 202.07 0H28.65C15.25 0 0 13 0 30.68V87L39.75 48.49H261C249.75 48.49 239.48 41.59 234.49 30.68Z'
const TAB_MID =
  'M275.69 30.68 269.32 17.81C263.92 6.89 252.79 0 240.62 0L80.33.11C68.18.12 57.09 7 51.69 17.88L42.71 35.97C38.91 43.64 31.09 48.49 22.53 48.49H304.37C292.2 48.49 281.09 41.59 275.69 30.68Z'

/**
 * A card's tab on the pinned stack: tabs share one row from the card's left edge to its right.
 * The tabs are 316px wide; an edge tab's label centre sits 108px in from its outer side, a middle
 * tab's 150px from its left, so middle tabs are placed to space all the labels evenly.
 */
function PinTab({ i, n, color, ink, label }: { i: number; n: number; color: string; ink: string; label: string }) {
  const f = i / (n - 1)
  const first = i === 0
  const last = i === n - 1
  const edge = first || last
  return (
    <div
      aria-hidden="true"
      className="five-pin-tab pointer-events-none absolute top-0 z-10"
      style={{
        left: first ? 0 : last ? '100%' : `calc(${f} * (100% - 216px) - 42px)`,
        transform: first
          ? 'translate(0%, calc(-55.73% + 2px))'
          : last
            ? 'translate(-100%, calc(-50.61% - 2px))'
            : 'translateY(calc(-100% + 2px))',
      }}
    >
      <svg viewBox={last ? '-77 0 338 87' : edge ? '0 0 338 87' : '0 0 338 49'} className="block w-79" fill="none">
        <path d={edge ? TAB_EDGE : TAB_MID} fill={color} transform={last ? 'matrix(-1 0 0 1 261 0)' : undefined} />
      </svg>
      <span
        className="absolute inset-x-0 top-1 flex h-9 items-center justify-center whitespace-nowrap font-mono text-[15px] font-bold tracking-[0.15em] uppercase"
        style={{ color: ink, transform: `translateX(${first ? '-15.9%' : last ? '15.9%' : '-2.5%'})` }}
      >
        {label}
      </span>
    </div>
  )
}

/**
 * ৫ দফা as phitron's folder stack on the night background. Wide screens: below the heading the
 * stack pins just under the header, the cards wait below with only their tabs in a row along the
 * bottom, and each one slides up over the last as you scroll (FolderStack). Narrower screens: a list of cards, each with a centred tab.
 * Each card's contents rise in as it arrives.
 */
export async function FivePoints() {
  const lang = await getLang()
  const t = T[lang]
  const n = FIVE_POINTS.length
  return (
    <section className="relative isolate bg-deep text-white" aria-labelledby="five-points">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(60%_50%_at_50%_20%,#000,transparent)]" />
        <div className="absolute left-1/2 top-40 h-[480px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_96_250/0.35),transparent)] blur-2xl" />
      </div>
      <div>
        <EyebrowTab text={t.eyebrow} />
        <div className="wrap mt-8 text-center md:mt-10">
          <SweepTitle id="five-points" className="mx-auto max-w-3xl text-[2rem] font-bold leading-snug text-white sm:text-[2.75rem]">
            {t.title[0]} <span className="lime">{t.title[1]}</span> {t.title[2]}
          </SweepTitle>
          <p className="mx-auto mt-4 max-w-2xl text-[1rem] leading-relaxed text-slate-400 sm:text-[1.1rem]">{t.lede}</p>
        </div>
      </div>
      <FolderStack className="five-stage" steps={n - 1}>
        <div className="five-panel">
          <ol className="five-area mt-14 flex flex-col gap-12 pb-20">
            {FIVE_POINTS.map((p, i) => {
              const Art = ART[p.icon]
              const label = `${t.point} ${num(lang, String(i + 1).padStart(2, '0'))}`
              return (
                <li key={p.icon} className="five-layer" style={{ zIndex: i }}>
                  <div className="wrap h-full">
                    <div className="relative h-full">
                      <PinTab i={i} n={n} color={p.color} ink={p.ink} label={label} />
                      <div className="five-flow-tab relative mx-auto -mb-0.5 w-64">
                        <svg viewBox="0 0 338 49" aria-hidden="true" className="block w-full" fill="none">
                          <path d={TAB_MID} fill={p.color} />
                        </svg>
                        <span
                          className="absolute inset-x-0 top-0.5 flex h-8 items-center justify-center whitespace-nowrap font-mono text-[15px] font-bold tracking-[0.15em] uppercase"
                          style={{ color: p.ink, transform: 'translateX(-2.5%)' }}
                        >
                          {label}
                        </span>
                      </div>
                      <article
                        data-reveal="card"
                        data-amount="0.3"
                        className="five-card grid h-full w-full overflow-hidden rounded-[2rem] p-5 sm:p-6 md:grid-cols-[2fr_3fr] md:gap-10 md:p-8"
                        style={{ background: p.color, color: p.ink }}
                      >
                        <div className="five-art relative hidden aspect-[4/3] place-items-center overflow-hidden rounded-2xl border-8 border-white/10 bg-white/15 md:grid">
                          <span aria-hidden="true" className="five-num absolute -bottom-10 -right-2 text-[13rem] font-bold leading-none opacity-15">
                            {num(lang, i + 1)}
                          </span>
                          <div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(60%_60%_at_40%_35%,rgb(255_255_255/0.35),transparent)]" />
                          <Art className="five-icon art-shadow relative w-28 md:w-36" />
                        </div>
                        <div className="flex min-h-0 flex-col justify-center overflow-hidden py-2">
                          <h3 className="five-rise text-2xl font-bold leading-snug lg:text-3xl" style={{ color: p.ink }}>
                            {p.title[lang]}
                          </h3>
                          <p className="five-rise mt-3 max-w-xl text-[1rem] leading-relaxed md:text-[1.05rem]" style={vars({ '--d': '120ms' })}>
                            {p.body[lang]}
                          </p>
                          <p className="five-rise mt-4 text-base font-bold sm:text-lg" style={vars({ '--d': '220ms' })}>
                            {t.recent}
                          </p>
                          <ul className="mt-2.5 space-y-2">
                            {p.items[lang].map((item, k) => (
                              <li key={item} className="five-rise flex items-start gap-2.5 text-[1rem]" style={vars({ '--d': `${300 + k * 90}ms` })}>
                                <span aria-hidden="true" className="mt-[0.6em] size-1.5 shrink-0 rounded-full bg-current" />
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </article>
                    </div>
                  </div>
                </li>
              )
            })}
          </ol>
        </div>
      </FolderStack>
    </section>
  )
}
