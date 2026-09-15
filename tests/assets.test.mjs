import assert from 'node:assert/strict'
import { readFile, stat } from 'node:fs/promises'
import path from 'node:path'
import test from 'node:test'
import { fileURLToPath } from 'node:url'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const shared = JSON.parse(await readFile(path.join(root, 'src/data/shared.json'), 'utf8'))
const aboutStyles = await readFile(path.join(root, 'src/components/AboutSection.css'), 'utf8')
const aboutSource = await readFile(path.join(root, 'src/components/AboutSection.jsx'), 'utf8')

test('all CMS-managed image references resolve to local public files', async () => {
  const imagePaths = [
    shared.aboutImage,
    ...shared.projectPins.map(({ img }) => img).filter(Boolean),
    ...shared.partnerLogos.map(({ image }) => image),
  ]

  await Promise.all(imagePaths.map(async (imagePath) => {
    assert.match(imagePath, /^\/img\//, `${imagePath} must use the managed /img/ folder`)
    const file = await stat(path.join(publicDir, imagePath.slice(1)))
    assert.ok(file.isFile(), `${imagePath} does not resolve to a file`)
    assert.ok(file.size > 0, `${imagePath} is empty`)
  }))
})

test('about portrait uses the client-approved artwork without color processing', async () => {
  const clientArtworkPath = path.join(publicDir, 'img/about-portrait-client.png')
  const clientArtwork = await readFile(clientArtworkPath)
  const clientArtworkFile = await stat(clientArtworkPath)

  assert.equal(shared.aboutImage, '/img/about-portrait-client.png')
  assert.ok(clientArtworkFile.size > 0 && clientArtworkFile.size < 1024 * 1024)
  assert.equal(clientArtwork.readUInt32BE(16), 360)
  assert.equal(clientArtwork.readUInt32BE(20), 360)
  assert.match(aboutStyles, /mix-blend-mode:\s*normal/)
  assert.match(aboutStyles, /\.about__photo--client\s*{[^}]*filter:\s*none/s)
  assert.match(aboutSource, /about__photo about__photo--client/)
  assert.doesNotMatch(aboutSource, /about__photo--subject/)
  assert.doesNotMatch(aboutStyles, /about-portrait-subject-mask/)
})

test('shared contact links and project coordinates are valid', () => {
  assert.match(shared.contact.emailUrl, /^mailto:[^\s@]+@[^\s@]+\.[^\s@]+$/)
  assert.match(shared.contact.linkedinUrl, /^https:\/\/(www\.)?linkedin\.com\//)

  shared.projectPins.forEach(({ key, lat, lng }) => {
    assert.match(key, /^[a-z0-9-]+$/)
    assert.ok(Number.isFinite(lat) && lat >= -90 && lat <= 90, `${key} has invalid latitude`)
    assert.ok(Number.isFinite(lng) && lng >= -180 && lng <= 180, `${key} has invalid longitude`)
  })
})

test('the local world map dataset is a populated GeoJSON feature collection', async () => {
  const geojson = JSON.parse(await readFile(path.join(publicDir, 'data/world.geojson'), 'utf8'))
  assert.equal(geojson.type, 'FeatureCollection')
  assert.ok(Array.isArray(geojson.features) && geojson.features.length >= 170)
})

test('critical presentation assets are present and within performance budgets', async () => {
  const video = await stat(path.join(publicDir, 'hero-bg.mp4'))
  const poster = await stat(path.join(publicDir, 'hero-poster.webp'))
  const socialImage = await stat(path.join(publicDir, 'img/image.png'))
  const favicon = await stat(path.join(publicDir, 'favicon.svg'))

  assert.ok(video.size > 0 && video.size < 5 * 1024 * 1024)
  assert.ok(poster.size > 0 && poster.size < 250 * 1024)
  assert.ok(socialImage.size > 0)
  assert.ok(favicon.size > 0 && favicon.size < 10 * 1024)
})
