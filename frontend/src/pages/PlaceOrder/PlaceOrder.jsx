import { useContext, useEffect, useMemo, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'
import { createOrder } from '../../services/api'

const ORDERS_STORAGE_KEY = 'foodfast-orders'

const DELIVERY_OPTIONS = {
    drone: {
        key: 'drone',
        label: 'Giao drone',
        icon: '🚁',
        description: 'Nhanh chóng, tránh kẹt xe và theo dõi trực tiếp.',
        etaRange: '10 - 15 phút',
        estimatedMinutes: 14,
        baseFee: 45000,
        discountThreshold: 150000,
        discountedFee: 35000,
        benefitTag: '⚡ Nhanh nhất',
    },
}

const generateOrderCode = (timestamp) => {
    const randomSegment = Math.floor(100 + (timestamp % 900))
    const suffix = String(timestamp).slice(-3)
    return `FF-${randomSegment}${suffix}`
}

const generateDroneRoute = (createdAt, address) => {
    const baseLat = 10.772673
    const baseLng = 106.660987
    const seed = createdAt.getTime() / 1000
    const pseudoRandom = (factor) => {
        const x = Math.sin(seed * factor) * 10000
        return x - Math.floor(x)
    }

    const latDelta = 0.015 + pseudoRandom(1.3) * 0.008
    const lngDelta = 0.02 + pseudoRandom(0.7) * 0.01

    const checkpoints = [
        { offset: 0, id: 'pickup', title: 'Nhận món tại bếp trung tâm', description: 'Đơn hàng đã được xác nhận và đang đóng gói.' },
        { offset: 2, id: 'takeoff', title: 'Drone cất cánh', description: 'Drone rời bãi đáp và tăng độ cao an toàn.' },
        { offset: 6, id: 'enroute', title: 'Đang giao hàng', description: 'Drone di chuyển đến khu vực giao với tốc độ ổn định.' },
        { offset: 9, id: 'arriving', title: 'Chuẩn bị hạ cánh', description: 'Drone giảm độ cao và thông báo cho khách chuẩn bị nhận hàng.' },
        { offset: 12, id: 'delivered', title: 'Hoàn tất giao hàng', description: `Đơn hàng sẽ được giao tại ${address}.` },
    ]

    const etaFormatter = new Intl.DateTimeFormat('vi-VN', {
        hour: '2-digit',
        minute: '2-digit',
    })

    return checkpoints.map((checkpoint, index) => {
        const progression = index / (checkpoints.length - 1 || 1)
        const coords = {
            lat: baseLat + latDelta * progression,
            lng: baseLng + lngDelta * progression,
        }

        const eta = new Date(createdAt.getTime() + checkpoint.offset * 60 * 1000)

        return {
            id: checkpoint.id,
            eta: etaFormatter.format(eta),
            title: checkpoint.title,
            description: checkpoint.description,
            coords,
        }
    })
}

const generateRoute = (method, createdAt, address) => {
    return generateDroneRoute(createdAt, address)
}

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

const PlaceOrder = () => {
    const { cartItems, cartTotal, food_list, setCartItems } = useContext(StoreContext)
    const [deliveryMethod, setDeliveryMethod] = useState('drone')

    const calculateDeliveryFee = (method) => {
        const option = DELIVERY_OPTIONS[method]
        if (!option || cartTotal <= 0) {
            return 0
        }
        if (method === 'drone') {
            if (option.discountThreshold && cartTotal >= option.discountThreshold) {
                return option.discountedFee ?? option.baseFee
            }
            return option.baseFee
        }
        return option.baseFee ?? 0
    }

    const deliveryFee = useMemo(
        () => calculateDeliveryFee(deliveryMethod),
        [deliveryMethod, cartTotal]
    )

    const selectedDeliveryOption = DELIVERY_OPTIONS[deliveryMethod] ?? DELIVERY_OPTIONS.motorbike
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

    const selectedItems = useMemo(() => {
        return Object.entries(cartItems).reduce((items, [itemId, quantity]) => {
            if (!quantity) return items
            const product = food_list.find(food => food._id === itemId)
            if (!product) return items
            items.push({
                id: product._id,
                name: product.name,
                price: product.price,
                quantity,
            })
            return items
        }, [])
    }, [cartItems, food_list])

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

    const formatCurrency = value => value.toLocaleString('vi-VN', {
        style: 'currency', currency: 'VND', maximumFractionDigits: 0
    })

    const handleSubmit = e => {
        e.preventDefault()
        if (!form.fullName.trim() || !form.phone.trim() || !form.street.trim() || !form.city.trim() || !form.state.trim()) {
            alert('Bạn cần điền đầy đủ thông tin bắt buộc!')
            return
        }

        if (!selectedItems.length) {
            alert('Giỏ hàng của bạn đang trống')
            return
        }

        const loggedUser = window.localStorage.getItem('user')
        if (!loggedUser) {
            alert('Vui lòng đăng nhập trước khi đặt hàng để theo dõi chuyến bay của bạn.')
            return
        }

        const user = JSON.parse(loggedUser)
        const createdAt = new Date()
        const code = generateOrderCode(createdAt.getTime())
        const fullAddress = `${form.street}, ${form.state}, ${form.city}`

        const newOrder = {
            id: `local-${createdAt.getTime()}`,
            code,
            customer: form.fullName.trim(),
            customerPhone: form.phone.trim(),
            customerEmail: user?.email ?? '',
            address: fullAddress,
            items: selectedItems.map(item => ({
                ...item,
                price: Number(item.price),
                quantity: Number(item.quantity),
            })),
            subtotal: cartTotal,
            deliveryFee,
            total: grandTotal,
            deliveryMethod,
            estimatedArrival: selectedDeliveryOption.etaRange,
            estimatedMinutes: selectedDeliveryOption.estimatedMinutes,
            status: 'pending',
            trackingStatus: 'inTransit',
            paid: true,
            paymentMethod,
            route: generateRoute(deliveryMethod, createdAt, fullAddress),
            createdAt: createdAt.toISOString(),
        }

        try {
            await createOrder({
                userId: user?.id || 'guest',
                items: newOrder.items.map(item => ({
                    productId: item.id,
                    quantity: item.quantity,
                    price: item.price,
                })),
                total: grandTotal,
                deliveryFee,
                status: 'pending',
                placedAt: createdAt.toISOString(),
                address: fullAddress,
                customer: newOrder.customer,
                paymentMethod,
            })
        } catch (error) {
            console.error('Không thể lưu đơn hàng lên API', error)
        }

        const existingOrders = readStoredOrders()
        const updatedOrders = [...existingOrders, newOrder]
        window.localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(updatedOrders))
        window.dispatchEvent(new CustomEvent('foodfast-orders-update'))

        setOrderPlaced(true)
        window.localStorage.removeItem('checkoutInfo')
        setCartItems({})

        setTimeout(() => {
            setOrderPlaced(false)
            navigate('/tracking')
        }, 1200)
    }

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
                    <div className="delivery-methods">
                        <p className="delivery-title">Phương thức giao hàng</p>
                        <div className="delivery-options">
                            {Object.values(DELIVERY_OPTIONS).map(option => {
                                const isSelected = option.key === deliveryMethod
                                const optionFee = calculateDeliveryFee(option.key)
                                return (
                                    <label
                                        key={option.key}
                                        className={`delivery-option ${isSelected ? 'selected' : ''}`}
                                    >
                                        <input
                                            type="radio"
                                            name="deliveryMethod"
                                            value={option.key}
                                            checked={isSelected}
                                            onChange={() => setDeliveryMethod(option.key)}
                                        />
                                        <div className="delivery-option-content">
                                            <div className="option-header">
                                                <span className="option-icon" aria-hidden="true">{option.icon}</span>
                                                <div className="option-text">
                                                    <strong>{option.label}</strong>
                                                    <span>{option.description}</span>
                                                </div>
                                                <div className="option-price">
                                                    {optionFee === 0 ? 'Miễn phí' : formatCurrency(optionFee)}
                                                </div>
                                            </div>
                                            <div className="option-meta">
                                                <span>⏱ {option.etaRange}</span>
                                                <span>{option.benefitTag}</span>
                                            </div>
                                        </div>
                                    </label>
                                )
                            })}
                        </div>
                    </div>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>{formatCurrency(cartTotal)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Delivery method</span>
                        <span>{selectedDeliveryOption.label}</span>
                    </div>
                    <div className="summary-row">
                        <span>ETA</span>
                        <span>{selectedDeliveryOption.etaRange}</span>
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
                        <p className="payment-title">Phương thức thanh toán</p>
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
