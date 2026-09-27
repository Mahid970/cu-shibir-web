/** রক্তদাতা নেটওয়ার্ক (plan §6.1): blood groups, who can give to whom, and when a donor can give again. */

export const BLOOD_GROUPS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'] as const
export type BloodGroup = (typeof BLOOD_GROUPS)[number]

/** Groups stored as enum-safe values (Postgres enums can't hold "+"). */
export const GROUP_VALUES: Record<BloodGroup, string> = {
  'A+': 'a_pos', 'A-': 'a_neg', 'B+': 'b_pos', 'B-': 'b_neg', 'AB+': 'ab_pos', 'AB-': 'ab_neg', 'O+': 'o_pos', 'O-': 'o_neg',
}
export const groupOf = (value: string): BloodGroup | undefined => BLOOD_GROUPS.find((g) => GROUP_VALUES[g] === value)
export const GROUP_OPTIONS = BLOOD_GROUPS.map((g) => ({ value: GROUP_VALUES[g], label: g }))

/** Red-cell compatibility: donors whose blood a patient of each group can receive. */
const CAN_RECEIVE: Record<BloodGroup, BloodGroup[]> = {
  'O-': ['O-'],
  'O+': ['O+', 'O-'],
  'A-': ['A-', 'O-'],
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'AB+': [...BLOOD_GROUPS],
}
export const donorsFor = (patient: BloodGroup): BloodGroup[] => CAN_RECEIVE[patient]

/** Whole-blood donors wait about four months between donations. */
export const DONATION_GAP_DAYS = 120

/** Can this donor give on `now`? Never donated (or unknown) counts as eligible. */
export function eligible(lastDonation: string | null | undefined, now = new Date()): boolean {
  if (!lastDonation) return true
  return now.getTime() - Date.parse(lastDonation) >= DONATION_GAP_DAYS * 86400000
}

/** The first day the donor can give again. */
export const nextEligible = (lastDonation: string) => new Date(Date.parse(lastDonation) + DONATION_GAP_DAYS * 86400000)
