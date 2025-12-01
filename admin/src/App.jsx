import React, { useEffect, useMemo, useState } from 'react'
import './App.css'
import Sidebar from './component/Sidebar/Sidebar'
import Navbar from './component/navbar/Navbar'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Dashboard from './pages/Dashboard/Dashboard'
import Restaurant from './pages/Restaurant/Restaurant'
import { Routes, Route } from 'react-router-dom'
import { food_list, restaurants as restaurantSeed } from './assets/assest'
import { createProduct, deleteProduct as deleteProductApi, fetchProducts, updateProduct as updateProductApi } from './services/api'

const getProductId = product => product?.id ?? product?.productId ?? product?._id

const App = () => {
  // State quản lý toàn bộ sản phẩm
  const [products, setProducts] = useState(food_list)
  const [restaurantContext, setRestaurantContext] = useState(null)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const paramRestaurantId = params.get('restaurantId')
    const stored = (() => {
      try {
        const raw = localStorage.getItem('restaurantContext')
        return raw ? JSON.parse(raw) : null
      } catch {
        return null
      }
    })()

    const findRestaurant = (id) => restaurantSeed.find((r) => r.id === id)
    let next = null
    if (paramRestaurantId) {
      const found = findRestaurant(paramRestaurantId)
      if (found) next = found
    } else if (stored?.id && findRestaurant(stored.id)) {
      next = findRestaurant(stored.id)
    } else if (restaurantSeed.length) {
      next = restaurantSeed[0]
    }

    if (next) {
      setRestaurantContext(next)
      localStorage.setItem('restaurantContext', JSON.stringify(next))
    }
  }, [])

  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await fetchProducts()
        if (Array.isArray(data) && data.length) {
          setProducts(data)
        }
      } catch (error) {
        console.error('Không thể tải danh sách sản phẩm từ API', error)
      }
    }

    loadProducts()
  }, [])

  // Hàm thêm sản phẩm, truyền xuống Add
  const addProduct = async (product) => {
    try {
      const created = await createProduct(product)
      setProducts(prev => [...prev, created])
      return created
    } catch (error) {
      console.error('Không thể thêm sản phẩm', error)
    }
  }

  // Hàm xoá cập nhật chung (nếu muốn truyền xuống List)
  const deleteProduct = async (id) => {
    if (!id) return
    try {
      await deleteProductApi(id)
      setProducts(prev => prev.filter(item => getProductId(item) !== id))
    } catch (error) {
      console.error('Không thể xoá sản phẩm', error)
      alert('Không thể xoá sản phẩm. Vui lòng thử lại.')
    }
  }

  // Hàm cập nhật sản phẩm (edit)
  const updateProduct = (updatedProduct) => {
    const updatedId = getProductId(updatedProduct)
    if (!updatedId) return

    updateProductApi(updatedId, updatedProduct)
      .then(response => {
        const mergedProduct = response && typeof response === 'object'
          ? { ...updatedProduct, ...response }
          : updatedProduct

        setProducts(prev => prev.map(item =>
          getProductId(item) === updatedId ? { ...item, ...mergedProduct } : item
        ))
      })
      .catch(error => {
        console.error('Không thể cập nhật sản phẩm', error)
        alert('Không thể cập nhật sản phẩm. Vui lòng thử lại.')
      })
  }

  const normalizeName = (value = '') => value.toString().trim().toLowerCase()
  const filteredProducts = useMemo(() => {
    if (!restaurantContext) return products
    const targetName = normalizeName(restaurantContext.name)
    return products.filter((item) => {
      const itemRestName = normalizeName(item?.restaurant?.name || '')
      const itemRestId = item?.restaurant?.id
      return itemRestId === restaurantContext.id || (itemRestName && itemRestName === targetName)
    })
  }, [products, restaurantContext])

  return (
    <div className="admin-app">
      <Navbar />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard products={filteredProducts} />} />
            <Route path="/dashboard" element={<Dashboard products={filteredProducts} />} />
            <Route path="/add" element={<Add onAddProduct={addProduct} restaurant={restaurantContext} />} />
            <Route
              path="/list"
              element={<List products={filteredProducts} onDelete={deleteProduct} onUpdate={updateProduct} />}
            />
            <Route path="/orders" element={<Orders restaurant={restaurantContext} products={products} />} />
            <Route path="/restaurant" element={<Restaurant restaurant={restaurantContext} />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
