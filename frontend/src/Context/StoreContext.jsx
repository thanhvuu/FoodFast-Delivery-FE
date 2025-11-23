import { createContext, useEffect, useMemo, useState } from 'react'
import { food_list as fallbackFoodList } from '../assets/assets'
import { fetchProducts } from '../services/api'

export const StoreContext = createContext(null)

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({})
  const [food_list, setFoodList] = useState(fallbackFoodList)

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        if (Array.isArray(data) && data.length) {
          setFoodList(data)
        }
      } catch (error) {
        console.error('Không thể tải dữ liệu sản phẩm', error)
      }
    }

    loadProducts()
  }, [])

  const addToCart = (itemId) => {
    setCartItems((prev) => ({
      ...prev,
      [itemId]: (prev[itemId] || 0) + 1,
    }))
  }

  const removeFromCart = (itemId) => {
    setCartItems((prev) => {
      if (!prev[itemId]) return prev
      const updatedQty = prev[itemId] - 1
      if (updatedQty <= 0) {
        const { [itemId]: _removed, ...rest } = prev
        return rest
      }
      return {
        ...prev,
        [itemId]: updatedQty,
      }
    })
  }

  const cartItemCount = useMemo(() => {
    return Object.values(cartItems).reduce((acc, qty) => acc + qty, 0)
  }, [cartItems])

  const cartTotal = useMemo(() => {
    return Object.entries(cartItems).reduce((total, [id, qty]) => {
      const item = food_list.find((food) => food._id === id)
      if (!item) return total
      return total + item.price * qty
    }, 0)
  }, [cartItems, food_list])

  const contextValue = {
    food_list,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    cartItemCount,
    cartTotal,
  }

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  )
}

export default StoreContextProvider
