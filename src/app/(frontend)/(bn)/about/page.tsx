import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ParticleEmblem } from '@/components/about/ParticleEmblem'
import { RailTimeline } from '@/components/about/RailTimeline'
import { Faq } from '@/components/home/Faq'
import { FivePoints } from '@/components/home/FivePoints'
import { Journey } from '@/components/home/Journey'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { HISTORY } from '@/content/history'
import { getAlbums, getMartyrs, getSiteSettings } from '@/lib/cms'
import { pickImage } from '@/lib/media'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'আমাদের কথা',
  description: 'বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখার পরিচিতি, লক্ষ্য, ইতিহাস ও ৫ দফা কর্মসূচি।',
  alternates: { canonical: '/about' },
}

const PILLARS = [
  {
    title: 'লক্ষ্য',
    text: 'আল্লাহ প্রদত্ত ও রাসূল (সা.) প্রদর্শিত বিধান অনুযায়ী মানুষের সার্বিক জীবনের পুনর্বিন্যাস সাধন করে আল্লাহর সন্তুষ্টি অর্জন।',
    fill: '#f3f6ff',
    edge: 'linear-gradient(135deg,#3564ff,#a9bcff 55%,#eef2ff)',
  },
  {
    title: 'স্বপ্ন',
    text: 'সমৃদ্ধ বাংলাদেশ গড়ার লক্ষ্যে সৎ, দক্ষ ও দেশপ্রেমিক নাগরিক তৈরি।',
    fill: '#effaf3',
    edge: 'linear-gradient(135deg,#22c55e,#bbf7d0 55%,#effaf3)',
  },
]

export default async function AboutPage() {
  const [settings, albums, martyrs] = await Promise.all([getSiteSettings('bn'), getAlbums(1, 'bn'), getMartyrs('bn')])
  const photo =
    pickImage(Array.isArray(albums[0]?.photos) ? albums[0].photos[1] ?? albums[0].photos[0] : null, 'hero') ??
    pickImage(settings.heroImage, 'hero')

  return (
    <>
      <PageHeader
        title={['আমাদের', { hl: 'কথা' }]}
        lede="চট্টগ্রাম বিশ্ববিদ্যালয়ের শিক্ষার্থীদের নিয়ে, শিক্ষার্থীদের জন্য — আমরা কারা, কী চাই, কীভাবে কাজ করি।"
      />

      <section className="relative isolate overflow-hidden bg-night" aria-label="আমাদের প্রতীক ও স্লোগান">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(45%_70%_at_50%_50%,rgb(53_100_255/0.22),transparent_70%)]" />
        <div className="wrap">
          <ParticleEmblem />
        </div>
        <p className="sr-only">আমরা তরুণ, আমরাই পারি</p>
      </section>

      <section className="wrap py-14 md:py-20" aria-labelledby="who">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <h2 id="who" className="text-[1.8rem] font-bold leading-snug text-ink md:text-[2.3rem]">
              আমরা কারা
            </h2>
            <div className="mt-4 space-y-4 text-[1.08rem] leading-[1.85] text-muted">
              <p>
                বাংলাদেশ ইসলামী ছাত্রশিবির ১৯৭৭ সালের ৬ ফেব্রুয়ারি ঢাকা বিশ্ববিদ্যালয় কেন্দ্রীয় মসজিদে প্রতিষ্ঠিত একটি ছাত্রসংগঠন।
                এর চট্টগ্রাম বিশ্ববিদ্যালয় শাখা কাজ করে এই ক্যাম্পাসের শিক্ষার্থীদের নিয়ে — ক্লাস, হল, শাটল আর শিক্ষার্থীদের
                অধিকার ঘিরে।
              </p>
              <p>
                ১৯৮১ সালে চাকসুর পূর্ণ প্যানেলে জয়ের পর দীর্ঘ পথ পেরিয়ে ২০২৪ সালে শাখা আবার প্রকাশ্যে কাজ শুরু করে। ২০২৫ সালের চাকসু
                নির্বাচনে শিক্ষার্থীরা আবার আস্থা রাখেন — ২৬টি পদের ২৪টিতে।
              </p>
            </div>
          </div>
          {photo && (
            <div data-reveal="scale" className="relative">
              <div className="relative aspect-[4/3] overflow-hidden rounded-[28px] border-[8px] border-white bg-pale-3 shadow-[0_30px_60px_rgb(11_15_46/0.15)]">
                <Image src={photo.src} alt={photo.alt} fill sizes="(min-width: 1024px) 600px, 100vw" className="object-cover" />
              </div>
            </div>
          )}
        </div>

        <ul className="mt-14 grid gap-5 md:grid-cols-2">
          {PILLARS.map((p, i) => (
            <li
              key={p.title}
              data-reveal="fade"
              style={vars({ '--d': `${i * 120}ms`, '--fill': p.fill, '--edge': p.edge })}
              className="edge rounded-[20px] p-7 md:p-9"
            >
              <h3 className="text-[1.4rem] font-bold text-ink">{p.title}</h3>
              <p className="mt-3 text-[1.1rem] leading-[1.8] text-text">{p.text}</p>
            </li>
          ))}
        </ul>
      </section>

      <RailTimeline stops={HISTORY} />
      {martyrs.length > 0 && (
        <div className="bg-deep pb-14">
          <Link href="/martyrs" className="wrap flex items-center justify-center gap-3 text-center font-semibold text-slate-200 hover:text-white">
            <span aria-hidden="true" className="size-2 rounded-full bg-sky-200 shadow-[0_0_12px_#e0f2fe]" />
            শহীদ স্মরণ: যাঁদের ত্যাগে এই পথচলা
          </Link>
        </div>
      )}
      <Journey />
      <FivePoints />
      <Faq />
    </>
  )
}
