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

const GoogleDroneMap = ({ route, droneCoordinate, orderCode, unavailableMessage }) => {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const polylineRef = useRef(null)
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

        polylineRef.current = new google.maps.Polyline({
          map: mapRef.current,
          path: coordinates,
          strokeColor: '#2563eb',
          strokeOpacity: 0.9,
          strokeWeight: 4,
        })

        const bounds = new google.maps.LatLngBounds()
        coordinates.forEach(coord => bounds.extend(coord))
        mapRef.current.fitBounds(bounds, 48)

        const startMarker = new google.maps.Marker({
          map: mapRef.current,
          position: coordinates[0],
          label: { text: 'A', color: '#0f172a', fontWeight: 'bold' },
        })
        const endMarker = new google.maps.Marker({
          map: mapRef.current,
          position: coordinates[coordinates.length - 1],
          label: { text: 'B', color: '#0f172a', fontWeight: 'bold' },
        })
        checkpointsRef.current = [startMarker, endMarker]
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

  useEffect(() => () => {
    if (polylineRef.current) {
      polylineRef.current.setMap(null)
      polylineRef.current = null
    }
    checkpointsRef.current.forEach(marker => marker.setMap(null))
    checkpointsRef.current = []
    if (droneMarkerRef.current) {
      droneMarkerRef.current.setMap(null)
      droneMarkerRef.current = null
    }
    mapRef.current = null
  }, [])

  return (
    <div className='google-map-wrapper'>
      <div ref={containerRef} className='google-map-canvas' role='presentation' />
      {error && <div className='map-error'>{error}</div>}
    </div>
  )
}

export default GoogleDroneMap
