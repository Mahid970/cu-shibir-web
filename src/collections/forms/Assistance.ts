import type { CollectionConfig } from 'payload'

import { encryptedField } from '@/fields/encrypted'
import { DEPARTMENTS, HALLS, NON_RESIDENT } from '@/lib/campus'
import { ASSISTANCE_STATUSES, ASSISTANCE_TYPES } from '@/lib/forms/options'

import { FORMS_GROUP, fieldFor, formsAccess, statusField } from './shared'

const canRead = formsAccess('admin', 'scholarship-reviewer')
const read = fieldFor('admin', 'scholarship-reviewer')

/** শিক্ষাবৃত্তি ও চিকিৎসা সহায়তার আবেদন, tracked with a public id + secret code. */
export const Assistance: CollectionConfig = {
  slug: 'assistance',
  labels: {
    singular: { bn: 'সহায়তার আবেদন', en: 'Assistance application' },
    plural: { bn: 'শিক্ষাবৃত্তি ও সহায়তা', en: 'Scholarship & assistance' },
  },
  admin: {
    useAsTitle: 'trackingId',
    defaultColumns: ['trackingId', 'type', 'department', 'status', 'createdAt'],
    group: FORMS_GROUP,
    description: 'আবেদনকারী ট্র্যাকিং আইডি ও গোপন কোড দিয়ে অবস্থা দেখতে পারেন। "আবেদনকারীর জন্য বার্তা" তিনি দেখতে পাবেন।',
  },
  access: { read: canRead, create: () => false, update: canRead, delete: formsAccess('admin') },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'trackingId', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true }, label: { bn: 'ট্র্যাকিং আইডি', en: 'Tracking ID' } },
        { name: 'type', type: 'select', required: true, options: [...ASSISTANCE_TYPES], label: { bn: 'আবেদনের ধরন', en: 'Type' } },
      ],
    },
    { name: 'subject', type: 'text', maxLength: 150, label: { bn: 'বিষয় (অন্যান্য হলে)', en: 'Subject (for other)' } },
    encryptedField({ name: 'name', label: { bn: 'নাম', en: 'Name' }, required: true, maxLength: 100, read }),
    {
      type: 'row',
      fields: [
        encryptedField({ name: 'mobile', label: { bn: 'মোবাইল', en: 'Mobile' }, required: true, read }),
        encryptedField({ name: 'registration', label: { bn: 'রেজিস্ট্রেশন/আইডি নম্বর', en: 'Registration / ID no.' }, read }),
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'department', type: 'select', required: true, options: DEPARTMENTS, label: { bn: 'বিভাগ', en: 'Department' } },
        { name: 'session', type: 'text', required: true, label: { bn: 'শিক্ষাবর্ষ', en: 'Session' } },
        { name: 'hall', type: 'select', options: [...HALLS, NON_RESIDENT], label: { bn: 'হল', en: 'Hall' } },
      ],
    },
    encryptedField({ name: 'details', label: { bn: 'প্রয়োজনের বিবরণ', en: 'Details' }, textarea: true, required: true, maxLength: 4000, read }),
    encryptedField({ name: 'references', label: { bn: 'রেফারেন্স (নাম ও যোগাযোগ)', en: 'References' }, textarea: true, maxLength: 600, read }),
    statusField(ASSISTANCE_STATUSES.map((s) => ({ ...s }))),
    {
      name: 'publicNote',
      type: 'textarea',
      maxLength: 600,
      label: { bn: 'আবেদনকারীর জন্য বার্তা', en: 'Message to applicant' },
      admin: { description: 'ট্র্যাকিং পাতায় আবেদনকারী এটি দেখবেন, যেমন সাক্ষাৎকারের সময় ও স্থান।' },
    },
    { name: 'staffNote', type: 'textarea', label: { bn: 'পর্যালোচকের নোট (অভ্যন্তরীণ)', en: 'Reviewer note (internal)' } },
    {
      name: 'statusHistory',
      type: 'json',
      admin: { readOnly: true, position: 'sidebar' },
      label: { bn: 'অবস্থার ইতিহাস', en: 'Status history' },
    },
    { name: 'secretHash', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
    { name: 'mobileHash', type: 'text', index: true, admin: { hidden: true } },
  ],
  hooks: {
    beforeChange: [
      // Keep a timeline of status changes for the tracking page.
      ({ data, originalDoc }) => {
        const prev = originalDoc?.status as string | undefined
        if (data.status && data.status !== prev) {
          const history = Array.isArray(originalDoc?.statusHistory) ? originalDoc.statusHistory : []
          data.statusHistory = [...history, { status: data.status, at: new Date().toISOString() }]
        }
        return data
      },
    ],
  },
}
