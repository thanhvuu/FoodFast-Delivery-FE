import './AdminHeader.css'

const TITLES = {
  dashboard: 'Tổng quan vận hành',
  orders: 'Quản lý đơn hàng',
  menu: 'Quản lý món ăn',
  customers: 'Tài khoản khách hàng',
  alerts: 'Giám sát & cảnh báo',
}

const AdminHeader = ({ activeView, totalOrders, searchTerm, onSearch, onExport }) => {
  const title = TITLES[activeView] ?? 'FoodFast Admin'

  return (
    <header className='admin-header'>
      <div className='admin-header__title'>
        <h2>{title}</h2>
        <p>
          {activeView === 'orders'
            ? `${totalOrders} đơn đang lưu trong file JSON cục bộ`
            : 'Mọi dữ liệu được đồng bộ bằng JSON để phù hợp MVP không backend.'}
        </p>
      </div>

      <div className='admin-header__actions'>
        {activeView === 'orders' && (
          <label className='admin-search'>
            <span className='sr-only'>Tìm đơn hàng</span>
            <input
              type='search'
              placeholder='Tìm đơn theo mã, khách hàng, email...'
              value={searchTerm}
              onChange={(event) => onSearch(event.target.value)}
            />
          </label>
        )}
        <button type='button' className='secondary-btn' onClick={onExport}>
          Xuất JSON
        </button>
      </div>
    </header>
  )
}


export default AdminHeader
