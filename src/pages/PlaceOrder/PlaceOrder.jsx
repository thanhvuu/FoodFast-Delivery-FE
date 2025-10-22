import { useContext, useMemo, useState } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { createOrder } from '../../admin/storage/orderStorage'
import { upsertCustomer } from '../../admin/storage/customerStorage'
import './PlaceOrder.css'

const DELIVERY_FEE = 15000

const PlaceOrder = () => {
  const { cartItems, food_list, cartTotal, setCartItems } = useContext(StoreContext)
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    notes: '',
    paymentMethod: 'cod',
  })
  const [statusMessage, setStatusMessage] = useState(null)

  const orderItems = useMemo(() => {
    return Object.entries(cartItems).reduce((items, [id, quantity]) => {
      const product = food_list.find((food) => food._id === id)
      if (!product) return items
      return [
        ...items,
        {
          id,
          name: product.name,
          quantity,
          price: product.price,
        },
      ]
    }, [])
  }, [cartItems, food_list])

  const subtotal = cartTotal
  const total = subtotal + (orderItems.length > 0 ? DELIVERY_FEE : 0)

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormState((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (orderItems.length === 0) {
      setStatusMessage({ type: 'error', text: 'Vui lòng thêm món vào giỏ trước khi đặt hàng.' })
      return
    }

    const orderPayload = {
      customer: {
        name: formState.name,
        email: formState.email,
        phone: formState.phone,
        address: formState.address,
      },
      items: orderItems,
      subtotal,
      deliveryFee: orderItems.length > 0 ? DELIVERY_FEE : 0,
      total,
      paymentStatus: formState.paymentMethod === 'online' ? 'Đã thanh toán' : 'Chưa thanh toán',
      notes: formState.notes,
      flags: {
        attention: formState.paymentMethod === 'cod',
      },
    }

    const newOrder = createOrder(orderPayload)
    upsertCustomer({
      id: `CUS-${formState.phone || Date.now()}`,
      name: formState.name,
      email: formState.email,
      phone: formState.phone,
      status: 'Hoạt động',
      tier: 'Mới',
      lastOrder: newOrder.timeline?.placedAt,
    })

    setCartItems({})
    setFormState({
      name: '',
      email: '',
      phone: '',
      address: '',
      notes: '',
      paymentMethod: 'cod',
    })
    setStatusMessage({
      type: 'success',
      text: `Đặt hàng thành công! Mã đơn ${newOrder.id} đã được lưu trong file JSON và hiển thị trên trang admin.`,
    })
  }

  return (
    <div className='place-order'>
      <header className='place-order__intro'>
        <h1>Hoàn tất đặt hàng</h1>
        <p>Thông tin đơn sẽ được lưu vào file JSON và hiển thị realtime trong trang admin FoodFast.</p>
      </header>

      {statusMessage && <div className={`status-banner ${statusMessage.type}`}>{statusMessage.text}</div>}

      <div className='place-order__layout'>
        <form className='order-form' onSubmit={handleSubmit}>
          <section>
            <h2>Thông tin khách hàng</h2>
            <div className='form-grid'>
              <label>
                Họ tên
                <input name='name' required value={formState.name} onChange={handleInputChange} />
              </label>
              <label>
                Email
                <input
                  name='email'
                  type='email'
                  required
                  value={formState.email}
                  onChange={handleInputChange}
                />
              </label>
              <label>
                Số điện thoại
                <input name='phone' required value={formState.phone} onChange={handleInputChange} />
              </label>
              <label className='full'>
                Địa chỉ giao hàng
                <input name='address' required value={formState.address} onChange={handleInputChange} />
              </label>
            </div>
          </section>

          <section>
            <h2>Ghi chú & thanh toán</h2>
            <label className='full'>
              Ghi chú cho tài xế / bếp
              <textarea name='notes' rows='3' value={formState.notes} onChange={handleInputChange} />
            </label>
            <div className='payment-options'>
              <label>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='cod'
                  checked={formState.paymentMethod === 'cod'}
                  onChange={handleInputChange}
                />
                Thanh toán khi nhận hàng (COD)
              </label>
              <label>
                <input
                  type='radio'
                  name='paymentMethod'
                  value='online'
                  checked={formState.paymentMethod === 'online'}
                  onChange={handleInputChange}
                />
                Thanh toán online (Momo, VNPAY)
              </label>
            </div>
          </section>

          <div className='form-actions'>
            <button type='submit' className='submit-btn'>Đặt hàng và lưu JSON</button>
          </div>
        </form>

        <aside className='order-summary'>
          <h2>Tóm tắt đơn hàng</h2>
          {orderItems.length === 0 ? (
            <p className='empty'>Giỏ hàng của bạn đang trống.</p>
          ) : (
            <>
              <ul className='summary-items'>
                {orderItems.map((item) => (
                  <li key={item.id}>
                    <span>
                      {item.quantity} × {item.name}
                    </span>
                    <span>{(item.price * item.quantity).toLocaleString('vi-VN')}đ</span>
                  </li>
                ))}
              </ul>
              <dl className='summary-totals'>
                <div>
                  <dt>Tạm tính</dt>
                  <dd>{subtotal.toLocaleString('vi-VN')}đ</dd>
                </div>
                <div>
                  <dt>Phí giao hàng</dt>
                  <dd>{orderItems.length > 0 ? DELIVERY_FEE.toLocaleString('vi-VN') : 0}đ</dd>
                </div>
                <div className='total'>
                  <dt>Tổng cộng</dt>
                  <dd>{total.toLocaleString('vi-VN')}đ</dd>
                </div>
              </dl>
              <p className='notice'>Sau khi đặt, bạn có thể theo dõi trạng thái trong mục Admin &gt; Đơn hàng.</p>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}

export default PlaceOrder
