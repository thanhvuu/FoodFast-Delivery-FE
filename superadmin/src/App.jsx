import './App.css'

const metrics = [
  {
    label: 'Tổng doanh thu',
    value: '12,4 tỷ ₫',
    hint: 'Từ tất cả đối tác trên toàn quốc',
  },
  {
    label: 'Đơn hoàn thành',
    value: '184.230',
    hint: '97,4% trong 30 ngày gần nhất',
  },
  {
    label: 'Đối tác hoạt động',
    value: '512',
    hint: 'Nhà hàng và bếp cloud đang mở bán',
  },
  {
    label: 'Tài xế trực tuyến',
    value: '1.284',
    hint: 'Bao gồm shipper và đội drone',
  },
]

const userSegments = [
  {
    role: 'Khách hàng',
    description: 'Theo dõi người dùng mới, trạng thái xác minh và báo cáo gian lận.',
    stats: '1,2 triệu tài khoản',
    actions: ['Xem hồ sơ', 'Khoá truy cập', 'Gửi thông báo'],
  },
  {
    role: 'Shipper',
    description: 'Quản lý đăng ký, giấy tờ pháp lý và trạng thái hoạt động.',
    stats: '8.420 tài xế',
    actions: ['Duyệt hồ sơ', 'Phân bổ khu vực', 'Tắt hoạt động'],
  },
  {
    role: 'Merchant',
    description: 'Kiểm soát hợp đồng, thực đơn và chất lượng dịch vụ của nhà hàng.',
    stats: '2.350 đối tác',
    actions: ['Duyệt đăng ký', 'Xem vi phạm', 'Liên hệ CSKH'],
  },
]

const restaurants = [
  {
    name: 'The Pizza Hub',
    owner: 'Trần Quốc Bảo',
    city: 'Hà Nội',
    status: 'Chờ duyệt',
    statusKey: 'pending',
    rating: '—',
  },
  {
    name: 'Bếp Nhà Xanh',
    owner: 'Nguyễn Thị Kim',
    city: 'TP.HCM',
    status: 'Đang hoạt động',
    statusKey: 'active',
    rating: '4,8 ★',
  },
  {
    name: 'Sushi Corner',
    owner: 'F&B Kanto',
    city: 'Đà Nẵng',
    status: 'Đang xem xét',
    statusKey: 'review',
    rating: '4,4 ★',
  },
  {
    name: 'Hi Five Coffee',
    owner: 'Lê Đăng Khôi',
    city: 'Cần Thơ',
    status: 'Bị khoá',
    statusKey: 'suspended',
    rating: '—',
  },
]

const orderOversight = [
  {
    id: 'FF-20384',
    customer: 'Mai Quỳnh Anh',
    issue: 'Khiếu nại phí giao cao',
    status: 'Đang xử lý',
    channel: 'Livechat',
  },
  {
    id: 'FF-20365',
    customer: 'Đinh Công Vũ',
    issue: 'Đơn hủy liên tục',
    status: 'Cần can thiệp',
    channel: 'CSKH',
  },
  {
    id: 'FF-20354',
    customer: 'Đỗ Thị Hà',
    issue: 'Nghi ngờ gian lận voucher',
    status: 'Đã khóa tạm',
    channel: 'Email',
  },
]

const logisticsControls = {
  shipping: {
    title: 'Phí giao hàng',
    items: [
      { label: 'Trung tâm TP', value: '18.000 ₫/đơn', status: 'Ổn định' },
      { label: 'Ngoại thành', value: '26.000 ₫/đơn', status: 'Đang thí điểm' },
      { label: 'Đơn giờ cao điểm', value: '+25%', status: 'Tự động điều chỉnh' },
    ],
  },
  vouchers: {
    title: 'Mã giảm giá',
    items: [
      { label: 'WEEKEND50', value: 'Giảm 50% tối đa 40k', status: 'Sắp hết hạn' },
      { label: 'FREESHIPNEW', value: 'Miễn phí ship đơn đầu', status: 'Đang chạy' },
      { label: 'MERCHANTBOOST', value: 'Giảm 30% cho quán mới', status: 'Chuẩn bị' },
    ],
  },
  areas: {
    title: 'Khu vực hoạt động',
    items: [
      { label: 'Hà Nội', value: '36 quận/huyện', status: 'Mở rộng thêm 2 khu' },
      { label: 'TP.HCM', value: '24 quận/huyện', status: 'Ổn định' },
      { label: 'Đà Nẵng', value: '8 quận/huyện', status: 'Đang khảo sát' },
    ],
  },
}

