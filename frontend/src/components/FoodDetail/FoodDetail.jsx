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
            <div className="food-detail-row">
                <img className="food-detail-img" src={food.image} alt={displayName} />
                <div className="food-detail-info-box">
                    <h1>{displayName}</h1>
                    <p className="food-detail-desc">{displayDescription}</p>
                    <p className="food-detail-price">{priceFormatter.format(food.price)}</p>
                    {/* Nguyên liệu */}
                    <div className="ingredients-section">
                        <div className="ingredients-title">Nguyên liệu chính:</div>
                        <ul className="ingredients-list">
                            {food.ingredients?.map((it, i) => <li key={i}>{it}</li>)}
                        </ul>
                    </div>
                    {/* Địa chỉ quán ăn */}
                    <div className="meta address-block">
                        <span className="label">Quán:</span>{restaurant.name}
                    </div>
                    <div className="meta address-block">
                        <span className="label">Địa chỉ:</span>{restaurant.address}
                    </div>
                    <div className="meta">
                        <span className="label">Thời gian giao hàng dự kiến:</span>{estimatedTime}
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
                <h2>Đề xuất món tương tự</h2>
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
                <h3>Bản đồ quán ăn</h3>
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
