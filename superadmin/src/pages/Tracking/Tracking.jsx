import { useEffect, useMemo, useState } from 'react'
import ordersData from '../../data/orders.json'
import { fetchOrders } from '../../services/api'
import OrsDeliveryMap from './OrsDeliveryMap'
import './Tracking.css'
import 'leaflet/dist/leaflet.css'

const byRecency = (a, b) => {
  const parseDate = (value) => {
    const timestamp = Date.parse(value)
    return Number.isFinite(timestamp) ? timestamp : Number.NEGATIVE_INFINITY
  }

  return parseDate(b?.createdAt) - parseDate(a?.createdAt)
}

const normalizeOrder = (order) => ({
  ...order,
  status: order?.status ?? order?.trackingStatus ?? 'new',
  trackingStatus: order?.trackingStatus ?? order?.status ?? 'new',
  createdAt: order?.createdAt ?? order?.placedAt,
  route: Array.isArray(order?.route) ? order.route : [],
  code: order?.code ?? order?.id,
  deliveryMethod: order?.deliveryMethod ?? 'drone',
})

const mergeOrders = (base, incoming) => {
  const unique = new Map()
  base.forEach((order) => unique.set(order.id, order))
  incoming.forEach((order) => unique.set(order.id, order))
  return Array.from(unique.values()).sort(byRecency)
}

const deliveryLabels = {
  drone: 'Drone giao nhanh',
  motorbike: 'Shipper',
  default: 'Đang gán kênh',
}

const statusLabels = {
  new: 'Chờ điều phối',
  preparing: 'Đang chuẩn bị',
  inTransit: 'Đang giao',
  pending: 'Tạm dừng',
  delivered: 'Đã giao',
  complete: 'Đã hoàn tất',
  cancelled: 'Đã huỷ',
  default: 'Không xác định',
}

