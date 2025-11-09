import { useEffect, useMemo, useRef, useState } from 'react'

const SCRIPT_ID = 'google-maps-sdk'

const loadGoogleMaps = apiKey => {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('window is undefined'))
  }

  if (window.google && window.google.maps) {
    return Promise.resolve(window.google)
  }

  const existingScript = document.getElementById(SCRIPT_ID)
  if (existingScript) {
    return new Promise((resolve, reject) => {
      existingScript.addEventListener('load', () => resolve(window.google))
      existingScript.addEventListener('error', () => reject(new Error('Google Maps failed to load')))
    })
  }

  return new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.id = SCRIPT_ID
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
    script.async = true
    script.defer = true
    script.onload = () => resolve(window.google)
    script.onerror = () => reject(new Error('Google Maps failed to load'))
    document.head.appendChild(script)
  })
}

const createDroneIcon = google => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="56" height="56" viewBox="0 0 56 56" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38bdf8" />
        <stop offset="100%" stop-color="#6366f1" />
      </linearGradient>
    </defs>
    <circle cx="28" cy="28" r="24" fill="url(#grad)" opacity="0.92" />
    <path d="M28 14l4 6h-8l4-6zm0 28l-4-6h8l-4 6zm14-14l-6 4v-8l6 4zm-28 0l6-4v8l-6-4z" fill="#f8fafc"/>
  </svg>`

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(56, 56),
    anchor: new google.maps.Point(28, 28),
  }
}

const createEndpointIcon = (google, type) => {
  const isStart = type === 'start'
  const gradientStart = isStart ? '#38bdf8' : '#fb923c'
  const gradientEnd = isStart ? '#3b82f6' : '#ef4444'
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
    <path d="M24 0C11.297 0 1 10.297 1 23c0 15.422 18.078 35.086 22.766 40.082.66.698 1.808.698 2.468 0C28.922 58.086 47 38.422 47 23 47 10.297 36.703 0 24 0z" fill="url(#grad-${type})" filter="url(#shadow-${type})" />
    <circle cx="24" cy="23" r="12" fill="white" />
    <text x="24" y="27" text-anchor="middle" font-size="14" font-family="'Inter', 'Arial', sans-serif" font-weight="700" fill="#0f172a">${glyph}</text>
  </svg>`

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(48, 64),
    anchor: new google.maps.Point(24, 64),
    labelOrigin: new google.maps.Point(24, 26),
  }
}

