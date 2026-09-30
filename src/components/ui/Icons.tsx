import type { ReactNode, SVGProps } from 'react'

type P = SVGProps<SVGSVGElement>

function Line({ children, ...props }: P & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {children}
    </svg>
  )
}

export const ArrowRight = (p: P) => (
  <Line strokeWidth={2.5} {...p}>
    <path d="M5 12h14M13 6l6 6-6 6" />
  </Line>
)
export const ChevronDown = (p: P) => (
  <Line {...p}>
    <path d="m6 9 6 6 6-6" />
  </Line>
)
export const ChevronLeft = (p: P) => (
  <Line {...p}>
    <path d="m15 6-6 6 6 6" />
  </Line>
)
export const ChevronRight = (p: P) => (
  <Line {...p}>
    <path d="m9 6 6 6-6 6" />
  </Line>
)
export const Menu = (p: P) => (
  <Line {...p}>
    <path d="M4 7h16M4 12h16M4 17h16" />
  </Line>
)
export const Close = (p: P) => (
  <Line {...p}>
    <path d="M6 6l12 12M18 6 6 18" />
  </Line>
)
export const Mail = (p: P) => (
  <Line {...p}>
    <rect x="3" y="5" width="18" height="14" rx="2" />
    <path d="m3 7 9 6 9-6" />
  </Line>
)
export const Pin = (p: P) => (
  <Line {...p}>
    <path d="M12 21s-7-6.2-7-11.5A7 7 0 0 1 19 9.5C19 14.8 12 21 12 21Z" />
    <circle cx="12" cy="9.5" r="2.5" />
  </Line>
)
export const CalendarCheck = (p: P) => (
  <Line {...p}>
    <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
    <path d="M8 3v4M16 3v4M3.5 10h17M9 15l2 2 4-4" />
  </Line>
)
export const Trophy = (p: P) => (
  <Line {...p}>
    <path d="M8 4h8v5a4 4 0 0 1-8 0V4ZM8 6H5a3 3 0 0 0 3 4M16 6h3a3 3 0 0 1-3 4M12 13v4M9 20h6M10 17h4" />
  </Line>
)
export const Users = (p: P) => (
  <Line {...p}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20a6.5 6.5 0 0 1 13 0M16 4.5a3.5 3.5 0 0 1 0 7M18 14a6 6 0 0 1 3.5 6" />
  </Line>
)
export const Megaphone = (p: P) => (
  <Line {...p}>
    <path d="M4 10v4a1 1 0 0 0 1 1h2l6 4V5L7 9H5a1 1 0 0 0-1 1ZM17 9a4 4 0 0 1 0 6M7 15l1 5" />
  </Line>
)
export const CheckCircle = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <circle cx="12" cy="12" r="10" fill="currentColor" />
    <path d="m7.5 12.5 3 3 6-6.5" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)
export const Play = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5Z" fill="currentColor" />
  </svg>
)
/** Double chevron used between steps. */
export const Chevrons = (p: P) => (
  <svg viewBox="0 0 24 24" aria-hidden="true" {...p}>
    <path d="M3 5.5v13l8-6.5-8-6.5Z" fill="currentColor" />
    <path d="M12 5.5v13l8-6.5-8-6.5Z" fill="currentColor" opacity="0.55" />
  </svg>
)

export const Search = (p: P) => (
  <Line {...p}>
    <circle cx="11" cy="11" r="7" />
    <path d="m20 20-3.5-3.5" />
  </Line>
)
export const Images = (p: P) => (
  <Line {...p}>
    <rect x="3" y="5" width="15" height="13" rx="2" />
    <path d="M21 8v11a2 2 0 0 1-2 2H7" />
    <path d="m3 15 4-4 4 4 2-2 5 5" />
  </Line>
)
export const ExternalLink = (p: P) => (
  <Line {...p}>
    <path d="M14 4h6v6M20 4l-9 9" />
    <path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5" />
  </Line>
)
export const Lock = (p: P) => (
  <Line {...p}>
    <rect x="4" y="11" width="16" height="10" rx="2" />
    <path d="M8 11V8a4 4 0 0 1 8 0v3" />
  </Line>
)
export const Globe = (p: P) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18" />
  </Line>
)
export const Clock = (p: P) => (
  <Line {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5l3 2" />
  </Line>
)
export const Facebook = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M13.5 21v-7.5h2.6l.4-3h-3V8.6c0-.9.3-1.5 1.6-1.5h1.6V4.4a21 21 0 0 0-2.4-.1c-2.4 0-4 1.4-4 4.1v2.2H7.7v3h2.6V21h3.2Z" />
  </svg>
)
export const YouTube = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8C5.7 19 12 19 12 19s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z" />
  </svg>
)
export const Telegram = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M20.7 4.3 2.9 11.2c-1.2.5-1.2 1.2-.2 1.5l4.6 1.4 1.8 5.4c.2.6.4.8.9.8.4 0 .6-.2.9-.5l2.2-2.1 4.6 3.4c.8.5 1.4.2 1.6-.8l3-14.2c.3-1.2-.5-1.8-1.6-1.3ZM9 14l8.7-5.5c.4-.3.8-.1.5.2l-7.2 6.5-.3 3.1L9 14Z" />
  </svg>
)
export const Instagram = (p: P) => (
  <Line {...p}>
    <rect x="3" y="3" width="18" height="18" rx="5" />
    <circle cx="12" cy="12" r="4" />
    <circle cx="17.5" cy="6.5" r="0.6" fill="currentColor" />
  </Line>
)
export const XLogo = (p: P) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...p}>
    <path d="M17.8 3h3.1l-6.8 7.8L22 21h-6.2l-4.9-6.4L5.3 21H2.2l7.3-8.3L2 3h6.4l4.4 5.8L17.8 3Zm-1.1 16.2h1.7L7.4 4.7H5.6l11.1 14.5Z" />
  </svg>
)

export const SOCIAL_ICONS = {
  facebook: Facebook,
  youtube: YouTube,
  telegram: Telegram,
  instagram: Instagram,
  x: XLogo,
} as const