function Tracking() {
  const [orders, setOrders] = useState(() => ordersData.map(normalizeOrder).sort(byRecency))
  const [selectedOrderId, setSelectedOrderId] = useState(() => orders[0]?.id ?? '')
  const [lastSyncedAt, setLastSyncedAt] = useState(null)
  const [syncing, setSyncing] = useState(false)
  const [syncError, setSyncError] = useState('')

  useEffect(() => {
    const loadOrders = async () => {
      setSyncing(true)
      setSyncError('')
      try {
        const apiOrders = await fetchOrders()
        const normalized = Array.isArray(apiOrders) ? apiOrders.map(normalizeOrder) : []
        setOrders((prev) => mergeOrders(prev, normalized))
        setLastSyncedAt(new Date())
      } catch (error) {
        console.error('Không thể đồng bộ danh sách chuyến giao', error)
        setSyncError('Không thể đồng bộ dữ liệu realtime. Đang hiển thị dữ liệu tĩnh.')
      } finally {
        setSyncing(false)
      }
    }

    loadOrders()
  }, [])

  useEffect(() => {
    if (!orders.length) return
    if (!orders.some((order) => order.id === selectedOrderId)) {
      setSelectedOrderId(orders[0]?.id ?? '')
    }
  }, [orders, selectedOrderId])

  const selectedOrder = useMemo(() => orders.find((order) => order.id === selectedOrderId), [orders, selectedOrderId])
  const route = useMemo(() => selectedOrder?.route ?? [], [selectedOrder])
  const deliveryMethod = selectedOrder?.deliveryMethod ?? 'drone'
  const methodLabel = deliveryLabels[deliveryMethod] ?? deliveryLabels.default
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
      setProgress((prev) => {
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

  const vehicleCoordinate = useMemo(() => {
    if (!currentPoint?.coords) return null
    if (!nextPoint?.coords) {
      return {
        lat: currentPoint.coords.lat,
        lng: currentPoint.coords.lng,
      }
    }
    return {
      lat: currentPoint.coords.lat + (nextPoint.coords.lat - currentPoint.coords.lat) * segmentProgress,
      lng: currentPoint.coords.lng + (nextPoint.coords.lng - currentPoint.coords.lng) * segmentProgress,
    }
  }, [currentPoint, nextPoint, segmentProgress])

  const completion = route.length > 1 ? (progress / (route.length - 1)) * 100 : 0

  const statusKey = selectedOrder?.trackingStatus ?? selectedOrder?.status ?? 'new'
  const statusLabel = statusLabels[statusKey] ?? statusLabels.default
  const statusClass = statusKey === 'delivered' || statusKey === 'complete'
    ? 'badge-success'
    : statusKey === 'preparing' || statusKey === 'inTransit'
      ? 'badge-progress'
      : 'badge-pending'

  const paymentLabel = selectedOrder?.paid ? 'Đã thanh toán' : 'Chưa thanh toán'
  const legendText = lastUpdated ? `Cập nhật gần nhất ${lastUpdated.toLocaleTimeString()}` : 'Chưa cập nhật'
  const legendPrefix = deliveryMethod === 'motorbike' ? 'Courier #' : 'Drone #'

  return (
    <div className="sa-page tracking-page">
      <section className="sa-section tracking-hero">
        <div>
          <p className="eyebrow">Theo dõi drone</p>
          <h2>Điều phối giao hàng realtime</h2>
          <p>
            Giám sát trạng thái từng lộ trình giao drone và shipper. Mọi thao tác khóa, tạm dừng hay giao lại được phản hồi tức thì.
          </p>
          <div className="sync-row">
            <span className={syncing ? 'pulse' : ''}>⚡ Đồng bộ {syncing ? 'đang chạy…' : 'ổn định'}</span>
            {lastSyncedAt && <small>Lần cuối: {lastSyncedAt.toLocaleTimeString()}</small>}
            {syncError && <small className="text-danger">{syncError}</small>}
          </div>
        </div>
        <div className="tracking-selector">
          <label htmlFor="order-select">Chọn đơn hàng</label>
          <select
            id="order-select"
            value={selectedOrderId}
            onChange={(event) => setSelectedOrderId(event.target.value)}
          >
            {orders.map((order) => (
              <option key={order.id} value={order.id}>
                {order.code ?? order.id.toUpperCase()} — {order.customer}
              </option>
            ))}
          </select>
          <button
            type="button"
            className="ghost"
            onClick={() => setSelectedOrderId(orders[0]?.id ?? '')}
            disabled={!orders.length}
          >
            Về đơn mới nhất
          </button>
        </div>
      </section>

      <section className="sa-section tracking-orders">
        <div className="tracking-orders-header">
          <div>
            <p className="eyebrow">Lộ trình giao hàng</p>
            <h3>Theo dõi tất cả khách hàng</h3>
            <p className="orders-description">
              Danh sách đơn được đồng bộ từ dữ liệu backend và bảng điều phối. Chọn nhanh chuyến bay drone hoặc chuyển qua shipper khi cần.
            </p>
          </div>
          <span className="order-count-badge">{orders.length} orders</span>
        </div>
        <div className="order-grid">
          {orders.map((order) => {
            const cardStatus = order.trackingStatus ?? order.status
            const isActive = order.id === selectedOrderId
            return (
              <button
                type="button"
                key={order.id}
                className={`order-card ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedOrderId(order.id)}
              >
                <div className="order-card-row">
                  <div className="order-card-meta">
                    <span className="order-code">{order.code ?? order.id.toUpperCase()}</span>
                    <strong>{order.customer}</strong>
                    <span className="order-email">{order.customerEmail ?? '—'}</span>
                  </div>
                  <span className={`order-status-pill ${cardStatus}`}>
                    {cardStatus ?? 'unknown'}
                  </span>
                </div>
                <div className="order-card-row">
                  <span className="order-address">{order.address}</span>
                  <span className="order-method">{deliveryLabels[order.deliveryMethod] ?? order.deliveryMethod}</span>
                </div>
              </button>
            )
          })}
        </div>
      </section>

      {selectedOrder ? (
        <div className="tracking-content">
          <section className="tracking-summary">
            <div className="summary-card">
              <span className="summary-label">Mã đơn</span>
              <strong>{selectedOrder.code ?? selectedOrder.id.toUpperCase()}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Khách</span>
              <strong>{selectedOrder.customer}</strong>
              {selectedOrder.customerEmail && <small className="summary-muted">{selectedOrder.customerEmail}</small>}
            </div>
            <div className="summary-card">
              <span className="summary-label">Địa chỉ</span>
              <strong>{selectedOrder.address}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Trạng thái</span>
              <strong className={statusClass}>{statusLabel}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Thanh toán</span>
              <strong className={selectedOrder.paid ? 'badge-success' : 'badge-pending'}>
                {paymentLabel}
              </strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Kênh giao</span>
              <strong>{methodLabel}</strong>
            </div>
            <div className="summary-card">
              <span className="summary-label">Dự kiến giao</span>
              <strong>{estimatedArrival}</strong>
              {estimatedMinutes ? <small className="summary-muted">≈ {estimatedMinutes} phút</small> : null}
            </div>
            <div className="summary-card">
              <span className="summary-label">Tiến độ</span>
              <div className="progress">
                <div className="progress-bar" style={{ width: `${completion}%` }} />
              </div>
              <small>{Math.round(completion)} % hoàn thành</small>
            </div>
            <div className="summary-card">
              <span className="summary-label">Cập nhật</span>
              <strong>{lastUpdated.toLocaleTimeString()}</strong>
            </div>
          </section>

          <section className="tracking-layout">
            <div className="tracking-map">
              <OrsDeliveryMap
                route={route}
                vehicleCoordinate={vehicleCoordinate}
                currentIndex={currentIndex}
                segmentProgress={segmentProgress}
                orderCode={selectedOrder.code ?? selectedOrder.id.toUpperCase()}
                mode={deliveryMethod}
                unavailableMessage="Map không khả dụng"
              />
              <div className="map-legend">
                <strong>{legendPrefix}{selectedOrder.code ?? selectedOrder.id.toUpperCase()}</strong>
                <span>{legendText}</span>
              </div>
            </div>
            <aside className="tracking-timeline">
              <h3>Hành trình giao</h3>
              <ul>
                {route.map((point, index) => {
                  const isCompleted = index < currentIndex || progress >= route.length - 1
                  const isActive = index === currentIndex && progress < route.length - 1
                  return (
                    <li
                      key={point.id}
                      className={`${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                    >
                      <div className="timeline-header">
                        <span className="timeline-title">{point.title}</span>
                        <span className="timeline-eta">{point.eta}</span>
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
        <p className="empty-state">Không tìm thấy đơn cần theo dõi</p>
      )}
    </div>
  )
}

export default Tracking
