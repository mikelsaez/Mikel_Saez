import { useEffect, useMemo, useState } from 'react'
import { GeoJSON, MapContainer, Marker, Tooltip, useMap } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import './WorldMapSection.css'
import RichText from './RichText'
import useLocale from '../i18n/useLocale'

const CATEGORY_COLORS = {
  ECOSYSTEM: '#6a8ab8',
  TERRITORIES: '#8ab86a',
  SEEDS: '#c4a96a',
  ROOTS: '#6aacb8',
  BLOOM: '#d4a86a',
  HARVEST: '#b86a8a',
}

const GEO_STYLE = {
  fillColor: 'rgba(13, 31, 20, 0.6)',
  fillOpacity: 1,
  color: 'rgba(180, 210, 160, 0.30)',
  weight: 0.75,
}

const WORLD_BOUNDS = L.latLngBounds(
  L.latLng(-82, -185),
  L.latLng(84, 185),
)

function buildIcon(color) {
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true">
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

function FillWidth() {
  const map = useMap()

  useEffect(() => {
    const fit = () => {
      const width = map.getContainer().offsetWidth
      map.setView([10, 10], Math.log2(width / 256), { animate: false })
    }

    fit()
    map.on('resize', fit)
    return () => map.off('resize', fit)
  }, [map])

  return null
}

function MapLoading({ label }) {
  return (
    <div className="wm-loading" role="status" aria-label={label}>
      <span className="wm-loading__dot" />
      <span className="wm-loading__dot" />
      <span className="wm-loading__dot" />
    </div>
  )
}

export default function WorldMapSection({ selectedCategory, onSelectCategory }) {
  const { content: localizedContent, locale } = useLocale()
  const { worldMap: content, ui } = localizedContent
  const [worldGeo, setWorldGeo] = useState(null)
  const [mapError, setMapError] = useState(false)

  const categories = useMemo(
    () => [...new Set(localizedContent.expertise.cards.map(({ category }) => category))],
    [localizedContent.expertise.cards],
  )

  const pins = useMemo(
    () => content.pins.map((pin, index) => ({ ...pin, id: `${locale}-${index + 1}` })),
    [content.pins, locale],
  )

  const filteredPins = selectedCategory === 'ALL'
    ? pins
    : pins.filter(({ category }) => category === selectedCategory)

  useEffect(() => {
    const controller = new AbortController()

    fetch('/data/world.geojson', { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error(`World map returned ${response.status}`)
        return response.json()
      })
      .then(setWorldGeo)
      .catch((error) => {
        if (error.name !== 'AbortError') setMapError(true)
      })

    return () => controller.abort()
  }, [])

  return (
    <section className="worldmap" id="world-map" aria-labelledby="world-map-heading">
      <div className="worldmap__header">
        <span className="label">{content.tag}</span>
        <RichText as="h2" id="world-map-heading" className="worldmap__heading">
          {content.heading}
        </RichText>
        <p className="worldmap__intro">{content.intro}</p>

        <div className="worldmap__filters" role="group" aria-label={ui.projectFilters}>
          <button
            type="button"
            className={`worldmap__filter ${selectedCategory === 'ALL' ? 'worldmap__filter--active' : ''}`}
            onClick={() => onSelectCategory('ALL')}
            aria-pressed={selectedCategory === 'ALL'}
          >
            {ui.allProjects}
          </button>
          {categories.map((category) => (
            <button
              type="button"
              className={`worldmap__filter ${selectedCategory === category ? 'worldmap__filter--active' : ''}`}
              onClick={() => onSelectCategory(category)}
              aria-pressed={selectedCategory === category}
              key={category}
            >
              <span className="worldmap__filter-dot" style={{ backgroundColor: CATEGORY_COLORS[category] }} />
              {ui.categories[category]}
            </button>
          ))}
        </div>

        <p className="worldmap__result-count" aria-live="polite">
          {filteredPins.length === 0
            ? ui.noProjects
            : (filteredPins.length === 1
              ? ui.projectCountOne
              : ui.projectCount.replace('{count}', filteredPins.length))}
        </p>
      </div>

      <div className="worldmap__clipper">
        <div className="worldmap__map-wrap" aria-busy={!worldGeo && !mapError}>
          {!worldGeo && !mapError && <MapLoading label={ui.mapLoading} />}
          {mapError ? (
            <div className="wm-error" role="alert">{ui.mapUnavailable}</div>
          ) : (
            <MapContainer
              center={[10, 10]}
              zoom={2}
              dragging
              touchZoom
              doubleClickZoom
              scrollWheelZoom={false}
              boxZoom
              keyboard
              zoomControl
              attributionControl={false}
              className="worldmap__leaflet"
              maxBounds={WORLD_BOUNDS}
              maxBoundsViscosity={1}
              worldCopyJump={false}
              aria-label={ui.projectMap}
            >
              <FillWidth />
              {worldGeo && <GeoJSON key="world" data={worldGeo} style={GEO_STYLE} />}

              {filteredPins.map((pin) => {
                const color = CATEGORY_COLORS[pin.category] || '#c4a96a'
                const markerLabel = ui.mapMarkerLabel
                  .replace('{title}', pin.title)
                  .replace('{country}', pin.country)

                return (
                  <Marker
                    key={pin.id}
                    position={[pin.lat, pin.lng]}
                    icon={buildIcon(color)}
                    keyboard
                    title={markerLabel}
                    alt={markerLabel}
                    riseOnHover
                  >
                    <Tooltip
                      className="wm-popup"
                      direction="auto"
                      offset={[0, -5]}
                      opacity={1}
                    >
                      <article className="wm-card" lang={locale}>
                        {pin.img && (
                          <div className="wm-card__img">
                            <img src={pin.img} alt="" loading="lazy" />
                          </div>
                        )}
                        <div className="wm-card__body">
                          <span className="wm-card__cat" style={{ color }}>
                            {ui.categories[pin.category]}
                          </span>
                          <h3 className="wm-card__title">{pin.title}</h3>
                          <span className="wm-card__country">{pin.country}</span>
                          <p className="wm-card__desc">{pin.desc}</p>
                        </div>
                      </article>
                    </Tooltip>
                  </Marker>
                )
              })}
            </MapContainer>
          )}
        </div>
      </div>

      <div className="visually-hidden" aria-label={ui.projectList}>
        {filteredPins.map((pin) => (
          <article key={`accessible-${pin.id}`}>
            <h3>{pin.title}</h3>
            <p>{pin.country}. {pin.desc}</p>
          </article>
        ))}
      </div>
    </section>
  )
}
