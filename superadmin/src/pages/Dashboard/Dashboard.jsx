import { leaderboards, metrics } from '../../data/managementData'
import './Dashboard.css'

function Dashboard() {
  return (
    <div className="sa-page dashboard-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Hiệu suất tổng thể</h2>
            <p>Theo dõi doanh thu, số lượng đơn và hiệu quả của đối tác trong 30 ngày gần nhất.</p>
          </div>
          <div className="section-actions">
            <button type="button" className="primary">Xuất báo cáo</button>
            <button type="button" className="ghost">Chia sẻ</button>
          </div>
        </header>
        <div className="metrics-grid">
          {metrics.map(item => (
            <article key={item.label} className="metric-card">
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <small>{item.hint}</small>
            </article>
          ))}
        </div>
      </section>

      <section className="sa-section leaderboards">
        <header>
          <div>
            <h2>Bảng xếp hạng nổi bật</h2>
            <p>Những nhà hàng và khách hàng trung thành mang lại doanh thu cao nhất.</p>
          </div>
        </header>
        <div className="leaderboard-grid">
          <article className="sa-card">
            <h3>Top nhà hàng</h3>
            <ul>
              {leaderboards.restaurants.map(item => (
                <li key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.trend}</small>
                  </div>
                  <span>{item.metric}</span>
                </li>
              ))}
            </ul>
          </article>
          <article className="sa-card">
            <h3>Top user trung thành</h3>
            <ul>
              {leaderboards.users.map(item => (
                <li key={item.name}>
                  <div>
                    <strong>{item.name}</strong>
                    <small>{item.trend}</small>
                  </div>
                  <span>{item.metric}</span>
                </li>
              ))}
            </ul>
          </article>
        </div>
      </section>
    </div>
  )
}

export default Dashboard
