import Image from 'next/image'
import Link from 'next/link'
import { ViewTransition } from 'react'

import { ArrowRight, CheckCircle } from '@/components/ui/Icons'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { toBnDigits } from '@/lib/bn'
import { pickImage } from '@/lib/media'
import type { Person } from '@/payload-types'

/** Mentor-style dark card: photo on a blue glow, name, role badge, known details with checks. */
export function LeaderCard({
  person,
  highlight = false,
  index = 0,
}: {
  person: Person
  highlight?: boolean
  index?: number
}) {
  const img = pickImage(person.photo, 'card')
  const details = [
    person.department && `${person.department} বিভাগ`,
    person.session && `সেশন ${person.session}`,
    person.hall,
  ].filter(Boolean) as string[]
  return (
    <article
      data-reveal="fade"
      data-amount="0.1"
      style={vars({ '--d': `${(index % 4) * 100}ms` })}
      className="group relative flex h-full flex-col gap-3 rounded-[20px] border border-white/[0.08] bg-night-card p-3 text-white transition-colors hover:border-white/25"
    >
      <div className="relative aspect-[4/3.6] overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1d4ed8,#0b1428_75%)]">
        {img && (
          <ViewTransition name={`person-${person.slug}`} share="morph" default="none">
            <Image
              src={img.src}
              alt={person.name}
              fill
              sizes="(min-width: 1024px) 280px, 45vw"
              className="object-cover object-top"
            />
          </ViewTransition>
        )}
      </div>
      <h3 className="px-1 text-center text-[1.1rem] font-bold leading-snug text-white md:text-[1.2rem]">
        <Link href={`/leadership/${person.slug}`} className="after:absolute after:inset-0 group-hover:underline">
          {person.name}
        </Link>
      </h3>
      <p
        className={`mx-auto rounded-lg px-3 py-1 text-center text-[0.8rem] font-semibold leading-snug ${
          highlight ? 'bg-tag text-ink' : 'bg-white/10 text-white/85'
        }`}
      >
        {person.position}
      </p>
      {details.length > 0 && (
        <ul className="space-y-1.5 px-2 pb-2 text-[0.85rem] text-white/75">
          {details.map((d) => (
            <li key={d} className="flex items-start gap-2">
              <CheckCircle className="mt-0.5 size-4 shrink-0 text-success" />
              {d}
            </li>
          ))}
        </ul>
      )}
    </article>
  )
}

/** Night section: the executive committee as mentor-style cards. */
export function LeadersSection({ leaders }: { leaders: Person[] }) {
  if (leaders.length === 0) return null
  return (
    <section
      className="relative isolate overflow-hidden bg-night py-16 text-white md:py-24"
      aria-labelledby="leaders"
    >
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgb(255_255_255/0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgb(255_255_255/0.04)_1px,transparent_1px)] bg-[size:72px_72px]"
      />
      <div className="wrap">
        <SectionTitle id="leaders" dark parts={['তোমাদের পাশে', { hl: 'দায়িত্বশীলবৃন্দ' }]} />
        <p className="lede text-white/70!">
          ২০২৬ সেশনের কার্যকরী পরিষদ। প্রশ্ন, পরামর্শ বা অভিযোগ সরাসরি জানাও।
        </p>
        <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 lg:grid-cols-4">
          {leaders.slice(0, 8).map((p, i) => (
            <li key={p.id}>
              <LeaderCard person={p} highlight={i < 2} index={i} />
            </li>
          ))}
        </ul>
        <div className="mt-10 flex justify-center">
          <Link href="/leadership" className="btn btn-ghost-light">
            সবাইকে দেখুন ({toBnDigits(leaders.length)} জন)
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
