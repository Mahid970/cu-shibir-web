'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'

import { ChevronLeft, ChevronRight, Close } from '@/components/ui/Icons'
import { vars } from '@/components/ui/SectionTitle'
import { copy } from '@/i18n/config'
import { num } from '@/i18n/format'
import { useLang } from '@/i18n/LangProvider'

const T = copy(
  { view: (n: string) => `ছবি ${n} বড় করে দেখুন`, close: 'বন্ধ করুন', prev: 'আগের ছবি', next: 'পরের ছবি' },
  { view: (n: string) => `View photo ${n} large`, close: 'Close', prev: 'Previous photo', next: 'Next photo' },
)

export type Photo = {
  id: number
  thumb: string
  full: string
  width: number
  height: number
  alt: string
  caption?: string | null
}

/**
 * Masonry photo wall; a photo opens in a full-screen viewer (native <dialog>, so focus is trapped
 * and Esc closes it). Arrow keys and swipes move between photos.
 */
export function PhotoGrid({ photos, title }: { photos: Photo[]; title: string }) {
  const dialog = useRef<HTMLDialogElement>(null)
  const lang = useLang()
  const t = T[lang]
  const [index, setIndex] = useState<number | null>(null)
  const touchX = useRef<number | null>(null)

  const open = (i: number) => {
    setIndex(i)
    dialog.current?.showModal()
  }
  const close = () => dialog.current?.close()
  const step = useCallback(
    (d: number) => setIndex((i) => (i === null ? i : (i + d + photos.length) % photos.length)),
    [photos.length],
  )

  useEffect(() => {
    const el = dialog.current
    if (!el) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') step(1)
      if (e.key === 'ArrowLeft') step(-1)
    }
    const onClose = () => setIndex(null)
    el.addEventListener('keydown', onKey)
    el.addEventListener('close', onClose)
    return () => {
      el.removeEventListener('keydown', onKey)
      el.removeEventListener('close', onClose)
    }
  }, [step])

  const current = index === null ? null : photos[index]

  return (
    <>
      <ul className="columns-2 gap-3 md:columns-3 md:gap-4">
        {photos.map((p, i) => (
          <li key={p.id} className="mb-3 break-inside-avoid md:mb-4" data-reveal="fade" style={vars({ '--d': `${(i % 3) * 90}ms` })}>
            <button
              type="button"
              onClick={() => open(i)}
              className="group block w-full overflow-hidden rounded-2xl bg-pale"
              aria-label={`${t.view(num(lang, i + 1))}${p.alt ? `: ${p.alt}` : ''}`}
            >
              <Image
                src={p.thumb}
                alt={p.alt}
                width={p.width}
                height={p.height}
                sizes="(min-width: 768px) 400px, 50vw"
                className="h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
              />
            </button>
          </li>
        ))}
      </ul>

      <dialog
        ref={dialog}
        aria-label={title}
        className="m-0 h-dvh max-h-none w-screen max-w-none bg-night/95 p-0 text-white backdrop:bg-night/80"
        onClick={(e) => e.target === e.currentTarget && close()}
        onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
        onTouchEnd={(e) => {
          if (touchX.current === null) return
          const dx = e.changedTouches[0].clientX - touchX.current
          if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1)
          touchX.current = null
        }}
      >
        {current && (
          <div className="flex h-full flex-col">
            <div className="flex items-center justify-between gap-4 px-4 py-3 md:px-6">
              <p className="text-[0.95rem] text-white/75" aria-live="polite">
                {num(lang, index! + 1)} / {num(lang, photos.length)}
              </p>
              <button
                type="button"
                onClick={close}
                autoFocus
                className="grid size-11 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-ink"
                aria-label={t.close}
              >
                <Close className="size-5" />
              </button>
            </div>
            <figure className="relative flex min-h-0 flex-1 flex-col items-center justify-center gap-3 px-4 pb-6 md:px-20">
              <div className="relative min-h-0 w-full flex-1">
                {/* The grid thumbnail is already cached: show it (blurred) while the large photo loads. */}
                <Image key={`t${current.id}`} src={current.thumb} alt="" fill sizes="(min-width: 768px) 400px, 50vw" className="object-contain blur-sm" />
                <Image key={current.id} src={current.full} alt={current.alt} fill sizes="100vw" className="object-contain" />
              </div>
              {(current.caption || current.alt) && (
                <figcaption className="max-w-3xl text-center text-[0.95rem] text-white/80">{current.caption || current.alt}</figcaption>
              )}
            </figure>
            {photos.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => step(-1)}
                  className="absolute left-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-ink md:left-6"
                  aria-label={t.prev}
                >
                  <ChevronLeft className="size-6" />
                </button>
                <button
                  type="button"
                  onClick={() => step(1)}
                  className="absolute right-3 top-1/2 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 hover:bg-white hover:text-ink md:right-6"
                  aria-label={t.next}
                >
                  <ChevronRight className="size-6" />
                </button>
              </>
            )}
          </div>
        )}
      </dialog>
    </>
  )
}
