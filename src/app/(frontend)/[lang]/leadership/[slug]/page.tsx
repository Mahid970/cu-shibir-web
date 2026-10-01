import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'

import { RichText } from '@/components/content/RichText'
import { ShareBar } from '@/components/content/ShareBar'
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Mail, SOCIAL_ICONS } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy, hasBangla, localePath } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getAllPeopleSlugs, getLeaders, getPersonBySlug } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { personFacts, personName, personPosition } from '@/lib/people'
import { lexicalToText } from '@/lib/searchText'
import { absoluteUrl, SITE, siteName } from '@/lib/site'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const SOCIAL_KEYS = ['facebook', 'x', 'instagram', 'youtube', 'telegram'] as const

const T = copy(
  {
    home: 'হোম',
    leaders: 'দায়িত্বশীলবৃন্দ',
    crumbs: 'ব্রেডক্রাম্ব',
    feedback: 'পরামর্শ বা এহতেসাব পাঠান',
    email: 'ইমেইল',
    message: 'বার্তা',
    others: 'অন্যান্য দায়িত্বশীল',
    bnOnly: '',
  },
  {
    home: 'Home',
    leaders: 'Leadership',
    crumbs: 'Breadcrumb',
    feedback: 'Send advice or ehtesab',
    email: 'Email',
    message: 'Message',
    others: 'Other leaders',
    bnOnly: 'This message is available in Bangla only.',
  },
)

