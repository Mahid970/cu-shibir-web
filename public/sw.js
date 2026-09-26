/*
 * Service worker for cushibir.org — keeps the site usable on patchy mobile data.
 *
 * - Pages: network first (4 s timeout), then the copy saved when the page was last opened,
 *   then /offline. Up to 40 pages are kept.
 * - Build assets (/_next/static): cache first; their names change with every deploy.
 * - Images: stale-while-revalidate, up to 80.
 * - Never cached: the CMS (/admin, /api except media files), POSTs (forms, server actions),
 *   search suggestions and anything cross-origin.
 */
const VERSION = 'v1'
const PAGES = `pages-${VERSION}`
const STATIC = `static-${VERSION}`
const IMAGES = `images-${VERSION}`
const OFFLINE_URL = '/offline'
const PRECACHE = [OFFLINE_URL, '/icons/icon-192.png', '/brand/logo-legacy.png']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting()),
  )
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => ![PAGES, STATIC, IMAGES].includes(k)).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  )
})

async function trim(cacheName, max) {
  const cache = await caches.open(cacheName)
  const keys = await cache.keys()
  for (let i = 0; i < keys.length - max; i++) await cache.delete(keys[i])
}

function timeout(ms) {
  return new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), ms))
}

async function networkFirstPage(request) {
  const cache = await caches.open(PAGES)
  try {
    const response = await Promise.race([fetch(request), timeout(4000)])
    if (response.ok && response.type === 'basic') {
      cache.put(request, response.clone()).then(() => trim(PAGES, 40))
    }
    return response
  } catch {
    const cached = await cache.match(request, { ignoreSearch: false })
    return cached || (await cache.match(OFFLINE_URL)) || Response.error()
  }
}

async function cacheFirst(request) {
  const cache = await caches.open(STATIC)
  const cached = await cache.match(request)
  if (cached) return cached
  const response = await fetch(request)
  if (response.ok) cache.put(request, response.clone())
  return response
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(IMAGES)
  const cached = await cache.match(request)
  const refresh = fetch(request)
    .then((response) => {
      if (response.ok) cache.put(request, response.clone()).then(() => trim(IMAGES, 80))
      return response
    })
    .catch(() => cached)
  return cached || refresh
}

self.addEventListener('fetch', (event) => {
  const { request } = event
  if (request.method !== 'GET') return
  const url = new URL(request.url)
  if (url.origin !== self.location.origin) return
  if (url.pathname.startsWith('/admin') || url.pathname.startsWith('/search/suggest') || url.pathname.startsWith('/next/')) return
  if (url.pathname.startsWith('/api/') && !url.pathname.startsWith('/api/media/file/')) return

  // React Server Component payloads for client navigations: let the network (and Next's own retry) handle them.
  if (request.headers.get('RSC') || url.searchParams.has('_rsc')) return

  if (request.mode === 'navigate') {
    event.respondWith(networkFirstPage(request))
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request))
  } else if (url.pathname.startsWith('/_next/image') || url.pathname.startsWith('/api/media/file/') || url.pathname.startsWith('/icons/')) {
    event.respondWith(staleWhileRevalidate(request))
  }
})
