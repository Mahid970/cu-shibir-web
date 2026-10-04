import { Link } from '@/i18n/link'

import { ParticleEmblem, type LineStyle } from '@/components/about/ParticleEmblem'
import { ArrowRight, Pin } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

import { HeroVideo } from './HeroVideo'

const T = copy(
  {
    name: 'বাংলাদেশ ইসলামী ছাত্রশিবির',
    nameNarrow: ['বাংলাদেশ ইসলামী', 'ছাত্রশিবির'],
    branch: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
    objective:
      'বাংলাদেশ ইসলামী ছাত্রশিবিরের লক্ষ্য ও উদ্দেশ্য হলো “আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন”।',
    join: 'সমর্থক হোন',
    about: 'আমাদের কথা',
    credit: 'ভিডিও',
  },
  {
    name: 'Bangladesh Islami Chhatrashibir',
    nameNarrow: ['Bangladesh Islami', 'Chhatrashibir'],
    branch: 'University of Chittagong',
    objective:
      'The aim and objective of Bangladesh Islami Chhatrashibir is “to win the pleasure of Allah by reshaping every part of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him)”.',
    join: 'Become a supporter',
    about: 'About us',
    credit: 'Video',
  },
)

/** The name in white, the branch smaller in cyan (solid colours, no gradient). */
const WHITE: LineStyle = { rgb: [255, 255, 255], scale: 1 }
const CYAN: LineStyle = { rgb: [94, 200, 255], scale: 0.62 }
const STYLES = [WHITE, CYAN]
const NARROW_STYLES = [WHITE, WHITE, CYAN]
const HOLDS: [number, number] = [3800, 7000]

/**
 * Home hero: a silent aerial loop of the campus in its own colours; above it, points of light gather
 * into the emblem and re-form as the organisation's name (the visual title), then its objective; the branch sits in the top corner and the video's
 * credit at the foot. The lower part stays open so the campus shows.
 */
export async function Hero() {
  const lang = await getLang()
  const t = T[lang]

  return (
    <section className="home-hero relative isolate overflow-hidden text-white" aria-labelledby="hero-title">
      <HeroVideo />

      <div className="pointer-events-none absolute inset-x-0 top-0">
        <div className="wrap flex justify-start pt-4 sm:pt-6">
          <p className="hero-text load-up inline-flex items-center gap-1.5 text-[0.92rem] font-semibold sm:text-[1rem]" style={vars({ '--d': '120ms' })}>
            <Pin className="size-4 text-[#5ec8ff]" aria-hidden="true" />
            {t.branch}
          </p>
        </div>
      </div>

      <div className="wrap pb-[clamp(13rem,30vh,19rem)] pt-20 text-center sm:pt-24 lg:pt-28">
        {/* The title is drawn in points of light: the emblem gathers, then re-forms as the name. */}
        <h1 id="hero-title" className="sr-only">
          {t.name}, {t.branch}
        </h1>
        <div className="load-up" style={vars({ '--d': '0ms' })}>
          <ParticleEmblem
            slogan={[t.name, t.branch]}
            narrowSlogan={[...t.nameNarrow, t.branch]}
            styles={STYLES}
            narrowStyles={NARROW_STYLES}
            holds={HOLDS}
            calm="text"
            className="relative mx-auto h-[200px] w-full max-w-5xl sm:h-[210px] lg:h-[230px]"
          />
        </div>
        <p className="hero-rise hero-text mx-auto mt-5 max-w-3xl text-[1.02rem] font-semibold leading-[1.85] text-white/90 sm:text-[1.15rem]" style={vars({ '--d': '220ms' })}>
          {t.objective}
        </p>
        <div className="load-up mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '360ms' })}>
          <Link href="/join" className="btn hero-cta">
            {t.join}
            <ArrowRight />
          </Link>
          <Link href="/about" className="btn hero-glass">
            {t.about}
          </Link>
        </div>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0">
        <div className="wrap flex justify-end pb-3">
          <a
            href="https://www.facebook.com/reel/965890053057187"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-text pointer-events-auto text-[0.75rem] text-white/75 hover:text-white"
          >
            {t.credit}: Films By Ashfaq
          </a>
        </div>
      </div>
    </section>
  )
}
