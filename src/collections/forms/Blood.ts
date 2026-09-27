import type { CollectionConfig } from 'payload'

import { encryptedField } from '@/fields/encrypted'
import { purge } from '@/hooks/revalidate'
import { DEPARTMENTS, HALLS, NON_RESIDENT } from '@/lib/campus'
import { cmsOptions } from '@/lib/forms/options'
import { GROUP_OPTIONS } from '@/lib/services/blood'

import { FORMS_GROUP, fieldFor, formsAccess, statusField } from './shared'

const canRead = formsAccess('admin', 'blood-coordinator')
const read = fieldFor('admin', 'blood-coordinator')

/** The public page shows donor counts per group: refresh them when the list changes. */
const refreshCounts = {
  afterChange: [
    async ({ context }: { context: Record<string, unknown> }) => {
      if (!context.disableRevalidate) await purge(['blood'])
    },
  ],
  afterDelete: [
    async ({ context }: { context: Record<string, unknown> }) => {
      if (!context.disableRevalidate) await purge(['blood'])
    },
  ],
}

/**
 * রক্তদাতা: students who agreed to be called when their blood group is needed. Their numbers are
 * never shown on the site; coordinators call them and they decide. A donor manages their own entry
 * (donated today, pause, leave) with their donor id and secret code.
 */
export const BloodDonors: CollectionConfig = {
  slug: 'blood-donors',
  labels: {
    singular: { bn: 'রক্তদাতা', en: 'Blood donor' },
    plural: { bn: 'রক্তদাতা', en: 'Blood donors' },
  },
  admin: {
    useAsTitle: 'donorId',
    defaultColumns: ['donorId', 'bloodGroup', 'hall', 'available', 'lastDonation'],
    group: FORMS_GROUP,
    description:
      'অনুরোধ এলে রক্তের গ্রুপ দিয়ে ফিল্টার করুন, "এখন দিতে পারেন" টিক দেওয়া এবং শেষ রক্তদান ১২০ দিনের বেশি আগে এমন দাতাদের ফোন করুন। দাতার নম্বর কখনো অনুরোধকারীকে দেবেন না; দাতা রাজি হলে দাতাকেই অনুরোধকারীর নম্বর দিন।',
  },
  access: { read: canRead, create: () => false, update: canRead, delete: canRead },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'donorId', type: 'text', required: true, unique: true, index: true, admin: { readOnly: true }, label: { bn: 'দাতা আইডি', en: 'Donor ID' } },
        { name: 'bloodGroup', type: 'select', required: true, index: true, options: GROUP_OPTIONS, label: { bn: 'রক্তের গ্রুপ', en: 'Blood group' } },
      ],
    },
    encryptedField({ name: 'name', label: { bn: 'নাম', en: 'Name' }, required: true, maxLength: 100, read }),
    encryptedField({ name: 'mobile', label: { bn: 'মোবাইল', en: 'Mobile' }, required: true, read }),
    {
      type: 'row',
      fields: [
        { name: 'department', type: 'select', options: cmsOptions(DEPARTMENTS), label: { bn: 'বিভাগ', en: 'Department' } },
        { name: 'hall', type: 'select', options: cmsOptions([...HALLS, NON_RESIDENT]), label: { bn: 'হল', en: 'Hall' } },
      ],
    },
    {
      type: 'row',
      fields: [
        {
          name: 'lastDonation',
          type: 'date',
          index: true,
          label: { bn: 'শেষ রক্তদান', en: 'Last donation' },
          admin: { date: { pickerAppearance: 'dayOnly' } },
        },
        { name: 'available', type: 'checkbox', defaultValue: true, index: true, label: { bn: 'এখন দিতে পারেন', en: 'Available' } },
      ],
    },
    { name: 'coordinatorNote', type: 'textarea', label: { bn: 'সমন্বয়কের নোট', en: 'Coordinator note' } },
    { name: 'consentAt', type: 'date', admin: { readOnly: true, position: 'sidebar' }, label: { bn: 'সম্মতির সময়', en: 'Consent given' } },
    { name: 'secretHash', type: 'text', admin: { hidden: true }, access: { read: () => false, update: () => false } },
    { name: 'mobileHash', type: 'text', index: true, admin: { hidden: true } },
  ],
  hooks: refreshCounts,
}

export const BLOOD_REQUEST_STATUSES = [
  { value: 'new', label: { bn: 'নতুন', en: 'New' } },
  { value: 'contacting', label: { bn: 'দাতাদের সাথে যোগাযোগ চলছে', en: 'Contacting donors' } },
  { value: 'fulfilled', label: { bn: 'রক্ত পাওয়া গেছে', en: 'Fulfilled' } },
  { value: 'closed', label: { bn: 'বন্ধ', en: 'Closed' } },
] as const

/** রক্তের অনুরোধ: a patient needs blood; coordinators find willing donors. */
export const BloodRequests: CollectionConfig = {
  slug: 'blood-requests',
  labels: {
    singular: { bn: 'রক্তের অনুরোধ', en: 'Blood request' },
    plural: { bn: 'রক্তের অনুরোধ', en: 'Blood requests' },
  },
  admin: {
    useAsTitle: 'hospital',
    defaultColumns: ['bloodGroup', 'units', 'hospital', 'neededBy', 'status'],
    group: FORMS_GROUP,
  },
  access: { read: canRead, create: () => false, update: canRead, delete: formsAccess('admin') },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'bloodGroup', type: 'select', required: true, index: true, options: GROUP_OPTIONS, label: { bn: 'রোগীর রক্তের গ্রুপ', en: 'Patient’s blood group' } },
        { name: 'units', type: 'number', required: true, min: 1, max: 10, defaultValue: 1, label: { bn: 'কত ব্যাগ', en: 'Bags' } },
      ],
    },
    {
      type: 'row',
      fields: [
        { name: 'hospital', type: 'text', required: true, maxLength: 150, label: { bn: 'হাসপাতাল', en: 'Hospital' } },
        {
          name: 'neededBy',
          type: 'date',
          required: true,
          label: { bn: 'কখনের মধ্যে', en: 'Needed by' },
          admin: { date: { pickerAppearance: 'dayAndTime' } },
        },
      ],
    },
    encryptedField({ name: 'patientNote', label: { bn: 'রোগী সম্পর্কে', en: 'About the patient' }, textarea: true, maxLength: 500, read }),
    {
      type: 'row',
      fields: [
        encryptedField({ name: 'name', label: { bn: 'অনুরোধকারীর নাম', en: 'Requester’s name' }, required: true, maxLength: 100, read }),
        encryptedField({ name: 'mobile', label: { bn: 'অনুরোধকারীর মোবাইল', en: 'Requester’s mobile' }, required: true, read }),
      ],
    },
    statusField(BLOOD_REQUEST_STATUSES.map((s) => ({ ...s }))),
    { name: 'coordinatorNote', type: 'textarea', label: { bn: 'সমন্বয়কের নোট', en: 'Coordinator note' } },
  ],
}
