import React, { useContext, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useLanguage } from '../../Context/LanguageContext'

const Cart = () => {
  const { cartItems, food_list, addToCart, removeFromCart, setCartItems, cartTotal } = useContext(StoreContext)
  const { dictionary } = useLanguage()
  const { cart: cartText, common, foodItems } = dictionary

  const formatCurrency = useMemo(
    () =>
      (value) =>
        value.toLocaleString(common.currencyLocale, {
          style: 'currency',
          currency: 'VND',
          maximumFractionDigits: 0,
        }),
    [common.currencyLocale],
  )

  const formatItemLabel = (template, itemName) => (template || '').replace('{{item}}', itemName)

  const cartDetails = useMemo(() => {
    return Object.entries(cartItems).reduce((acc, [id, qty]) => {
      const product = food_list.find((item) => item._id === id)
      if (!product) return acc
      const translations = foodItems[id] || {}
      acc.push({
        ...product,
        quantity: qty,
        subtotal: product.price * qty,
        displayName: translations.name || product.name,
        displayDescription: translations.description || product.description,
      })
      return acc
    }, [])
  }, [cartItems, foodItems, food_list])

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
        <h1>{cartText.title}</h1>
        <div className='cart-empty'>
          <p>{cartText.emptyMessage}</p>
          <Link to='/menu' className='cart-empty-cta'>{cartText.emptyCta}</Link>
        </div>
      </div>
    )
  }

  return (
    <div className='cart-page'>
      <h1>{cartText.title}</h1>
      <div className='cart-content'>
        <div className='cart-table-wrapper'>
          <table className='cart-table'>
            <thead>
              <tr>
                <th>{cartText.tableHeaders.item}</th>
                <th>{cartText.tableHeaders.price}</th>
                <th>{cartText.tableHeaders.quantity}</th>
                <th>{cartText.tableHeaders.subtotal}</th>
                <th aria-label={cartText.tableHeaders.actions}></th>
              </tr>
            </thead>
            <tbody>
              {cartDetails.map((item) => (
                <tr key={item._id}>
                  <td>
                    <div className='cart-item-info'>
                      <img src={item.image} alt={item.displayName} />
                      <div>
                        <p className='cart-item-name'>{item.displayName}</p>
                        <p className='cart-item-desc'>{item.displayDescription}</p>
                      </div>
                    </div>
                  </td>
                  <td>{formatCurrency(item.price)}</td>
                  <td>
                    <div className='cart-quantity'>
                      <button
                        type='button'
                        onClick={() => removeFromCart(item._id)}
                        aria-label={formatItemLabel(common.decreaseItem, item.displayName)}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button
                        type='button'
                        onClick={() => addToCart(item._id)}
                        aria-label={formatItemLabel(common.increaseItem, item.displayName)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td>{formatCurrency(item.subtotal)}</td>
                  <td>
                    <button
                      type='button'
                      className='cart-remove'
                      onClick={() => handleRemoveItem(item._id)}
                      aria-label={`${cartText.removeItem} ${item.displayName}`}
                    >
                      {cartText.removeItem}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <aside className='cart-summary'>
          <h2>{cartText.summaryTitle}</h2>
          <div className='summary-row'>
            <span>{cartText.subtotal}</span>
            <span>{formatCurrency(cartTotal)}</span>
          </div>
          <div className='summary-row'>
            <span>{cartText.deliveryFee}</span>
            <span>{deliveryFee > 0 ? formatCurrency(deliveryFee) : common.free}</span>
          </div>
          <div className='summary-row grand-total'>
            <span>{cartText.total}</span>
            <span>{formatCurrency(grandTotal)}</span>
          </div>
          <Link to='/order' className='checkout-btn'>{cartText.checkoutCta}</Link>
        </aside>
      </div>
    </div>
  )
}

export default Cart
