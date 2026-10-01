import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { PostCard } from '@/components/content/PostList'
import { PageHeader } from '@/components/ui/PageHeader'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getPostsPage } from '@/lib/cms'
import { POST_CATEGORIES } from '@/lib/taxonomy'

const T = copy(
  {
    meta: { title: 'সংবাদ ও প্রকাশনা', description: 'চবি ছাত্রশিবিরের সংবাদ, বিবৃতি, সংবাদ সম্মেলন, প্রবন্ধ ও বুক রিভিউ।' },
    title: ['সংবাদ ও', 'প্রকাশনা'],
    lede: 'বিবৃতি, সংবাদ সম্মেলন, কার্যক্রমের খবর ও প্রবন্ধ।',
    filter: 'ধরন অনুযায়ী দেখুন',
    all: 'সব',
    empty: 'এই বিভাগে এখনো কিছু প্রকাশিত হয়নি।',
    allNews: 'সব সংবাদ দেখুন',
    pages: 'পৃষ্ঠা',
    prev: 'আগের পৃষ্ঠা',
    next: 'পরের পৃষ্ঠা',
    page: (n: string, of: string) => `পৃষ্ঠা ${n} / ${of}`,
  },
  {
    meta: {
      title: 'News and publications',
      description: 'News, statements, press conferences, articles and book reviews from CU Chhatrashibir.',
    },
    title: ['News and', 'publications'],
    lede: 'Statements, press conferences, news of our work and articles. Most are published in Bangla.',
    filter: 'Show by type',
    all: 'All',
    empty: 'Nothing has been published in this section yet.',
    allNews: 'See all news',
    pages: 'Pages',
    prev: 'Previous page',
    next: 'Next page',
    page: (n: string, of: string) => `Page ${n} of ${of}`,
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/news', T[lang].meta)
}

type Props = { searchParams: Promise<{ category?: string; page?: string }> }

export default async function NewsIndex({ searchParams }: Props) {
  const params = await searchParams
  const lang = await getLang()
  const t = T[lang]
  const category = POST_CATEGORIES.some((c) => c.value === params.category)
    ? params.category
    : undefined
  const page = Math.max(1, Number(params.page) || 1)
  const result = await getPostsPage({ category, page, limit: 15, locale: lang })

  const href = (p: { category?: string; page?: number }) => {
    const q = new URLSearchParams()
    if (p.category) q.set('category', p.category)
    if (p.page && p.page > 1) q.set('page', String(p.page))
    const s = q.toString()
    return s ? `/news?${s}` : '/news'
  }

  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede}>
        <nav aria-label={t.filter} className="mt-8 flex justify-center">
          <ul className="flex max-w-full gap-1 overflow-x-auto rounded-full bg-white p-1.5 shadow-[0_4px_24px_rgb(11_15_46/0.06)] [scrollbar-width:none]">
            {[{ value: undefined, label: { bn: t.all, en: t.all } }, ...POST_CATEGORIES].map((c) => {
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
                    {c.label[lang]}
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
            <p className="text-[1.15rem] font-semibold text-ink">{t.empty}</p>
            <Link href="/news" className="btn btn-outline-blue mt-6">
              {t.allNews}
            </Link>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {result.docs.map((post, i) => (
              <li key={post.id}>
                <PostCard post={post} index={i} priority={i < 3} as="h2" />
              </li>
            ))}
          </ul>
        )}

        {result.totalPages > 1 && (
          <nav aria-label={t.pages} className="mt-12 flex items-center justify-center gap-3">
            {result.hasPrevPage && (
              <Link href={href({ category, page: page - 1 })} className="btn btn-outline btn-sm">
                {t.prev}
              </Link>
            )}
            <span className="rounded-full bg-white px-4 py-2 font-semibold text-muted shadow-[0_4px_24px_rgb(11_15_46/0.06)]">
              {t.page(num(lang, page), num(lang, result.totalPages))}
            </span>
            {result.hasNextPage && (
              <Link href={href({ category, page: page + 1 })} className="btn btn-gradient btn-sm">
                {t.next}
              </Link>
            )}
          </nav>
        )}
      </div>
    </>
  )
}
