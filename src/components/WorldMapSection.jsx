import { useEffect, useRef, useState } from 'react'
import { MapContainer, GeoJSON, Marker, Tooltip, useMap } from 'react-leaflet'
import Papa from 'papaparse'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './WorldMapSection.css'

// ─── Pin images (original hardcoded imports) ──────────────────────────────────
import imgMicrosoft from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.14.23.png'
import imgIberia from '../assets/img/iberia_47510952881897_thumb.png'
import imgVillaConchi from '../assets/img/IMG_0181-scaled.jpg'
import imgWineRoutes from '../assets/img/Captura-de-pantalla-2026-03-18-a-las-23.00.16.png'
import imgGeneralAssembly from '../assets/img/199.jpeg'
import imgMission300 from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-18.28.14-scaled.png'
import imgWorldBank from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-18.33.53.png'
import imgVitoria from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.27.00.png'
import imgIDBHousing from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.28.09.png'
import imgU20 from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.30.14.png'
import imgCOP16 from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.32.23.png'
import imgVinexpo from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-20.20.32.png'
import imgUNWTO from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-20.29.07.png'

// ─── Original hardcoded pins (always present) ─────────────────────────────────
const HARDCODED_PINS = [
  {
    id: 1,
    title: 'Microsoft Mkt & Operations Europa HQ',
    cat: 'SEEDS',
    country: 'EUROPE',
    lat: 52.37,
    lng: 4.9,
    img: imgMicrosoft,
    desc: 'Marketing and Operations support to Europe HQ team, in NATO and EU Institutions stakeholders coordination events.',
  },
  {
    id: 2,
    title: 'Iberia Airlines – Inflight Wine & Dining Experience',
    cat: 'SEEDS',
    country: 'SPAIN',
    lat: 41.2,
    lng: -4.8,
    img: imgIberia,
    desc: 'Strategic communication and branding coordination for pioneering wines serving in all business class routes.',
  },
  {
    id: 3,
    title: 'Mercedes Benz Fashion Week & Golf Trophy',
    cat: 'SEEDS',
    country: 'SPAIN',
    lat: 38.9,
    lng: -2.2,
    img: imgVillaConchi,
    desc: 'Strategic communication and branding support for Madrid Fashion Week and Golf Trophy Tournament.',
  },
  {
    id: 4,
    title: 'Wine Routes of the World – UN Tourism',
    cat: 'ROOTS',
    country: 'GLOBAL',
    lat: 48.85,
    lng: 2.35,
    img: imgWineRoutes,
    desc: 'Publication design, content curation, international platforms and partnerships across institutions, sectors and regions.',
  },
  {
    id: 5,
    title: 'UN Tourism General Assembly',
    cat: 'ROOTS',
    country: 'RUSSIA',
    lat: 55.75,
    lng: 37.6,
    img: imgGeneralAssembly,
    desc: 'Liason with UN Tourism organization supporting with Spanish Fine Wines Institute project.',
  },
  {
    id: 6,
    title: 'Mission 300 – Africa Electrification Initiative',
    cat: 'ROOTS',
    country: 'AFRICA',
    lat: 0.0,
    lng: 25.0,
    img: imgMission300,
    desc: 'Supporting the coordination of Community of Practice, knowledge products, webinars sessions and workshops platform.',
  },
  {
    id: 7,
    title: 'World Bank – Change Management',
    cat: 'BLOOM',
    country: 'USA',
    lat: 38.9,
    lng: -77.0,
    img: imgWorldBank,
    desc: 'Supporting organizations teams worldwide in transformation, enabling change adoption, processes, new ways of working and institutional innovation.',
  },
  {
    id: 8,
    title: 'Vitoria-Gasteiz 2030 Urban Innovation Project',
    cat: 'TERRITORIES',
    country: 'BASQUE COUNTRY',
    lat: 42.85,
    lng: -2.68,
    img: imgVitoria,
    desc: 'Academic projects focused on cities, local identity, sustainable development and 2030 Agenda territorial strategies.',
  },
  {
    id: 9,
    title: 'IDB Regional Housing Forum',
    cat: 'TERRITORIES',
    country: 'MEXICO',
    lat: 19.43,
    lng: -99.13,
    img: imgIDBHousing,
    desc: 'Support the organization of the high level event, focused on housing market, regional development, urban and sustainable territorial strategies.',
  },
  {
    id: 10,
    title: 'U20 Mayors Summit',
    cat: 'TERRITORIES',
    country: 'BRAZIL',
    lat: -15.78,
    lng: -47.93,
    img: imgU20,
    desc: 'During Brazil G20 presidency, Latin American Mayors Network Summit, focused on cities, regional development.',
  },
  {
    id: 11,
    title: 'COP16 & COP30 – Amazon Cities Network',
    cat: 'ECOSYSTEM',
    country: 'COLOMBIA',
    lat: 3.86,
    lng: -77.04,
    img: imgCOP16,
    desc: 'Community of Practice and communication initiatives supporting climate transition and sustainability agendas for Amazonian cities.',
  },
  {
    id: 12,
    title: 'VINEXPO Shanghai & Hong Kong',
    cat: 'TERRITORIES',
    country: 'ASIA',
    lat: 31.23,
    lng: 121.47,
    img: imgVinexpo,
    desc: 'Trade show stand design and construction with coordinated brand presence and sales campaigns to grow market share in Asia.',
  },
  {
    id: 13,
    title: '4th UNWTO Global Conference on Wine Tourism',
    cat: 'ROOTS',
    country: 'CHILE',
    lat: -34.6,
    lng: -71.2,
    img: imgUNWTO,
    desc: 'Conducted workshop during UNWTO Global Conference on Wine Tourism in Valle de Colchagua, Chile.',
  },
]

