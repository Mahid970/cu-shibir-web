import type { CollectionConfig } from 'payload'

import { encryptedField } from '@/fields/encrypted'
import { DEPARTMENTS, HALLS, NON_RESIDENT } from '@/lib/campus'

import { SUPPORTER_INTERESTS } from '@/lib/forms/options'

import { FORMS_GROUP, fieldFor, formsAccess, statusField } from './shared'

const canRead = formsAccess('admin')
const read = fieldFor('admin')

/**
 * সমর্থক ফরম. Only what the branch needs to get in touch: the legacy form's parents' names,
 * district and thana are deliberately not collected (plan §6.3, data minimisation).
 * Submissions arrive only through the site's server action; the REST API cannot create them.
 */
export const Supporters: CollectionConfig = {
  slug: 'supporters',
  labels: { singular: { bn: 'সমর্থক', en: 'Supporter' }, plural: { bn: 'সমর্থক ফরম', en: 'Supporter sign-ups' } },
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'department', 'session', 'status', 'createdAt'],
    group: FORMS_GROUP,
    description: 'ওয়েবসাইটের সমর্থক ফরম থেকে আসা তথ্য। নাম ও যোগাযোগের তথ্য এনক্রিপ্ট করা থাকে।',
  },
  access: { read: canRead, create: () => false, update: canRead, delete: canRead },
  defaultSort: '-createdAt',
  fields: [
    encryptedField({ name: 'name', label: { bn: 'নাম', en: 'Name' }, required: true, maxLength: 100, read }),
    {
      type: 'row',
      fields: [
        encryptedField({ name: 'mobile', label: { bn: 'মোবাইল', en: 'Mobile' }, required: true, read }),
        encryptedField({ name: 'email', label: { bn: 'ইমেইল', en: 'Email' }, read }),
      ],
    },
    encryptedField({ name: 'facebook', label: { bn: 'ফেসবুক প্রোফাইল', en: 'Facebook profile' }, read }),
    {
      type: 'row',
      fields: [
        { name: 'department', type: 'select', required: true, options: DEPARTMENTS, label: { bn: 'বিভাগ', en: 'Department' } },
        { name: 'session', type: 'text', required: true, label: { bn: 'শিক্ষাবর্ষ', en: 'Session' } },
        { name: 'hall', type: 'select', options: [...HALLS, NON_RESIDENT], label: { bn: 'হল', en: 'Hall' } },
      ],
    },
    {
      name: 'interests',
      type: 'select',
      hasMany: true,
      options: [...SUPPORTER_INTERESTS],
      label: { bn: 'যে কাজে আগ্রহী', en: 'Interested in' },
    },
    encryptedField({ name: 'note', label: { bn: 'আবেদনকারীর বার্তা', en: 'Message' }, textarea: true, maxLength: 1000, read }),
    statusField([
      { value: 'new', label: { bn: 'নতুন', en: 'New' } },
      { value: 'contacted', label: { bn: 'যোগাযোগ হয়েছে', en: 'Contacted' } },
      { value: 'active', label: { bn: 'সক্রিয় সমর্থক', en: 'Active supporter' } },
      { value: 'closed', label: { bn: 'বন্ধ', en: 'Closed' } },
    ]),
    { name: 'staffNote', type: 'textarea', label: { bn: 'দায়িত্বশীলের নোট (অভ্যন্তরীণ)', en: 'Staff note (internal)' } },
    { name: 'consentAt', type: 'date', admin: { readOnly: true, position: 'sidebar' }, label: { bn: 'সম্মতি দেওয়ার সময়', en: 'Consent given at' } },
    { name: 'mobileHash', type: 'text', index: true, admin: { hidden: true } },
  ],
}
