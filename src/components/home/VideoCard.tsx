'use client'

import Image from 'next/image'
import { useState } from 'react'

import { Play } from '@/components/ui/Icons'
import { langAttr } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'

/** YouTube thumbnail with a pulsing play button; the player loads only on click. */
export function VideoCard({ youtubeId, title, date }: { youtubeId: string; title: string; date: string }) {
  const [playing, setPlaying] = useState(false)
  const lang = useLang()
  return (
    <figure className="group flex h-full flex-col gap-3 rounded-2xl bg-white p-3 shadow-[0_4px_24px_rgb(11_15_46/0.06)] md:rounded-3xl">
      <div className="relative aspect-video overflow-hidden rounded-xl bg-ink md:rounded-2xl">
        {playing ? (
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${youtubeId}?autoplay=1&rel=0`}
            title={title}
            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            className="absolute inset-0 size-full"
          />
        ) : (
          <button type="button" onClick={() => setPlaying(true)} className="absolute inset-0" aria-label={`${lang === 'en' ? 'Play video' : 'ভিডিও চালু করুন'}: ${title}`}>
            <Image
              src={`https://i.ytimg.com/vi/${youtubeId}/hqdefault.jpg`}
              alt=""
              fill
              sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <span aria-hidden="true" className="absolute inset-0 bg-[linear-gradient(180deg,transparent_40%,rgb(0_14_29/0.6))]" />
            <span className="play-pulse absolute left-1/2 top-1/2 grid size-14 place-items-center rounded-full bg-white/85 shadow-[0_10px_30px_rgb(0_96_250/0.45)] backdrop-blur">
              <span className="grid size-[78%] place-items-center rounded-full bg-[image:var(--gradient)] text-white">
                <Play className="ml-0.5 size-[45%]" />
              </span>
            </span>
          </button>
        )}
      </div>
      <figcaption className="px-1 pb-1">
        <p lang={langAttr(lang, title)} className="line-clamp-2 font-semibold leading-snug text-ink">
          {title}
        </p>
        <p className="mt-1 text-[0.85rem] text-subtle">{date}</p>
      </figcaption>
    </figure>
  )
}
