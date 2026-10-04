import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage renders the Bangla hero and share metadata', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/ছাত্রশিবির/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'bn')
    // Accessible name of the kinetic headline is the full, unsplit text.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/আমরা তরুণ/)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /ছাত্রশিবির/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
  })

  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`the hero's photo ribbon shows photos (${reducedMotion} motion)`, async ({ browser }) => {
      const page = await browser.newPage({ reducedMotion })
      await page.goto('http://localhost:3000')
      const ribbon = page.getByRole('region', { name: /কার্যক্রমের ছবি/ })
      await expect(ribbon).toBeVisible()
      await expect
        .poll(() => ribbon.locator('img').evaluateAll((imgs: HTMLImageElement[]) => imgs.filter((i) => i.complete && i.naturalWidth > 0).length), {
          timeout: 15000,
        })
        .toBeGreaterThan(0)
      await page.close()
    })
  }
})
