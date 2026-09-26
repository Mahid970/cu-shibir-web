import type { CollectionConfig } from 'payload'

import { encryptedField } from '@/fields/encrypted'
import { FEEDBACK_KINDS } from '@/lib/forms/options'

import { FORMS_GROUP, fieldFor, formsAccess, statusField } from './shared'

const canRead = formsAccess('admin')
const read = fieldFor('admin')

/** এহতেসাব, পরামর্শ ও অভিযোগ — can be sent without a name. */
export const Feedback: CollectionConfig = {
  slug: 'feedback',
  labels: { singular: { bn: 'এহতেসাব/পরামর্শ', en: 'Feedback' }, plural: { bn: 'এহতেসাব ও পরামর্শ', en: 'Feedback' } },
  admin: {
    useAsTitle: 'subject',
    defaultColumns: ['subject', 'kind', 'about', 'status', 'createdAt'],
    group: FORMS_GROUP,
    description: 'বার্তা ও পরিচয় এনক্রিপ্ট করা থাকে। নাম ছাড়া পাঠানো বার্তায় প্রেরকের কোনো তথ্য সংরক্ষণ করা হয় না।',
  },
  access: { read: canRead, create: () => false, update: canRead, delete: canRead },
  defaultSort: '-createdAt',
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'kind', type: 'select', required: true, options: [...FEEDBACK_KINDS], label: { bn: 'ধরন', en: 'Kind' } },
        {
          name: 'about',
          type: 'relationship',
          relationTo: 'people',
          label: { bn: 'যাঁর উদ্দেশে', en: 'Addressed to' },
          admin: { description: 'খালি থাকলে পুরো শাখার উদ্দেশে' },
        },
      ],
    },
    { name: 'subject', type: 'text', required: true, maxLength: 150, label: { bn: 'বিষয়', en: 'Subject' } },
    encryptedField({ name: 'message', label: { bn: 'বার্তা', en: 'Message' }, textarea: true, required: true, maxLength: 4000, read }),
    { name: 'anonymous', type: 'checkbox', admin: { readOnly: true }, label: { bn: 'নাম ছাড়া পাঠানো', en: 'Sent anonymously' } },
    {
      type: 'row',
      fields: [
        encryptedField({ name: 'name', label: { bn: 'প্রেরকের নাম', en: 'Sender name' }, maxLength: 100, read }),
        encryptedField({ name: 'contact', label: { bn: 'উত্তর দেওয়ার ঠিকানা', en: 'Reply to' }, read }),
      ],
    },
    statusField([
      { value: 'new', label: { bn: 'নতুন', en: 'New' } },
      { value: 'in-review', label: { bn: 'বিবেচনাধীন', en: 'In review' } },
      { value: 'answered', label: { bn: 'উত্তর দেওয়া হয়েছে', en: 'Answered' } },
      { value: 'closed', label: { bn: 'বন্ধ', en: 'Closed' } },
    ]),
    { name: 'staffNote', type: 'textarea', label: { bn: 'দায়িত্বশীলের নোট (অভ্যন্তরীণ)', en: 'Staff note (internal)' } },
  ],
}
