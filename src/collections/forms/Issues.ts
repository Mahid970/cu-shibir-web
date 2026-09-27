import type { Access, CollectionConfig, FieldAccess, Where } from 'payload'

import { hasRole, type Role } from '@/access'
import { encryptedField } from '@/fields/encrypted'
import { purge } from '@/hooks/revalidate'
import { HALLS, NON_RESIDENT } from '@/lib/campus'
import { CONFIDENTIAL_CATEGORY, ISSUE_CATEGORIES, ISSUE_STATUSES, cmsOptions } from '@/lib/forms/options'

import { FORMS_GROUP, statusField } from './shared'

type MaybeUser = { roles?: Role[] | null } | null | undefined

/**
 * The service desk handles everyday problems; harassment reports go only to the harassment desk
 * (and the super-admin). A person with both roles sees everything.
 */
const scope = (user: MaybeUser): boolean | Where => {
  const desk = hasRole(user, 'admin', 'service-desk')
  const safety = hasRole(user, 'safety-desk')
  if (desk && safety) return true
  if (desk) return { category: { not_equals: CONFIDENTIAL_CATEGORY } }
  if (safety) return { category: { equals: CONFIDENTIAL_CATEGORY } }
  return false
}

const canRead: Access = ({ req }) => scope(req.user as MaybeUser)
const read: FieldAccess = ({ req, doc }) => {
  const s = scope(req.user as MaybeUser)
  if (s === true || s === false) return s
  // Field access also runs per document: the same split as the collection.
  const confidential = doc?.category === CONFIDENTIAL_CATEGORY
  return hasRole(req.user as MaybeUser, 'safety-desk') ? confidential : !confidential
}

/** ছাত্র সমস্যা ডেস্ক: problems students report, tracked with a public id + secret code (plan §6.1). */
export const Issues: CollectionConfig = {
  slug: 'issues',
  labels: {
    singular: { bn: 'ছাত্র সমস্যা', en: 'Student issue' },
    plural: { bn: 'ছাত্র সমস্যা ডেস্ক', en: 'Student issues desk' },
  },
  admin: {
    useAsTitle: 'trackingId',
    defaultColumns: ['trackingId', 'category', 'hall', 'status', 'createdAt'],
    group: FORMS_GROUP,
    description:
      'শিক্ষার্থী ট্র্যাকিং আইডি ও গোপন কোড দিয়ে অবস্থা দেখতে পারেন, "শিক্ষার্থীর জন্য বার্তা"সহ। হয়রানির অভিযোগ শুধু হয়রানি ডেস্ক দেখতে পারে। পরিসংখ্যান (বিষয়ভিত্তিক সংখ্যা, সমাধানের হার) সবার জন্য প্রকাশিত হয়, কোনো ব্যক্তিগত তথ্য ছাড়া।',
  },
  access: { read: canRead, create: () => false, update: canRead, delete: ({ req }) => hasRole(req.user as MaybeUser, 'admin') },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'trackingId', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true }, label: { bn: 'ট্র্যাকিং আইডি', en: 'Tracking ID' } },
        { name: 'category', type: 'select', required: true, index: true, options: cmsOptions(ISSUE_CATEGORIES), label: { bn: 'বিষয়', en: 'Category' } },
        { name: 'hall', type: 'select', options: cmsOptions([...HALLS, NON_RESIDENT]), label: { bn: 'হল', en: 'Hall' } },
      ],
    },
    encryptedField({ name: 'subject', label: { bn: 'সংক্ষেপে সমস্যা', en: 'Problem in brief' }, required: true, maxLength: 150, read }),
    encryptedField({ name: 'details', label: { bn: 'বিস্তারিত', en: 'Details' }, textarea: true, required: true, maxLength: 4000, read }),
    encryptedField({ name: 'place', label: { bn: 'কোথায়', en: 'Where' }, maxLength: 150, read }),
    {
      name: 'anonymous',
      type: 'checkbox',
      defaultValue: false,
      label: { bn: 'নাম ছাড়া জমা', en: 'Sent anonymously' },
      admin: { readOnly: true },
    },
    {
      type: 'row',
      fields: [
        encryptedField({ name: 'name', label: { bn: 'নাম', en: 'Name' }, maxLength: 100, read }),
        encryptedField({ name: 'contact', label: { bn: 'যোগাযোগ', en: 'Contact' }, maxLength: 200, read }),
      ],
    },
    statusField([...ISSUE_STATUSES.map((s) => ({ ...s })), { value: 'spam', label: { bn: 'স্প্যাম / অপ্রাসঙ্গিক', en: 'Spam / not relevant' } }]),
    {
      name: 'publicNote',
      type: 'textarea',
      maxLength: 600,
      label: { bn: 'শিক্ষার্থীর জন্য বার্তা', en: 'Message to the student' },
      admin: { description: 'ট্র্যাকিং পাতায় শিক্ষার্থী এটি দেখবেন, যেমন কী পদক্ষেপ নেওয়া হয়েছে।' },
    },
    { name: 'staffNote', type: 'textarea', label: { bn: 'ডেস্কের নোট (অভ্যন্তরীণ)', en: 'Desk note (internal)' } },
    { name: 'resolvedAt', type: 'date', index: true, admin: { readOnly: true, position: 'sidebar' }, label: { bn: 'সমাধানের তারিখ', en: 'Resolved on' } },
    {
      name: 'statusHistory',
      type: 'json',
      admin: { readOnly: true, position: 'sidebar' },
      label: { bn: 'অবস্থার ইতিহাস', en: 'Status history' },
    },
    { name: 'secretHash', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
  ],
  hooks: {
    beforeChange: [
      ({ data, originalDoc }) => {
        const prev = originalDoc?.status as string | undefined
        if (data.status && data.status !== prev) {
          const history = Array.isArray(originalDoc?.statusHistory) ? originalDoc.statusHistory : []
          data.statusHistory = [...history, { status: data.status, at: new Date().toISOString() }]
          // The public dashboard measures how long problems take to resolve.
          data.resolvedAt = data.status === 'resolved' ? new Date().toISOString() : null
        }
        return data
      },
    ],
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await purge(['issues'])
      },
    ],
    afterDelete: [
      async ({ context }) => {
        if (!context.disableRevalidate) await purge(['issues'])
      },
    ],
  },
}
