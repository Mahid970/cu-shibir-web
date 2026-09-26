import type { FieldErrors } from './validate'

export type FormState = {
  status: 'idle' | 'error' | 'success'
  message?: string
  errors?: FieldErrors
  /** Assistance applications: shown once, the applicant must note them down. */
  tracking?: { id: string; code: string }
}

export const initialFormState: FormState = { status: 'idle' }
