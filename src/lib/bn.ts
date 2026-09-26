/**
 * Bangla text utilities shared by the site, the CMS and scripts.
 *
 * - Grapheme splitting that never breaks যুক্তাক্ষর / কার / ফলা (safe for per-letter animation)
 * - Bangla digits, numbers and dates in Asia/Dhaka
 * - Bangla → Latin transliteration for clean, shareable URL slugs
 */

export const DHAKA_TZ = 'Asia/Dhaka'

const VIRAMA = '\u09CD' // হসন্ত — joins the next consonant into a conjunct
const ZWJ = '\u200D'
const ZWNJ = '\u200C'
const NUKTA = '\u09BC'
const BN_CONSONANT = /[\u0995-\u09B9\u09CE\u09DC-\u09DF\u09F0\u09F1]/

const segmenter =
  typeof Intl !== 'undefined' && 'Segmenter' in Intl
    ? new Intl.Segmenter('bn', { granularity: 'grapheme' })
    : null

/**
 * Split text into user-perceived characters without breaking Bangla conjuncts.
 *
 * Newer ICU (Unicode 15.1+) already keeps conjuncts together; older engines return
 * `ক্` + `ষ` for `ক্ষ`, so clusters ending in a virama (or ZWJ) are merged with the next one.
 */
export function splitGraphemes(text: string): string[] {
  const raw = segmenter
    ? Array.from(segmenter.segment(text), (s) => s.segment)
    : fallbackClusters(text)
  return mergeConjunctClusters(raw)
}

/** Join clusters split after a virama/ZWJ (what pre-Unicode-15.1 engines produce). Exported for tests. */
export function mergeConjunctClusters(raw: string[]): string[] {
  const out: string[] = []
  for (const cluster of raw) {
    const prev = out[out.length - 1]
    if (prev && (prev.endsWith(VIRAMA) || prev.endsWith(ZWJ)) && BN_CONSONANT.test(cluster[0] ?? '')) {
      out[out.length - 1] = prev + cluster
    } else {
      out.push(cluster)
    }
  }
  return out
}

/** Minimal cluster builder for engines without Intl.Segmenter: attach combining marks to their base. */
function fallbackClusters(text: string): string[] {
  const out: string[] = []
  for (const ch of Array.from(text)) {
    const isMark = /\p{M}/u.test(ch) || ch === ZWJ || ch === ZWNJ
    if (isMark && out.length) out[out.length - 1] += ch
    else out.push(ch)
  }
  return out
}

/** Split into words (keeping whitespace tokens) and each word into safe graphemes — for kinetic type. */
export function splitWords(text: string): { word: string; graphemes: string[]; space: boolean }[] {
  return text
    .split(/(\s+)/)
    .filter(Boolean)
    .map((word) => ({ word, graphemes: splitGraphemes(word), space: /^\s+$/.test(word) }))
}

const BN_DIGITS = ['০', '১', '২', '৩', '৪', '৫', '৬', '৭', '৮', '৯']

export function toBnDigits(input: string | number): string {
  return String(input).replace(/[0-9]/g, (d) => BN_DIGITS[Number(d)])
}

export function toLatinDigits(input: string): string {
  return input.replace(/[০-৯]/g, (d) => String(BN_DIGITS.indexOf(d)))
}

export function formatNumber(n: number, locale: 'bn' | 'en' = 'bn'): string {
  return new Intl.NumberFormat(locale === 'bn' ? 'bn-BD' : 'en-US').format(n)
}

type DateStyle = 'long' | 'short' | 'datetime'

/** Consistent dates everywhere (fixes the legacy site's mixed Bangla/English formats). */
export function formatDate(
  value: string | number | Date,
  { locale = 'bn', style = 'long' }: { locale?: 'bn' | 'en'; style?: DateStyle } = {},
): string {
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const options: Intl.DateTimeFormatOptions =
    style === 'short'
      ? { day: 'numeric', month: 'short', year: 'numeric' }
      : style === 'datetime'
        ? { day: 'numeric', month: 'long', year: 'numeric', hour: 'numeric', minute: '2-digit' }
        : { day: 'numeric', month: 'long', year: 'numeric' }
  return new Intl.DateTimeFormat(locale === 'bn' ? 'bn-BD' : 'en-GB', {
    ...options,
    timeZone: DHAKA_TZ,
  }).format(date)
}

const MONTHS: Record<string, number> = {
  জানুয়ারি: 1, জানুয়ারী: 1, ফেব্রুয়ারি: 2, ফেব্রুয়ারী: 2, মার্চ: 3, এপ্রিল: 4, মে: 5, জুন: 6,
  জুলাই: 7, আগস্ট: 8, আগষ্ট: 8, অগাস্ট: 8, সেপ্টেম্বর: 9, অক্টোবর: 10, নভেম্বর: 11, ডিসেম্বর: 12,
  january: 1, february: 2, march: 3, april: 4, may: 5, june: 6, july: 7, august: 8,
  september: 9, october: 10, november: 11, december: 12,
}

/**
 * Parse the free-text dates found on the legacy site, e.g. "৫ সেপ্টেম্বর, ২০২৬ এ ০৪:৪৭ PM",
 * "October 21, 2025 at 9:59 PM", "২৯ আগস্ট ২০২৬, ১৮:৩৭", "29 August". Interpreted in Asia/Dhaka.
 * Returns null if no day+month can be found.
 */
