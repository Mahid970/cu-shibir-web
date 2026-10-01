import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'

import { RichText } from '@/components/content/RichText'
import { ShareBar } from '@/components/content/ShareBar'
import { MartyrGallery, type GalleryGroup } from '@/components/martyrs/MartyrGallery'
import { ReadingThread } from '@/components/martyrs/ReadingThread'
import { ArrowRight, ChevronLeft, ChevronRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy, langAttr, localePath } from '@/i18n/config'
import { date } from '@/i18n/format'
import { Link } from '@/i18n/link'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getMartyrBySlug, getMartyrs } from '@/lib/cms'
import { martyrOrdinal, RANKS, splitHonorific } from '@/lib/martyrs'
import { pickImage } from '@/lib/media'
import { absoluteUrl, SITE, siteName } from '@/lib/site'
import type { Martyr, Media } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const T = copy(
  {
    home: 'হোম',
    martyrs: 'শহীদ স্মরণ',
    crumbs: 'ব্রেডক্রাম্ব',
    facts: 'এক নজরে',
    date: 'শাহাদাতের তারিখ',
    place: 'শাহাদাতের স্থান',
    affiliation: 'পড়াশোনা',
    rank: 'সাংগঠনিক মান',
    role: 'দায়িত্ব',
    hall: 'হল',
    home2: 'বাড়ি',
    born: 'জন্ম',
    family: 'পরিবার',
    attackers: 'যাদের হামলায় শহীদ',
    wounds: 'আঘাতের ধরন',
    story: 'তাঁর গল্প',
    gallery: 'ছবিতে',
    groups: { life: 'জীবন', day: 'শাহাদাতের দিন', after: 'পরবর্তী', place: 'যেখানে ঘটেছিল' },
    sources: 'তথ্যসূত্র',
    prev: 'আগের শহীদ',
    next: 'পরের শহীদ',
    all: 'পুরো কাফেলা দেখুন',
    ayah: 'আর যারা আল্লাহর পথে নিহত হয়, তাদের মৃত বলো না; বরং তারা জীবিত, কিন্তু তোমরা তা উপলব্ধি করতে পার না।',
    ref: 'সূরা আল বাকারা, আয়াত ১৫৪',
  },
  {
    home: 'Home',
    martyrs: 'Our martyrs',
    crumbs: 'Breadcrumb',
    facts: 'At a glance',
    date: 'Martyred',
    place: 'Where',
    affiliation: 'Studies',
    rank: 'Level',
    role: 'Responsibility',
    hall: 'Hall',
    home2: 'Home',
    born: 'Born',
    family: 'Family',
    attackers: 'Killed by',
    wounds: 'How he was attacked',
    story: 'His story',
    gallery: 'In pictures',
    groups: { life: 'His life', day: 'The day', after: 'Afterwards', place: 'The places' },
    sources: 'Sources',
    prev: 'Previous martyr',
    next: 'Next martyr',
    all: 'See the whole caravan',
    ayah: 'And do not say of those who are killed in the way of Allah that they are dead. Rather, they are alive, but you do not perceive it.',
    ref: 'Surah Al-Baqarah, verse 154',
  },
)

