import type { Metadata } from 'next'
import { Link } from '@/i18n/link'

import { VideoCard } from '@/components/home/VideoCard'
import { Images, YouTube } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { copy, type TitleCopy } from '@/i18n/config'
import { date } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getAllVideos, getSiteSettings } from '@/lib/cms'

export const revalidate = 3600

const T = copy<{ meta: Metadata; title: TitleCopy; lede: string; channel: string; gallery: string; empty: string }>(
  {
    meta: { title: 'ভিডিও', description: 'চবি ছাত্রশিবিরের আলোচনা সভা, সংবাদ সম্মেলন ও কার্যক্রমের ভিডিও।' },
    title: [{ hl: 'ভিডিও' }, 'দেখুন'],
    lede: 'প্লে চাপলে ভিডিও চালু হবে। তার আগে ইউটিউব থেকে কিছুই লোড হয় না, তাই ডেটা বাঁচে।',
    channel: 'ইউটিউব চ্যানেল',
    gallery: 'ছবির গ্যালারি',
    empty: 'এখনো কোনো ভিডিও প্রকাশিত হয়নি।',
  },
  {
    meta: { title: 'Videos', description: 'Videos of CU Chhatrashibir’s discussions, press conferences and work on campus.' },
    title: ['Watch our', { hl: 'videos' }],
    lede: 'Press play to start a video. Nothing loads from YouTube before that, so it saves your data.',
    channel: 'YouTube channel',
    gallery: 'Photo gallery',
    empty: 'No videos have been published yet.',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/videos', T[lang].meta)
}

export default async function VideosPage() {
  const lang = await getLang()
  const t = T[lang]
  const [videos, settings] = await Promise.all([getAllVideos(lang), getSiteSettings(lang)])
  const channel = settings.socials?.youtube
  return (
    <>
      <PageHeader title={t.title} lede={t.lede}>
        <div className="load-up mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '350ms' })}>
          {channel && (
            <a href={channel} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <YouTube className="size-5 text-[#e62117]" />
              {t.channel}
            </a>
          )}
          <Link href="/gallery" className="btn btn-outline-blue btn-sm">
            <Images className="size-5" />
            {t.gallery}
          </Link>
        </div>
      </PageHeader>
      <div className="wrap py-12 md:py-16">
        {videos.length === 0 ? (
          <p className="card mx-auto max-w-xl p-10 text-center text-[1.1rem] font-semibold text-ink">{t.empty}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {videos.map((v, i) => (
              <li key={v.id} data-reveal="fade" style={vars({ '--d': `${(i % 3) * 90}ms` })}>
                <VideoCard youtubeId={v.youtubeId} title={v.title} date={date(lang, v.publishedAt)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
