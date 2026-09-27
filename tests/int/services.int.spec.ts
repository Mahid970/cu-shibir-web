import { describe, expect, it } from 'vitest'

import { summarise } from '@/lib/services/issueStats'

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
