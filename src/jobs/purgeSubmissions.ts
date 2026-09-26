import type { TaskConfig } from 'payload'

const YEAR_MS = 365 * 24 * 60 * 60 * 1000

/**
 * Retention policy promised on /privacy: form submissions that are finished (closed, answered,
 * approved or declined) are deleted one year after their last update. Runs daily at 03:00 Dhaka.
 */
export const purgeSubmissionsTask: TaskConfig<{ input: Record<string, never>; output: { deleted: number } }> = {
  slug: 'purgeSubmissions',
  label: 'Delete finished form submissions after one year',
  retries: 1,
  schedule: [{ cron: '0 0 21 * * *', queue: 'default' }], // 21:00 UTC = 03:00 Asia/Dhaka
  handler: async ({ req }) => {
    const before = new Date(Date.now() - YEAR_MS).toISOString()
    const targets = [
      { collection: 'supporters', statuses: ['closed'] },
      { collection: 'feedback', statuses: ['answered', 'closed'] },
      { collection: 'assistance', statuses: ['approved', 'declined'] },
    ] as const
    let deleted = 0
    for (const { collection, statuses } of targets) {
      const result = await req.payload.delete({
        collection,
        where: { and: [{ status: { in: statuses } }, { updatedAt: { less_than: before } }] },
        overrideAccess: true,
        req,
      })
      deleted += result.docs.length
    }
    if (deleted) req.payload.logger.info(`purgeSubmissions: deleted ${deleted} finished submissions older than a year`)
    return { output: { deleted } }
  },
}
