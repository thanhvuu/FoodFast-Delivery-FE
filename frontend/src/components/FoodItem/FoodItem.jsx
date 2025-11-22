import React, { useContext, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './FoodItem.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets'
import { useLanguage } from '../../Context/LanguageContext'

const FoodItem = ({ id, name, price, description, image }) => {
  const navigate = useNavigate()
  const { cartItems, addToCart, removeFromCart } = useContext(StoreContext)
  const { dictionary } = useLanguage()

  const itemTranslations = dictionary.foodItems[id] || {}
  const displayName = itemTranslations.name || name
  const displayDescription = itemTranslations.description || description
  const { common } = dictionary

  const priceFormatter = useMemo(
    () =>
      new Intl.NumberFormat(common.currencyLocale, {
        style: 'currency',
        currency: 'VND',
        maximumFractionDigits: 0,
      }),
    [common.currencyLocale],
  )

  const replaceItemPlaceholder = (template) => (template || '').replace('{{item}}', displayName)

  return (
    <div className="food-item">
      <div className="food-item-img-container" onClick={() => navigate(`/food/${id}`)}>
        <img className="food-item-img" src={image} alt={displayName} />


        {!cartItems[id] ? (
          <button
            className="add-btn"
            onClick={(e) => {
              e.stopPropagation()
              addToCart(id)
            }}
            aria-label={replaceItemPlaceholder(common.addItemToCart)}
          >
            <img src={assets.add_icon_white} alt="" />
          </button>
        ) : (
          <div className="item-count-counter">
            <button
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation()
                removeFromCart(id)
              }}
              aria-label={replaceItemPlaceholder(common.decreaseItem)}
            >
              <img src={assets.remove_icon_red} alt="" />
            </button>
            <span className="qty">{cartItems[id]}</span>
            <button
              className="icon-btn"
              onClick={(e) => {
                e.stopPropagation()
                addToCart(id)
              }}
              aria-label={replaceItemPlaceholder(common.increaseItem)}
            >
              <img src={assets.add_icon_green} alt="" />
            </button>
          </div>
        )}
      </div>

      <div className="food-item-info" onClick={() => navigate(`/food/${id}`)}>
        <div className="food-item-name-rating">
          <p>{displayName}</p>
        </div>
        <p className="food-item-desc">{displayDescription}</p>
        <p className="food-item-price">{priceFormatter.format(price)}</p>
      </div>
    </div>
  )
}

export default FoodItem
