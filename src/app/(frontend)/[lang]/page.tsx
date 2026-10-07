import type { Metadata } from 'next'

import { RailTimeline } from '@/components/about/RailTimeline'
import { FivePoints } from '@/components/home/FivePoints'
import { Gallery } from '@/components/home/Gallery'
import { Hero } from '@/components/home/Hero'
import { JoinBanner } from '@/components/home/JoinBanner'
import { JourneySection } from '@/components/martyrs/JourneySection'
import { LeadersSection } from '@/components/home/LeadersSection'
import { NewsSection } from '@/components/home/NewsSection'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { TrustSection } from '@/components/home/TrustSection'
import { historyStops } from '@/content/history'
import { alternates, toLocale } from '@/i18n/config'
import { getAlbums, getLatestPosts, getLeaders, getSiteSettings, getVideos } from '@/lib/cms'
import { SITE } from '@/lib/site'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLocale((await params).lang)
  return { alternates: alternates(lang, '/') }
}

export default async function HomePage({ params }: Props) {
  const lang = toLocale((await params).lang)
  const [settings, posts, leaders, albums, videos] = await Promise.all([
    getSiteSettings(lang),
    getLatestPosts(12, lang),
    getLeaders(lang),
    getAlbums(5, lang),
    getVideos(3, lang),
  ])

  return (
    <>
      <Hero />
      <RailTimeline stops={historyStops(lang)} />
      <FivePoints />
      <NewsSection posts={posts} />
      <ProblemSolution />
      <TrustSection />
      <JourneySection />
      <Gallery albums={albums} videos={videos} youtube={settings.socials?.youtube} />
      <LeadersSection leaders={leaders} />
      <JoinBanner email={settings.contact?.email || SITE.email} />
    </>
  )
}
