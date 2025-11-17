import React, { useEffect, useMemo, useState } from 'react'
import './Tracking.css'
import { order_list } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const byRecency = (a, b) => {
    const parseDate = value => {
        const timestamp = Date.parse(value)
        return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY
    }

    return parseDate(b?.createdAt) - parseDate(a?.createdAt)
}

const Tracking = () => {
    const { dictionary } = useAdminLanguage()
    const t = dictionary.trackingPage

    const orders = useMemo(() => [...order_list].sort(byRecency), [])
    const [selectedOrderId, setSelectedOrderId] = useState(() => orders[0]?.id ?? '')

    useEffect(() => {
        if (!orders.length) return
        if (!orders.some(order => order.id === selectedOrderId)) {
            setSelectedOrderId(orders[0]?.id ?? '')
        }
    }, [orders, selectedOrderId])

    const selectedOrder = useMemo(
        () => orders.find(order => order.id === selectedOrderId),
        [orders, selectedOrderId]
    )

    const route = useMemo(() => selectedOrder?.route ?? [], [selectedOrder])
    const deliveryMethod = selectedOrder?.deliveryMethod ?? 'drone'
    const methodLabels = t.summaryLabels.methodNames ?? {}
    const methodLabel = methodLabels[deliveryMethod] ?? methodLabels.default ?? deliveryMethod
    const estimatedArrival = selectedOrder?.estimatedArrival ?? '—'
    const estimatedMinutes = selectedOrder?.estimatedMinutes
    const [progress, setProgress] = useState(0)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    useEffect(() => {
        setProgress(0)
        setLastUpdated(new Date())
    }, [selectedOrderId])

    useEffect(() => {
        if (route.length < 2) return undefined

        const step = deliveryMethod === 'motorbike' ? 0.01 : 0.015
        const interval = deliveryMethod === 'motorbike' ? 2500 : 2000

        const timer = setInterval(() => {
            setProgress(prev => {
                const nextValue = prev + step
                if (nextValue >= route.length - 1) {
                    clearInterval(timer)
                    setLastUpdated(new Date())
                    return route.length - 1
                }
                setLastUpdated(new Date())
                return nextValue
            })
        }, interval)

        return () => clearInterval(timer)
    }, [deliveryMethod, route])

    const currentIndex = Math.floor(progress)
    const nextIndex = Math.min(currentIndex + 1, route.length - 1)
    const segmentProgress = progress - currentIndex

    const currentPoint = route[currentIndex] ?? route[0]
    const nextPoint = route[nextIndex] ?? route[route.length - 1]

    const interpolatePosition = () => {
        if (!currentPoint?.position) return { left: '10%', top: '70%' }
        if (!nextPoint?.position) return {
            left: `${currentPoint.position.x}%`,
            top: `${currentPoint.position.y}%`
        }
        const left = currentPoint.position.x + (nextPoint.position.x - currentPoint.position.x) * segmentProgress
        const top = currentPoint.position.y + (nextPoint.position.y - currentPoint.position.y) * segmentProgress
        return {
            left: `${left}%`,
            top: `${top}%`
        }
    }

    const completion = route.length > 1 ? (progress / (route.length - 1)) * 100 : 0

    const statusKey = selectedOrder?.trackingStatus ?? selectedOrder?.status ?? 'new'
    const statusDictionary = t.summaryLabels.statusValues ?? {}
    const statusLabel = statusDictionary[statusKey] ?? statusDictionary.default ?? statusKey
    const statusClass = statusKey === 'delivered' || statusKey === 'complete'
        ? 'badge-success'
        : statusKey === 'preparing' || statusKey === 'inTransit'
            ? 'badge-progress'
            : 'badge-pending'

    const paymentLabel = selectedOrder?.paid
        ? t.summaryLabels.paid
        : t.summaryLabels.unpaid

    const legendText = t.legendUpdated.replace('{{time}}', lastUpdated.toLocaleTimeString())
    const legendPrefixes = t.legendPrefixes ?? {}
    const legendPrefix = legendPrefixes[deliveryMethod] ?? legendPrefixes.default ?? 'Drone #'
    const vehicleEmoji = deliveryMethod === 'motorbike' ? '🛵' : '🚁'

    return (
        <div className='tracking-page'>
            <header className='tracking-header'>
                <div>
                    <h2>{t.headerTitle}</h2>
                    <p>
                        {t.headerDescription}
                    </p>
                </div>
                <div className='tracking-selector'>
                    <label htmlFor='order-select'>{t.selectorLabel}</label>
                    <select
                        id='order-select'
                        value={selectedOrderId}
                        onChange={event => setSelectedOrderId(event.target.value)}
                    >
                        {orders.map(order => (
                            <option key={order.id} value={order.id}>
                                {order.code ?? order.id.toUpperCase()} — {order.customer}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            <section className='tracking-orders'>
                <div className='tracking-orders-header'>
                    <div>
                        <p className='eyebrow'>{t.timelineTitle}</p>
                        <h3>Theo dõi tất cả khách hàng</h3>
                        <p className='orders-description'>
                            Danh sách đơn được đồng bộ từ dữ liệu dtb.json giúp admin chọn nhanh chuyến bay hoặc giao xe máy.
                        </p>
                    </div>
                    <span className='order-count-badge'>{orders.length} orders</span>
                </div>
                <div className='order-grid'>
                    {orders.map(order => {
                        const cardStatus = order.trackingStatus ?? order.status
                        const isActive = order.id === selectedOrderId
                        return (
                            <button
                                type='button'
                                key={order.id}
                                className={`order-card ${isActive ? 'active' : ''}`}
                                onClick={() => setSelectedOrderId(order.id)}
                            >
                                <div className='order-card-row'>
                                    <div className='order-card-meta'>
                                        <span className='order-code'>{order.code ?? order.id.toUpperCase()}</span>
                                        <strong>{order.customer}</strong>
                                        <span className='order-email'>{order.customerEmail ?? '—'}</span>
                                    </div>
                                    <span className={`order-status-pill ${cardStatus}`}>
                                        {cardStatus ?? 'unknown'}
                                    </span>
                                </div>
                                <div className='order-card-row'>
                                    <span className='order-address'>{order.address}</span>
                                    <span className='order-method'>{methodLabels[order.deliveryMethod] ?? order.deliveryMethod}</span>
                                </div>
                            </button>
                        )
                    })}
                </div>
            </section>

            {selectedOrder ? (
                <div className='tracking-content'>
                    <section className='tracking-summary'>
                        <div className='summary-card'>
                            <span className='summary-label'>Mã đơn</span>
                            <strong>{selectedOrder.code ?? selectedOrder.id.toUpperCase()}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.customer}</span>
                            <strong>{selectedOrder.customer}</strong>
                            {selectedOrder.customerEmail && <small className='summary-muted'>{selectedOrder.customerEmail}</small>}
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.address}</span>
                            <strong>{selectedOrder.address}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.status}</span>
                            <strong className={statusClass}>{statusLabel}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.payment}</span>
                            <strong className={selectedOrder.paid ? 'badge-success' : 'badge-pending'}>
                                {paymentLabel}
                            </strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.deliveryMethod}</span>
                            <strong>{methodLabel}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.estimatedArrival}</span>
                            <strong>{estimatedArrival}</strong>
                            {estimatedMinutes ? <small className='summary-muted'>≈ {estimatedMinutes} phút</small> : null}
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.deliveryProgress}</span>
                            <div className='progress'>
                                <div className='progress-bar' style={{ width: `${completion}%` }} />
                            </div>
                            <small>{Math.round(completion)} {t.summaryLabels.progressSuffix}</small>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.lastUpdate}</span>
                            <strong>{lastUpdated.toLocaleTimeString()}</strong>
                        </div>
                    </section>

                    <section className='tracking-layout'>
                        <div className='tracking-map'>
                            <div className='map-grid'>
                                {[...Array(4)].map((_, index) => (
                                    <span
                                        key={index}
                                        className='grid-line horizontal'
                                        style={{ top: `${(index + 1) * 20}%` }}
                                    />
                                ))}
                                {[...Array(4)].map((_, index) => (
                                    <span
                                        key={`v-${index}`}
                                        className='grid-line vertical'
                                        style={{ left: `${(index + 1) * 20}%` }}
                                    />
                                ))}
                            </div>
                            {route.map(point => (
                                <div
                                    key={point.id}
                                    className='map-point'
                                    style={{ left: `${point.position?.x ?? 0}%`, top: `${point.position?.y ?? 0}%` }}
                                >
                                    <span className='point-dot' />
                                    <span className='point-label'>{point.title}</span>
                                </div>
                            ))}
                            <div className='vehicle-icon' style={interpolatePosition()}>
                                <span role='img' aria-label='Phương tiện đang di chuyển'>{vehicleEmoji}</span>
                            </div>
                            <div className='map-legend'>
                                <strong>{legendPrefix}{selectedOrder.code ?? selectedOrder.id.toUpperCase()}</strong>
                                <span>{legendText}</span>
                            </div>
                        </div>
                        <aside className='tracking-timeline'>
                            <h3>{t.timelineTitle}</h3>
                            <ul>
                                {route.map((point, index) => {
                                    const isCompleted = index < currentIndex || progress >= route.length - 1
                                    const isActive = index === currentIndex && progress < route.length - 1
                                    return (
                                        <li
                                            key={point.id}
                                            className={`${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                                        >
                                            <div className='timeline-header'>
                                                <span className='timeline-title'>{point.title}</span>
                                                <span className='timeline-eta'>{point.eta}</span>
                                            </div>
                                            <p>{point.description}</p>
                                        </li>
                                    )
                                })}
                            </ul>
                        </aside>
                    </section>
                </div>
            ) : (
                <p>{t.empty}</p>
            )}
        </div>
    )
}

export default Tracking
