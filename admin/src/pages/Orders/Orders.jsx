import React, { useEffect, useMemo, useState } from 'react'
import { order_list } from '../../assets/assest'
import './Orders.css'
import { useAdminLanguage } from '../../context/LanguageContext'

const ORDERS_STORAGE_KEY = 'foodfast-orders'

const readStoredOrders = () => {
    if (typeof window === 'undefined') return []
    try {
        const data = window.localStorage.getItem(ORDERS_STORAGE_KEY)
        if (!data) return []
        const parsed = JSON.parse(data)
        return Array.isArray(parsed) ? parsed : []
    } catch (error) {
        console.error(error)
        return []
    }
}

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

const transformOrder = (order) => {
    const items = Array.isArray(order?.items) ? order.items.map(normaliseItem) : []
    const status = order?.adminStatus ?? order?.status
    return {
        id: order?.id ?? nextFallbackId(),
        customer: order?.customer ?? 'Khách hàng',
        address: order?.address ?? '',
        status: status === 'delivered' ? 'delivered' : 'pending',
        trackingStatus: order?.trackingStatus,
        paid: Boolean(order?.paid),
        deliveryFee: digitsOnly(order?.deliveryFee),
        total: digitsOnly(order?.total),
        items,
        createdAt: order?.createdAt ?? null,
    }
}

const mergeOrders = (baseOrders, dynamicOrders) => {
    const unique = new Map()
    baseOrders.forEach(order => unique.set(order.id, order))
    dynamicOrders.forEach(order => unique.set(order.id, order))
    return Array.from(unique.values())
}

const calculateOrderTotal = (order) => {
    const itemsTotal = order.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
    const deliveryFee = order.deliveryFee || 0
    const storedTotal = order.total || 0
    return storedTotal || (itemsTotal + deliveryFee)
}

const Orders = () => {
    const { dictionary, formatCurrency } = useAdminLanguage()
    const t = dictionary.ordersPage

    const staticOrders = useMemo(() => order_list.map(transformOrder), [])
    const loadOrders = () => {
        const storedOrders = readStoredOrders().map(transformOrder)
        return mergeOrders(staticOrders, storedOrders)
    }

    const [orders, setOrders] = useState(loadOrders)

    useEffect(() => {
        const syncOrders = () => setOrders(loadOrders())
        syncOrders()
        window.addEventListener('storage', syncOrders)
        window.addEventListener('foodfast-orders-update', syncOrders)
        return () => {
            window.removeEventListener('storage', syncOrders)
            window.removeEventListener('foodfast-orders-update', syncOrders)
        }
    }, [staticOrders])

    const updateStoredOrder = (id, updater) => {
        const existing = readStoredOrders()
        const index = existing.findIndex(order => order.id === id)
        if (index === -1) return
        const current = existing[index]
        const changes = typeof updater === 'function' ? updater(current) : updater
        existing[index] = { ...current, ...changes }
        window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(existing))
        window.dispatchEvent(new CustomEvent('foodfast-orders-update'))
    }

    const handleToggleStatus = (id) => {
        setOrders(prev => {
            let nextStatus = null
            let nextTrackingStatus = null
            const updated = prev.map(order => {
                if (order.id !== id) return order
                const isDelivered = order.status === 'delivered'
                nextStatus = isDelivered ? 'pending' : 'delivered'
                nextTrackingStatus = order.trackingStatus
                    ? (order.trackingStatus === 'delivered' ? 'inTransit' : 'delivered')
                    : undefined
                return {
                    ...order,
                    status: nextStatus,
                    trackingStatus: nextTrackingStatus ?? order.trackingStatus,
                }
            })

            if (nextStatus) {
                updateStoredOrder(id, current => ({
                    adminStatus: nextStatus,
                    status: nextStatus,
                    trackingStatus: nextTrackingStatus ?? current.trackingStatus,
                }))
            }

            return updated
        })
    }

    const handleTogglePaid = (id) => {
        setOrders(prev => {
            let nextPaid = null
            const updated = prev.map(order => {
                if (order.id !== id) return order
                nextPaid = !order.paid
                return { ...order, paid: nextPaid }
            })

            if (nextPaid !== null) {
                updateStoredOrder(id, { paid: nextPaid })
            }

            return updated
        })
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
                    {orders.map(order => (
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
                                <span className={order.status === 'delivered' ? 'badge badge-delivered' : 'badge badge-pending'}>
                                    {order.status === 'delivered' ? t.statuses.delivered : t.statuses.pending}
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
                                <button onClick={() => handleToggleStatus(order.id)}>{t.buttons.toggleStatus}</button>
                                <button onClick={() => handleTogglePaid(order.id)}>{t.buttons.togglePayment}</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Orders
