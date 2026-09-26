import Link from 'next/link'

import { Mail, Pin, SOCIAL_ICONS } from '@/components/ui/Icons'
import type { SiteSetting } from '@/payload-types'

import { Logo } from './SiteHeader'
import { ALL_NAV } from './nav'

const SOCIAL_LABELS: Record<string, string> = {
  facebook: 'Facebook',
  youtube: 'YouTube',
  telegram: 'Telegram',
  instagram: 'Instagram',
  x: 'X',
}

export function SiteFooter({ settings }: { settings: SiteSetting }) {
  const socials = Object.entries(settings.socials ?? {}).filter(
    (e): e is [keyof typeof SOCIAL_ICONS, string] =>
      e[0] in SOCIAL_ICONS && typeof e[1] === 'string' && e[1].startsWith('http'),
  )
  const email = settings.contact?.email
  return (
    <footer className="relative isolate overflow-hidden bg-night px-3 pb-8 pt-14 text-white md:pt-20">
      <div
        aria-hidden="true"
        className="absolute inset-0 -z-10 bg-[radial-gradient(40%_60%_at_10%_0%,rgb(53_100_255/0.28),transparent_70%),radial-gradient(35%_55%_at_95%_100%,rgb(0_251_151/0.12),transparent_70%)]"
      />
      <div className="wrap grid grid-cols-1 gap-10 md:grid-cols-12">
        <div className="md:col-span-5">
          <Logo tone="light" />
          <ul className="mt-6 space-y-3 text-[0.98rem] text-white/85">
            <li className="flex items-start gap-3">
              <Pin className="mt-0.5 size-5 shrink-0 text-mint" />
              চট্টগ্রাম বিশ্ববিদ্যালয়, হাটহাজারী, চট্টগ্রাম
            </li>
            {email && (
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 size-5 shrink-0 text-mint" />
                <a href={`mailto:${email}`} className="underline-offset-2 hover:underline">
                  {email}
                </a>
              </li>
            )}
          </ul>
          <p className="mt-5 max-w-sm text-[0.95rem] text-white/60">পরামর্শ, অভিযোগ বা এহতেসাব থাকলে সরাসরি লিখুন।</p>
        </div>
        <nav aria-labelledby="footer-pages" className="md:col-span-3">
          <h2 id="footer-pages" className="text-lg font-bold text-white">
            পেজসমূহ
          </h2>
          <ul className="mt-4 grid gap-3 text-white/85">
            {ALL_NAV.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="font-medium underline-offset-2 hover:underline">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="md:col-span-4">
          <h2 className="text-lg font-bold text-white">আমাদের সাথে থাকুন</h2>
          <ul className="mt-4 flex flex-wrap gap-3">
            {socials.map(([key, url]) => {
              const Icon = SOCIAL_ICONS[key]
              return (
                <li key={key}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={SOCIAL_LABELS[key]}
                    className="grid size-11 place-items-center rounded-xl bg-white/10 text-white transition hover:-translate-y-0.5 hover:bg-white hover:text-ink"
                  >
                    <Icon className="size-5" />
                  </a>
                </li>
              )
            })}
          </ul>
          <p className="mt-6 text-[0.95rem] text-white/70">
            কেন্দ্রীয় ওয়েবসাইট{' '}
            <a href="https://shibir.org.bd" className="font-semibold text-white underline" target="_blank" rel="noopener noreferrer">
              shibir.org.bd
            </a>
          </p>
        </div>
      </div>
      <div className="wrap mt-12">
        <div className="flex flex-col gap-2 border-t border-white/10 pt-6 text-[0.88rem] text-white/60 sm:flex-row sm:justify-between">
          <p>© বাংলাদেশ ইসলামী ছাত্রশিবির, চট্টগ্রাম বিশ্ববিদ্যালয় শাখা</p>
          <p className="font-semibold text-white/75">আমরা তরুণ, আমরাই পারি</p>
        </div>
      </div>
    </footer>
  )
}
