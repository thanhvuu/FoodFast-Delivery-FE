import { useEffect, useMemo, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'
import { MapContainer, Marker, Polyline, TileLayer, useMap } from 'react-leaflet'

const paletteByMode = {
  drone: {
    primary: '#3b82f6',
    shadow: '#dbeafe',
    progress: '#22c55e',
    waypoint: '#2563eb',
    fallbackIcon: '🚁',
    startGradient: ['#38bdf8', '#6366f1'],
  },
  motorbike: {
    primary: '#f97316',
    shadow: '#fed7aa',
    progress: '#ea580c',
    waypoint: '#fb923c',
    fallbackIcon: '🛵',
    startGradient: ['#fb923c', '#f97316'],
  },
}

const encodeSvg = svg => `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`

const createVehicleIcon = mode => {
  if (mode === 'motorbike') {
    const svg = `<?xml version="1.0" encoding="UTF-8"?>
    <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bike-grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#fb923c" />
          <stop offset="100%" stop-color="#f97316" />
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
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#6366f1" />
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

const createWaypointIcon = palette => {
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
            .map(point => point?.coords)
            .filter(Boolean)
        : [],
    [route]
  )

  const palette = paletteByMode[mode] ?? paletteByMode.drone

  const orsApiKey = import.meta.env?.VITE_ORS_API_KEY
  const [tileProvider, setTileProvider] = useState(orsApiKey ? 'ors' : 'osm')
  const [orsPath, setOrsPath] = useState([])
  const [isFetchingOrs, setIsFetchingOrs] = useState(false)

  useEffect(() => {
    if (orsApiKey) {
      setTileProvider(current => (current === 'ors' ? current : 'ors'))
    } else {
      setTileProvider('osm')
    }
  }, [orsApiKey])

  const routeLatLngs = useMemo(
    () => coordinates.map(coord => [coord.lat, coord.lng]),
    [coordinates]
  )

  const coordinatesSignature = useMemo(
    () =>
      routeLatLngs
        .map(([lat, lng]) => `${lat.toFixed(6)},${lng.toFixed(6)}`)
        .join('|'),
    [routeLatLngs]
  )

  useEffect(() => {
    if (!orsApiKey || routeLatLngs.length < 2) {
      setOrsPath([])
      setIsFetchingOrs(false)
      return
    }

    const controller = new AbortController()
    const fetchRoute = async () => {
      setIsFetchingOrs(true)
      try {
        const profile = mode === 'motorbike' ? 'driving-car' : 'driving-car'
        const response = await fetch(
          `https://api.openrouteservice.org/v2/directions/${profile}/geojson`,
          {
            method: 'POST',
            headers: {
              Authorization: orsApiKey,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              coordinates: routeLatLngs.map(([lat, lng]) => [lng, lat]),
            }),
            signal: controller.signal,
          }
        )

        if (!response.ok) {
          throw new Error(`ORS request failed with status ${response.status}`)
        }

        const data = await response.json()
        const feature = data?.features?.[0]
        const geometryCoordinates = Array.isArray(feature?.geometry?.coordinates)
          ? feature.geometry.coordinates
          : []
        const path = geometryCoordinates.map(([lng, lat]) => [lat, lng])

        if (!controller.signal.aborted && path.length >= 2) {
          setOrsPath(path)
        } else if (!controller.signal.aborted) {
          setOrsPath([])
        }
      } catch (error) {
        if (!controller.signal.aborted) {
          console.error(error)
          setOrsPath([])
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsFetchingOrs(false)
        }
      }
    }

    fetchRoute()

    return () => controller.abort()
  }, [coordinatesSignature, mode, orsApiKey, routeLatLngs])

  const pathLatLngs = useMemo(() => {
    if (orsPath.length >= 2) {
      return orsPath
    }
    return routeLatLngs
  }, [orsPath, routeLatLngs])

  const routeLength = route?.length ?? 0
  const normalizedProgress = useMemo(() => {
    if (routeLength <= 1) return 0
    const raw = (currentIndex + segmentProgress) / (routeLength - 1)
    if (!Number.isFinite(raw)) return 0
    return Math.min(Math.max(raw, 0), 1)
  }, [currentIndex, routeLength, segmentProgress])

  const progressLatLngs = useMemo(() => {
    if (pathLatLngs.length === 0) return []
    if (pathLatLngs.length === 1) return pathLatLngs

    const totalSegments = pathLatLngs.length - 1
    const scaledIndex = normalizedProgress * totalSegments

    if (scaledIndex >= totalSegments) {
      return pathLatLngs.slice()
    }

    const lowerIndex = Math.max(0, Math.floor(scaledIndex))
    const remainder = scaledIndex - lowerIndex

    const visited = pathLatLngs.slice(0, lowerIndex + 1)

    const start = pathLatLngs[lowerIndex]
    const end = pathLatLngs[lowerIndex + 1]

    if (start && end && remainder > 0) {
      visited.push([
        start[0] + (end[0] - start[0]) * remainder,
        start[1] + (end[1] - start[1]) * remainder,
      ])
    }

    return visited
  }, [normalizedProgress, pathLatLngs])

  const fallbackIcon = palette.fallbackIcon

  const startIcon = useMemo(() => createEndpointIcon('start', palette), [palette])
  const endIcon = useMemo(() => createEndpointIcon('end', palette), [palette])
  const waypointIcon = useMemo(() => createWaypointIcon(palette), [palette])
  const vehicleIcon = useMemo(() => createVehicleIcon(mode), [mode])

  const fallbackVehicleCoordinate = vehicleCoordinate
    ? [vehicleCoordinate.lat, vehicleCoordinate.lng]
    : null

  const vehicleLatLng = useMemo(() => {
    if (pathLatLngs.length === 0) {
      return fallbackVehicleCoordinate
    }

    if (pathLatLngs.length === 1) {
      return pathLatLngs[0]
    }

    const totalSegments = pathLatLngs.length - 1
    const scaledIndex = normalizedProgress * totalSegments
    const lowerIndex = Math.floor(scaledIndex)
    const remainder = scaledIndex - lowerIndex

    const start = pathLatLngs[lowerIndex]
    const end = pathLatLngs[lowerIndex + 1]

    if (start && end) {
      return [
        start[0] + (end[0] - start[0]) * remainder,
        start[1] + (end[1] - start[1]) * remainder,
      ]
    }

    return pathLatLngs[pathLatLngs.length - 1]
  }, [fallbackVehicleCoordinate, normalizedProgress, pathLatLngs])

  const showFallback = pathLatLngs.length === 0

  const tileConfig = useMemo(() => {
    if (tileProvider === 'ors' && orsApiKey) {
      return {
        url: `https://maps.openrouteservice.org/openmaptiles/light/{z}/{x}/{y}.png?api_key=${orsApiKey}`,
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://openrouteservice.org/">openrouteservice</a>',
        tileSize: 512,
        zoomOffset: -1,
        maxZoom: 19,
      }
    }

    return {
      url: 'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution:
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      tileSize: 256,
      zoomOffset: 0,
      maxZoom: 19,
    }
  }, [orsApiKey, tileProvider])

  const panTarget = vehicleLatLng
    ? { lat: vehicleLatLng[0], lng: vehicleLatLng[1] }
    : vehicleCoordinate

  return (
    <div className='delivery-map-wrapper'>
      {!showFallback ? (
        <MapContainer
          className='delivery-map-canvas'
          center={pathLatLngs[0] ?? [0, 0]}
          zoom={13}
          zoomControl={false}
          scrollWheelZoom
          key={orderCode || mode}
        >
          <TileLayer
            key={tileProvider}
            url={tileConfig.url}
            attribution={tileConfig.attribution}
            tileSize={tileConfig.tileSize}
            zoomOffset={tileConfig.zoomOffset}
            maxZoom={tileConfig.maxZoom}
            eventHandlers={{
              tileerror: () => {
                if (tileProvider === 'ors') {
                  setTileProvider('osm')
                }
              },
            }}
          />
          <FitRouteBounds positions={pathLatLngs} />
          <PanToVehicle coordinate={panTarget} />

          {pathLatLngs.length ? (
            <Polyline
              positions={pathLatLngs}
              pathOptions={{
                color: palette.shadow,
                weight: 9,
                opacity: 0.9,
              }}
            />
          ) : null}

          {pathLatLngs.length ? (
            <Polyline
              positions={pathLatLngs}
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

          {pathLatLngs[0] ? (
            <Marker
              position={pathLatLngs[0]}
              icon={startIcon}
              title={route[0]?.title ?? 'Start'}
              zIndexOffset={200}
            />
          ) : null}

          {pathLatLngs[pathLatLngs.length - 1] ? (
            <Marker
              position={pathLatLngs[pathLatLngs.length - 1]}
              icon={endIcon}
              title={route[route.length - 1]?.title ?? 'Destination'}
              zIndexOffset={200}
            />
          ) : null}

          {route
            .slice(1, -1)
            .filter(point => point?.coords)
            .map(point => (
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
        <div className='map-fallback' role='status'>
          <div className='map-fallback-icon' aria-hidden='true'>
            {fallbackIcon}
          </div>
          <p>{unavailableMessage}</p>
          {route?.length ? (
            <ol className='map-fallback-steps'>
              {route.map(point => (
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

      {isFetchingOrs ? (
        <div className='map-loading-indicator' aria-hidden='true'>
          <span />
        </div>
      ) : null}
    </div>
  )
}

export default OrsDeliveryMap
