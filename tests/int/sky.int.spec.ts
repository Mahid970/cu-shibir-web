import { describe, expect, it } from 'vitest'

import { formatDate } from '@/lib/bn'
import { nextPrayer, prayerTimes, skyAt } from '@/lib/sky'

const dhaka = (d: Date) => new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', hourCycle: 'h23', timeZone: 'Asia/Dhaka' }).format(d)

describe('prayer times at the University of Chittagong', () => {
  // Late September in Chattogram: Fajr about 4:20, Maghrib about 5:50 (local time).
  const day = new Date('2026-09-26T06:00:00Z') // 12:00 in Dhaka
  const t = prayerTimes(day)

  it('falls in plausible windows', () => {
    expect(dhaka(t.fajr) >= '04:05' && dhaka(t.fajr) <= '04:35').toBe(true)
    expect(dhaka(t.dhuhr) >= '11:40' && dhaka(t.dhuhr) <= '12:00').toBe(true)
    expect(dhaka(t.maghrib) >= '17:40' && dhaka(t.maghrib) <= '18:00').toBe(true)
    expect(t.fajr < t.sunrise && t.sunrise < t.dhuhr && t.dhuhr < t.asr && t.asr < t.maghrib && t.maghrib < t.isha).toBe(true)
  })

  it('uses the Dhaka calendar day even near midnight UTC', () => {
    // 23:30 UTC is already 05:30 the next morning in Dhaka.
    const late = prayerTimes(new Date('2026-09-26T23:30:00Z'))
    expect(formatDate(late.fajr, { style: 'short' })).toContain('২৭')
  })

  it('names the next prayer and rolls over to tomorrow after Isha', () => {
    expect(nextPrayer(new Date('2026-09-26T06:00:00Z')).key).toBe('asr')
    const afterIsha = nextPrayer(new Date('2026-09-26T16:30:00Z')) // 22:30 Dhaka
    expect(afterIsha.key).toBe('fajr')
    expect(afterIsha.at.getTime()).toBeGreaterThan(new Date('2026-09-26T18:00:00Z').getTime())
  })
})

describe('sky phase', () => {
  it.each([
    ['2026-09-26T19:00:00Z', 'night'], // 01:00
    ['2026-09-26T06:00:00Z', 'day'], // 12:00
    ['2026-09-26T11:15:00Z', 'golden'], // 17:15
    ['2026-09-26T12:25:00Z', 'dusk'], // 18:25
  ])('%s is %s', (iso, phase) => {
    expect(skyAt(new Date(iso)).phase).toBe(phase)
  })

  it('blends colours around an edge instead of jumping', () => {
    const maghrib = prayerTimes(new Date('2026-09-26T06:00:00Z')).maghrib
    const before = skyAt(new Date(maghrib.getTime() - 60 * 60 * 1000)).palette.top
    const at = skyAt(maghrib).palette.top
    const after = skyAt(new Date(maghrib.getTime() + 30 * 60 * 1000)).palette.top
    expect(new Set([before, at, after]).size).toBe(3)
  })
})
