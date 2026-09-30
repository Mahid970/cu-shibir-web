'use client'

import { useEffect, useRef, useState } from 'react'

type Shape = { x: Float32Array; y: Float32Array; c: Uint32Array; n: number }
type Scene = { src: string; caption: string }

const pack = (r: number, g: number, b: number, a: number) => ((a << 24) | (b << 16) | (g << 8) | r) >>> 0

/** Draw an image into a cols×rows grid (cover or contain) and return its pixels. */
function grid(img: HTMLImageElement, cols: number, rows: number, fit: 'cover' | 'contain', scale = 1) {
  const c = document.createElement('canvas')
  c.width = cols
  c.height = rows
  const ctx = c.getContext('2d', { willReadFrequently: true })!
  const r = fit === 'cover' ? Math.max(cols / img.naturalWidth, rows / img.naturalHeight) : Math.min(cols / img.naturalWidth, rows / img.naturalHeight) * scale
  const w = img.naturalWidth * r
  const h = img.naturalHeight * r
  ctx.drawImage(img, (cols - w) / 2, (rows - h) / 2, w, h)
  return ctx.getImageData(0, 0, cols, rows).data
}

/** A photo as a mosaic of dots inside a soft ellipse; colours lifted a little so they glow on the night sky. */
function samplePhoto(img: HTMLImageElement, W: number, H: number, step: number): Shape {
  const cols = Math.floor(W / step)
  const rows = Math.floor(H / step)
  const data = grid(img, cols, rows, 'cover')
  const xs: number[] = []
  const ys: number[] = []
  const cs: number[] = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const nx = (i + 0.5) / cols - 0.5
      const ny = (j + 0.5) / rows - 0.5
      const d = Math.sqrt((nx * nx) / 0.25 + (ny * ny) / 0.25)
      if (d > 1) continue
      const k = (j * cols + i) * 4
      const lift = (v: number) => Math.min(255, Math.round(v * 0.9 + 26))
      const a = d > 0.82 ? Math.round(255 * ((1 - d) / 0.18)) : 255
      xs.push(i * step)
      ys.push(j * step)
      cs.push(pack(lift(data[k]), lift(data[k + 1]), lift(data[k + 2]), Math.max(40, a)))
    }
  }
  return toShape(xs, ys, cs)
}

/** The emblem's opaque pixels, centred. */
function sampleEmblem(img: HTMLImageElement, W: number, H: number, step: number): Shape {
  const cols = Math.floor(W / step)
  const rows = Math.floor(H / step)
  const data = grid(img, cols, rows, 'contain', 0.86)
  const xs: number[] = []
  const ys: number[] = []
  const cs: number[] = []
  for (let j = 0; j < rows; j++) {
    for (let i = 0; i < cols; i++) {
      const k = (j * cols + i) * 4
      if (data[k + 3] < 140) continue
      xs.push(i * step)
      ys.push(j * step)
      cs.push(pack(data[k], data[k + 1], data[k + 2], 255))
    }
  }
  return toShape(xs, ys, cs)
}

function toShape(xs: number[], ys: number[], cs: number[]): Shape {
  return { x: Float32Array.from(xs), y: Float32Array.from(ys), c: Uint32Array.from(cs), n: xs.length }
}

const load = (src: string) =>
  new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image()
    img.decoding = 'async'
    img.onload = () => resolve(img)
    img.onerror = reject
    img.src = src
  })

/**
 * The home hero's living picture. Star dust gathers into a real photo of students, bursts, and
 * re-forms as the emblem — "thousands of students… one caravan" — then the next photo, and so on.
 * Dots shy away from the pointer. Pixels are written straight into an ImageData buffer, so a few
 * thousand dots stay smooth on mid-range phones. Runs only while on screen; with reduced motion
 * the first photo is drawn once and stays.
 */
