import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar/Navbar'
import Cart from './pages/Cart/Cart'
import Contact from './pages/Contact/Contact'
import Home from './pages/Home/Home'
import Menu from './pages/Menu/Menu'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/menu' element={<Menu />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/cart' element={<Cart />} />
        <Route path='/order' element={<PlaceOrder />} />
      </Routes>
    </div>
  )
}

export default App
