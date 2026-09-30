'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'

import { useLang } from '@/i18n/LangProvider'
import { copy } from '@/i18n/config'

export type GalleryPhoto = { src: string; width: number; height: number; alt: string; caption: string; credit: string; graphic: boolean }
export type GalleryGroup = { title: string; photos: GalleryPhoto[] }

const T = copy(
  { graphic: 'কষ্টদায়ক দৃশ্য', show: 'দেখতে চাপুন', close: 'বন্ধ করুন', photo: 'ছবি', open: 'বড় করে দেখুন' },
  { graphic: 'Graphic image', show: 'Tap to show', close: 'Close', photo: 'Photo', open: 'View larger' },
)

/**
 * The martyr's photos in groups (his life, the day, afterwards, the places). Graphic photos stay
 * blurred and grey behind a note until the reader chooses to see them; any photo opens larger
 * with its caption and credit.
 */
export function MartyrGallery({ groups }: { groups: GalleryGroup[] }) {
  const t = T[useLang()]
  const [shown, setShown] = useState<Set<string>>(new Set())
  const [open, setOpen] = useState<GalleryPhoto | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const show = (p: GalleryPhoto) => {
    if (p.graphic && !shown.has(p.src)) {
      setShown(new Set(shown).add(p.src))
      return
    }
    setOpen(p)
    dialog.current?.showModal()
  }

  return (
    <>
      {groups.map((g) => (
        <div key={g.title} className="mt-10 first:mt-0">
          <h3 className="text-[1.25rem] font-bold text-ink">{g.title}</h3>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3">
            {g.photos.map((p, i) => {
              const veiled = p.graphic && !shown.has(p.src)
              return (
                <li key={p.src} data-reveal="up" style={{ ['--d' as string]: `${(i % 3) * 90}ms` }}>
                  <figure className="card overflow-hidden">
                    <button
                      type="button"
                      onClick={() => show(p)}
                      aria-label={veiled ? `${t.graphic}: ${t.show}` : `${t.open}: ${p.caption || p.alt}`}
                      className="group relative block aspect-[4/3] w-full overflow-hidden bg-navy"
                    >
                      <Image
                        src={p.src}
                        alt={veiled ? '' : p.alt}
                        fill
                        sizes="(min-width: 768px) 300px, 50vw"
                        className={`object-cover transition duration-500 group-hover:scale-[1.03] ${veiled ? 'scale-110 blur-xl grayscale' : ''}`}
                      />
                      {veiled && (
                        <span className="absolute inset-0 grid place-items-center bg-night/55 p-3 text-center text-white">
                          <span>
                            <span className="block text-[0.95rem] font-bold">{t.graphic}</span>
                            <span className="mt-1 block text-[0.82rem] text-white/80">{t.show}</span>
                          </span>
                        </span>
                      )}
                    </button>
                    {(p.caption || p.credit) && (
                      <figcaption className="px-3 pb-3 pt-2.5 text-[0.88rem] leading-snug text-text">
                        {p.caption}
                        {p.credit && <span className="mt-1 block text-[0.75rem] text-subtle">{p.credit}</span>}
                      </figcaption>
                    )}
                  </figure>
                </li>
              )
            })}
          </ul>
        </div>
      ))}

      <dialog
        ref={dialog}
        onClose={() => setOpen(null)}
        onClick={(e) => e.target === dialog.current && dialog.current?.close()}
        className="m-auto max-h-[92vh] w-[min(92vw,960px)] overflow-hidden rounded-2xl bg-night p-0 text-white backdrop:bg-black/80"
      >
        {open && (
          <figure>
            <div className="relative flex max-h-[76vh] items-center justify-center bg-black">
              <Image src={open.src} alt={open.alt} width={open.width} height={open.height} sizes="92vw" className="max-h-[76vh] w-auto object-contain" />
            </div>
            <figcaption className="flex items-start justify-between gap-4 p-4">
              <span>
                {open.caption}
                {open.credit && <span className="mt-1 block text-[0.8rem] text-white/60">{open.credit}</span>}
              </span>
              <button type="button" onClick={() => dialog.current?.close()} className="btn btn-sm btn-ghost-light shrink-0">
                {t.close}
              </button>
            </figcaption>
          </figure>
        )}
      </dialog>
    </>
  )
}
