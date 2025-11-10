import React from 'react'
import './SuperAdmin.css'

const revenueByMonth = [
  { month: 'Jan', revenue: 12000 },
  { month: 'Feb', revenue: 14800 },
  { month: 'Mar', revenue: 17150 },
  { month: 'Apr', revenue: 16200 },
  { month: 'May', revenue: 18900 },
  { month: 'Jun', revenue: 21350 },
]

const topRestaurants = [
  { name: 'Saigon Bistro', orders: 980, growth: '+12%' },
  { name: 'Pho 24/7', orders: 860, growth: '+8%' },
  { name: 'Banh Mi Corner', orders: 795, growth: '+6%' },
]

const topUsers = [
  { name: 'Nguyen Van A', orders: 52, spend: '21.5M ₫' },
  { name: 'Tran Thi B', orders: 47, spend: '19.8M ₫' },
  { name: 'Le Quang C', orders: 39, spend: '16.2M ₫' },
]

const restaurants = [
  { id: 'RES-1024', name: 'Hue Flavors', owner: 'Pham Thi Lan', status: 'Pending' },
  { id: 'RES-2048', name: 'Saigon Bistro', owner: 'Le Hoang', status: 'Active' },
  { id: 'RES-4096', name: 'Da Lat Garden', owner: 'Nguyen Thanh', status: 'Locked' },
]

const accounts = [
  { id: 'USR-5588', name: 'Nguyen Van A', role: 'User', status: 'Active' },
  { id: 'USR-8821', name: 'Tran Thi B', role: 'User', status: 'Locked' },
  { id: 'RES-2048', name: 'Saigon Bistro', role: 'Restaurant', status: 'Active' },
  { id: 'RES-1100', name: 'Pho Dakao', role: 'Restaurant', status: 'Pending' },
]

const drones = [
  { id: 'DR-01', status: 'Available', battery: 92, notes: 'Ready for dispatch' },
  { id: 'DR-02', status: 'Delivering', battery: 56, notes: 'Order #4581' },
  { id: 'DR-03', status: 'Maintenance', battery: 18, notes: 'Rotor replacement required' },
  { id: 'DR-04', status: 'Delivering', battery: 63, notes: 'Order #4589' },
]

