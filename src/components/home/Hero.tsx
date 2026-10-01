import Image from 'next/image'
import { Link } from '@/i18n/link'
import { Fragment } from 'react'

import { FloatIcon } from '@/components/art/FloatIcon'
import { CountUp } from '@/components/motion/CountUp'
import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import type { ImageInfo } from '@/lib/media'

import { HeroParticles } from './HeroParticles'

type Stat = { value: number; suffix?: string | null; label: string }
type Photo = ImageInfo & { caption: string }

const T = copy(
  {
    pill: 'বাংলাদেশ ইসলামী ছাত্রশিবির · চবি শাখা',
    join: 'সমর্থক হোন',
    about: 'আমাদের কথা',
    leaders: (n: string) => `${n} জন দায়িত্বশীল`,
    together: 'আর হাজারো শিক্ষার্থী, একসাথে',
    many: 'হাজারো শিক্ষার্থী…',
    one: '…একটি কাফেলা',
    picture: 'ক্যাম্পাসে আমাদের কার্যক্রমের ছবি বিন্দু হয়ে ছড়িয়ে পড়ে, তারপর সংগঠনের প্রতীক হয়ে জুড়ে যায়',
  },
  {
    pill: 'Bangladesh Islami Chhatrashibir · CU branch',
    join: 'Become a supporter',
    about: 'About us',
    leaders: (n: string) => `${n} leaders`,
    together: 'and thousands of students, together',
    many: 'Thousands of students…',
    one: '…one caravan',
    picture: 'Photos of our work on campus scatter into points of light, then come together as the emblem',
  },
)

