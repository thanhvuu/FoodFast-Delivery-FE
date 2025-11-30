import React, { useEffect, useState } from 'react'
import { fetchOrders, updateOrder } from '../../services/api'
import './Orders.css'
import { useAdminLanguage } from '../../context/LanguageContext'

const ORDER_STATUS_FLOW = ['pending', 'preparing', 'completed']

const digitsOnly = (value) => {
    if (typeof value === 'number' && Number.isFinite(value)) {
        return Math.max(0, value)
    }
    if (typeof value === 'string') {
        const numeric = value.replace(/[^0-9]/g, '')
        return numeric ? Number(numeric) : 0
    }
    return 0
}

const normaliseItem = (item) => ({
    name: item?.name ?? 'Sản phẩm',
    quantity: Math.max(1, digitsOnly(item?.quantity)),
    price: digitsOnly(item?.price),
})

let fallbackIdCounter = 0
const nextFallbackId = () => {
    fallbackIdCounter += 1
    return `order-${fallbackIdCounter}`
}

const normaliseStatus = (status) => {
    if (!status) return ORDER_STATUS_FLOW[0]
    if (ORDER_STATUS_FLOW.includes(status)) return status
    if (status === 'new' || status === 'new_order') return 'pending'
    if (status === 'complete' || status === 'delivered') return 'completed'
    if (status === 'in_progress') return 'preparing'
    return ORDER_STATUS_FLOW[0]
}

const transformOrder = (order) => {
    const items = Array.isArray(order?.items) ? order.items.map(normaliseItem) : []
    const status = normaliseStatus(order?.adminStatus ?? order?.status)
    return {
        id: order?.id ?? nextFallbackId(),
        customer: order?.customer ?? order?.customerName ?? 'Khách hàng',
        address: order?.address ?? order?.customerAddress ?? '',
        status,
        trackingStatus: order?.trackingStatus ?? status,
        paid: Boolean(order?.paid),
        deliveryFee: digitsOnly(order?.deliveryFee),
        total: digitsOnly(order?.total),
        items,
        createdAt: order?.createdAt ?? order?.placedAt ?? null,
    }
}

const calculateOrderTotal = (order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = order.deliveryFee || 0
    const storedTotal = order.total || 0
    return storedTotal || (itemsTotal + deliveryFee)
}

const getNextStatus = (status) => {
    const index = ORDER_STATUS_FLOW.indexOf(status)
    if (index === -1) {
        return ORDER_STATUS_FLOW[0]
    }
    return ORDER_STATUS_FLOW[index + 1] ?? null
}

const Orders = () => {
    const { dictionary, formatCurrency } = useAdminLanguage()
    const t = dictionary.ordersPage

    const [orders, setOrders] = useState([])
    const [isLoading, setIsLoading] = useState(false)

    const loadOrders = async () => {
        setIsLoading(true)
        try {
            const apiOrders = await fetchOrders({ _sort: 'placedAt', _order: 'desc' })
            const normalised = Array.isArray(apiOrders) ? apiOrders.map(transformOrder) : []
            setOrders(normalised)
        } catch (error) {
            console.error('Không thể tải danh sách đơn từ API', error)
            setOrders([])
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        loadOrders()
    }, [])

    const handleAdvanceStatus = async (id) => {
        const currentOrder = orders.find(order => order.id === id)
        if (!currentOrder) return
        const nextStatus = getNextStatus(currentOrder.status)
        if (!nextStatus) return

        const optimisticOrder = { ...currentOrder, status: nextStatus, trackingStatus: nextStatus }
        setOrders(prev => prev.map(order => order.id === id ? optimisticOrder : order))

        try {
            const response = await updateOrder(id, {
                status: nextStatus,
                trackingStatus: nextStatus,
            })
            const merged = transformOrder({ ...currentOrder, ...response, status: response?.status ?? nextStatus, trackingStatus: response?.trackingStatus ?? nextStatus })
            setOrders(prev => prev.map(order => order.id === id ? merged : order))
        } catch (error) {
            console.error('Không thể cập nhật đơn hàng', error)
            alert('Không thể cập nhật đơn hàng. Vui lòng thử lại.')
            setOrders(prev => prev.map(order => order.id === id ? currentOrder : order))
        }
    }

    const handleTogglePaid = async (id) => {
        const currentOrder = orders.find(order => order.id === id)
        if (!currentOrder) return
        const nextPaid = !currentOrder.paid

        setOrders(prev => prev.map(order => order.id === id ? { ...order, paid: nextPaid } : order))

        try {
            const response = await updateOrder(id, { paid: nextPaid })
            const merged = transformOrder({ ...currentOrder, ...response, paid: response?.paid ?? nextPaid })
            setOrders(prev => prev.map(order => order.id === id ? merged : order))
        } catch (error) {
            console.error('Không thể cập nhật thanh toán', error)
            alert('Không thể cập nhật thanh toán. Vui lòng thử lại.')
            setOrders(prev => prev.map(order => order.id === id ? currentOrder : order))
        }
    }

    return (
        <div className="admin-orders-list">
            <h2>{t.title}</h2>
            <table>
                <thead>
                    <tr>
                        <th>{t.columns.customer}</th>
                        <th>{t.columns.items}</th>
                        <th>{t.columns.address}</th>
                        <th>{t.columns.status}</th>
                        <th>{t.columns.payment}</th>
                        <th>{t.columns.total}</th>
                        <th>{t.columns.actions}</th>
                    </tr>
                </thead>
                <tbody>
                    {isLoading ? (
                        <tr>
                            <td colSpan="7" className="loading-row">{t.loading}</td>
                        </tr>
                    ) : orders.length === 0 ? (
                        <tr>
                            <td colSpan="7" className="loading-row">{t.empty}</td>
                        </tr>
                    ) : (
                        orders.map(order => (
                            <tr key={order.id}>
                                <td>{order.customer}</td>
                                <td style={{ minWidth: '160px' }}>
                                    {order.items.map((it, idx) => (
                                        <div key={idx} style={{ marginBottom: 5 }}>
                                            <span style={{ fontWeight: 500 }}>{it.name}</span>
                                            {" "}x{it.quantity}
                                            <span style={{ color: '#888', marginLeft: 2, fontSize: 15 }}>
                                                ({formatCurrency(it.price * it.quantity)})
                                            </span>
                                        </div>
                                    ))}
                                </td>
                                <td>{order.address}</td>
                                <td>
                                    <span className={`badge ${order.status === 'completed' ? 'badge-completed' : order.status === 'preparing' ? 'badge-preparing' : 'badge-new'}`}>
                                        {t.statuses[order.status] ?? order.status}
                                    </span>
                                </td>
                                <td>
                                    <span className={order.paid ? 'badge badge-paid' : 'badge badge-unpaid'}>
                                        {order.paid ? t.payment.paid : t.payment.unpaid}
                                    </span>
                                </td>
                                <td>
                                    {formatCurrency(calculateOrderTotal(order))}
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleAdvanceStatus(order.id)}
                                        disabled={!getNextStatus(order.status)}
                                    >
                                        {t.buttons.advanceStatus?.[order.status] ?? t.buttons.advanceFallback}
                                    </button>
                                    <button onClick={() => handleTogglePaid(order.id)}>{t.buttons.togglePayment}</button>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Orders
