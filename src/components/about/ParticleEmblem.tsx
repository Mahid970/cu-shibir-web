'use client'

import { useEffect, useRef } from 'react'

type Shape = { x: Float32Array; y: Float32Array; r: Uint8Array; g: Uint8Array; b: Uint8Array; n: number }

/** Sample the opaque pixels of an image into points centred in a W×H box. */
function sampleImage(img: HTMLImageElement, W: number, H: number, fill: number, step: number): Shape {
  const size = 100
  const c = document.createElement('canvas')
  c.width = c.height = size
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.drawImage(img, 0, 0, size, size)
  const data = ctx.getImageData(0, 0, size, size).data
  const scale = (Math.min(W, H) * fill) / size
  const ox = (W - size * scale) / 2
  const oy = (H - size * scale) / 2
  const pts: number[][] = []
  for (let y = 0; y < size; y += step) {
    for (let x = 0; x < size; x += step) {
      const i = (y * size + x) * 4
      if (data[i + 3] > 140) pts.push([ox + x * scale, oy + y * scale, data[i], data[i + 1], data[i + 2]])
    }
  }
  return toShape(pts)
}

/**
 * The emblem filling a W×H box (home hero): the image's empty margin is trimmed, the emblem is
 * scaled to fit the box, and redrawn at one point every `gap` px, so a large emblem gets more,
 * denser dots than the 100 px source has pixels. Colours are lifted a touch to hold up over the video.
 */
function sampleLogoFit(img: HTMLImageElement, W: number, H: number, gap: number): Shape {
  const src = document.createElement('canvas')
  src.width = img.naturalWidth
  src.height = img.naturalHeight
  const sctx = src.getContext('2d', { willReadFrequently: true })!
  sctx.drawImage(img, 0, 0)
  const raw = sctx.getImageData(0, 0, src.width, src.height).data
  let x0 = src.width
  let y0 = src.height
  let x1 = 0
  let y1 = 0
  for (let y = 0; y < src.height; y++) {
    for (let x = 0; x < src.width; x++) {
      if (raw[(y * src.width + x) * 4 + 3] > 140) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  const bw = x1 - x0 + 1
  const bh = y1 - y0 + 1
  const fit = Math.min(W / bw, H / bh)
  const cols = Math.max(1, Math.round((bw * fit) / gap))
  const rows = Math.max(1, Math.round((bh * fit) / gap))
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  ctx.imageSmoothingQuality = 'high'
  ctx.drawImage(img, x0, y0, bw, bh, 0, 0, cols, rows)
  const data = ctx.getImageData(0, 0, cols, rows).data
  const ox = (W - cols * gap) / 2
  const oy = (H - rows * gap) / 2
  const lift = (v: number) => Math.min(255, Math.round(v * 1.04 + 12))
  const pts: number[][] = []
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const i = (y * cols + x) * 4
      if (data[i + 3] > 140) pts.push([ox + x * gap, oy + y * gap, lift(data[i]), lift(data[i + 1]), lift(data[i + 2])])
    }
  }
  return toShape(pts)
}

/** Sample text drawn with the page's Bangla font. */
function sampleText(lines: string[], W: number, H: number, font: string, step: number, colors?: [number, number, number][]): Shape {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  let size = Math.min(H / (lines.length * 1.45), 120)
  ctx.font = `700 ${size}px ${font}`
  const widest = Math.max(...lines.map((l) => ctx.measureText(l).width))
  if (widest > W * 0.9) size *= (W * 0.9) / widest
  ctx.font = `700 ${size}px ${font}`
  ctx.fillStyle = '#fff'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  const lineY = lines.map((_, i) => H / 2 + (i - (lines.length - 1) / 2) * size * 1.35)
  lines.forEach((l, i) => ctx.fillText(l, W / 2, lineY[i]))
  const data = ctx.getImageData(0, 0, W, H).data
  const pts: number[][] = []
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        if (colors) {
          // One solid colour per line (home hero): the line whose middle is nearest.
          let li = 0
          for (let k = 1; k < lineY.length; k++) if (Math.abs(y - lineY[k]) < Math.abs(y - lineY[li])) li = k
          const [r, g, b] = colors[li] ?? colors[0]
          pts.push([x, y, r, g, b])
        } else {
          // mint → white → sky across the line
          const t = x / W
          pts.push([x, y, Math.round(126 + 129 * t * 0.6), 247 - Math.round(40 * t), Math.round(168 + 87 * t)])
        }
      }
    }
  }
  return toShape(pts)
}

