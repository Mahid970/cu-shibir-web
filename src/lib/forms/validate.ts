/**
 * Small, dependency-free validation for the public forms. Messages are Bangla and say how to fix
 * the problem. Shared by the server actions and the unit tests.
 */

import { toBnDigits, toLatinDigits } from '@/lib/bn'

export type FieldErrors = Record<string, string>

/** Collapse whitespace, drop control characters, NFC-normalise. */
export function cleanText(value: FormDataEntryValue | null | undefined, max = 2000): string {
  if (typeof value !== 'string') return ''
  return value
    .normalize('NFC')
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, '')
    .replace(/[ \t]+/g, ' ')
    .trim()
    .slice(0, max)
}

/**
 * Bangladeshi mobile numbers in any common form (০১৭১১-২২২৩৩৩, +8801711222333, 8801711222333)
 * become 01711222333. Returns null if it isn't a valid mobile number.
 */
export function normalizePhone(value: string): string | null {
  const digits = toLatinDigits(value).replace(/[^\d+]/g, '').replace(/^\+?880/, '0')
  return /^01[3-9]\d{8}$/.test(digits) ? digits : null
}

export function isEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value) && value.length <= 200
}

export function isHttpUrl(value: string): boolean {
  try {
    const u = new URL(value)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

/** Collects errors while reading fields, so each form reads top to bottom. */
export class Checker {
  errors: FieldErrors = {}
  constructor(private data: FormData) {}

  text(name: string, { required = false, min = 0, max = 200, label }: { required?: boolean; min?: number; max?: number; label: string }) {
    const value = cleanText(this.data.get(name), max + 1)
    if (!value) {
      if (required) this.errors[name] = `${label} লিখুন।`
      return value
    }
    if (value.length < min) this.errors[name] = `${label} অন্তত ${toBnDigits(min)} অক্ষরের হতে হবে।`
    else if (value.length > max) this.errors[name] = `${label} ${toBnDigits(max)} অক্ষরের মধ্যে রাখুন।`
    return value.slice(0, max)
  }

  phone(name: string, { required = false }: { required?: boolean } = {}) {
    const raw = cleanText(this.data.get(name), 40)
    if (!raw) {
      if (required) this.errors[name] = 'মোবাইল নম্বর লিখুন।'
      return ''
    }
    const phone = normalizePhone(raw)
    if (!phone) this.errors[name] = 'সঠিক মোবাইল নম্বর লিখুন, যেমন ০১৭১১২২২৩৩৩।'
    return phone ?? ''
  }

  email(name: string, { required = false }: { required?: boolean } = {}) {
    const value = cleanText(this.data.get(name), 200).toLowerCase()
    if (!value) {
      if (required) this.errors[name] = 'ইমেইল ঠিকানা লিখুন।'
      return ''
    }
    if (!isEmail(value)) this.errors[name] = 'সঠিক ইমেইল ঠিকানা লিখুন।'
    return value
  }

  choice<T extends string>(name: string, allowed: readonly T[], { required = false, label }: { required?: boolean; label: string }) {
    const value = cleanText(this.data.get(name), 100)
    if (!value) {
      if (required) this.errors[name] = `${label} বেছে নিন।`
      return undefined
    }
    if (!allowed.includes(value as T)) {
      this.errors[name] = `${label} তালিকা থেকে বেছে নিন।`
      return undefined
    }
    return value as T
  }

  many<T extends string>(name: string, allowed: readonly T[]) {
    return this.data
      .getAll(name)
      .filter((v): v is T => typeof v === 'string' && allowed.includes(v as T))
      .slice(0, allowed.length)
  }

  checked(name: string, { required = false, message }: { required?: boolean; message: string }) {
    const on = this.data.get(name) === 'on' || this.data.get(name) === 'true'
    if (required && !on) this.errors[name] = message
    return on
  }

  get ok() {
    return Object.keys(this.errors).length === 0
  }
}
