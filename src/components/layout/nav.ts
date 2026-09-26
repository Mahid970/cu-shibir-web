import type { Locale } from '@/i18n/config'

export type NavItem = { href: string; label: Record<Locale, string>; external?: boolean }

/** Information architecture — plan §4. Paths are Bangla-root; links add /en on English pages. */
export const MAIN_NAV: NavItem[] = [
  { href: '/about', label: { bn: 'আমাদের কথা', en: 'About us' } },
  { href: '/leadership', label: { bn: 'দায়িত্বশীলবৃন্দ', en: 'Leadership' } },
  { href: '/news', label: { bn: 'সংবাদ', en: 'News' } },
  { href: '/events', label: { bn: 'ইভেন্ট', en: 'Events' } },
]

/** Highlighted as an outline pill in the header (Phitron's "AI ML" slot). */
export const FEATURED_NAV: NavItem = { href: '/services', label: { bn: 'শিক্ষার্থী সেবা', en: 'Student services' } }

export const MORE_NAV: NavItem[] = [
  { href: '/gallery', label: { bn: 'গ্যালারি', en: 'Gallery' } },
  { href: '/videos', label: { bn: 'ভিডিও', en: 'Videos' } },
  { href: '/press', label: { bn: 'মিডিয়ায় আমরা', en: 'In the media' } },
  { href: '/syllabus', label: { bn: 'সিলেবাস', en: 'Syllabus' } },
  { href: '/join', label: { bn: 'যুক্ত হোন', en: 'Get involved' } },
  { href: 'https://shibir.org.bd', label: { bn: 'কেন্দ্রীয় ওয়েবসাইট', en: 'Central website' }, external: true },
]

export const ALL_NAV: NavItem[] = [FEATURED_NAV, ...MAIN_NAV, ...MORE_NAV.filter((i) => !i.external)]

export const JOIN_HREF = '/join'

/** Words used across the header, menu and footer. */
export const CHROME = {
  bn: {
    home: 'হোম: ',
    skip: 'মূল কনটেন্টে যান',
    contact: 'যোগাযোগ',
    join: 'সমর্থক হোন',
    more: 'এছাড়াও',
    mainMenu: 'প্রধান মেনু',
    mobileMenu: 'মোবাইল মেনু',
    openMenu: 'মেনু খুলুন',
    closeMenu: 'মেনু বন্ধ করুন',
    brand: 'চবি ছাত্রশিবির',
    branch: 'চট্টগ্রাম বিশ্ববিদ্যালয় শাখা',
    language: 'ভাষা',
  },
  en: {
    home: 'Home: ',
    skip: 'Skip to content',
    contact: 'Contact',
    join: 'Become a supporter',
    more: 'More',
    mainMenu: 'Main menu',
    mobileMenu: 'Mobile menu',
    openMenu: 'Open menu',
    closeMenu: 'Close menu',
    brand: 'CU Chhatrashibir',
    branch: 'University of Chittagong branch',
    language: 'Language',
  },
} satisfies Record<Locale, Record<string, string>>
