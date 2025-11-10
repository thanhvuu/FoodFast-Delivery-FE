import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './OrderTracking.css'
import { useLanguage } from '../../Context/LanguageContext'
import GoogleDeliveryMap from './GoogleDeliveryMap'

const ORDERS_STORAGE_KEY = 'foodfast-orders'

const readStoredOrders = () => {
  if (typeof window === 'undefined') return []
  try {
    const data = window.localStorage.getItem(ORDERS_STORAGE_KEY)
    if (!data) return []
    const parsed = JSON.parse(data)
    return Array.isArray(parsed) ? parsed : []
  } catch (error) {
    console.error(error)
    return []
  }
}

const toUniqueOrders = orders => {
  const map = new Map()
  orders.forEach(order => {
    if (order?.id) {
      map.set(order.id, order)
    }
  })
  return Array.from(map.values())
}

const byRecency = (a, b) => {
  const parseTimestamp = value => {
    if (!value) return Number.NEGATIVE_INFINITY
    const timestamp = Date.parse(value)
    return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY
  }

  return parseTimestamp(b?.createdAt) - parseTimestamp(a?.createdAt)
}

const OrderTracking = () => {
  const { dictionary } = useLanguage()
  const { trackingPage } = dictionary

  const [storedOrders, setStoredOrders] = useState(() => readStoredOrders())

  const [user, setUser] = useState(() => {
    if (typeof window === 'undefined') return null
    const stored = window.localStorage.getItem('user')
    if (!stored) return null
    try {
      return JSON.parse(stored)
    } catch (error) {
      console.error(error)
      return null
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncUser = () => {
      try {
        const stored = window.localStorage.getItem('user')
        if (!stored) {
          setUser(null)
          return
        }
        setUser(JSON.parse(stored))
      } catch (error) {
        console.error(error)
        setUser(null)
      }
    }

    window.addEventListener('storage', syncUser)
    window.addEventListener('foodfast-auth-change', syncUser)

    return () => {
      window.removeEventListener('storage', syncUser)
      window.removeEventListener('foodfast-auth-change', syncUser)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return undefined

    const syncOrders = () => {
      setStoredOrders(readStoredOrders())
    }

    syncOrders()
    window.addEventListener('storage', syncOrders)
    window.addEventListener('foodfast-orders-update', syncOrders)

    return () => {
      window.removeEventListener('storage', syncOrders)
      window.removeEventListener('foodfast-orders-update', syncOrders)
    }
  }, [])

  const allOrders = useMemo(() => {
    const merged = toUniqueOrders([...trackingPage.orders, ...storedOrders])
    return merged.sort(byRecency)
  }, [storedOrders, trackingPage.orders])

  const availableOrders = useMemo(() => {
    if (!user?.email) return []
    return allOrders.filter(order =>
      order.customerEmail?.toLowerCase() === user.email.toLowerCase()
    )
  }, [allOrders, user?.email])

  const [selectedOrderId, setSelectedOrderId] = useState('')

  useEffect(() => {
    if (!user) {
      setSelectedOrderId('')
      return
    }
    if (!availableOrders.length) {
      setSelectedOrderId('')
      return
    }
    if (!availableOrders.some(order => order.id === selectedOrderId)) {
      setSelectedOrderId(availableOrders[0].id)
    }
  }, [availableOrders, selectedOrderId, user])

  const selectedOrder = useMemo(
    () => availableOrders.find(order => order.id === selectedOrderId),
    [availableOrders, selectedOrderId]
  )

  const route = selectedOrder?.route ?? []
  const deliveryMethod = selectedOrder?.deliveryMethod ?? 'drone'
  const methodInfo = trackingPage.methods?.[deliveryMethod] ?? trackingPage.methods?.drone ?? {}
  const methodLabel = methodInfo.label ?? (deliveryMethod === 'motorbike' ? 'Motorbike courier' : 'Drone delivery')
  const estimatedArrival = selectedOrder?.estimatedArrival ?? methodInfo.etaShort ?? '—'
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
        const next = prev + step
        if (next >= route.length - 1) {
          clearInterval(timer)
          setLastUpdated(new Date())
          return route.length - 1
        }
        setLastUpdated(new Date())
        return next
      })
    }, interval)

    return () => clearInterval(timer)
  }, [deliveryMethod, route])

  const currentIndex = Math.floor(progress)
  const nextIndex = Math.min(currentIndex + 1, route.length - 1)
  const segmentProgress = progress - currentIndex

  const currentPoint = route[currentIndex] ?? route[0]
  const nextPoint = route[nextIndex] ?? route[route.length - 1]

  const vehicleCoordinate = useMemo(() => {
    if (!currentPoint?.coords) return null
    if (!nextPoint?.coords) {
      return { ...currentPoint.coords }
    }
    return {
      lat:
        currentPoint.coords.lat +
        (nextPoint.coords.lat - currentPoint.coords.lat) * segmentProgress,
      lng:
        currentPoint.coords.lng +
        (nextPoint.coords.lng - currentPoint.coords.lng) * segmentProgress,
    }
  }, [currentPoint, nextPoint, segmentProgress])

  const completion = route.length > 1 ? (progress / (route.length - 1)) * 100 : 0

  const summaryLabels = trackingPage.summaryLabels

  const orderStatus = selectedOrder?.trackingStatus ?? selectedOrder?.status
  const statusLabel = orderStatus === 'delivered'
    ? summaryLabels.delivered
    : summaryLabels.inTransit

  const paymentLabel = selectedOrder?.paid ? summaryLabels.paid : summaryLabels.unpaid

  const selectorDisabled = !user || availableOrders.length === 0
  const selectValue = selectorDisabled ? '' : selectedOrderId

  const legendText = trackingPage.legend.updated.replace(
    '{{time}}',
    lastUpdated.toLocaleTimeString()
  )
  const legendTemplate = trackingPage.legend?.[deliveryMethod] ?? trackingPage.legend?.drone ?? ''
  const legendLabel = legendTemplate
    ? legendTemplate.replace('{{code}}', selectedOrder?.code ?? '')
    : `Order #${selectedOrder?.code ?? ''}`

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
            value={selectValue}
            onChange={event => setSelectedOrderId(event.target.value)}
            disabled={selectorDisabled}
          >
            {selectorDisabled ? (
              <option value=''>
                {!user ? trackingPage.loginRequiredTitle : trackingPage.noOrdersTitle}
              </option>
            ) : (
              availableOrders.map(order => (
                <option key={order.id} value={order.id}>
                  {order.code} — {order.customer}
                </option>
              ))
            )}
          </select>
        </div>
      </section>

      {!user ? (
        <section className='order-tracking-empty'>
          <h2>{trackingPage.loginRequiredTitle}</h2>
          <p>{trackingPage.loginRequiredDescription}</p>
          <Link to='/' className='order-tracking-link'>
            {dictionary.navbar.signInCta}
          </Link>
        </section>
      ) : !availableOrders.length ? (
        <section className='order-tracking-empty'>
          <h2>{trackingPage.noOrdersTitle}</h2>
          <p>{trackingPage.noOrdersDescription}</p>
          <Link to='/menu' className='order-tracking-link'>
            {dictionary.cart.emptyCta}
          </Link>
        </section>
      ) : selectedOrder ? (
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
              <span className='summary-label'>{summaryLabels.deliveryMethod}</span>
              <strong>{methodLabel}</strong>
              {methodInfo.description && <small className='summary-muted'>{methodInfo.description}</small>}
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.estimatedArrival}</span>
              <strong>{estimatedArrival}</strong>
              {estimatedMinutes ? (
                <small className='summary-muted'>≈ {estimatedMinutes} min</small>
              ) : null}
            </article>
            <article className='summary-card'>
              <span className='summary-label'>{summaryLabels.deliveryProgress}</span>
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
              <GoogleDeliveryMap
                route={route}
                vehicleCoordinate={vehicleCoordinate}
                currentIndex={currentIndex}
                segmentProgress={segmentProgress}
                orderCode={selectedOrder.code}
                mode={deliveryMethod}
                unavailableMessage={trackingPage.mapUnavailable}
              />
              <div className='map-legend'>
                <strong>{legendLabel}</strong>
                <span>{legendText}</span>
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