export async function generateStaticParams() {
  const people = await getAllPeopleSlugs()
  return people.filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lang = await getLang()
  const person = await getPersonBySlug(slug, lang)
  if (!person) return {}
  const name = personName(person.name, lang)
  const position = personPosition(person.position, lang)
  const title = `${name}, ${position}`
  const description = lang === 'en' ? `${name}, ${position}, ${SITE.nameEn}.` : `${name} — ${position}, ${SITE.name}।`
  const img = pickImage(person.photo, 'card')
  const path = `/leadership/${person.slug}`
  return pageMeta(lang, path, {
    title,
    description,
    // Profiles the branch hasn't filled in yet stay out of search results.
    robots: (person.profileCompleteness ?? 0) >= 50 ? undefined : { index: false, follow: true },
    openGraph: {
      type: 'profile',
      siteName: siteName(lang),
      locale: lang === 'en' ? 'en_US' : 'bn_BD',
      title,
      description,
      url: localePath(lang, path),
      images: img ? [{ url: img.src, width: img.width, height: img.height, alt: name }] : undefined,
    },
  })
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params
  const lang = await getLang()
  const t = T[lang]
  const [person, leaders] = await Promise.all([getPersonBySlug(slug, lang), getLeaders(lang)])
  if (!person) notFound()

  const img = pickImage(person.photo, 'card')
  const name = personName(person.name, lang)
  const position = personPosition(person.position, lang)
  const details = personFacts(person, lang)
  const bioInBangla = lang === 'en' && hasBangla(lexicalToText(person.bio as never))
  const socials = SOCIAL_KEYS.filter((k) => person.socials?.[k])

  const at = leaders.findIndex((p) => p.id === person.id)
  const prev = at > 0 ? leaders[at - 1] : null
  const next = at >= 0 && at < leaders.length - 1 ? leaders[at + 1] : null

  const url = absoluteUrl(localePath(lang, `/leadership/${person.slug}`))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name,
        jobTitle: position,
        image: img ? absoluteUrl(img.src) : undefined,
        email: person.email ?? undefined,
        url,
        worksFor: { '@type': 'Organization', name: siteName(lang), url: SITE.url },
        sameAs: socials.map((k) => person.socials![k]!),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: absoluteUrl(localePath(lang, '/')) },
          { '@type': 'ListItem', position: 2, name: t.leaders, item: absoluteUrl(localePath(lang, '/leadership')) },
          { '@type': 'ListItem', position: 3, name, item: url },
        ],
      },
    ],
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="relative isolate overflow-hidden bg-deep pb-28 pt-8 text-white md:pb-36 md:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="lattice-night absolute inset-0 [mask-image:radial-gradient(70%_60%_at_30%_0%,#000,transparent)]" />
          <div className="absolute -left-40 top-10 h-[380px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(0_96_250/0.45),transparent)] blur-2xl" />
        </div>
        <div className="wrap max-w-5xl">
          <nav aria-label={t.crumbs} className="load-up flex flex-wrap gap-x-2 text-[0.92rem] text-white/60">
            <Link href="/" className="hover:text-white">
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/leadership" className="hover:text-white">
              {t.leaders}
            </Link>
          </nav>
        </div>
      </header>

      <div className="wrap relative -mt-24 max-w-5xl md:-mt-32">
        <div className="card grid gap-8 p-5 sm:p-8 md:grid-cols-[280px_1fr] md:gap-10 md:p-10">
          <div className="load-scale relative mx-auto aspect-[4/4.6] w-full max-w-[280px] overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1d4ed8,#0b1428_75%)] shadow-[0_18px_40px_rgb(0_43_112/0.25)]">
            {img && (
              <ViewTransition name={`person-${person.slug}`} share="morph" default="none">
                <Image src={img.src} alt={name} fill priority sizes="280px" className="object-cover object-top" />
              </ViewTransition>
            )}
          </div>
          <div className="min-w-0">
            <p className="load-up w-fit rounded-lg bg-tag px-3 py-1 text-[0.9rem] font-bold text-ink" style={vars({ '--d': '80ms' })}>
              {position}
            </p>
            <h1 className="load-rise mt-3 text-[2rem] font-bold leading-snug text-ink md:text-[2.6rem]" style={vars({ '--d': '160ms' })}>
              {name}
            </h1>
            {details.length > 0 && (
              <dl className="load-up mt-5 grid gap-x-6 gap-y-3 sm:grid-cols-2" style={vars({ '--d': '240ms' })}>
                {details.map((d) => (
                  <div key={d.k} className="flex items-start gap-2.5">
                    <CheckCircle className="mt-1 size-5 shrink-0 text-success" />
                    <div>
                      <dt className="text-[0.85rem] text-subtle">{d.k}</dt>
                      <dd className="font-semibold text-ink">{d.v}</dd>
                    </div>
                  </div>
                ))}
              </dl>
            )}
            <div className="load-up mt-7 flex flex-wrap gap-3" style={vars({ '--d': '320ms' })}>
              <Link href={`/join/feedback?to=${person.slug}`} className="btn btn-gradient btn-sm">
                {t.feedback}
                <ArrowRight />
              </Link>
              {person.email && (
                <a href={`mailto:${person.email}`} className="btn btn-outline btn-sm">
                  <Mail className="size-5" />
                  {t.email}
                </a>
              )}
            </div>
            {socials.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {socials.map((k) => {
                  const Icon = SOCIAL_ICONS[k]
                  return (
                    <li key={k}>
                      <a
                        href={person.socials![k]!}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={k}
                        className="grid size-10 place-items-center rounded-xl bg-pale-2 text-ink hover:bg-primary hover:text-white"
                      >
                        <Icon className="size-5" />
                      </a>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </div>

        {person.bio && (
          <section aria-labelledby="bio" className="card mt-6 p-6 sm:p-10 md:p-12">
            <h2 id="bio" className="text-[1.5rem] font-bold text-ink md:text-[1.8rem]">
              {t.message}
            </h2>
            {bioInBangla && <p className="mt-2 text-[0.95rem] text-subtle">{t.bnOnly}</p>}
            <div lang={bioInBangla ? 'bn' : undefined}>
              <RichText data={person.bio as never} className="prose-read mt-5" />
            </div>
          </section>
        )}

        <div className="mt-8">
          <ShareBar url={url} title={`${name}, ${position}`} />
        </div>

        <nav aria-label={t.others} className="grid gap-3 pb-16 pt-10 sm:grid-cols-2 md:pb-22">
          {prev ? (
            <Link href={`/leadership/${prev.slug}`} className="card group flex items-center gap-3 p-4 hover:text-primary">
              <ChevronLeft className="size-5 shrink-0 text-subtle group-hover:text-primary" />
              <span>
                <span className="block text-[0.85rem] text-subtle">{personPosition(prev.position, lang)}</span>
                <span className="font-semibold">{personName(prev.name, lang)}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/leadership/${next.slug}`} className="card group flex items-center justify-end gap-3 p-4 text-right hover:text-primary">
              <span>
                <span className="block text-[0.85rem] text-subtle">{personPosition(next.position, lang)}</span>
                <span className="font-semibold">{personName(next.name, lang)}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-subtle group-hover:text-primary" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}
