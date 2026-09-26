'use client'

import { useState } from 'react'

import { Facebook, Telegram } from '@/components/ui/Icons'
import { copy } from '@/i18n/config'
import { useLang } from '@/i18n/LangProvider'

const T = copy({ share: 'শেয়ার করুন', copied: 'লিংক কপি হয়েছে', copy: 'লিংক কপি করুন' }, { share: 'Share', copied: 'Link copied', copy: 'Copy link' })

/** Share targets that matter in Bangladesh: Facebook, Messenger/WhatsApp, Telegram, copy. */
export function ShareBar({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const words = T[useLang()]
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${u}`, className: 'bg-[#1877f2] text-white', Icon: Facebook },
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${u}`, className: 'bg-[#25d366] text-white', Icon: null },
    { label: 'Telegram', href: `https://t.me/share/url?url=${u}&text=${t}`, className: 'bg-[#229ed9] text-white', Icon: Telegram },
  ]

  const share = async () => {
    if (navigator.share) {
      try {
        await navigator.share({ title, url })
        return
      } catch {
        // cancelled — fall through to copy
      }
    }
    await navigator.clipboard?.writeText(url)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="flex flex-wrap items-center gap-2.5 border-t border-border pt-6">
      <span className="mr-2 font-bold text-ink">{words.share}</span>
      {links.map(({ label, href, className, Icon }) => (
        <a
          key={label}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className={`inline-flex h-10 items-center gap-2 rounded-full px-4 text-[0.92rem] font-semibold transition hover:-translate-y-0.5 hover:opacity-90 ${className}`}
        >
          {Icon && <Icon className="size-4" />}
          {label}
        </a>
      ))}
      <button
        type="button"
        onClick={share}
        className="inline-flex h-10 items-center rounded-full bg-pale-2 px-4 text-[0.92rem] font-semibold text-primary transition hover:bg-pale-3"
        aria-live="polite"
      >
        {copied ? words.copied : words.copy}
      </button>
    </div>
  )
}
