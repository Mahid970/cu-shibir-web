import { Link } from '@/i18n/link'

import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { MILESTONES } from '@/content/home'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'

const T = copy({ title: ['আমাদের', 'পথচলা'], more: 'বিস্তারিত' }, { title: ['Our', 'journey'], more: 'Read more' })

/** The branch's story in five dates on the navy gradient-bordered card; the line draws itself. */
export async function Milestones({ overlap = true, link = true, id }: { overlap?: boolean; link?: boolean; id?: string }) {
  const lang = await getLang()
  const t = T[lang]
  return (
    <section id={id} className={`wrap relative z-10 scroll-mt-24 ${overlap ? '-mt-16 lg:-mt-20' : ''}`} aria-labelledby="milestones">
      <div
        data-reveal="up"
        className="rounded-[25px] border border-transparent px-6 py-7 [background:linear-gradient(#002545,#002545)_padding-box,radial-gradient(90%_190%_at_35%_-45%,#00fb97_0%,rgba(53,100,255,0)_100%)_border-box] sm:px-10 sm:py-9"
      >
        <div className="flex flex-wrap items-end justify-between gap-3">
          <h2 id="milestones" className="text-[1.5rem] font-bold text-white md:text-[1.8rem]">
            {t.title[0]} <span className="text-mint">{t.title[1]}</span>
          </h2>
          {link && (
            <Link href="/about#history" className="inline-flex items-center gap-1.5 font-semibold text-white/80 hover:text-white">
              {t.more}
              <ArrowRight className="size-4" />
            </Link>
          )}
        </div>
        <ol className="relative mt-7 grid gap-y-5 sm:mt-8 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-5">
          <li aria-hidden="true" className="absolute bottom-3 left-[11px] top-3 w-[2px] bg-white/10 sm:hidden" />
          <li aria-hidden="true" className="absolute inset-x-0 top-[11px] hidden h-[2px] bg-white/10 lg:block">
            <span
              data-reveal="draw"
              className="block h-full bg-[linear-gradient(90deg,#6ea0ff,#00fbee,#00fb97,#fbc900,#f9a8d4)]"
            />
          </li>
          {MILESTONES.map((m, i) => (
            <li
              key={m.year}
              data-reveal="up"
              style={vars({ '--d': `${250 + i * 150}ms` })}
              className={`relative flex items-center gap-4 sm:block ${m.color}`}
            >
              <span aria-hidden="true" className="relative block size-6 shrink-0 rounded-full border-[5px] border-navy bg-current ring-2 ring-white/25" />
              <p className="text-[1.7rem] font-bold leading-none sm:mt-4 sm:text-[2.1rem]">{num(lang, m.year)}</p>
              <p className="text-[0.95rem] leading-snug text-white/75 sm:mt-2">{m.label[lang]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
