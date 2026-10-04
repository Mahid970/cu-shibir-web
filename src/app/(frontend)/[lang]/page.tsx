import type { Metadata } from 'next'

import { FivePoints } from '@/components/home/FivePoints'
import { Gallery } from '@/components/home/Gallery'
import { Hero } from '@/components/home/Hero'
import { JoinBanner } from '@/components/home/JoinBanner'
import { JourneySection } from '@/components/martyrs/JourneySection'
import { LeadersSection } from '@/components/home/LeadersSection'
import { Milestones } from '@/components/home/Milestones'
import { NewsSection } from '@/components/home/NewsSection'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { TrustSection } from '@/components/home/TrustSection'
import { HERO_DEFAULTS } from '@/content/home'
import { alternates, cmsText, toLocale } from '@/i18n/config'
import { getAlbums, getLatestPosts, getLeaders, getPressCoverage, getSiteSettings, getVideos } from '@/lib/cms'
import { SITE } from '@/lib/site'

export const revalidate = 3600

type Props = { params: Promise<{ lang: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const lang = toLocale((await params).lang)
  return { alternates: alternates(lang, '/') }
}

export default async function HomePage({ params }: Props) {
  const lang = toLocale((await params).lang)
  const [settings, posts, leaders, press, albums, videos] = await Promise.all([
    getSiteSettings(lang),
    getLatestPosts(12, lang),
    getLeaders(lang),
    getPressCoverage(10),
    getAlbums(5, lang),
    getVideos(3, lang),
  ])

  const defaults = { bn: HERO_DEFAULTS.bn.tagline, en: HERO_DEFAULTS.en.tagline }

  return (
    <>
      <Hero
        tagline={cmsText(lang, settings.tagline, defaults)}
        intro={cmsText(lang, settings.heroIntro, { bn: HERO_DEFAULTS.bn.intro, en: HERO_DEFAULTS.en.intro })}
      />
      <Milestones />
      <NewsSection posts={posts} />
      <ProblemSolution />
      <TrustSection press={press} />
      <FivePoints />
      <JourneySection />
      <Gallery albums={albums} videos={videos} youtube={settings.socials?.youtube} />
      <LeadersSection leaders={leaders} />
      <JoinBanner email={settings.contact?.email || SITE.email} />
    </>
  )
}
