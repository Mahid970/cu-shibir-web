import type { Metadata } from 'next'
import Link from 'next/link'

import { VideoCard } from '@/components/home/VideoCard'
import { Images, YouTube } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { formatDate } from '@/lib/bn'
import { getAllVideos, getSiteSettings } from '@/lib/cms'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'ভিডিও',
  description: 'চবি ছাত্রশিবিরের আলোচনা সভা, সংবাদ সম্মেলন ও কার্যক্রমের ভিডিও।',
  alternates: { canonical: '/videos' },
}

export default async function VideosPage() {
  const [videos, settings] = await Promise.all([getAllVideos('bn'), getSiteSettings('bn')])
  const channel = settings.socials?.youtube
  return (
    <>
      <PageHeader title={[{ hl: 'ভিডিও' }, 'দেখুন']} lede="প্লে চাপলে ভিডিও চালু হবে। তার আগে ইউটিউব থেকে কিছুই লোড হয় না, তাই ডেটা বাঁচে।">
        <div className="load-up mt-8 flex flex-wrap justify-center gap-3" style={vars({ '--d': '350ms' })}>
          {channel && (
            <a href={channel} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
              <YouTube className="size-5 text-[#e62117]" />
              ইউটিউব চ্যানেল
            </a>
          )}
          <Link href="/gallery" className="btn btn-outline-blue btn-sm">
            <Images className="size-5" />
            ছবির গ্যালারি
          </Link>
        </div>
      </PageHeader>
      <div className="wrap py-12 md:py-16">
        {videos.length === 0 ? (
          <p className="card mx-auto max-w-xl p-10 text-center text-[1.1rem] font-semibold text-ink">এখনো কোনো ভিডিও প্রকাশিত হয়নি।</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {videos.map((v, i) => (
              <li key={v.id} data-reveal="fade" style={vars({ '--d': `${(i % 3) * 90}ms` })}>
                <VideoCard youtubeId={v.youtubeId} title={v.title} date={formatDate(v.publishedAt)} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  )
}
