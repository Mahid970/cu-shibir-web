'use client'

import 'maplibre-gl/dist/maplibre-gl.css'

import maplibregl from 'maplibre-gl'
import { useEffect, useRef } from 'react'

import { CATEGORY_COLORS } from '@/lib/services/places'

export type MapPlace = { id: number | string; name: string; category: string; lat: number; lng: number }

/** OpenFreeMap tiles (free, no key, no tracking) with the campus places as markers. */
export default function MapView({ places, label }: { places: MapPlace[]; label: string }) {
  const box = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!box.current) return
    const map = new maplibregl.Map({
      container: box.current,
      style: 'https://tiles.openfreemap.org/styles/liberty',
      center: [91.7885, 22.4715],
      zoom: 14.4,
      attributionControl: { compact: true },
      cooperativeGestures: true,
    })
    map.addControl(new maplibregl.NavigationControl({ showCompass: false }), 'top-right')
    const bounds = new maplibregl.LngLatBounds()
    for (const place of places) {
      const dot = document.createElement('span')
      dot.className = 'block size-3.5 rounded-full border-2 border-white shadow-[0_1px_4px_rgb(0_0_0/0.35)]'
      dot.style.background = CATEGORY_COLORS[place.category] ?? '#475569'
      dot.title = place.name
      new maplibregl.Marker({ element: dot })
        .setLngLat([place.lng, place.lat])
        .setPopup(new maplibregl.Popup({ offset: 10, closeButton: false }).setText(place.name))
        .addTo(map)
      bounds.extend([place.lng, place.lat])
    }
    if (places.length > 1) map.fitBounds(bounds, { padding: 40, maxZoom: 16, duration: 0 })
    return () => map.remove()
  }, [places])

  return <div ref={box} role="region" aria-label={label} className="h-[420px] w-full md:h-[520px]" />
}
