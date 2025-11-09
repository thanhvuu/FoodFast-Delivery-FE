import React, { useState } from 'react'
import { order_list } from '../../assets/assest'
import './Orders.css'
import { useAdminLanguage } from '../../context/LanguageContext'

const Orders = () => {
    const [orders, setOrders] = useState(order_list)
    const { dictionary, formatCurrency } = useAdminLanguage()
    const t = dictionary.ordersPage

    // Toggle trạng thái giao hàng (Cho từng order)
    const handleToggleStatus = (id) => {
        setOrders(
            orders.map(order =>
                order.id === id
                    ? { ...order, status: order.status === 'pending' ? 'delivered' : 'pending' }
                    : order
            )
        )
    }

    // Toggle thanh toán (cho từng order)
    const handleTogglePaid = (id) => {
        setOrders(
            orders.map(order =>
                order.id === id
                    ? { ...order, paid: !order.paid }
                    : order
            )
        )
    }

    // Tính tổng thành tiền đúng (quantity x price)
    const getOrderTotal = (order) =>
        order.items.reduce((sum, it) =>
            sum + (Number(it.price) * Number(it.quantity || 1)), 0
        )

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
                    {orders.map(order =>
                        <tr key={order.id}>
                            <td>{order.customer}</td>
                            <td style={{ minWidth: '160px' }}>
                                {order.items.map((it, idx) =>
                                    <div key={idx} style={{ marginBottom: 5 }}>
                                        <span style={{ fontWeight: 500 }}>{it.name}</span>
                                        {" "}x{it.quantity || 1}
                                        <span style={{ color: '#888', marginLeft: 2, fontSize: 15 }}>
                                            ({formatCurrency(Number(it.price) * Number(it.quantity || 1))})
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td>{order.address}</td>
                            <td>
                                <span className={order.status === 'delivered' ? 'badge badge-delivered' : 'badge badge-pending'}
>
                                    {order.status === 'delivered' ? t.statuses.delivered : t.statuses.pending}
                                </span>
                            </td>
                            <td>
                                <span className={order.paid ? 'badge badge-paid' : 'badge badge-unpaid'}>
                                    {order.paid ? t.payment.paid : t.payment.unpaid}
                                </span>
                            </td>
                            <td>
                                {formatCurrency(getOrderTotal(order))}
                            </td>
                            <td>
                                <button onClick={() => handleToggleStatus(order.id)}>{t.buttons.toggleStatus}</button>
                                <button onClick={() => handleTogglePaid(order.id)}>{t.buttons.togglePayment}</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Orders
