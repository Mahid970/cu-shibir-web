import type { CollectionConfig } from 'payload'

import { hasRole } from '@/access'
import { purge } from '@/hooks/revalidate'
import { DEPARTMENTS } from '@/lib/campus'
import { cmsOptions } from '@/lib/forms/options'
import { courseCode, EXAMS, LEVELS, PAPER_TYPES } from '@/lib/services/questions'

const moderator = (user: unknown) => hasRole(user as never, 'admin', 'editor', 'service-desk')

/**
 * প্রশ্ন ব্যাংক: past exam papers students upload. Nothing is public until a moderator approves
 * it; the files of unapproved papers are not served either (Payload checks read access).
 */
export const QuestionPapers: CollectionConfig = {
  slug: 'question-papers',
  labels: {
    singular: { bn: 'প্রশ্নপত্র', en: 'Question paper' },
    plural: { bn: 'প্রশ্ন ব্যাংক', en: 'Question bank' },
  },
  admin: {
    useAsTitle: 'courseCode',
    defaultColumns: ['courseCode', 'department', 'examYear', 'exam', 'status', 'createdAt'],
    group: { bn: 'শিক্ষার্থী সেবা', en: 'Student services' },
    description:
      'শিক্ষার্থীদের পাঠানো প্রশ্নপত্র। ফাইল খুলে দেখুন: শুধু আগের পরীক্ষার প্রশ্ন বা নিজের তৈরি নোট অনুমোদন করুন, কোনো বই বা কপিরাইটযুক্ত লেখা নয়। তথ্য ঠিক করে "অনুমোদিত" করলে সাইটে দেখাবে।',
  },
  access: {
    read: ({ req }) => (moderator(req.user) ? true : { status: { equals: 'approved' } }),
    create: ({ req }) => moderator(req.user),
    update: ({ req }) => moderator(req.user),
    delete: ({ req }) => moderator(req.user),
  },
  defaultSort: '-createdAt',
  upload: {
    // Inside the media volume, so backups and the Docker image need nothing new.
    staticDir: 'media/questions',
    mimeTypes: [...PAPER_TYPES],
  },
  fields: [
    {
      type: 'row',
      fields: [
        { name: 'department', type: 'select', required: true, index: true, options: cmsOptions(DEPARTMENTS), label: { bn: 'বিভাগ', en: 'Department' } },
        {
          name: 'courseCode',
          type: 'text',
          required: true,
          index: true,
          maxLength: 20,
          label: { bn: 'কোর্স কোড', en: 'Course code' },
          hooks: { beforeValidate: [({ value }) => (typeof value === 'string' ? courseCode(value) : value)] },
        },
      ],
    },
    { name: 'courseTitle', type: 'text', maxLength: 150, label: { bn: 'কোর্সের নাম', en: 'Course title' } },
    {
      type: 'row',
      fields: [
        { name: 'examYear', type: 'number', required: true, min: 1990, max: 2100, index: true, label: { bn: 'পরীক্ষার সাল', en: 'Exam year' } },
        { name: 'exam', type: 'select', required: true, defaultValue: 'final', options: cmsOptions(EXAMS), label: { bn: 'পরীক্ষা', en: 'Exam' } },
        { name: 'level', type: 'select', options: cmsOptions(LEVELS), label: { bn: 'বর্ষ', en: 'Year of study' } },
      ],
    },
    {
      name: 'status',
      type: 'select',
      required: true,
      defaultValue: 'pending',
      index: true,
      options: [
        { value: 'pending', label: { bn: 'যাচাইয়ের অপেক্ষায়', en: 'Waiting for review' } },
        { value: 'approved', label: { bn: 'অনুমোদিত (সাইটে দেখায়)', en: 'Approved (shown)' } },
        { value: 'rejected', label: { bn: 'বাতিল', en: 'Rejected' } },
      ],
      admin: { position: 'sidebar' },
      label: { bn: 'অবস্থা', en: 'Status' },
    },
    { name: 'moderatorNote', type: 'textarea', admin: { position: 'sidebar' }, label: { bn: 'যাচাইকারীর নোট', en: 'Moderator note' } },
  ],
  hooks: {
    afterChange: [
      async ({ context }) => {
        if (!context.disableRevalidate) await purge(['questions'])
      },
    ],
    afterDelete: [
      async ({ context }) => {
        if (!context.disableRevalidate) await purge(['questions'])
      },
    ],
  },
}
