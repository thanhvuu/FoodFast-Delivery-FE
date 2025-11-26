import React, { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import './OrderTracking.css'
import { useLanguage } from '../../Context/LanguageContext'
import OrsDeliveryMap from './OrsDeliveryMap'
import { updateOrderStatus } from '../../services/api'

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

const writeStoredOrders = orders => {
  if (typeof window === 'undefined') return
  try {
    window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders))
    window.dispatchEvent(new Event('foodfast-orders-update'))
  } catch (error) {
    console.error(error)
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
  const [hideArrivedCard, setHideArrivedCard] = useState(false)

  useEffect(() => {
    setProgress(0)
    setLastUpdated(new Date())
    setHideArrivedCard(false)
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
  const deliveredNotified = React.useRef(false)
  useEffect(() => {
    const status = (selectedOrder?.status ?? '').toLowerCase()
    if (completion >= 100 && !deliveredNotified.current && status !== 'completed' && status !== 'cancelled') {
      deliveredNotified.current = true
      alert(trackingPage.arrivedSuccess || 'Đơn hàng đã được giao tới.')
    }
    if (completion < 100) {
      deliveredNotified.current = false
    }
  }, [completion, selectedOrder?.status, trackingPage.arrivedSuccess])

  const summaryLabels = trackingPage.summaryLabels

  const baseStatus = (selectedOrder?.trackingStatus ?? selectedOrder?.status ?? '').toLowerCase()
  const derivedStatus = (() => {
    if (baseStatus === 'completed' || baseStatus === 'delivered' || baseStatus === 'cancelled') return baseStatus
    if (completion >= 100) return 'delivered'
    if (completion >= 80) return 'ready-for-pickup'
    if (completion >= 50) return 'delivering'
    if (completion > 0) return 'preparing'
    return 'pending'
  })()
  const orderStatus = derivedStatus
  const statusLabel =
    orderStatus === 'completed' || orderStatus === 'delivered'
      ? 'Completed'
      : orderStatus === 'pending'
        ? 'Pending'
        : orderStatus === 'preparing'
          ? 'Preparing'
          : orderStatus === 'ready for pickup' || orderStatus === 'ready-for-pickup'
            ? 'Ready for Pickup'
            : orderStatus === 'delivering' || orderStatus === 'on-the-way'
              ? 'Delivering'
              : orderStatus === 'cancelled'
                ? 'Cancelled'
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

  const normalizedStatus = derivedStatus
  const normalizedTracking = derivedStatus
  const hasLaunched =
    ['delivering', 'on-the-way', 'intransit', 'ready-for-pickup', 'ready for pickup', 'completed', 'delivered', 'cancelled'].includes(
      normalizedTracking || normalizedStatus,
    )
  const canCancel = normalizedStatus === 'pending' && !hasLaunched
  const canComplete = normalizedStatus !== 'completed' && normalizedStatus !== 'cancelled' && completion >= 100 && !hideArrivedCard
  const arrivedNotice = completion >= 100

  useEffect(() => {
    if (normalizedStatus === 'completed' || normalizedStatus === 'cancelled') {
      setHideArrivedCard(true)
    }
  }, [normalizedStatus])

  const handleCancel = async () => {
    if (!selectedOrder?.id) return
    if (!canCancel) {
      alert(trackingPage.cancelBlocked || 'Đơn đã rời bếp, không thể hủy.');
      return;
    }
    const localFallback = () => {
      const updated = { ...selectedOrder, status: 'cancelled', trackingStatus: 'cancelled' }
      const mergedOrders = toUniqueOrders([
        updated,
        ...readStoredOrders().filter(order => order.id !== selectedOrder.id),
      ])
      writeStoredOrders(mergedOrders)
      setSelectedOrderId(updated.id)
    }

    try {
      // Nếu là đơn local hoặc chưa đồng bộ backend, chỉ cập nhật local
      if (selectedOrder.id.startsWith('local-')) {
        localFallback()
        return
      }
      const updated = await updateOrderStatus(selectedOrder.id, 'cancelled')
      if (!updated) {
        localFallback()
        return
      }
      const mergedOrders = toUniqueOrders([
        updated,
        ...readStoredOrders().filter(order => order.id !== selectedOrder.id),
      ])
      writeStoredOrders(mergedOrders)
      setSelectedOrderId(updated.id)
    } catch (error) {
      console.error(error)
      localFallback()
      alert(trackingPage.cancelError || 'Không thể hủy đơn lúc này, đã lưu trạng thái hủy cục bộ.')
    }
  }

  const handleComplete = async () => {
    if (!selectedOrder?.id) return
    const localComplete = () => {
      const updated = { ...selectedOrder, status: 'completed', trackingStatus: 'delivered' }
      const mergedOrders = toUniqueOrders([
        updated,
        ...readStoredOrders().filter(order => order.id !== selectedOrder.id),
      ])
      writeStoredOrders(mergedOrders)
      setSelectedOrderId(updated.id)
      window.alert(trackingPage.completeSuccess || 'Đơn hàng đã được giao.')
    }
    try {
      if (selectedOrder.id.startsWith('local-')) {
        localComplete()
        return
      }
      const updated = await updateOrderStatus(selectedOrder.id, 'completed')
      if (!updated) {
        localComplete()
        return
      }
      const mergedOrders = toUniqueOrders([
        { ...updated, trackingStatus: updated.trackingStatus ?? 'delivered' },
        ...readStoredOrders().filter(order => order.id !== selectedOrder.id),
      ])
      writeStoredOrders(mergedOrders)
      setSelectedOrderId(updated.id)
      window.alert(trackingPage.completeSuccess || 'Đơn hàng đã được giao.')
      setHideArrivedCard(true)
    } catch (error) {
      console.error(error)
      localComplete()
      alert(trackingPage.completeError || 'Không thể hoàn tất đơn lúc này, đã lưu cục bộ.')
    }
  }

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
                  orderStatus === 'delivered' || orderStatus === 'completed'
                    ? 'delivered'
                    : orderStatus === 'cancelled'
                      ? 'cancelled'
                      : 'in-transit'
                }`}
              >
                {orderStatus === 'cancelled' ? 'Cancelled' : statusLabel}
              </span>
              {canCancel ? (
                <button className='cancel-btn' onClick={handleCancel}>
                  {trackingPage.cancelLabel || 'Hủy đơn'}
                </button>
              ) : null}
            </article>
            {arrivedNotice && canComplete ? (
              <article className='summary-card arrived-card'>
                <span className='summary-label'>{trackingPage.arrivedTitle || 'Đơn đã giao tới'}</span>
                <p className='summary-muted'>{trackingPage.arrivedSubtitle || 'Vui lòng xác nhận đã nhận hàng.'}</p>
                <button className='complete-btn' onClick={handleComplete}>
                  {trackingPage.completeLabel || 'Đánh dấu hoàn tất'}
                </button>
              </article>
            ) : null}
            {!arrivedNotice && canComplete ? (
              <article className='summary-card'>
                <span className='summary-label'>{trackingPage.completeTitle || 'Kết thúc đơn'}</span>
                <button className='complete-btn' onClick={handleComplete}>
                  {trackingPage.completeLabel || 'Đánh dấu hoàn tất'}
                </button>
              </article>
            ) : null}
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
              <OrsDeliveryMap
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
