/**
 * App icons for the web manifest, generated from the branch logo.
 *
 *   npx tsx scripts/make-icons.ts [path/to/logo.png|svg]
 *
 * The legacy logo is only 100×100 px; when the branch sends the vector logo, run this again with
 * it and the icons become sharp at every size.
 */
import fs from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const source = process.argv[2] || 'public/brand/logo-legacy.png'
const outDir = 'public/icons'
fs.mkdirSync(outDir, { recursive: true })

async function icon(size: number, logoShare: number, file: string, background = '#ffffff') {
  const logoSize = Math.round(size * logoShare)
  const logo = await sharp(source, { density: 600 }).resize(logoSize, logoSize, { fit: 'contain', kernel: 'lanczos3', background: { r: 0, g: 0, b: 0, alpha: 0 } }).png().toBuffer()
  await sharp({ create: { width: size, height: size, channels: 4, background } })
    .composite([{ input: logo, gravity: 'center' }])
    .png({ compressionLevel: 9 })
    .toFile(path.join(outDir, file))
  console.log(`${file} (${size}px)`)
}

await icon(192, 0.8, 'icon-192.png')
await icon(512, 0.8, 'icon-512.png')
// Maskable icons are cropped to a circle or squircle: keep the logo inside the central safe zone.
await icon(512, 0.58, 'icon-maskable-512.png')
await icon(180, 0.78, 'apple-touch-icon.png')
await icon(48, 0.9, 'favicon-48.png')
