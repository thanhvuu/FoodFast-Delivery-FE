import { useMemo } from 'react'

const paletteByMode = {
    drone: {
        primary: '#3b82f6',
        shadow: '#bfdbfe',
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

const createBoundingBox = (coordinates = []) => {
    if (!coordinates.length) {
        return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 }
    }

    let minLat = Number.POSITIVE_INFINITY
    let maxLat = Number.NEGATIVE_INFINITY
    let minLng = Number.POSITIVE_INFINITY
    let maxLng = Number.NEGATIVE_INFINITY

    coordinates.forEach(coord => {
        if (coord?.lat == null || coord?.lng == null) return
        minLat = Math.min(minLat, coord.lat)
        maxLat = Math.max(maxLat, coord.lat)
        minLng = Math.min(minLng, coord.lng)
        maxLng = Math.max(maxLng, coord.lng)
    })

    if (!Number.isFinite(minLat) || !Number.isFinite(maxLat) || !Number.isFinite(minLng) || !Number.isFinite(maxLng)) {
        return { minLat: 0, maxLat: 1, minLng: 0, maxLng: 1 }
    }

    if (minLat === maxLat) {
        minLat -= 0.01
        maxLat += 0.01
    }
    if (minLng === maxLng) {
        minLng -= 0.01
        maxLng += 0.01
    }

    return { minLat, maxLat, minLng, maxLng }
}

const project = (coord, box) => {
    if (!coord) return null
    const x = ((coord.lng - box.minLng) / (box.maxLng - box.minLng)) * 100
    const y = 100 - ((coord.lat - box.minLat) / (box.maxLat - box.minLat)) * 100
    return { x, y }
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

    const boundingBox = useMemo(
        () => createBoundingBox([...coordinates, vehicleCoordinate].filter(Boolean)),
        [coordinates, vehicleCoordinate]
    )

    const projectedRoute = useMemo(
        () => coordinates.map(coord => project(coord, boundingBox)).filter(Boolean),
        [boundingBox, coordinates]
    )

    const projectedVehicle = useMemo(
        () => project(vehicleCoordinate, boundingBox),
        [boundingBox, vehicleCoordinate]
    )

    const progressPoints = useMemo(() => {
        if (!Array.isArray(route) || route.length === 0) return []

        const completed = []

        for (let index = 0; index <= currentIndex; index += 1) {
            const point = route[index]
            if (point?.coords) {
                const projected = project(point.coords, boundingBox)
                if (projected) completed.push(projected)
            }
        }

        if (projectedVehicle) {
            const last = completed.length ? completed[completed.length - 1] : null
            const sameAsLast = last ? last.x === projectedVehicle.x && last.y === projectedVehicle.y : false

            if (segmentProgress > 0 || (!completed.length && projectedVehicle)) {
                if (!sameAsLast) {
                    completed.push(projectedVehicle)
                }
            }
        }

        if (!completed.length && projectedRoute[0]) {
            completed.push(projectedRoute[0])
        }

        return completed
    }, [boundingBox, currentIndex, projectedRoute, projectedVehicle, route, segmentProgress])

    const palette = paletteByMode[mode] ?? paletteByMode.drone
    const showFallback = projectedRoute.length === 0

    const renderWaypoint = (point, index) => (
        <g key={point.id ?? index}>
            <circle cx={point.x} cy={point.y} r='2.3' fill={palette.waypoint} opacity='0.9' />
            <circle cx={point.x} cy={point.y} r='5.5' fill='none' stroke={palette.shadow} strokeWidth='2' />
        </g>
    )

    return (
        <div className='delivery-map-wrapper'>
            {!showFallback ? (
                <svg className='delivery-map-canvas' viewBox='0 0 100 100' preserveAspectRatio='xMidYMid meet'>
                    <defs>
                        <linearGradient id='route-bg' x1='0%' y1='0%' x2='0%' y2='100%'>
                            <stop offset='0%' stopColor='rgba(14,165,233,0.14)' />
                            <stop offset='100%' stopColor='rgba(99,102,241,0.14)' />
                        </linearGradient>
                        <filter id='glow'>
                            <feGaussianBlur stdDeviation='1.4' result='blur' />
                            <feMerge>
                                <feMergeNode in='blur' />
                                <feMergeNode in='SourceGraphic' />
                            </feMerge>
                        </filter>
                        <linearGradient id='start-grad' x1='0%' y1='0%' x2='100%' y2='100%'>
                            <stop offset='0%' stopColor={palette.startGradient[0]} />
                            <stop offset='100%' stopColor={palette.startGradient[1]} />
                        </linearGradient>
                    </defs>

                    <rect x='0' y='0' width='100' height='100' fill='url(#route-bg)' />

                    {projectedRoute.length ? (
                        <polyline
                            points={projectedRoute.map(point => `${point.x},${point.y}`).join(' ')}
                            fill='none'
                            stroke={palette.shadow}
                            strokeWidth='5.5'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            opacity='0.85'
                        />
                    ) : null}

                    {projectedRoute.length ? (
                        <polyline
                            points={projectedRoute.map(point => `${point.x},${point.y}`).join(' ')}
                            fill='none'
                            stroke={palette.primary}
                            strokeWidth='2.4'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            strokeDasharray='6 8'
                            opacity='0.95'
                        />
                    ) : null}

                    {progressPoints.length ? (
                        <polyline
                            points={progressPoints.map(point => `${point.x},${point.y}`).join(' ')}
                            fill='none'
                            stroke={palette.progress}
                            strokeWidth='3.6'
                            strokeLinecap='round'
                            strokeLinejoin='round'
                            filter='url(#glow)'
                        />
                    ) : null}

                    {projectedRoute[0] ? (
                        <g transform={`translate(${projectedRoute[0].x}, ${projectedRoute[0].y})`}>
                            <circle r='7.5' fill='url(#start-grad)' opacity='0.92' />
                            <text
                                x='0'
                                y='2.6'
                                textAnchor='middle'
                                fontSize='5.2'
                                fontWeight='700'
                                fill='#0f172a'
                            >
                                A
                            </text>
                        </g>
                    ) : null}

                    {projectedRoute[projectedRoute.length - 1] ? (
                        <g transform={`translate(${projectedRoute[projectedRoute.length - 1].x}, ${projectedRoute[projectedRoute.length - 1].y})`}>
                            <circle r='7.5' fill='#f43f5e' opacity='0.95' />
                            <text
                                x='0'
                                y='2.6'
                                textAnchor='middle'
                                fontSize='5.2'
                                fontWeight='700'
                                fill='#fff7ed'
                            >
                                B
                            </text>
                        </g>
                    ) : null}

                    {projectedRoute
                        .slice(1, -1)
                        .map((point, index) => renderWaypoint(point, route[index + 1]?.id ?? index))}

                    {projectedVehicle ? (
                        <g transform={`translate(${projectedVehicle.x}, ${projectedVehicle.y})`}>
                            <circle r='8' fill={palette.primary} opacity='0.95' />
                            <text
                                x='0'
                                y='2.6'
                                textAnchor='middle'
                                fontSize='5.2'
                                fontWeight='700'
                                fill='#f8fafc'
                            >
                                {mode === 'motorbike' ? '🛵' : '🚁'}
                            </text>
                        </g>
                    ) : null}

                    <text
                        x='6'
                        y='10'
                        fontSize='6'
                        fontWeight='600'
                        fill='rgba(15,23,42,0.55)'
                    >
                        {orderCode ? `Route ${orderCode}` : 'Route preview'}
                    </text>
                </svg>
            ) : null}

            {showFallback && (
                <div className='map-fallback' role='status'>
                    <div className='map-fallback-icon' aria-hidden='true'>
                        {palette.fallbackIcon}
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
        </div>
    )
}

export default OrsDeliveryMap
