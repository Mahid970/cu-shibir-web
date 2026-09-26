import type { Metadata } from 'next'

import { FivePoints } from '@/components/home/FivePoints'
import { Gallery } from '@/components/home/Gallery'
import { Hero } from '@/components/home/Hero'
import { JoinBanner } from '@/components/home/JoinBanner'
import { LeadersSection } from '@/components/home/LeadersSection'
import { Milestones } from '@/components/home/Milestones'
import { NewsSection } from '@/components/home/NewsSection'
import { NewsTicker } from '@/components/home/NewsTicker'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { TrustSection } from '@/components/home/TrustSection'
import { getAlbums, getLatestPosts, getLeaders, getPressCoverage, getSiteSettings, getVideos } from '@/lib/cms'
import { pickImage, type ImageInfo } from '@/lib/media'
import { SITE } from '@/lib/site'
import { DEFAULT_STATS } from '@/content/home'
import type { Media } from '@/payload-types'

export const revalidate = 3600

export const metadata: Metadata = {
  alternates: { canonical: '/', languages: { 'bn-BD': '/', en: '/en', 'x-default': '/' } },
}

export default async function HomePage() {
  const [settings, posts, leaders, press, albums, videos] = await Promise.all([
    getSiteSettings('bn'),
    getLatestPosts(12, 'bn'),
    getLeaders('bn'),
    getPressCoverage(10),
    getAlbums(5, 'bn'),
    getVideos(3, 'bn'),
  ])

  const stats = settings.stats?.length
    ? settings.stats.map((s) => ({ value: s.value, suffix: s.suffix, label: s.label }))
    : DEFAULT_STATS

  // Side photos: chosen in Site settings, otherwise the covers of recent albums.
  const chosen = (settings.heroGallery ?? []).filter((m): m is Media => typeof m === 'object')
  const gallery = (
    chosen.length
      ? chosen.map((m) => ({ image: pickImage(m, 'card'), caption: m.caption || m.alt || '' }))
      : albums.slice(1).map((a) => ({ image: pickImage(Array.isArray(a.photos) ? a.photos[0] : null, 'card'), caption: a.title }))
  )
    .filter((g): g is { image: ImageInfo; caption: string } => g.image !== null)
    .slice(0, 2)
    .map((g) => ({ ...g.image, caption: g.caption }))

  const faces = leaders.map((p) => pickImage(p.photo, 'thumb')).filter((f): f is ImageInfo => f !== null)

  return (
    <>
      <NewsTicker posts={posts.slice(0, 6)} />
      <Hero
        tagline={settings.tagline || 'আমরা তরুণ, আমরাই পারি'}
        intro={settings.heroIntro || ''}
        photo={pickImage(settings.heroImage, 'hero')}
        gallery={gallery}
        stats={stats}
        faces={faces}
        leaderCount={leaders.length}
      />
      <Milestones />
      <NewsSection posts={posts} />
      <ProblemSolution />
      <TrustSection press={press} />
      <FivePoints />
      <Gallery albums={albums} videos={videos} youtube={settings.socials?.youtube} />
      <LeadersSection leaders={leaders} />
      <JoinBanner email={settings.contact?.email || SITE.email} />
    </>
  )
}
