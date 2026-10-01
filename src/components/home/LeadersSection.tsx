import Image from 'next/image'
import { Link } from '@/i18n/link'
import { ViewTransition } from 'react'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import { pickImage } from '@/lib/media'
import { personDetails, personName, personPosition } from '@/lib/people'
import type { Person } from '@/payload-types'

const T = copy(
  {
    title: ['তোমাদের পাশে', 'দায়িত্বশীলবৃন্দ'],
    lede: '২০২৬ সেশনের কার্যকরী পরিষদ। প্রশ্ন, পরামর্শ বা অভিযোগ সরাসরি জানাও।',
    all: (n: string) => `সবাইকে দেখুন (${n} জন)`,
  },
  {
    title: ['Beside you:', 'our leadership'],
    lede: 'The executive committee for 2026. Send your questions, advice or complaints to them directly.',
    all: (n: string) => `See all ${n}`,
  },
)

/** Mentor-style dark card: photo on a blue glow, name, role badge, known details with checks. */
export async function LeaderCard({
  person,
  highlight = false,
  index = 0,
}: {
  person: Person
  highlight?: boolean
  index?: number
}) {
  const img = pickImage(person.photo, 'card')
  const lang = await getLang()
  const name = personName(person.name, lang)
  const details = personDetails(person, lang)
  return (
    <article
      data-reveal="fade"
      data-amount="0.1"
      style={vars({ '--d': `${(index % 4) * 100}ms` })}
      className="group relative flex h-full flex-col gap-3 rounded-[20px] border border-white/[0.08] bg-night-card p-3 text-white transition-colors hover:border-white/25"
    >
      <div className="relative aspect-[4/3.6] overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1f8fcf,#0a1d30_75%)]">
        {img && (
          <ViewTransition name={`person-${person.slug}`} share="morph" default="none">
            <Image
              src={img.src}
              alt={name}
              fill
              sizes="(min-width: 1024px) 280px, 45vw"
              className="object-cover object-top"
            />
          </ViewTransition>
        )}
      </div>
      <h3 className="px-1 text-center text-[1.1rem] font-bold leading-snug text-white md:text-[1.2rem]">
        <Link href={`/leadership/${person.slug}`} className="after:absolute after:inset-0 group-hover:underline">
          {name}
        </Link>
      </h3>
      <p
        className={`mx-auto rounded-lg px-3 py-1 text-center text-[0.8rem] font-semibold leading-snug ${
          highlight ? 'bg-blue-soft text-ink' : 'bg-white/10 text-white/85'
        }`}
      >
        {personPosition(person.position, lang)}
      </p>
      {details.length > 0 && (
        <ul className="space-y-1.5 px-2 pb-2 text-[0.85rem] text-white/75">
          {details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-blue-soft" />
              {d}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

/** Night section: the executive committee as mentor-style cards. */
export async function LeadersSection({ leaders }: { leaders: Person[] }) {
  if (leaders.length === 0) return null
  const lang = await getLang()
  const t = T[lang]
  return (
    <section
      className="cv-auto relative isolate overflow-hidden bg-night py-16 text-white md:py-24"
      aria-labelledby="leaders"
    >
      <div
        aria-hidden="true"
        className="grid-lines-night absolute inset-0 -z-10 [mask-image:radial-gradient(80%_70%_at_50%_30%,#000,transparent)]"
      />
      <div className="wrap">
        <SectionTitle id="leaders" dark parts={[t.title[0], { hl: t.title[1] }]} />
        <p className="lede text-white/70!">{t.lede}</p>
        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {leaders.slice(0, 8).map((p, i) => (
            <li key={p.id}>
              <LeaderCard person={p} highlight={i < 2} index={i} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <Link href="/leadership" className="btn btn-ghost-light">
            {t.all(num(lang, leaders.length))}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
