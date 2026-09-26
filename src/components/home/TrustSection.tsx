import type { ReactNode } from 'react'

import { BallotBox, Medal, Trophy3D } from '@/components/art/Icons3D'
import { CountUp } from '@/components/motion/CountUp'
import { Marquee } from '@/components/motion/Marquee'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { formatDate } from '@/lib/bn'
import type { PressCoverage } from '@/payload-types'

type Figure = { value?: number; suffix?: string; text?: string; label: string; color: string }

function StatPanel({ title, icon, figures }: { title: string; icon: ReactNode; figures: Figure[] }) {
  return (
    <div className="rounded-2xl bg-[#1b2433] p-6 md:p-7">
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

function PressCard({ item }: { item: PressCoverage }) {
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex w-[300px] shrink-0 flex-col gap-3 rounded-3xl bg-white/[0.07] p-5 text-white transition-colors hover:bg-white/[0.12] sm:w-[360px] sm:p-6"
    >
      <span className="flex flex-wrap gap-2">
        <span className="rounded bg-[image:var(--gradient)] px-2 py-1 text-[0.85rem] font-semibold leading-tight">{item.outlet}</span>
        <span className="rounded bg-success px-2 py-1 text-[0.85rem] font-semibold leading-tight">{formatDate(item.publishedAt, { style: 'short' })}</span>
      </span>
      <span className="line-clamp-2 text-[1.1rem] font-semibold leading-snug">{item.headline}</span>
    </a>
  )
}

/** Night section: the CUCSU 2025 result, then press coverage drifting past in a marquee. */
export function TrustSection({ press }: { press: PressCoverage[] }) {
  return (
    <section className="relative isolate overflow-hidden bg-night pb-16 pt-14 md:pb-20 md:pt-20" aria-labelledby="trust">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(45%_35%_at_85%_8%,rgb(53_100_255/0.35),transparent_70%),radial-gradient(40%_30%_at_5%_85%,rgb(0_251_151/0.12),transparent_70%)]"
      />
      <div className="wrap">
        <SectionTitle id="trust" dark parts={['শিক্ষার্থীদের', { hl: 'আস্থার প্রতিদান' }]} />
        <p className="lede text-white/70!">চাকসু নির্বাচন ২০২৫-এ শিক্ষার্থীরা যে আস্থা রেখেছেন, তার মর্যাদা রাখাই আমাদের প্রতিদিনের কাজ।</p>

        <div className="mx-auto mt-14 max-w-[1000px]" data-reveal="fade">
          <div className="relative">
            <span className="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-md bg-tag px-4 py-1.5 text-[0.95rem] font-bold text-ink shadow-[0_10px_20px_rgb(245_201_69/0.35)]">
              চাকসু নির্বাচন ২০২৫
            </span>
            <div className="flex flex-col items-center gap-3 rounded-3xl bg-[linear-gradient(90deg,#2140d0,#3564ff_55%,#2a49dc)] px-6 pb-8 pt-10 text-center shadow-[0_0_70px_rgb(53_100_255/0.45)] sm:flex-row sm:justify-center sm:gap-6 sm:text-left">
              <Trophy3D className="art-shadow w-16 sm:w-20" />
              <CountUp value={24} suffix="/২৬" className="text-[3.2rem] font-bold leading-none text-yellow sm:text-[4rem]" />
              <div>
                <p className="text-[1.6rem] font-bold text-white sm:text-[2rem]">পদে জয়</p>
                <p className="text-[0.9rem] text-white/75">সম্প্রীতির শিক্ষার্থী জোট · ভিপি ইব্রাহীম হোসেন রনি, জিএস সাঈদ বিন হাবিব</p>
              </div>
            </div>
          </div>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <StatPanel
              title="নির্বাচনের চিত্র"
              icon={<BallotBox />}
              figures={[
                { value: 27516, label: 'মোট ভোটার', color: 'text-mint' },
                { value: 65, suffix: '%', label: 'ভোট পড়েছে', color: 'text-aqua' },
                { value: 26, label: 'মোট পদ', color: 'text-[#6ea0ff]' },
              ]}
            />
            <StatPanel
              title="চাকসুর ইতিহাসে"
              icon={<Medal />}
              figures={[
                { text: '১৯৮১', label: 'পূর্ণ প্যানেলে জয়', color: 'text-mint' },
                { value: 44, suffix: ' বছর', label: 'দীর্ঘ অপেক্ষা', color: 'text-aqua' },
                { text: '২০২৫', label: 'আবার আস্থা', color: 'text-[#6ea0ff]' },
              ]}
            />
          </div>
        </div>
      </div>

      {press.length > 0 && (
        <div className="mt-20">
          <h3 className="px-4 text-center text-[1.9rem] font-bold text-white md:text-[2.5rem]">
            <span className="text-mint">সংবাদমাধ্যমে</span> আমাদের কথা
          </h3>
          <div className="mt-8">
            <Marquee label="সংবাদমাধ্যমে প্রকাশিত খবর" duration={80}>
              {press.map((item) => (
                <PressCard key={item.id} item={item} />
              ))}
            </Marquee>
          </div>
        </div>
      )}

    </section>
  )
}
