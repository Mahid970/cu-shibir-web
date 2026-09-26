import type { SVGProps } from 'react'

/**
 * Glossy "3D" icons in the spirit of Phitron's floating tech icons, drawn for campus life
 * (election, books, training, shuttle, welfare). Pure SVG, a few hundred bytes each.
 */
type P = SVGProps<SVGSVGElement>
const base = { viewBox: '0 0 64 64', 'aria-hidden': true, focusable: false } as const

export const BallotBox = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="bb-f" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#5b93ff" />
        <stop offset="1" stopColor="#1d4ed8" />
      </linearGradient>
      <linearGradient id="bb-t" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#c7dbff" />
        <stop offset="1" stopColor="#7aa6ff" />
      </linearGradient>
    </defs>
    <path d="M9 27 45 27 56 20 20 20Z" fill="url(#bb-t)" />
    <path d="M25 24.6h17.5l3-1.9H28Z" fill="#1e3a8a" />
    <g transform="rotate(-7 34 14)">
      <rect x="25" y="1.5" width="19" height="22" rx="2.5" fill="#fff" />
      <path d="m29.5 12.5 3.3 3.3 6.4-7" fill="none" stroke="#22c55e" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
    </g>
    <path d="M24.4 24.9h18.4l2.6-1.6" fill="none" stroke="#9fbfff" strokeWidth="1.4" />
    <rect x="9" y="27" width="36" height="30" rx="3" fill="url(#bb-f)" />
    <path d="M45 27 56 20v29.5L45 57Z" fill="#1a3a9c" />
    <rect x="16" y="36" width="22" height="9" rx="2" fill="#fff" opacity=".92" />
    <path d="M20 40.5h14" stroke="#1d4ed8" strokeWidth="2" strokeLinecap="round" />
    <rect x="11.5" y="29.5" width="2.6" height="24" rx="1.3" fill="#fff" opacity=".28" />
  </svg>
)

export const Book = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="bk-c" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#7c83ff" />
        <stop offset="1" stopColor="#3f3cc9" />
      </linearGradient>
    </defs>
    <path d="M14 10h34a4 4 0 0 1 4 4v38l-6 4H18a4 4 0 0 1-4-4Z" fill="#2d2a9e" />
    <path d="M17 52h31l4-3V14" fill="#f3f4ff" />
    <path d="M17 55.5h29" stroke="#d8dbff" strokeWidth="1.2" />
    <rect x="12" y="8" width="36" height="44" rx="4" fill="url(#bk-c)" />
    <path d="M38 8h6v16l-3-2.5-3 2.5Z" fill="#fbc900" />
    <rect x="19" y="20" width="14" height="3" rx="1.5" fill="#fff" opacity=".8" />
    <rect x="19" y="27" width="20" height="3" rx="1.5" fill="#fff" opacity=".45" />
    <rect x="14.5" y="10.5" width="2.6" height="39" rx="1.3" fill="#fff" opacity=".25" />
  </svg>
)

export const GradCap = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="gc-t" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#3b4a6b" />
        <stop offset="1" stopColor="#0b1530" />
      </linearGradient>
    </defs>
    <path d="M18 30v12c0 4 6.3 8 14 8s14-4 14-8V30" fill="#152040" />
    <path d="M18 38c0 4 6.3 7 14 7s14-3 14-7" fill="none" stroke="#2b3a60" strokeWidth="1.5" />
    <path d="M32 12 60 25 32 38 4 25Z" fill="url(#gc-t)" />
    <path d="M32 14.5 55.5 25" stroke="#fff" strokeOpacity=".25" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M32 25 50 30v14" fill="none" stroke="#fbc900" strokeWidth="2.4" strokeLinecap="round" />
    <path d="M47.5 44h5l1 7h-7Z" fill="#fbc900" />
    <circle cx="32" cy="25" r="2.4" fill="#fbc900" />
  </svg>
)

export const Megaphone3D = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="mg-b" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ffd84d" />
        <stop offset="1" stopColor="#f97316" />
      </linearGradient>
    </defs>
    <path d="M20 40 24 56h7l-3-14Z" fill="#c2410c" />
    <path d="M10 26h10l26-14v38L20 38H10a4 4 0 0 1-4-4v-4a4 4 0 0 1 4-4Z" fill="url(#mg-b)" />
    <ellipse cx="46" cy="31" rx="6" ry="19" fill="#fb923c" />
    <ellipse cx="46.5" cy="31" rx="3.6" ry="14" fill="#9a3412" />
    <path d="M11 28h7v6h-7Z" fill="#fff" opacity=".35" />
    <path d="M55 22c3 2.4 3 15.6 0 18M58.5 17c5 4 5 24 0 28" fill="none" stroke="#fbc900" strokeWidth="2.4" strokeLinecap="round" />
  </svg>
)

export const Train = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="tr-b" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#ff6b6b" />
        <stop offset="1" stopColor="#c81e1e" />
      </linearGradient>
      <linearGradient id="tr-w" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#bfe3ff" />
        <stop offset="1" stopColor="#4c8df5" />
      </linearGradient>
    </defs>
    <path d="M18 54 12 61M46 54l6 7" stroke="#334155" strokeWidth="3" strokeLinecap="round" />
    <rect x="12" y="6" width="40" height="48" rx="12" fill="url(#tr-b)" />
    <rect x="17" y="12" width="30" height="18" rx="5" fill="url(#tr-w)" />
    <path d="M20 14.5h10l-6 13h-4Z" fill="#fff" opacity=".45" />
    <rect x="12" y="34" width="40" height="5" fill="#fff" opacity=".9" />
    <circle cx="21" cy="46" r="3.6" fill="#fde047" />
    <circle cx="43" cy="46" r="3.6" fill="#fde047" />
    <rect x="28" y="44" width="8" height="4" rx="2" fill="#7f1d1d" />
  </svg>
)

