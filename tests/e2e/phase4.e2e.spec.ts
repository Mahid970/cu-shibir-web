import { expect, test } from '@playwright/test'
import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config.js'

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

/** "HH:MM" in Chattogram, `minutes` from now. */
const dhakaClock = (minutes: number) => new Date(Date.now() + (minutes + 360) * 60_000).toISOString().slice(11, 16)

async function purge(tags: string[]) {
  await fetch(`${BASE}/next/revalidate`, {
    method: 'POST',
    headers: { 'content-type': 'application/json', 'x-revalidate-secret': process.env.REVALIDATE_SECRET ?? '' },
    body: JSON.stringify({ tags }),
  })
}

test.describe('Shuttle timetable', () => {
  let payload: Payload
  test.beforeAll(async () => {
    payload = await getPayload({ config })
    const every = ['sat', 'sun', 'mon', 'tue', 'wed', 'thu', 'fri'] as const
    await payload.updateGlobal({
      slug: 'shuttle',
      context: { disableRevalidate: true },
      data: {
        published: true,
        source: 'E2E sample, not a real timetable',
        stations: [{ name: 'বটতলী', minutes: 0 }, { name: 'ষোলশহর', minutes: 15 }, { name: 'চবি', minutes: 60 }],
        trips: [
          { direction: 'to-campus', time: dhakaClock(95), days: [...every], note: 'নমুনা' },
          { direction: 'to-city', time: dhakaClock(35), days: [...every] },
        ],
        closures: [],
        notice: null,
      },
    })
    await purge(['shuttle'])
  })
  test.afterAll(async () => {
    await payload.updateGlobal({
      slug: 'shuttle',
      context: { disableRevalidate: true },
      data: { published: false, source: null, stations: [], trips: [], closures: [], notice: null },
    })
    await purge(['shuttle'])
  })

  test('counts down to the next train each way and lists the timetable', async ({ page }) => {
    await page.goto(`${BASE}/services/shuttle`)
    const toCampus = page.locator('section', { has: page.getByRole('heading', { name: /ক্যাম্পাসের দিকে/ }) })
    await expect(toCampus).toContainText('বটতলী থেকে')
    await expect(toCampus).toContainText(/মিনিট পর|আগামীকাল/)
    await expect(toCampus).toContainText('পৌঁছাবে আনুমানিক')
    await expect(page.getByRole('figure')).toContainText('ষোলশহর')
    await expect(page.locator('#timetable table')).toHaveCount(2)
    await expect(page.locator('#timetable')).toContainText('প্রতিদিন')
  })

  test('the English page counts down in English', async ({ page }) => {
    await page.goto(`${BASE}/en/services/shuttle`)
    const toCity = page.locator('section', { has: page.getByRole('heading', { name: /To the city/ }) })
    await expect(toCity).toContainText(/in \d+ min|in \d+ h|Tomorrow/)
    await expect(page.locator('#timetable')).toContainText('Every day')
  })

  test('the service pages fit a 375 px phone in both languages', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 800 })
    for (const path of ['/services/shuttle', '/services/issues', '/services/issues/report', '/services/issues/status', '/services/blood', '/services/blood/donate', '/services/blood/request', '/services/blood/donor']) {
      for (const prefix of ['', '/en']) {
        await page.goto(`${BASE}${prefix}${path}`)
        const width = await page.evaluate(() => document.documentElement.scrollWidth)
        expect(width, `${prefix}${path}`).toBeLessThanOrEqual(375)
      }
    }
  })
})

test('the shuttle page says the timetable is coming when none is published', async ({ page }) => {
  // Runs after the timetable tests have unpublished the sample (tests in a file run in order).
  await page.goto(`${BASE}/services/shuttle`)
  await expect(page.getByRole('heading', { name: 'সময়সূচি শীঘ্রই আসছে' })).toBeVisible()
})

test('the Bangla header fits a 1024 px screen', async ({ page }) => {
  await page.setViewportSize({ width: 1024, height: 800 })
  for (const path of ['/', '/services/campus']) {
    await page.goto(`${BASE}${path}`)
    expect(await page.evaluate(() => document.documentElement.scrollWidth), path).toBeLessThanOrEqual(1024)
  }
})

test.describe('Blood donor network', () => {
  test('a donor registers, notes a donation and leaves the list', async ({ page }) => {
    await page.goto(`${BASE}/services/blood/donate`)
    await page.waitForTimeout(3200)
    await page.getByText('O-', { exact: true }).click()
    await page.getByLabel('পূর্ণ নাম').fill('পরীক্ষা দাতা')
    await page.getByLabel('মোবাইল নম্বর').fill('01700000000')
    await page.locator('input[name="consent"]').check()
    await page.getByRole('button', { name: 'দাতা হিসেবে নিবন্ধন করুন' }).click()
    await expect(page.getByRole('heading', { name: 'আপনি এখন রক্তদাতা তালিকায়' })).toBeVisible()
    const id = (await page.locator('dd').first().textContent())!.trim()
    const code = (await page.locator('dd').nth(1).textContent())!.trim()
    expect(id).toMatch(/^BD-[A-Z0-9]{6}$/)

    await page.goto(`${BASE}/services/blood`)
    await expect(page.locator('#donors')).toContainText('O-')

    for (const [action, expected] of [
      ['আজ রক্ত দিয়েছি', 'আবার দিতে পারবেন'],
      ['তালিকা থেকে নাম সরান', 'মুছে ফেলা হয়েছে'],
    ]) {
      await page.goto(`${BASE}/services/blood/donor`)
      await page.getByLabel('দাতা আইডি').fill(id)
      await page.getByLabel('গোপন কোড').fill(code)
      await page.getByText(action, { exact: true }).click()
      await page.getByRole('button', { name: 'জমা দিন' }).click()
      await expect(page.getByRole('status')).toContainText(expected)
    }

    // Gone: the same id and code no longer work.
    await page.goto(`${BASE}/services/blood/donor`)
    await page.getByLabel('দাতা আইডি').fill(id)
    await page.getByLabel('গোপন কোড').fill(code)
    await page.getByText('কিছুদিন বিরতি', { exact: true }).click()
    await page.getByRole('button', { name: 'জমা দিন' }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText('পাওয়া যায়নি')
  })

  test('a blood request is checked, in English', async ({ page }) => {
    await page.goto(`${BASE}/en/services/blood/request`)
    await page.waitForTimeout(3200)
    await page.getByText('AB+', { exact: true }).click()
    await page.getByLabel('Hospital').fill('CMC Hospital, ward 12')
    await page.getByRole('button', { name: 'Send the request' }).click()
    await expect(page.locator('main').getByRole('alert')).toContainText('Some details need fixing')
    await expect(page.locator('#e-neededBy')).toContainText('date and time')
    await expect(page.locator('#e-name')).toBeVisible()
  })
})
