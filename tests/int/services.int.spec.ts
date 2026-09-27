import { describe, expect, it } from 'vitest'

import { summarise } from '@/lib/services/issueStats'
import { closureOn, dhakaNow, nextDepartures, upcomingClosures, type Timetable } from '@/lib/services/shuttle'

describe('issues desk public figures', () => {
  const now = new Date('2026-09-20T10:00:00Z')
  const rows = [
    { category: 'hall', status: 'resolved', createdAt: '2026-09-01T00:00:00Z', resolvedAt: '2026-09-05T00:00:00Z' },
    { category: 'hall', status: 'resolved', createdAt: '2026-08-10T00:00:00Z', resolvedAt: '2026-09-01T00:00:00Z' },
    { category: 'transport', status: 'reviewing', createdAt: '2026-09-10T00:00:00Z' },
    { category: 'food', status: 'closed', createdAt: '2026-07-01T00:00:00Z' },
    { category: 'harassment', status: 'received', createdAt: '2026-09-11T00:00:00Z' },
    { category: 'hall', status: 'spam', createdAt: '2026-09-12T00:00:00Z' },
  ]

  it('leaves out spam and confidential reports everywhere', () => {
    const s = summarise(rows, now)
    expect(s.total).toBe(4)
    expect(s.categories.map((c) => c.value)).not.toContain('harassment')
    expect(s.categories.reduce((n, c) => n + c.total, 0)).toBe(s.total)
    expect(s.months.reduce((n, m) => n + m.received, 0)).toBe(4)
  })

  it('counts resolved, open and closed, and the median time to resolve', () => {
    const s = summarise(rows, now)
    expect([s.resolved, s.open, s.closed]).toEqual([2, 1, 1])
    expect(s.medianDays).toBe(13) // 4 and 22 days
    expect(s.categories[0]).toEqual({ value: 'hall', total: 2, resolved: 2 })
  })

  it('has six months ending with the current one, and nothing resolved yet means no median', () => {
    const s = summarise([], now)
    expect(s.months).toHaveLength(6)
    expect(s.months.at(-1)!.month.startsWith('2026-09-01')).toBe(true)
    expect(s.months[0].month.startsWith('2026-04-01')).toBe(true)
    expect(s.medianDays).toBeNull()
  })
})

describe('shuttle departures', () => {
  const tt: Timetable = {
    trips: [
      { direction: 'to-campus', time: '07:30', days: ['sat', 'sun', 'mon', 'tue', 'wed', 'thu'] },
      { direction: 'to-campus', time: '13:00', days: ['sat', 'sun', 'mon', 'tue', 'wed', 'thu'], note: 'late train' },
      { direction: 'to-campus', time: '09:00', days: ['sun'] },
      { direction: 'to-city', time: '16:30', days: ['sat', 'sun', 'mon', 'tue', 'wed', 'thu'] },
      { direction: 'to-campus', time: '7:5', days: ['sun'] }, // malformed: ignored
    ],
    // A CMS "day only" date is stored at 12:00 UTC.
    closures: [{ from: '2026-10-01T12:00:00.000Z', to: '2026-10-01T12:00:00.000Z', reason: 'holiday' }],
  }
  // Sunday 27 Sep 2026, 08:10 in Chattogram (02:10 UTC).
  const sunday = new Date('2026-09-27T02:10:00Z')

  it('reads the Chattogram date, weekday and minute', () => {
    expect(dhakaNow(sunday)).toEqual({ date: '2026-09-27', day: 'sun', minutes: 8 * 60 + 10 })
    expect(dhakaNow(new Date('2026-09-26T18:30:00Z')).date).toBe('2026-09-27') // 00:30 local
  })

  it('lists the next trains in order, rolling over to the next day', () => {
    const next = nextDepartures(tt, 'to-campus', sunday, 3)
    expect(next.map((d) => [d.time, d.dayOffset, d.minutesUntil])).toEqual([
      ['09:00', 0, 50],
      ['13:00', 0, 290],
      ['07:30', 1, 1440 + 450 - 490],
    ])
    expect(next[1].note).toBe('late train')
  })

  it('skips Friday when the train does not run, and closed days', () => {
    // Thursday 1 Oct is closed, Friday has no trains: after Wednesday evening the next is Saturday.
    const wedEvening = new Date('2026-09-30T14:00:00Z') // 20:00 local
    const [first] = nextDepartures(tt, 'to-campus', wedEvening, 1)
    expect(first.dayOffset).toBe(3)
    expect(first.time).toBe('07:30')
    expect(closureOn(tt, '2026-10-01')?.reason).toBe('holiday')
    expect(upcomingClosures(tt, wedEvening)).toHaveLength(1)
    expect(upcomingClosures(tt, new Date('2026-10-02T02:00:00Z'))).toHaveLength(0)
  })

  it('a train leaving this minute still counts', () => {
    const [first] = nextDepartures(tt, 'to-city', new Date('2026-09-27T10:30:00Z'), 1)
    expect(first).toMatchObject({ time: '16:30', dayOffset: 0, minutesUntil: 0 })
  })
})
