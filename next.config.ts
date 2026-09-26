import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(__filename)

const nextConfig: NextConfig = {
  images: {
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/brand/**' }],
    // YouTube thumbnails for the branch's own videos
    remotePatterns: [{ protocol: 'https', hostname: 'i.ytimg.com', pathname: '/vi/**' }],
    formats: ['image/avif', 'image/webp'],
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

export default withPayload(nextConfig, { devBundleServerPackages: false })
