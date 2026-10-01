import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { JourneySection } from '@/components/martyrs/JourneySection'
import { ArrowRight } from '@/components/ui/Icons'
import { copy, langAttr } from '@/i18n/config'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getMartyrs } from '@/lib/cms'
import { toStations } from '@/lib/martyrs'

export const revalidate = 3600

const T = copy(
  {
    meta: { title: 'শহীদ স্মরণ', description: 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখার শহীদদের স্মরণে: তাঁদের জীবন, শাহাদাতের ঘটনা আর ছবি।' },
    title: 'শহীদ স্মরণ',
    ayah: 'আর যারা আল্লাহর পথে নিহত হয়, তাদের মৃত বলো না; বরং তারা জীবিত, কিন্তু তোমরা তা উপলব্ধি করতে পার না।',
    ref: 'সূরা আল বাকারা, আয়াত ১৫৪',
    all: 'সকল শহীদ',
    read: 'গল্পটি পড়ুন',
  },
  {
    meta: { title: 'In memory of our martyrs', description: 'In memory of the martyrs of the University of Chittagong branch: their lives, how they were martyred, and photographs.' },
    title: 'In memory of our martyrs',
    ayah: 'And do not say of those who are killed in the way of Allah that they are dead. Rather, they are alive, but you do not perceive it.',
    ref: 'Surah Al-Baqarah, verse 154',
    all: 'All our martyrs',
    read: 'Read his story',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/martyrs', T[lang].meta)
}

/** শহীদ স্মরণ: the ayah, the journey through the branch's martyrs, and every martyr's card. Hidden while none is published. */
export default async function MartyrsPage() {
  const lang = await getLang()
  const t = T[lang]
  const stations = toStations(await getMartyrs(lang), lang)
  if (stations.length === 0) notFound()

  return (
    <div className="bg-night text-white">
      <header className="relative isolate overflow-hidden pb-12 pt-14 text-center md:pb-16 md:pt-20">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="journey-sky absolute inset-0" />
          <div className="journey-stars absolute inset-0" />
          <div className="grid-lines-night absolute inset-0 opacity-50 [mask-image:radial-gradient(60%_70%_at_50%_30%,#000,transparent)]" />
        </div>
        <div className="wrap max-w-3xl">
          <h1 className="type-settle text-[2.4rem] font-bold text-white md:text-[3.2rem]">{t.title}</h1>
          <p lang="ar" dir="rtl" className="load-rise mt-6 font-[family-name:var(--font-quran)] text-[1.6rem] leading-[2.1] text-white/90 md:text-[1.9rem]">
            وَلَا تَقُولُوا لِمَنْ يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ بَلْ أَحْيَاءٌ وَلَكِنْ لَا تَشْعُرُونَ
          </p>
          <p className="load-rise mt-3 leading-relaxed text-white/75">
            {t.ayah}
            <span className="mt-1 block text-[0.9rem] text-white/50">{t.ref}</span>
          </p>
        </div>
      </header>

      <JourneySection onMartyrsPage id="martyrs-journey" />

      <section aria-labelledby="all-martyrs" className="wrap pb-20 pt-4 md:pb-28">
        <h2 id="all-martyrs" className="text-center text-[1.8rem] font-bold text-white md:text-[2.2rem]">
          {t.all}
        </h2>
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stations.map((st, i) => (
            <li key={st.slug} data-reveal="up" style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}>
              <Link href={`/martyrs/${st.slug}`} className="journey-card group flex h-full gap-4 rounded-[1.25rem] p-3">
                <span className="journey-arch relative block h-[124px] w-[98px] shrink-0 overflow-hidden bg-navy">
                  {st.portrait && <Image src={st.portrait.src} alt="" fill sizes="98px" className="object-cover object-top" />}
                </span>
                <span className="min-w-0 py-1">
                  <span className="block text-[0.85rem] font-bold text-blue-soft">
                    {st.date}
                    {st.ordinal && <span className="ml-2 font-semibold text-white/50">· {st.ordinal}</span>}
                  </span>
                  <span className="mt-0.5 block text-[1.1rem] font-bold leading-snug text-white" lang={langAttr(lang, st.name)}>
                    {st.name}
                  </span>
                  <span className="mt-1 line-clamp-3 block text-[0.88rem] leading-relaxed text-white/65">{st.summary}</span>
                  <span className="journey-read mt-2 inline-flex items-center gap-1 text-[0.84rem] font-semibold text-white">
                    {t.read}
                    <ArrowRight className="size-3.5" />
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
