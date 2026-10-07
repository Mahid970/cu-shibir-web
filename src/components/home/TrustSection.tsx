import Image from 'next/image'
import type { ReactNode } from 'react'

import { BallotBox, Medal, Trophy3D } from '@/components/art/Icons3D'
import { CountUp } from '@/components/motion/CountUp'
import { Marquee } from '@/components/motion/Marquee'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { cucsuWinners, TOP_VOTES, type Winner } from '@/content/cucsu'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    title: ['আমাদের উপর', 'শিক্ষার্থীদের আস্থা'],
    lede: 'চাকসু নির্বাচন ২০২৫-এ শিক্ষার্থীরা যে আস্থা রেখেছেন, তার মর্যাদা রাখাই আমাদের প্রতিদিনের কাজ।',
    tag: 'চাকসু নির্বাচন ২০২৫',
    won: 'পদে জয়',
    panel: 'সম্প্রীতির শিক্ষার্থী জোট · ভিপি ইব্রাহীম হোসেন রনি, জিএস সাঈদ বিন হাবিব',
    election: 'নির্বাচনের চিত্র',
    voters: 'মোট ভোটার',
    turnout: 'ভোট পড়েছে',
    posts: 'মোট পদ',
    votes: 'শীর্ষ দুই পদে ভোট',
    vp: 'ভিপি পেয়েছেন',
    gs: 'জিএস পেয়েছেন',
    team: ['চাকসুতে', 'আমাদের ২৪ জন'],
    teamLabel: 'চাকসু ২০২৫-এ নির্বাচিত ২৪ জন',
  },
  {
    title: ['Students’', 'trust in us'],
    lede: 'Students placed their trust in us in the 2025 CUCSU election. Living up to it is our everyday work.',
    tag: 'CUCSU election 2025',
    won: 'posts won',
    panel: 'Sompritir Shikkharthi Jot · VP Ibrahim Hossain Rony, GS Saeed Bin Habib',
    election: 'The election in numbers',
    voters: 'voters',
    turnout: 'turnout',
    posts: 'posts',
    votes: 'Votes for the top two posts',
    vp: 'for the VP',
    gs: 'for the GS',
    team: ['Our 24', 'at CUCSU'],
    teamLabel: 'The 24 elected to CUCSU in 2025',
  },
)

type Figure = { value?: number; suffix?: string; text?: string; label: string; color: string }

function StatPanel({ title, icon, figures }: { title: string; icon: ReactNode; figures: Figure[] }) {
  return (
    <div className="rounded-2xl bg-[#1b2433] p-6 md:p-7">
      <p className="flex items-center gap-3 text-[1.15rem] font-bold text-white">
        <span className="w-8">{icon}</span>
        {title}
      </p>
      <dl className={`mt-5 grid gap-3 text-center ${figures.length === 2 ? 'grid-cols-2' : 'grid-cols-3'}`}>
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

function WinnerCard({ winner }: { winner: Winner }) {
  return (
    <div className="flex h-[120px] w-[300px] shrink-0 overflow-hidden rounded-3xl bg-white/[0.07] text-white sm:h-[128px] sm:w-[360px]">
      <span className="relative w-[104px] shrink-0 bg-[radial-gradient(80%_75%_at_50%_100%,#1d4ed8,#0b1428_75%)] sm:w-[120px]">
        {winner.photo ? (
          <Image src={winner.photo} alt="" fill sizes="120px" className="object-cover object-top" />
        ) : (
          <span aria-hidden="true" className="grid size-full place-items-center text-[1.8rem] font-bold text-white/80">
            {[...winner.name][0]}
          </span>
        )}
      </span>
      <span className="flex min-w-0 flex-1 flex-col justify-center p-5 sm:p-6">
        <span className="block text-[1.1rem] font-semibold leading-snug">{winner.name}</span>
        <span className="mt-1 line-clamp-2 block text-[0.85rem] leading-snug text-white/70">{winner.post}</span>
      </span>
    </div>
  )
}

/** Night section: the CUCSU 2025 result, then the 24 winners drifting past in a marquee. */
export async function TrustSection() {
  const lang = await getLang()
  const t = T[lang]
  const winners = cucsuWinners(lang)
  return (
    <section className="cv-auto relative isolate overflow-hidden bg-night pb-16 pt-14 md:pb-20 md:pt-20" aria-labelledby="trust">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_85%_8%,rgb(53_100_255/0.35),transparent_70%),radial-gradient(40%_30%_at_5%_85%,rgb(0_251_151/0.12),transparent_70%)]"
      />
      <div className="wrap">
        <SectionTitle id="trust" dark parts={[t.title[0], { hl: t.title[1] }]} />
        <p className="lede text-white/70!">{t.lede}</p>

        <div className="mx-auto mt-14 max-w-[1000px]" data-reveal="fade">
          <div className="relative">
            <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-tag px-4 py-1.5 text-[0.95rem] font-bold text-ink shadow-[0_10px_20px_rgb(245_201_69/0.35)]">
              {t.tag}
            </span>
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-[linear-gradient(90deg,#2140d0,#3564ff_55%,#2a49dc)] px-6 pb-8 pt-10 text-center shadow-[0_0_70px_rgb(53_100_255/0.45)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
              <Trophy3D className="art-shadow w-16 sm:w-20" />
              <CountUp value={24} suffix={`/${num(lang, 26)}`} className="text-[3.2rem] font-bold leading-none text-yellow sm:text-[4rem]" />
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
                { value: 27516, label: t.voters, color: 'text-mint' },
                { value: 65, suffix: '%', label: t.turnout, color: 'text-aqua' },
                { value: 26, label: t.posts, color: 'text-[#6ea0ff]' },
              ]}
            />
            <StatPanel
              title={t.votes}
              icon={<Medal />}
              figures={[
                { value: TOP_VOTES.vp, label: t.vp, color: 'text-mint' },
                { value: TOP_VOTES.gs, label: t.gs, color: 'text-aqua' },
              ]}
            />
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h3 className="px-4 text-center text-[1.9rem] font-bold text-white md:text-[2.5rem]">
          <span className="text-mint">{t.team[0]}</span> {t.team[1]}
        </h3>
        <div className="mt-8">
          <Marquee label={t.teamLabel} duration={80}>
            {winners.map((w) => (
              <WinnerCard key={w.name} winner={w} />
            ))}
          </Marquee>
        </div>
      </div>
    </section>
  )
}
