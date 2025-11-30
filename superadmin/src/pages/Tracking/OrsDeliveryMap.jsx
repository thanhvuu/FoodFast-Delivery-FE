import { useEffect, useMemo, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'

const paletteByMode = {
  drone: {
    primary: '#f97316',
    shadow: '#ffe4d5',
    progress: '#fb923c',
    waypoint: '#ea580c',
    fallbackIcon: '🚁',
    startGradient: ['#fb923c', '#f97316'],
  },
  motorbike: {
    primary: '#2563eb',
    shadow: '#dbeafe',
    progress: '#3b82f6',
    waypoint: '#1d4ed8',
    fallbackIcon: '🛵',
    startGradient: ['#38bdf8', '#6366f1'],
  },
}

const encodeSvg = (svg) => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`

const createVehicleIcon = (mode) => {
  if (mode === 'motorbike') {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bike-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#6366f1" />
        </linearGradient>
      </defs>
      <circle cx="28" cy="28" r="24" fill="url(#bike-grad)" opacity="0.95" />
      <path d="M17 34h8.6l2.6-7.5h7.4l2 4.2H41a5.6 5.6 0 0 1 0 11.2h-1.8a5.6 5.6 0 0 1-10.9 0H23a5.6 5.6 0 1 1-6-7.9Z" fill="#fff"/>
      <circle cx="21" cy="39" r="4.4" fill="rgba(15,23,42,0.18)" />
      <circle cx="37" cy="39" r="4.4" fill="rgba(15,23,42,0.18)" />
    </svg>`

    return L.icon({
      iconUrl: encodeSvg(svg),
      iconSize: [56, 56],
      iconAnchor: [28, 28],
      className: '',
    })
  }

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="drone-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#fb923c" />
        <stop offset="100%" stop-color="#f97316" />
      </linearGradient>
    </defs>
    <circle cx="28" cy="28" r="24" fill="url(#drone-grad)" opacity="0.92" />
    <path d="M28 14l4 6h-8l4-6zm0 28l-4-6h8l-4 6zm14-14l-6 4v-8l6 4zm-28 0l6-4v8l-6-4z" fill="#f8fafc"/>
  </svg>`

  return L.icon({
    iconUrl: encodeSvg(svg),
    iconSize: [56, 56],
    iconAnchor: [28, 28],
    className: '',
  })
}

const createEndpointIcon = (type, palette) => {
  const isStart = type === 'start'
  const [startColor, endColor] = palette.startGradient
  const gradientStart = isStart ? startColor : '#f97316'
  const gradientEnd = isStart ? endColor : '#ef4444'
  const glyph = isStart ? 'A' : 'B'

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="48" height="64" viewBox="0 0 48 64" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad-${type}" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="${gradientStart}" />
        <stop offset="100%" stop-color="${gradientEnd}" />
      </linearGradient>
      <filter id="shadow-${type}" x="-50%" y="-50%" width="200%" height="200%">
        <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="rgba(15,23,42,0.35)" />
      </filter>
    </defs>
    <path d="M24 0C11.3 0 1 10.3 1 23c0 15.4 18.1 35.1 22.8 40.1.7.7 1.7.7 2.5 0C28.9 58.1 47 38.4 47 23 47 10.3 36.7 0 24 0z" fill="url(#grad-${type})" filter="url(#shadow-${type})" />
    <circle cx="24" cy="23" r="12" fill="white" />
    <text x="24" y="27" text-anchor="middle" font-size="14" font-family="'Inter', 'Arial', sans-serif" font-weight="700" fill="#0f172a">${glyph}</text>
  </svg>`

  return L.icon({
    iconUrl: encodeSvg(svg),
    iconSize: [48, 64],
    iconAnchor: [24, 64],
    className: '',
  })
}

