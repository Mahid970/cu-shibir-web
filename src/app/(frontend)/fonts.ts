import { Amiri_Quran, Anek_Bangla, Anek_Latin, Hind, Hind_Siliguri } from 'next/font/google'

// Self-hosted at build time by next/font (no runtime request to Google), subset, swap.
// Type roles: Anek for display (headlines, big numbers), Hind for reading and UI.

/** Bangla (and Latin inside Bangla pages): UI and body. */
export const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
})

/** Headlines. Variable weight and width, so titles can tighten and settle as they animate in. */
export const anekBangla = Anek_Bangla({
  subsets: ['bengali', 'latin'],
  weight: 'variable',
  axes: ['wdth'],
  variable: '--font-anek',
  display: 'swap',
})

/** English headlines. Not preloaded: most visitors read the Bangla site. */
export const anekLatin = Anek_Latin({
  subsets: ['latin'],
  weight: 'variable',
  axes: ['wdth'],
  variable: '--font-anek-latin',
  display: 'swap',
  preload: false,
})

/** English body text: Hind Siliguri's Latin sibling. */
export const hindLatin = Hind({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-hind-latin',
  display: 'swap',
  preload: false,
})

/** Quranic ayat inside articles. */
export const amiriQuran = Amiri_Quran({
  subsets: ['arabic'],
  weight: '400',
  variable: '--font-amiri-quran',
  display: 'swap',
  preload: false,
})

export const fontVariables = [hind.variable, anekBangla.variable, anekLatin.variable, hindLatin.variable, amiriQuran.variable].join(' ')
