import { expect, test } from '@playwright/test'

test.describe('Frontend', () => {
  test('homepage renders the Bangla hero and share metadata', async ({ page }) => {
    await page.goto('http://localhost:3000')

    await expect(page).toHaveTitle(/ছাত্রশিবির/)
    await expect(page.locator('html')).toHaveAttribute('lang', 'bn')
    // The hero title is the organisation's name and branch.
    await expect(page.getByRole('heading', { level: 1 })).toHaveAccessibleName(/বাংলাদেশ ইসলামী ছাত্রশিবির/)
    await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /ছাত্রশিবির/)
    await expect(page.locator('meta[name="description"]')).toHaveAttribute('content', /.+/)
  })

  for (const reducedMotion of ['no-preference', 'reduce'] as const) {
    test(`the hero shows the campus (${reducedMotion} motion)`, async ({ browser }) => {
      const page = await browser.newPage({ reducedMotion })
      await page.goto('http://localhost:3000')
      // The still frame paints from the start; with motion on, the loop loads once the page has.
      const still = page.locator('.home-hero picture img')
      await expect.poll(() => still.evaluate((i: HTMLImageElement) => i.complete && i.naturalWidth > 0), { timeout: 15000 }).toBe(true)
      const video = page.locator('.home-hero video')
      if (reducedMotion === 'reduce') {
        await page.waitForTimeout(2500)
        await expect(video).not.toHaveAttribute('src', /.+/)
      } else {
        await expect(video).toHaveAttribute('src', /\/video\/hero\/campus-/, { timeout: 15000 })
      }
      await page.close()
    })
  }
})
