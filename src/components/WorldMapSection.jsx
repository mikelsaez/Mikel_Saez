import { useEffect, useRef, useState } from 'react'
import { MapContainer, GeoJSON, Marker, Popup, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './WorldMapSection.css'

// ─── Pin images ──────────────────────────────────────────────────────────────
import imgMicrosoft    from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.14.23.png'
import imgIberia       from '../assets/img/iberia_47510952881897_thumb.png'
import imgVillaConchi  from '../assets/img/IMG_0181-scaled.jpg'
import imgWineRoutes   from '../assets/img/Captura-de-pantalla-2026-03-18-a-las-23.00.16.png'
import imgGeneralAssembly from '../assets/img/199.jpeg'
import imgMission300   from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-18.28.14-scaled.png'
import imgWorldBank    from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-18.33.53.png'
import imgVitoria      from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.27.00.png'
import imgIDBHousing   from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.28.09.png'
import imgU20          from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.30.14.png'
import imgCOP16        from '../assets/img/Captura-de-pantalla-2026-03-20-a-las-17.32.23.png'
import imgVinexpo      from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-20.20.32.png'
import imgUNWTO        from '../assets/img/Captura-de-pantalla-2026-03-30-a-las-20.29.07.png'

// ─── Pin data ──────────────────────────────────────────────────────────────
const pins = [
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

// ─── Category colours ────────────────────────────────────────────────────────
const catColor = {
  ECOSYSTEM:   '#6a8ab8',
  TERRITORIES: '#8ab86a',
  SEEDS:       '#c4a96a',
  ROOTS:       '#6aacb8',
  BLOOM:       '#d4a86a',
  HARVEST:     '#b86a8a',
}

// ─── GeoJSON country style — glowing lines on dark green ────────────────────
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

// ─── World bounds — prevents any map wrapping ────────────────────────────────
const WORLD_BOUNDS = L.latLngBounds(
  L.latLng(-82, -185),
  L.latLng(84, 185)
)

// ─── FillWidth — width-driven zoom so the world always fills edge-to-edge ───
// In Leaflet's CRS the world is 256 × 2^z pixels wide at zoom z.
// → zoom = log2(containerWidth / 256) makes the world exactly fill the container.
function FillWidth() {
  const map = useMap()
  useEffect(() => {
    const fit = () => {
      const w = map.getContainer().offsetWidth
      const zoom = Math.log2(w / 256)
      // Centre at [10, 10] — equator-level centre shows the full world
      // vertically in the square 1:1 aspect-ratio container
      map.setView([10, 10], zoom, { animate: false })
    }
    fit()
    map.on('resize', fit)
    return () => map.off('resize', fit)
  }, [map])
  return null
}

// ─── World GeoJSON source (Natural Earth 110m — compact & fast) ──────────────
const GEO_URL =
  'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson'

// ─── Main component ──────────────────────────────────────────────────────────
export default function WorldMapSection() {
  const [worldGeo, setWorldGeo] = useState(null)

  useEffect(() => {
    fetch(GEO_URL)
      .then((r) => r.json())
      .then(setWorldGeo)
      .catch((e) => console.error('GeoJSON fetch failed', e))
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
      <div className="worldmap__map-wrap">
        <MapContainer
          center={[10, 10]}
          zoom={2}   /* overridden by FillWidth below */
          /* ── Fully locked — no interaction at all ── */
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
          {/* GeoJSON country outlines — no tiles, no wrapping */}
          {worldGeo && (
            <GeoJSON
              key="world"
              data={worldGeo}
              style={geoStyle}
            />
          )}

          {/* Location pins */}
          {pins.map((pin) => {
            const color = catColor[pin.cat] || '#c4a96a'
            return (
              <Marker
                key={pin.id}
                position={[pin.lat, pin.lng]}
                icon={buildIcon(color)}
              >
                <Popup
                  className="wm-popup"
                  closeButton={false}
                  autoPan={false}
                  offset={[0, -8]}
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
                </Popup>
              </Marker>
            )
          })}
        </MapContainer>
      </div>
    </section>
  )
}
