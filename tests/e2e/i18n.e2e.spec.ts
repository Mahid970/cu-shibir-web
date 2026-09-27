import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'
const BANGLA = /[\u0980-\u09FF]/

/** Pages that exist in both languages (Bangla path; English adds /en). */
const PAGES = [
  '/',
  '/about',
  '/leadership',
  '/news',
  '/gallery',
  '/videos',
  '/press',
  '/events',
  '/services',
  '/services/campus',
  '/services/assistance',
  '/services/shuttle',
  '/services/freshers',
  '/services/issues',
  '/services/blood',
  '/services/questions',
  '/services/questions/upload',
  '/services/blood/donate',
  '/services/blood/request',
  '/services/issues/report',
  '/join',
  '/join/supporter',
  '/join/feedback',
  '/syllabus',
  '/syllabus/sodosso',
  '/privacy',
]

test.describe('Bangla / English switch', () => {
  test('switching keeps the page, its filter and the scroll position', async ({ page }) => {
    await page.goto(`${BASE}/news?category=statement`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'bn')
    await page.evaluate(() => window.scrollTo(0, 400))
    // dispatchEvent: Playwright's click() would first scroll the sticky header link "into view".
    await page.locator('header a[hreflang="en"]:visible').first().dispatchEvent('click')
    await expect(page).toHaveURL(`${BASE}/en/news?category=statement`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/News and publications/)
    await expect.poll(() => page.evaluate(() => window.scrollY)).toBeGreaterThan(300)

    await page.locator('header a[hreflang="bn"]:visible').first().dispatchEvent('click')
    await expect(page).toHaveURL(`${BASE}/news?category=statement`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'bn')
    // Scroll reveals still work after the switch.
    await expect(page.locator('html')).toHaveClass(/motion/)
  })

  test('the same section stays in view after switching', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    await page.waitForTimeout(1000)
    const top = () => page.evaluate(() => Math.round(document.getElementById('who')!.getBoundingClientRect().top))
    await page.evaluate(() => {
      document.getElementById('who')!.scrollIntoView()
      window.scrollBy(0, -150)
    })
    await page.waitForTimeout(500)
    const before = await top()
    await page.locator('header a[hreflang="en"]:visible').first().dispatchEvent('click')
    await expect(page).toHaveURL(`${BASE}/en/about`)
    await expect(page.locator('#who')).toHaveText('Who we are')
    await expect.poll(top, { timeout: 5000 }).toBeGreaterThanOrEqual(before - 4)
    expect(await top()).toBeLessThanOrEqual(before + 4)
  })

  test('links on English pages stay in English', async ({ page }) => {
    await page.goto(`${BASE}/en`)
    const hrefs = await page.locator('header a[href^="/"], main a[href^="/"], footer a[href^="/"]').evaluateAll((els) =>
      els.filter((a) => a.getAttribute('hreflang') !== 'bn').map((a) => a.getAttribute('href')!),
    )
    expect(hrefs.length).toBeGreaterThan(20)
    expect(hrefs.filter((h) => h !== '/en' && !h.startsWith('/en/') && !h.startsWith('/en#') && !h.startsWith('/api/'))).toEqual([])
  })

  for (const path of PAGES) {
    test(`${path} has an English twin with its own lang, canonical and hreflang`, async ({ page }) => {
      const en = path === '/' ? '/en' : `/en${path}`
      await page.goto(`${BASE}${en}`)
      await expect(page.locator('html')).toHaveAttribute('lang', 'en')
      const h1 = (await page.getByRole('heading', { level: 1 }).first().textContent()) ?? ''
      expect(h1).not.toMatch(BANGLA)
      await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${BASE}${en}`)
      // Next writes the site root without a trailing slash.
      await expect(page.locator('link[rel="alternate"][hreflang="bn-BD"]')).toHaveAttribute('href', `${BASE}${path === '/' ? '' : path}`)
    })
  }

  test('Bangla keeps its short URLs; the internal /bn address points to them', async ({ request }) => {
    const short = await request.get(`${BASE}/about`, { maxRedirects: 0 })
    expect(short.status()).toBe(200)
    const internal = await request.get(`${BASE}/bn/about`, { maxRedirects: 0 })
    expect(internal.status()).toBe(200)
    expect(await internal.text()).toContain(`<link rel="canonical" href="${BASE}/about"`)
  })

  test('English forms answer in English', async ({ page }) => {
    await page.goto(`${BASE}/en/join/supporter`)
    await page.waitForTimeout(3500) // the anti-bot fill-time check
    await page.getByRole('button', { name: 'Submit the form' }).click()
    await expect(page.locator('main [role="alert"]')).toContainText('Some details need fixing')
    await expect(page.locator('#e-mobile')).toHaveText('Please fill in your mobile number.')
  })

  test('English search finds things by their English names', async ({ request }) => {
    const body = await (await request.get(`${BASE}/en/search/suggest?q=math`)).json()
    expect(body.hits.map((h: { title: string }) => h.title)).toContain('Department of Mathematics')
  })

  test('unknown English addresses get an English 404 inside the site', async ({ page }) => {
    const res = await page.goto(`${BASE}/en/no-such-page`)
    expect(res?.status()).toBe(404)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Page not found')
    await expect(page.locator('header')).toBeVisible()
  })
})
