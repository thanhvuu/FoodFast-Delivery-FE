import React, { useContext, useMemo, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import './FoodDetail.css'
import { StoreContext } from '../../Context/StoreContext'
import { useLanguage } from '../../Context/LanguageContext'
import FoodItem from '../FoodItem/FoodItem'

const FoodDetail = () => {
    const { id } = useParams()
    const { food_list = [], addToCart } = useContext(StoreContext)
    const { dictionary } = useLanguage()

    const [showAddedMsg, setShowAddedMsg] = useState(false);

    const handleAddToCart = (id) => {
        addToCart(id);
        setShowAddedMsg(true);
        setTimeout(() => setShowAddedMsg(false), 1600);
    };

    const food = food_list.find(item => item._id === id)
    if (!food) return <p>Not found</p>

    const translations = dictionary.foodItems[id] || {}
    const displayName = translations.name || food.name
    const displayDescription = translations.description || food.description
    const restaurant = food.restaurant || { name: 'Tên quán mẫu', address: 'Địa chỉ mẫu 123' }
    const estimatedTime = food.estimatedTime || '25 - 35 phút'

    const priceFormatter = useMemo(() =>
        new Intl.NumberFormat(dictionary.common.currencyLocale, {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }),
        [dictionary.common.currencyLocale]
    )

    const similarItems = useMemo(() =>
        food_list.filter(item => item.category === food.category && item._id !== food._id).slice(0, 3),
        [food_list, food]
    )

    return (
        <div className="food-detail-page">
            <Link to="/" className="food-detail-back">
                <span aria-hidden="true">←</span>
                Quay lại thực đơn
            </Link>

            <div className="food-detail-row">
                <div className="food-detail-img-wrapper">
                    <img className="food-detail-img" src={food.image} alt={displayName} />
                    <span className="food-detail-category-badge">{food.category}</span>
                </div>

                <div className="food-detail-info-box">
                    <div className="food-detail-header">
                        <div className="food-detail-title-block">
                            <h1>{displayName}</h1>
                            <p className="food-detail-subtitle">{restaurant.name}</p>
                        </div>
                        <div className="food-detail-price-chip">
                            {priceFormatter.format(food.price)}
                            <span className="food-detail-price-unit">/ phần</span>
                        </div>
                    </div>

                    <p className="food-detail-desc">{displayDescription}</p>

                    <div className="food-detail-meta-grid">
                        <div className="meta-card">
                            <span className="meta-icon" aria-hidden="true">⏱️</span>
                            <div>
                                <p className="meta-title">Thời gian giao</p>
                                <p className="meta-value">{estimatedTime}</p>
                            </div>
                        </div>
                        <div className="meta-card">
                            <span className="meta-icon" aria-hidden="true">🏠</span>
                            <div>
                                <p className="meta-title">Quán</p>
                                <p className="meta-value">{restaurant.name}</p>
                            </div>
                        </div>
                        <div className="meta-card meta-card-wide">
                            <span className="meta-icon" aria-hidden="true">📍</span>
                            <div>
                                <p className="meta-title">Địa chỉ</p>
                                <p className="meta-value">{restaurant.address}</p>
                            </div>
                        </div>
                    </div>

                    <div className="ingredients-section">
                        <div className="ingredients-title">Nguyên liệu nổi bật</div>
                        <ul className="ingredients-list">
                            {food.ingredients?.map((it, i) => <li key={i}>{it}</li>)}
                        </ul>
                    </div>

                    <button
                        className="food-detail-add-btn"
                        onClick={() => handleAddToCart(food._id)}
                    >
                        Thêm vào giỏ hàng
                    </button>

                    {showAddedMsg && (
                        <div className="add-to-cart-toast">
                            Đã thêm vào giỏ hàng!
                        </div>
                    )}
                </div>
            </div>

            <div className="food-detail-recommend">
                <h2 className="food-detail-section-title">Đề xuất món tương tự</h2>
                <div className="food-detail-recommend-list-horizontal">
                    {similarItems.map((item) => (
                        <Link to={`/food/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <FoodItem
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        </Link>
                    ))}
                </div>
            </div>

            <div className="food-detail-map">
                <h3 className="food-detail-section-title">Bản đồ quán ăn</h3>
                {/* Google Maps iframe sử dụng địa chỉ động */}
                <iframe
                    title="restaurant-map"
                    width="100%"
                    height="320"
                    style={{ border: 0, borderRadius: 16, marginTop: 12 }}
                    src={`https://maps.google.com/maps?q=${encodeURIComponent(restaurant.address)}&z=15&output=embed`}
                    allowFullScreen
                    loading="lazy"
                />
            </div>
        </div>
    )
}

export default FoodDetail
