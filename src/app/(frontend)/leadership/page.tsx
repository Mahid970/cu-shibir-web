import type { Metadata } from 'next'
import Image from 'next/image'

import { LeaderCard } from '@/components/home/LeadersSection'
import { CheckCircle, Mail, SOCIAL_ICONS } from '@/components/ui/Icons'
import { EyebrowTab, SweepTitle, vars } from '@/components/ui/SectionTitle'
import { getLeaders } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { absoluteUrl, SITE } from '@/lib/site'
import type { Person } from '@/payload-types'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'দায়িত্বশীলবৃন্দ',
  description: 'বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখার কার্যকরী পরিষদ, সেশন ২০২৬।',
  alternates: { canonical: '/leadership' },
}

const SOCIAL_KEYS = ['facebook', 'x', 'instagram', 'youtube', 'telegram'] as const

/** President and secretary: wide glowing cards with every detail the profile has. */
function LeadCard({ person, index }: { person: Person; index: number }) {
  const img = pickImage(person.photo, 'card')
  const details = [
    person.department && `${person.department} বিভাগ`,
    person.session && `সেশন ${person.session}`,
    person.hall,
  ].filter(Boolean) as string[]
  const socials = SOCIAL_KEYS.filter((k) => person.socials?.[k])
  return (
    <article
      data-reveal="up"
      style={vars({ '--d': `${index * 150}ms` })}
      className="grid items-center gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_60px_rgb(0_96_250/0.15)] sm:grid-cols-[200px_1fr] sm:p-5"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1d4ed8,#0b1428_75%)]">
        {img && <Image src={img.src} alt={person.name} fill sizes="200px" className="object-cover object-top" priority />}
      </div>
      <div className="px-1 pb-2 sm:pb-0">
        <p className="w-fit rounded-lg bg-tag px-3 py-1 text-[0.85rem] font-bold text-ink">{person.position}</p>
        <h2 className="mt-3 text-[1.6rem] font-bold leading-snug text-white md:text-[2rem]">{person.name}</h2>
        {details.length > 0 && (
          <ul className="mt-3 space-y-1.5 text-[0.95rem] text-white/75">
            {details.map((d) => (
              <li key={d} className="flex items-center gap-2">
                <CheckCircle className="size-4 shrink-0 text-success" />
                {d}
              </li>
            ))}
          </ul>
        )}
        {(person.email || socials.length > 0) && (
          <div className="mt-4 flex flex-wrap gap-2">
            {person.email && (
              <a href={`mailto:${person.email}`} className="grid size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-ink" aria-label={`ইমেইল: ${person.email}`}>
                <Mail className="size-5" />
              </a>
            )}
            {socials.map((k) => {
              const Icon = SOCIAL_ICONS[k]
              return (
                <a key={k} href={person.socials![k]!} target="_blank" rel="noopener noreferrer" aria-label={k} className="grid size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-ink">
                  <Icon className="size-5" />
                </a>
              )
            })}
          </div>
        )}
      </div>
    </article>
  )
}

export default async function LeadershipPage() {
  const leaders = await getLeaders('bn')
  const top = leaders.slice(0, 2)
  const others = leaders.slice(2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.name,
    url: absoluteUrl('/'),
    member: leaders.map((p) => ({ '@type': 'OrganizationRole', roleName: p.position, member: { '@type': 'Person', name: p.name } })),
  }

  return (
    <div className="relative isolate overflow-hidden bg-deep pb-20 text-white md:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(70%_40%_at_50%_0%,#000,transparent)]" />
        <div className="absolute left-1/2 top-24 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(0_96_250/0.4),transparent)] blur-2xl" />
      </div>

      <EyebrowTab text="কার্যকরী পরিষদ ২০২৬" />
      <header className="wrap mt-8 text-center md:mt-10">
        <SweepTitle as="h1" className="mx-auto max-w-3xl text-[2.1rem] font-bold leading-snug text-white sm:text-[3rem]">
          চবি ছাত্রশিবিরের <span className="lime">দায়িত্বশীলবৃন্দ</span>
        </SweepTitle>
        <p className="mx-auto mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-slate-400">
          সেশন ২০২৬-এর কার্যকরী পরিষদ। পরামর্শ বা এহতেসাব থাকলে সংশ্লিষ্ট দায়িত্বশীলকে সরাসরি লিখুন।
        </p>
      </header>

      <div className="wrap mt-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {top.map((p, i) => (
            <LeadCard key={p.id} person={p} index={i} />
          ))}
        </div>

        {others.length > 0 && (
          <section className="mt-20" aria-labelledby="secretariat">
            <h2 id="secretariat" className="text-center text-[1.9rem] font-bold text-white md:text-[2.5rem]">
              <span className="text-mint">সম্পাদক</span>মণ্ডলী
            </h2>
            <ul className="mx-auto mt-10 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
              {others.map((p, i) => (
                <li key={p.id}>
                  <LeaderCard person={p} index={i} />
                </li>
              ))}
            </ul>
          </section>
        )}
      </div>
    </div>
  )
}
