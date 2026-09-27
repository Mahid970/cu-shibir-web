/**
 * শাটল ট্রেন: which trains leave next, worked out from the timetable the branch keeps in the CMS.
 * Runs in the browser (so the countdown is right even on a cached page) and in tests. Chattogram
 * keeps UTC+6 all year, so there is no daylight-saving to handle.
 */

export const DAYS = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const
export type Day = (typeof DAYS)[number]
export type Direction = 'to-campus' | 'to-city'

export type Trip = { direction: Direction; time: string; days: Day[]; note?: string | null }
export type Closure = { from: string; to: string; reason?: string | null }
export type Timetable = { trips: Trip[]; closures: Closure[] }

export type Departure = { time: string; note?: string | null; /** 0 today, 1 tomorrow… */ dayOffset: number; minutesUntil: number }

const DHAKA_MS = 6 * 3600 * 1000
export const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/

/** Calendar date (YYYY-MM-DD), weekday and minute of the day in Chattogram. */
export function dhakaNow(now: Date) {
  const local = new Date(now.getTime() + DHAKA_MS)
  return { date: local.toISOString().slice(0, 10), day: DAYS[local.getUTCDay()], minutes: local.getUTCHours() * 60 + local.getUTCMinutes() }
}

/** A CMS date (stored as an ISO timestamp) as the Chattogram calendar date. */
export const dhakaDate = (iso: string) => new Date(Date.parse(iso) + DHAKA_MS).toISOString().slice(0, 10)

const addDays = (date: string, n: number) => new Date(Date.parse(`${date}T00:00:00Z`) + n * 86400000).toISOString().slice(0, 10)
const minutesOf = (time: string) => Number(time.slice(0, 2)) * 60 + Number(time.slice(3, 5))

/** The closure covering a Chattogram date, if any. */
export function closureOn(timetable: Timetable, date: string): Closure | undefined {
  return timetable.closures.find((c) => dhakaDate(c.from) <= date && date <= dhakaDate(c.to))
}

/**
 * The next `count` departures in one direction, looking up to a week ahead and skipping closed
 * days. Trains leaving this minute still count (minutesUntil 0).
 */
export function nextDepartures(timetable: Timetable, direction: Direction, now: Date, count = 3): Departure[] {
  const today = dhakaNow(now)
  const trips = timetable.trips.filter((t) => t.direction === direction && TIME_RE.test(t.time)).sort((a, b) => minutesOf(a.time) - minutesOf(b.time))
  const out: Departure[] = []
  for (let offset = 0; offset < 8 && out.length < count; offset++) {
    const date = addDays(today.date, offset)
    if (closureOn(timetable, date)) continue
    const day = DAYS[(DAYS.indexOf(today.day) + offset) % 7]
    for (const trip of trips) {
      if (!trip.days.includes(day)) continue
      const minutesUntil = offset * 1440 + minutesOf(trip.time) - today.minutes
      if (minutesUntil < 0) continue
      out.push({ time: trip.time, note: trip.note, dayOffset: offset, minutesUntil })
      if (out.length === count) break
    }
  }
  return out
}

/** Upcoming closures (today onwards), soonest first, for the notice under the timetable. */
export function upcomingClosures(timetable: Timetable, now: Date): Closure[] {
  const today = dhakaNow(now).date
  return timetable.closures.filter((c) => dhakaDate(c.to) >= today).sort((a, b) => Date.parse(a.from) - Date.parse(b.from))
}

/** A 24-hour "HH:MM" as a Date on an arbitrary day, for the shared time formatter. */
export const clock = (time: string) => new Date(`2026-01-01T${time}:00+06:00`)
