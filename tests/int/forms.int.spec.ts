import { describe, expect, it } from 'vitest'

import { recentSessions } from '@/lib/campus'
import { blindIndex, decrypt, encrypt, hashSecret, isEncrypted, randomCode, verifySecret } from '@/lib/crypto'
import { formatDate } from '@/lib/bn'
import { Checker, cleanText, normalizePhone } from '@/lib/forms/validate'

describe('field encryption', () => {
  it('round-trips Bangla text and uses a fresh IV each time', () => {
    const plain = 'পরীক্ষা ব্যবহারকারী — ০১৭১১০০০০০১'
    const a = encrypt(plain)
    const b = encrypt(plain)
    expect(isEncrypted(a)).toBe(true)
    expect(a).not.toBe(b)
    expect(a).not.toContain('পরীক্ষা')
    expect(decrypt(a)).toBe(plain)
  })

  it('rejects tampered ciphertext', () => {
    const token = encrypt('secret')
    const parts = token.split('.')
    parts[3] = Buffer.from('tampered').toString('base64url')
    expect(() => decrypt(parts.join('.'))).toThrow()
  })

  it('leaves plain values untouched', () => {
    expect(decrypt('hello')).toBe('hello')
  })

  it('blind index is stable, keyed and case-insensitive', () => {
    expect(blindIndex('01711000001')).toBe(blindIndex(' 01711000001 '))
    expect(blindIndex('A@B.com')).toBe(blindIndex('a@b.com'))
    expect(blindIndex('01711000001')).not.toBe(blindIndex('01711000002'))
    expect(blindIndex('01711000001')).toMatch(/^[0-9a-f]{40}$/)
  })
})

describe('tracking codes', () => {
  it('avoids look-alike characters', () => {
    const code = randomCode(200)
    expect(code).toHaveLength(200)
    expect(code).not.toMatch(/[01OIL]/)
  })

  it('verifies secrets case-insensitively and rejects wrong ones', () => {
    const stored = hashSecret('BX7ZHY')
    expect(verifySecret('bx7zhy', stored)).toBe(true)
    expect(verifySecret(' BX7ZHY ', stored)).toBe(true)
    expect(verifySecret('BX7ZHZ', stored)).toBe(false)
    expect(verifySecret('BX7ZHY', null)).toBe(false)
  })
})

describe('form validation', () => {
  it.each([
    ['০১৭১১-০০০০০১', '01711000001'],
    ['+8801811000002', '01811000002'],
    ['8801911 000 003', '01911000003'],
    ['01211000000', null],
    ['1711000001', null],
  ])('normalizePhone(%s) → %s', (input, expected) => {
    expect(normalizePhone(input)).toBe(expected)
  })

  it('cleans control characters and whitespace', () => {
    expect(cleanText('  নাম\u0000   লেখা\t ')).toBe('নাম লেখা')
    expect(cleanText(null)).toBe('')
  })

  it('collects Bangla error messages', () => {
    const data = new FormData()
    data.set('name', 'ক')
    data.set('mobile', '12345')
    const c = new Checker(data)
    c.text('name', { required: true, min: 3, label: 'নাম' })
    c.phone('mobile', { required: true })
    c.choice('dept', ['a', 'b'], { required: true, label: 'বিভাগ' })
    c.checked('consent', { required: true, message: 'সম্মতি দিন।' })
    expect(c.ok).toBe(false)
    expect(Object.keys(c.errors).sort()).toEqual(['consent', 'dept', 'mobile', 'name'])
    expect(c.errors.name).toContain('৩')
  })

  it('answers in English on English pages', () => {
    const data = new FormData()
    data.set('name', 'A')
    data.set('mobile', '12345')
    const c = new Checker(data, 'en')
    c.text('name', { required: true, min: 3, label: 'your name' })
    c.phone('mobile', { required: true })
    c.choice('dept', ['a', 'b'], { required: true, label: 'your department' })
    expect(c.errors.name).toBe('Please write at least 3 characters in your name.')
    expect(c.errors.mobile).toMatch(/^Enter a valid mobile number/)
    expect(c.errors.dept).toBe('Please choose your department.')
  })
})

describe('campus data', () => {
  it('lists the newest session first, a year behind the calendar', () => {
    expect(recentSessions(new Date('2026-09-26'))[0]).toEqual({ value: '2025-26', label: '২০২৫-২৬', en: '2025-26' })
    expect(recentSessions(new Date('2027-02-01'))[0].value).toBe('2025-26')
    expect(recentSessions(new Date('2027-07-15'))[0].value).toBe('2026-27')
  })
})

describe('Bangla date-time', () => {
  it('names the time of day in Bangla', () => {
    expect(formatDate('2026-09-26T13:16:00Z', { style: 'datetime' })).toBe('২৬ সেপ্টেম্বর, ২০২৬, সন্ধ্যা ৭:১৬')
  })

  it('reads naturally in English', () => {
    expect(formatDate('2026-09-26T13:16:00Z', { style: 'datetime', locale: 'en' })).toBe('26 September 2026, 7:16 pm')
  })
})
