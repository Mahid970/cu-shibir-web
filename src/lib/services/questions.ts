/** প্রশ্ন ব্যাংক (plan §6.1): shared by the CMS collection, the upload form and the browse page. */

export const EXAMS = [
  { value: 'final', label: 'বর্ষ/সেমিস্টার চূড়ান্ত', en: 'Final exam' },
  { value: 'midterm', label: 'মিডটার্ম', en: 'Midterm' },
  { value: 'incourse', label: 'ইনকোর্স / ক্লাস টেস্ট', en: 'In-course / class test' },
  { value: 'other', label: 'অন্যান্য', en: 'Other' },
] as const

export const LEVELS = [
  { value: 'y1', label: '১ম বর্ষ', en: '1st year' },
  { value: 'y2', label: '২য় বর্ষ', en: '2nd year' },
  { value: 'y3', label: '৩য় বর্ষ', en: '3rd year' },
  { value: 'y4', label: '৪র্থ বর্ষ', en: '4th year' },
  { value: 'ms', label: 'মাস্টার্স', en: 'Master’s' },
] as const

export const PAPER_TYPES = ['application/pdf', 'image/jpeg', 'image/png', 'image/webp'] as const
export const MAX_PAPER_BYTES = 10 * 1024 * 1024

/** "cse-211", "CSE211", " cse 211 " → "CSE 211". Letters and numbers split by one space. */
export function courseCode(raw: string): string {
  const compact = raw.normalize('NFKC').toUpperCase().replace(/[^A-Z0-9]/g, '')
  const m = compact.match(/^([A-Z]+)(\d+[A-Z]?)$/)
  return m ? `${m[1]} ${m[2]}` : raw.trim().toUpperCase().replace(/\s+/g, ' ')
}