export function parseLooseDate(input: string, fallbackYear = new Date().getFullYear()): Date | null {
  const s = toLatinDigits(input.normalize('NFC')).toLowerCase()
  const monthNames = Object.keys(MONTHS).map((m) => m.normalize('NFC').toLowerCase())
  const monthRe = monthNames.sort((a, b) => b.length - a.length).join('|')

  const dayFirst = new RegExp(`(\\d{1,2})\\s*(${monthRe})[\\s,]*(\\d{4})?`).exec(s)
  const monthFirst = new RegExp(`(${monthRe})\\s+(\\d{1,2}),?\\s*(\\d{4})?`).exec(s)
  const m = dayFirst ?? monthFirst
  if (!m) return null
  const [day, monthName, year] = dayFirst ? [m[1], m[2], m[3]] : [m[2], m[1], m[3]]
  const month = MONTHS[Object.keys(MONTHS).find((k) => k.normalize('NFC').toLowerCase() === monthName)!]

  let hour = 12
  let minute = 0
  const t = /(\d{1,2}):(\d{2})\s*(am|pm|এএম|পিএম)?/.exec(s)
  if (t) {
    hour = Number(t[1]) % 24
    minute = Number(t[2])
    const meridiem = t[3]
    if ((meridiem === 'pm' || meridiem === 'পিএম') && hour < 12) hour += 12
    if ((meridiem === 'am' || meridiem === 'এএম') && hour === 12) hour = 0
  }
  // Dhaka is UTC+6 all year (no DST).
  return new Date(Date.UTC(Number(year ?? fallbackYear), month - 1, Number(day), hour - 6, minute))
}

// ---------------------------------------------------------------------------
// Transliteration (Bangla → Latin) for URL slugs
// ---------------------------------------------------------------------------

const CONSONANTS: Record<string, string> = {
  ক: 'k', খ: 'kh', গ: 'g', ঘ: 'gh', ঙ: 'ng',
  চ: 'ch', ছ: 'chh', জ: 'j', ঝ: 'jh', ঞ: 'n',
  ট: 't', ঠ: 'th', ড: 'd', ঢ: 'dh', ণ: 'n',
  ত: 't', থ: 'th', দ: 'd', ধ: 'dh', ন: 'n',
  প: 'p', ফ: 'f', ব: 'b', ভ: 'bh', ম: 'm',
  য: 'j', র: 'r', ল: 'l', শ: 'sh', ষ: 'sh', স: 's', হ: 'h', ৎ: 't',
  '\u09DC': 'r', // ড়
  '\u09DD': 'rh', // ঢ়
  '\u09DF': 'y', // য়
}
const INDEPENDENT_VOWELS: Record<string, string> = {
  অ: 'o', আ: 'a', ই: 'i', ঈ: 'i', উ: 'u', ঊ: 'u', ঋ: 'ri', এ: 'e', ঐ: 'oi', ও: 'o', ঔ: 'ou',
}
const VOWEL_SIGNS: Record<string, string> = {
  'া': 'a', 'ি': 'i', 'ী': 'i', 'ু': 'u', 'ূ': 'u', 'ৃ': 'ri', 'ে': 'e', 'ৈ': 'oi', 'ো': 'o', 'ৌ': 'ou',
}
const SIGNS: Record<string, string> = { 'ং': 'ng', 'ঃ': 'h', 'ঁ': '' }

export function transliterate(input: string): string {
  // NFC decomposes ড় ঢ় য় into base + nukta; fold them back to single letters for lookup.
  const chars = Array.from(
    input
      .normalize('NFC')
      .replace(/\u09A1\u09BC/g, '\u09DC')
      .replace(/\u09A2\u09BC/g, '\u09DD')
      .replace(/\u09AF\u09BC/g, '\u09DF'),
  )
  let out = ''
  let afterVowelSound = false // did the previous unit end in a vowel sound (incl. inherent "o")?
  for (let i = 0; i < chars.length; i++) {
    const ch = chars[i]
    const next = chars[i + 1]
    const nextNext = chars[i + 2]
    const prev = chars[i - 1]
    if (ch in CONSONANTS) {
      // য-ফলা after a hasanta reads as "y" (বিদ্যালয় → bidyaloy)
      out += ch === 'য' && prev === VIRAMA ? 'y' : CONSONANTS[ch]
      // Inherent "o" only when another consonant/sign follows inside the word — except the
      // common schwa deletion V·C·C+vowel-sign (ইসলাম → islam, রহমান → rohman).
      const schwaDeleted: boolean =
        afterVowelSound && prev !== VIRAMA && next in CONSONANTS && nextNext in VOWEL_SIGNS
      const inherent: boolean = Boolean(next && (next in CONSONANTS || next in SIGNS)) && !schwaDeleted
      if (inherent) out += 'o'
      afterVowelSound = inherent
    } else if (ch in INDEPENDENT_VOWELS) {
      out += INDEPENDENT_VOWELS[ch]
      afterVowelSound = true
    } else if (ch in VOWEL_SIGNS) {
      out += VOWEL_SIGNS[ch]
      afterVowelSound = true
    } else if (ch in SIGNS) {
      out += SIGNS[ch]
      afterVowelSound = false
    } else if (ch === VIRAMA || ch === ZWJ || ch === ZWNJ || ch === NUKTA) {
      afterVowelSound = false
    } else {
      out += toLatinDigits(ch)
      afterVowelSound = false
    }
  }
  return out
}

/** URL slug: transliterated, lowercase ASCII, hyphenated, cut at a word boundary. */
export function slugify(input: string, maxLength = 80): string {
  const slug = transliterate(input)
    .toLowerCase()
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  if (slug.length <= maxLength) return slug
  const cut = slug.slice(0, maxLength)
  return cut.slice(0, cut.lastIndexOf('-') > 20 ? cut.lastIndexOf('-') : maxLength).replace(/-+$/, '')
}
