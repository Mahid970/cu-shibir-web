/** Shared between the CMS config and the site (keeps collection code out of page bundles). */
export const POST_CATEGORIES = [
  { value: 'news', label: { bn: 'সংবাদ', en: 'News' } },
  { value: 'statement', label: { bn: 'বিবৃতি', en: 'Statement' } },
  { value: 'press-conference', label: { bn: 'সংবাদ সম্মেলন', en: 'Press conference' } },
  { value: 'article', label: { bn: 'প্রবন্ধ', en: 'Article' } },
  { value: 'book-review', label: { bn: 'বুক রিভিউ', en: 'Book review' } },
  { value: 'organisation', label: { bn: 'সংগঠন', en: 'Organisation' } },
  { value: 'welfare', label: { bn: 'ছাত্র কল্যাণ', en: 'Student welfare' } },
  { value: 'education', label: { bn: 'শিক্ষা ও ক্যারিয়ার', en: 'Education & career' } },
] as const

export type PostCategory = (typeof POST_CATEGORIES)[number]['value']

export const categoryLabel = (value: string, locale: 'bn' | 'en' = 'bn') =>
  POST_CATEGORIES.find((c) => c.value === value)?.label[locale] ?? value

/** Statements and press conferences are the branch's public positions — shown in red. */
export const isUrgentCategory = (value: string) => value === 'statement' || value === 'press-conference'
