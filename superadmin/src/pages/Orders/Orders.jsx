import { useEffect, useMemo, useState } from 'react'
import './Orders.css'
import { fetchOrders, updateOrder } from '../../services/api'

const STATUS_FLOW = ['pending', 'preparing', 'completed']

const normaliseStatus = (status) => {
  if (STATUS_FLOW.includes(status)) return status
  if (status === 'in_progress') return 'preparing'
  if (status === 'complete' || status === 'delivered') return 'completed'
  return 'pending'
}

const normaliseOrder = (order, index) => {
  const status = normaliseStatus(order?.status)
  return {
    id: order?.id || `order-${index}`,
    customer: order?.customer || order?.customerName || 'Khách hàng',
    issue: order?.issue || order?.note || 'Theo dõi tiến độ giao hàng',
    channel: order?.channel || order?.paymentMethod || 'Ứng dụng',
    status,
    trackingStatus: order?.trackingStatus || status,
    total: order?.total || 0,
    address: order?.address || '',
    paymentMethod: order?.paymentMethod || 'online',
  }
}

function Orders() {
  const [orders, setOrders] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loadOrders = async () => {
    setIsLoading(true)
    try {
      const data = await fetchOrders({ _sort: 'placedAt', _order: 'desc' })
      setOrders(Array.isArray(data) ? data.map(normaliseOrder) : [])
      setError('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Không thể tải đơn hàng')
      setOrders([])
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadOrders()
  }, [])

  const statusActions = useMemo(() => ({
    pending: { label: 'Duyệt & gửi bếp', next: 'preparing' },
    preparing: { label: 'Đánh dấu hoàn tất', next: 'completed' },
    completed: { label: 'Đã giao xong', next: null },
  }), [])

  const handleAdvance = async (id) => {
    const current = orders.find(order => order.id === id)
    if (!current) return
    const nextStatus = statusActions[current.status]?.next
    if (!nextStatus) return

    const optimistic = { ...current, status: nextStatus, trackingStatus: nextStatus }
    setOrders(prev => prev.map(order => order.id === id ? optimistic : order))

    try {
      const updated = await updateOrder(id, { status: nextStatus, trackingStatus: nextStatus })
      const merged = normaliseOrder({ ...current, ...updated }, 0)
      setOrders(prev => prev.map(order => order.id === id ? merged : order))
    } catch (err) {
      console.error(err)
      alert(err?.message || 'Không thể cập nhật trạng thái đơn hàng')
      setOrders(prev => prev.map(order => order.id === id ? current : order))
    }
  }

  return (
    <div className="sa-page orders-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý đơn hàng</h2>
            <p>Đồng bộ trạng thái giữa admin, siêu admin và các ứng dụng khách.</p>
          </div>
          <button type="button" className="primary" onClick={loadOrders}>Làm mới</button>
        </header>

        {error && <div className="sa-alert">{error}</div>}

        <div className="order-list">
          {isLoading ? (
            <p className="order-empty">Đang tải đơn hàng...</p>
          ) : orders.length === 0 ? (
            <p className="order-empty">Chưa có đơn hàng</p>
          ) : (
            orders.map((order, idx) => (
              <article key={order.id ?? idx} className="order-card">
                <header>
                  <h3>{order.id}</h3>
                  <span className={`status-badge status-${order.status}`}>{order.status}</span>
                </header>
                <dl>
                  <div>
                    <dt>Khách hàng</dt>
                    <dd>{order.customer}</dd>
                  </div>
                  <div>
                    <dt>Địa chỉ</dt>
                    <dd>{order.address || '—'}</dd>
                  </div>
                  <div>
                    <dt>Thanh toán</dt>
                    <dd>{order.paymentMethod}</dd>
                  </div>
                  <div>
                    <dt>Giá trị</dt>
                    <dd>{order.total?.toLocaleString('vi-VN')} ₫</dd>
                  </div>
                </dl>
                <div className="order-actions">
                  {statusActions[order.status]?.label ? (
                    <button type="button" onClick={() => handleAdvance(order.id)}>
                      {statusActions[order.status]?.label}
                    </button>
                  ) : null}
                  <button type="button" className="ghost" onClick={loadOrders}>
                    Đồng bộ ngay
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  )
}

export default Orders
