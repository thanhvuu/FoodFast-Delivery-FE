import { useMemo, useState } from 'react'
import { resetOrders } from '../storage/orderStorage'
import './OrdersSection.css'

const DELIVERY_STATES = ['Đang xử lý', 'Đang giao', 'Đã giao']
const PAYMENT_STATES = ['Chưa thanh toán', 'Đã thanh toán']

const OrdersSection = ({ orders, onOrderUpdate, onOrdersChange }) => {
  const [deliveryFilter, setDeliveryFilter] = useState('Tất cả trạng thái')
  const [paymentFilter, setPaymentFilter] = useState('Tất cả thanh toán')

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesDelivery =
        deliveryFilter === 'Tất cả trạng thái' || order.deliveryStatus === deliveryFilter
      const matchesPayment =
        paymentFilter === 'Tất cả thanh toán' || order.paymentStatus === paymentFilter
      return matchesDelivery && matchesPayment
    })
  }, [orders, deliveryFilter, paymentFilter])

  const statusSummary = useMemo(() => {
    return {
      processing: orders.filter((order) => order.deliveryStatus === 'Đang xử lý').length,
      delivering: orders.filter((order) => order.deliveryStatus === 'Đang giao').length,
      completed: orders.filter((order) => order.deliveryStatus === 'Đã giao').length,
      unpaid: orders.filter((order) => order.paymentStatus === 'Chưa thanh toán').length,
      attention: orders.filter((order) => order.flags?.attention || order.flags?.delayed).length,
    }
  }, [orders])

  const handleResetFromFile = () => {
    const freshOrders = resetOrders()
    onOrdersChange(freshOrders)
  }

  return (
    <div className='orders-section'>
      <div className='orders-summary'>
        <article>
          <span>Đang xử lý</span>
          <strong>{statusSummary.processing}</strong>
        </article>
        <article>
          <span>Đang giao</span>
          <strong>{statusSummary.delivering}</strong>
        </article>
        <article>
          <span>Đã giao</span>
          <strong>{statusSummary.completed}</strong>
        </article>
        <article>
          <span>Chưa thanh toán</span>
          <strong>{statusSummary.unpaid}</strong>
        </article>
        <article>
          <span>Đơn cần chú ý</span>
          <strong>{statusSummary.attention}</strong>
        </article>
      </div>

      <div className='orders-controls'>
        <div className='select-group'>
          <label>
            Trạng thái giao hàng
            <select value={deliveryFilter} onChange={(event) => setDeliveryFilter(event.target.value)}>
              <option>Tất cả trạng thái</option>
              {DELIVERY_STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
          <label>
            Trạng thái thanh toán
            <select value={paymentFilter} onChange={(event) => setPaymentFilter(event.target.value)}>
              <option>Tất cả thanh toán</option>
              {PAYMENT_STATES.map((state) => (
                <option key={state}>{state}</option>
              ))}
            </select>
          </label>
        </div>
        <button type='button' className='link-btn' onClick={handleResetFromFile}>
          Làm mới từ file JSON gốc
        </button>
      </div>

      <div className='orders-list'>
        {filteredOrders.map((order, index) => (
          <article className='order-card' key={order.id}>
            <header>
              <div>
                <span className='order-index'>Đơn #{order.sequence ?? index + 1}</span>
                <h3>{order.customer?.name}</h3>
                <p>{order.customer?.email}</p>
              </div>
              <div className='order-actions'>
                <button
                  type='button'
                  className='pill-btn'
                  onClick={() =>
                    onOrderUpdate(order.id, (prev) => ({
                      ...prev,
                      flags: { ...prev.flags, attention: !prev.flags?.attention },
                    }))
                  }
                >
                  {order.flags?.attention ? 'Bỏ đánh dấu' : 'Cần chú ý'}
                </button>
                <button
                  type='button'
                  className='pill-btn'
                  onClick={() =>
                    onOrderUpdate(order.id, (prev) => ({
                      ...prev,
                      paymentStatus:
                        prev.paymentStatus === 'Đã thanh toán' ? 'Chưa thanh toán' : 'Đã thanh toán',
                    }))
                  }
                >
                  {order.paymentStatus === 'Đã thanh toán' ? 'Đánh dấu chưa thanh toán' : 'Đánh dấu đã thanh toán'}
                </button>
              </div>
            </header>

            <div className='order-status'>
              <div>
                <span>Giao hàng</span>
                <select
                  value={order.deliveryStatus}
                  onChange={(event) =>
                    onOrderUpdate(order.id, (prev) => ({
                      ...prev,
                      deliveryStatus: event.target.value,
                      flags: {
                        ...prev.flags,
                        delayed:
                          event.target.value === 'Đang giao' ? prev.flags?.delayed : event.target.value !== 'Đã giao' && prev.flags?.delayed,
                      },
                    }))
                  }
                >
                  {DELIVERY_STATES.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <span>Thanh toán</span>
                <select
                  value={order.paymentStatus}
                  onChange={(event) =>
                    onOrderUpdate(order.id, (prev) => ({
                      ...prev,
                      paymentStatus: event.target.value,
                    }))
                  }
                >
                  {PAYMENT_STATES.map((state) => (
                    <option key={state}>{state}</option>
                  ))}
                </select>
              </div>
              <div>
                <span>Tổng tiền</span>
                <strong>{order.total?.toLocaleString('vi-VN')}đ</strong>
              </div>
            </div>

            <div className='order-body'>
              <div className='order-customer'>
                <h4>Khách hàng</h4>
                <p>{order.customer?.name}</p>
                <p>{order.customer?.phone}</p>
                <p>{order.customer?.address}</p>
              </div>

              <div className='order-items'>
                <h4>Món đã đặt</h4>
                <ul>
                  {order.items?.map((item) => (
                    <li key={`${order.id}-${item.id}`}>
                      <span>
                        {item.quantity} × {item.name}
                      </span>
                      <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className='order-meta'>
                <h4>Thời gian</h4>
                <p>Đặt lúc: {new Date(order.timeline?.placedAt ?? Date.now()).toLocaleString('vi-VN')}</p>
                {order.timeline?.dispatchedAt && <p>Giao lúc: {new Date(order.timeline.dispatchedAt).toLocaleString('vi-VN')}</p>}
                {order.timeline?.deliveredAt && <p>Đã giao: {new Date(order.timeline.deliveredAt).toLocaleString('vi-VN')}</p>}
                <p>ETA: {order.timeline?.etaMinutes ?? 40} phút</p>
                {order.notes && <p>Ghi chú: {order.notes}</p>}
              </div>
            </div>
          </article>
        ))}

        {filteredOrders.length === 0 && <p className='empty-state'>Không tìm thấy đơn hàng phù hợp bộ lọc.</p>}
      </div>
    </div>
  )
}


export default OrdersSection
