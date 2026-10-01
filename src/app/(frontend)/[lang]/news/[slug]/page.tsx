import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'

import { PostCard, PostMeta } from '@/components/content/PostList'
import { RichText } from '@/components/content/RichText'
import { ShareBar } from '@/components/content/ShareBar'
import { Globe } from '@/components/ui/Icons'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { copy, hasBangla, langAttr, localePath } from '@/i18n/config'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getAllPostSlugs, getLatestPosts, getPostBySlug } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { lexicalToText } from '@/lib/searchText'
import { absoluteUrl, SITE, siteName } from '@/lib/site'
import { categoryLabel } from '@/lib/taxonomy'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

const T = copy(
  {
    home: 'হোম',
    news: 'সংবাদ',
    newsLong: 'সংবাদ ও প্রকাশনা',
    crumbs: 'ব্রেডক্রাম্ব',
    by: 'লেখক:',
    more: ['আরও', 'পড়ুন'],
    bnOnly: '',
  },
  {
    home: 'Home',
    news: 'News',
    newsLong: 'News and publications',
    crumbs: 'Breadcrumb',
    by: 'By',
    more: ['Read', 'more'],
    bnOnly: 'This article is available in Bangla only. An English version will appear here once it is published.',
  },
)

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const lang = await getLang()
  const post = await getPostBySlug(slug, lang)
  if (!post) return {}
  const title = post.seo?.title || post.title
  const description = post.seo?.description || post.excerpt || (lang === 'en' ? SITE.descriptionEn : SITE.description)
  // Editor override → auto Bangla share card → hero crop
  const og = pickImage(post.seo?.image, 'og') ?? pickImage(post.shareImage, 'og') ?? pickImage(post.heroImage, 'og')
  const path = `/news/${post.slug}`
  return pageMeta(lang, path, {
    title,
    description,
    openGraph: {
      type: 'article',
      url: localePath(lang, path),
      siteName: siteName(lang),
      title,
      description,
      locale: lang === 'en' ? 'en_US' : 'bn_BD',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: categoryLabel(post.category, lang),
      images: og ? [{ url: og.src, width: og.width, height: og.height, alt: og.alt || title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: og ? [og.src] : undefined },
  })
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const lang = await getLang()
  const t = T[lang]
  const post = await getPostBySlug(slug, lang)
  if (!post) notFound()

  const hero = pickImage(post.heroImage, 'hero')
  const related = (await getLatestPosts(4, lang)).filter((p) => p.id !== post.id).slice(0, 3)
  const url = absoluteUrl(localePath(lang, `/news/${post.slug}`))
  // English page, but no English version of the article yet: say so and mark the text as Bangla.
  const bodyInBangla = lang === 'en' && hasBangla(lexicalToText(post.content as never))

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        headline: post.title,
        description: post.excerpt ?? undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: bodyInBangla || lang === 'bn' ? 'bn-BD' : 'en',
        mainEntityOfPage: url,
        image: hero ? [absoluteUrl(hero.src)] : undefined,
        author: post.byline?.name
          ? { '@type': 'Person', name: post.byline.name }
          : { '@type': 'Organization', name: siteName(lang) },
        publisher: { '@type': 'Organization', name: siteName(lang), logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/logo-legacy.png') } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: t.home, item: absoluteUrl(localePath(lang, '/')) },
          { '@type': 'ListItem', position: 2, name: t.newsLong, item: absoluteUrl(localePath(lang, '/news')) },
          { '@type': 'ListItem', position: 3, name: post.title, item: url },
        ],
      },
    ],
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="hero-wash relative isolate overflow-hidden pb-24 pt-8 md:pb-32 md:pt-14">
        <div aria-hidden="true" className="grid-paper absolute inset-0 -z-10" />
        <div className="wrap max-w-4xl">
          <nav aria-label={t.crumbs} className="load-up mb-6 flex flex-wrap gap-x-2 text-[0.92rem] text-subtle">
            <Link href="/" className="hover:text-primary">
              {t.home}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/news" className="hover:text-primary">
              {t.news}
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/news?category=${post.category}`} className="hover:text-primary">
              {categoryLabel(post.category, lang)}
            </Link>
          </nav>
          <div className="load-up" style={vars({ '--d': '80ms' })}>
            <PostMeta category={post.category} publishedAt={post.publishedAt} />
          </div>
          <h1
            lang={langAttr(lang, post.title)}
            className="load-rise mt-4 text-[2rem] font-bold leading-[1.35] text-ink md:text-[2.75rem] lg:text-[3.1rem]"
            style={vars({ '--d': '160ms' })}
          >
            {post.title}
          </h1>
          {post.byline?.name && (
            <p className="load-up mt-4 text-muted" style={vars({ '--d': '240ms' })}>
              {t.by} <span className="font-semibold text-ink">{post.byline.name}</span>
              {post.byline.affiliation && `, ${post.byline.affiliation}`}
            </p>
          )}
        </div>
      </header>

      <div className="wrap -mt-16 max-w-4xl md:-mt-24">
        {hero && (
          <figure className="load-scale mb-8 flex justify-center" style={vars({ '--d': '300ms' })}>
            {/* Small legacy images are shown at their real size instead of being blown up. */}
            <ViewTransition name={`post-${post.slug}`} share="morph" default="none">
              <Image
                src={hero.src}
                alt={hero.alt}
                width={hero.width}
                height={hero.height}
                priority
                sizes="(min-width: 1024px) 896px, 100vw"
                className="h-auto w-full rounded-3xl border-[8px] border-primary/10 bg-pale"
                style={{ maxWidth: Math.max(hero.width + 16, 320) }}
              />
            </ViewTransition>
          </figure>
        )}
        <div className="card p-6 sm:p-10 md:p-14">
          {bodyInBangla && (
            <p className="mx-auto mb-8 flex max-w-[70ch] items-start gap-3 rounded-2xl bg-pale p-4 text-[0.98rem] text-ink/80">
              <Globe className="mt-0.5 size-5 shrink-0 text-primary" />
              {t.bnOnly}
            </p>
          )}
          <div lang={bodyInBangla ? 'bn' : undefined}>
            <RichText data={post.content as never} className="prose-read mx-auto" />
          </div>
          <div className="mx-auto mt-12 max-w-[70ch]">
            <ShareBar url={url} title={post.title} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <aside className="wrap py-16 md:py-22" aria-labelledby="related">
          <SectionTitle id="related" parts={[t.more[0], { hl: t.more[1] }]} />
          <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {related.map((p, i) => (
              <li key={p.id}>
                <PostCard post={p} index={i} />
              </li>
            ))}
          </ul>
        </aside>
      )}
    </article>
  )
}
