import Image from 'next/image'
import { Link } from '@/i18n/link'

import { FloatIcon } from '@/components/art/FloatIcon'
import { BallotBox, Book, Megaphone3D, Train } from '@/components/art/Icons3D'
import { ArrowRight } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

const T = copy(
  {
    title: ['পরিবর্তনের শুরু হোক,', 'তোমাকে দিয়েই।'],
    text: 'ক্লাসে, হলে, শাটলে — শিক্ষার্থীদের অধিকার আর সুন্দর ক্যাম্পাসের জন্য যারা কাজ করছে, তাদের সাথে যুক্ত হও। কোনো পরামর্শ বা এহতেসাব থাকলে সরাসরি লেখো।',
    join: 'সমর্থক হোন',
    write: 'পরামর্শ পাঠাও',
  },
  {
    title: ['Let the change begin', 'with you.'],
    text: 'In class, in the halls, on the shuttle: join the students working for their rights and a better campus. If you have advice or ehtesab for us, write to us directly.',
    join: 'Become a supporter',
    write: 'Send us advice',
  },
)

/** Closing banner: join, or write to us. Gradient border and a cluster of floating icons. */
export async function JoinBanner({ email }: { email: string }) {
  const t = T[await getLang()]
  return (
    <section className="cv-auto wrap py-10 md:py-14" aria-labelledby="join-banner">
      <div
        data-reveal="up"
        className="relative overflow-hidden rounded-3xl border-4 border-transparent [background:linear-gradient(115deg,#07334d,#04202e_55%,#083a55)_padding-box,linear-gradient(120deg,#5eead4,#1c9bd6_60%,#5eead4)_border-box]"
      >
        <div aria-hidden="true" className="lattice-night absolute inset-0 opacity-60" />
        <div className="relative grid items-center gap-8 p-7 sm:p-10 md:grid-cols-[1.25fr_1fr] md:p-12">
          <div>
            <h2 id="join-banner" className="text-[1.9rem] font-bold leading-snug text-white md:text-[2.6rem]">
              {t.title[0]}
              <br />
              <span className="text-blue-soft">{t.title[1]}</span>
            </h2>
            <p className="mt-4 max-w-xl text-[1.02rem] leading-relaxed text-white/75 md:text-[1.1rem]">
              {t.text}
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/join" className="btn btn-cta">
                {t.join}
                <ArrowRight />
              </Link>
              <a href={`mailto:${email}`} className="btn btn-ghost-light">
                {t.write}
              </a>
            </div>
          </div>
          <div aria-hidden="true" className="relative mx-auto h-56 w-full max-w-sm md:h-64">
            <div className="absolute left-1/2 top-1/2 grid size-32 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-[28px] bg-white shadow-[0_20px_50px_rgb(0_96_250/0.45)] md:size-36">
              <Image src="/brand/logo-legacy.png" alt="" width={100} height={100} className="size-24 md:size-28" />
            </div>
            <FloatIcon className="left-[6%] top-[4%]" rotate={-12} drift={12} duration={5.6}>
              <Book className="w-14" />
            </FloatIcon>
            <FloatIcon className="right-[6%] top-[0%]" rotate={10} drift={14} duration={6.4} delay={0.45}>
              <Megaphone3D className="w-16" />
            </FloatIcon>
            <FloatIcon className="bottom-[2%] left-[10%]" rotate={8} drift={10} duration={6} delay={0.55}>
              <BallotBox className="w-14" />
            </FloatIcon>
            <FloatIcon className="bottom-[6%] right-[10%]" rotate={-8} drift={12} duration={5.2} delay={0.65}>
              <Train className="w-12" />
            </FloatIcon>
          </div>
        </div>
      </div>
    </section>
  )
}
