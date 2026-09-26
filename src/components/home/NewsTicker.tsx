import { Link } from '@/i18n/link'

import { Marquee } from '@/components/motion/Marquee'
import { copy, langAttr } from '@/i18n/config'
import { date } from '@/i18n/format'
import { getLang } from '@/i18n/server'
import { isUrgentCategory } from '@/lib/taxonomy'
import type { PostSummary } from '@/components/content/PostList'

const T = copy({ latest: 'সর্বশেষ', label: 'সর্বশেষ সংবাদ' }, { latest: 'Latest', label: 'Latest news' })

/** A thin "সর্বশেষ" strip under the header with the latest posts drifting past. */
export async function NewsTicker({ posts }: { posts: PostSummary[] }) {
  if (posts.length === 0) return null
  const lang = await getLang()
  const t = T[lang]
  return (
    <div className="border-b border-border bg-white">
      <div className="wrap flex items-center gap-3 py-2">
        <span className="shrink-0 rounded-md bg-crimson px-2.5 py-1 text-[0.85rem] font-bold text-white">{t.latest}</span>
        <div className="min-w-0 flex-1">
          <Marquee label={t.label} duration={Math.max(35, posts.length * 9)}>
            {posts.map((p) => (
              <Link
                key={p.id}
                href={`/news/${p.slug}`}
                className="flex shrink-0 items-center gap-2 whitespace-nowrap text-[0.95rem] font-semibold text-ink hover:text-primary"
              >
                <span aria-hidden="true" className={`size-2 rounded-full ${isUrgentCategory(p.category) ? 'bg-crimson' : 'bg-blue'}`} />
                <span lang={langAttr(lang, p.title)}>{p.title}</span>
                <time dateTime={p.publishedAt} className="font-normal text-subtle">
                  {date(lang, p.publishedAt, 'short')}
                </time>
              </Link>
            ))}
          </Marquee>
        </div>
      </div>
    </div>
  )
}
