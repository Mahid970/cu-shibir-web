import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { PhotoGrid, type Photo } from '@/components/content/PhotoGrid'
import { ShareBar } from '@/components/content/ShareBar'
import { ArrowRight } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { formatDate, toBnDigits } from '@/lib/bn'
import { getAllAlbumSlugs, getAlbumBySlug } from '@/lib/cms'
import { pickImage } from '@/lib/media'
import { absoluteUrl, SITE } from '@/lib/site'
import type { Media } from '@/payload-types'

export const revalidate = 3600

type Props = { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  const slugs = await getAllAlbumSlugs()
  return slugs.filter((s) => s.slug).map((s) => ({ slug: s.slug! }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)
  if (!album) return {}
  const cover = pickImage(Array.isArray(album.photos) ? album.photos[0] : null, 'og')
  const description = album.description || `${album.title} — ছবির অ্যালবাম, ${SITE.shortName}।`
  return {
    title: album.title,
    description,
    alternates: { canonical: `/gallery/${album.slug}` },
    openGraph: {
      type: 'article',
      title: album.title,
      description,
      url: `/gallery/${album.slug}`,
      images: cover ? [{ url: cover.src, width: cover.width, height: cover.height, alt: cover.alt }] : undefined,
    },
  }
}

export default async function AlbumPage({ params }: Props) {
  const { slug } = await params
  const album = await getAlbumBySlug(slug)
  if (!album) notFound()

  const photos: Photo[] = (Array.isArray(album.photos) ? album.photos : [])
    .filter((m): m is Media => typeof m === 'object' && m !== null)
    .flatMap((m) => {
      const thumb = pickImage(m, 'card')
      const full = pickImage(m, 'hero')
      if (!thumb || !full) return []
      return [{ id: m.id, thumb: thumb.src, full: full.src, width: thumb.width, height: thumb.height, alt: m.alt || '', caption: m.caption }]
    })

  const url = absoluteUrl(`/gallery/${album.slug}`)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ImageGallery',
    name: album.title,
    datePublished: album.date,
    url,
    image: photos.slice(0, 10).map((p) => absoluteUrl(p.full)),
  }

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <header className="hero-wash relative isolate overflow-hidden pb-12 pt-8 md:pb-16 md:pt-14">
        <div aria-hidden="true" className="grid-paper absolute inset-0 -z-10" />
        <div className="wrap max-w-4xl">
          <nav aria-label="ব্রেডক্রাম্ব" className="load-up mb-6 flex flex-wrap gap-x-2 text-[0.92rem] text-subtle">
            <Link href="/" className="hover:text-primary">
              হোম
            </Link>
            <span aria-hidden="true">/</span>
            <Link href="/gallery" className="hover:text-primary">
              গ্যালারি
            </Link>
          </nav>
          <p className="load-up flex flex-wrap items-center gap-3 text-[0.95rem] text-subtle" style={vars({ '--d': '80ms' })}>
            <span className="chip">{toBnDigits(photos.length)}টি ছবি</span>
            <time dateTime={album.date}>{formatDate(album.date)}</time>
          </p>
          <h1 className="load-rise mt-4 text-[1.9rem] font-bold leading-[1.35] text-ink md:text-[2.6rem]" style={vars({ '--d': '160ms' })}>
            {album.title}
          </h1>
          {album.description && (
            <p className="load-up mt-4 max-w-[65ch] text-[1.05rem] leading-relaxed text-muted" style={vars({ '--d': '240ms' })}>
              {album.description}
            </p>
          )}
        </div>
      </header>

      <div className="wrap max-w-6xl pb-16 md:pb-22">
        <PhotoGrid photos={photos} title={album.title} />
        <div className="mx-auto mt-12 max-w-4xl">
          <ShareBar url={url} title={album.title} />
          <Link href="/gallery" className="btn btn-outline-blue btn-sm mt-8">
            সব অ্যালবাম
            <ArrowRight />
          </Link>
        </div>
      </div>
    </article>
  )
}
