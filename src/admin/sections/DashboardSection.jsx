import './DashboardSection.css'

const DashboardSection = ({ orders, menuItems, customers, kpis }) => {
  const attentionOrders = orders.filter((order) => order.flags?.attention || order.flags?.delayed || order.flags?.cancelled)
  const topAttention = attentionOrders.slice(0, 5)

  const funnel = [
    { label: 'Browse', value: Math.max(kpis.totalOrders * 4, 80) },
    { label: 'Add to cart', value: Math.max(kpis.totalOrders * 3.2, 60) },
    { label: 'Checkout', value: Math.max(kpis.totalOrders * 2.4, 40) },
    { label: 'Paid', value: Math.max(kpis.paidOrders * 1.4, 20) },
  ]

  const heatmapHours = Array.from({ length: 6 }).map((_, index) => {
    const hourLabel = `${10 + index * 2}:00`
    const count = orders.filter((order) => {
      const placedAt = order.timeline?.placedAt
      if (!placedAt) return false
      const hour = new Date(placedAt).getHours()
      return hour >= 10 + index * 2 && hour < 12 + index * 2
    }).length
    return { label: hourLabel, count }
  })

  return (
    <div className='dashboard-section'>
      <div className='kpi-grid'>
        <article className='kpi-card'>
          <span className='kpi-label'>Đơn phát sinh</span>
          <strong>{kpis.totalOrders}</strong>
          <p>{kpis.delayedOrders} đơn cần chú ý</p>
        </article>
        <article className='kpi-card'>
          <span className='kpi-label'>Thanh toán thành công</span>
          <strong>{kpis.paymentSuccessRate}%</strong>
          <p>{kpis.paidOrders} đơn đã thanh toán</p>
        </article>
        <article className='kpi-card'>
          <span className='kpi-label'>Đúng giờ</span>
          <strong>{kpis.onTimeRate}%</strong>
          <p>{kpis.delayedOrders} đơn trễ ETA</p>
        </article>
        <article className='kpi-card'>
          <span className='kpi-label'>Tỉ lệ hủy</span>
          <strong>{kpis.cancelRate}%</strong>
          <p>{kpis.cancelledOrders} đơn bị hủy</p>
        </article>
        <article className='kpi-card'>
          <span className='kpi-label'>Số khách hoạt động</span>
          <strong>{customers.length}</strong>
          <p>{customers.filter((c) => c.status === 'Hoạt động').length} khách Gold/Silver</p>
        </article>
        <article className='kpi-card'>
          <span className='kpi-label'>Món đang kinh doanh</span>
          <strong>{menuItems.filter((item) => item.status !== 'Tạm ngưng').length}</strong>
          <p>{menuItems.length} món trong thực đơn</p>
        </article>
      </div>

      <div className='dashboard-panels'>
        <section className='panel'>
          <header>
            <h3>Funnel chuyển đổi</h3>
            <span>Từ browse đến thanh toán</span>
          </header>
          <div className='funnel'>
            {funnel.map((step, index) => (
              <div key={step.label} className='funnel-step' style={{ '--index': index }}>
                <div className='bar' style={{ width: `${Math.min(step.value, 100)}%` }}></div>
                <div className='label'>
                  <span>{step.label}</span>
                  <strong>{Math.round(step.value)}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className='panel'>
          <header>
            <h3>Heatmap theo giờ</h3>
            <span>Lượng đơn đặt trong ngày</span>
          </header>
          <div className='heatmap'>
            {heatmapHours.map((slot) => (
              <div key={slot.label} className='heat-cell' data-count={slot.count}>
                <strong>{slot.count}</strong>
                <span>{slot.label}</span>
              </div>
            ))}
          </div>
        </section>

        <section className='panel attention'>
          <header>
            <h3>Đơn cần chú ý</h3>
            <span>Theo dõi realtime các đơn trễ ETA/hủy</span>
          </header>
          <ul className='attention-list'>
            {topAttention.length === 0 && <li>Không có đơn cần xử lý ngay.</li>}
            {topAttention.map((order) => (
              <li key={order.id}>
                <div>
                  <strong>{order.id}</strong>
                  <span>
                    {order.customer?.name} • {order.deliveryStatus} • {order.paymentStatus}
                  </span>
                </div>
                <span className='badge'>Tổng: {order.total?.toLocaleString('vi-VN')}đ</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </div>
  )
}


export default DashboardSection
