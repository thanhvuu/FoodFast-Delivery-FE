import React from 'react'
import './Admin.css'

const Admin = () => {
  return (
    <div className="admin-page">
      <header>
        <h1>Admin Dashboard</h1>
        <p>Chào mừng quản trị viên. Bạn có thể truy cập trang quản lý nhà hàng/merchant tại đây.</p>
      </header>
      <div className="admin-actions">
        <div className="admin-card">
          <h3>Duyệt cửa hàng</h3>
          <p>Chuyển sang ứng dụng superadmin để phê duyệt hoặc khoá cửa hàng.</p>
          <a href="/super-admin" className="admin-link">Mở SuperAdmin</a>
        </div>
        <div className="admin-card">
          <h3>Quản lý đơn hàng</h3>
          <p>Theo dõi trạng thái đơn hàng và xử lý sự cố.</p>
          <a href="/tracking" className="admin-link">Xem theo dõi đơn</a>
        </div>
      </div>
    </div>
  )
}

export default Admin
