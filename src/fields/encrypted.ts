import type { FieldAccess, TextareaField, TextField } from 'payload'

import { toBnDigits } from '@/lib/bn'
import { decrypt, encrypt, isEncrypted } from '@/lib/crypto'

function safeDecrypt(value: string): string {
  try {
    return decrypt(value)
  } catch {
    return '⚠ ডিক্রিপ্ট করা যায়নি (চাবি বদলেছে?)'
  }
}

type Options = {
  name: string
  label: { bn: string; en: string }
  textarea?: boolean
  required?: boolean
  maxLength?: number
  /** Who may see the decrypted value. Collection read access still applies on top. */
  read: FieldAccess
}

/**
 * A text field stored encrypted (AES-256-GCM) in the database and decrypted only for staff whose
 * role allows reading it. Search and sort on these fields are not possible by design.
 */
export function encryptedField({ name, label, textarea = false, required = false, maxLength, read }: Options): TextField | TextareaField {
  const base = {
    name,
    label,
    required,
    access: { read },
    // Payload runs field hooks before validation, so the value here may already be ciphertext:
    // check the length of the plain text instead of using `maxLength`.
    validate: (value: unknown) => {
      const plain = typeof value === 'string' ? (isEncrypted(value) ? safeDecrypt(value) : value) : ''
      if (required && !plain) return 'এই ঘরটি পূরণ করুন'
      if (maxLength && plain.length > maxLength) return `${toBnDigits(maxLength)} অক্ষরের মধ্যে রাখুন`
      return true
    },
    admin: { description: '🔒 এনক্রিপ্ট করে সংরক্ষিত' },
    hooks: {
      beforeChange: [({ value }: { value?: unknown }) => (typeof value === 'string' && value && !isEncrypted(value) ? encrypt(value) : value)],
      afterRead: [
        ({ value }: { value?: unknown }) => (isEncrypted(value) ? safeDecrypt(value) : value),
      ],
    },
  }
  return textarea ? { ...base, type: 'textarea' } : { ...base, type: 'text' }
}
