import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import { getLocaleFromPathname, getLocalePath, LOCALES, normalizeLocale } from '../src/i18n/locales.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const content = JSON.parse(await readFile(path.join(root, 'src/data/content.json'), 'utf8'))
const shared = JSON.parse(await readFile(path.join(root, 'src/data/shared.json'), 'utf8'))
const locales = ['en', 'es', 'eu']
const allowedCategories = ['ECOSYSTEM', 'TERRITORIES', 'SEEDS', 'ROOTS', 'BLOOM', 'HARVEST']
const richTextPaths = [
  /^hero\.heading$/,
  /^hero\.stats\.\d+\.value$/,
  /^intro\.(heading|paragraph)$/,
  /^projects\.heading$/,
  /^expertise\.heading$/,
  /^worldMap\.heading$/,
  /^about\.heading$/,
  /^impact\.heading$/,
  /^partners\.heading$/,
  /^contact\.(heading|paragraph)$/,
]

function shape(value) {
  if (Array.isArray(value)) return ['array', value.length, ...value.map(shape)]
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, shape(value[key])]))
  }
  return typeof value
}

function walkStrings(value, visit, pathParts = []) {
  if (typeof value === 'string') {
    visit(value, pathParts)
    return
  }

  if (Array.isArray(value)) {
    value.forEach((item, index) => walkStrings(item, visit, [...pathParts, String(index)]))
    return
  }

  if (value && typeof value === 'object') {
    Object.entries(value).forEach(([key, item]) => walkStrings(item, visit, [...pathParts, key]))
  }
}

test('all three locales are present and structurally complete', () => {
  assert.deepEqual(Object.keys(content), locales)
  for (const locale of locales.slice(1)) {
    assert.deepEqual(shape(content[locale]), shape(content.en), `${locale} content structure differs from English`)
  }
})

test('localized strings are non-empty and contain only permitted markup', () => {
  for (const locale of locales) {
    walkStrings(content[locale], (value, pathParts) => {
      const fieldPath = pathParts.join('.')
      if (pathParts.at(-1) !== 'suffix') {
        assert.ok(value.trim(), `${locale}.${fieldPath} is empty`)
      }
      const withoutAllowedMarkup = value.replace(/<\/?em>/gi, '').replace(/<br\s*\/?\s*>/gi, '')
      assert.ok(!/[<>]/.test(withoutAllowedMarkup), `${locale}.${fieldPath} contains unsupported markup`)

      if (/[<>]/.test(value)) {
        assert.ok(richTextPaths.some((pattern) => pattern.test(fieldPath)), `${locale}.${fieldPath} does not support markup`)
        let emphasisDepth = 0
        for (const [token] of value.matchAll(/<\/?em>/gi)) {
          emphasisDepth += /^<em>$/i.test(token) ? 1 : -1
          assert.ok(emphasisDepth >= 0 && emphasisDepth <= 1, `${locale}.${fieldPath} has invalid emphasis nesting`)
        }
        assert.equal(emphasisDepth, 0, `${locale}.${fieldPath} has unclosed emphasis markup`)
      }
    })
  }
})

test('project keys match shared project metadata in every locale', () => {
  const expectedKeys = shared.projectPins.map(({ key }) => key).sort()
  assert.equal(new Set(expectedKeys).size, expectedKeys.length, 'Shared project keys must be unique')

  for (const locale of locales) {
    const localizedKeys = content[locale].worldMap.pins.map(({ key }) => key).sort()
    assert.deepEqual(localizedKeys, expectedKeys, `${locale} project keys do not match shared settings`)
  }
})

test('all expertise categories are stable across locales', () => {
  for (const locale of locales) {
    const categories = content[locale].expertise.cards.map(({ category }) => category)
    assert.deepEqual(categories, allowedCategories)
  }
  shared.projectPins.forEach(({ category }) => assert.ok(allowedCategories.includes(category)))
})

test('template tokens required by the interface are preserved', () => {
  const requiredTokens = {
    switchLanguage: ['{language}'],
    viewCategoryProjects: ['{category}'],
    projectCount: ['{count}'],
    mapMarkerLabel: ['{title}', '{country}'],
    slideOf: ['{current}', '{total}'],
  }

  for (const locale of locales) {
    for (const [field, tokens] of Object.entries(requiredTokens)) {
      tokens.forEach((token) => assert.ok(content[locale].ui[field].includes(token), `${locale}.ui.${field} must include ${token}`))
    }
  }
})

test('locale path helpers normalize supported routes', () => {
  assert.equal(normalizeLocale('ES-es'), 'es')
  assert.equal(normalizeLocale('fr'), null)
  assert.equal(getLocaleFromPathname('/eu/'), 'eu')
  assert.equal(getLocaleFromPathname('/unknown/'), null)
  assert.equal(getLocalePath('es', '#contact'), '/es/#contact')
})

test('language switcher keeps fixed EN, ES and EU codes', async () => {
  assert.deepEqual(
    LOCALES.map(({ code, shortLabel }) => ({ code, shortLabel })),
    [
      { code: 'en', shortLabel: 'EN' },
      { code: 'es', shortLabel: 'ES' },
      { code: 'eu', shortLabel: 'EU' },
    ],
  )

  const heroSource = await readFile(path.join(root, 'src/components/HeroSection.jsx'), 'utf8')
  assert.ok(heroSource.includes('{shortLabel}'), 'Visible language labels must use the fixed locale codes')
  assert.ok(heroSource.includes('translate="no"'), 'Language switcher must opt out of automatic translation')
  assert.ok(heroSource.includes('notranslate'), 'Language switcher must include the Google translation guard')
})

test('legacy machine translation is removed', async () => {
  const indexHtml = await readFile(path.join(root, 'index.html'), 'utf8')
  assert.ok(!indexHtml.includes('translate.google.com'))
  assert.ok(!indexHtml.includes('googtrans'))
})