const SuperAdmin = () => {
  return (
    <div className="super-admin">
      <header className="super-admin__header">
        <div>
          <h1>Super Admin Dashboard</h1>
          <p>Quản trị toàn bộ hệ thống FoodFast Delivery</p>
        </div>
        <div className="super-admin__actions">
          <select aria-label="Chọn phạm vi thống kê">
            <option>6 tháng gần nhất</option>
            <option>12 tháng</option>
            <option>Năm nay</option>
          </select>
          <button type="button">Xuất báo cáo</button>
        </div>
      </header>

      <section className="super-admin__stats">
        <article className="stat-card">
          <h3>Tổng doanh thu</h3>
          <p className="stat-card__value">124.5M ₫</p>
          <span className="stat-card__trend up">+14% so với tháng trước</span>
        </article>
        <article className="stat-card">
          <h3>Tổng số đơn</h3>
          <p className="stat-card__value">4,892</p>
          <span className="stat-card__trend up">+8% so với tháng trước</span>
        </article>
        <article className="stat-card">
          <h3>Nhà hàng đang hoạt động</h3>
          <p className="stat-card__value">126</p>
          <span className="stat-card__trend">12 đang chờ duyệt</span>
        </article>
        <article className="stat-card">
          <h3>Drone khả dụng</h3>
          <p className="stat-card__value">14</p>
          <span className="stat-card__trend down">3 cần bảo trì</span>
        </article>
      </section>

      <section className="super-admin__grid">
        <article className="panel panel--chart">
          <div className="panel__header">
            <h2>Doanh thu theo tháng</h2>
            <span>VND</span>
          </div>
          <div className="chart">
            {revenueByMonth.map((item) => (
              <div key={item.month} className="chart__column">
                <div
                  className="chart__bar"
                  style={{ height: `${item.revenue / 250}px` }}
                  aria-label={`Doanh thu tháng ${item.month}: ${item.revenue.toLocaleString('vi-VN')} ₫`}
                />
                <span className="chart__label">{item.month}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel__header">
            <h2>Top nhà hàng</h2>
            <button type="button">Xem tất cả</button>
          </div>
          <ul className="ranking">
            {topRestaurants.map((restaurant) => (
              <li key={restaurant.name}>
                <div>
                  <strong>{restaurant.name}</strong>
                  <span>{restaurant.orders} đơn</span>
                </div>
                <span className="trend up">{restaurant.growth}</span>
              </li>
            ))}
          </ul>
        </article>

        <article className="panel">
          <div className="panel__header">
            <h2>Top người dùng</h2>
            <button type="button">Xem tất cả</button>
          </div>
          <ul className="ranking">
            {topUsers.map((user) => (
              <li key={user.name}>
                <div>
                  <strong>{user.name}</strong>
                  <span>{user.orders} đơn · {user.spend}</span>
                </div>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="super-admin__grid">
        <article className="panel panel--table">
          <div className="panel__header">
            <h2>Quản lý nhà hàng</h2>
            <div className="panel__filters">
              <button type="button" className="active">Tất cả</button>
              <button type="button">Chờ duyệt</button>
              <button type="button">Đang khóa</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên nhà hàng</th>
                  <th>Chủ sở hữu</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map((restaurant) => (
                  <tr key={restaurant.id}>
                    <td>{restaurant.id}</td>
                    <td>{restaurant.name}</td>
                    <td>{restaurant.owner}</td>
                    <td>
                      <span className={`status status--${restaurant.status.toLowerCase()}`}>
                        {restaurant.status}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button type="button">Duyệt</button>
                      <button type="button" className="danger">Khóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="panel panel--table">
          <div className="panel__header">
            <h2>Quản lý tài khoản</h2>
            <div className="panel__filters">
              <button type="button" className="active">Tất cả</button>
              <button type="button">Người dùng</button>
              <button type="button">Nhà hàng</button>
            </div>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Mã</th>
                  <th>Tên</th>
                  <th>Vai trò</th>
                  <th>Trạng thái</th>
                  <th>Hành động</th>
                </tr>
              </thead>
              <tbody>
                {accounts.map((account) => (
                  <tr key={account.id}>
                    <td>{account.id}</td>
                    <td>{account.name}</td>
                    <td>{account.role}</td>
                    <td>
                      <span className={`status status--${account.status.toLowerCase()}`}>
                        {account.status}
                      </span>
                    </td>
                    <td className="table-actions">
                      <button type="button">Mở khóa</button>
                      <button type="button" className="danger">Khóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>
      </section>

      <section className="panel panel--table">
        <div className="panel__header">
          <h2>Quản lý drone</h2>
          <div className="panel__filters">
            <button type="button" className="active">Tất cả</button>
            <button type="button">Đang hoạt động</button>
            <button type="button">Rảnh</button>
            <button type="button">Bảo trì</button>
          </div>
        </div>
        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Mã drone</th>
                <th>Trạng thái</th>
                <th>Mức pin</th>
                <th>Ghi chú</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {drones.map((drone) => (
                <tr key={drone.id}>
                  <td>{drone.id}</td>
                  <td>
                    <span className={`status status--${drone.status.toLowerCase()}`}>
                      {drone.status}
                    </span>
                  </td>
                  <td>
                    <div className="battery">
                      <div className="battery__bar" style={{ width: `${drone.battery}%` }} />
                      <span>{drone.battery}%</span>
                    </div>
                  </td>
                  <td>{drone.notes}</td>
                  <td className="table-actions">
                    <button type="button">Chi tiết</button>
                    <button type="button" className="danger">Bảo trì</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default SuperAdmin
