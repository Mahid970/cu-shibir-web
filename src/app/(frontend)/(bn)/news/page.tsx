import type { Metadata } from 'next'
import Link from 'next/link'

import { PostCard } from '@/components/content/PostList'
import { PageHeader } from '@/components/ui/PageHeader'
import { toBnDigits } from '@/lib/bn'
import { getPostsPage } from '@/lib/cms'
import { POST_CATEGORIES } from '@/lib/taxonomy'

export const metadata: Metadata = {
  title: 'সংবাদ ও প্রকাশনা',
  description: 'চবি ছাত্রশিবিরের সংবাদ, বিবৃতি, সংবাদ সম্মেলন, প্রবন্ধ ও বুক রিভিউ।',
  alternates: { canonical: '/news' },
}

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

export default async function NewsIndex({ searchParams }: Props) {
  const params = await searchParams
  const category = POST_CATEGORIES.some((c) => c.value === params.category)
    ? params.category
    : undefined
  const page = Math.max(1, Number(params.page) || 1)
  const result = await getPostsPage({ category, page, limit: 15 })

  const href = (p: { category?: string; page?: number }) => {
    const q = new URLSearchParams()
    if (p.category) q.set('category', p.category)
    if (p.page && p.page > 1) q.set('page', String(p.page))
    const s = q.toString()
    return s ? `/news?${s}` : '/news'
  }

  return (
    <>
      <PageHeader title={['সংবাদ ও', { hl: 'প্রকাশনা' }]} lede="বিবৃতি, সংবাদ সম্মেলন, কার্যক্রমের খবর ও প্রবন্ধ।">
        <nav aria-label="ধরন অনুযায়ী দেখুন" className="mt-8 flex justify-center">
          <ul className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_4px_24px_rgb(11_15_46/0.06)] [scrollbar-width:none]">
            {[{ value: undefined, label: { bn: 'সব' } }, ...POST_CATEGORIES].map((c) => {
              const active = c.value === category
              return (
                <li key={c.value ?? 'all'} className="shrink-0">
                  <Link
                    href={href({ category: c.value })}
                    aria-current={active ? 'page' : undefined}
                    className={`block rounded-full px-4 py-2 text-[0.95rem] font-bold transition-colors sm:px-5 ${
                      active ? 'bg-blue text-white shadow-[0_8px_18px_rgb(53_100_255/0.35)]' : 'bg-pale-2 text-ink hover:bg-pale-3'
                    }`}
                  >
                    {c.label.bn}
                  </Link>
                </li>
              )
            })}
          </ul>
        </nav>
      </PageHeader>

      <div className="wrap py-12 md:py-16">
        {result.docs.length === 0 ? (
          <div className="card mx-auto max-w-xl p-10 text-center">
            <p className="text-[1.15rem] font-semibold text-ink">এই বিভাগে এখনো কিছু প্রকাশিত হয়নি।</p>
            <Link href="/news" className="btn btn-outline-blue mt-6">
              সব সংবাদ দেখুন
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {result.docs.map((post, i) => (
              <li key={post.id}>
                <PostCard post={post} index={i} priority={i < 3} />
              </li>
            ))}
          </ul>
        )}

        {result.totalPages > 1 && (
          <nav aria-label="পৃষ্ঠা" className="mt-12 flex items-center justify-center gap-3">
            {result.hasPrevPage && (
              <Link href={href({ category, page: page - 1 })} className="btn btn-outline btn-sm">
                আগের পৃষ্ঠা
              </Link>
            )}
            <span className="rounded-full bg-white px-4 py-2 font-semibold text-muted shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
              পৃষ্ঠা {toBnDigits(page)} / {toBnDigits(result.totalPages)}
            </span>
            {result.hasNextPage && (
              <Link href={href({ category, page: page + 1 })} className="btn btn-gradient btn-sm">
                পরের পৃষ্ঠা
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  )
}
