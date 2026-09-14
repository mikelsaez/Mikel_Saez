import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const distDir = path.join(root, 'dist')
const content = JSON.parse(await readFile(path.join(root, 'src/data/content.json'), 'utf8'))
const baseHtml = await readFile(path.join(distDir, 'index.html'), 'utf8')
const siteOrigin = 'https://saezdevicuna.eus'

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
}

function escapeAttribute(value) {
  return escapeHtml(value)
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function replaceAttribute(html, selectorPattern, attribute, value) {
  return html.replace(selectorPattern, (tag) => (
    tag.replace(new RegExp(`${attribute}="[^"]*"`), `${attribute}="${escapeAttribute(value)}"`)
  ))
}

for (const [locale, { seo }] of Object.entries(content)) {
  let html = baseHtml
    .replace(/<html lang="[^"]+">/, `<html lang="${locale}">`)
    .replace(/<title>[^<]*<\/title>/, `<title>${escapeHtml(seo.title)}</title>`)

  html = replaceAttribute(html, /<meta name="description"[^>]*>/, 'content', seo.description)
  html = replaceAttribute(html, /<meta property="og:title"[^>]*>/, 'content', seo.title)
  html = replaceAttribute(html, /<meta property="og:description"[^>]*>/, 'content', seo.description)
  html = replaceAttribute(html, /<meta property="og:url"[^>]*>/, 'content', `${siteOrigin}/${locale}/`)
  html = replaceAttribute(html, /<meta name="twitter:title"[^>]*>/, 'content', seo.title)
  html = replaceAttribute(html, /<meta name="twitter:description"[^>]*>/, 'content', seo.description)
  html = replaceAttribute(html, /<link rel="canonical"[^>]*>/, 'href', `${siteOrigin}/${locale}/`)

  const localeDirectory = path.join(distDir, locale)
  await mkdir(localeDirectory, { recursive: true })
  await writeFile(path.join(localeDirectory, 'index.html'), html)
}

console.log(`Generated localized HTML for: ${Object.keys(content).join(', ')}`)
