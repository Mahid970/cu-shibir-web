import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'

import { RichText } from '@/components/content/RichText'
import { ShareBar } from '@/components/content/ShareBar'
import { ArrowRight, CheckCircle, ChevronLeft, ChevronRight, Mail, SOCIAL_ICONS } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { getAllPeopleSlugs, getLeaders, getPersonBySlug } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { absoluteUrl, SITE } from '@/lib/site'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const SOCIAL_KEYS = ['facebook', 'x', 'instagram', 'youtube', 'telegram'] as const

export async function generateStaticParams() {
  const people = await getAllPeopleSlugs()
  return people.filter((p) => p.slug).map((p) => ({ slug: p.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const person = await getPersonBySlug(slug)
  if (!person) return {}
  const title = `${person.name}, ${person.position}`
  const description = `${person.name} — ${person.position}, ${SITE.name}।`
  const img = pickImage(person.photo, 'card')
  return {
    title,
    description,
    alternates: { canonical: `/leadership/${person.slug}` },
    // Profiles the branch hasn't filled in yet stay out of search results.
    robots: (person.profileCompleteness ?? 0) >= 50 ? undefined : { index: false, follow: true },
    openGraph: {
      type: 'profile',
      title,
      description,
      url: `/leadership/${person.slug}`,
      images: img ? [{ url: img.src, width: img.width, height: img.height, alt: person.name }] : undefined,
    },
  }
}

export default async function PersonPage({ params }: Props) {
  const { slug } = await params
  const [person, leaders] = await Promise.all([getPersonBySlug(slug), getLeaders('bn')])
  if (!person) notFound()

  const img = pickImage(person.photo, 'card')
  const details = [
    person.department && { k: 'বিভাগ', v: person.department },
    person.session && { k: 'শিক্ষাবর্ষ', v: person.session },
    person.hall && { k: 'হল', v: person.hall },
    person.term && { k: 'দায়িত্বের মেয়াদ', v: `সেশন ${person.term}` },
  ].filter(Boolean) as { k: string; v: string }[]
  const socials = SOCIAL_KEYS.filter((k) => person.socials?.[k])

  const at = leaders.findIndex((p) => p.id === person.id)
  const prev = at > 0 ? leaders[at - 1] : null
  const next = at >= 0 && at < leaders.length - 1 ? leaders[at + 1] : null

  const url = absoluteUrl(`/leadership/${person.slug}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: person.name,
        jobTitle: person.position,
        image: img ? absoluteUrl(img.src) : undefined,
        email: person.email ?? undefined,
        url,
        worksFor: { '@type': 'Organization', name: SITE.name, url: SITE.url },
        sameAs: socials.map((k) => person.socials![k]!),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'হোম', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'দায়িত্বশীলবৃন্দ', item: absoluteUrl('/leadership') },
          { '@type': 'ListItem', position: 3, name: person.name, item: url },
        ],
      },
    ],
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="relative isolate overflow-hidden bg-deep pb-28 pt-8 text-white md:pb-36 md:pt-12">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="dot-grid absolute inset-0 [mask-image:radial-gradient(70%_60%_at_30%_0%,#000,transparent)]" />
          <div className="absolute -left-40 top-10 h-[380px] w-[700px] rounded-full bg-[radial-gradient(closest-side,rgb(0_96_250/0.45),transparent)] blur-2xl" />
        </div>
        <div className="wrap max-w-5xl">
          <nav aria-label="ব্রেডক্রাম্ব" className="load-up flex flex-wrap gap-x-2 text-[0.92rem] text-white/60">
            <Link href="/" className="hover:text-white">
              হোম
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/leadership" className="hover:text-white">
              দায়িত্বশীলবৃন্দ
            </Link>
          </nav>
        </div>
      </header>

      <div className="wrap relative -mt-24 max-w-5xl md:-mt-32">
        <div className="card grid gap-8 p-5 sm:p-8 md:grid-cols-[280px_1fr] md:gap-10 md:p-10">
          <div className="load-scale relative mx-auto aspect-[4/4.6] w-full max-w-[280px] overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1d4ed8,#0b1428_75%)] shadow-[0_18px_40px_rgb(0_43_112/0.25)]">
            {img && (
              <ViewTransition name={`person-${person.slug}`} share="morph" default="none">
                <Image src={img.src} alt={person.name} fill priority sizes="280px" className="object-cover object-top" />
              </ViewTransition>
            )}
          </div>
          <div className="min-w-0">
            <p className="load-up w-fit rounded-lg bg-tag px-3 py-1 text-[0.9rem] font-bold text-ink" style={vars({ '--d': '80ms' })}>
              {person.position}
            </p>
            <h1 className="load-rise mt-3 text-[2rem] font-bold leading-snug text-ink md:text-[2.6rem]" style={vars({ '--d': '160ms' })}>
              {person.name}
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
                পরামর্শ বা এহতেসাব পাঠান
                <ArrowRight />
              </Link>
              {person.email && (
                <a href={`mailto:${person.email}`} className="btn btn-outline btn-sm">
                  <Mail className="size-5" />
                  ইমেইল
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
              বার্তা
            </h2>
            <RichText data={person.bio as never} className="prose-read mt-5" />
          </section>
        )}

        <div className="mt-8">
          <ShareBar url={url} title={`${person.name}, ${person.position}`} />
        </div>

        <nav aria-label="অন্যান্য দায়িত্বশীল" className="grid gap-3 pb-16 pt-10 sm:grid-cols-2 md:pb-22">
          {prev ? (
            <Link href={`/leadership/${prev.slug}`} className="card group flex items-center gap-3 p-4 hover:text-primary">
              <ChevronLeft className="size-5 shrink-0 text-subtle group-hover:text-primary" />
              <span>
                <span className="block text-[0.85rem] text-subtle">{prev.position}</span>
                <span className="font-semibold">{prev.name}</span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next && (
            <Link href={`/leadership/${next.slug}`} className="card group flex items-center justify-end gap-3 p-4 text-right hover:text-primary">
              <span>
                <span className="block text-[0.85rem] text-subtle">{next.position}</span>
                <span className="font-semibold">{next.name}</span>
              </span>
              <ChevronRight className="size-5 shrink-0 text-subtle group-hover:text-primary" />
            </Link>
          )}
        </nav>
      </div>
    </article>
  )
}
