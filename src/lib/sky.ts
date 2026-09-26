import { CalculationMethod, Coordinates, Madhab, PrayerTimes } from 'adhan'

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

export type Palette = {
  top: string // sky at the zenith
  bottom: string // sky at the horizon, also the fog
  hillNear: string
  hillFar: string
  light: number // sun / key light intensity 0..1.2
  sun: string // key light colour
  stars: number // 0..1
  lamps: number // 0..1, campus lights and train windows
  sunHeight: number // -1 (below horizon) .. 1 (noon)
}

const P: Record<'night' | 'dawn' | 'day' | 'golden' | 'dusk', Palette> = {
  night: { top: '#020617', bottom: '#0b1f3a', hillNear: '#0a1a1f', hillFar: '#10233a', light: 0.18, sun: '#9fb4ff', stars: 1, lamps: 1, sunHeight: -1 },
  dawn: { top: '#1e3a8a', bottom: '#f4a261', hillNear: '#1f3b2c', hillFar: '#3b4a6b', light: 0.55, sun: '#ffc89a', stars: 0.2, lamps: 0.5, sunHeight: 0.05 },
  day: { top: '#3b82f6', bottom: '#cfe8ff', hillNear: '#2f7d4a', hillFar: '#6a9fb5', light: 1.1, sun: '#fff7e8', stars: 0, lamps: 0, sunHeight: 1 },
  golden: { top: '#2563eb', bottom: '#ffd29a', hillNear: '#3f7a3a', hillFar: '#8a8fa8', light: 0.85, sun: '#ffcf8a', stars: 0, lamps: 0.1, sunHeight: 0.25 },
  dusk: { top: '#1e1b4b', bottom: '#e76f51', hillNear: '#1b2e27', hillFar: '#3a3558', light: 0.35, sun: '#ff9a76', stars: 0.5, lamps: 0.9, sunHeight: -0.1 },
}

export type Phase = keyof typeof P

export const PHASE_NAMES: Record<Phase, string> = {
  night: 'রাত',
  dawn: 'ভোর',
  day: 'দিন',
  golden: 'বিকেল',
  dusk: 'সন্ধ্যা',
}

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

export const PALETTES = P
