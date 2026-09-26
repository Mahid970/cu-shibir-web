import Image from 'next/image'
import Link from 'next/link'
import { Fragment } from 'react'

import { FloatIcon } from '@/components/art/FloatIcon'
import { BallotBox } from '@/components/art/Icons3D'
import { CountUp } from '@/components/motion/CountUp'
import { ArrowRight, Users } from '@/components/ui/Icons'
import { Swoosh, vars } from '@/components/ui/SectionTitle'
import { toBnDigits } from '@/lib/bn'
import type { ImageInfo } from '@/lib/media'

type Stat = { value: number; suffix?: string | null; label: string }
type Photo = ImageInfo & { caption: string }

/** `**words**` in the CMS intro become blue emphasis. */
function withHighlights(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="font-bold text-blue">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** "আমরা তরুণ, আমরাই পারি" → ["আমরা তরুণ,", "আমরাই পারি"]; the second half is highlighted. */
function splitTagline(tagline: string) {
  const i = tagline.indexOf(',')
  return i === -1 ? ['', tagline] : [tagline.slice(0, i + 1), tagline.slice(i + 1).trim()]
}

function Polaroid({ photo, sizes }: { photo: Photo; sizes: string }) {
  return (
    <figure className="rounded-2xl bg-white p-2 pb-2.5 shadow-[0_20px_40px_rgb(11_15_46/0.18)]">
      <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-pale-3">
        <Image src={photo.src} alt={photo.alt} fill sizes={sizes} className="object-cover" />
      </div>
      {photo.caption && (
        <figcaption className="mt-2 truncate px-1 text-[0.8rem] font-semibold text-ink sm:text-[0.88rem]">{photo.caption}</figcaption>
      )}
    </figure>
  )
}

/**
 * Light grid-paper hero: who we are and the slogan on the left; on the right a collage of real
 * campus photos with two floating badges. Copy rises in on load; photos pop in and drift.
 */
export function Hero({
  tagline,
  intro,
  photo,
  gallery,
  stats,
  faces,
  leaderCount,
}: {
  tagline: string
  intro: string
  photo: ImageInfo | null
  gallery: Photo[]
  stats: Stat[]
  faces: ImageInfo[]
  leaderCount: number
}) {
  const [lead, highlight] = splitTagline(tagline)
  const [first, second] = stats
  return (
    <section className="hero-wash relative isolate overflow-hidden" aria-labelledby="hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-paper absolute inset-0" />
        {['top-[4%] left-[6%]', 'top-[62%] left-[38%]', 'top-[12%] left-[88%]', 'top-[82%] left-[4%]'].map((p) => (
          <div key={p} className={`absolute size-12 bg-pale-4/45 md:size-16 ${p}`} />
        ))}
      </div>

      <div className="wrap grid items-center gap-12 pb-28 pt-10 sm:pt-14 lg:grid-cols-[1fr_1.05fr] lg:gap-8 lg:pb-36 lg:pt-16">
        <div className="text-center lg:text-left">
          <p className="load-rise inline-flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-4 text-[0.9rem] font-semibold text-ink shadow-[0_4px_24px_rgb(11_15_46/0.08)] sm:text-[0.95rem]">
            <Image src="/brand/logo-legacy.png" alt="" width={28} height={28} className="size-7" />
            বাংলাদেশ ইসলামী ছাত্রশিবির · চবি শাখা
          </p>
          <h1
            id="hero-title"
            className="load-rise mt-6 text-[2.7rem] font-bold leading-[1.25] text-ink sm:text-[3.5rem] xl:text-[4.2rem]"
            style={vars({ '--d': '120ms' })}
          >
            {lead && (
              <>
                {lead}
                <br />
              </>
            )}
            <span className="hl" data-reveal="swoosh" style={vars({ '--i': 3 })}>
              {highlight}
              <Swoosh />
            </span>
            <span aria-hidden="true" className="caret ml-1 inline-block font-normal text-blue">
              |
            </span>
          </h1>
          <p
            className="load-rise mx-auto mt-5 max-w-xl text-[1.1rem] leading-[1.75] text-ink/85 sm:text-[1.25rem] lg:mx-0"
            style={vars({ '--d': '240ms' })}
          >
            {withHighlights(intro)}
          </p>
          <div className="load-up mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={vars({ '--d': '360ms' })}>
            <Link href="/join" className="btn btn-yellow">
              সমর্থক হোন
              <ArrowRight />
            </Link>
            <Link href="/about" className="btn btn-outline">
              আমাদের কথা
            </Link>
          </div>
          {faces.length > 0 && (
            <div className="load-up mt-8 flex items-center justify-center gap-3 lg:justify-start" style={vars({ '--d': '480ms' })}>
              <span className="flex -space-x-3">
                {faces.slice(0, 5).map((f, i) => (
                  <span key={i} className="relative size-10 overflow-hidden rounded-full bg-pale-3 ring-[3px] ring-white">
                    <Image src={f.src} alt="" fill sizes="40px" className="object-cover object-top" />
                  </span>
                ))}
              </span>
              <p className="text-left text-[0.92rem] leading-snug text-muted">
                <Link href="/leadership" className="font-bold text-ink hover:text-primary">
                  {toBnDigits(leaderCount)} জন দায়িত্বশীল
                </Link>
                <br />
                আর হাজারো শিক্ষার্থী, একসাথে
              </p>
            </div>
          )}
        </div>

        {photo && (
          <div className="relative mx-auto aspect-[1/0.9] w-full max-w-[560px] lg:max-w-none" aria-label="ক্যাম্পাসে আমাদের কার্যক্রমের ছবি">
            <figure
              className="load-grow absolute right-0 top-[9%] w-[86%] overflow-hidden rounded-[28px] border-[8px] border-white bg-pale-3 shadow-[0_30px_60px_rgb(11_15_46/0.18)]"
              style={vars({ '--d': '200ms' })}
            >
              <div className="relative aspect-[4/3]">
                <Image src={photo.src} alt={photo.alt} fill priority sizes="(min-width: 1024px) 560px, 76vw" className="object-cover" />
              </div>
            </figure>

            {gallery[0] && (
              <FloatIcon className="bottom-0 left-0 w-[44%]" rotate={-5} wobble={2} drift={10} duration={7} delay={0.6}>
                <Polaroid photo={gallery[0]} sizes="(min-width: 1024px) 260px, 38vw" />
              </FloatIcon>
            )}
            {gallery[1] && (
              <FloatIcon className="left-[1%] top-0 w-[30%]" rotate={6} wobble={-2} drift={8} duration={6.2} delay={0.75}>
                <Polaroid photo={gallery[1]} sizes="(min-width: 1024px) 180px, 26vw" />
              </FloatIcon>
            )}

            {first && (
              <FloatIcon className="right-[-1%] top-[1%]" rotate={3} wobble={-3} drift={8} duration={5.6} delay={0.9}>
                <span className="flex items-center gap-2.5 rounded-2xl bg-white px-3 py-2.5 shadow-[0_16px_34px_rgb(11_15_46/0.16)] sm:px-4 sm:py-3">
                  <BallotBox className="w-8 sm:w-10" />
                  <span className="leading-tight">
                    <CountUp value={first.value} suffix={first.suffix ?? ''} className="block text-[1.2rem] font-bold text-ink sm:text-[1.45rem]" />
                    <span className="block text-[0.75rem] text-muted sm:text-[0.82rem]">{first.label}</span>
                  </span>
                </span>
              </FloatIcon>
            )}
            {second && (
              <FloatIcon className="bottom-[6%] right-[3%]" rotate={-3} wobble={3} drift={10} duration={6.6} delay={1.05}>
                <span className="flex items-center gap-2.5 rounded-2xl bg-[image:var(--gradient)] px-3 py-2.5 text-white shadow-[0_16px_34px_rgb(0_96_250/0.35)] sm:px-4 sm:py-3">
                  <span className="grid size-9 place-items-center rounded-xl bg-white/15 sm:size-10">
                    <Users className="size-5" />
                  </span>
                  <span className="leading-tight">
                    <CountUp value={second.value} suffix={second.suffix ?? ''} className="block text-[1.2rem] font-bold sm:text-[1.45rem]" />
                    <span className="block text-[0.75rem] text-white/80 sm:text-[0.82rem]">{second.label}</span>
                  </span>
                </span>
              </FloatIcon>
            )}
          </div>
        )}
      </div>
    </section>
  )
}
