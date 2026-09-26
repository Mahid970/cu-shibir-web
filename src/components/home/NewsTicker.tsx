import Link from 'next/link'

import { Marquee } from '@/components/motion/Marquee'
import { formatDate } from '@/lib/bn'
import { isUrgentCategory } from '@/lib/taxonomy'
import type { PostSummary } from '@/components/content/PostList'

/** A thin "সর্বশেষ" strip under the header with the latest posts drifting past. */
export function NewsTicker({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null
  return (
    <div className="border-b border-border bg-white">
      <div className="wrap flex items-center gap-3 py-2">
        <span className="shrink-0 rounded-md bg-crimson px-2.5 py-1 text-[0.85rem] font-bold text-white">সর্বশেষ</span>
        <div className="min-w-0 flex-1">
          <Marquee label="সর্বশেষ সংবাদ" duration={Math.max(35, posts.length * 9)}>
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/news/${p.slug}`}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[0.95rem] font-semibold text-ink hover:text-primary"
              >
                <span aria-hidden="true" className={`size-2 rounded-full ${isUrgentCategory(p.category) ? 'bg-crimson' : 'bg-blue'}`} />
                {p.title}
                <time dateTime={p.publishedAt} className="font-normal text-subtle">
                  {formatDate(p.publishedAt, { style: 'short' })}
                </time>
              </Link>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  )
}
