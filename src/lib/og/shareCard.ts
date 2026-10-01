import { readFileSync } from 'node:fs'
import path from 'node:path'

import { isUrgentCategory } from '@/lib/taxonomy'

/**
 * Branded 1200×630 share card (Facebook/Telegram/WhatsApp preview) as a standalone HTML page,
 * in the site's design system (docs/design/system.md): star lattice, sea-blue accents, navy
 * footer. Rendered by real Chromium (see render.ts) because Satori/next/og cannot shape Bangla
 * (docs/spikes/og-bangla.md).
 */

const root = process.cwd()
let assetsCache: { bold: string; medium: string; logo: string } | undefined

function assets() {
  assetsCache ??= {
    bold: `data:font/ttf;base64,${readFileSync(path.join(root, 'src/assets/fonts/HindSiliguri-Bold.ttf')).toString('base64')}`,
    medium: `data:font/ttf;base64,${readFileSync(path.join(root, 'src/assets/fonts/HindSiliguri-Medium.ttf')).toString('base64')}`,
    logo: `data:image/png;base64,${readFileSync(path.join(root, 'public/brand/logo-legacy.png')).toString('base64')}`,
  }
  return assetsCache
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export type ShareCardInput = {
  title: string
  kicker?: string // category label, e.g. "বিবৃতি"
  category?: string // category value, decides red vs blue tag
  meta?: string // formatted date
  siteLabel?: string
}

export function shareCardHtml({ title, kicker, category, meta, siteLabel = 'cushibir.org' }: ShareCardInput): string {
  const a = assets()
  // Longer titles step down so they always fit in three lines.
  const size = title.length > 90 ? 56 : title.length > 55 ? 64 : 74
  const tag = category && isUrgentCategory(category) ? '#c0262d' : 'linear-gradient(120deg,#1f8fcf,#114575)'

  return `<!doctype html><html lang="bn"><head><meta charset="utf-8">
<style>
@font-face{font-family:'Hind';src:url(${a.bold}) format('truetype');font-weight:700}
@font-face{font-family:'Hind';src:url(${a.medium}) format('truetype');font-weight:500}
*{margin:0;box-sizing:border-box}
html,body{width:1200px;height:630px}
body{position:relative;overflow:hidden;color:#0b1f33;font-family:'Hind',sans-serif;font-weight:500;
  background:linear-gradient(192deg,rgba(255,255,255,0) 6%,rgba(227,238,246,.85) 42%,rgba(207,227,240,.6) 80%),#f5f8fb}
.grid{position:absolute;inset:0;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='88' viewBox='0 0 88 88'%3E%3Cg fill='none' stroke='%230b6fa4' stroke-opacity='.09' stroke-width='1'%3E%3Cpath d='M44 20 68 44 44 68 20 44Z'/%3E%3Cpath d='M27 27h34v34H27z'/%3E%3Cpath d='M27 27 0 0M61 27 88 0M61 61l27 27M27 61 0 88M44 20V0M68 44h20M44 68v20M20 44H0'/%3E%3C/g%3E%3C/svg%3E");background-size:88px 88px}
.brand{position:absolute;left:64px;top:48px;display:flex;align-items:center;gap:14px;background:#fff;border-radius:999px;padding:8px 26px 8px 8px;font-size:26px;box-shadow:0 4px 24px rgba(11,31,51,.08)}
.brand img{width:52px;height:52px}
.body{position:absolute;left:64px;right:64px;top:160px}
.tag{display:inline-block;background:${tag};color:#fff;padding:2px 18px 6px;border-radius:10px;font-size:26px;font-weight:700;margin-bottom:18px}
h1{font-weight:700;font-size:${size}px;line-height:1.38;max-width:1060px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden}
.foot{position:absolute;left:0;right:0;bottom:0;height:84px;background:#0e2e4d;color:#fff;display:flex;align-items:center;justify-content:space-between;padding:0 64px;font-size:26px;border-top:4px solid transparent;border-image:linear-gradient(90deg,#1fa3dc,#5cc8f2) 1}
.foot b{color:#5cc8f2;font-weight:700}
</style></head><body>
<div class="grid"></div>
<div class="brand"><img src="${a.logo}" alt=""><span>বাংলাদেশ ইসলামী ছাত্রশিবির · চবি শাখা</span></div>
<div class="body">${kicker ? `<span class="tag">${esc(kicker)}</span>` : ''}<h1>${esc(title)}</h1></div>
<div class="foot"><span>${meta ? esc(meta) : ''}</span><b>${esc(siteLabel)}</b></div>
</body></html>`
}
