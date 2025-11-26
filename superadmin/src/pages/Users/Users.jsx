import { userSegments } from '../../data/managementData'
import './Users.css'

function Users() {
  const manualActions = [
    { label: 'Thêm tài khoản mới', hint: 'Tạo nhanh user/staff/merchant', tone: 'primary' },
    { label: 'Chỉnh sửa thông tin', hint: 'Cập nhật email/số điện thoại/địa chỉ', tone: 'ghost' },
    { label: 'Khoá tài khoản', hint: 'Tạm khóa khi phát hiện bất thường', tone: 'danger' },
  ]

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
        <div className="manual-actions">
          {manualActions.map(action => (
            <div key={action.label} className={`manual-chip ${action.tone}`}>
              <div>
                <strong>{action.label}</strong>
                <small>{action.hint}</small>
              </div>
              <button type="button">Thực hiện</button>
            </div>
          ))}
        </div>
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
