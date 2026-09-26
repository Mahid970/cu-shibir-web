import type { Access, FieldAccess, PayloadRequest, Where } from 'payload'

/** CMS roles — one person can hold several. See plan §6.3. */
export const ROLES = [
  { value: 'super-admin', label: { bn: 'সুপার অ্যাডমিন (আইটি)', en: 'Super admin (IT)' } },
  { value: 'admin', label: { bn: 'অ্যাডমিন (সভাপতি/সেক্রেটারি দপ্তর)', en: 'Admin (President/Secretary office)' } },
  { value: 'editor', label: { bn: 'সম্পাদক (তথ্য ও প্রচার)', en: 'Editor (publicity)' } },
  { value: 'contributor', label: { bn: 'লেখক (খসড়া)', en: 'Contributor (drafts only)' } },
  { value: 'service-desk', label: { bn: 'ছাত্র সেবা ডেস্ক', en: 'Student service desk' } },
  { value: 'scholarship-reviewer', label: { bn: 'শিক্ষাবৃত্তি পর্যালোচক', en: 'Scholarship reviewer' } },
  { value: 'blood-coordinator', label: { bn: 'রক্তদান সমন্বয়ক', en: 'Blood coordinator' } },
  { value: 'event-manager', label: { bn: 'ইভেন্ট ব্যবস্থাপক', en: 'Event manager' } },
  { value: 'volunteer', label: { bn: 'স্বেচ্ছাসেবক (চেক-ইন)', en: 'Volunteer (check-in)' } },
] as const

export type Role = (typeof ROLES)[number]['value']

type MaybeUser = { roles?: Role[] | null } | null | undefined

export const hasRole = (user: MaybeUser, ...roles: Role[]): boolean =>
  Boolean(user?.roles?.some((r) => r === 'super-admin' || roles.includes(r)))

const userOf = (req: PayloadRequest) => req.user as MaybeUser

export const isSuperAdmin: Access = ({ req }) => hasRole(userOf(req), 'super-admin')
export const isAdmin: Access = ({ req }) => hasRole(userOf(req), 'admin')
export const isLoggedIn: Access = ({ req }) => Boolean(req.user)

/** Anyone who publishes public content. */
export const canPublish: Access = ({ req }) => hasRole(userOf(req), 'admin', 'editor')

/** Contributors may create drafts; publishing is gated by `canPublish` in hooks/UI. */
export const canWriteContent: Access = ({ req }) =>
  hasRole(userOf(req), 'admin', 'editor', 'contributor')

/** Public sees only published docs; staff see drafts too. */
export const publishedOrStaff: Access = ({ req }) => {
  if (hasRole(userOf(req), 'admin', 'editor', 'contributor')) return true
  return { _status: { equals: 'published' } } satisfies Where
}

export const adminFieldOnly: FieldAccess = ({ req }) => hasRole(userOf(req), 'admin')
