'use client'

import NextLink from 'next/link'
import type { ComponentProps } from 'react'

import { localePath } from './config'
import { useLang } from './LangProvider'

/**
 * next/link that stays in the current language: write href="/news" and an English page links
 * to /en/news. External URLs, mailto: and #anchors are left alone.
 */
export function Link({ href, ...props }: ComponentProps<typeof NextLink>) {
  const lang = useLang()
  return <NextLink href={typeof href === 'string' ? localePath(lang, href) : href} {...props} />
}
