import './AdminSidebar.css'

const AdminSidebar = ({ items, activeItem, onNavigate, onExport }) => {
  return (
    <aside className='admin-sidebar' aria-label='Điều hướng quản trị'>
      <div className='admin-sidebar__brand'>
        <h1>FoodFast Admin</h1>
        <p>Quản lý vận hành realtime</p>
      </div>

      <nav className='admin-sidebar__nav'>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <button
                type='button'
                className={item.id === activeItem ? 'active' : ''}
                onClick={() => onNavigate(item.id)}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className='admin-sidebar__footer'>
        <button type='button' className='export-btn' onClick={onExport}>
          Tải đơn hàng (.json)
        </button>
        <p className='sidebar-hint'>Được lưu cục bộ bằng JSON, phù hợp MVP không cần database.</p>
      </div>
    </aside>
  )
}


export default AdminSidebar
