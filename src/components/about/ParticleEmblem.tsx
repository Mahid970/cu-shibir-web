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

export type LineStyle = { rgb: [number, number, number]; scale: number }

/**
 * Sample text drawn with the page's Bangla font. Without `styles` every line is the same size and
 * coloured mint → white → sky across (About); with them each line gets its own solid colour and
 * relative size (home hero).
 */
function sampleText(lines: string[], W: number, H: number, font: string, step: number, styles?: LineStyle[]): Shape {
  const c = document.createElement('canvas')
  c.width = W
  c.height = H
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  const k = lines.map((_, i) => styles?.[i]?.scale ?? 1)
  const units = k.reduce((a, b) => a + b, 0)
  let size = Math.min(H / (units * 1.45), 120)
  const widest = () => Math.max(...lines.map((l, i) => ((ctx.font = `700 ${size * k[i]}px ${font}`), ctx.measureText(l).width)))
  const w = widest()
  const room = styles ? 0.92 : 0.9
  if (w > W * room) size *= (W * room) / w
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  // Lines stacked around the middle, each taking 1.35× its own size.
  let y = H / 2 - (units * size * 1.35) / 2
  const rows: [number, number][] = [] // [top, bottom] of each line, to colour its points
  lines.forEach((l, i) => {
    const h = size * k[i] * 1.35
    ctx.font = `700 ${size * k[i]}px ${font}`
    ctx.fillStyle = '#fff'
    ctx.fillText(l, W / 2, y + h / 2)
    rows.push([y, y + h])
    y += h
  })
  const data = ctx.getImageData(0, 0, W, H).data
  const pts: number[][] = []
  for (let y = 0; y < H; y += step) {
    for (let x = 0; x < W; x += step) {
      if (data[(y * W + x) * 4 + 3] > 128) {
        if (styles) {
          const row = Math.max(0, rows.findIndex(([a, b]) => y >= a && y < b))
          const [r, g, b] = styles[row]?.rgb ?? [255, 255, 255]
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
 * Scattered points ("stars") gather into the branch emblem, then re-form as the slogan, and back.
 * Points shy away from the pointer. Runs only while visible; with reduced motion one shape is
 * simply drawn (the emblem, or the text when `calm="text"`).
 *
 * About page: one slogan line on wide screens, mint → sky colours. Home hero: its own lines for
 * wide and narrow screens, solid colours per line (`styles`), the text held longer, and the text
 * drawn for reduced motion since it is the page title.
 */
export function ParticleEmblem({
  slogan = SLOGAN,
  narrowSlogan,
  styles,
  narrowStyles,
  holds = [4200, 4600],
  calm: calmShape = 'emblem',
  className = 'relative h-[340px] w-full sm:h-[380px] lg:h-[420px]',
}: {
  slogan?: string[]
  narrowSlogan?: string[]
  styles?: LineStyle[]
  narrowStyles?: LineStyle[]
  holds?: [number, number]
  calm?: 'emblem' | 'text'
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
      const emblem = sampleImage(img, W, H, fill, step)
      const font = getComputedStyle(document.body).fontFamily
      const lines = narrow ? (narrowSlogan ?? slogan) : styles ? slogan : [slogan.join(' ')]
      // Solid-colour title text (home hero) uses finer dots so the Bangla letters stay legible.
      const text = sampleText(lines, W, H, font, styles ? 2 : 3, narrow ? (narrowStyles ?? styles) : styles)
      const n = Math.max(emblem.n, text.n)
      const dot = styles ? 1.6 : small ? Math.min(1.8, step * scale * 0.7) : narrow ? 1.8 : 2.2

      if (calm) {
        const still = calmShape === 'text' ? text : emblem
        for (let i = 0; i < still.n; i++) {
          ctx.fillStyle = `rgb(${still.r[i]},${still.g[i]},${still.b[i]})`
          ctx.fillRect(still.x[i], still.y[i], dot, dot)
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
      const phases = [
        { shape: emblem, hold: holds[0] },
        { shape: text, hold: holds[1] },
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
  }, [slogan, narrowSlogan, styles, narrowStyles, holds, calmShape])

  return (
    <div ref={wrap} className={className}>
      <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" aria-hidden="true" />
    </div>
  )
}
