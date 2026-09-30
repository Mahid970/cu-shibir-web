import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage renders the Bangla hero, stats and share metadata', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/ছাত্রশিবির/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'bn')
    // Accessible name of the kinetic headline is the full, unsplit text.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/আমরা তরুণ/)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /ছাত্রশিবির/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
  })

  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`the hero's living picture draws (${reducedMotion} motion)`, async ({ browser }) => {
      const page = await browser.newPage({ reducedMotion })
      await page.goto('http://localhost:3000')
      const picture = page.getByRole('img', { name: /সংগঠনের প্রতীক/ })
      await expect(picture).toBeVisible()
      // Some dots are lit once the photos have loaded and the first scene has formed.
      await expect
        .poll(
          () =>
            picture.locator('canvas').evaluate((c: HTMLCanvasElement) => {
              const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data
              let lit = 0
              for (let i = 3; i < d.length; i += 4 * 97) if (d[i] > 0) lit++
              return lit
            }),
          { timeout: 15000 },
        )
        .toBeGreaterThan(50)
      await page.close()
    })
  }
})
