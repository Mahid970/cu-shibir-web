import { formatDate, formatTime, toBnDigits } from '@/lib/bn'

import type { Locale } from './config'

/** Digits in the page's script: ২০২৬ on Bangla pages, 2026 on English ones. */
export const num = (lang: Locale, value: number | string) => (lang === 'bn' ? toBnDigits(value) : String(value))

/** Grouped number: ২৭,৫১৬ / 27,516. */
export const grouped = (lang: Locale, value: number) => new Intl.NumberFormat(lang === 'bn' ? 'bn-BD' : 'en-GB').format(value)

export const date = (lang: Locale, value: string | number | Date, style: 'long' | 'short' | 'datetime' = 'long') =>
  formatDate(value, { locale: lang, style })

export const time = (lang: Locale, value: string | number | Date) => formatTime(value, lang)
