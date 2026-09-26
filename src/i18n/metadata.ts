import type { Metadata } from 'next'

import { alternates, type Locale } from './config'

/** Page metadata with canonical + hreflang for both languages. `path` is the Bangla (root) path. */
export function pageMeta(lang: Locale, path: string, meta: Metadata): Metadata {
  return { ...meta, alternates: alternates(lang, path) }
}
