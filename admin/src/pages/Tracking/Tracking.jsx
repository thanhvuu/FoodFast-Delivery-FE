import React, { useEffect, useMemo, useState } from 'react'
import './Tracking.css'
import { order_list } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const getInitialOrderId = () => order_list[0]?.id ?? ''

const Tracking = () => {
    const [selectedOrderId, setSelectedOrderId] = useState(getInitialOrderId)
    const { dictionary } = useAdminLanguage()
    const t = dictionary.trackingPage

    const selectedOrder = useMemo(
        () => order_list.find(order => order.id === selectedOrderId),
        [selectedOrderId]
    )

    const route = selectedOrder?.route ?? []
    const [progress, setProgress] = useState(0)
    const [lastUpdated, setLastUpdated] = useState(new Date())

    useEffect(() => {
        setProgress(0)
        setLastUpdated(new Date())
    }, [selectedOrderId])

    useEffect(() => {
        if (route.length < 2) return

        const timer = setInterval(() => {
            setProgress(prev => {
                const nextValue = prev + 0.015
                if (nextValue >= route.length - 1) {
                    clearInterval(timer)
                    setLastUpdated(new Date())
                    return route.length - 1
                }
                setLastUpdated(new Date())
                return nextValue
            })
        }, 2000)

        return () => clearInterval(timer)
    }, [route])

    const currentIndex = Math.floor(progress)
    const nextIndex = Math.min(currentIndex + 1, route.length - 1)
    const segmentProgress = progress - currentIndex

    const currentPoint = route[currentIndex] ?? route[0]
    const nextPoint = route[nextIndex] ?? route[route.length - 1]

    const interpolatePosition = () => {
        if (!currentPoint) return { left: '10%', top: '70%' }
        if (!nextPoint) return {
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

    const statusLabel = selectedOrder?.status === 'delivered'
        ? t.summaryLabels.delivered
        : t.summaryLabels.inTransit

    const paymentLabel = selectedOrder?.paid
        ? t.summaryLabels.paid
        : t.summaryLabels.unpaid

    const legendText = t.legendUpdated.replace('{{time}}', lastUpdated.toLocaleTimeString())

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
                        {order_list.map(order => (
                            <option key={order.id} value={order.id}>
                                {order.customer} — {order.id.toUpperCase()}
                            </option>
                        ))}
                    </select>
                </div>
            </header>

            {selectedOrder ? (
                <div className='tracking-content'>
                    <section className='tracking-summary'>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.customer}</span>
                            <strong>{selectedOrder.customer}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.address}</span>
                            <strong>{selectedOrder.address}</strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.status}</span>
                            <strong className={selectedOrder.status === 'delivered' ? 'badge-success' : 'badge-pending'}>
                                {statusLabel}
                            </strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.payment}</span>
                            <strong className={selectedOrder.paid ? 'badge-success' : 'badge-pending'}>
                                {paymentLabel}
                            </strong>
                        </div>
                        <div className='summary-card'>
                            <span className='summary-label'>{t.summaryLabels.flightProgress}</span>
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
                                    style={{ left: `${point.position.x}%`, top: `${point.position.y}%` }}
                                >
                                    <span className='point-dot' />
                                    <span className='point-label'>{point.title}</span>
                                </div>
                            ))}
                            <div className='drone-icon' style={interpolatePosition()}>
                                <span role='img' aria-label='Drone đang di chuyển'>🚁</span>
                            </div>
                            <div className='map-legend'>
                                <strong>Drone #{selectedOrder.id.toUpperCase()}</strong>
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
