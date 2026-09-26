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
})
