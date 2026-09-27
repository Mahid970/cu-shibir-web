import { expect, test } from '@playwright/test'

const BASE = 'http://localhost:3000'

// Each run looks like a new visitor, so the per-IP form limits don't trip on repeated runs.
test.use({ extraHTTPHeaders: { 'cf-connecting-ip': `10.4.${Math.floor(Math.random() * 250)}.${Math.floor(Math.random() * 250)}` } })

test.describe('Student issues desk', () => {
  test('an anonymous report gets a tracking code that shows its progress', async ({ page }) => {
    await page.goto(`${BASE}/services/issues/report`)
    await page.waitForTimeout(3200) // the form refuses submissions faster than a person could type
    await page.getByText('হল ও আবাসন', { exact: true }).click()
    await page.getByLabel('সংক্ষেপে সমস্যা').fill('আলাওল হলের পানির কল নষ্ট')
    await page.getByLabel('বিস্তারিত').fill('তিনতলার পানির কল এক সপ্তাহ ধরে নষ্ট, হল অফিসে জানানো হয়েছে কিন্তু কাজ হয়নি।')
    await page.getByText('নাম ছাড়া জানাতে চাই').click()
    await expect(page.getByLabel('আপনার নাম')).toHaveCount(0)
    await page.locator('input[name="consent"]').check()
    await page.getByRole('button', { name: 'সমস্যা জানান' }).click()

    await expect(page.getByRole('heading', { name: 'সমস্যাটি ডেস্কে পৌঁছেছে' })).toBeVisible()
    const id = (await page.locator('dd').first().textContent())!.trim()
    const code = (await page.locator('dd').nth(1).textContent())!.trim()
    expect(id).toMatch(/^IS-[A-Z0-9]{6}$/)

    await page.goto(`${BASE}/services/issues/status`)
    await page.getByLabel('ট্র্যাকিং আইডি').fill(id)
    await page.getByLabel('গোপন কোড').fill(code)
    await page.getByRole('button', { name: 'দেখুন' }).click()
    await expect(page.getByText(id, { exact: true })).toBeVisible()
    await expect(page.getByText('হল ও আবাসন, জমা দেওয়া হয়েছে', { exact: false })).toBeVisible()
    await expect(page.locator('ol li').first()).toContainText('এখন')
  })

  test('choosing harassment explains who sees it and where to call', async ({ page }) => {
    await page.goto(`${BASE}/services/issues/report`)
    await page.getByText('হয়রানি (গোপনীয়)', { exact: true }).click()
    await expect(page.getByRole('note')).toContainText('শুধু হয়রানি ডেস্কের দায়িত্বপ্রাপ্তরা')
    await expect(page.getByRole('note')).toContainText('৯৯৯')
  })

  test('the English form answers in English', async ({ page }) => {
    await page.goto(`${BASE}/en/services/issues/report`)
    await page.waitForTimeout(3200)
    await page.getByRole('button', { name: 'Report the problem' }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText('Some details need fixing')
    await expect(page.locator('#e-category')).toContainText('Please choose')
  })

  test('the issue tracker rejects an application id', async ({ page }) => {
    await page.goto(`${BASE}/en/services/issues/status`)
    await page.getByLabel('Tracking ID').fill('CU-ZZZZZZ')
    await page.getByLabel('Secret code').fill('ZZZZZZ')
    await page.getByRole('button', { name: 'Check' }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText('IS-7K3P9Q')
  })
})
