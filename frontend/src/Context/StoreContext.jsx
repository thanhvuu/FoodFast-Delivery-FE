/* eslint-disable react-refresh/only-export-components */
import { createContext, useEffect, useMemo, useState } from 'react'
import { food_list as fallbackFoodList, resolveFoodImage } from '../assets/assets'
import { fetchProducts } from '../services/api'

export const StoreContext = createContext(null)

const CATEGORY_ALIASES = {
  'fast food': 'Fast Food',
  'đồ ăn nhanh': 'Fast Food',
  'món chính': 'Fast Food',
  'món mexico': 'Fast Food',
  'ẩm thực nhật': 'Món khô',
  'đồ ăn vặt': 'Đồ ăn vặt',
  'ăn vặt': 'Đồ ăn vặt',
  'ăn kèm': 'Đồ ăn vặt',
  'đồ ngọt': 'Đồ ngọt',
  'tráng miệng': 'Đồ ngọt',
  'món nước': 'Món nước',
  'thức uống': 'Thức uống',
}

const normalizeCategory = (value) => {
  const key = (value || '').toString().trim().toLowerCase()
  return CATEGORY_ALIASES[key] || value || 'Khác'
}

const StoreContextProvider = (props) => {
  const [cartItems, setCartItems] = useState({})
  const [food_list, setFoodList] = useState(() =>
    fallbackFoodList.map((item) => ({
      ...item,
      category: normalizeCategory(item.category),
    }))
  )

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        if (!Array.isArray(data) || !data.length) return

        const normalizedProducts = data.map((item, index) => {
          const fallbackItem = fallbackFoodList[index % fallbackFoodList.length] || {}

          return {
            ...item,
            _id: item._id || item.id?.toString() || `product-${index}`,
            name: item.name || fallbackItem.name || 'Món ăn',
            description: item.description || fallbackItem.description || 'Món ăn thơm ngon từ FoodFast',
            price: Number.isFinite(Number(item.price))
              ? Number(item.price)
              : fallbackItem.price || 0,
            image: resolveFoodImage(item.image) || fallbackItem.image,
            category: normalizeCategory(item.category || fallbackItem.category || 'other'),
            restaurant: item.restaurant || fallbackItem.restaurant || {
              name: 'FoodFast Kitchen',
              address: '273 An Dương Vương, Quận 5, TP.HCM',
            },
          }
        })

        setFoodList(normalizedProducts)
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
