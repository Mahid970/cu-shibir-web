import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes, TextareaHTMLAttributes } from 'react'

import { useLang } from '@/i18n/LangProvider'
import type { FieldErrors } from '@/lib/forms/validate'

type Option = { value: string; label: string }

const control =
  'w-full rounded-xl border border-[#d3dee8] bg-white px-4 text-[1rem] text-ink shadow-[0_1px_2px_rgb(11_31_51/0.04)] transition-[border-color,box-shadow] placeholder:text-subtle/80 focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue/15 aria-[invalid=true]:border-crimson aria-[invalid=true]:ring-crimson/10'

type Common = { name: string; label: string; hint?: ReactNode; required?: boolean; errors?: FieldErrors; className?: string }

const optional = { bn: ' (ঐচ্ছিক)', en: ' (optional)' }

function Wrap({ name, label, hint, required, errors, className = '', children }: Common & { children: ReactNode }) {
  const error = errors?.[name]
  const lang = useLang()
  return (
    <div className={className}>
      <label htmlFor={`f-${name}`} className="mb-1.5 block font-semibold text-ink">
        {label}
        {required ? (
          <span className="text-crimson" aria-hidden="true">
            {' '}
            *
          </span>
        ) : (
          <span className="font-normal text-subtle">{optional[lang]}</span>
        )}
      </label>
      {children}
      {error ? (
        <p id={`e-${name}`} className="mt-1.5 text-[0.92rem] font-semibold text-crimson">
          {error}
        </p>
      ) : (
        hint && (
          <p id={`h-${name}`} className="mt-1.5 text-[0.9rem] text-subtle">
            {hint}
          </p>
        )
      )}
    </div>
  )
}

const aria = (name: string, errors?: FieldErrors, hint?: ReactNode) => ({
  id: `f-${name}`,
  name,
  'aria-invalid': errors?.[name] ? true : undefined,
  'aria-describedby': errors?.[name] ? `e-${name}` : hint ? `h-${name}` : undefined,
})

export function TextField(props: Common & Omit<InputHTMLAttributes<HTMLInputElement>, 'name'>) {
  const { name, label, hint, required, errors, className, ...rest } = props
  return (
    <Wrap {...{ name, label, hint, required, errors, className }}>
      <input {...rest} {...aria(name, errors, hint)} required={required} className={`${control} h-12`} />
    </Wrap>
  )
}

export function TextArea(props: Common & Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'name'>) {
  const { name, label, hint, required, errors, className, ...rest } = props
  return (
    <Wrap {...{ name, label, hint, required, errors, className }}>
      <textarea rows={5} {...rest} {...aria(name, errors, hint)} required={required} className={`${control} min-h-32 py-3 leading-relaxed`} />
    </Wrap>
  )
}

export function Select(
  props: Common & Omit<SelectHTMLAttributes<HTMLSelectElement>, 'name'> & { options?: Option[]; groups?: { label: string; options: Option[] }[]; placeholder?: string },
) {
  const lang = useLang()
  const { name, label, hint, required, errors, className, options, groups, placeholder = lang === 'en' ? 'Choose' : 'বেছে নিন', ...rest } = props
  return (
    <Wrap {...{ name, label, hint, required, errors, className }}>
      <select
        defaultValue=""
        {...rest}
        {...aria(name, errors, hint)}
        required={required}
        className={`${control} h-12 appearance-none bg-[url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")] bg-[length:20px] bg-[right_14px_center] bg-no-repeat pr-11`}
      >
        <option value="" disabled={required}>
          {placeholder}
        </option>
        {options?.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
        {groups?.map((g) => (
          <optgroup key={g.label} label={g.label}>
            {g.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </Wrap>
  )
}

/** Choice cards: radios or checkboxes laid out as tappable pills. */
export function Choices({
  name,
  label,
  options,
  type = 'radio',
  required,
  errors,
  defaultValue,
  onChange,
}: {
  name: string
  label: string
  options: readonly { value: string; label: string }[]
  type?: 'radio' | 'checkbox'
  required?: boolean
  errors?: FieldErrors
  defaultValue?: string
  onChange?: (value: string) => void
}) {
  const error = errors?.[name]
  const lang = useLang()
  return (
    <fieldset aria-describedby={error ? `e-${name}` : undefined}>
      <legend className="mb-2 font-semibold text-ink">
        {label}
        {required ? <span className="text-crimson"> *</span> : <span className="font-normal text-subtle">{optional[lang]}</span>}
      </legend>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => (
          <label
            key={o.value}
            className="cursor-pointer rounded-full border border-[#d3dee8] bg-white px-4 py-2 font-semibold text-ink transition-colors has-[:checked]:border-blue has-[:checked]:bg-pale-2 has-[:checked]:text-primary has-[:focus-visible]:ring-4 has-[:focus-visible]:ring-blue/20"
          >
            <input
              type={type}
              name={name}
              value={o.value}
              defaultChecked={defaultValue === o.value}
              required={required && type === 'radio'}
              onChange={(e) => onChange?.(e.target.value)}
              className="sr-only"
            />
            {o.label}
          </label>
        ))}
      </div>
      {error && (
        <p id={`e-${name}`} className="mt-1.5 text-[0.92rem] font-semibold text-crimson">
          {error}
        </p>
      )}
    </fieldset>
  )
}

export function Consent({ name = 'consent', errors, children }: { name?: string; errors?: FieldErrors; children: ReactNode }) {
  const error = errors?.[name]
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-pale p-4 text-[0.95rem] leading-relaxed text-ink/85">
        <input
          type="checkbox"
          name={name}
          required
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `e-${name}` : undefined}
          className="mt-1 size-5 shrink-0 accent-primary"
        />
        <span>{children}</span>
      </label>
      {error && (
        <p id={`e-${name}`} className="mt-1.5 text-[0.92rem] font-semibold text-crimson">
          {error}
        </p>
      )}
    </div>
  )
}
