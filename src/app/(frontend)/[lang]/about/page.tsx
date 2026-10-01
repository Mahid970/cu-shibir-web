import type { Metadata } from 'next'
import Image from 'next/image'

import { ParticleEmblem } from '@/components/about/ParticleEmblem'
import { RailTimeline } from '@/components/about/RailTimeline'
import { Faq } from '@/components/home/Faq'
import { FivePoints } from '@/components/home/FivePoints'
import { Journey } from '@/components/home/Journey'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { historyStops } from '@/content/history'
import { copy } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getAlbums, getMartyrs, getSiteSettings } from '@/lib/cms'
import { pickImage } from '@/lib/media'

export const revalidate = 3600

const T = copy(
  {
    meta: {
      title: 'আমাদের কথা',
      description: 'বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখার পরিচিতি, লক্ষ্য, ইতিহাস ও ৫ দফা কর্মসূচি।',
    },
    title: ['আমাদের', 'কথা'],
    lede: 'চট্টগ্রাম বিশ্ববিদ্যালয়ের শিক্ষার্থীদের নিয়ে, শিক্ষার্থীদের জন্য — আমরা কারা, কী চাই, কীভাবে কাজ করি।',
    emblem: 'আমাদের প্রতীক ও স্লোগান',
    slogan: ['আমরা তরুণ,', 'আমরাই পারি'],
    who: 'আমরা কারা',
    whoText: [
      'বাংলাদেশ ইসলামী ছাত্রশিবির ১৯৭৭ সালের ৬ ফেব্রুয়ারি ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদে প্রতিষ্ঠিত একটি ছাত্রসংগঠন। এর চট্টগ্রাম বিশ্ববিদ্যালয় শাখা কাজ করে এই ক্যাম্পাসের শিক্ষার্থীদের নিয়ে — ক্লাস, হল, শাটল আর শিক্ষার্থীদের অধিকার ঘিরে।',
      '১৯৮১ সালে চাকসুর পূর্ণ প্যানেলে জয়ের পর দীর্ঘ পথ পেরিয়ে ২০২৪ সালে শাখা আবার প্রকাশ্যে কাজ শুরু করে। ২০২৫ সালের চাকসু নির্বাচনে শিক্ষার্থীরা আবার আস্থা রাখেন — ২৬টি পদের ২৪টিতে।',
    ],
    pillars: [
      {
        title: 'লক্ষ্য',
        text: 'আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন।',
      },
      { title: 'স্বপ্ন', text: 'সমৃদ্ধ বাংলাদেশ গড়ার লক্ষ্যে সৎ, দক্ষ ও দেশপ্রেমিক নাগরিক তৈরি।' },
    ],
    martyrs: 'শহীদ স্মরণ: যাঁদের ত্যাগে এই পথচলা',
  },
  {
    meta: {
      title: 'About us',
      description: 'Who Bangladesh Islami Chhatrashibir, University of Chittagong branch is: our goal, our history and our five-point programme.',
    },
    title: ['About', 'us'],
    lede: 'Of the students of the University of Chittagong, for its students: who we are, what we want and how we work.',
    emblem: 'Our emblem and slogan',
    slogan: ['We are young,', 'we can do it'],
    who: 'Who we are',
    whoText: [
      'Bangladesh Islami Chhatrashibir is a student organisation founded on 6 February 1977 at the Central Mosque of the University of Dhaka. Its University of Chittagong branch works with the students of this campus, around their classes, their halls, the shuttle and their rights.',
      'After its full panel won CUCSU in 1981, the branch came a long way before working in the open again in 2024. In the 2025 CUCSU election students placed their trust in it once more, with 24 of the 26 posts.',
    ],
    pillars: [
      {
        title: 'Goal',
        text: 'To attain the pleasure of Allah by rebuilding every aspect of human life according to the guidance given by Allah and shown by the Messenger (peace be upon him).',
      },
      { title: 'Vision', text: 'Honest, skilled and patriotic citizens for a prosperous Bangladesh.' },
    ],
    martyrs: 'In memory of our martyrs, whose sacrifice made this journey possible',
  },
)

const PILLAR_STYLE = [
  { fill: '#f3f9fd', edge: 'linear-gradient(135deg,#1fa3dc,#b5e3f7 55%,#eaf3f9)' },
  { fill: '#f2f6fa', edge: 'linear-gradient(135deg,#114575,#9cc3e0 55%,#eaf3f9)' },
]

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/about', T[lang].meta)
}

export default async function AboutPage() {
  const lang = await getLang()
  const t = T[lang]
  const [settings, albums, martyrs] = await Promise.all([getSiteSettings(lang), getAlbums(1, lang), getMartyrs(lang)])
  const photo =
    pickImage(Array.isArray(albums[0]?.photos) ? albums[0].photos[1] ?? albums[0].photos[0] : null, 'hero') ??
    pickImage(settings.heroImage, 'hero')

  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede} />

      <section className="relative isolate overflow-hidden bg-night" aria-label={t.emblem}>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_70%_at_50%_50%,rgb(31_163_220/0.2),transparent_70%)]" />
        <div className="wrap">
          <ParticleEmblem slogan={t.slogan} />
        </div>
        <p className="sr-only">{t.slogan.join(' ')}</p>
      </section>

      <section className="wrap py-14 md:py-20" aria-labelledby="who">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="who" className="text-[1.8rem] font-bold leading-snug text-ink md:text-[2.3rem]">
              {t.who}
            </h2>
            <div className="mt-4 space-y-4 text-[1.08rem] leading-[1.85] text-muted">
              {t.whoText.map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
          </div>
          {photo && (
            <div data-reveal="scale" className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-[8px] border-white bg-pale-3 shadow-[0_30px_60px_rgb(11_31_51/0.15)]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
              </div>
            </div>
          )}
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {t.pillars.map((p, i) => (
            <li
              key={p.title}
              data-reveal="fade"
              style={vars({ '--d': `${i * 120}ms`, '--fill': PILLAR_STYLE[i].fill, '--edge': PILLAR_STYLE[i].edge })}
              className="edge rounded-[20px] p-7 md:p-9"
            >
              <h3 className="text-[1.4rem] font-bold text-ink">{p.title}</h3>
              <p className="mt-3 text-[1.1rem] leading-[1.8] text-text">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <RailTimeline stops={historyStops(lang)} />
      {martyrs.length > 0 && (
        <div className="bg-deep pb-14">
          <Link href="/martyrs" className="wrap flex items-center justify-center gap-3 text-center font-semibold text-slate-200 hover:text-white">
            <span aria-hidden="true" className="size-2 rounded-full bg-blue-soft shadow-[0_0_12px_#c4ecfc]" />
            {t.martyrs}
          </Link>
        </div>
      )}
      <Journey />
      <FivePoints />
      <Faq />
    </>
  )
}
