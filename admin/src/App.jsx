import React, { useState } from 'react'
import Sidebar from './component/Sidebar/Sidebar'
import Navbar from './component/navbar/Navbar'
import Add from './pages/Add/Add'
import List from './pages/List/List'
import Orders from './pages/Orders/Orders'
import Tracking from './pages/Tracking/Tracking'
import { Routes, Route } from 'react-router-dom'
import { food_list } from './assets/assest'

const App = () => {
  // State quản lý toàn bộ sản phẩm
  const [products, setProducts] = useState(food_list)

  // Hàm thêm sản phẩm, truyền xuống Add
  const addProduct = (product) => {
    setProducts([...products, product])
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
    <div>
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>
          <Route path="/add" element={<Add onAddProduct={addProduct} />} />
          <Route path="/list" element={<List products={products} onDelete={deleteProduct} onUpdate={updateProduct} />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/tracking" element={<Tracking />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
