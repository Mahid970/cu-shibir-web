import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'

import { ArrowRight, CheckCircle, ExternalLink, Mail } from '@/components/ui/Icons'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { FIVE_POINTS, MILESTONES } from '@/content/home'
import { EN, positionEn } from '@/content/en'
import { formatDate } from '@/lib/bn'
import { getLatestPosts, getLeaders, getLeadersEnglish, getPressCoverage, getSiteSettings } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { absoluteUrl, SITE } from '@/lib/site'

export const revalidate = 3600

export const metadata: Metadata = {
  title: { absolute: `${EN.name}, ${EN.branch}` },
  description: EN.intro,
  alternates: { canonical: '/en', languages: { 'bn-BD': '/', en: '/en', 'x-default': '/' } },
  openGraph: { title: `${EN.name}, ${EN.branch}`, description: EN.intro, url: '/en', locale: 'en_US' },
}

const date = (d: string) => formatDate(d, { locale: 'en' })

export default async function EnglishHome() {
  const [settings, leaders, english, press, posts] = await Promise.all([
    getSiteSettings('en'),
    getLeaders('bn'),
    getLeadersEnglish(),
    getPressCoverage(6),
    getLatestPosts(3, 'bn'),
  ])
  const photo = pickImage(settings.heroImage, 'hero')
  const email = settings.contact?.email || SITE.email

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE.nameEn,
    alternateName: SITE.name,
    url: absoluteUrl('/en'),
    email,
    foundingDate: '1977-02-06',
    parentOrganization: { '@type': 'Organization', name: 'Bangladesh Islami Chhatrashibir', url: 'https://shibir.org.bd' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="hero-wash relative isolate overflow-hidden pb-16 pt-10 md:pb-24 md:pt-16" aria-labelledby="en-title">
        <div aria-hidden="true" className="grid-paper absolute inset-0 -z-10" />
        <div className="wrap grid items-center gap-10 lg:grid-cols-[1.05fr_1fr]">
          <div>
            <p className="load-up inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-[0.9rem] font-semibold text-ink shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
              <Image src="/brand/logo-legacy.png" alt="" width={22} height={22} />
              {EN.branch}
            </p>
            <h1 id="en-title" className="load-rise mt-5 text-[2.3rem] font-bold leading-[1.15] text-ink sm:text-[3rem] lg:text-[3.5rem]" style={vars({ '--d': '100ms' })}>
              Bangladesh Islami <span className="hl">Chhatrashibir</span>
            </h1>
            <p className="load-rise mt-5 max-w-xl text-[1.1rem] leading-relaxed text-muted" style={vars({ '--d': '200ms' })}>
              {EN.intro}
            </p>
            <div className="load-up mt-8 flex flex-wrap gap-3" style={vars({ '--d': '300ms' })}>
              <a href="#contact" className="btn btn-yellow">
                Contact us
                <ArrowRight />
              </a>
              <Link href="/" hrefLang="bn" className="btn btn-outline">
                Read in Bangla
              </Link>
            </div>
          </div>
          {photo && (
            <div className="load-scale relative aspect-[4/3] overflow-hidden rounded-[28px] border-[8px] border-white shadow-[0_24px_60px_rgb(0_43_112/0.18)]" style={vars({ '--d': '250ms' })}>
              <Image src={photo.src} alt={photo.alt || 'Students at a programme of the branch'} fill priority sizes="(min-width: 1024px) 560px, 100vw" className="object-cover" />
            </div>
          )}
        </div>
      </section>

      {/* Who we are */}
      <section id="about" className="wrap scroll-mt-24 py-16 md:py-22" aria-labelledby="about-title">
        <SectionTitle id="about-title" parts={['Who', { hl: 'we are' }]} />
        <div className="mx-auto mt-10 grid max-w-5xl gap-6 lg:grid-cols-[1.2fr_1fr]">
          <div className="space-y-4 text-[1.08rem] leading-relaxed text-ink/85" data-reveal="fade">
            {EN.who.map((p) => (
              <p key={p}>{p}</p>
            ))}
          </div>
          <dl className="grid gap-4" data-reveal="fade" style={vars({ '--d': '120ms' })}>
            <div className="edge rounded-[18px] p-6" style={vars({ '--fill': '#f3f6ff', '--edge': 'linear-gradient(135deg,#3564ff,#a9bcff 55%,#eef2ff)' })}>
              <dt className="font-bold text-primary">Goal</dt>
              <dd className="mt-1 leading-relaxed text-ink">{EN.goal}</dd>
            </div>
            <div className="edge rounded-[18px] p-6" style={vars({ '--fill': '#effbf9', '--edge': 'linear-gradient(135deg,#14b8a6,#99f6e4 55%,#effbf9)' })}>
              <dt className="font-bold text-[#0f766e]">Vision</dt>
              <dd className="mt-1 leading-relaxed text-ink">{EN.vision}</dd>
            </div>
          </dl>
        </div>

        {/* Timeline */}
        <div
          data-reveal="up"
          className="mx-auto mt-14 max-w-6xl rounded-[25px] border border-transparent px-6 py-7 [background:linear-gradient(#002545,#002545)_padding-box,radial-gradient(90%_190%_at_35%_-45%,#00fb97_0%,rgba(53,100,255,0)_100%)_border-box] sm:px-10 sm:py-9"
        >
          <h3 className="text-[1.5rem] font-bold text-white md:text-[1.8rem]">
            Our story at <span className="text-mint">CU</span>
          </h3>
          <ol className="mt-7 grid gap-y-5 sm:grid-cols-3 sm:gap-x-6 sm:gap-y-8 lg:grid-cols-5">
            {EN.milestones.map((m, i) => (
              <li key={m.year} className={`flex items-center gap-4 sm:block ${MILESTONES[i]?.color ?? 'text-white'}`}>
                <span aria-hidden="true" className="block size-6 shrink-0 rounded-full border-[5px] border-navy bg-current ring-2 ring-white/25" />
                <p className="text-[1.7rem] font-bold leading-none sm:mt-4 sm:text-[2.1rem]">{m.year}</p>
                <p className="text-[0.95rem] leading-snug text-white/75 sm:mt-2">{m.label}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Programme */}
      <section id="programme" className="scroll-mt-24 bg-white py-16 md:py-22" aria-labelledby="programme-title">
        <div className="wrap">
          <SectionTitle id="programme-title" parts={['Five-point', { hl: 'programme' }]} />
          <ol className="mx-auto mt-12 grid max-w-6xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {EN.programme.map((p, i) => (
              <li
                key={p.title}
                data-reveal="fade"
                style={{ ...vars({ '--d': `${i * 90}ms` }), background: FIVE_POINTS[i].color, color: FIVE_POINTS[i].ink }}
                className="flex flex-col gap-3 rounded-3xl p-6"
              >
                <span className="text-[2rem] font-bold leading-none opacity-70">{i + 1}</span>
                <h3 className="text-[1.15rem] font-bold leading-snug" style={{ color: FIVE_POINTS[i].ink }}>
                  {p.title}
                </h3>
                <p className="text-[0.95rem] leading-relaxed opacity-85">{p.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Work + CUCSU */}
      <section className="relative isolate overflow-hidden bg-night py-16 text-white md:py-24" aria-labelledby="work-title">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(40%_50%_at_85%_10%,rgb(53_100_255/0.3),transparent_70%)]" />
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="work-title" className="text-[2rem] font-bold text-white md:text-[2.5rem]">
              Standing with <span className="text-mint">students</span>
            </h2>
            <ul className="mt-8 grid gap-4">
              {EN.work.map((w) => (
                <li key={w.topic} data-reveal="fade" className="rounded-2xl bg-white/[0.06] p-5 ring-1 ring-white/10">
                  <p className="text-[0.9rem] font-semibold text-mint">{w.topic}</p>
                  <p className="mt-1 leading-relaxed text-white/85">{w.text}</p>
                  <Link href={w.href} hrefLang="bn" className="mt-2 inline-flex items-center gap-1.5 text-[0.92rem] font-semibold text-white hover:underline">
                    Read the report (Bangla)
                    <ArrowRight className="size-4" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div data-reveal="fade" className="self-start rounded-3xl bg-[radial-gradient(70%_120%_at_50%_0%,#0341a6_0%,#052b62_60%,#042755_100%)] p-7 md:p-9">
            <p className="w-fit rounded-lg bg-tag px-3 py-1 text-[0.85rem] font-bold text-ink">{EN.cucsu.title}</p>
            <p className="mt-5 font-[family-name:var(--font-en)] text-[4rem] font-bold leading-none text-yellow">
              24<span className="text-[2rem] text-white/70">/26</span>
            </p>
            <p className="mt-2 font-semibold text-white">posts won</p>
            <p className="mt-5 leading-relaxed text-white/80">{EN.cucsu.text}</p>
          </div>
        </div>
      </section>

      {/* Leadership */}
      {leaders.length > 0 && (
        <section id="leadership" className="wrap scroll-mt-24 py-16 md:py-22" aria-labelledby="leadership-title">
          <SectionTitle id="leadership-title" parts={['Leadership', { hl: '2026' }]} />
          <ul className="mx-auto mt-12 grid max-w-6xl grid-cols-2 gap-3 sm:gap-5 md:grid-cols-3 lg:grid-cols-4">
            {leaders.slice(0, 8).map((p, i) => {
              const img = pickImage(p.photo, 'card')
              const en = english[p.id]
              return (
                <li key={p.id} data-reveal="fade" style={vars({ '--d': `${(i % 4) * 90}ms` })} className="rounded-[20px] bg-white p-3 shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
                  <div className="relative aspect-[4/3.6] overflow-hidden rounded-2xl bg-[radial-gradient(80%_75%_at_50%_100%,#1d4ed8,#0b1428_75%)]">
                    {img && <Image src={img.src} alt={p.name} fill sizes="(min-width: 1024px) 280px, 45vw" className="object-cover object-top" />}
                  </div>
                  <p className="mt-3 px-1 text-center font-bold leading-snug text-ink" lang={en?.name ? 'en' : 'bn'}>
                    {en?.name || p.name}
                  </p>
                  <p className="mt-1 px-1 pb-2 text-center text-[0.85rem] leading-snug text-muted">{en?.position || positionEn(p.position)}</p>
                </li>
              )
            })}
          </ul>
          <div className="mt-10 flex justify-center">
            <Link href="/leadership" hrefLang="bn" className="btn btn-outline-blue">
              Full committee (Bangla)
              <ArrowRight />
            </Link>
          </div>
        </section>
      )}

      {/* Latest + press */}
      <section className="bg-white py-16 md:py-22" aria-labelledby="latest-title">
        <div className="wrap grid gap-12 lg:grid-cols-2">
          <div>
            <h2 id="latest-title" className="text-[1.8rem] font-bold text-ink">Latest from the branch</h2>
            <p className="mt-1 text-muted">Published in Bangla.</p>
            <ul className="mt-6 grid gap-3">
              {posts.map((p) => (
                <li key={p.id}>
                  <Link href={`/news/${p.slug}`} hrefLang="bn" className="group block rounded-2xl bg-pale p-5 hover:bg-pale-2">
                    <span className="text-[0.88rem] text-subtle">{date(p.publishedAt)}</span>
                    <span lang="bn" className="mt-1 block font-semibold leading-snug text-ink group-hover:text-primary">
                      {p.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="text-[1.8rem] font-bold text-ink">In the press</h2>
            <p className="mt-1 text-muted">National media coverage of the branch.</p>
            <ul className="mt-6 grid gap-3">
              {press.map((item) => (
                <li key={item.id}>
                  <a href={item.url} target="_blank" rel="noopener noreferrer" className="group flex items-start gap-3 rounded-2xl bg-pale p-5 hover:bg-pale-2">
                    <span className="min-w-0 flex-1">
                      <span className="text-[0.88rem] text-subtle">
                        {item.outlet}, {date(item.publishedAt)}
                      </span>
                      <span lang={/[ঀ-৿]/.test(item.headline) ? 'bn' : 'en'} className="mt-1 block font-semibold leading-snug text-ink group-hover:text-primary">
                        {item.headline}
                      </span>
                    </span>
                    <ExternalLink className="mt-1 size-4 shrink-0 text-subtle" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="wrap scroll-mt-24 py-16 md:py-22" aria-labelledby="contact-title">
        <div data-reveal="up" className="relative overflow-hidden rounded-3xl p-7 text-white [background:radial-gradient(70%_120%_at_50%_0%,#0341a6_0%,#052b62_55%,#042755_100%)] sm:p-10 lg:p-14">
          <div aria-hidden="true" className="dot-grid absolute inset-0 [mask-image:linear-gradient(180deg,#000,transparent)]" />
          <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
            <div>
              <h2 id="contact-title" className="text-[2rem] font-bold text-white md:text-[2.5rem]">
                Get in touch
              </h2>
              <ul className="mt-5 grid gap-2.5 text-white/85">
                {['Press and media enquiries', 'Researchers and journalists', 'Students and alumni abroad'].map((t) => (
                  <li key={t} className="flex items-center gap-2.5">
                    <CheckCircle className="size-5 shrink-0 text-mint" />
                    {t}
                  </li>
                ))}
              </ul>
            </div>
            <div className="rounded-2xl bg-white/[0.08] p-6 ring-1 ring-white/10 md:p-8">
              <p className="text-white/70">Email</p>
              <a href={`mailto:${email}`} className="mt-1 block break-all text-[1.3rem] font-bold text-white hover:underline md:text-[1.6rem]">
                {email}
              </a>
              <a href={`mailto:${email}`} className="btn btn-yellow mt-6">
                <Mail className="size-5" />
                Write to us
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
