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

  // Needs the branch's martyrs in the database: npm run seed:shaheeds
  test('the martyrs page walks the journey and every martyr has a page', async ({ page }) => {
    await page.goto(`${BASE}/martyrs`)
    await expect(page.getByRole('heading', { level: 1, name: 'শহীদ স্মরণ' })).toBeVisible()
    const journey = page.locator('#martyrs-journey')
    await expect(journey.getByRole('link', { name: /মাসউদ বিন হাবীব/ }).first()).toBeAttached()
    await page.getByRole('link', { name: /মামুন হোসাইন/ }).last().click()
    await expect(page).toHaveURL(/\/martyrs\/mamun-hossain$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('মামুন হোসাইন')
    await expect(page.getByText('১২ জানুয়ারি, ২০১৪').first()).toBeVisible()
    // Graphic photos stay veiled until asked for.
    const veiled = page.getByRole('button', { name: /কষ্টদায়ক দৃশ্য/ }).first()
    await expect(veiled).toBeVisible()
    await veiled.click()
    await expect(page.getByRole('link', { name: /পরের শহীদ|আগের শহীদ/ }).first()).toBeVisible()
  })

  test('a martyr page reads in English too', async ({ page }) => {
    await page.goto(`${BASE}/en/martyrs/jobayer-hossain`)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Jobayer Hossain')
    await expect(page.getByText('Martyr no. 100')).toBeVisible()
    await expect(page.getByRole('heading', { name: '15 May 1999' })).toBeVisible()
  })
})
