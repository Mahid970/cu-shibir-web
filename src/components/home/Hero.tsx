import { Link } from '@/i18n/link'
import { Fragment } from 'react'

import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

import { HeroVideo } from './HeroVideo'

const T = copy(
  { join: 'সমর্থক হোন', about: 'আমাদের কথা' },
  { join: 'Become a supporter', about: 'About us' },
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
 * Home hero: a silent aerial loop of the campus in its own colours and one centred message above
 * it; the lower part stays open so the campus shows.
 */
export async function Hero({ tagline, intro }: { tagline: string; intro: string }) {
  const lang = await getLang()
  const t = T[lang]
  const [lead, highlight] = splitTagline(tagline)

  return (
    <section className="home-hero relative isolate overflow-hidden text-white" aria-labelledby="hero-title">
      <HeroVideo />

      <div className="wrap pb-[clamp(14rem,32vh,20rem)] pt-14 text-center sm:pt-20 lg:pt-24">
        <h1 id="hero-title" className="hero-text mx-auto max-w-4xl text-[2.7rem] font-bold text-white leading-[1.2] sm:text-[3.8rem] xl:text-[4.6rem]">
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
          <p className="hero-rise hero-text mx-auto mt-5 max-w-2xl text-[1.05rem] font-semibold leading-[1.8] text-white/90 sm:text-[1.2rem]" style={vars({ '--d': '360ms' })}>
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

      <svg aria-hidden="true" viewBox="0 0 1440 60" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-10 w-full sm:h-14">
        <path d="M0 60V40C360 0 1080 0 1440 40v20Z" fill="var(--bg)" />
      </svg>
    </section>
  )
}
