/** Groups of places on the freshers' campus map, in the order the page lists them. */
export const PLACE_CATEGORIES = [
  { value: 'faculty', label: { bn: 'অনুষদ ও ইনস্টিটিউট', en: 'Faculties and institutes' } },
  { value: 'hall', label: { bn: 'হল', en: 'Halls' } },
  { value: 'study', label: { bn: 'পড়াশোনা', en: 'Study' } },
  { value: 'health', label: { bn: 'চিকিৎসা', en: 'Health' } },
  { value: 'mosque', label: { bn: 'মসজিদ', en: 'Mosques' } },
  { value: 'transport', label: { bn: 'যাতায়াত', en: 'Transport' } },
  { value: 'office', label: { bn: 'দপ্তর ও সেবা', en: 'Offices and services' } },
  { value: 'open', label: { bn: 'মাঠ ও বাগান', en: 'Fields and gardens' } },
] as const