export const Drop = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="dr-b" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ff8aa0" />
        <stop offset="1" stopColor="#d9163f" />
      </linearGradient>
    </defs>
    <path d="M32 4C25 16 13 27 13 40a19 19 0 0 0 38 0C51 27 39 16 32 4Z" fill="url(#dr-b)" />
    <path d="M22 38c0-5 3-10 6-14" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M26 42h12M32 36v12" stroke="#fff" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

export const Tent = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="tn-a" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ffb257" />
        <stop offset="1" stopColor="#ea580c" />
      </linearGradient>
    </defs>
    <path d="M32 8v6" stroke="#475569" strokeWidth="2.5" strokeLinecap="round" />
    <path d="M32 6h10l-3 3 3 3H32Z" fill="#35b252" />
    <path d="M32 12 6 54h52Z" fill="url(#tn-a)" />
    <path d="M32 12 58 54H44Z" fill="#c2410c" opacity=".55" />
    <path d="M32 26 22 54h20Z" fill="#7c2d12" />
    <path d="M4 55h56" stroke="#35b252" strokeWidth="4" strokeLinecap="round" />
  </svg>
)

export const Medal = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="md-g" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ffe27a" />
        <stop offset="1" stopColor="#e3a100" />
      </linearGradient>
    </defs>
    <path d="M20 4h10l6 18h-10Z" fill="#3564ff" />
    <path d="M44 4H34l-6 18h10Z" fill="#c82028" />
    <circle cx="32" cy="40" r="19" fill="url(#md-g)" />
    <circle cx="32" cy="40" r="13.5" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="2" />
    <path d="m32 31 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-3-5.6 3 1.1-6.2-4.5-4.4 6.2-.9Z" fill="#fff" />
  </svg>
)

export const Seedling = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="sd-l" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#86efac" />
        <stop offset="1" stopColor="#16a34a" />
      </linearGradient>
      <linearGradient id="sd-p" x1="0" y1="0" x2="0" y2="1">
        <stop stopColor="#f59e5b" />
        <stop offset="1" stopColor="#b45309" />
      </linearGradient>
    </defs>
    <path d="M32 44V24" stroke="#15803d" strokeWidth="3.5" strokeLinecap="round" />
    <path d="M32 28C32 16 22 10 10 11c0 12 8 18 22 17Z" fill="url(#sd-l)" />
    <path d="M32 24c0-10 8-16 21-15 0 11-8 16-21 15Z" fill="url(#sd-l)" />
    <path d="M16 42h32l-4 18H20Z" fill="url(#sd-p)" />
    <rect x="14" y="40" width="36" height="6" rx="3" fill="#d97706" />
  </svg>
)

export const Trophy3D = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="tp-g" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#ffe27a" />
        <stop offset="1" stopColor="#e39a00" />
      </linearGradient>
    </defs>
    <path d="M17 12H8c0 11 6 17 13 17M47 12h9c0 11-6 17-13 17" fill="none" stroke="#e3a100" strokeWidth="4" />
    <path d="M16 6h32v14a16 16 0 0 1-32 0Z" fill="url(#tp-g)" />
    <path d="M22 10v10a10 10 0 0 0 4 8" fill="none" stroke="#fff" strokeOpacity=".55" strokeWidth="3" strokeLinecap="round" />
    <path d="M28 36h8v8h-8Z" fill="#e3a100" />
    <rect x="18" y="44" width="28" height="12" rx="3" fill="#7c2d12" />
    <rect x="24" y="48" width="16" height="4" rx="2" fill="#fbc900" />
    <path d="m32 11 2 4 4.4.6-3.2 3.1.8 4.4-4-2.1-4 2.1.8-4.4-3.2-3.1L30 15Z" fill="#c82028" />
  </svg>
)

/** The logo's pentagon as a glossy sky gem. */
export const PentagonGem = (p: P) => (
  <svg {...base} {...p}>
    <defs>
      <linearGradient id="pg-a" x1="0" y1="0" x2="1" y2="1">
        <stop stopColor="#8fdcff" />
        <stop offset="1" stopColor="#1690d0" />
      </linearGradient>
    </defs>
    <path d="M32 4 61 25 50 60H14L3 25Z" fill="url(#pg-a)" />
    <path d="M32 14 51 28 44 51H20l-7-23Z" fill="#fff" opacity=".2" />
    <path d="M32 4 3 25l11 35" fill="none" stroke="#fff" strokeOpacity=".6" strokeWidth="2" strokeLinejoin="round" />
  </svg>
)

export const ART = {
  ballot: BallotBox,
  book: Book,
  cap: GradCap,
  megaphone: Megaphone3D,
  train: Train,
  drop: Drop,
  tent: Tent,
  medal: Medal,
  seedling: Seedling,
  trophy: Trophy3D,
  gem: PentagonGem,
} as const

export type ArtKey = keyof typeof ART
