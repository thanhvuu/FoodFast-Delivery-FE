import React, { useEffect, useMemo, useState } from 'react'
import './OrderTracking.css'
import { useLanguage } from '../../Context/LanguageContext'

const OrderTracking = () => {
  const { dictionary } = useLanguage()
  const { trackingPage } = dictionary

  const [selectedOrderId, setSelectedOrderId] = useState(
    trackingPage.orders[0]?.id ?? ''
  )

  useEffect(() => {
    if (!trackingPage.orders.some(order => order.id === selectedOrderId)) {
      setSelectedOrderId(trackingPage.orders[0]?.id ?? '')
    }
  }, [trackingPage.orders, selectedOrderId])

  const selectedOrder = useMemo(
    () => trackingPage.orders.find(order => order.id === selectedOrderId),
    [trackingPage.orders, selectedOrderId]
  )

  const route = selectedOrder?.route ?? []
  const [progress, setProgress] = useState(0)
  const [lastUpdated, setLastUpdated] = useState(new Date())

  useEffect(() => {
    setProgress(0)
    setLastUpdated(new Date())
  }, [selectedOrderId])

  useEffect(() => {
    const routeLength = route.length
    if (routeLength < 2) return undefined

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 0.015
        if (next >= routeLength - 1) {
          clearInterval(timer)
          setLastUpdated(new Date())
          return routeLength - 1
        }
        setLastUpdated(new Date())
        return next
      })
    }, 2000)

    return () => clearInterval(timer)
  }, [route])

  const currentIndex = Math.floor(progress)
  const nextIndex = Math.min(currentIndex + 1, route.length - 1)
  const segmentProgress = progress - currentIndex

  const currentPoint = route[currentIndex] ?? route[0]
  const nextPoint = route[nextIndex] ?? route[route.length - 1]

  const dronePosition = () => {
    if (!currentPoint) {
      return { left: '10%', top: '70%' }
    }
    if (!nextPoint) {
      return {
        left: `${currentPoint.position.x}%`,
        top: `${currentPoint.position.y}%`,
      }
    }
    const left =
      currentPoint.position.x +
      (nextPoint.position.x - currentPoint.position.x) * segmentProgress
    const top =
      currentPoint.position.y +
      (nextPoint.position.y - currentPoint.position.y) * segmentProgress

    return {
      left: `${left}%`,
      top: `${top}%`,
    }
  }

  const completion = route.length > 1 ? (progress / (route.length - 1)) * 100 : 0

  const summaryLabels = trackingPage.summaryLabels

  const statusLabel =
    selectedOrder?.status === 'delivered'
      ? summaryLabels.delivered
      : summaryLabels.inTransit

  const paymentLabel = selectedOrder?.paid
    ? summaryLabels.paid
    : summaryLabels.unpaid

  return (
    <main className='order-tracking-page'>
      <section className='order-tracking-hero'>
        <div className='hero-copy'>
          <p className='eyebrow'>{trackingPage.timelineTitle}</p>
          <h1>{trackingPage.title}</h1>
          <p className='lead'>{trackingPage.description}</p>
        </div>
        <div className='hero-selector'>
          <label htmlFor='tracking-order-select'>{trackingPage.selectorLabel}</label>
          <select
            id='tracking-order-select'
            value={selectedOrderId}
            onChange={event => setSelectedOrderId(event.target.value)}
          >
            {trackingPage.orders.map(order => (
              <option key={order.id} value={order.id}>
                {order.code} — {order.customer}
              </option>
            ))}
          </select>
        </div>
      </section>

      {selectedOrder ? (
        <section className='order-tracking-content'>
          <div className='tracking-summary'>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.customer}</span>
              <strong>{selectedOrder.customer}</strong>
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.address}</span>
              <strong>{selectedOrder.address}</strong>
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.status}</span>
              <span
                className={`status-pill ${
                  selectedOrder.status === 'delivered' ? 'delivered' : 'in-transit'
                }`}
              >
                {statusLabel}
              </span>
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.payment}</span>
              <span className={`status-pill ${selectedOrder.paid ? 'delivered' : 'in-transit'}`}>
                {paymentLabel}
              </span>
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.flightProgress}</span>
              <div className='summary-progress'>
                <div className='summary-progress-bar'>
                  <div style={{ width: `${completion}%` }} />
                </div>
                <small>
                  {Math.round(completion)} {summaryLabels.progressSuffix}
                </small>
              </div>
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.lastUpdate}</span>
              <strong>{lastUpdated.toLocaleTimeString()}</strong>
            </article>
          </div>

          <div className='tracking-grid'>
            <div className='tracking-map'>
              <div className='map-overlay'>
                {[...Array(4)].map((_, index) => (
                  <span
                    key={`h-${index}`}
                    className='map-line horizontal'
                    style={{ top: `${(index + 1) * 20}%` }}
                  />
                ))}
                {[...Array(4)].map((_, index) => (
                  <span
                    key={`v-${index}`}
                    className='map-line vertical'
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
                  <span className='map-point-dot' />
                  <span className='map-point-label'>{point.title}</span>
                </div>
              ))}
              <div className='map-drone' style={dronePosition()}>
                <span role='img' aria-label='Drone icon'>🚁</span>
              </div>
              <div className='map-legend'>
                <strong>
                  {trackingPage.legend.prefix}
                  {selectedOrder.code}
                </strong>
                <span>
                  {trackingPage.legend.updated.replace(
                    '{{time}}',
                    lastUpdated.toLocaleTimeString(),
                  )}
                </span>
              </div>
            </div>

            <aside className='tracking-timeline'>
              <h2>{trackingPage.timelineTitle}</h2>
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
                        <span>{point.title}</span>
                        <time>{point.eta}</time>
                      </div>
                      <p>{point.description}</p>
                    </li>
                  )
                })}
              </ul>
            </aside>
          </div>
        </section>
      ) : (
        <p className='empty-state'>No order selected.</p>
      )}
    </main>
  )
}

export default OrderTracking