// ─── Session-storage cache key ────────────────────────────────────────────────
const CACHE_KEY = 'wm_csv_pins_cache_v5'

// ─── Google Sheets CSV URL ────────────────────────────────────────────────────
const CSV_URL =
  'https://docs.google.com/spreadsheets/d/e/2PACX-1vT3H8v6rhQ17zSlb4kKNjvJY494_hclvQ1JcrdsoDIxhLZYDD9h9fagpC7SGzXA5EUSO2nLEXJUBczn/pub?output=csv'

// ─── 100+ major world cities → { lat, lng } lookup ───────────────────────────
const CITY_COORDS = {
  // Europe
  'Amsterdam': { lat: 52.37, lng: 4.90 },
  'Athens': { lat: 37.98, lng: 23.73 },
  'Barcelona': { lat: 41.39, lng: 2.15 },
  'Belgrade': { lat: 44.80, lng: 20.46 },
  'Berlin': { lat: 52.52, lng: 13.40 },
  'Bern': { lat: 46.95, lng: 7.45 },
  'Bilbao': { lat: 43.26, lng: -2.93 },
  'Brussels': { lat: 50.85, lng: 4.35 },
  'Bucharest': { lat: 44.43, lng: 26.10 },
  'Budapest': { lat: 47.50, lng: 19.04 },
  'Copenhagen': { lat: 55.68, lng: 12.57 },
  'Dublin': { lat: 53.33, lng: -6.25 },
  'Helsinki': { lat: 60.17, lng: 24.94 },
  'Istanbul': { lat: 41.01, lng: 28.96 },
  'Kiev': { lat: 50.45, lng: 30.52 },
  'Kyiv': { lat: 50.45, lng: 30.52 },
  'Lisbon': { lat: 38.72, lng: -9.14 },
  'Ljubljana': { lat: 46.05, lng: 14.51 },
  'London': { lat: 51.51, lng: -0.13 },
  'Luxembourg': { lat: 49.61, lng: 6.13 },
  'Madrid': { lat: 40.42, lng: -3.70 },
  'Milan': { lat: 45.46, lng: 9.19 },
  'Minsk': { lat: 53.90, lng: 27.57 },
  'Moscow': { lat: 55.75, lng: 37.62 },
  'Munich': { lat: 48.14, lng: 11.58 },
  'Nicosia': { lat: 35.17, lng: 33.37 },
  'Oslo': { lat: 59.91, lng: 10.75 },
  'Paris': { lat: 48.85, lng: 2.35 },
  'Prague': { lat: 50.08, lng: 14.44 },
  'Reykjavik': { lat: 64.13, lng: -21.82 },
  'Riga': { lat: 56.95, lng: 24.11 },
  'Rome': { lat: 41.90, lng: 12.50 },
  'San Sebastian': { lat: 43.32, lng: -1.98 },
  'Sarajevo': { lat: 43.85, lng: 18.39 },
  'Seville': { lat: 37.39, lng: -5.99 },
  'Skopje': { lat: 41.99, lng: 21.43 },
  'Sofia': { lat: 42.70, lng: 23.32 },
  'Stockholm': { lat: 59.33, lng: 18.07 },
  'Tallinn': { lat: 59.44, lng: 24.75 },
  'Tirana': { lat: 41.33, lng: 19.83 },
  'Valencia': { lat: 39.47, lng: -0.38 },
  'Vienna': { lat: 48.21, lng: 16.37 },
  'Vilnius': { lat: 54.69, lng: 25.28 },
  'Vitoria': { lat: 42.85, lng: -2.67 },
  'Vitoria-Gasteiz': { lat: 42.85, lng: -2.67 },
  'Warsaw': { lat: 52.23, lng: 21.01 },
  'Zagreb': { lat: 45.81, lng: 15.97 },
  'Zurich': { lat: 47.38, lng: 8.54 },
  // Americas
  'Bogota': { lat: 4.71, lng: -74.07 },
  'Bogotá': { lat: 4.71, lng: -74.07 },
  'Boston': { lat: 42.36, lng: -71.06 },
  'Brasilia': { lat: -15.78, lng: -47.93 },
  'Brasília': { lat: -15.78, lng: -47.93 },
  'Buenos Aires': { lat: -34.61, lng: -58.38 },
  'Calgary': { lat: 51.05, lng: -114.07 },
  'Cancun': { lat: 21.16, lng: -86.85 },
  'Caracas': { lat: 10.48, lng: -66.88 },
  'Chicago': { lat: 41.88, lng: -87.63 },
  'Dallas': { lat: 32.78, lng: -96.80 },
  'Denver': { lat: 39.74, lng: -104.98 },
  'Houston': { lat: 29.76, lng: -95.37 },
  'Lima': { lat: -12.05, lng: -77.04 },
  'Los Angeles': { lat: 34.05, lng: -118.24 },
  'Medellín': { lat: 6.25, lng: -75.56 },
  'Medellin': { lat: 6.25, lng: -75.56 },
  'Mexico City': { lat: 19.43, lng: -99.13 },
  'Miami': { lat: 25.77, lng: -80.19 },
  'Montevideo': { lat: -34.90, lng: -56.19 },
  'Montreal': { lat: 45.50, lng: -73.57 },
  'New York': { lat: 40.71, lng: -74.01 },
  'New York City': { lat: 40.71, lng: -74.01 },
  'Ottawa': { lat: 45.42, lng: -75.70 },
  'Panama City': { lat: 8.99, lng: -79.52 },
  'Quito': { lat: -0.23, lng: -78.52 },
  'Rio de Janeiro': { lat: -22.91, lng: -43.17 },
  'San Francisco': { lat: 37.77, lng: -122.42 },
  'San Jose': { lat: 9.93, lng: -84.08 },
  'Santiago': { lat: -33.46, lng: -70.65 },
  'Sao Paulo': { lat: -23.55, lng: -46.63 },
  'São Paulo': { lat: -23.55, lng: -46.63 },
  'Seattle': { lat: 47.61, lng: -122.33 },
  'Toronto': { lat: 43.65, lng: -79.38 },
  'Vancouver': { lat: 49.25, lng: -123.12 },
  'Washington': { lat: 38.91, lng: -77.04 },
  'Washington DC': { lat: 38.91, lng: -77.04 },
  'Washington D.C.': { lat: 38.91, lng: -77.04 },
  // Africa
  'Abidjan': { lat: 5.35, lng: -4.00 },
  'Abuja': { lat: 9.07, lng: 7.40 },
  'Accra': { lat: 5.55, lng: -0.20 },
  'Addis Ababa': { lat: 9.03, lng: 38.74 },
  'Cairo': { lat: 30.06, lng: 31.25 },
  'Cape Town': { lat: -33.93, lng: 18.42 },
  'Casablanca': { lat: 33.59, lng: -7.62 },
  'Dakar': { lat: 14.72, lng: -17.47 },
  'Dar es Salaam': { lat: -6.81, lng: 39.28 },
  'Johannesburg': { lat: -26.20, lng: 28.04 },
  'Kampala': { lat: 0.32, lng: 32.58 },
  'Kigali': { lat: -1.95, lng: 30.06 },
  'Kinshasa': { lat: -4.32, lng: 15.32 },
  'Lagos': { lat: 6.45, lng: 3.40 },
  'Lusaka': { lat: -15.42, lng: 28.28 },
  'Maputo': { lat: -25.97, lng: 32.59 },
  'Nairobi': { lat: -1.29, lng: 36.82 },
  'Rabat': { lat: 34.02, lng: -6.83 },
  'Tunis': { lat: 36.82, lng: 10.17 },
  // Middle East
  'Abu Dhabi': { lat: 24.45, lng: 54.38 },
  'Amman': { lat: 31.96, lng: 35.95 },
  'Ankara': { lat: 39.93, lng: 32.86 },
  'Beirut': { lat: 33.89, lng: 35.50 },
  'Baghdad': { lat: 33.34, lng: 44.40 },
  'Doha': { lat: 25.29, lng: 51.53 },
  'Dubai': { lat: 25.20, lng: 55.27 },
  'Kuwait City': { lat: 29.37, lng: 47.98 },
  'Muscat': { lat: 23.61, lng: 58.59 },
  'Riyadh': { lat: 24.69, lng: 46.72 },
  'Tel Aviv': { lat: 32.08, lng: 34.78 },
  'Tehran': { lat: 35.69, lng: 51.39 },
  // Asia & Oceania
  'Auckland': { lat: -36.86, lng: 174.77 },
  'Bangkok': { lat: 13.75, lng: 100.52 },
  'Beijing': { lat: 39.91, lng: 116.39 },
  'Colombo': { lat: 6.93, lng: 79.85 },
  'Delhi': { lat: 28.66, lng: 77.23 },
  'New Delhi': { lat: 28.61, lng: 77.21 },
  'Dhaka': { lat: 23.72, lng: 90.41 },
  'Hanoi': { lat: 21.03, lng: 105.83 },
  'Ho Chi Minh City': { lat: 10.82, lng: 106.63 },
  'Hong Kong': { lat: 22.33, lng: 114.17 },
  'Jakarta': { lat: -6.21, lng: 106.85 },
  'Karachi': { lat: 24.86, lng: 67.01 },
  'Kathmandu': { lat: 27.72, lng: 85.32 },
  'Kuala Lumpur': { lat: 3.15, lng: 101.69 },
  'Manila': { lat: 14.60, lng: 120.98 },
  'Melbourne': { lat: -37.81, lng: 144.96 },
  'Mumbai': { lat: 19.08, lng: 72.88 },
  'Osaka': { lat: 34.69, lng: 135.50 },
  'Seoul': { lat: 37.57, lng: 126.98 },
  'Shanghai': { lat: 31.23, lng: 121.47 },
  'Singapore': { lat: 1.29, lng: 103.85 },
  'Sydney': { lat: -33.87, lng: 151.21 },
  'Taipei': { lat: 25.04, lng: 121.53 },
  'Tashkent': { lat: 41.30, lng: 69.27 },
  'Tbilisi': { lat: 41.69, lng: 44.83 },
  'Tokyo': { lat: 35.69, lng: 139.69 },
  'Ulaanbaatar': { lat: 47.91, lng: 106.88 },
  'Yangon': { lat: 16.87, lng: 96.19 },
}

