import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ViewTransition } from 'react'

import { PostCard, PostMeta } from '@/components/content/PostList'
import { RichText } from '@/components/content/RichText'
import { ShareBar } from '@/components/content/ShareBar'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { getAllPostSlugs, getLatestPosts, getPostBySlug } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { absoluteUrl, SITE } from '@/lib/site'
import { categoryLabel } from '@/lib/taxonomy'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllPostSlugs()
  return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) return {}
  const title = post.seo?.title || post.title
  const description = post.seo?.description || post.excerpt || SITE.description
  // Editor override → auto Bangla share card → hero crop
  const og = pickImage(post.seo?.image, 'og') ?? pickImage(post.shareImage, 'og') ?? pickImage(post.heroImage, 'og')
  const url = `/news/${post.slug}`
  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: 'article',
      url,
      title,
      description,
      locale: 'bn_BD',
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      section: categoryLabel(post.category),
      images: og ? [{ url: og.src, width: og.width, height: og.height, alt: og.alt || title }] : undefined,
    },
    twitter: { card: 'summary_large_image', title, description, images: og ? [og.src] : undefined },
  }
}

export default async function PostPage({ params }: Props) {
  const { slug } = await params
  const post = await getPostBySlug(slug)
  if (!post) notFound()

  const hero = pickImage(post.heroImage, 'hero')
  const related = (await getLatestPosts(4)).filter((p) => p.id !== post.id).slice(0, 3)
  const url = absoluteUrl(`/news/${post.slug}`)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'NewsArticle',
        headline: post.title,
        description: post.excerpt ?? undefined,
        datePublished: post.publishedAt,
        dateModified: post.updatedAt,
        inLanguage: 'bn-BD',
        mainEntityOfPage: url,
        image: hero ? [absoluteUrl(hero.src)] : undefined,
        author: post.byline?.name
          ? { '@type': 'Person', name: post.byline.name }
          : { '@type': 'Organization', name: SITE.name },
        publisher: { '@type': 'Organization', name: SITE.name, logo: { '@type': 'ImageObject', url: absoluteUrl('/brand/logo-legacy.png') } },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'হোম', item: absoluteUrl('/') },
          { '@type': 'ListItem', position: 2, name: 'সংবাদ ও প্রকাশনা', item: absoluteUrl('/news') },
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
          <nav aria-label="ব্রেডক্রাম্ব" className="load-up mb-6 flex flex-wrap gap-x-2 text-[0.92rem] text-subtle">
            <Link href="/" className="hover:text-primary">
              হোম
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/news" className="hover:text-primary">
              সংবাদ
            </Link>
            <span aria-hidden="true">/</span>
            <Link href={`/news?category=${post.category}`} className="hover:text-primary">
              {categoryLabel(post.category)}
            </Link>
          </nav>
          <div className="load-up" style={vars({ '--d': '80ms' })}>
            <PostMeta category={post.category} publishedAt={post.publishedAt} />
          </div>
          <h1
            className="load-rise mt-4 text-[2rem] font-bold leading-[1.35] text-ink md:text-[2.75rem] lg:text-[3.1rem]"
            style={vars({ '--d': '160ms' })}
          >
            {post.title}
          </h1>
          {post.byline?.name && (
            <p className="load-up mt-4 text-muted" style={vars({ '--d': '240ms' })}>
              লেখক: <span className="font-semibold text-ink">{post.byline.name}</span>
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
          <RichText data={post.content as never} className="prose-read mx-auto" />
          <div className="mx-auto mt-12 max-w-[70ch]">
            <ShareBar url={url} title={post.title} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <aside className="wrap py-16 md:py-22" aria-labelledby="related">
          <SectionTitle id="related" parts={['আরও', { hl: 'পড়ুন' }]} />
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
