import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.describe('Legacy URLs', () => {
  for (const [from, to] of [
    ['/blogs', '/news'],
    ['/sform', '/join/supporter'],
    ['/scholarship_application', '/services/assistance'],
    ['/ehtesab_or_advice', '/join/feedback'],
    ['/news_paper', '/press'],
    ['/blog_details/999999/unknown', '/news'],
  ]) {
    test(`${from} redirects permanently to ${to}`, async ({ request }) => {
      const res = await request.get(`${BASE}${from}`, { maxRedirects: 0 })
      expect([301, 308]).toContain(res.status())
      expect(new URL(res.headers().location, BASE).pathname).toBe(to)
    })
  }
})

test.describe('SEO and app shell', () => {
  test('sitemap lists the English page and robots points to it', async ({ request }) => {
    const sitemap = await (await request.get(`${BASE}/sitemap.xml`)).text()
    expect(sitemap).toContain('/en</loc>')
    expect(sitemap).toContain('/syllabus/kormi')
    const manifest = await (await request.get(`${BASE}/manifest.webmanifest`)).json()
    expect(manifest.lang).toBe('bn')
    expect(manifest.icons.some((i: { purpose?: string }) => i.purpose === 'maskable')).toBe(true)
  })

  test('public pages do not send the admin client-hint headers', async ({ request }) => {
    const res = await request.get(`${BASE}/`)
    expect(res.headers()['critical-ch']).toBeUndefined()
    expect(res.headers()['x-content-type-options']).toBe('nosniff')
  })

  test('English home is lang="en" and links back to Bangla', async ({ page }) => {
    await page.goto(`${BASE}/en`)
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Chhatrashibir')
    await expect(page.locator('link[rel="alternate"][hreflang="bn-BD"]')).toHaveCount(1)
    await expect(page.getByRole('link', { name: 'বাংলা' })).toHaveAttribute('href', '/')
  })
})

test.describe('Search', () => {
  test('suggestions find departments and posts', async ({ request }) => {
    const res = await request.get(`${BASE}/search/suggest?q=${encodeURIComponent('গণিত')}`)
    const body = (await res.json()) as { hits: { kind: string; title: string }[] }
    expect(body.hits.some((h) => h.title.includes('গণিত'))).toBe(true)
  })
})

test.describe('Forms', () => {
  test('supporter form explains what is missing, in Bangla', async ({ page }) => {
    await page.goto(`${BASE}/join/supporter`)
    await page.waitForTimeout(3200) // the form refuses submissions faster than a person could type
    await page.getByRole('button', { name: 'ফরম জমা দিন' }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText('ঠিক করতে হবে')
    await expect(page.locator('#e-name')).toHaveText('নাম লিখুন।')
    await expect(page.locator('#f-name')).toHaveAttribute('aria-invalid', 'true')
  })

  test('assistance tracking rejects an unknown code', async ({ page }) => {
    await page.goto(`${BASE}/services/assistance/status`)
    await page.getByLabel('ট্র্যাকিং আইডি').fill('CU-ZZZZZZ')
    await page.getByLabel('গোপন কোড').fill('ZZZZZZ')
    await page.getByRole('button', { name: 'দেখুন' }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText('পাওয়া যায়নি')
  })
})

test.describe('Syllabus', () => {
  test('ticking a book updates the level progress', async ({ page }) => {
    await page.goto(`${BASE}/syllabus/kormi`)
    const first = page.locator('main input[type="checkbox"]').first()
    await first.check()
    await expect(page.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow', '0')
    await first.uncheck()
    await expect(page.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '0')
  })
})