// ─── City name → [lat, lng] ───────────────────────────────────────────────────
// Handles plain names ("Paris") and "City, Country" format ("Paris, France")
function cityToLatLng(cityName) {
  if (!cityName) return null
  const full = cityName.trim()
  // Try exact match first
  if (CITY_COORDS[full]) {
    const { lat, lng } = CITY_COORDS[full]
    return [lat, lng]
  }
  // Try just the part before the first comma  e.g. "Paris, France" → "Paris"
  const beforeComma = full.split(',')[0].trim()
  if (beforeComma !== full && CITY_COORDS[beforeComma]) {
    const { lat, lng } = CITY_COORDS[beforeComma]
    return [lat, lng]
  }
  return null
}

// ─── Google Drive share link → embeddable image URL ──────────────────────────
// Converts: https://drive.google.com/file/d/FILE_ID/view?...
// Into:     https://drive.google.com/thumbnail?id=FILE_ID&sz=w600
// (thumbnail endpoint is CORS-safe and works directly as <img src>)
function convertImageUrl(url) {
  if (!url) return null
  const driveMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)
  if (driveMatch) {
    return `https://drive.google.com/thumbnail?id=${driveMatch[1]}&sz=w600`
  }
  return url
}

// ─── Small jitter so CSV pins never stack exactly on a hardcoded pin ──────────
// Applies a deterministic ±0.35° offset based on the pin's id string
function jitterCoords(lat, lng, id) {
  // Use a simple hash of the id string to get a stable, non-random offset
  let hash = 0
  for (let i = 0; i < String(id).length; i++) {
    hash = (hash * 31 + String(id).charCodeAt(i)) & 0xffffffff
  }
  const latOff = ((hash & 0xff) / 255 - 0.5) * 0.7   // ±0.35°
  const lngOff = (((hash >> 8) & 0xff) / 255 - 0.5) * 0.7
  return [lat + latOff, lng + lngOff]
}

