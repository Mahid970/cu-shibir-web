export type NavItem = { href: string; label: string; external?: boolean }

/** Information architecture — plan §4 (Bangla first). */
export const MAIN_NAV: NavItem[] = [
  { href: '/about', label: 'আমাদের কথা' },
  { href: '/leadership', label: 'দায়িত্বশীলবৃন্দ' },
  { href: '/news', label: 'সংবাদ' },
  { href: '/events', label: 'ইভেন্ট' },
]

/** Highlighted as an outline pill in the header (Phitron's "AI ML" slot). */
export const FEATURED_NAV: NavItem = { href: '/services', label: 'শিক্ষার্থী সেবা' }

export const MORE_NAV: NavItem[] = [
  { href: '/gallery', label: 'গ্যালারি' },
  { href: '/videos', label: 'ভিডিও' },
  { href: '/press', label: 'মিডিয়ায় আমরা' },
  { href: '/syllabus', label: 'সিলেবাস' },
  { href: '/join', label: 'যুক্ত হোন' },
  { href: 'https://shibir.org.bd', label: 'কেন্দ্রীয় ওয়েবসাইট', external: true },
]

export const ALL_NAV: NavItem[] = [FEATURED_NAV, ...MAIN_NAV, ...MORE_NAV.filter((i) => !i.external)]

export const JOIN_HREF = '/join'
