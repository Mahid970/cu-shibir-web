import { Amiri_Quran, Hind_Siliguri, Montserrat } from 'next/font/google'

// Self-hosted at build time by next/font (no runtime request to Google), subset, swap.
// Type roles follow docs/design/phitron-system.md.

/** All Bangla: headlines, UI and body. */
export const hind = Hind_Siliguri({
  subsets: ['bengali', 'latin'],
  weight: ['400', '600', '700'],
  variable: '--font-hind',
  display: 'swap',
})

/** Latin words and numbers. Not preloaded: the Bangla faces matter more for the first paint. */
export const montserrat = Montserrat({
  subsets: ['latin'],
  weight: 'variable',
  variable: '--font-montserrat',
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

export const fontVariables = [hind.variable, montserrat.variable, amiriQuran.variable].join(' ')
