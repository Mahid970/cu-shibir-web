import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { SiteFooter } from '@/components/layout/SiteFooter'
import { ServiceWorker } from '@/components/layout/ServiceWorker'
import { SiteHeader } from '@/components/layout/SiteHeader'
import { RevealObserver } from '@/components/motion/RevealObserver'
import { SvgDefs } from '@/components/ui/SectionTitle'
import { getSiteSettings } from '@/lib/cms'
import { SITE } from '@/lib/site'

import { fontVariables } from './fonts'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.name, template: `%s | ${SITE.shortName}` },
  description: SITE.description,
  applicationName: SITE.shortName,
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    siteName: SITE.name,
    locale: 'bn_BD',
    title: SITE.name,
    description: SITE.description,
    url: '/',
  },
  twitter: { card: 'summary_large_image', site: '@CUshibir77' },
  icons: {
    icon: [{ url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' }, { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/icons/apple-touch-icon.png',
  },
  appleWebApp: { capable: true, title: 'চবি ছাত্রশিবির', statusBarStyle: 'default' },
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

export default async function FrontendLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings('bn')
  return (
    <html lang="bn" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }} />
      </head>
      <body className="flex min-h-dvh flex-col">
        <SvgDefs />
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter settings={settings} />
        <RevealObserver />
        <ServiceWorker />
      </body>
    </html>
  )
}
