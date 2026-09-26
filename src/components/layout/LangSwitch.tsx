'use client'

import NextLink from 'next/link'
import { useRouter } from 'next/navigation'
import type { MouseEvent } from 'react'

import { localePath, type Locale } from '@/i18n/config'
import { useBasePath, useLang } from '@/i18n/LangProvider'

const LABEL: Record<Locale, { short: string; long: string }> = {
  bn: { short: 'বাং', long: 'বাংলা' },
  en: { short: 'EN', long: 'English' },
}

/**
 * বাংলা | English switch. Opens the same page in the other language and keeps the scroll
 * position, query and #section, so the text simply changes language where the reader is.
 * `single` shows only the other language as one small button (narrow phone headers).
 */
export function LangSwitch({ single = false, long = false, className = '' }: { single?: boolean; long?: boolean; className?: string }) {
  const lang = useLang()
  const path = useBasePath()
  const router = useRouter()

  const go = (target: Locale) => (e: MouseEvent<HTMLAnchorElement>) => {
    if (target === lang || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return
    e.preventDefault()
    router.push(localePath(target, path) + location.search + location.hash, { scroll: false })
  }

  const item = (target: Locale) => {
    const on = target === lang
    const text = long ? LABEL[target].long : LABEL[target].short
    return (
      <NextLink
        key={target}
        href={localePath(target, path)}
        hrefLang={target === 'bn' ? 'bn' : 'en'}
        lang={target}
        onClick={go(target)}
        aria-current={on ? 'true' : undefined}
        aria-label={single ? (target === 'en' ? 'Read this page in English' : 'এই পাতাটি বাংলায় পড়ুন') : undefined}
        className={`inline-flex h-8 min-w-10 items-center justify-center rounded-full px-3 text-[0.85rem] font-bold transition-colors ${
          target === 'en' ? 'font-[family-name:var(--font-en)]' : ''
        } ${on ? 'bg-blue text-white shadow-[0_6px_14px_rgb(53_100_255/0.3)]' : 'text-ink hover:bg-pale-3'}`}
      >
        {text}
      </NextLink>
    )
  }

  if (single) {
    return <div className={`rounded-full bg-pale-2 p-1 ${className}`}>{item(lang === 'bn' ? 'en' : 'bn')}</div>
  }

  return (
    <div role="group" aria-label={lang === 'bn' ? 'ভাষা' : 'Language'} className={`flex items-center gap-0.5 rounded-full bg-pale-2 p-1 ${className}`}>
      {item('bn')}
      {item('en')}
    </div>
  )
}
