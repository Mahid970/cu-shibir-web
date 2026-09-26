import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan'

import { PALETTES as P, PHASE_NAMES, type Palette, type Phase } from './skyPalettes'

/**
 * "Living sky" for the campus scene: the palette follows the real time of day at the University of
 * Chittagong, and the next prayer time is shown beside it (plan §5.1).
 * Prayer times: Karachi method with Hanafi Asr, as used by the Islamic Foundation Bangladesh.
 */

export const CAMPUS = { lat: 22.4716, lng: 91.7877 } // University of Chittagong, Fatehpur, Hathazari

const coords = new Coordinates(CAMPUS.lat, CAMPUS.lng)

function params() {
  const p = CalculationMethod.Karachi()
  p.madhab = Madhab.Hanafi
  return p
}

/** Calendar date in Dhaka (UTC+6, no DST) as a local Date at noon, which adhan uses for the day. */
function dhakaDay(now: Date, offsetDays = 0): Date {
  const d = new Date(now.getTime() + 6 * 3600 * 1000)
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + offsetDays, 12))
}

export function prayerTimes(now: Date, offsetDays = 0) {
  const day = dhakaDay(now, offsetDays)
  // adhan reads the date's local Y/M/D; build it from the Dhaka calendar date.
  const local = new Date(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate())
  return new PrayerTimes(coords, local, params())
}

export const PRAYER_NAMES = { fajr: 'ফজর', dhuhr: 'যোহর', asr: 'আসর', maghrib: 'মাগরিব', isha: 'এশা' } as const
export type PrayerKey = keyof typeof PRAYER_NAMES

export function nextPrayer(now: Date): { key: PrayerKey; name: string; at: Date } {
  const today = prayerTimes(now)
  const order: PrayerKey[] = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha']
  for (const key of order) {
    if (today[key] > now) return { key, name: PRAYER_NAMES[key], at: today[key] }
  }
  const tomorrow = prayerTimes(now, 1)
  return { key: 'fajr', name: PRAYER_NAMES.fajr, at: tomorrow.fajr }
}

// ---------------------------------------------------------------------------
// Sky phases and palettes
// ---------------------------------------------------------------------------

const hex = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16))
const toHex = (v: number[]) => `#${v.map((x) => Math.round(x).toString(16).padStart(2, '0')).join('')}`
const mixColor = (a: string, b: string, t: number) => toHex(hex(a).map((x, i) => x + (hex(b)[i] - x) * t))
const mix = (a: number, b: number, t: number) => a + (b - a) * t

function blend(a: Palette, b: Palette, t: number): Palette {
  const k = Math.min(1, Math.max(0, t))
  return {
    top: mixColor(a.top, b.top, k),
    bottom: mixColor(a.bottom, b.bottom, k),
    hillNear: mixColor(a.hillNear, b.hillNear, k),
    hillFar: mixColor(a.hillFar, b.hillFar, k),
    light: mix(a.light, b.light, k),
    sun: mixColor(a.sun, b.sun, k),
    stars: mix(a.stars, b.stars, k),
    lamps: mix(a.lamps, b.lamps, k),
    sunHeight: mix(a.sunHeight, b.sunHeight, k),
  }
}

/**
 * Where the day is at `now`, with a palette that eases between phases around Fajr, sunrise,
 * late afternoon, Maghrib and Isha.
 */
export function skyAt(now: Date): { phase: Phase; name: string; palette: Palette } {
  const t = prayerTimes(now)
  const at = now.getTime()
  const min = 60 * 1000
  const sunrise = t.sunrise.getTime()
  const maghrib = t.maghrib.getTime()
  const edges: [number, Phase, Phase][] = [
    // [time, phase before, phase after] — each change is a 40-minute blend centred on the edge
    [t.fajr.getTime(), 'night', 'dawn'],
    [sunrise + 30 * min, 'dawn', 'day'],
    [maghrib - 75 * min, 'day', 'golden'],
    [maghrib, 'golden', 'dusk'],
    [t.isha.getTime(), 'dusk', 'night'],
  ]
  let phase: Phase = 'night'
  for (const [time, , after] of edges) if (at >= time) phase = after
  for (const [time, before, after] of edges) {
    const d = at - time
    if (Math.abs(d) < 20 * min) {
      const k = (d + 20 * min) / (40 * min)
      return { phase: k < 0.5 ? before : after, name: PHASE_NAMES[k < 0.5 ? before : after], palette: blend(P[before], P[after], k) }
    }
  }
  return { phase, name: PHASE_NAMES[phase], palette: P[phase] }
}

export { PALETTES, PHASE_NAMES, type Palette, type Phase } from './skyPalettes'
