import { createCipheriv, createDecipheriv, createHmac, hkdfSync, randomBytes, randomInt, scryptSync, timingSafeEqual } from 'node:crypto'

/**
 * Field-level encryption for personal data submitted through the public forms (plan §6.3).
 *
 * - AES-256-GCM, a fresh 96-bit IV per value, stored as `v1.<iv>.<tag>.<ciphertext>` (base64url).
 * - The key comes from FIELD_ENCRYPTION_KEY (32 bytes, hex or base64). Development falls back to a key
 *   derived from PAYLOAD_SECRET so the site runs without extra setup; production refuses to start
 *   encrypting without a dedicated key.
 * - `blindIndex()` is a keyed hash for equality lookups (e.g. "has this phone number already applied?")
 *   without storing the number in the clear.
 */

const PREFIX = 'v1.'

let cachedKeys: { enc: Buffer; mac: Buffer } | null = null

function parseKey(raw: string): Buffer {
  const trimmed = raw.trim()
  const buf = /^[0-9a-f]{64}$/i.test(trimmed) ? Buffer.from(trimmed, 'hex') : Buffer.from(trimmed, 'base64')
  if (buf.length !== 32) throw new Error('FIELD_ENCRYPTION_KEY must be 32 bytes (64 hex chars or base64)')
  return buf
}

function keys() {
  if (cachedKeys) return cachedKeys
  const configured = process.env.FIELD_ENCRYPTION_KEY
  let master: Buffer
  if (configured) {
    master = parseKey(configured)
  } else {
    if (process.env.NODE_ENV === 'production') {
      throw new Error('FIELD_ENCRYPTION_KEY is not set. Generate one: openssl rand -hex 32')
    }
    const secret = process.env.PAYLOAD_SECRET
    if (!secret) throw new Error('PAYLOAD_SECRET or FIELD_ENCRYPTION_KEY is required')
    master = Buffer.from(hkdfSync('sha256', secret, 'cushibir-dev', 'field-encryption', 32))
  }
  // Separate sub-keys so the lookup hash can never be used to attack the cipher, or vice versa.
  cachedKeys = {
    enc: Buffer.from(hkdfSync('sha256', master, '', 'aes-256-gcm/v1', 32)),
    mac: Buffer.from(hkdfSync('sha256', master, '', 'blind-index/v1', 32)),
  }
  return cachedKeys
}

export const isEncrypted = (value: unknown): value is string => typeof value === 'string' && value.startsWith(PREFIX)

export function encrypt(plain: string): string {
  const iv = randomBytes(12)
  const cipher = createCipheriv('aes-256-gcm', keys().enc, iv)
  const ct = Buffer.concat([cipher.update(plain, 'utf8'), cipher.final()])
  const tag = cipher.getAuthTag()
  return PREFIX + [iv, tag, ct].map((b) => b.toString('base64url')).join('.')
}

export function decrypt(token: string): string {
  if (!isEncrypted(token)) return token
  const [iv, tag, ct] = token.slice(PREFIX.length).split('.').map((p) => Buffer.from(p, 'base64url'))
  const decipher = createDecipheriv('aes-256-gcm', keys().enc, iv)
  decipher.setAuthTag(tag)
  return Buffer.concat([decipher.update(ct), decipher.final()]).toString('utf8')
}

/** Deterministic keyed hash of a normalised value, for duplicate checks. */
export function blindIndex(value: string): string {
  return createHmac('sha256', keys().mac).update(value.normalize('NFC').trim().toLowerCase()).digest('hex').slice(0, 40)
}

// ---------------------------------------------------------------------------
// Tracking codes for applications (public id + secret code, checked like a password)
// ---------------------------------------------------------------------------

// No 0/O, 1/I/L: codes are read aloud and typed on phones.
const ALPHABET = '23456789ABCDEFGHJKMNPQRSTUVWXYZ'

export function randomCode(length: number): string {
  return Array.from({ length }, () => ALPHABET[randomInt(ALPHABET.length)]).join('')
}

export function hashSecret(secret: string): string {
  const salt = randomBytes(16)
  const hash = scryptSync(secret.toUpperCase(), salt, 32)
  return `s1.${salt.toString('base64url')}.${hash.toString('base64url')}`
}

export function verifySecret(secret: string, stored: string | null | undefined): boolean {
  if (!stored?.startsWith('s1.')) return false
  const [, salt, hash] = stored.split('.')
  const expected = Buffer.from(hash, 'base64url')
  const actual = scryptSync(secret.trim().toUpperCase(), Buffer.from(salt, 'base64url'), expected.length)
  return timingSafeEqual(actual, expected)
}