function toShape(pts: number[][]): Shape {
  const n = pts.length
  const s: Shape = { x: new Float32Array(n), y: new Float32Array(n), r: new Uint8Array(n), g: new Uint8Array(n), b: new Uint8Array(n), n }
  pts.forEach((p, i) => {
    s.x[i] = p[0]
    s.y[i] = p[1]
    s.r[i] = p[2]
    s.g[i] = p[3]
    s.b[i] = p[4]
  })
  return s
}

const SLOGAN = ['আমরা তরুণ,', 'আমরাই পারি']

/**
 * Scattered points ("stars") gather into the branch emblem, then re-form as the slogan, and back
 * (night band on the About page). With `slogan={null}` the emblem stays and breathes instead: the
 * points drift a little apart and gather again every few seconds (home hero). Points shy away from
 * the pointer. Runs only while visible; with reduced motion the emblem is simply drawn.
 */
export function ParticleEmblem({
  slogan = SLOGAN,
  fit = false,
  lineColors,
  className = 'relative h-[340px] w-full sm:h-[380px] lg:h-[420px]',
}: {
  slogan?: string[] | null
  /** Home hero: the emblem fills its box with denser dots, and the slogan keeps its own lines. */
  fit?: boolean
  /** Solid colour per slogan line instead of the mint → sky sweep. */
  lineColors?: [number, number, number][]
  className?: string
}) {
  const wrap = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const el = canvas.current
    const box = wrap.current
    if (!el || !box) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    let raf = 0
    let running = false
    let disposed = false
    const pointer = { x: -9999, y: -9999 }

    const img = new Image()
    img.src = '/brand/logo-legacy.png'

    const start = async () => {
      await Promise.all([img.decode(), document.fonts.ready])
      if (disposed) return
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = box.clientWidth
      const H = box.clientHeight
      el.width = Math.round(W * dpr)
      el.height = Math.round(H * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const narrow = W < 640
      const fill = narrow ? 0.72 : 0.86
      // A small emblem (home hero) samples fewer pixels so the points stay ~3 px apart and read as dots.
      const scale = (Math.min(W, H) * fill) / 100
      const small = scale < 2
      const step = small ? Math.max(2, Math.round(2.8 / scale)) : narrow ? 2 : 1
      // Home hero: fill the whole box with denser, slightly brighter dots.
      // At most ~12k points: a taller box spaces them a little wider so it stays at full frame rate.
      const filled = fit || !slogan
      let gap = narrow ? 2 : 2.3
      let emblem = filled ? sampleLogoFit(img, W, H, gap) : sampleImage(img, W, H, fill, step)
      if (filled && emblem.n > 12000) {
        gap *= Math.sqrt(emblem.n / 12000)
        emblem = sampleLogoFit(img, W, H, gap)
      }
      const font = getComputedStyle(document.body).fontFamily
      const lines = slogan && (narrow || fit ? slogan : [slogan.join(' ')])
      const text = lines && sampleText(lines, W, H, font, filled ? 2 : 3, lineColors)
      const n = Math.max(emblem.n, text ? text.n : 0)
      const dot = filled ? gap * 0.86 : small ? Math.min(1.8, step * scale * 0.7) : narrow ? 1.8 : 2.2

      if (calm) {
        for (let i = 0; i < emblem.n; i++) {
          ctx.fillStyle = `rgb(${emblem.r[i]},${emblem.g[i]},${emblem.b[i]})`
          ctx.fillRect(emblem.x[i], emblem.y[i], dot, dot)
        }
        return
      }

      // Particle state
      const px = new Float32Array(n)
      const py = new Float32Array(n)
      const vx = new Float32Array(n)
      const vy = new Float32Array(n)
      const tx = new Float32Array(n)
      const ty = new Float32Array(n)
      const cr = new Float32Array(n)
      const cg = new Float32Array(n)
      const cb = new Float32Array(n)
      const ta = new Float32Array(n) // target alpha
      const ca = new Float32Array(n)
      const tr = new Float32Array(n) // target colour
      const tg = new Float32Array(n)
      const tb = new Float32Array(n)
      const style: string[] = new Array(n).fill('')
      const key = new Int32Array(n).fill(-1)
      for (let i = 0; i < n; i++) {
        px[i] = Math.random() * W
        py[i] = Math.random() * H
        cr[i] = cg[i] = cb[i] = 200
        ca[i] = Math.random() * 0.6
      }

      const target = (shape: Shape) => {
        for (let i = 0; i < n; i++) {
          if (i < shape.n) {
            // Shuffle which particle goes where so the morph swirls instead of sliding.
            const j = (i * 7919) % shape.n
            tx[i] = shape.x[j] + (Math.random() - 0.5) * 0.6
            ty[i] = shape.y[j] + (Math.random() - 0.5) * 0.6
            ta[i] = 1
            tr[i] = shape.r[j]
            tg[i] = shape.g[j]
            tb[i] = shape.b[j]
          } else {
            tx[i] = Math.random() * W
            ty[i] = Math.random() * H
            ta[i] = 0.12
            tr[i] = 148
            tg[i] = 163
            tb[i] = 184
          }
        }
      }
      // The emblem's points pushed out from its centre and loosened: a breath between two holds.
      const cx = W / 2
      const cy = H / 2
      const breath: Shape = { ...emblem, x: new Float32Array(emblem.n), y: new Float32Array(emblem.n) }
      for (let i = 0; i < emblem.n; i++) {
        breath.x[i] = emblem.x[i] + (emblem.x[i] - cx) * 0.3 + (Math.random() - 0.5) * 18
        breath.y[i] = emblem.y[i] + (emblem.y[i] - cy) * 0.3 + (Math.random() - 0.5) * 18
      }
      const phases = text
        ? [
            { shape: emblem, hold: 4200 },
            { shape: text, hold: 4600 },
          ]
        : [
            { shape: emblem, hold: 6500 },
            { shape: breath, hold: 1100 },
          ]
      let phase = -1
      let nextAt = performance.now() + 700 // a moment of stars first

      const tick = (now: number) => {
        if (now >= nextAt) {
          phase = (phase + 1) % phases.length
          target(phases[phase].shape)
          nextAt = now + phases[phase].hold
        }
        ctx.clearRect(0, 0, W, H)
        for (let i = 0; i < n; i++) {
          if (phase >= 0) {
            vx[i] += (tx[i] - px[i]) * 0.012
            vy[i] += (ty[i] - py[i]) * 0.012
            cr[i] += (tr[i] - cr[i]) * 0.06
            cg[i] += (tg[i] - cg[i]) * 0.06
            cb[i] += (tb[i] - cb[i]) * 0.06
            ca[i] += (ta[i] - ca[i]) * 0.05
          }
          const dx = px[i] - pointer.x
          const dy = py[i] - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 3600) {
            const f = (3600 - d2) / 3600
            vx[i] += (dx / Math.sqrt(d2 + 1)) * f * 2.2
            vy[i] += (dy / Math.sqrt(d2 + 1)) * f * 2.2
          }
          vx[i] *= 0.84
          vy[i] *= 0.84
          px[i] += vx[i]
          py[i] += vy[i]
          ctx.globalAlpha = ca[i]
          // Colours settle quickly; rebuild the style string only when the rounded colour changes.
          const k = ((cr[i] | 0) << 16) | ((cg[i] | 0) << 8) | (cb[i] | 0)
          if (k !== key[i]) {
            key[i] = k
            style[i] = `rgb(${cr[i] | 0},${cg[i] | 0},${cb[i] | 0})`
          }
          ctx.fillStyle = style[i]
          ctx.fillRect(px[i], py[i], dot, dot)
        }
        ctx.globalAlpha = 1
        if (running) raf = requestAnimationFrame(tick)
      }

      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running) {
          running = true
          nextAt = Math.max(nextAt, performance.now() + 300)
          raf = requestAnimationFrame(tick)
        } else if (!e.isIntersecting) {
          running = false
          cancelAnimationFrame(raf)
        }
      })
      io.observe(box)
      cleanup = () => io.disconnect()
    }

    let cleanup = () => {}
    const onMove = (e: PointerEvent) => {
      const r = el.getBoundingClientRect()
      pointer.x = e.clientX - r.left
      pointer.y = e.clientY - r.top
    }
    const onLeave = () => {
      pointer.x = pointer.y = -9999
    }
    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    start().catch(() => {})
    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(raf)
      cleanup()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [slogan, fit, lineColors])

  return (
    <div ref={wrap} className={className}>
      <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" aria-hidden="true" />
    </div>
  )
}
