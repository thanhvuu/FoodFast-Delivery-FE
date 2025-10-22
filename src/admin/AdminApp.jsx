import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/AdminSidebar'
import AdminHeader from './components/AdminHeader'
import DashboardSection from './sections/DashboardSection'
import OrdersSection from './sections/OrdersSection'
import MenuSection from './sections/MenuSection'
import CustomersSection from './sections/CustomersSection'
import AlertsSection from './sections/AlertsSection'
import {
  exportOrdersFile,
  loadOrders,
  persistOrders,
  subscribeOrders,
  updateOrder,
} from './storage/orderStorage'
import { loadMenu, removeMenuItem, upsertMenuItem } from './storage/menuStorage'
import { loadCustomers, persistCustomers, removeCustomer, upsertCustomer } from './storage/customerStorage'
import './styles/AdminApp.css'

const VIEWS = [
  { id: 'dashboard', label: 'Tổng quan' },
  { id: 'orders', label: 'Đơn hàng' },
  { id: 'menu', label: 'Món ăn' },
  { id: 'customers', label: 'Khách hàng' },
  { id: 'alerts', label: 'Cảnh báo' },
]

const AdminApp = () => {
  const [activeView, setActiveView] = useState('dashboard')
  const [orders, setOrders] = useState(() => loadOrders())
  const [menuItems, setMenuItems] = useState(() => loadMenu())
  const [customers, setCustomers] = useState(() => loadCustomers())
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    document.title = 'FoodFast Admin Console'
  }, [])

  useEffect(() => {
    const unsubscribe = subscribeOrders((nextOrders) => {
      setOrders(nextOrders)
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const filteredOrders = useMemo(() => {
    if (!searchTerm) return orders
    const lower = searchTerm.toLowerCase()
    return orders.filter((order) => {
      const customerName = order.customer?.name?.toLowerCase() ?? ''
      const customerEmail = order.customer?.email?.toLowerCase() ?? ''
      return order.id.toLowerCase().includes(lower) || customerName.includes(lower) || customerEmail.includes(lower)
    })
  }, [orders, searchTerm])

  const handleOrderUpdate = (orderId, updater) => {
    const updated = updateOrder(orderId, updater)
    setOrders(updated)
  }

  const handleOrderBulkUpdate = (updatedOrders) => {
    persistOrders(updatedOrders)
    setOrders(updatedOrders)
  }

  const handleMenuSave = (item) => {
    const updated = upsertMenuItem(item)
    setMenuItems(updated)
  }

  const handleMenuRemove = (id) => {
    const updated = removeMenuItem(id)
    setMenuItems(updated)
  }

  const handleCustomersSave = (customer) => {
    const updated = upsertCustomer(customer)
    setCustomers(updated)
  }

  const handleCustomerRemove = (id) => {
    const updated = removeCustomer(id)
    setCustomers(updated)
  }

  const handleCustomersPersist = (nextCustomers) => {
    persistCustomers(nextCustomers)
    setCustomers(nextCustomers)
  }

  const kpis = useMemo(() => {
    const totalOrders = orders.length
    const paidOrders = orders.filter((order) => order.paymentStatus === 'Đã thanh toán').length
    const deliveredOrders = orders.filter((order) => order.deliveryStatus === 'Đã giao').length
    const cancelledOrders = orders.filter((order) => order.flags?.cancelled).length
    const delayedOrders = orders.filter((order) => order.flags?.delayed).length

    return {
      totalOrders,
      paidOrders,
      deliveredOrders,
      cancelledOrders,
      delayedOrders,
      paymentSuccessRate: totalOrders ? Math.round((paidOrders / totalOrders) * 100) : 0,
      onTimeRate: totalOrders ? Math.round(((totalOrders - delayedOrders) / totalOrders) * 100) : 100,
      cancelRate: totalOrders ? Math.round((cancelledOrders / totalOrders) * 100) : 0,
    }
  }, [orders])

  return (
    <div className='admin-app'>
      <Sidebar
        items={VIEWS}
        activeItem={activeView}
        onNavigate={setActiveView}
        onExport={() => exportOrdersFile(orders)}
      />
      <div className='admin-content'>
        <AdminHeader
          activeView={activeView}
          totalOrders={orders.length}
          searchTerm={searchTerm}
          onSearch={setSearchTerm}
          onExport={() => exportOrdersFile(orders)}
        />

        <section className='admin-section'>
          {activeView === 'dashboard' && (
            <DashboardSection orders={orders} menuItems={menuItems} customers={customers} kpis={kpis} />
          )}

          {activeView === 'orders' && (
            <OrdersSection
              orders={filteredOrders}
              onOrderUpdate={handleOrderUpdate}
              onOrdersChange={handleOrderBulkUpdate}
            />
          )}

          {activeView === 'menu' && (
            <MenuSection menuItems={menuItems} onSave={handleMenuSave} onRemove={handleMenuRemove} />
          )}

          {activeView === 'customers' && (
            <CustomersSection
              customers={customers}
              onSave={handleCustomersSave}
              onRemove={handleCustomerRemove}
              onPersist={handleCustomersPersist}
            />
          )}

          {activeView === 'alerts' && <AlertsSection orders={orders} kpis={kpis} />}
        </section>
      </div>
    </div>
  )
}

export default AdminApp
