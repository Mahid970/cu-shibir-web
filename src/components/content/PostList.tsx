import Image from 'next/image'
import { Link } from '@/i18n/link'
import { ViewTransition } from 'react'

import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { langAttr } from '@/i18n/config'
import { date } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import { pickImage } from '@/lib/media'
import { categoryLabel, isUrgentCategory } from '@/lib/taxonomy'
import type { Post } from '@/payload-types'

export type PostSummary = Pick<Post, 'id' | 'title' | 'slug' | 'excerpt' | 'category' | 'publishedAt' | 'heroImage'>

export async function CategoryChip({ category }: { category: string }) {
  return <span className={`chip ${isUrgentCategory(category) ? 'chip-urgent' : ''}`}>{categoryLabel(category, await getLang())}</span>
}

export async function PostMeta({ category, publishedAt }: { category: string; publishedAt: string }) {
  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[0.9rem] text-subtle">
      <CategoryChip category={category} />
      <time dateTime={publishedAt}>{date(await getLang(), publishedAt)}</time>
    </div>
  )
}

/** Phitron course-card style: white, soft shadow, rounded image, lifts on hover. */
export async function PostCard({
  post,
  index = 0,
  priority = false,
  as: Heading = 'h3',
}: {
  post: PostSummary
  index?: number
  priority?: boolean
  /** h2 when the card list sits directly under the page's h1 */
  as?: 'h2' | 'h3'
}) {
  const img = pickImage(post.heroImage, 'card')
  const lang = await getLang()
  return (
    <article
      // Above-the-fold cards (priority) are shown at once so they don't wait for the reveal observer.
      data-reveal={priority ? undefined : 'fade'}
      style={vars({ '--d': `${(index % 3) * 90}ms` })}
      className="group relative flex h-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_4px_24px_rgb(11_15_46/0.06)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgb(11_15_46/0.12)] md:rounded-3xl md:p-5"
    >
      <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-pale md:rounded-2xl">
        {img ? (
          <ViewTransition name={`post-${post.slug}`} share="morph" default="none">
            <Image
              src={img.src}
              alt={img.alt}
              fill
              // Only the first photo competes for the opening bandwidth; the rest load as they come into view.
              priority={priority && index === 0}
              sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </ViewTransition>
        ) : (
          <div className="grid-paper absolute inset-0" />
        )}
      </div>
      <PostMeta category={post.category} publishedAt={post.publishedAt} />
      <Heading lang={langAttr(lang, post.title)} className="text-[1.15rem] font-bold leading-snug text-ink md:text-[1.25rem]">
        <Link href={`/news/${post.slug}`} className="after:absolute after:inset-0 group-hover:text-primary">
          {post.title}
        </Link>
      </Heading>
      {post.excerpt && (
        <p lang={langAttr(lang, post.excerpt)} className="line-clamp-2 text-[0.95rem] text-ink/70">
          {post.excerpt}
        </p>
      )}
      <span className="mt-auto inline-flex items-center gap-2 pt-1 font-semibold text-primary">
        {lang === 'en' ? 'Read' : 'পড়ুন'}
        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
      </span>
    </article>
  )
}
