import 'server-only'

import { headers } from 'next/headers'

import { HONEYPOT_NAME, STARTED_NAME } from './names'

/**
 * Anti-abuse checks shared by every public form:
 * - a honeypot field that people never see (bots fill it),
 * - a minimum fill time, stamped by the browser when the form becomes interactive,
 * - a per-IP rate limit (in memory: the site runs as one process on one VPS),
 * - Cloudflare Turnstile, only when TURNSTILE_SECRET_KEY is configured.
 */

const MIN_FILL_MS = 3_000
const MAX_FILL_MS = 6 * 60 * 60 * 1000

type Bucket = { count: number; resetAt: number }
const buckets = new Map<string, Bucket>()

export async function clientIp(): Promise<string> {
  const h = await headers()
  return (
    h.get('cf-connecting-ip') ||
    h.get('x-real-ip') ||
    h.get('x-forwarded-for')?.split(',')[0]?.trim() ||
    'unknown'
  )
}

/** Fixed-window limit: `limit` submissions per `windowMs` for each (form, IP) pair. */
export function rateLimit(key: string, limit: number, windowMs: number): boolean {
  const now = Date.now()
  if (buckets.size > 5000) {
    for (const [k, b] of buckets) if (b.resetAt < now) buckets.delete(k)
  }
  const bucket = buckets.get(key)
  if (!bucket || bucket.resetAt < now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs })
    return true
  }
  bucket.count += 1
  return bucket.count <= limit
}

async function verifyTurnstile(token: string, ip: string): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY
  if (!secret) return true
  if (!token) return false
  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret, response: token, remoteip: ip }),
      signal: AbortSignal.timeout(8000),
    })
    const body = (await res.json()) as { success?: boolean }
    return body.success === true
  } catch {
    return false
  }
}

export type GuardResult = { ok: true; ip: string } | { ok: false; silent: boolean; message: string }

/**
 * Run before touching the database. `silent` failures (honeypot, too fast) pretend to succeed so
 * bots learn nothing; the others show the visitor a message.
 */
export async function guard(
  form: string,
  data: FormData,
  { limit = 5, windowMs = 15 * 60 * 1000, minFillMs = MIN_FILL_MS } = {},
): Promise<GuardResult> {
  const ip = await clientIp()
  const trap = data.get(HONEYPOT_NAME)
  if (typeof trap === 'string' && trap.trim() !== '') return { ok: false, silent: true, message: '' }

  const started = Number(data.get(STARTED_NAME))
  const elapsed = Date.now() - started
  if (!started || elapsed < minFillMs || elapsed > MAX_FILL_MS) {
    return { ok: false, silent: !started || elapsed < minFillMs, message: 'ফরমটি অনেকক্ষণ খোলা ছিল। পাতাটি রিলোড করে আবার জমা দিন।' }
  }

  if (!rateLimit(`${form}:${ip}`, limit, windowMs)) {
    return { ok: false, silent: false, message: 'অল্প সময়ে অনেকবার জমা পড়েছে। ১৫ মিনিট পর আবার চেষ্টা করুন।' }
  }

  const token = data.get('cf-turnstile-response')
  if (!(await verifyTurnstile(typeof token === 'string' ? token : '', ip))) {
    return { ok: false, silent: false, message: 'মানুষ যাচাই সম্পন্ন হয়নি। বক্সে টিক দিয়ে আবার জমা দিন।' }
  }
  return { ok: true, ip }
}
