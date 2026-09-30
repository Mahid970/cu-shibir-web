import type { Metadata } from 'next'

import { FivePoints } from '@/components/home/FivePoints'
import { Gallery } from '@/components/home/Gallery'
import { Hero } from '@/components/home/Hero'
import { JoinBanner } from '@/components/home/JoinBanner'
import { JourneySection } from '@/components/martyrs/JourneySection'
import { LeadersSection } from '@/components/home/LeadersSection'
import { Milestones } from '@/components/home/Milestones'
import { NewsSection } from '@/components/home/NewsSection'
import { NewsTicker } from '@/components/home/NewsTicker'
import { ProblemSolution } from '@/components/home/ProblemSolution'
import { TrustSection } from '@/components/home/TrustSection'
import { DEFAULT_STATS, HERO_DEFAULTS } from '@/content/home'
import { alternates, cmsText, hasBangla, toLocale } from '@/i18n/config'
import { num } from '@/i18n/format'
import { toLatinDigits } from '@/lib/bn'
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

  // Stats typed in the CMS; on English pages a label without an English version uses ours.
  const fallbackStats = DEFAULT_STATS[lang]
  const stats = settings.stats?.length
    ? settings.stats.map((s, i) => ({
        value: s.value,
        suffix: s.suffix && num(lang, toLatinDigits(s.suffix)),
        label: lang === 'en' && hasBangla(s.label) ? (fallbackStats[i]?.label ?? s.label) : s.label,
      }))
    : fallbackStats

  // More photos for the hero's living picture: chosen in Site settings, otherwise the covers of recent albums.
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
  const defaults = { bn: HERO_DEFAULTS.bn.tagline, en: HERO_DEFAULTS.en.tagline }

  return (
    <>
      <NewsTicker posts={posts.slice(0, 6)} />
      <Hero
        tagline={cmsText(lang, settings.tagline, defaults)}
        intro={cmsText(lang, settings.heroIntro, { bn: HERO_DEFAULTS.bn.intro, en: HERO_DEFAULTS.en.intro })}
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
      <JourneySection />
      <Gallery albums={albums} videos={videos} youtube={settings.socials?.youtube} />
      <LeadersSection leaders={leaders} />
      <JoinBanner email={settings.contact?.email || SITE.email} />
    </>
  )
}
