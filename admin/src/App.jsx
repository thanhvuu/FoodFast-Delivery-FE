import React, { useEffect, useState } from 'react'
import './App.css'
import Sidebar from './component/Sidebar/Sidebar'
import Navbar from './component/navbar/Navbar'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Tracking from './pages/Tracking/Tracking'
import Dashboard from './pages/Dashboard/Dashboard'
import Restaurant from './pages/Restaurant/Restaurant'
import { Routes, Route } from 'react-router-dom'
import { food_list } from './assets/assest'
import { createProduct, fetchProducts } from './services/api'

const App = () => {
  // State quản lý toàn bộ sản phẩm
  const [products, setProducts] = useState(food_list)

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
      setProducts([...products, created])
      return created
    } catch (error) {
      console.error('Không thể thêm sản phẩm', error)
    }
  }

  // Hàm xoá cập nhật chung (nếu muốn truyền xuống List)
  const deleteProduct = (id) => {
    setProducts(products.filter(item => item._id !== id))
  }

  // Hàm cập nhật sản phẩm (edit)
  const updateProduct = (updatedProduct) => {
    setProducts(products.map(item =>
      item._id === updatedProduct._id ? updatedProduct : item
    ))
  }

  return (
    <div className="admin-app">
      <Navbar />
      <div className="admin-body">
        <Sidebar />
        <main className="admin-content">
          <Routes>
            <Route path="/" element={<Dashboard products={products} />} />
            <Route path="/dashboard" element={<Dashboard products={products} />} />
            <Route path="/add" element={<Add onAddProduct={addProduct} />} />
            <Route
              path="/list"
              element={<List products={products} onDelete={deleteProduct} onUpdate={updateProduct} />}
            />
            <Route path="/orders" element={<Orders />} />
            <Route path="/restaurant" element={<Restaurant />} />
            <Route path="/tracking" element={<Tracking />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

export default App
