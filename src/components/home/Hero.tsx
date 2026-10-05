import { Link } from '@/i18n/link'

import { ParticleEmblem } from '@/components/about/ParticleEmblem'
import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

import { HeroVideo } from './HeroVideo'

const T = copy(
  {
    name: 'বাংলাদেশ ইসলামী ছাত্রশিবির',
    slogan: ['আমরা তরুণ,', 'আমরাই পারি'],
    branch: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
    objective:
      'বাংলাদেশ ইসলামী ছাত্রশিবিরের লক্ষ্য ও উদ্দেশ্য হলো “আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন”।',
    join: 'সমর্থক হোন',
    about: 'আমাদের কথা',
    credit: 'ভিডিও',
  },
  {
    name: 'Bangladesh Islami Chhatrashibir',
    slogan: ['We are young,', 'we can do it'],
    branch: 'University of Chittagong',
    objective:
      'The aim and objective of Bangladesh Islami Chhatrashibir is “to win the pleasure of Allah by reshaping every part of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him)”.',
    join: 'Become a supporter',
    about: 'About us',
    credit: 'Video',
  },
)

/** The slogan's points: first line white, second cyan (solid colours, like the text beside it). */
const SLOGAN_COLORS: [number, number, number][] = [
  [255, 255, 255],
  [94, 200, 255],
]

/**
 * Home hero over a silent aerial loop of the campus: on wide screens the name, branch, objective
 * and buttons on the left and on the right the emblem gathering from points of light and re-forming
 * as the slogan, larger than the text block; on phones the emblem sits above the text. The video's credit is at the foot,
 * and the lower part stays open so the campus shows.
 */
export async function Hero() {
  const lang = await getLang()
  const t = T[lang]

  return (
    <section className="home-hero relative isolate overflow-hidden text-white" aria-labelledby="hero-title">
      <HeroVideo />
      {/* Watermark over the video: the branch's name, large and faint, behind the content. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-5 -z-10 sm:bottom-7">
        <p className="hero-watermark wrap">{t.branch}</p>
      </div>

      <div className="wrap grid items-center gap-6 pb-[clamp(10rem,24vh,16rem)] pt-10 sm:pt-14 lg:grid-cols-[1.1fr_0.9fr] lg:gap-12 lg:pt-20">
        <div className="@container text-center lg:order-1 lg:text-left">
          <h1 id="hero-title" className="hero-text hero-rise font-bold leading-[1.22] text-white" style={vars({ '--d': '60ms' })}>
            {/* One line at every width: sized to the column (container units), capped on large screens. */}
            <span className={`block whitespace-nowrap ${lang === 'en' ? 'text-[min(5.5cqw,3rem)]' : 'text-[min(8.4cqw,3.6rem)]'}`}>{t.name}</span>
            <span className="mt-2 block text-[1.35rem] text-[#5ec8ff] sm:text-[1.7rem] xl:text-[1.95rem]">{t.branch}</span>
          </h1>
          <p className="hero-rise hero-text mx-auto mt-5 max-w-2xl text-[1.02rem] font-semibold leading-[1.85] text-white/90 sm:text-[1.12rem] lg:mx-0" style={vars({ '--d': '220ms' })}>
            {t.objective}
          </p>
          <div className="load-up mt-8 flex flex-wrap justify-center gap-3 lg:justify-start" style={vars({ '--d': '360ms' })}>
            <Link href="/join" className="btn hero-cta">
              {t.join}
              <ArrowRight />
            </Link>
            <Link href="/about" className="btn hero-glass">
              {t.about}
            </Link>
          </div>
        </div>

        {/* As on the About page: the emblem gathers from points of light, then re-forms as the slogan, and back. */}
        <div className="load-up -order-1 lg:order-2" style={vars({ '--d': '0ms' })}>
          <ParticleEmblem slogan={t.slogan} fit lineColors={SLOGAN_COLORS} className="relative mx-auto h-[210px] w-full sm:h-[260px] lg:h-[440px] xl:h-[480px]" />
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
