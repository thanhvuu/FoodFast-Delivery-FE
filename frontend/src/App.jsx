import React from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Cart from './pages/Cart/Cart'
import Contact from './pages/Contact/Contact'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import FoodDetail from './components/FoodDetail/FoodDetail'
import OrderTracking from './pages/OrderTracking/OrderTracking'
import SuperAdmin from './pages/SuperAdmin/SuperAdmin'
import './App.css'

const App = () => {
  const location = useLocation()
  const isSuperAdminRoute = location.pathname.startsWith('/super-admin')

  return (
    <div className={`app${isSuperAdminRoute ? ' app--super-admin' : ''}`}>
      {!isSuperAdminRoute && <Navbar />}
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
        <Route path='/tracking' element={<OrderTracking />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path='/super-admin' element={<SuperAdmin />} />
      </Routes>
      {!isSuperAdminRoute && <Footer />}
    </div>
  )
}

export default App
