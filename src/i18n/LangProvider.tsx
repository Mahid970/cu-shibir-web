'use client'

import { usePathname } from 'next/navigation'
import { createContext, useContext, type ReactNode } from 'react'

import { stripLocale, type Locale } from './config'

const LangContext = createContext<Locale>('bn')

/** Makes the page language available to Client Components (set once in the root layout). */
export function LangProvider({ lang, children }: { lang: Locale; children: ReactNode }) {
  return <LangContext value={lang}>{children}</LangContext>
}

export const useLang = () => useContext(LangContext)

/**
 * The current path without its language prefix ("/about" on both /about and /en/about).
 * Use this instead of usePathname(): the server prerenders Bangla pages as "/bn/…" while the
 * browser shows "/…", and comparing raw pathnames would differ between the two.
 */
export const useBasePath = () => stripLocale(usePathname() ?? '/')