/** `**words**` in the CMS intro become sky-blue emphasis. */
function withHighlights(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="font-bold text-blue-soft">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** "আমরা তরুণ, আমরাই পারি" → ["আমরা তরুণ,", "আমরাই পারি"]; the second half is set in sky blue (same in English). */
function splitTagline(tagline: string) {
  const i = tagline.indexOf(',')
  return i === -1 ? ['', tagline] : [tagline.slice(0, i + 1), tagline.slice(i + 1).trim()]
}

/** Three layers of CU hills at the foot of the hero; the front one is the page's own colour. */
function Hills() {
  return (
    <svg aria-hidden="true" viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[110px] w-full sm:h-[150px] lg:h-[190px]">
      <path className="hill hill-back" d="M0 150C120 92 236 112 360 82S604 38 760 90s262-32 404-20 200 42 276 20v130H0Z" fill="#1f8fcf" fillOpacity=".38" />
      <path className="hill hill-mid" d="M0 172c160-50 300-22 460-58s296-12 440 22 280-34 400-14 104 22 140 12v86H0Z" fill="#5cc8f2" fillOpacity=".22" />
      <path d="M0 202c180-40 360-16 540-36s360-14 540 10 240-12 360 6v38H0Z" fill="var(--bg)" />
    </svg>
  )
}

/**
 * Home hero: deep navy lifting to sky blue over the CU hills. On the left the name and the
 * slogan, whose letters draw together and sharpen; on the right a living picture where campus
 * photos gather from points of light and re-form as the emblem.
 */
export async function Hero({
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
  const lang = await getLang()
  const t = T[lang]
  const [lead, highlight] = splitTagline(tagline)
  const [first, second] = stats
  const scenes = [...(photo ? [{ src: photo.src, caption: t.many }] : []), ...gallery.map((g) => ({ src: g.src, caption: g.caption || t.many }))].slice(0, 3)

  return (
    <section className="hero-sky relative isolate overflow-hidden text-white" aria-labelledby="hero-title">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines-night absolute inset-0 [mask-image:radial-gradient(70%_70%_at_75%_35%,#000,transparent)]" />
        <div className="hero-glow absolute bottom-[-30%] left-1/2 h-[70%] w-[90%] -translate-x-1/2 rounded-[50%]" />
      </div>

      <div className="wrap grid items-center gap-6 pb-32 pt-10 sm:pt-12 lg:grid-cols-[1fr_1.02fr] lg:gap-10 lg:pb-36 lg:pt-10">
        <div className="relative z-10 text-center lg:text-left">
          <p className="load-rise inline-flex items-center gap-2 rounded-full bg-white/10 py-1.5 pl-1.5 pr-4 text-[0.9rem] font-semibold text-white ring-1 ring-white/15 backdrop-blur-md sm:text-[0.95rem]">
            <Image src="/brand/logo-legacy.png" alt="" width={28} height={28} className="size-7 rounded-full bg-white" />
            {t.pill}
          </p>
          <h1 id="hero-title" className="mt-6 text-[2.9rem] font-bold leading-[1.18] text-white sm:text-[3.8rem] xl:text-[4.6rem]">
            {lead && (
              <span className="type-settle block" style={vars({ '--d': '80ms' })}>
                {lead}
              </span>
            )}
            <span className="type-settle block pb-1 text-blue-soft" style={vars({ '--d': '380ms' })}>
              {highlight}
            </span>
          </h1>
          {intro && (
            <p className="load-rise mx-auto mt-5 max-w-xl text-[1.08rem] leading-[1.8] text-white/80 sm:text-[1.2rem] lg:mx-0" style={vars({ '--d': '240ms' })}>
              {withHighlights(intro)}
            </p>
          )}
          <div className="load-up mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={vars({ '--d': '420ms' })}>
            <Link href="/join" className="btn btn-sky">
              {t.join}
              <ArrowRight />
            </Link>
            <Link href="/about" className="btn btn-ghost-light">
              {t.about}
            </Link>
          </div>
          {faces.length > 0 && (
            <div className="load-up mt-8 flex items-center justify-center gap-3 lg:justify-start" style={vars({ '--d': '560ms' })}>
              <span className="flex -space-x-3">
                {faces.slice(0, 5).map((f, i) => (
                  <span key={i} className="relative size-10 overflow-hidden rounded-full bg-navy ring-[3px] ring-night">
                    <Image src={f.src} alt="" fill sizes="40px" className="object-cover object-top" />
                  </span>
                ))}
              </span>
              <p className="text-left text-[0.92rem] leading-snug text-white/70">
                <Link href="/leadership" className="font-bold text-white hover:text-blue-soft">
                  {t.leaders(num(lang, leaderCount))}
                </Link>
                <br />
                {t.together}
              </p>
            </div>
          )}
        </div>

        <div className="relative">
          <HeroParticles scenes={scenes} emblemCaption={t.one} label={t.picture} />
          {first && (
            <FloatIcon className="left-0 top-[6%] sm:left-[2%]" rotate={-3} wobble={2} drift={8} duration={6} delay={1.1}>
              <span className="flex items-center rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur-md sm:px-5 sm:py-3">
                <span className="leading-tight">
                  <CountUp value={first.value} suffix={first.suffix ?? ''} className="block text-[1.25rem] font-bold text-blue-soft sm:text-[1.5rem]" />
                  <span className="block text-[0.75rem] text-white/70 sm:text-[0.82rem]">{first.label}</span>
                </span>
              </span>
            </FloatIcon>
          )}
          {second && (
            <FloatIcon className="bottom-[14%] right-0 sm:right-[2%]" rotate={3} wobble={-3} drift={10} duration={6.8} delay={1.3}>
              <span className="flex items-center rounded-2xl bg-white/10 px-4 py-2.5 ring-1 ring-white/15 backdrop-blur-md sm:px-5 sm:py-3">
                <span className="leading-tight">
                  <CountUp value={second.value} suffix={second.suffix ?? ''} className="block text-[1.25rem] font-bold text-blue-soft sm:text-[1.5rem]" />
                  <span className="block text-[0.75rem] text-white/70 sm:text-[0.82rem]">{second.label}</span>
                </span>
              </span>
            </FloatIcon>
          )}
        </div>
      </div>
      <Hills />
    </section>
  )
}
