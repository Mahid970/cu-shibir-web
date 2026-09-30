import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'

test.describe('Phase 2 layer', () => {
  test('about page tells the history stop by stop and draws the emblem', async ({ page }) => {
    await page.goto(`${BASE}/about`)
    const history = page.locator('#history')
    await expect(history.getByRole('heading', { name: 'যে পথে এসেছি' })).toBeVisible()
    await expect(history.getByRole('listitem').filter({ hasText: 'চাকসুতে ২৪/২৬' })).toHaveCount(1)
    await expect(page.locator('canvas').first()).toBeAttached()
  })

  test('memorial page stays hidden until the branch publishes entries', async ({ request }) => {
    const res = await request.get(`${BASE}/martyrs`)
    expect(res.status()).toBe(404)
  })
})
