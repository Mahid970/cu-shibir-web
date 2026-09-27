import { CONFIDENTIAL_CATEGORY, ISSUE_CATEGORIES } from '@/lib/forms/options'

export type IssueRow = { category: string; status: string; createdAt: string; resolvedAt?: string | null }

export type IssueStats = {
  total: number
  resolved: number
  open: number
  closed: number
  /** Median days from report to resolution, or null before anything is resolved. */
  medianDays: number | null
  categories: { value: string; total: number; resolved: number }[]
  /** The last six months, oldest first; `month` is the first day of the month (UTC). */
  months: { month: string; received: number; resolved: number }[]
}

const DAY = 24 * 3600 * 1000
const monthKey = (d: Date) => `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`

/**
 * The public figures on /services/issues. Spam and the confidential harassment reports are left
 * out entirely, so no figure can be subtracted from another to reveal them.
 */
export function summarise(rows: IssueRow[], now = new Date()): IssueStats {
  const counted = rows.filter((r) => r.status !== 'spam' && r.category !== CONFIDENTIAL_CATEGORY)
  const resolved = counted.filter((r) => r.status === 'resolved')
  const closed = counted.filter((r) => r.status === 'closed').length

  const days = resolved
    .filter((r) => r.resolvedAt)
    .map((r) => (Date.parse(r.resolvedAt!) - Date.parse(r.createdAt)) / DAY)
    .sort((a, b) => a - b)
  const mid = days.length >> 1
  const medianDays = days.length ? Math.max(0, Math.round(days.length % 2 ? days[mid] : (days[mid - 1] + days[mid]) / 2)) : null

  const categories = ISSUE_CATEGORIES.filter((c) => c.value !== CONFIDENTIAL_CATEGORY)
    .map((c) => ({
      value: c.value,
      total: counted.filter((r) => r.category === c.value).length,
      resolved: resolved.filter((r) => r.category === c.value).length,
    }))
    .filter((c) => c.total > 0)
    .sort((a, b) => b.total - a.total)

  const months = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() - (5 - i), 1))
    const key = monthKey(d)
    return {
      month: d.toISOString(),
      received: counted.filter((r) => monthKey(new Date(r.createdAt)) === key).length,
      resolved: resolved.filter((r) => r.resolvedAt && monthKey(new Date(r.resolvedAt)) === key).length,
    }
  })

  return { total: counted.length, resolved: resolved.length, open: counted.length - resolved.length - closed, closed, medianDays, categories, months }
}
