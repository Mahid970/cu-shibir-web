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

/** One colour per group of places, the same as the legend under the map. */
export const CATEGORY_COLORS: Record<string, string> = {
  faculty: '#1c9bd6',
  hall: '#8b5cf6',
  study: '#0ea5e9',
  health: '#e11d48',
  mosque: '#16a34a',
  transport: '#f59e0b',
  office: '#475569',
  open: '#65a30d',
}
