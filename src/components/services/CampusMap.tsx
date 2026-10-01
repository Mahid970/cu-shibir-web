'use client'

import dynamic from 'next/dynamic'
import { useState } from 'react'

import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'
import { CATEGORY_COLORS, PLACE_CATEGORIES } from '@/lib/services/places'

import type { MapPlace } from './MapView'

const MapView = dynamic(() => import('./MapView'), { ssr: false })

const T = copy(
  {
    open: 'মানচিত্র খুলুন',
    why: 'মানচিত্র খুললে OpenFreeMap থেকে টাইল নামবে (কিছু মোবাইল ডেটা লাগবে)। না খুলেও নিচের তালিকা থেকে প্রতিটি জায়গার দিকনির্দেশনা পাবেন।',
    label: 'চট্টগ্রাম বিশ্ববিদ্যালয় ক্যাম্পাসের মানচিত্র',
    legend: 'রঙের মানে',
  },
  {
    open: 'Open the map',
    why: 'Opening the map loads tiles from OpenFreeMap (it uses some mobile data). Without it, the list below still gives directions to every place.',
    label: 'Map of the University of Chittagong campus',
    legend: 'What the colours mean',
  },
)

/**
 * The campus map loads only when asked for: it is the heaviest thing on the page and the only
 * one that talks to another server.
 */
export function CampusMap({ places }: { places: MapPlace[] }) {
  const lang = useLang()
  const t = T[lang]
  const [open, setOpen] = useState(false)
  const used = PLACE_CATEGORIES.filter((c) => places.some((p) => p.category === c.value))

  return (
    <div className="overflow-hidden rounded-3xl bg-white shadow-[0_4px_24px_rgb(11_31_51/0.06)]">
      {open ? (
        <MapView places={places} label={t.label} />
      ) : (
        <div className="grid-lines flex h-[260px] flex-col items-center justify-center gap-4 bg-pale px-6 text-center md:h-[320px]">
          <button type="button" onClick={() => setOpen(true)} className="btn btn-gradient">
            {t.open}
          </button>
          <p className="max-w-md text-[0.9rem] leading-relaxed text-muted">{t.why}</p>
        </div>
      )}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-border px-5 py-3 text-[0.85rem] text-muted">
        <span className="sr-only">{t.legend}</span>
        {used.map((c) => (
          <span key={c.value} className="inline-flex items-center gap-1.5">
            <span aria-hidden="true" className="size-2.5 rounded-full" style={{ background: CATEGORY_COLORS[c.value] }} />
            {c.label[lang]}
          </span>
        ))}
      </div>
    </div>
  )
}
