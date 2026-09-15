import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'
import YAML from 'yaml'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const configSource = await readFile(path.join(root, 'public/admin/config.yml'), 'utf8')
const config = YAML.parse(configSource)
const adminSource = await readFile(path.join(root, 'public/admin/index.html'), 'utf8')
const content = JSON.parse(await readFile(path.join(root, 'src/data/content.json'), 'utf8'))
const shared = JSON.parse(await readFile(path.join(root, 'src/data/shared.json'), 'utf8'))

function collectionFile(collectionName, fileName) {
  const collection = config.collections.find(({ name }) => name === collectionName)
  assert.ok(collection, `Missing CMS collection: ${collectionName}`)
  const file = collection.files.find(({ name }) => name === fileName)
  assert.ok(file, `Missing CMS file: ${collectionName}.${fileName}`)
  return file
}

function assertFieldsMatch(value, fields, fieldPath) {
  assert.ok(value && typeof value === 'object' && !Array.isArray(value), `${fieldPath} must be an object`)
  const configuredNames = new Set(fields.map(({ name }) => name))
  Object.keys(value).forEach((name) => {
    assert.ok(configuredNames.has(name), `${fieldPath}.${name} is not editable in the CMS`)
  })
  fields.filter(({ required }) => required !== false).forEach(({ name }) => {
    assert.ok(Object.hasOwn(value, name), `${fieldPath}.${name} is required by the CMS but missing from data`)
  })

  for (const field of fields) {
    const nextPath = `${fieldPath}.${field.name}`
    const fieldValue = value[field.name]
    if (fieldValue === undefined) continue

    if (field.widget === 'object') {
      assertFieldsMatch(fieldValue, field.fields, nextPath)
    } else if (field.widget === 'list') {
      assert.ok(Array.isArray(fieldValue), `${nextPath} must be an array`)
      if (field.fields) {
        fieldValue.forEach((item, index) => assertFieldsMatch(item, field.fields, `${nextPath}[${index}]`))
      }
    }
  }
}

test('Decap config parses and targets the production Git Gateway branch', () => {
  assert.equal(config.backend.name, 'git-gateway')
  assert.equal(config.backend.branch, 'main')
  assert.equal(config.site_url, 'https://saezdevicuna.eus')
  assert.equal(config.publish_mode, 'editorial_workflow')
  assert.equal(config.show_preview_links, true)
})

test('Decap local backend is loopback-only and disables Editorial Workflow only on localhost', () => {
  assert.equal(config.local_backend.url, 'http://127.0.0.1:8081/api/v1')
  assert.match(adminSource, /window\.CMS_MANUAL_INIT = true/)
  assert.match(adminSource, /\['localhost', '127\.0\.0\.1'\]/)
  assert.match(adminSource, /window\.initCMS\(\{ config: \{ publish_mode: 'simple' \} \}\)/)
  assert.match(adminSource, /else\s*\{\s*window\.initCMS\(\)/)
})

test('Decap single-file localization is enabled for English, Spanish and Basque', () => {
  assert.equal(config.i18n.structure, 'single_file')
  assert.deepEqual(config.i18n.locales, ['en', 'es', 'eu'])
  assert.equal(config.i18n.default_locale, 'en')

  const localizedFile = collectionFile('localized_content', 'content')
  assert.equal(localizedFile.file, 'src/data/content.json')
  assert.equal(localizedFile.i18n, true)
  Object.entries(content).forEach(([locale, data]) => {
    assertFieldsMatch(data, localizedFile.fields, `content.${locale}`)
  })
})

test('Decap uses the reliable single-pane locale editor', () => {
  const localizedCollection = config.collections.find(({ name }) => name === 'localized_content')

  assert.match(localizedCollection.description, /locale selector to edit English, Spanish and Basque/)
  assert.match(adminSource, /localStorage\.setItem\('cms\.i18n-visible', 'false'\)/)
  assert.match(adminSource, /button\[title="Toggle i18n"\]/)
})

test('all shared data remains editable through the shared-settings collection', () => {
  const sharedFile = collectionFile('shared_settings', 'shared')
  assert.equal(sharedFile.file, 'src/data/shared.json')
  assertFieldsMatch(shared, sharedFile.fields, 'shared')
})

test('image fields enforce the five-megabyte upload limit without a global media provider override', () => {
  assert.equal(config.media_library, undefined)

  const sharedFile = collectionFile('shared_settings', 'shared')
  const imageFields = []
  const walk = (fields) => fields.forEach((field) => {
    if (field.widget === 'image') imageFields.push(field)
    if (field.fields) walk(field.fields)
  })
  walk(sharedFile.fields)

  assert.equal(imageFields.length, 3)
  imageFields.forEach((field) => {
    assert.equal(field.choose_url, false)
    assert.equal(field.media_library.config.max_file_size, 5 * 1024 * 1024)
  })
})
