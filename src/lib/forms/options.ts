/** Choice lists shared by the public forms (client), the server actions and the CMS collections. */

import type { Locale } from '@/i18n/config'

/** `label` is Bangla (also shown in the CMS); `en` is what English pages show. */
type Choice = { readonly value: string; readonly label: string; readonly en: string }

export const SUPPORTER_INTERESTS = [
  { value: 'dawah', label: 'দাওয়াতি কাজ', en: 'Dawah' },
  { value: 'study', label: 'পাঠচক্র ও আলোচনা', en: 'Study circles and discussions' },
  { value: 'welfare', label: 'ছাত্রকল্যাণ ও স্বেচ্ছাসেবা', en: 'Student welfare and volunteering' },
  { value: 'writing', label: 'লেখালেখি ও প্রকাশনা', en: 'Writing and publications' },
  { value: 'media', label: 'ছবি, ভিডিও ও ডিজাইন', en: 'Photos, video and design' },
  { value: 'it', label: 'আইটি ও প্রযুক্তি', en: 'IT and technology' },
  { value: 'culture', label: 'সাহিত্য ও সংস্কৃতি', en: 'Literature and culture' },
  { value: 'sports', label: 'খেলাধুলা', en: 'Sports' },
] as const

export const FEEDBACK_KINDS = [
  { value: 'advice', label: 'পরামর্শ', en: 'Advice' },
  { value: 'ehtesab', label: 'এহতেসাব', en: 'Ehtesab (constructive criticism)' },
  { value: 'complaint', label: 'অভিযোগ বা সমস্যা', en: 'A complaint or problem' },
] as const

export const ASSISTANCE_TYPES = [
  { value: 'scholarship', label: 'শিক্ষাবৃত্তি', en: 'Scholarship' },
  { value: 'medical', label: 'চিকিৎসা সহায়তা', en: 'Medical aid' },
  { value: 'other', label: 'অন্যান্য সহায়তা', en: 'Other support' },
] as const

/** Choices for a form in the page's language. */
export const choices = (list: readonly Choice[], lang: Locale) => list.map((c) => ({ value: c.value, label: lang === 'en' ? c.en : c.label }))

/** For CMS select fields: value and Bangla label only. */
export const cmsOptions = (list: readonly Choice[]) => list.map(({ value, label }) => ({ value, label }))

/** Pipeline shown to the applicant on the tracking page (plan §6.1). */
export const ASSISTANCE_STATUSES = [
  { value: 'submitted', label: { bn: 'জমা হয়েছে', en: 'Submitted' } },
  { value: 'review', label: { bn: 'যাচাই চলছে', en: 'Under review' } },
  { value: 'interview', label: { bn: 'সাক্ষাৎকারের জন্য নির্বাচিত', en: 'Interview' } },
  { value: 'approved', label: { bn: 'অনুমোদিত', en: 'Approved' } },
  { value: 'declined', label: { bn: 'এবার সম্ভব হয়নি', en: 'Declined' } },
] as const

/** ছাত্র সমস্যা ডেস্ক (plan §6.1). Harassment reports are confidential: only the harassment desk sees them. */
export const ISSUE_CATEGORIES = [
  { value: 'hall', label: 'হল ও আবাসন', en: 'Halls and housing' },
  { value: 'transport', label: 'শাটল ও যাতায়াত', en: 'Shuttle and transport' },
  { value: 'food', label: 'খাবার ও ক্যান্টিন', en: 'Food and canteens' },
  { value: 'safety', label: 'নিরাপত্তা', en: 'Safety' },
  { value: 'academic', label: 'পড়াশোনা ও সেশনজট', en: 'Studies and session delays' },
  { value: 'health', label: 'চিকিৎসা ও মেডিকেল সেন্টার', en: 'Health and the medical centre' },
  { value: 'campus', label: 'ক্যাম্পাস ও পরিবেশ', en: 'Campus and environment' },
  { value: 'harassment', label: 'হয়রানি (গোপনীয়)', en: 'Harassment (confidential)' },
  { value: 'other', label: 'অন্যান্য', en: 'Something else' },
] as const

export const CONFIDENTIAL_CATEGORY = 'harassment'

/** What the reporter sees on the tracking page. `spam` is shown to them as closed. */
export const ISSUE_STATUSES = [
  { value: 'received', label: { bn: 'জমা হয়েছে', en: 'Received' } },
  { value: 'reviewing', label: { bn: 'যাচাই চলছে', en: 'Being looked into' } },
  { value: 'forwarded', label: { bn: 'দায়িত্বপ্রাপ্তদের কাছে তোলা হয়েছে', en: 'Raised with those responsible' } },
  { value: 'resolved', label: { bn: 'সমাধান হয়েছে', en: 'Resolved' } },
  { value: 'closed', label: { bn: 'বন্ধ করা হয়েছে', en: 'Closed' } },
] as const
