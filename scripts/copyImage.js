import fs from 'fs'
import path from 'path'

const args = process.argv.slice(2)
if (args.length === 0) {
  console.error('Usage: node scripts/copyImage.js <path-to-image>')
  process.exit(1)
}

const src = args[0]
if (!fs.existsSync(src)) {
  console.error('Source file does not exist:', src)
  process.exit(2)
}

const imagesDir = path.resolve(process.cwd(), 'src', 'assets', 'images')
if (!fs.existsSync(imagesDir)) fs.mkdirSync(imagesDir, { recursive: true })

const base = path.basename(src)
const dest = path.join(imagesDir, base)

fs.copyFileSync(src, dest)
console.log('Copied', src, '->', dest)
