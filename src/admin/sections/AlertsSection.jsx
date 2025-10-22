import './AlertsSection.css'

const AlertsSection = ({ orders, kpis }) => {
  const alerts = []

  if (kpis.paymentSuccessRate < 85) {
    alerts.push({
      id: 'payment-gateway',
      severity: 'warning',
      title: 'Thanh toán thành công dưới 85%',
      description: 'Kiểm tra lại cổng thanh toán Momo/VNPAY, tỉ lệ thành công đang thấp hơn chuẩn.',
      action: 'Liên hệ kỹ thuật',
    })
  }

  if (kpis.delayedOrders > 0) {
    alerts.push({
      id: 'delayed-orders',
      severity: 'danger',
      title: `${kpis.delayedOrders} đơn đang trễ ETA`,
      description: 'Theo dõi shipper và chủ động gọi khách để cập nhật tình trạng giao hàng.',
      action: 'Mở bản đồ giao hàng',
    })
  }

  const cancelledOrders = orders.filter((order) => order.flags?.cancelled)
  if (cancelledOrders.length > 0) {
    alerts.push({
      id: 'cancelled-orders',
      severity: 'danger',
      title: `${cancelledOrders.length} đơn đã bị hủy`,
      description: 'Liên hệ khách hàng để tìm hiểu nguyên nhân và khôi phục nếu cần.',
      action: 'Xem chi tiết đơn hủy',
    })
  }

  const offlineMerchants = menuItemsOffline(orders)
  if (offlineMerchants.length > 0) {
    alerts.push({
      id: 'merchant-offline',
      severity: 'warning',
      title: `${offlineMerchants.length} merchant tạm ngưng`,
      description: `Kiểm tra tình trạng: ${offlineMerchants.slice(0, 3).join(', ')}`,
      action: 'Gửi thông báo cho merchant',
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      id: 'all-good',
      severity: 'success',
      title: 'Mọi hệ thống ổn định',
      description: 'Không có cảnh báo mới trong 30 phút qua. Tiếp tục theo dõi dashboard.',
    })
  }

  return (
    <div className='alerts-section'>
      <header>
        <h3>Alerts realtime</h3>
        <p>Dữ liệu cập nhật theo file JSON, không cần backend.</p>
      </header>
      <ul className='alerts-list'>
        {alerts.map((alert) => (
          <li key={alert.id} className={`alert-card ${alert.severity}`}>
            <div>
              <strong>{alert.title}</strong>
              <p>{alert.description}</p>
            </div>
            {alert.action && <button type='button'>{alert.action}</button>}
          </li>
        ))}
      </ul>
    </div>
  )
}

const menuItemsOffline = (orders) => {
  const offline = new Set()
  orders.forEach((order) => {
    if (order.flags?.cancelled) {
      order.items?.forEach((item) => offline.add(item.name))
    }
  })
  return Array.from(offline)
}


export default AlertsSection
