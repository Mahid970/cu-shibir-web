import type { Access, FieldAccess, SelectField } from 'payload'

import { hasRole, type Role } from '@/access'

export const FORMS_GROUP = { bn: 'ফরম ও আবেদন', en: 'Forms & applications' }

/** Collection access for form submissions: only the listed roles (super-admin always). */
export const formsAccess =
  (...roles: Role[]): Access =>
  ({ req }) =>
    hasRole(req.user as never, ...roles)

/** Field access for decrypted personal data. */
export const fieldFor =
  (...roles: Role[]): FieldAccess =>
  ({ req }) =>
    hasRole(req.user as never, ...roles)

type Label = { bn: string; en: string }

export function statusField(options: { value: string; label: Label }[]): SelectField {
  return {
    name: 'status',
    type: 'select',
    required: true,
    defaultValue: options[0].value,
    options,
    index: true,
    admin: { position: 'sidebar' },
    label: { bn: 'অবস্থা', en: 'Status' },
  }
}
