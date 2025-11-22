import { orderOversight } from '../../data/managementData'
import './Orders.css'

function Orders() {
  return (
    <div className="sa-page orders-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý đơn hàng</h2>
            <p>Giám sát các đơn gặp sự cố và can thiệp trực tiếp để đảm bảo trải nghiệm khách hàng.</p>
          </div>
          <button type="button" className="primary">Tạo phiên can thiệp</button>
        </header>
        <div className="order-list">
          {orderOversight.map(order => (
            <article key={order.id} className="order-card">
              <header>
                <h3>{order.id}</h3>
                <span>{order.status}</span>
              </header>
              <dl>
                <div>
                  <dt>Khách hàng</dt>
                  <dd>{order.customer}</dd>
                </div>
                <div>
                  <dt>Vấn đề</dt>
                  <dd>{order.issue}</dd>
                </div>
                <div>
                  <dt>Kênh ghi nhận</dt>
                  <dd>{order.channel}</dd>
                </div>
              </dl>
              <div className="order-actions">
                <button type="button">Xem chi tiết</button>
                <button type="button" className="ghost">Tạo nhiệm vụ</button>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Orders