const leaderboards = {
  restaurants: [
    { name: 'Bún Chả 34', metric: '12.380 đơn', trend: '+18%' },
    { name: 'Pizza 4P', metric: '11.204 đơn', trend: '+11%' },
    { name: 'Cơm tấm Dì Ba', metric: '9.851 đơn', trend: '+8%' },
  ],
  users: [
    { name: 'Phạm Hoài Nam', metric: '128 đơn/tháng', trend: '+5%' },
    { name: 'Võ Thanh Hà', metric: '121 đơn/tháng', trend: '+12%' },
    { name: 'Nguyễn Lệ Mỹ', metric: '117 đơn/tháng', trend: '+7%' },
  ],
}

function App() {
  return (
    <div className="super-admin-dashboard">
      <header className="sa-header">
        <div className="sa-brand">
          <span className="sa-badge">Super Admin</span>
          <h1>FoodFast Control Center</h1>
          <p>Giám sát toàn bộ hệ sinh thái: khách hàng, đối tác, đơn hàng và vận hành.</p>
        </div>
        <nav className="sa-navigation">
          <a href="#overview">Tổng quan</a>
          <a href="#users">Người dùng</a>
          <a href="#restaurants">Nhà hàng</a>
          <a href="#orders">Đơn hàng</a>
          <a href="#logistics">Vận hành</a>
          <a href="#insights">Dashboard</a>
        </nav>
      </header>

      <main className="sa-content">
        <section id="overview" className="sa-section">
          <div className="section-heading">
            <div>
              <h2>Tổng quan hệ thống</h2>
              <p>Theo dõi hiệu suất và tình trạng hoạt động theo thời gian thực.</p>
            </div>
            <button type="button">Xuất báo cáo</button>
          </div>
          <div className="metric-grid">
            {metrics.map(item => (
              <article key={item.label} className="metric-card">
                <span>{item.label}</span>
                <strong>{item.value}</strong>
                <small>{item.hint}</small>
              </article>
            ))}
          </div>
        </section>

        <section id="users" className="sa-section">
          <h2>Quản lý người dùng</h2>
          <p>Điều phối quyền truy cập, trạng thái và chính sách dành cho từng nhóm người dùng.</p>
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

        <section id="restaurants" className="sa-section">
          <div className="section-heading">
            <div>
              <h2>Nhà hàng &amp; Merchant</h2>
              <p>Duyệt đăng ký mới, giám sát chất lượng và xử lý vi phạm.</p>
            </div>
            <button type="button" className="ghost">Thiết lập quy trình</button>
          </div>
          <div className="table-wrapper">
            <table>
              <thead>
                <tr>
                  <th>Nhà hàng</th>
                  <th>Chủ sở hữu</th>
                  <th>Thành phố</th>
                  <th>Trạng thái</th>
                  <th>Đánh giá</th>
                </tr>
              </thead>
              <tbody>
                {restaurants.map(row => (
                  <tr key={row.name}>
                    <td>{row.name}</td>
                    <td>{row.owner}</td>
                    <td>{row.city}</td>
                  <td>
                    <span className={`status status-${row.statusKey}`}>
                      {row.status}
                    </span>
                  </td>
                    <td>{row.rating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section id="orders" className="sa-section">
          <h2>Quản lý đơn hàng</h2>
          <p>Xem nhanh các đơn phát sinh sự cố và điều phối xử lý kịp thời.</p>
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

        <section id="logistics" className="sa-section logistics">
          <div className="section-heading">
            <div>
              <h2>Phí ship, voucher &amp; khu vực</h2>
              <p>Tùy chỉnh chính sách vận hành để cân bằng chi phí và trải nghiệm người dùng.</p>
            </div>
            <button type="button">Cập nhật chính sách</button>
          </div>
          <div className="logistics-grid">
            {Object.values(logisticsControls).map(block => (
              <article key={block.title} className="logistics-card">
                <h3>{block.title}</h3>
                <ul>
                  {block.items.map(item => (
                    <li key={item.label}>
                      <div>
                        <strong>{item.label}</strong>
                        <small>{item.status}</small>
                      </div>
                      <span>{item.value}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section id="insights" className="sa-section insights">
          <div className="section-heading">
            <div>
              <h2>Dashboard thống kê tổng</h2>
              <p>Doanh thu, số đơn và bảng xếp hạng đối tác nổi bật.</p>
            </div>
            <button type="button" className="ghost">Tải dữ liệu</button>
          </div>
          <div className="insight-grid">
            <article className="insight-card">
              <h3>Hiệu suất 30 ngày</h3>
              <div className="insight-metrics">
                <div>
                  <span>Doanh thu</span>
                  <strong>4,3 tỷ ₫</strong>
                  <small>+12% so với tháng trước</small>
                </div>
                <div>
                  <span>Số đơn</span>
                  <strong>54.820</strong>
                  <small>+9% so với kỳ trước</small>
                </div>
              </div>
            </article>
            <article className="insight-card">
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
            <article className="insight-card">
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
      </main>
    </div>
  )
}

export default App
