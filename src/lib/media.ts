import type { Media } from '@/payload-types'

type Size = 'thumb' | 'card' | 'hero' | 'og'

/** Payload returns absolute URLs (serverURL is set); next/image wants same-origin paths. */
function toPath(url: string): string {
  if (url.startsWith('/')) return url
  try {
    const u = new URL(url)
    return u.pathname.startsWith('/api/media/') ? `${u.pathname}${u.search}` : url
  } catch {
    return url
  }
}

export type ImageInfo = { src: string; width: number; height: number; alt: string }

/** Resolve a populated upload field to the best stored size (falls back to the original). */
export function pickImage(media: number | Media | null | undefined, size: Size = 'card'): ImageInfo | null {
  if (!media || typeof media === 'number') return null
  const s = media.sizes?.[size]
  const src = s?.url || media.url
  if (!src) return null
  return {
    src: toPath(src),
    width: s?.width || media.width || 1200,
    height: s?.height || media.height || 800,
    alt: media.alt || '',
  }
}
