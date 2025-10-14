import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'

const formatCurrency = (value) =>
  value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 })

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, setCartItems, cartTotal } = useContext(StoreContext)

  const cartDetails = useMemo(() => {
    return Object.entries(cartItems).reduce((acc, [id, qty]) => {
      const product = food_list.find((item) => item._id === id)
      if (!product) return acc
      acc.push({
        ...product,
        quantity: qty,
        subtotal: product.price * qty,
      })
      return acc
    }, [])
  }, [cartItems, food_list])

  const deliveryFee = cartTotal > 0 && cartTotal < 100000 ? 15000 : 0
  const grandTotal = cartTotal + deliveryFee

  const handleRemoveItem = (id) => {
    setCartItems((prev) => {
      const { [id]: _removed, ...rest } = prev
      return rest
    })
  }

  if (cartDetails.length === 0) {
    return (
      <div className='cart-page'>
        <h1>Giỏ hàng của bạn</h1>
        <div className='cart-empty'>
          <p>Giỏ hàng đang trống. Hãy thêm vài món ngon để bắt đầu nhé!</p>
          <Link to='/menu' className='cart-empty-cta'>Khám phá thực đơn</Link>
        </div>
      </div>
    )
  }

  return (
    <div className='cart-page'>
      <h1>Giỏ hàng của bạn</h1>
      <div className='cart-content'>
        <div className='cart-table-wrapper'>
          <table className='cart-table'>
            <thead>
              <tr>
                <th>Món ăn</th>
                <th>Đơn giá</th>
                <th>Số lượng</th>
                <th>Thành tiền</th>
                <th aria-label='Thao tác'></th>
              </tr>
            </thead>
            <tbody>
              {cartDetails.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className='cart-item-info'>
                      <img src={item.image} alt={item.name} />
                      <div>
                        <p className='cart-item-name'>{item.name}</p>
                        <p className='cart-item-desc'>{item.description}</p>
                      </div>
                    </div>
                  </td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>
                    <div className='cart-quantity'>
                      <button type='button' onClick={() => removeFromCart(item._id)} aria-label={`Giảm ${item.name}`}>
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button type='button' onClick={() => addToCart(item._id)} aria-label={`Tăng ${item.name}`}>
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatCurrency(item.subtotal)}</td>
                  <td>
                    <button type='button' className='cart-remove' onClick={() => handleRemoveItem(item._id)}>
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className='cart-summary'>
          <h2>Tổng kết đơn hàng</h2>
          <div className='summary-row'>
            <span>Tạm tính</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className='summary-row'>
            <span>Phí giao hàng</span>
            <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : 'Miễn phí'}</span>
          </div>
          <div className='summary-row grand-total'>
            <span>Tổng cộng</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          <Link to='/order' className='checkout-btn'>Tiến hành đặt hàng</Link>
        </aside>
      </div>
    </div>
  )
}

export default Cart
