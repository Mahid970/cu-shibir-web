import type { Locale } from '@/i18n/config'

/** Widest screen at which an item still sits in the "More" menu; from the next size up it has its own place in the bar. */
export type Fold = 'lg' | 'xl'

export type NavItem = { href: string; label: Record<Locale, string>; external?: boolean; fold?: Record<Locale, Fold> }

export const HOME_NAV: NavItem = { href: '/', label: { bn: 'হোম', en: 'Home' } }

/**
 * Information architecture — plan §4. Paths are Bangla-root; links add /en on English pages.
 * The header shows these in the bar; items with `fold` move into "More" on smaller laptops
 * (English labels are longer, so they fold earlier).
 */
export const MAIN_NAV: NavItem[] = [
  HOME_NAV,
  { href: '/services', label: { bn: 'শিক্ষার্থী সেবা', en: 'Student services' } },
  { href: '/about', label: { bn: 'আমাদের কথা', en: 'About us' }, fold: { bn: 'lg', en: 'lg' } },
  { href: '/leadership', label: { bn: 'দায়িত্বশীলবৃন্দ', en: 'Leadership' }, fold: { bn: 'lg', en: 'xl' } },
  { href: '/news', label: { bn: 'সংবাদ', en: 'News' }, fold: { bn: 'lg', en: 'xl' } },
]

export const MORE_NAV: NavItem[] = [
  { href: '/events', label: { bn: 'ইভেন্ট', en: 'Events' } },
  { href: '/gallery', label: { bn: 'গ্যালারি', en: 'Gallery' } },
  { href: '/videos', label: { bn: 'ভিডিও', en: 'Videos' } },
  { href: '/press', label: { bn: 'মিডিয়ায় আমরা', en: 'In the media' } },
  { href: '/syllabus', label: { bn: 'সিলেবাস', en: 'Syllabus' } },
  { href: '/join', label: { bn: 'যুক্ত হোন', en: 'Get involved' } },
  { href: 'https://shibir.org.bd', label: { bn: 'কেন্দ্রীয় ওয়েবসাইট', en: 'Central website' }, external: true },
]

/** Every page, for the phone menu and the footer (home and external links left out). */
export const ALL_NAV: NavItem[] = [...MAIN_NAV.filter((i) => i !== HOME_NAV), ...MORE_NAV.filter((i) => !i.external)]

/** Is `href` the page the reader is on (or a section of it)? Home matches only itself. */
export const isActive = (pathname: string, href: string) => (href === '/' ? pathname === '/' : pathname === href || pathname.startsWith(`${href}/`))

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
    brand: 'বাংলাদেশ ইসলামী ছাত্রশিবির',
    branch: 'চট্টগ্রাম বিশ্ববিদ্যালয়',
    language: 'ভাষা',
    search: 'খুঁজুন',
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
    brand: 'Bangladesh Islami Chhatrashibir',
    branch: 'University of Chittagong',
    language: 'Language',
    search: 'Search',
  },
} satisfies Record<Locale, Record<string, string>>
