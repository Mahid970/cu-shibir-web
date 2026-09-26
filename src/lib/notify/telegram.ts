import 'server-only'

/**
 * Tells the branch's private Telegram group that something needs attention. Messages never contain
 * personal data — only what arrived and where to open it in the CMS. No-op unless
 * TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID are set.
 */
export async function notifyStaff(text: string): Promise<void> {
  const token = process.env.TELEGRAM_BOT_TOKEN
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID
  if (!token || !chatId) return
  try {
    await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, disable_web_page_preview: true }),
      signal: AbortSignal.timeout(5000),
    })
  } catch {
    // Notifications are best effort; the submission is already saved.
  }
}
