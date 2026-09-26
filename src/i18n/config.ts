/**
 * Two languages, one set of pages. Bangla is the site's own language and lives at the root
 * (/news/…); English is the same page under /en (/en/news/…). src/proxy.ts maps the unprefixed
 * URLs onto the [lang] route segment.
 */

export const LOCALES = ['bn', 'en'] as const
export type Locale = (typeof LOCALES)[number]
export const DEFAULT_LOCALE: Locale = 'bn'

export const isLocale = (value: unknown): value is Locale => value === 'bn' || value === 'en'
export const toLocale = (value: unknown): Locale => (value === 'en' ? 'en' : 'bn')

/** Language of a browser path: "/en" and "/en/…" are English, everything else Bangla. */
export const localeOf = (pathname: string): Locale => (pathname === '/en' || /^\/en[/?#]/.test(pathname) ? 'en' : 'bn')

/**
 * "/en/news?x#y" → "/news?x#y", "/en" → "/". The internal "/bn/…" form (what the server renders
 * after the proxy's rewrite) is stripped too. Other paths are returned as they are.
 */
export function stripLocale(href: string): string {
  if (href === '/en' || href === '/bn') return '/'
  if (/^\/(en|bn)[/?#]/.test(href)) {
    const rest = href.slice(3)
    return rest.startsWith('/') ? rest : `/${rest}`
  }
  return href
}

/** The same internal path in the given language. External links, mailto: and #anchors pass through. */
export function localePath(lang: Locale, href: string): string {
  if (!href.startsWith('/') || href.startsWith('//')) return href
  const base = stripLocale(href)
  if (lang === 'bn') return base
  if (base === '/') return '/en'
  return /^\/[?#]/.test(base) ? `/en${base.slice(1)}` : `/en${base}`
}

/** hreflang alternates and the canonical URL of a page, for metadata. */
export function alternates(lang: Locale, path: string) {
  return {
    canonical: localePath(lang, path),
    languages: { 'bn-BD': path, en: localePath('en', path), 'x-default': path },
  }
}

/** Keep the Bangla and English copy of a component side by side; English must match Bangla's shape. */
export const copy = <T,>(bn: T, en: NoInfer<T>): Record<Locale, T> => ({ bn, en })

const BANGLA = /[\u0980-\u09FF]/

export const hasBangla = (text: string | null | undefined) => Boolean(text && BANGLA.test(text))

/**
 * lang attribute for CMS text shown on an English page that has no English version yet
 * (so screen readers switch voice and the Bangla font is used).
 */
export const langAttr = (page: Locale, text: string | null | undefined) => (page === 'en' && hasBangla(text) ? 'bn' : undefined)

/**
 * Text from the CMS in the page's language. Payload fills an empty English field with the
 * Bangla one, so an English page uses `fallback.en` until someone writes the English version.
 */
export function cmsText(lang: Locale, value: string | null | undefined, fallback: Record<Locale, string>) {
  if (lang === 'en' && (!value || hasBangla(value))) return fallback.en
  return value || fallback.bn
}