// ─── Category colours ────────────────────────────────────────────────────────
const catColor = {
  ECOSYSTEM: '#6a8ab8',
  TERRITORIES: '#8ab86a',
  SEEDS: '#c4a96a',
  ROOTS: '#6aacb8',
  BLOOM: '#d4a86a',
  HARVEST: '#b86a8a',
}

// ─── GeoJSON country style ───────────────────────────────────────────────────
const geoStyle = {
  fillColor: 'rgba(13, 31, 20, 0.6)',
  fillOpacity: 1,
  color: 'rgba(180, 210, 160, 0.30)',
  weight: 0.75,
}

// ─── Custom Leaflet divIcon ──────────────────────────────────────────────────
function buildIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
      <circle cx="12" cy="12" r="5.5" fill="${color}" opacity="0.92"/>
      <circle cx="12" cy="12" r="11" fill="${color}" opacity="0.15" class="pin-ring"/>
    </svg>`
  return L.divIcon({
    html: svg,
    className: 'wm-pin-icon',
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  })
}

// ─── World bounds ────────────────────────────────────────────────────────────
const WORLD_BOUNDS = L.latLngBounds(
  L.latLng(-82, -185),
  L.latLng(84, 185)
)

// ─── GeoJSON source ──────────────────────────────────────────────────────────
const GEO_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'

// ─── FillWidth — width-driven zoom so the world always fills edge-to-edge ───
function FillWidth() {
  const map = useMap()
  useEffect(() => {
    const fit = () => {
      const w = map.getContainer().offsetWidth
      const zoom = Math.log2(w / 256)
      map.setView([10, 10], zoom, { animate: false })
    }
    fit()
    map.on('resize', fit)
    return () => map.off('resize', fit)
  }, [map])
  return null
}

// ─── Fetch & parse CSV pins (additional, from Google Sheets) ─────────────────
async function fetchCsvPins() {
  // Check sessionStorage cache first
  try {
    const cached = sessionStorage.getItem(CACHE_KEY)
    if (cached) return JSON.parse(cached)
  } catch (_) { }

  return new Promise((resolve, reject) => {
    Papa.parse(CSV_URL, {
      download: true,
      header: true,
      skipEmptyLines: true,
      // Normalize headers: "Pin Class" → "pin_class", "Image URL" → "image_url", etc.
      transformHeader: (h) => h.trim().toLowerCase().replace(/\s+/g, '_'),
      complete: ({ data }) => {
        const csvPins = []
        data.forEach((row) => {
          const coords = cityToLatLng(row.city)
          if (!coords) return // skip silently if city not in lookup

          const pinId = `csv_${row.id?.trim() || Math.random()}`
          const [jLat, jLng] = jitterCoords(coords[0], coords[1], pinId)
          csvPins.push({
            id: pinId,
            title: row.title?.trim() || '',
            cat: row.category?.trim().toUpperCase() || '',
            country: row.pin_class?.trim() || '',
            desc: row.description?.trim() || '',
            img: convertImageUrl(row.image_url?.trim() || null),
            lat: jLat,
            lng: jLng,
          })
        })

        try {
          sessionStorage.setItem(CACHE_KEY, JSON.stringify(csvPins))
        } catch (_) { }

        resolve(csvPins)
      },
      error: reject,
    })
  })
}


// ─── Loading overlay ─────────────────────────────────────────────────────────
function MapLoading() {
  return (
    <div className="wm-loading" aria-label="Loading additional pins">
      <span className="wm-loading__dot" />
      <span className="wm-loading__dot" />
      <span className="wm-loading__dot" />
    </div>
  )
}

// ─── Main component ──────────────────────────────────────────────────────────
export default function WorldMapSection() {
  const [worldGeo, setWorldGeo] = useState(null)
  // Start with hardcoded pins immediately — no waiting
  const [pins, setPins] = useState(HARDCODED_PINS)
  const [loading, setLoading] = useState(true)

  // Fetch GeoJSON outlines
  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then(setWorldGeo)
      .catch((e) => console.error('GeoJSON fetch failed', e))
  }, [])

  // Fetch CSV pins and merge with hardcoded
  useEffect(() => {
    fetchCsvPins()
      .then((csvPins) => {
        // Merge: hardcoded first, CSV additions appended
        setPins([...HARDCODED_PINS, ...csvPins])
      })
      .catch((e) => console.error('CSV pin fetch failed', e))
      .finally(() => setLoading(false))
  }, [])

  return (
    <section className="worldmap" id="world-map">
      {/* Header keeps its own horizontal padding */}
      <div className="worldmap__header">
        <span className="label">ROUTES</span>
        <h2 className="worldmap__heading">
          Cultivating ideas that <em>travel across borders</em>
        </h2>
      </div>

      {/* Map — full bleed, no side gaps */}
      <div className="worldmap__clipper">
        <div className="worldmap__map-wrap">
          {loading && <MapLoading />}
          <MapContainer
            center={[10, 10]}
            zoom={2}
            dragging={false}
            touchZoom={false}
            doubleClickZoom={false}
            scrollWheelZoom={false}
            boxZoom={false}
            keyboard={false}
            zoomControl={false}
            attributionControl={false}
            className="worldmap__leaflet"
            maxBounds={WORLD_BOUNDS}
            maxBoundsViscosity={1.0}
            worldCopyJump={false}
          >
            <FillWidth />
            {worldGeo && (
              <GeoJSON key="world" data={worldGeo} style={geoStyle} />
            )}

            {/* All pins — hardcoded + CSV merged, same rendering logic */}
            {pins.map((pin) => {
              const color = catColor[pin.cat] || '#c4a96a'
              return (
                <Marker
                  key={pin.id}
                  position={[pin.lat, pin.lng]}
                  icon={buildIcon(color)}
                >
                  <Tooltip
                    className="wm-popup"
                    direction="auto"
                    offset={[0, -5]}
                    opacity={1}
                  >
                    <div className="wm-card">
                      {pin.img && (
                        <div className="wm-card__img">
                          <img src={pin.img} alt={pin.title} />
                        </div>
                      )}
                      <div className="wm-card__body">
                        <span className="wm-card__cat" style={{ color }}>
                          {pin.cat}
                        </span>
                        <h4 className="wm-card__title">{pin.title}</h4>
                        <span className="wm-card__country">{pin.country}</span>
                        <p className="wm-card__desc">{pin.desc}</p>
                      </div>
                    </div>
                  </Tooltip>
                </Marker>
              )
            })}
          </MapContainer>
        </div>
      </div>
    </section>
  )
}
