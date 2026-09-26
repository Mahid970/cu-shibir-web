/** Sky palettes for the campus scene (no prayer-time maths here, so the poster can import it cheaply). */

export type Palette = {
  top: string // sky at the zenith
  bottom: string // sky at the horizon, also the fog
  hillNear: string
  hillFar: string
  light: number // sun / key light intensity 0..1.2
  sun: string // key light colour
  stars: number // 0..1
  lamps: number // 0..1, campus lights and train windows
  sunHeight: number // -1 (below horizon) .. 1 (noon)
}

export const PALETTES: Record<'night' | 'dawn' | 'day' | 'golden' | 'dusk', Palette> = {
  night: { top: '#020617', bottom: '#12294a', hillNear: '#0a1a1f', hillFar: '#10233a', light: 0.22, sun: '#9fb4ff', stars: 1, lamps: 1, sunHeight: -1 },
  dawn: { top: '#1e3a8a', bottom: '#f4a261', hillNear: '#1f3b2c', hillFar: '#3b4a6b', light: 0.55, sun: '#ffc89a', stars: 0.2, lamps: 0.5, sunHeight: 0.05 },
  day: { top: '#3b82f6', bottom: '#cfe8ff', hillNear: '#2f7d4a', hillFar: '#6a9fb5', light: 1.1, sun: '#fff7e8', stars: 0, lamps: 0, sunHeight: 1 },
  golden: { top: '#2563eb', bottom: '#ffd29a', hillNear: '#3f7a3a', hillFar: '#8a8fa8', light: 0.85, sun: '#ffcf8a', stars: 0, lamps: 0.1, sunHeight: 0.25 },
  dusk: { top: '#1e1b4b', bottom: '#e76f51', hillNear: '#1b2e27', hillFar: '#3a3558', light: 0.35, sun: '#ff9a76', stars: 0.5, lamps: 0.9, sunHeight: -0.1 },
}

export type Phase = keyof typeof PALETTES

export const PHASE_NAMES: Record<Phase, string> = {
  night: 'রাত',
  dawn: 'ভোর',
  day: 'দিন',
  golden: 'বিকেল',
  dusk: 'সন্ধ্যা',
}
