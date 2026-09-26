/** Choice lists shared by the public forms (client), the server actions and the CMS collections. */

export const SUPPORTER_INTERESTS = [
  { value: 'dawah', label: 'দাওয়াতি কাজ' },
  { value: 'study', label: 'পাঠচক্র ও আলোচনা' },
  { value: 'welfare', label: 'ছাত্রকল্যাণ ও স্বেচ্ছাসেবা' },
  { value: 'writing', label: 'লেখালেখি ও প্রকাশনা' },
  { value: 'media', label: 'ছবি, ভিডিও ও ডিজাইন' },
  { value: 'it', label: 'আইটি ও প্রযুক্তি' },
  { value: 'culture', label: 'সাহিত্য ও সংস্কৃতি' },
  { value: 'sports', label: 'খেলাধুলা' },
] as const

export const FEEDBACK_KINDS = [
  { value: 'advice', label: 'পরামর্শ' },
  { value: 'ehtesab', label: 'এহতেসাব' },
  { value: 'complaint', label: 'অভিযোগ বা সমস্যা' },
] as const

export const ASSISTANCE_TYPES = [
  { value: 'scholarship', label: 'শিক্ষাবৃত্তি' },
  { value: 'medical', label: 'চিকিৎসা সহায়তা' },
  { value: 'other', label: 'অন্যান্য সহায়তা' },
] as const

/** Pipeline shown to the applicant on the tracking page (plan §6.1). */
export const ASSISTANCE_STATUSES = [
  { value: 'submitted', label: { bn: 'জমা হয়েছে', en: 'Submitted' } },
  { value: 'review', label: { bn: 'যাচাই চলছে', en: 'Under review' } },
  { value: 'interview', label: { bn: 'সাক্ষাৎকারের জন্য নির্বাচিত', en: 'Interview' } },
  { value: 'approved', label: { bn: 'অনুমোদিত', en: 'Approved' } },
  { value: 'declined', label: { bn: 'এবার সম্ভব হয়নি', en: 'Declined' } },
] as const
