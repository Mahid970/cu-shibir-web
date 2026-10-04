import { Link } from '@/i18n/link'

import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

import { HeroVideo } from './HeroVideo'

const T = copy(
  {
    name: 'বাংলাদেশ ইসলামী ছাত্রশিবির',
    branch: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
    objective:
      'বাংলাদেশ ইসলামী ছাত্রশিবিরের লক্ষ্য ও উদ্দেশ্য হলো “আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন”।',
    join: 'সমর্থক হোন',
    about: 'আমাদের কথা',
  },
  {
    name: 'Bangladesh Islami Chhatrashibir',
    branch: 'University of Chittagong',
    objective:
      'The aim and objective of Bangladesh Islami Chhatrashibir is “to win the pleasure of Allah by reshaping every part of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him)”.',
    join: 'Become a supporter',
    about: 'About us',
  },
)

/**
 * Home hero: a silent aerial loop of the campus in its own colours with the organisation's name,
 * branch and objective centred above it; the lower part stays open so the campus shows.
 */
export async function Hero() {
  const lang = await getLang()
  const t = T[lang]

  return (
    <section className="home-hero relative isolate overflow-hidden text-white" aria-labelledby="hero-title">
      <HeroVideo />

      <div className="wrap pb-[clamp(13rem,30vh,19rem)] pt-14 text-center sm:pt-20 lg:pt-24">
        <h1 id="hero-title" className="hero-text mx-auto max-w-5xl font-bold leading-[1.25] text-white">
          <span className={`hero-rise block ${lang === 'en' ? 'text-[2.1rem] sm:text-[3.1rem] xl:text-[3.6rem]' : 'text-[2.3rem] sm:text-[3.5rem] xl:text-[4.2rem]'}`} style={vars({ '--d': '60ms' })}>
            {t.name}
          </span>
          <span className="hero-rise hero-accent mt-1 block text-[1.6rem] sm:text-[2.3rem] xl:text-[2.7rem]" style={vars({ '--d': '220ms' })}>
            {t.branch}
          </span>
        </h1>
        <p className="hero-rise hero-text mx-auto mt-6 max-w-3xl text-[1.02rem] font-semibold leading-[1.85] text-white/90 sm:text-[1.15rem]" style={vars({ '--d': '360ms' })}>
          {t.objective}
        </p>
        <div className="load-up mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '480ms' })}>
          <Link href="/join" className="btn hero-cta">
            {t.join}
            <ArrowRight />
          </Link>
          <Link href="/about" className="btn hero-glass">
            {t.about}
          </Link>
        </div>
      </div>

    </section>
  )
}