export async function generateStaticParams() {
  const martyrs = await getMartyrs('bn')
  return martyrs.filter((m) => m.slug).map((m) => ({ slug: m.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lang = await getLang()
  const m = await getMartyrBySlug(slug, lang)
  if (!m) return {}
  const img = pickImage(m.photo, 'card')
  const when = m.date ? date(lang, m.date) : ''
  const title = when ? `${m.name} (${when})` : m.name
  const description = m.summary || title
  const path = `/martyrs/${m.slug}`
  return pageMeta(lang, path, {
    title,
    description,
    openGraph: {
      type: 'profile',
      siteName: siteName(lang),
      locale: lang === 'en' ? 'en_US' : 'bn_BD',
      title,
      description,
      url: localePath(lang, path),
      images: img ? [{ url: img.src, width: img.width, height: img.height, alt: m.name }] : undefined,
    },
  })
}

/** Paragraphs are separated by blank lines in the CMS. */
const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

function Neighbour({ m, label, dir, lang }: { m: Martyr; label: string; dir: 'prev' | 'next'; lang: 'bn' | 'en' }) {
  const img = pickImage(m.photo, 'thumb')
  return (
    <Link
      href={`/martyrs/${m.slug}`}
      className={`card group flex items-center gap-4 p-3 transition hover:-translate-y-0.5 ${dir === 'next' ? 'flex-row-reverse text-right' : ''}`}
    >
      <span className="journey-arch relative block h-[76px] w-[60px] shrink-0 overflow-hidden bg-pale-3">
        {img && <Image src={img.src} alt="" fill sizes="60px" className="object-cover object-top" />}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`flex items-center gap-1 text-[0.82rem] font-semibold text-primary ${dir === 'next' ? 'justify-end' : ''}`}>
          {dir === 'prev' && <ChevronLeft className="size-4" />}
          {label}
          {dir === 'next' && <ChevronRight className="size-4" />}
        </span>
        <span className="mt-0.5 block font-bold leading-snug text-ink">{m.name}</span>
        {m.date && <span className="block text-[0.85rem] text-muted">{date(lang, m.date)}</span>}
      </span>
    </Link>
  )
}

export default async function MartyrPage({ params }: Props) {
  const { slug } = await params
  const lang = await getLang()
  const t = T[lang]
  const [m, all] = await Promise.all([getMartyrBySlug(slug, lang), getMartyrs(lang)])
  if (!m) notFound()

  const portrait = pickImage(m.photo, 'hero') ?? pickImage(m.photo, 'card')
  const { honorific, rest } = splitHonorific(m.name)
  const when = m.dateText || (m.date ? date(lang, m.date) : '')
  const at = all.findIndex((x) => x.id === m.id)
  const prev = at > 0 ? all[at - 1] : null
  const next = at >= 0 && at < all.length - 1 ? all[at + 1] : null

  const facts = [
    [t.date, when],
    [t.place, m.place],
    [t.affiliation, m.affiliation],
    [t.rank, m.rank ? RANKS[lang][m.rank] : null],
    [t.role, m.role],
    [t.hall, m.hall],
    [t.home2, m.home],
    [t.born, m.born],
    [t.family, m.family],
    [t.attackers, m.attackers],
    [t.wounds, m.wounds],
  ].filter((f): f is [string, string] => !!f[1])

  const groups: GalleryGroup[] = (['life', 'day', 'after', 'place'] as const)
    .map((kind) => ({
      title: t.groups[kind],
      photos: (m.gallery ?? [])
        .filter((g) => (g.kind ?? 'life') === kind && typeof g.photo === 'object')
        .map((g) => {
          const media = g.photo as Media
          const img = pickImage(media, 'card')!
          return { ...img, caption: media.caption || '', credit: media.credit || '', graphic: !!g.graphic }
        }),
    }))
    .filter((g) => g.photos.length > 0)

  const url = absoluteUrl(localePath(lang, `/martyrs/${m.slug}`))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        name: m.name,
        deathDate: m.date ? m.date.slice(0, 10) : undefined,
        image: portrait ? absoluteUrl(portrait.src) : undefined,
        description: m.summary || undefined,
        url,
        memberOf: { '@type': 'Organization', name: siteName(lang), url: SITE.url },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: absoluteUrl(localePath(lang, '/')) },
          { '@type': 'ListItem', position: 2, name: t.martyrs, item: absoluteUrl(localePath(lang, '/martyrs')) },
          { '@type': 'ListItem', position: 3, name: m.name, item: url },
        ],
      },
    ],
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <header className="relative isolate overflow-hidden bg-night pb-32 pt-8 text-white md:pb-40 md:pt-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="journey-sky absolute inset-0" />
          <div className="journey-stars absolute inset-0" />
          <div className="grid-lines-night absolute inset-0 opacity-50 [mask-image:radial-gradient(70%_60%_at_30%_20%,#000,transparent)]" />
          <div className="hero-glow absolute bottom-[-40%] left-[28%] h-[70%] w-[70%] -translate-x-1/2 rounded-[50%] opacity-70" />
        </div>
        <div className="wrap max-w-6xl">
          <nav aria-label={t.crumbs} className="load-up flex flex-wrap gap-x-2 text-[0.92rem] text-white/60">
            <Link href="/" className="hover:text-white">
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/martyrs" className="hover:text-white">
              {t.martyrs}
            </Link>
            <span aria-hidden="true">/</span>
            <span className="text-white/85" aria-current="page">
              {m.name}
            </span>
          </nav>

          <div className="mt-8 grid items-center gap-10 md:grid-cols-[minmax(0,300px)_1fr] lg:gap-16">
            <div className="martyr-portrait relative mx-auto w-[230px] md:w-full">
              <span aria-hidden="true" className="martyr-halo absolute -inset-6 rounded-[999px_999px_2rem_2rem]" />
              <span className="journey-arch martyr-arch relative block aspect-[5/6] w-full overflow-hidden bg-navy">
                {portrait && <Image src={portrait.src} alt={m.name} fill priority sizes="(min-width: 768px) 300px, 230px" className="object-cover object-top" />}
              </span>
            </div>

            <div className="text-center md:text-left">
              <p className="load-up flex flex-wrap justify-center gap-2 md:justify-start">
                {m.number && <span className="rounded-full bg-blue-soft px-3 py-1 text-[0.85rem] font-bold text-ink">{martyrOrdinal(lang, m.number)}</span>}
                {m.rank && <span className="rounded-full bg-white/10 px-3 py-1 text-[0.85rem] font-semibold text-white ring-1 ring-white/15">{RANKS[lang][m.rank]}</span>}
              </p>
              <h1 className="mt-5 text-white" lang={langAttr(lang, m.name)}>
                {honorific && (
                  <span className="load-rise block text-[1.2rem] font-semibold text-blue-soft" style={vars({ '--d': '60ms' })}>
                    {honorific}
                  </span>
                )}
                <span className="type-settle block text-[2.6rem] font-bold leading-[1.15] md:text-[3.4rem]" style={vars({ '--d': '120ms' })}>
                  {rest}
                </span>
              </h1>
              {when && (
                <p className="load-rise mt-4 text-[1.5rem] font-bold text-blue-soft" style={vars({ '--d': '260ms' })}>
                  {when}
                </p>
              )}
              {m.place && (
                <p className="load-rise mt-1 text-[1.02rem] text-white/70" style={vars({ '--d': '320ms' })}>
                  {m.place}
                </p>
              )}
              {m.summary && (
                <p className="load-rise mx-auto mt-6 max-w-xl text-[1.1rem] leading-[1.85] text-white/85 md:mx-0" style={vars({ '--d': '400ms' })}>
                  {m.summary}
                </p>
              )}
            </div>
          </div>
        </div>
        <svg aria-hidden="true" viewBox="0 0 1440 220" preserveAspectRatio="none" className="absolute inset-x-0 bottom-0 h-[90px] w-full md:h-[130px]">
          <path className="hill hill-back" d="M0 150C120 92 236 112 360 82S604 38 760 90s262-32 404-20 200 42 276 20v130H0Z" fill="#1f8fcf" fillOpacity=".36" />
          <path className="hill hill-mid" d="M0 172c160-50 300-22 460-58s296-12 440 22 280-34 400-14 104 22 140 12v86H0Z" fill="#5cc8f2" fillOpacity=".2" />
          <path d="M0 202c180-40 360-16 540-36s360-14 540 10 240-12 360 6v38H0Z" fill="var(--bg)" />
        </svg>
      </header>

      {facts.length > 0 && (
        <section aria-labelledby="facts" className="wrap relative z-10 -mt-10 max-w-5xl">
          <div data-reveal="up" className="card p-6 md:p-8">
            <h2 id="facts" className="text-[1.3rem] font-bold text-ink">
              {t.facts}
            </h2>
            <dl className="mt-5 grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-3">
              {facts.map(([k, v]) => (
                <div key={k}>
                  <dt className="text-[0.85rem] font-semibold text-subtle">{k}</dt>
                  <dd className="mt-0.5 font-semibold leading-snug text-ink" lang={langAttr(lang, v)}>
                    {v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </section>
      )}

      {m.quote && (
        <figure data-reveal="fade" className="wrap mt-14 max-w-3xl text-center md:mt-20">
          <span aria-hidden="true" className="mx-auto block h-1 w-12 rounded-full bg-blue" />
          <blockquote className="mt-4 text-[1.5rem] font-bold leading-[1.6] text-ink md:text-[1.9rem]">
            “{m.quote}”
          </blockquote>
          {m.quoteBy && <figcaption className="mt-3 text-muted">{m.quoteBy}</figcaption>}
        </figure>
      )}

      {m.story && m.story.length > 0 && (
        <section aria-labelledby="story" className="wrap mt-14 max-w-3xl md:mt-20">
          <h2 id="story" className="sr-only">
            {t.story}
          </h2>
          <ReadingThread>
            {m.story.map((part) => (
              <section key={part.id ?? part.heading} data-part className="story-part relative pb-10 pl-11 last:pb-2">
                <span aria-hidden="true" className="story-node absolute left-[11px] top-[0.35rem] grid size-6 -translate-x-1/2 place-items-center rounded-full">
                  <span className="size-2 rounded-full bg-current" />
                </span>
                <h3 className="text-[1.45rem] font-bold text-ink md:text-[1.6rem]">{part.heading}</h3>
                <div className="prose-read mt-3">
                  {paragraphs(part.text).map((p, i) => (
                    <p key={i}>{p}</p>
                  ))}
                </div>
              </section>
            ))}
          </ReadingThread>
          {m.bio && <RichText data={m.bio as never} className="prose-read mt-6 pl-11" />}
        </section>
      )}

      {groups.length > 0 && (
        <section aria-labelledby="gallery" className="wrap mt-16 max-w-5xl md:mt-24">
          <h2 id="gallery" className="text-[1.8rem] font-bold text-ink md:text-[2.2rem]">
            {t.gallery}
          </h2>
          <div className="mt-6">
            <MartyrGallery groups={groups} />
          </div>
        </section>
      )}

      <section className="wrap mt-16 max-w-5xl md:mt-20">
        <ShareBar url={url} title={m.name} />
        {m.sources && m.sources.length > 0 && (
          <div className="mt-8">
            <h2 className="text-[1.05rem] font-bold text-ink">{t.sources}</h2>
            <ul className="mt-2 grid gap-1 text-[0.92rem]">
              {m.sources.map((s) => (
                <li key={s.id ?? s.label}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-4 hover:text-blue-deep">
                      {s.label}
                    </a>
                  ) : (
                    s.label
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <nav aria-label={t.martyrs} className="wrap mt-12 max-w-5xl">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>{prev && <Neighbour m={prev} label={t.prev} dir="prev" lang={lang} />}</div>
          <div>{next && <Neighbour m={next} label={t.next} dir="next" lang={lang} />}</div>
        </div>
        <p className="mt-6 text-center">
          <Link href="/martyrs" className="btn btn-outline-blue btn-sm">
            {t.all}
            <ArrowRight />
          </Link>
        </p>
      </nav>

      <section className="relative isolate mt-16 overflow-hidden bg-night py-16 text-center text-white md:mt-24 md:py-20">
        <div aria-hidden="true" className="grid-lines-night absolute inset-0 -z-10 opacity-60" />
        <div className="wrap max-w-3xl">
          <p lang="ar" dir="rtl" className="font-[family-name:var(--font-quran)] text-[1.6rem] leading-[2.1] text-white/90 md:text-[1.9rem]">
            وَلَا تَقُولُوا لِمَنْ يُقْتَلُ فِي سَبِيلِ اللَّهِ أَمْوَاتٌ بَلْ أَحْيَاءٌ وَلَكِنْ لَا تَشْعُرُونَ
          </p>
          <p className="mt-4 leading-relaxed text-white/75">{t.ayah}</p>
          <p className="mt-1 text-[0.9rem] text-white/50">{t.ref}</p>
        </div>
      </section>
    </article>
  )
}
