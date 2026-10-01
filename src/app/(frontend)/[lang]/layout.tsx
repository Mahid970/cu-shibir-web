import type { Metadata, Viewport } from 'next'
import { notFound } from 'next/navigation'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { ServiceWorker } from '@/components/layout/ServiceWorker'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { RevealObserver } from '@/components/motion/RevealObserver'
import { SvgDefs } from '@/components/ui/SectionTitle'
import { isLocale, LOCALES, type Locale } from '@/i18n/config'
import { LangProvider } from '@/i18n/LangProvider'
import { getSiteSettings } from '@/lib/cms'
import { SITE } from '@/lib/site'

import { fontVariables } from '../fonts'
import '../globals.css'

type Props = { children: ReactNode; params: Promise<{ lang: string }> }

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }))
}

const icons: Metadata['icons'] = {
  icon: [{ url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' }, { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
  apple: '/icons/apple-touch-icon.png',
}

const META: Record<Locale, Metadata> = {
  bn: {
    title: { default: SITE.name, template: `%s | ${SITE.shortName}` },
    description: SITE.description,
    applicationName: SITE.shortName,
    alternates: { canonical: '/' },
    openGraph: { type: 'website', siteName: SITE.name, locale: 'bn_BD', alternateLocale: ['en_US'], title: SITE.name, description: SITE.description, url: '/' },
    appleWebApp: { capable: true, title: 'চবি ছাত্রশিবির', statusBarStyle: 'default' },
  },
  en: {
    title: { default: SITE.nameEn, template: `%s | ${SITE.shortNameEn}` },
    description: SITE.descriptionEn,
    applicationName: SITE.shortNameEn,
    alternates: { canonical: '/en' },
    openGraph: { type: 'website', siteName: SITE.nameEn, locale: 'en_US', alternateLocale: ['bn_BD'], title: SITE.nameEn, description: SITE.descriptionEn, url: '/en' },
    appleWebApp: { capable: true, title: 'CU Shibir', statusBarStyle: 'default' },
  },
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params
  return {
    metadataBase: new URL(SITE.url),
    twitter: { card: 'summary_large_image', site: '@CUshibir77' },
    icons,
    ...META[isLocale(lang) ? lang : 'bn'],
  }
}

export const viewport: Viewport = {
  themeColor: '#ffffff',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

const orgJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: SITE.name,
  alternateName: [SITE.nameEn, SITE.shortName, 'CU Shibir'],
  url: SITE.url,
  logo: `${SITE.url}/brand/logo-legacy.png`,
  email: SITE.email,
  foundingDate: '1977-02-06',
  parentOrganization: { '@type': 'Organization', name: 'Bangladesh Islami Chhatrashibir', url: 'https://shibir.org.bd' },
  sameAs: [
    'https://www.facebook.com/cushibir',
    'https://x.com/CUshibir77',
    'https://www.instagram.com/cuchhatrashibir/',
    'https://www.youtube.com/@CuShibir777',
    'https://t.me/cushibir',
  ],
}

/** Runs before first paint: opt in to scroll reveals unless the visitor prefers reduced motion. */
const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`

/** Root layout for both languages: Bangla at /, English at /en (see src/proxy.ts). */
export default async function FrontendLayout({ children, params }: Props) {
  const { lang } = await params
  if (!isLocale(lang)) notFound()
  const settings = await getSiteSettings(lang)
  return (
    <html lang={lang} className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className={`flex min-h-dvh flex-col ${lang === 'en' ? 'en-site' : ''}`}>
        <LangProvider lang={lang}>
          <SvgDefs />
          <SiteHeader />
          <main id="main" className="flex-1">
            {children}
          </main>
          <SiteFooter settings={settings} />
          <RevealObserver />
          <ServiceWorker />
        </LangProvider>
      </body>
    </html>
  )
}