const createWaypointIcon = (palette) => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8" fill="${palette.shadow}" />
    <circle cx="9" cy="9" r="4" fill="${palette.waypoint}" />
  </svg>`

  return L.icon({
    iconUrl: encodeSvg(svg),
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    className: '',
  })
}

const FitRouteBounds = ({ positions }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || positions.length === 0) return
    const bounds = L.latLngBounds(positions)
    if (!bounds.isValid()) return
    map.fitBounds(bounds, { padding: [48, 48] })
  }, [map, positions])

  return null
}

const PanToVehicle = ({ coordinate }) => {
  const map = useMap()

  useEffect(() => {
    if (!map || !coordinate) return
    map.panTo([coordinate.lat, coordinate.lng], { animate: true, duration: 0.9 })
  }, [map, coordinate?.lat, coordinate?.lng])

  return null
}

const OrsDeliveryMap = ({
  route,
  vehicleCoordinate,
  currentIndex,
  segmentProgress,
  orderCode,
  mode = 'drone',
  unavailableMessage,
}) => {
  const coordinates = useMemo(
    () =>
      Array.isArray(route)
        ? route
          .map((point) => point?.coords)
          .filter(Boolean)
        : [],
    [route]
  )

  const palette = paletteByMode[mode] ?? paletteByMode.drone

  const orsApiKey = import.meta.env?.VITE_ORS_API_KEY
  const [tileProvider, setTileProvider] = useState(orsApiKey ? 'ors' : 'osm')

  const routeLatLngs = useMemo(
    () => coordinates.map((coord) => [coord.lat, coord.lng]),
    [coordinates]
  )

  const progressLatLngs = useMemo(() => {
    if (!Array.isArray(route) || route.length === 0) return []

    const completed = []

    for (let index = 0; index <= currentIndex; index += 1) {
      const point = route[index]
      if (point?.coords) {
        completed.push([point.coords.lat, point.coords.lng])
      }
    }

    if (vehicleCoordinate?.lat != null && vehicleCoordinate?.lng != null) {
      const last = completed.length ? completed[completed.length - 1] : null
      const sameAsLast = last
        ? last[0] === vehicleCoordinate.lat && last[1] === vehicleCoordinate.lng
        : false

      if (segmentProgress > 0 || (!completed.length && vehicleCoordinate)) {
        if (!sameAsLast) {
          completed.push([vehicleCoordinate.lat, vehicleCoordinate.lng])
        }
      }
    }

    if (!completed.length && route[0]?.coords) {
      completed.push([route[0].coords.lat, route[0].coords.lng])
    }

    return completed
  }, [currentIndex, route, segmentProgress, vehicleCoordinate])

  const showFallback = routeLatLngs.length === 0
  const fallbackIcon = palette.fallbackIcon

  const startIcon = useMemo(() => createEndpointIcon('start', palette), [palette])
  const endIcon = useMemo(() => createEndpointIcon('end', palette), [palette])
  const waypointIcon = useMemo(() => createWaypointIcon(palette), [palette])
  const vehicleIcon = useMemo(() => createVehicleIcon(mode), [mode])

  const vehicleLatLng = vehicleCoordinate
    ? [vehicleCoordinate.lat, vehicleCoordinate.lng]
    : null

  const tileConfig = useMemo(() => {
    if (tileProvider === 'ors' && orsApiKey) {
      return {
        url: `https://maps.openrouteservice.org/openmaptiles/light/{z}/{x}/{y}.png?api_key=${orsApiKey}`,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://openrouteservice.org/">openrouteservice</a>',
      }
    }

    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    }
  }, [orsApiKey, tileProvider])

  return (
    <div className="delivery-map-wrapper">
      {!showFallback ? (
        <MapContainer
          className="delivery-map-canvas"
          center={routeLatLngs[0] ?? [0, 0]}
          zoom={13}
          zoomControl={false}
          scrollWheelZoom
          key={orderCode || mode}
        >
          <TileLayer
            key={tileProvider}
            url={tileConfig.url}
            attribution={tileConfig.attribution}
            eventHandlers={{
              tileerror: () => {
                if (tileProvider === 'ors') {
                  setTileProvider('osm')
                }
              },
            }}
          />
          <FitRouteBounds positions={routeLatLngs} />
          <PanToVehicle coordinate={vehicleCoordinate} />

          {routeLatLngs.length ? (
            <Polyline
              positions={routeLatLngs}
              pathOptions={{
                color: palette.shadow,
                weight: 9,
                opacity: 0.9,
              }}
            />
          ) : null}

          {routeLatLngs.length ? (
            <Polyline
              positions={routeLatLngs}
              pathOptions={{
                color: palette.primary,
                weight: 4,
                opacity: 0.85,
                dashArray: '6 16',
              }}
            />
          ) : null}

          {progressLatLngs.length ? (
            <Polyline
              positions={progressLatLngs}
              pathOptions={{
                color: palette.progress,
                weight: 5,
                opacity: 1,
              }}
            />
          ) : null}

          {routeLatLngs[0] ? (
            <Marker
              position={routeLatLngs[0]}
              icon={startIcon}
              title={route[0]?.title ?? 'Start'}
              zIndexOffset={200}
            />
          ) : null}

          {routeLatLngs[routeLatLngs.length - 1] ? (
            <Marker
              position={routeLatLngs[routeLatLngs.length - 1]}
              icon={endIcon}
              title={route[route.length - 1]?.title ?? 'Destination'}
              zIndexOffset={200}
            />
          ) : null}

          {route
            .slice(1, -1)
            .filter((point) => point?.coords)
            .map((point) => (
              <Marker
                key={point.id}
                position={[point.coords.lat, point.coords.lng]}
                icon={waypointIcon}
                title={point.title}
                zIndexOffset={150}
              />
            ))}

          {vehicleLatLng ? (
            <Marker
              position={vehicleLatLng}
              icon={vehicleIcon}
              title={
                orderCode
                  ? `${mode === 'motorbike' ? 'Courier' : 'Drone'} ${orderCode}`
                  : 'Current position'
              }
              zIndexOffset={300}
            />
          ) : null}
        </MapContainer>
      ) : null}

      {showFallback && (
        <div className="map-fallback" role="status">
          <div className="map-fallback-icon" aria-hidden="true">
            {fallbackIcon}
          </div>
          <p>{unavailableMessage}</p>
          {route?.length ? (
            <ol className="map-fallback-steps">
              {route.map((point) => (
                <li key={point.id}>
                  <strong>{point.title}</strong>
                  {point.eta && <span>{point.eta}</span>}
                  <p>{point.description}</p>
                </li>
              ))}
            </ol>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default OrsDeliveryMap
