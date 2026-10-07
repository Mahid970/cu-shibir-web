import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  // Self-contained server for the Docker image (see Dockerfile).
  output: 'standalone',
  poweredByHeader: false,
  // Question papers are uploaded through a server action (PDF or photo, up to 10 MB).
  experimental: { serverActions: { bodySizeLimit: '11mb' } },
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/brand/**' }, { pathname: '/cucsu/**' }],
    // YouTube thumbnails for the branch's own videos
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
    formats: ['image/avif', 'image/webp'],
    // Optimised copies are keyed by source URL; uploads get new file names, so a week is safe.
    minimumCacheTTL: 604800,
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }

    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
  async headers() {
    const security = [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
      { key: 'Permissions-Policy', value: 'camera=(self), microphone=(), geolocation=(self)' },
    ]
    const week = [{ key: 'Cache-Control', value: 'public, max-age=604800, stale-while-revalidate=86400' }]
    return [
      { source: '/:path*', headers: security },
      // Payload sends media files with no cache header, so every visit downloaded them again. Only the
      // public Media collection: question papers and other uploads keep their own access rules.
      { source: '/api/media/file/:path*', headers: week },
      { source: '/icons/:path*', headers: week },
      { source: '/brand/:path*', headers: week },
      { source: '/video/:path*', headers: week },
      {
        source: '/sw.js',
        headers: [
          { key: 'Content-Type', value: 'application/javascript; charset=utf-8' },
          { key: 'Cache-Control', value: 'no-cache, no-store, must-revalidate' },
          { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'" },
        ],
      },
    ]
  },
  // Routes of the old cushibir.org (plan §8). Id-based URLs are resolved in route handlers:
  // /blog_details/:id/:slug and /responsible/people/:id.
  async redirects() {
    return [
      { source: '/blogs', destination: '/news', permanent: true },
      { source: '/peoples', destination: '/leadership', permanent: true },
      { source: '/responsible/people', destination: '/leadership', permanent: true },
      { source: '/sform', destination: '/join/supporter', permanent: true },
      { source: '/ehtesab_or_advice', destination: '/join/feedback', permanent: true },
      { source: '/scholarship_application', destination: '/services/assistance', permanent: true },
      { source: '/shibir/porichiti', destination: '/about', permanent: true },
      { source: '/shibir/syllabus', destination: '/syllabus', permanent: true },
      { source: '/departments', destination: '/services/campus#departments', permanent: true },
      { source: '/halls', destination: '/services/campus#halls', permanent: true },
      { source: '/photos', destination: '/gallery', permanent: true },
      { source: '/news_paper', destination: '/press', permanent: true },
      { source: '/kormoshuci/all', destination: '/news', permanent: true },
      { source: '/contact/us', destination: '/join#contact', permanent: true },
    ]
  },
}

const config = withPayload(nextConfig, { devBundleServerPackages: false })

// Payload sends Accept-CH / Critical-CH / Vary for the admin's colour scheme on *every* path. On the
// public site that makes Chrome repeat first navigations, splits the CDN cache and breaks service
// worker registration, so keep those headers on /admin only.
const withPayloadHeaders = config.headers
config.headers = async () =>
  ((await withPayloadHeaders?.()) ?? []).map((rule) =>
    rule.source === '/:path*' && rule.headers.some((h) => h.key === 'Critical-CH') ? { ...rule, source: '/admin/:path*' } : rule,
  )

export default config
