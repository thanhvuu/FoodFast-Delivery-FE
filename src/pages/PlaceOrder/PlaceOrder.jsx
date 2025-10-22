import React, { useContext, useState, useEffect } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'


const PlaceOrder = () => {
    const { cartTotal } = useContext(StoreContext)
    const deliveryFee = cartTotal > 0 && cartTotal < 100000 ? 15000 : 0
    const grandTotal = cartTotal + deliveryFee

    const [paymentMethod, setPaymentMethod] = useState('atm')
    const [orderPlaced, setOrderPlaced] = useState(false)

    const navigate = useNavigate()


    const [form, setForm] = useState({
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        voucher: ''
    })

    // Khi component mount, lấy dữ liệu localStorage nếu có
    useEffect(() => {
        const info = window.localStorage.getItem('checkoutInfo')
        if (info) setForm(JSON.parse(info))
    }, [])

    // Khi form thay đổi, tự lưu vào localStorage
    useEffect(() => {
        window.localStorage.setItem('checkoutInfo', JSON.stringify(form))
    }, [form])

    const handleInput = e => setForm(prev => ({
        ...prev, [e.target.name]: e.target.value
    }))

    const handleSubmit = e => {
        e.preventDefault()
        if (!form.fullName.trim() || !form.phone.trim() || !form.street.trim() || !form.city.trim() || !form.state.trim()) {
            alert('Bạn cần điền đầy đủ thông tin bắt buộc!')
            return
        }
        setOrderPlaced(true)
        setTimeout(() => {
            setOrderPlaced(false)
            navigate('/')
        }, 1000)
    }


    const formatCurrency = value => value.toLocaleString('vi-VN', {
        style: 'currency', currency: 'VND', maximumFractionDigits: 0
    })

    return (
        <form className='place-order' onSubmit={handleSubmit}>
            <div className="place-order-left">
                <p className="title">Thông tin giao hàng</p>
                <input type="text" name="fullName" placeholder="Họ và tên" value={form.fullName} onChange={handleInput} required />
                <input type="text" name="phone" placeholder="Số điện thoại" value={form.phone} onChange={handleInput} required />
                <input type="text" name="street" placeholder="Địa chỉ (số nhà, đường)" value={form.street} onChange={handleInput} required />
                <div className="multi-fields">
                    <input type="text" name="city" placeholder="Thành phố" value={form.city} onChange={handleInput} required />
                    <input type="text" name="state" placeholder="Quận/Huyện" value={form.state} onChange={handleInput} required />
                </div>
                <input type="text" name="voucher" placeholder="Mã giảm giá" value={form.voucher} onChange={handleInput} />

                {/* Hiển thị bản đồ địa chỉ */}
                <div className="address-map-preview" style={{ margin: "18px 0" }}>
                    <iframe
                        title="Bản đồ địa chỉ"
                        width="100%"
                        height="250"
                        style={{ border: "none", borderRadius: "12px" }}
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(`${form.street}, ${form.city}, ${form.state}`)}&z=15&output=embed`}
                        allowFullScreen=""
                        loading="lazy"
                    />
                </div>
            </div>

            <div className="place-order-right">
                <div className="order-summary">
                    <h2>Order Summary</h2>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery fee</span>
                        <span>{formatCurrency(deliveryFee)}</span>
                    </div>
                    <div className="summary-row total-row">
                        <span>Total</span>
                        <span style={{ fontWeight: 'bold', color: '#1a237e' }}>{formatCurrency(grandTotal)}</span>
                    </div>
                    <div className="payment-methods">
                        <p className="payment-title">Chọn phương thức thanh toán</p>
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="atm"
                                checked={paymentMethod === 'atm'}
                                onChange={() => setPaymentMethod('atm')}
                            />
                            <span>ATM Card (Online payment)</span>
                        </label>
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="paymentMethod"
                                value="cod"
                                checked={paymentMethod === 'cod'}
                                onChange={() => setPaymentMethod('cod')}
                            />
                            <span>Cash on Delivery</span>
                        </label>
                    </div>
                    <button className="checkout-btn" type="submit">
                        Đặt hàng
                    </button>
                    {orderPlaced &&
                        <div className="order-placed-toast">
                            Đơn hàng của bạn đã được ghi nhận!
                        </div>
                    }
                </div>
            </div>
        </form>
    )
}

export default PlaceOrder
