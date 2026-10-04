import Image from 'next/image'
import { Link } from '@/i18n/link'
import { Fragment } from 'react'

import { Marquee } from '@/components/motion/Marquee'
import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'
import type { ImageInfo } from '@/lib/media'

import { HeroAurora } from './HeroAurora'

type Photo = ImageInfo & { caption: string }

const T = copy(
  { join: 'সমর্থক হোন', about: 'আমাদের কথা', ribbon: 'ক্যাম্পাসে আমাদের কার্যক্রমের ছবি' },
  { join: 'Become a supporter', about: 'About us', ribbon: 'Photos of our work on campus' },
)

/** `**words**` in the CMS intro become lime emphasis. */
function withHighlights(text: string) {
  return text.split(/\*\*(.+?)\*\*/g).map((part, i) =>
    i % 2 ? (
      <span key={i} className="font-semibold text-lime">
        {part}
      </span>
    ) : (
      <Fragment key={i}>{part}</Fragment>
    ),
  )
}

/** "আমরা তরুণ, আমরাই পারি" → ["আমরা তরুণ,", "আমরাই পারি"]; the second half shines lime (same in English). */
function splitTagline(tagline: string) {
  const i = tagline.indexOf(',')
  return i === -1 ? ['', tagline] : [tagline.slice(0, i + 1), tagline.slice(i + 1).trim()]
}

/**
 * Home hero: soft blue and mint light drifting over the night, one centred message, and a slow
 * ribbon of real photos from campus along the bottom.
 */
export async function Hero({ tagline, intro, photos }: { tagline: string; intro: string; photos: Photo[] }) {
  const lang = await getLang()
  const t = T[lang]
  const [lead, highlight] = splitTagline(tagline)

  return (
    <section className="hero-aurora relative isolate overflow-hidden text-white" aria-labelledby="hero-title">
      <HeroAurora />

      <div className="wrap pb-12 pt-14 text-center sm:pb-14 sm:pt-20 lg:pt-24">
        <h1 id="hero-title" className="mx-auto max-w-4xl text-[2.7rem] font-bold text-white leading-[1.2] sm:text-[3.8rem] xl:text-[4.6rem]">
          {lead && (
            <span className="hero-rise inline-block" style={vars({ '--d': '60ms' })}>
              {lead}
            </span>
          )}{' '}
          <span className="hero-rise text-lime-shine inline-block pb-1" style={vars({ '--d': '220ms' })}>
            {highlight}
          </span>
        </h1>
        {intro && (
          <p className="hero-rise mx-auto mt-5 max-w-2xl text-[1.05rem] leading-[1.8] text-white/75 sm:text-[1.2rem]" style={vars({ '--d': '360ms' })}>
            {withHighlights(intro)}
          </p>
        )}
        <div className="load-up mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '480ms' })}>
          <Link href="/join" className="btn btn-yellow">
            {t.join}
            <ArrowRight />
          </Link>
          <Link href="/about" className="btn btn-ghost-light">
            {t.about}
          </Link>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="hero-ribbon load-up pb-16 lg:pb-20" style={vars({ '--d': '700ms' })}>
          <Marquee label={t.ribbon} duration={Math.max(40, photos.length * 8)}>
            {photos.map((p, i) => (
              <figure key={i} className="ribbon-card">
                <Image
                  src={p.src}
                  alt={p.alt || p.caption}
                  fill
                  sizes="(min-width: 640px) 224px, 168px"
                  className="object-cover"
                />
                {p.caption && <figcaption>{p.caption}</figcaption>}
              </figure>
            ))}
          </Marquee>
        </div>
      )}

      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full sm:h-14">
        <path d="M0 60V40C360 0 1080 0 1440 40v20Z" fill="var(--bg)" />
      </svg>
    </section>
  )
}
