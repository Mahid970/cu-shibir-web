import { Link } from '@/i18n/link'

import { PostCard, type PostSummary } from '@/components/content/PostList'
import { ArrowRight } from '@/components/ui/Icons'
import { SectionTitle } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { getLang } from '@/i18n/server'

import { NewsTabs, type NewsTab } from './NewsTabs'

const TABS = [
  { key: 'all', label: { bn: 'সব', en: 'All' } },
  { key: 'statement', label: { bn: 'বিবৃতি', en: 'Statements' }, categories: ['statement', 'press-conference'] },
  { key: 'activity', label: { bn: 'কার্যক্রম', en: 'Activities' }, categories: ['news', 'organisation', 'welfare', 'education'] },
  { key: 'writing', label: { bn: 'প্রবন্ধ', en: 'Articles' }, categories: ['article', 'book-review'] },
]

const T = copy(
  {
    title: ['সংবাদ ও', 'বিবৃতি'],
    lede: 'বিবৃতি, সংবাদ সম্মেলন, কার্যক্রমের খবর আর প্রবন্ধ — সবার আগে এখানে।',
    all: 'সব সংবাদ দেখুন',
  },
  {
    title: ['News and', 'statements'],
    lede: 'Statements, press conferences, news of our work and articles, here first. Most are published in Bangla.',
    all: 'See all news',
  },
)

export async function NewsSection({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null
  const lang = await getLang()
  const t = T[lang]
  const tabs: NewsTab[] = TABS.map((tab) => ({ ...tab, label: tab.label[lang] }))
  return (
    <section className="py-16 md:py-22" aria-labelledby="news">
      <div className="wrap">
        <SectionTitle id="news" parts={[t.title[0], { hl: t.title[1] }]} />
        <p className="lede">{t.lede}</p>
        <NewsTabs tabs={tabs}>
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
            {t.all}
            <ArrowRight />
          </Link>
        </div>
      </div>
    </section>
  )
}
