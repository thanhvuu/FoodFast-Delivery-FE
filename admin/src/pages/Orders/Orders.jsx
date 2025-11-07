import React, { useState } from 'react'
import { order_list } from '../../assets/assest'
import './Orders.css'

const Orders = () => {
    const [orders, setOrders] = useState(order_list)

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
            <h2>Danh sách đơn hàng</h2>
            <table>
                <thead>
                    <tr>
                        <th>Khách hàng</th>
                        <th>Sản phẩm</th>
                        <th>Địa chỉ</th>
                        <th>Trạng thái giao</th>
                        <th>Thanh toán</th>
                        <th>Thành tiền</th>
                        <th>Điều chỉnh</th>
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
                                            ({(Number(it.price) * Number(it.quantity || 1)).toLocaleString()}đ)
                                        </span>
                                    </div>
                                )}
                            </td>
                            <td>{order.address}</td>
                            <td>
                                <span className={order.status === 'delivered' ? 'badge badge-delivered' : 'badge badge-pending'}>
                                    {order.status === 'delivered' ? 'Đã giao' : 'Chưa giao'}
                                </span>
                            </td>
                            <td>
                                <span className={order.paid ? 'badge badge-paid' : 'badge badge-unpaid'}>
                                    {order.paid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                                </span>
                            </td>
                            <td>
                                {getOrderTotal(order).toLocaleString()} đ
                            </td>
                            <td>
                                <button onClick={() => handleToggleStatus(order.id)}>Đổi trạng thái giao</button>
                                <button onClick={() => handleTogglePaid(order.id)}>Đổi thanh toán</button>
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
    )
}

export default Orders
