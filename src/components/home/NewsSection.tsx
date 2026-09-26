import { Link } from '@/i18n/link'

import { PostCard, type PostSummary } from '@/components/content/PostList'
import { ArrowRight } from '@/components/ui/Icons'
import { SectionTitle } from '@/components/ui/SectionTitle'

import { NewsTabs, type NewsTab } from './NewsTabs'

const TABS: NewsTab[] = [
  { key: 'all', label: 'সব' },
  { key: 'statement', label: 'বিবৃতি', categories: ['statement', 'press-conference'] },
  { key: 'activity', label: 'কার্যক্রম', categories: ['news', 'organisation', 'welfare', 'education'] },
  { key: 'writing', label: 'প্রবন্ধ', categories: ['article', 'book-review'] },
]

export function NewsSection({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null
  return (
    <section className="py-16 md:py-22" aria-labelledby="news">
      <div className="wrap">
        <SectionTitle id="news" parts={['সংবাদ ও', { hl: 'বিবৃতি' }]} />
        <p className="lede">বিবৃতি, সংবাদ সম্মেলন, কার্যক্রমের খবর আর প্রবন্ধ — সবার আগে এখানে।</p>
        <NewsTabs tabs={TABS}>
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {posts.map((post, i) => (
              <li key={post.id} data-cat={post.category} hidden={i >= 6}>
                <PostCard post={post} index={i} />
              </li>
            ))}
          </ul>
        </NewsTabs>
        <div className="mt-10 flex justify-center">
          <Link href="/news" className="btn btn-outline-blue">
            সব সংবাদ দেখুন
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
