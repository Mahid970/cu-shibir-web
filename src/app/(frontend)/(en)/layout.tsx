import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

import { EnFooter, EnHeader } from '@/components/layout/EnChrome'
import { ServiceWorker } from '@/components/layout/ServiceWorker'
import { RevealObserver } from '@/components/motion/RevealObserver'
import { SvgDefs } from '@/components/ui/SectionTitle'
import { getSiteSettings } from '@/lib/cms'
import { SITE } from '@/lib/site'

import { fontVariables } from '../fonts'
import '../globals.css'

/** Root layout of the English pages (/en): same design, lang="en", English chrome. */
export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: { default: SITE.nameEn, template: `%s | CU Chhatrashibir` },
  applicationName: 'CU Chhatrashibir',
  openGraph: { type: 'website', siteName: SITE.nameEn, locale: 'en_US', alternateLocale: ['bn_BD'] },
  twitter: { card: 'summary_large_image', site: '@CUshibir77' },
  icons: {
    icon: [{ url: '/icons/favicon-48.png', sizes: '48x48', type: 'image/png' }, { url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: '/icons/apple-touch-icon.png',
  },
}

export const viewport: Viewport = { themeColor: '#ffffff', width: 'device-width', initialScale: 1, viewportFit: 'cover' }

const motionScript = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.classList.add('motion')}catch(e){}`

export default async function EnglishLayout({ children }: { children: ReactNode }) {
  const settings = await getSiteSettings('en')
  return (
    <html lang="en" className={fontVariables} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionScript }} />
      </head>
      <body className="en-site flex min-h-dvh flex-col">
        <SvgDefs />
        <EnHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <EnFooter settings={settings} />
        <RevealObserver />
        <ServiceWorker />
      </body>
    </html>
  )
}
