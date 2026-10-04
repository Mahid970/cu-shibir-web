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
import { pickImage, type ImageInfo } from '@/lib/media'
import { SITE } from '@/lib/site'
import type { Media } from '@/payload-types'

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

  // Photos for the hero's ribbon: the hero photo and the ones chosen in Site settings first, then
  // recent album photos (each album's cover first, then its other photos) until there are ten.
  // The cards are 168–224 px wide, so 2–3x screens need ~450–500 px: start from the 800 px size and let
  // next/image serve the width each screen needs.
  const chosen = [settings.heroImage, ...(settings.heroGallery ?? [])]
    .filter((m): m is Media => typeof m === 'object' && m !== null)
    .map((m) => ({ media: m, caption: m.caption || m.alt || '' }))
  const albumPhotos = albums.map((a) => (Array.isArray(a.photos) ? a.photos : []).filter((m): m is Media => typeof m === 'object'))
  const fromAlbums = [0, 1, 2].flatMap((k) =>
    albums.flatMap((a, i) => (albumPhotos[i][k] ? [{ media: albumPhotos[i][k], caption: a.title }] : [])),
  )
  const seen = new Set<number>()
  const photos = [...chosen, ...fromAlbums]
    .filter(({ media }) => {
      if (seen.has(media.id)) return false
      seen.add(media.id)
      return true
    })
    .map(({ media, caption }) => {
      const image = pickImage(media, 'card')
      return image && { ...image, caption }
    })
    .filter((p): p is ImageInfo & { caption: string } => p !== null)
    .slice(0, 10)

  const defaults = { bn: HERO_DEFAULTS.bn.tagline, en: HERO_DEFAULTS.en.tagline }

  return (
    <>
      <Hero
        tagline={cmsText(lang, settings.tagline, defaults)}
        intro={cmsText(lang, settings.heroIntro, { bn: HERO_DEFAULTS.bn.intro, en: HERO_DEFAULTS.en.intro })}
        photos={photos}
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
