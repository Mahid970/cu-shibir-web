import Image from 'next/image'

import { YouTube } from '@/components/ui/Icons'
import { SectionTitle, vars } from '@/components/ui/SectionTitle'
import { formatDate } from '@/lib/bn'
import { pickImage } from '@/lib/media'
import type { Album, Video } from '@/payload-types'

import { VideoCard } from './VideoCard'

const LAYOUT = ['col-span-2 md:row-span-2', '', '', '', '']

/** Photo wall of recent albums, then the latest videos. */
export function Gallery({
  albums,
  videos,
  youtube,
}: {
  albums: Album[]
  videos: Video[]
  youtube?: string | null
}) {
  const items = albums
    .map((a) => ({
      album: a,
      img: pickImage(Array.isArray(a.photos) ? a.photos[0] : null, 'card'),
    }))
    .filter((x) => x.img)
    .slice(0, 5)
  if (items.length === 0 && videos.length === 0) return null
  return (
    <section className="py-16 md:py-22" aria-labelledby="gallery">
      <div className="wrap">
        <SectionTitle id="gallery" parts={['ক্যাম্পাসে', { hl: 'আমাদের দিনগুলো' }]} />
        <p className="lede">নবীনবরণ থেকে বৃক্ষরোপণ — ছবি আর ভিডিওতে আমাদের কার্যক্রম।</p>
        {items.length > 0 && (
          <ul className="mx-auto mt-12 grid max-w-[1100px] auto-rows-[170px] grid-cols-2 gap-3 sm:auto-rows-[210px] md:grid-cols-4 md:gap-4">
            {items.map(({ album, img }, i) => (
              <li
                key={album.id}
                data-reveal="fade"
                style={vars({ '--d': `${(i % 3) * 120}ms` })}
                className={`group relative overflow-hidden rounded-2xl bg-ink ${LAYOUT[i]}`}
              >
                <Image
                  src={img!.src}
                  alt={img!.alt || album.title}
                  fill
                  sizes={
                    i === 0 ? '(min-width: 768px) 550px, 100vw' : '(min-width: 768px) 275px, 50vw'
                  }
                  className="object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  aria-hidden="true"
                  className="absolute inset-0 bg-[linear-gradient(180deg,transparent_35%,rgb(0_14_29/0.85))]"
                />
                <div className="absolute inset-x-3 bottom-3 text-white md:inset-x-4 md:bottom-4">
                  <p className="text-[0.8rem] text-white/75">
                    {formatDate(album.date, { style: 'short' })}
                  </p>
                  <p
                    className={`mt-0.5 line-clamp-2 font-semibold leading-snug ${i === 0 ? 'text-[1.1rem] md:text-[1.35rem]' : 'text-[0.9rem]'}`}
                  >
                    {album.title}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        {videos.length > 0 && (
          <div className="mx-auto mt-12 max-w-[1100px]">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h3 className="text-[1.4rem] font-bold text-ink md:text-[1.7rem]">ভিডিও</h3>
              {youtube && (
                <a
                  href={youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 font-semibold text-[#e62117] hover:underline"
                >
                  <YouTube className="size-5" />
                  ইউটিউব চ্যানেল
                </a>
              )}
            </div>
            <ul className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {videos.map((v, i) => (
                <li key={v.id} data-reveal="fade" style={vars({ '--d': `${i * 100}ms` })}>
                  <VideoCard
                    youtubeId={v.youtubeId}
                    title={v.title}
                    date={formatDate(v.publishedAt)}
                  />
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </section>
  )
}
