import type { TaskConfig } from 'payload'

/**
 * Job config only — the Chromium renderer is loaded lazily inside the handler so it never
 * enters page bundles (payload.config is imported by server components).
 */
export const generateShareImageTask: TaskConfig<{ input: { postId: number }; output: { mediaId: number } }> = {
  slug: 'generateShareImage',
  label: 'Generate Bangla share image',
  retries: 2,
  inputSchema: [{ name: 'postId', type: 'number', required: true }],
  outputSchema: [{ name: 'mediaId', type: 'number' }],
  handler: async ({ input, req }) => {
    const { attachShareImage } = await import('./attachShareImage')
    const mediaId = await attachShareImage(req, input.postId)
    return { output: { mediaId: mediaId ?? 0 } }
  },
}
