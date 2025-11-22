import './Sidebar.css'

const navItems = [
  { id: 'dashboard', label: 'Tổng quan', icon: '📊', description: 'Số liệu chung' },
  { id: 'users', label: 'Quản lý user', icon: '👥', description: 'Khách, shipper, merchant' },
  { id: 'restaurants', label: 'Quản lý nhà hàng', icon: '🍽️', description: 'Duyệt / khoá' },
  { id: 'orders', label: 'Quản lý đơn hàng', icon: '📦', description: 'Theo dõi & can thiệp' },
  { id: 'operations', label: 'Vận hành & Ưu đãi', icon: '🛵', description: 'Phí ship, mã giảm, khu vực' },
]

function Sidebar({ activeView, onSelect }) {
  return (
    <aside className="sa-sidebar">
      <div className="sidebar-header">
        <span className="sidebar-brand">FoodFast</span>
        <strong>Super Control</strong>
      </div>
      <nav className="sidebar-nav">
        {navItems.map(item => {
          const isActive = item.id === activeView
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelect(item.id)}
              className={`sidebar-link ${isActive ? 'active' : ''}`}
            >
              <span className="sidebar-icon" aria-hidden="true">{item.icon}</span>
              <div className="sidebar-text">
                <span>{item.label}</span>
                <small>{item.description}</small>
              </div>
            </button>
          )
        })}
      </nav>
      <footer className="sidebar-footer">
        <span>Phiên bản 1.0.0</span>
        <span>© FoodFast 2025</span>
      </footer>
    </aside>
  )
}

export default Sidebar
