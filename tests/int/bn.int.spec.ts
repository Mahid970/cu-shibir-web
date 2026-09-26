import { describe, expect, it } from 'vitest'

import {
  formatDate,
  formatNumber,
  mergeConjunctClusters,
  parseLooseDate,
  slugify,
  splitGraphemes,
  splitWords,
  toBnDigits,
  toLatinDigits,
  transliterate,
} from '@/lib/bn'

describe('splitGraphemes', () => {
  it.each([
    ['ক্ষ', ['ক্ষ']],
    ['স্ট্র', ['স্ট্র']],
    ['ন্ত্র', ['ন্ত্র']],
    ['অঙ্ক', ['অ', 'ঙ্ক']],
    ['ছাত্র', ['ছা', 'ত্র']],
    ['র্য', ['র্য']],
  ])('keeps conjuncts in %s together', (input, expected) => {
    expect(splitGraphemes(input)).toEqual(expected)
  })

  it('keeps vowel signs (কার) attached to their consonant', () => {
    expect(splitGraphemes('শিবির')).toEqual(['শি', 'বি', 'র'])
    expect(splitGraphemes('কৌশল')).toEqual(['কৌ', 'শ', 'ল'])
  })

  it('never loses characters', () => {
    const text = 'বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয়'
    expect(splitGraphemes(text).join('')).toBe(text)
  })

  it('repairs clusters split after a hasanta by older engines', () => {
    expect(mergeConjunctClusters(['ক্', 'ষ', 'মা'])).toEqual(['ক্ষ', 'মা'])
    expect(mergeConjunctClusters(['স্', 'ট্', 'র'])).toEqual(['স্ট্র'])
  })
})

describe('splitWords', () => {
  it('marks whitespace tokens and splits words safely', () => {
    const words = splitWords('আমরা তরুণ')
    expect(words.map((w) => w.word)).toEqual(['আমরা', ' ', 'তরুণ'])
    expect(words[1].space).toBe(true)
    expect(words[2].graphemes).toEqual(['ত', 'রু', 'ণ'])
  })
})

describe('digits and numbers', () => {
  it('converts between Latin and Bangla digits', () => {
    expect(toBnDigits(2026)).toBe('২০২৬')
    expect(toLatinDigits('২৪/২৬')).toBe('24/26')
  })

  it('formats numbers with Bangla digits', () => {
    expect(formatNumber(24)).toBe('২৪')
    expect(formatNumber(2500, 'en')).toBe('2,500')
  })
})

describe('formatDate', () => {
  it('formats in Bangla, Asia/Dhaka time', () => {
    // 20:30 UTC on 24 Sep is already 25 Sep in Dhaka (UTC+6)
    expect(formatDate('2026-09-24T20:30:00Z')).toBe('২৫ সেপ্টেম্বর, ২০২৬')
  })

  it('formats in English', () => {
    expect(formatDate('2026-08-29T06:00:00Z', { locale: 'en' })).toBe('29 August 2026')
  })

  it('returns empty string for invalid dates', () => {
    expect(formatDate('not a date')).toBe('')
  })
})

describe('parseLooseDate (legacy date strings)', () => {
  const iso = (s: string, y?: number) => parseLooseDate(s, y)?.toISOString()
  it.each([
    ['২৪ সেপ্টেম্বর, ২০২৬', '2026-09-24T06:00:00.000Z'],
    ['২৫ সেপ্টেম্বর,২০২৬', '2026-09-25T06:00:00.000Z'],
    ['বুধবার, ২২ জুলাই, ২০২৬', '2026-07-22T06:00:00.000Z'],
    ['২১ অক্টোবর ২০২৫', '2025-10-21T06:00:00.000Z'],
    ['২৯ আগস্ট ২০২৬, ১৮:৩৭', '2026-08-29T12:37:00.000Z'],
    ['২৯ আগস্ট ২০২৬, ০৭:৪১ পিএম', '2026-08-29T13:41:00.000Z'],
    ['২৯ আগস্ট ২০২৬, ০৪:৫৪ PM', '2026-08-29T10:54:00.000Z'],
    ['৫ সেপ্টেম্বর, ২০২৬ এ ০৪:৪৭ PM', '2026-09-05T10:47:00.000Z'],
    ['October 21, 2025 at 9:59 PM', '2025-10-21T15:59:00.000Z'],
  ])('%s', (input, expected) => {
    expect(iso(input)).toBe(expected)
  })

  it('uses the fallback year when missing', () => {
    expect(iso('29 August', 2026)).toBe('2026-08-29T06:00:00.000Z')
  })

  it('returns null for unparseable input', () => {
    expect(parseLooseDate('শীঘ্রই')).toBeNull()
  })
})

describe('transliterate / slugify', () => {
  it.each([
    ['শিবির', 'shibir'],
    ['ছাত্রশিবির', 'chhatroshibir'],
    ['চট্টগ্রাম', 'chottogram'],
    ['সংবাদ', 'songbad'],
    ['বিশ্ববিদ্যালয়', 'bishbobidyaloy'],
    ['নবীনবরণ', 'nobinoboron'],
    ['ইসলামী', 'islami'],
    ['রহমান', 'rohman'],
    ['ছাত্রলীগ', 'chhatrolig'],
    ['কর্মীদের', 'kormider'],
    ['শহিদ', 'shohid'],
    ['মুগ্ধর', 'mugdhor'],
  ])('%s → %s', (input, expected) => {
    expect(transliterate(input)).toBe(expected)
  })

  it('builds clean ASCII slugs from Bangla titles', () => {
    expect(slugify('চবি ছাত্রশিবিরের নবীনবরণ ২০২৬')).toBe('chobi-chhatroshibirer-nobinoboron-2026')
    expect(slugify("Freshers' Reception & Career Guideline Program 2026")).toBe(
      'freshers-reception-career-guideline-program-2026',
    )
  })

  it('cuts long slugs at a word boundary', () => {
    const slug = slugify('শতভাগ আবাসন, আবাসন ভাতা, চাকসু ও সিনেট নির্বাচন সহ ৫ দফা দাবি এবং ছাত্রদল কর্তৃক অবৈধ সিট দখলের অপচেষ্টা')
    expect(slug.length).toBeLessThanOrEqual(80)
    expect(slug.endsWith('-')).toBe(false)
    expect(slug).toMatch(/^[a-z0-9-]+$/)
  })
})
