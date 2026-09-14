import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const dist = path.join(root, 'dist')
const siteOrigin = 'https://saezdevicuna.eus'
const content = JSON.parse(await readFile(path.join(root, 'src/data/content.json'), 'utf8'))

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

for (const [locale, { seo }] of Object.entries(content)) {
  const html = await readFile(path.join(dist, locale, 'index.html'), 'utf8')
  assert.match(html, new RegExp(`<html lang="${locale}">`))
  assert.ok(html.includes(`<title>${escapeHtml(seo.title)}</title>`), `${locale} title is not localized`)
  assert.ok(html.includes(`rel="canonical" href="${siteOrigin}/${locale}/"`), `${locale} canonical is incorrect`)
  assert.ok(!html.includes('/src/main.jsx'), `${locale} still references the development entry point`)
}

const requiredFiles = [
  '_headers',
  '_redirects',
  'admin/config.yml',
  'admin/index.html',
  'auth-redirect.js',
  'data/world.geojson',
  'favicon.svg',
  'hero-bg.mp4',
  'hero-poster.webp',
  'robots.txt',
  'sitemap.xml',
]

await Promise.all(requiredFiles.map((file) => stat(path.join(dist, file))))
const heroVideo = await stat(path.join(dist, 'hero-bg.mp4'))
assert.ok(heroVideo.size < 5 * 1024 * 1024, 'Hero video exceeds the five-megabyte performance budget')

console.log(`Verified localized production output and ${requiredFiles.length} required public files`)