const createWaypointIcon = google => {
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
  <svg width="18" height="18" viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="9" r="8" fill="rgba(59,130,246,0.18)" />
    <circle cx="9" cy="9" r="4" fill="#2563eb" />
  </svg>`

  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: new google.maps.Size(18, 18),
    anchor: new google.maps.Point(9, 9),
  }
}

const GoogleDroneMap = ({
  route,
  droneCoordinate,
  currentIndex,
  segmentProgress,
  orderCode,
  unavailableMessage,
}) => {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const polylineRef = useRef(null)
  const progressPolylineRef = useRef(null)
  const shadowPolylineRef = useRef(null)
  const droneMarkerRef = useRef(null)
  const checkpointsRef = useRef([])
  const [error, setError] = useState('')
  const [isReady, setIsReady] = useState(false)

  const coordinates = useMemo(
    () =>
      Array.isArray(route)
        ? route
            .map(point => point?.coords)
            .filter(Boolean)
        : [],
    [route]
  )

  useEffect(() => {
    if (!containerRef.current) return undefined

    if (!coordinates.length) {
      setError(unavailableMessage)
      return undefined
    }

    const apiKey = import.meta.env?.VITE_GOOGLE_MAPS_API_KEY
    if (!apiKey) {
      setError(unavailableMessage)
      return undefined
    }

    let cancelled = false

    const initialiseMap = async () => {
      try {
        const google = await loadGoogleMaps(apiKey)
        if (cancelled) return

        if (!containerRef.current) return

        // Cleanup previous map artefacts
        if (polylineRef.current) {
          polylineRef.current.setMap(null)
          polylineRef.current = null
        }
        if (progressPolylineRef.current) {
          progressPolylineRef.current.setMap(null)
          progressPolylineRef.current = null
        }
        if (shadowPolylineRef.current) {
          shadowPolylineRef.current.setMap(null)
          shadowPolylineRef.current = null
        }
        checkpointsRef.current.forEach(marker => marker.setMap(null))
        checkpointsRef.current = []
        if (droneMarkerRef.current) {
          droneMarkerRef.current.setMap(null)
          droneMarkerRef.current = null
        }
        mapRef.current = new google.maps.Map(containerRef.current, {
          center: coordinates[0],
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            {
              featureType: 'poi',
              stylers: [{ visibility: 'off' }],
            },
          ],
        })

        shadowPolylineRef.current = new google.maps.Polyline({
          map: mapRef.current,
          path: coordinates,
          strokeColor: '#e2e8f0',
          strokeOpacity: 0.9,
          strokeWeight: 8,
          geodesic: true,
        })

        polylineRef.current = new google.maps.Polyline({
          map: mapRef.current,
          path: coordinates,
          strokeColor: '#3b82f6',
          strokeOpacity: 0.75,
          strokeWeight: 4,
          geodesic: true,
          icons: [
            {
              icon: {
                path: 'M 0,-1 0,1',
                strokeOpacity: 1,
                scale: 3,
              },
              offset: '0',
              repeat: '22px',
            },
          ],
        })

        progressPolylineRef.current = new google.maps.Polyline({
          map: mapRef.current,
          path: [coordinates[0]],
          strokeColor: '#22c55e',
          strokeOpacity: 1,
          strokeWeight: 5,
          geodesic: true,
          zIndex: 9,
        })

        const bounds = new google.maps.LatLngBounds()
        coordinates.forEach(coord => bounds.extend(coord))
        mapRef.current.fitBounds(bounds, 48)

        const startMarker = new google.maps.Marker({
          map: mapRef.current,
          position: coordinates[0],
          title: route[0]?.title ?? 'Start',
          icon: createEndpointIcon(google, 'start'),
          zIndex: 8,
        })
        const endMarker = new google.maps.Marker({
          map: mapRef.current,
          position: coordinates[coordinates.length - 1],
          title: route[route.length - 1]?.title ?? 'Destination',
          icon: createEndpointIcon(google, 'end'),
          zIndex: 8,
        })

        const waypointIcon = createWaypointIcon(google)
        const waypointMarkers = route
          .slice(1, -1)
          .filter(point => point?.coords)
          .map(point =>
            new google.maps.Marker({
              map: mapRef.current,
              position: point.coords,
              title: point.title,
              icon: waypointIcon,
              zIndex: 7,
            })
          )

        checkpointsRef.current = [startMarker, endMarker, ...waypointMarkers]
        setError('')
        setIsReady(true)
      } catch (err) {
        console.error(err)
        setError(unavailableMessage)
        setIsReady(false)
      }
    }

    initialiseMap()

    return () => {
      cancelled = true
    }
  }, [coordinates, unavailableMessage])

  useEffect(() => {
    if (!isReady || !mapRef.current || !droneCoordinate) return
    const google = window.google
    if (!google?.maps) return

    if (!droneMarkerRef.current) {
      droneMarkerRef.current = new google.maps.Marker({
        map: mapRef.current,
        position: droneCoordinate,
        title: orderCode ? `Drone ${orderCode}` : 'Drone position',
        icon: createDroneIcon(google),
        zIndex: 10,
      })
    } else {
      droneMarkerRef.current.setPosition(droneCoordinate)
    }

    mapRef.current.panTo(droneCoordinate)
  }, [droneCoordinate, isReady, orderCode])

  useEffect(() => {
    if (!isReady || !progressPolylineRef.current) return

    const completedPath = []

    for (let index = 0; index <= currentIndex; index += 1) {
      const point = route[index]
      if (point?.coords) {
        completedPath.push(point.coords)
      }
    }

    if (droneCoordinate) {
      const hasSameAsLast = completedPath.length
        ?
          completedPath[completedPath.length - 1].lat === droneCoordinate.lat &&
          completedPath[completedPath.length - 1].lng === droneCoordinate.lng
        : false

      if (segmentProgress > 0 || (!completedPath.length && droneCoordinate)) {
        if (!hasSameAsLast) {
          completedPath.push(droneCoordinate)
        }
      }
    }

    if (!completedPath.length && route[0]?.coords) {
      completedPath.push(route[0].coords)
    }

    progressPolylineRef.current.setPath(completedPath)
  }, [currentIndex, droneCoordinate, isReady, route, segmentProgress])

  useEffect(() => () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }
    if (progressPolylineRef.current) {
      progressPolylineRef.current.setMap(null)
      progressPolylineRef.current = null
    }
    if (shadowPolylineRef.current) {
      shadowPolylineRef.current.setMap(null)
      shadowPolylineRef.current = null
    }
    checkpointsRef.current.forEach(marker => marker.setMap(null))
    checkpointsRef.current = []
    if (droneMarkerRef.current) {
      droneMarkerRef.current.setMap(null)
      droneMarkerRef.current = null
    }
    mapRef.current = null
  }, [])

  const showFallback = Boolean(error)

  return (
    <div className='google-map-wrapper'>
      <div
        ref={containerRef}
        className={`google-map-canvas${showFallback ? ' is-hidden' : ''}`}
        role='presentation'
        aria-hidden={showFallback}
      />
      {showFallback && (
        <div className='map-fallback' role='status'>
          <div className='map-fallback-icon' aria-hidden='true'>🚁</div>
          <p>{error}</p>
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
    </div>
  )
}

export default GoogleDroneMap
