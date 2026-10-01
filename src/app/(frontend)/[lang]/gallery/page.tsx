import type { Metadata } from 'next'
import Image from 'next/image'
import { Link } from '@/i18n/link'

import { ArrowRight, Images, YouTube } from '@/components/ui/Icons'
import { PageHeader } from '@/components/ui/PageHeader'
import { vars } from '@/components/ui/SectionTitle'
import { copy, langAttr } from '@/i18n/config'
import { date, num } from '@/i18n/format'
import { pageMeta } from '@/i18n/metadata'
import { getLang } from '@/i18n/server'
import { getAlbums } from '@/lib/cms'
import { pickImage } from '@/lib/media'

export const revalidate = 3600

const T = copy(
  {
    meta: { title: 'গ্যালারি', description: 'চবি ছাত্রশিবিরের কার্যক্রম, আলোচনা সভা ও ক্যাম্পাসের নানা আয়োজনের ছবি।' },
    title: ['ছবিতে', 'আমাদের দিনগুলো'],
    lede: 'প্রতিটি অ্যালবাম একটি আয়োজনের গল্প। ছবিতে ক্লিক করলে বড় করে দেখা যাবে।',
    videos: 'ভিডিও দেখুন',
    empty: 'এখনো কোনো অ্যালবাম প্রকাশিত হয়নি।',
    photos: (n: string) => `${n}টি ছবি`,
    open: 'অ্যালবাম দেখুন',
  },
  {
    meta: { title: 'Gallery', description: 'Photos of CU Chhatrashibir’s work, discussions and events on campus.' },
    title: ['Our days', 'in photos'],
    lede: 'Every album tells the story of one event. Click a photo to see it large.',
    videos: 'Watch videos',
    empty: 'No albums have been published yet.',
    photos: (n: string) => `${n} photos`,
    open: 'View album',
  },
)

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang()
  return pageMeta(lang, '/gallery', T[lang].meta)
}

export default async function GalleryPage() {
  const lang = await getLang()
  const t = T[lang]
  const albums = await getAlbums(100, lang)
  return (
    <>
      <PageHeader title={[t.title[0], { hl: t.title[1] }]} lede={t.lede}>
        <div className="load-up mt-8 flex justify-center" style={vars({ '--d': '350ms' })}>
          <Link href="/videos" className="btn btn-outline-blue btn-sm">
            <YouTube className="size-5" />
            {t.videos}
          </Link>
        </div>
      </PageHeader>
      <div className="wrap py-12 md:py-16">
        {albums.length === 0 ? (
          <p className="card mx-auto max-w-xl p-10 text-center text-[1.1rem] font-semibold text-ink">{t.empty}</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 lg:gap-6">
            {albums.map((album, i) => {
              const photos = Array.isArray(album.photos) ? album.photos : []
              const cover = pickImage(photos[0], 'card')
              return (
                <li key={album.id}>
                  <article
                    data-reveal="fade"
                    style={vars({ '--d': `${(i % 3) * 90}ms` })}
                    className="group relative flex h-full flex-col gap-4 rounded-2xl bg-white p-4 shadow-[0_4px_24px_rgb(11_15_46/0.06)] transition-shadow duration-300 hover:shadow-[0_18px_40px_rgb(11_15_46/0.12)] md:rounded-3xl md:p-5"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-xl bg-pale md:rounded-2xl">
                      {cover && (
                        <Image
                          src={cover.src}
                          alt={cover.alt}
                          fill
                          priority={i < 3}
                          sizes="(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                      <span className="absolute right-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-night/75 px-3 py-1 text-[0.85rem] font-semibold text-white backdrop-blur">
                        <Images className="size-4" />
                        {t.photos(num(lang, photos.length))}
                      </span>
                    </div>
                    <time dateTime={album.date} className="text-[0.9rem] text-subtle">
                      {date(lang, album.date)}
                    </time>
                    <h2 lang={langAttr(lang, album.title)} className="text-[1.15rem] font-bold leading-snug text-ink md:text-[1.25rem]">
                      <Link href={`/gallery/${album.slug}`} className="after:absolute after:inset-0 group-hover:text-primary">
                        {album.title}
                      </Link>
                    </h2>
                    <span className="mt-auto inline-flex items-center gap-2 pt-1 font-semibold text-primary">
                      {t.open}
                      <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </article>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </>
  )
}
