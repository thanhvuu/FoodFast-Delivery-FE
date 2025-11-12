import { userSegments } from '../../data/managementData'
import './Users.css'

function Users() {
  return (
    <div className="sa-page users-page">
      <section className="sa-section">
        <header>
          <div>
            <h2>Quản lý người dùng</h2>
            <p>Kiểm soát quyền truy cập, trạng thái xác minh và các hành động xử lý nhanh cho từng nhóm.</p>
          </div>
          <button type="button" className="primary">Thêm chính sách</button>
        </header>
        <div className="user-grid">
          {userSegments.map(segment => (
            <article key={segment.role} className="user-card">
              <header>
                <h3>{segment.role}</h3>
                <span>{segment.stats}</span>
              </header>
              <p>{segment.description}</p>
              <div className="user-actions">
                {segment.actions.map(action => (
                  <button key={action} type="button">{action}</button>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

export default Users
