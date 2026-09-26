/**
 * How much 3D this device should get (plan §5.1):
 *   0 — poster only: reduced motion, Save-Data, ≤2 GB RAM, no WebGL2 or a software renderer
 *   1 — live scene, lower resolution, 30 fps, fewer trees: phones and small machines
 *   2 — full scene
 */
export type DeviceTier = 0 | 1 | 2

export function detectTier(): DeviceTier {
  if (typeof window === 'undefined') return 0
  // QA override: ?campus3d=0|1|2
  const forced = new URLSearchParams(location.search).get('campus3d')
  if (forced === '0' || forced === '1' || forced === '2') return Number(forced) as DeviceTier
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return 0
  const nav = navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string }; deviceMemory?: number }
  if (nav.connection?.saveData || /(^|-)2g$/.test(nav.connection?.effectiveType ?? '')) return 0
  if (nav.deviceMemory !== undefined && nav.deviceMemory <= 2) return 0

  let gl: WebGL2RenderingContext | null = null
  try {
    gl = document.createElement('canvas').getContext('webgl2', { failIfMajorPerformanceCaveat: true })
  } catch {
    gl = null
  }
  if (!gl) return 0
  const info = gl.getExtension('WEBGL_debug_renderer_info')
  const renderer = String(info ? gl.getParameter(info.UNMASKED_RENDERER_WEBGL) : gl.getParameter(gl.RENDERER)).toLowerCase()
  gl.getExtension('WEBGL_lose_context')?.loseContext()
  if (/swiftshader|llvmpipe|software|basic render/.test(renderer)) return 0

  const coarse = matchMedia('(pointer: coarse)').matches
  const cores = nav.hardwareConcurrency ?? 4
  if (coarse || cores <= 4 || (nav.deviceMemory !== undefined && nav.deviceMemory <= 4)) return 1
  return 2
}
