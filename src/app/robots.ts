import type { MetadataRoute } from 'next'

import { absoluteUrl, SITE } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  // Staging (new.cushibir.org) and local builds stay out of search results.
  const isProduction = SITE.url.startsWith('https://') && !SITE.url.includes('://new.') && process.env.SITE_NOINDEX !== 'true'
  if (!isProduction) return { rules: [{ userAgent: '*', disallow: '/' }] }
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/admin', '/api/', '/next/', '/services/assistance/status'] }],
    sitemap: absoluteUrl('/sitemap.xml'),
    host: SITE.url,
  }
}