export function HeroParticles({ scenes, emblemCaption, label }: { scenes: Scene[]; emblemCaption: string; label: string }) {
  const box = useRef<HTMLDivElement>(null)
  const canvas = useRef<HTMLCanvasElement>(null)
  const [caption, setCaption] = useState<string | null>(null)

  useEffect(() => {
    const el = canvas.current
    const wrap = box.current
    if (!el || !wrap) return
    const ctx = el.getContext('2d')
    if (!ctx) return
    const calm = matchMedia('(prefers-reduced-motion: reduce)').matches
    let disposed = false
    let running = false
    let raf = 0
    let cleanup = () => {}
    const pointer = { x: -9999, y: -9999 }

    const start = async () => {
      const [emblemImg, ...photoImgs] = await Promise.all([
        load('/brand/logo-legacy.png'),
        ...scenes.map((s) => load(s.src).catch(() => null)),
      ])
      if (disposed) return
      const photos = scenes.map((s, i) => ({ caption: s.caption, img: photoImgs[i] })).filter((p): p is { caption: string; img: HTMLImageElement } => !!p.img)

      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      const W = wrap.clientWidth
      const H = wrap.clientHeight
      const cw = Math.round(W * dpr)
      const ch = Math.round(H * dpr)
      el.width = cw
      el.height = ch
      const narrow = W < 520
      const step = narrow ? 4.5 : 4
      const dot = Math.max(2, Math.round(step * dpr * 0.78))

      // Scenes alternate: photo → emblem → next photo → emblem …
      const emblem = sampleEmblem(emblemImg, W, H, step)
      const seq: { shape: Shape; caption: string; hold: number }[] = []
      for (const p of photos) {
        seq.push({ shape: samplePhoto(p.img, W, H, step), caption: p.caption, hold: 4600 })
        seq.push({ shape: emblem, caption: emblemCaption, hold: 3600 })
      }
      if (!seq.length) seq.push({ shape: emblem, caption: emblemCaption, hold: 5000 })

      const n = Math.max(...seq.map((s) => s.shape.n))
      const image = ctx.createImageData(cw, ch)
      const buf = new Uint32Array(image.data.buffer)

      const draw = (xs: Float32Array, ys: Float32Array, cols: Uint32Array, count: number) => {
        buf.fill(0)
        for (let i = 0; i < count; i++) {
          const x0 = (xs[i] * dpr) | 0
          const y0 = (ys[i] * dpr) | 0
          if (x0 < 0 || y0 < 0 || x0 + dot > cw || y0 + dot > ch) continue
          const col = cols[i]
          for (let y = y0; y < y0 + dot; y++) buf.fill(col, y * cw + x0, y * cw + x0 + dot)
        }
        ctx.putImageData(image, 0, 0)
      }

      if (calm) {
        draw(seq[0].shape.x, seq[0].shape.y, seq[0].shape.c, seq[0].shape.n)
        setCaption(seq[0].caption)
        return
      }

      // Particle state: position, velocity, target, colour (as floats) and target colour.
      const px = new Float32Array(n)
      const py = new Float32Array(n)
      const vx = new Float32Array(n)
      const vy = new Float32Array(n)
      const tx = new Float32Array(n)
      const ty = new Float32Array(n)
      const cr = new Float32Array(n)
      const cg = new Float32Array(n)
      const cb = new Float32Array(n)
      const ca = new Float32Array(n)
      const trg = new Uint32Array(n)
      const tw = new Float32Array(n) // twinkle phase for loose stars
      const loose = new Uint8Array(n)
      const out = new Uint32Array(n)
      for (let i = 0; i < n; i++) {
        px[i] = Math.random() * W
        py[i] = Math.random() * H
        cr[i] = cg[i] = cb[i] = 220
        ca[i] = 60 + Math.random() * 120
        tw[i] = Math.random() * Math.PI * 2
        loose[i] = 1
        trg[i] = pack(200, 220, 235, 90)
        tx[i] = px[i]
        ty[i] = py[i]
      }

      const aim = (shape: Shape) => {
        const cx = W / 2
        const cy = H / 2
        for (let i = 0; i < n; i++) {
          // A burst outwards with a twist, so each change feels like a breath rather than a slide.
          const dx = px[i] - cx
          const dy = py[i] - cy
          const d = Math.sqrt(dx * dx + dy * dy) + 1
          const f = 3 + Math.random() * 5
          vx[i] += (dx / d) * f - (dy / d) * f * 0.6
          vy[i] += (dy / d) * f + (dx / d) * f * 0.6
          if (i < shape.n) {
            // Shuffle who goes where, so the picture assembles from everywhere at once.
            const j = (i * 7919) % shape.n
            tx[i] = shape.x[j]
            ty[i] = shape.y[j]
            trg[i] = shape.c[j]
            loose[i] = 0
          } else {
            tx[i] = Math.random() * W
            ty[i] = Math.random() * H
            trg[i] = pack(190, 215, 235, 70)
            loose[i] = 1
          }
        }
      }

      let scene = -1
      let nextAt = performance.now() + 900 // a moment of star dust first

      const tick = (now: number) => {
        if (now >= nextAt) {
          scene = (scene + 1) % seq.length
          aim(seq[scene].shape)
          setCaption(seq[scene].caption)
          nextAt = now + seq[scene].hold
        }
        const breathe = now * 0.0012
        for (let i = 0; i < n; i++) {
          vx[i] += (tx[i] - px[i]) * 0.014
          vy[i] += (ty[i] - py[i]) * 0.014
          const dx = px[i] - pointer.x
          const dy = py[i] - pointer.y
          const d2 = dx * dx + dy * dy
          if (d2 < 4900) {
            const f = ((4900 - d2) / 4900) * 2.4
            const d = Math.sqrt(d2) + 0.5
            vx[i] += (dx / d) * f
            vy[i] += (dy / d) * f
          }
          vx[i] *= 0.82
          vy[i] *= 0.82
          px[i] += vx[i]
          py[i] += vy[i]
          if (loose[i]) {
            tx[i] += Math.sin(breathe + tw[i]) * 0.08
            ty[i] -= 0.05
            if (ty[i] < -4) ty[i] = py[i] = H + 2
          }
          const t = trg[i]
          cr[i] += ((t & 255) - cr[i]) * 0.08
          cg[i] += (((t >>> 8) & 255) - cg[i]) * 0.08
          cb[i] += (((t >>> 16) & 255) - cb[i]) * 0.08
          ca[i] += ((t >>> 24) - ca[i]) * 0.06
          const a = loose[i] ? ca[i] * (0.55 + 0.45 * Math.sin(breathe * 2 + tw[i])) : ca[i]
          out[i] = pack(cr[i] | 0, cg[i] | 0, cb[i] | 0, a | 0)
        }
        draw(px, py, out, n)
        if (running) raf = requestAnimationFrame(tick)
      }

      const io = new IntersectionObserver(([e]) => {
        if (e.isIntersecting && !running && !document.hidden) {
          running = true
          raf = requestAnimationFrame(tick)
        } else if (!e.isIntersecting && running) {
          running = false
          cancelAnimationFrame(raf)
        }
      })
      io.observe(wrap)
      const onVisibility = () => {
        if (document.hidden) {
          running = false
          cancelAnimationFrame(raf)
        } else {
          io.unobserve(wrap)
          io.observe(wrap)
        }
      }
      document.addEventListener('visibilitychange', onVisibility)
      cleanup = () => {
        io.disconnect()
        document.removeEventListener('visibilitychange', onVisibility)
      }
    }

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
    // Start once the page is idle, so the hero text and first paint never wait on the photos.
    const begin = () => {
      start().catch(() => {})
    }
    if (typeof window.requestIdleCallback === 'function') window.requestIdleCallback(begin, { timeout: 1500 })
    else setTimeout(begin, 200)
    return () => {
      disposed = true
      running = false
      cancelAnimationFrame(raf)
      cleanup()
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
    }
  }, [scenes, emblemCaption])

  return (
    <div className="relative">
      <div ref={box} role="img" aria-label={label} className="relative mx-auto aspect-square w-full max-w-[560px]">
        <canvas ref={canvas} className="absolute inset-0 size-full touch-pan-y" aria-hidden="true" />
      </div>
      <p aria-hidden="true" className="hero-caption pointer-events-none absolute inset-x-0 bottom-[2%] flex justify-center">
        {caption && (
          <span key={caption} className="rounded-full bg-white/10 px-4 py-1.5 text-[0.92rem] font-semibold text-white/90 ring-1 ring-white/15 backdrop-blur-md">
            {caption}
          </span>
        )}
      </p>
    </div>
  )
}
