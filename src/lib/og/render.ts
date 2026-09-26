import type { Browser } from 'playwright-core'

import { shareCardHtml, type ShareCardInput } from './shareCard'

let browserPromise: Promise<Browser> | null = null

/** One shared headless Chromium per server process (launch is the slow part). */
async function getBrowser(): Promise<Browser> {
  if (!browserPromise) {
    browserPromise = import('playwright-core').then(({ chromium }) =>
      chromium.launch({
        // In production Docker the binary comes from `npx playwright install chromium`;
        // CHROMIUM_PATH can point at a system Chromium instead.
        executablePath: process.env.CHROMIUM_PATH || undefined,
        args: ['--font-render-hinting=none', '--disable-dev-shm-usage'],
      }),
    )
    browserPromise.catch(() => (browserPromise = null))
  }
  return browserPromise
}

/** Render a branded 1200×630 share card to JPEG with correctly shaped Bangla. */
export async function renderShareCard(input: ShareCardInput): Promise<Buffer> {
  const browser = await getBrowser()
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 })
  try {
    await page.setContent(shareCardHtml(input), { waitUntil: 'load' })
    await page.evaluate(() => document.fonts.ready)
    return await page.screenshot({ type: 'jpeg', quality: 86 })
  } finally {
    await page.close()
  }
}

export async function closeRenderer() {
  if (browserPromise) (await browserPromise).close()
  browserPromise = null
}
