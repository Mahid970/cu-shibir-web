import { Link } from '@/i18n/link'
import type { ReactNode } from 'react'

import { BallotBox, Medal, Trophy3D } from '@/components/art/Icons3D'
import { CountUp } from '@/components/motion/CountUp'
import { Marquee } from '@/components/motion/Marquee'
import { ArrowRight } from '@/components/ui/Icons'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { copy, langAttr, type Locale } from '@/i18n/config'
import { date, num } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import { outletName, pressHeadline } from '@/lib/press'
import type { PressCoverage } from '@/payload-types'

const T = copy(
  {
    title: ['শিক্ষার্থীদের', 'আস্থার প্রতিদান'],
    lede: 'চাকসু নির্বাচন ২০২৫-এ শিক্ষার্থীরা যে আস্থা রেখেছেন, তার মর্যাদা রাখাই আমাদের প্রতিদিনের কাজ।',
    tag: 'চাকসু নির্বাচন ২০২৫',
    won: 'পদে জয়',
    panel: 'সম্প্রীতির শিক্ষার্থী জোট · ভিপি ইব্রাহীম হোসেন রনি, জিএস সাঈদ বিন হাবিব',
    election: 'নির্বাচনের চিত্র',
    voters: 'মোট ভোটার',
    turnout: 'ভোট পড়েছে',
    posts: 'মোট পদ',
    history: 'চাকসুর ইতিহাসে',
    fullPanel: 'পূর্ণ প্যানেলে জয়',
    years: ' বছর',
    wait: 'দীর্ঘ অপেক্ষা',
    again: 'আবার আস্থা',
    press: ['সংবাদমাধ্যমে', 'আমাদের কথা'],
    pressLabel: 'সংবাদমাধ্যমে প্রকাশিত খবর',
    allPress: 'সব প্রতিবেদন দেখুন',
  },
  {
    title: ['Repaying', 'students’ trust'],
    lede: 'Students placed their trust in us in the 2025 CUCSU election. Living up to it is our everyday work.',
    tag: 'CUCSU election 2025',
    won: 'posts won',
    panel: 'Sompritir Shikkharthi Jot · VP Ibrahim Hossain Rony, GS Saeed Bin Habib',
    election: 'The election in numbers',
    voters: 'voters',
    turnout: 'turnout',
    posts: 'posts',
    history: 'In CUCSU history',
    fullPanel: 'full panel won',
    // A suffix word would wrap in the narrow column; English puts "years" in the label.
    years: '',
    wait: 'years of waiting',
    again: 'trusted again',
    press: ['What the press', 'says about us'],
    pressLabel: 'Press coverage',
    allPress: 'See all coverage',
  },
)

type Figure = { value?: number; suffix?: string; text?: string; label: string; color: string }

function StatPanel({ title, icon, figures }: { title: string; icon: ReactNode; figures: Figure[] }) {
  return (
    <div className="rounded-2xl bg-night-card p-6 md:p-7">
      <p className="flex items-center gap-3 text-[1.15rem] font-bold text-white">
        <span className="w-8">{icon}</span>
        {title}
      </p>
      <dl className="mt-5 grid grid-cols-3 gap-3 text-center">
        {figures.map((f) => (
          <div key={f.label}>
            <dt className="sr-only">{f.label}</dt>
            <dd className={`text-[1.9rem] font-bold leading-tight md:text-[2.4rem] ${f.color}`}>
              {f.value !== undefined ? <CountUp value={f.value} suffix={f.suffix} /> : f.text}
            </dd>
            <dd aria-hidden="true" className="mt-1 text-[0.9rem] text-white/70">
              {f.label}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  )
}

function PressCard({ item, lang }: { item: PressCoverage; lang: Locale }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-[300px] shrink-0 flex-col gap-3 rounded-3xl bg-white/[0.07] p-5 text-white transition-colors hover:bg-white/[0.12] sm:w-[360px] sm:p-6"
    >
      <span className="flex flex-wrap gap-2">
        <span className="rounded bg-[image:var(--gradient)] px-2 py-1 text-[0.85rem] font-semibold leading-tight">{outletName(item.outlet, lang)}</span>
        <span className="rounded bg-white/10 px-2 py-1 text-[0.85rem] font-semibold leading-tight">{date(lang, item.publishedAt, 'short')}</span>
      </span>
      <span lang={langAttr(lang, pressHeadline(item, lang))} className="line-clamp-2 text-[1.1rem] font-semibold leading-snug">
        {pressHeadline(item, lang)}
      </span>
    </a>
  )
}

/** Night section: the CUCSU 2025 result, then press coverage drifting past in a marquee. */
export async function TrustSection({ press }: { press: PressCoverage[] }) {
  const lang = await getLang()
  const t = T[lang]
  return (
    <section className="cv-auto relative isolate overflow-hidden bg-night pb-16 pt-14 md:pb-20 md:pt-20" aria-labelledby="trust">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_85%_8%,rgb(31_163_220/0.3),transparent_70%),radial-gradient(40%_30%_at_5%_85%,rgb(92_200_242/0.1),transparent_70%)]"
      />
      <div className="wrap">
        <SectionTitle id="trust" dark parts={[t.title[0], { hl: t.title[1] }]} />
        <p className="lede text-white/70!">{t.lede}</p>

        <div className="mx-auto mt-14 max-w-[1000px]" data-reveal="fade">
          <div className="relative">
            <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-blue-soft px-4 py-1.5 text-[0.95rem] font-bold text-ink shadow-[0_10px_20px_rgb(92_200_242/0.35)]">
              {t.tag}
            </span>
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-[linear-gradient(90deg,#114575,#1f8fcf_55%,#0a2f52)] px-6 pb-8 pt-10 text-center shadow-[0_0_70px_rgb(31_143_207/0.4)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
              <Trophy3D className="art-shadow w-16 sm:w-20" />
              <CountUp value={24} suffix={`/${num(lang, 26)}`} className="text-[3.2rem] font-bold leading-none text-white sm:text-[4rem]" />
              <div>
                <p className="text-[1.6rem] font-bold text-white sm:text-[2rem]">{t.won}</p>
                <p className="text-[0.9rem] text-white/75">{t.panel}</p>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <StatPanel
              title={t.election}
              icon={<BallotBox />}
              figures={[
                { value: 27516, label: t.voters, color: 'text-blue-soft' },
                { value: 65, suffix: '%', label: t.turnout, color: 'text-white' },
                { value: 26, label: t.posts, color: 'text-[#8fdcff]' },
              ]}
            />
            <StatPanel
              title={t.history}
              icon={<Medal />}
              figures={[
                { text: num(lang, 1981), label: t.fullPanel, color: 'text-blue-soft' },
                { value: 44, suffix: t.years, label: t.wait, color: 'text-white' },
                { text: num(lang, 2025), label: t.again, color: 'text-[#8fdcff]' },
              ]}
            />
          </div>
        </div>
      </div>

      {press.length > 0 && (
        <div className="mt-20">
          <h3 className="px-4 text-center text-[1.9rem] font-bold text-white md:text-[2.5rem]">
            <span className="text-blue-soft">{t.press[0]}</span> {t.press[1]}
          </h3>
          <div className="mt-8">
            <Marquee label={t.pressLabel} duration={80}>
              {press.map((item) => (
                <PressCard key={item.id} item={item} lang={lang} />
              ))}
            </Marquee>
          </div>
          <div className="mt-8 flex justify-center px-4">
            <Link href="/press" className="btn btn-ghost-light">
              {t.allPress}
              <ArrowRight />
            </Link>
          </div>
        </div>
      )}

    </section>
  )
}
