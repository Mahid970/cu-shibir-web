import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/link'

import { LeaderCard } from '@/components/home/LeadersSection'
import { CheckCircle, Mail, SOCIAL_ICONS } from '@/components/ui/Icons'
import { EyebrowTab, SweepTitle, vars } from '@/components/ui/SectionTitle'
import { copy, localePath, type Locale } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getLeaders } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { personDetails, personName, personPosition } from '@/lib/people'
import { absoluteUrl, siteName } from '@/lib/site'
import type { Person } from '@/payload-types'

export const revalidate = 3600

const T = copy(
  {
    meta: {
      title: 'দায়িত্বশীলবৃন্দ',
      description: 'বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখার কার্যকরী পরিষদ, সেশন ২০২৬।',
    },
    eyebrow: 'কার্যকরী পরিষদ ২০২৬',
    title: ['চবি ছাত্রশিবিরের', 'দায়িত্বশীলবৃন্দ', ''],
    lede: 'সেশন ২০২৬-এর কার্যকরী পরিষদ। পরামর্শ বা এহতেসাব থাকলে সংশ্লিষ্ট দায়িত্বশীলকে সরাসরি লিখুন।',
    secretariat: { before: '', hl: 'সম্পাদক', after: 'মণ্ডলী' },
    email: 'ইমেইল',
  },
  {
    meta: {
      title: 'Leadership',
      description: 'The executive committee of Bangladesh Islami Chhatrashibir, University of Chittagong branch, for 2026.',
    },
    eyebrow: 'Executive committee 2026',
    title: ['The', 'leadership', 'of CU Chhatrashibir'],
    lede: 'The executive committee for 2026. If you have advice or ehtesab, write to the leader concerned directly.',
    secretariat: { before: 'The ', hl: 'secretaries', after: '' },
    email: 'Email',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/leadership', T[lang].meta)
}

const SOCIAL_KEYS = ['facebook', 'x', 'instagram', 'youtube', 'telegram'] as const

/** President and secretary: wide glowing cards with every detail the profile has. */
function LeadCard({ person, index, lang }: { person: Person; index: number; lang: Locale }) {
  const img = pickImage(person.photo, 'card')
  const name = personName(person.name, lang)
  const details = personDetails(person, lang)
  const socials = SOCIAL_KEYS.filter((k) => person.socials?.[k])
  return (
    <article
      style={vars({ '--d': `${index * 150}ms` })}
      className="load-rise grid items-center gap-5 rounded-[28px] border border-white/10 bg-white/[0.04] p-4 shadow-[0_0_60px_rgb(31_143_207/0.15)] sm:grid-cols-[200px_1fr] sm:p-5"
    >
      <div className="relative aspect-square overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1f8fcf,#0a1d30_75%)]">
        {img && <Image src={img.src} alt={name} fill sizes="200px" className="object-cover object-top" priority />}
      </div>
      <div className="px-1 pb-2 sm:pb-0">
        <p className="w-fit rounded-lg bg-blue-soft px-3 py-1 text-[0.85rem] font-bold text-ink">{personPosition(person.position, lang)}</p>
        <h2 className="mt-3 text-[1.6rem] font-bold leading-snug text-white md:text-[2rem]">
          <Link href={`/leadership/${person.slug}`} className="hover:underline">
            {name}
          </Link>
        </h2>
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
              <a href={`mailto:${person.email}`} className="grid size-10 place-items-center rounded-xl bg-white/10 text-white hover:bg-white hover:text-ink" aria-label={`${T[lang].email}: ${person.email}`}>
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
  const lang = await getLang()
  const t = T[lang]
  const leaders = await getLeaders(lang)
  const top = leaders.slice(0, 2)
  const others = leaders.slice(2)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: siteName(lang),
    url: absoluteUrl(localePath(lang, '/')),
    member: leaders.map((p) => ({
      '@type': 'OrganizationRole',
      roleName: personPosition(p.position, lang),
      member: { '@type': 'Person', name: personName(p.name, lang) },
    })),
  }

  return (
    <div className="relative isolate overflow-hidden bg-deep pb-20 text-white md:pb-28">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
        <div className="grid-lines-night absolute inset-0 [mask-image:radial-gradient(70%_40%_at_50%_0%,#000,transparent)]" />
        <div className="absolute left-1/2 top-24 h-[420px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(31_143_207/0.4),transparent)] blur-2xl" />
      </div>

      <EyebrowTab text={t.eyebrow} />
      <header className="wrap mt-8 text-center md:mt-10">
        <SweepTitle as="h1" className="mx-auto max-w-3xl text-[2.1rem] font-bold leading-snug text-white sm:text-[3rem]">
          {t.title[0]} <span className="glow">{t.title[1]}</span> {t.title[2]}
        </SweepTitle>
        <p className="mx-auto mt-4 max-w-2xl text-[1.05rem] leading-relaxed text-slate-400">{t.lede}</p>
      </header>

      <div className="wrap mt-12">
        <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-2">
          {top.map((p, i) => (
            <LeadCard key={p.id} person={p} index={i} lang={lang} />
          ))}
        </div>

        {others.length > 0 && (
          <section className="mt-20" aria-labelledby="secretariat">
            <h2 id="secretariat" className="text-center text-[1.9rem] font-bold text-white md:text-[2.5rem]">
              {t.secretariat.before}
              <span className="text-blue-soft">{t.secretariat.hl}</span>
              {t.secretariat.after}
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
