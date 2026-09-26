/**
 * Small, dependency-free validation for the public forms. Messages are in the page's language
 * and say how to fix the problem. Shared by the server actions and the unit tests.
 */

import { copy, type Locale } from '@/i18n/config'
import { toBnDigits, toLatinDigits } from '@/lib/bn'

const M = copy(
  {
    required: (label: string) => `${label} লিখুন।`,
    min: (label: string, n: number) => `${label} অন্তত ${toBnDigits(n)} অক্ষরের হতে হবে।`,
    max: (label: string, n: number) => `${label} ${toBnDigits(n)} অক্ষরের মধ্যে রাখুন।`,
    phoneRequired: 'মোবাইল নম্বর লিখুন।',
    phone: 'সঠিক মোবাইল নম্বর লিখুন, যেমন ০১৭১১২২২৩৩৩।',
    emailRequired: 'ইমেইল ঠিকানা লিখুন।',
    email: 'সঠিক ইমেইল ঠিকানা লিখুন।',
    choose: (label: string) => `${label} বেছে নিন।`,
    fromList: (label: string) => `${label} তালিকা থেকে বেছে নিন।`,
  },
  {
    required: (label: string) => `Please fill in ${label}.`,
    min: (label: string, n: number) => `Please write at least ${n} characters in ${label}.`,
    max: (label: string, n: number) => `Please keep ${label} under ${n} characters.`,
    phoneRequired: 'Please fill in your mobile number.',
    phone: 'Enter a valid mobile number, for example 01711222333.',
    emailRequired: 'Please fill in your email address.',
    email: 'Enter a valid email address.',
    choose: (label: string) => `Please choose ${label}.`,
    fromList: (label: string) => `Please choose ${label} from the list.`,
  },
)

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
  private m: (typeof M)[Locale]
  constructor(
    private data: FormData,
    lang: Locale = 'bn',
  ) {
    this.m = M[lang]
  }

  text(name: string, { required = false, min = 0, max = 200, label }: { required?: boolean; min?: number; max?: number; label: string }) {
    const value = cleanText(this.data.get(name), max + 1)
    if (!value) {
      if (required) this.errors[name] = this.m.required(label)
      return value
    }
    if (value.length < min) this.errors[name] = this.m.min(label, min)
    else if (value.length > max) this.errors[name] = this.m.max(label, max)
    return value.slice(0, max)
  }

  phone(name: string, { required = false }: { required?: boolean } = {}) {
    const raw = cleanText(this.data.get(name), 40)
    if (!raw) {
      if (required) this.errors[name] = this.m.phoneRequired
      return ''
    }
    const phone = normalizePhone(raw)
    if (!phone) this.errors[name] = this.m.phone
    return phone ?? ''
  }

  email(name: string, { required = false }: { required?: boolean } = {}) {
    const value = cleanText(this.data.get(name), 200).toLowerCase()
    if (!value) {
      if (required) this.errors[name] = this.m.emailRequired
      return ''
    }
    if (!isEmail(value)) this.errors[name] = this.m.email
    return value
  }

  choice<T extends string>(name: string, allowed: readonly T[], { required = false, label }: { required?: boolean; label: string }) {
    const value = cleanText(this.data.get(name), 100)
    if (!value) {
      if (required) this.errors[name] = this.m.choose(label)
      return undefined
    }
    if (!allowed.includes(value as T)) {
      this.errors[name] = this.m.fromList(label)
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
