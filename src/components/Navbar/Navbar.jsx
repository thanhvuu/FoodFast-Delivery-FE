import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = () => {
  const location = useLocation()
  const { cartItemCount } = useContext(StoreContext)

  const isHomeAnchor = location.pathname === '/' && location.hash

  return (
    <header className='navbar'>
      <Link to='/' className='logo-link' aria-label='Về trang chủ FoodFast'>
        <img src={assets.logo} alt='FoodFast logo' className='logo' />
      </Link>
      <nav aria-label='Điều hướng chính'>
        <ul className='navbar-menu'>
          <li>
            <NavLink to='/' className={({ isActive }) => (isActive && !isHomeAnchor ? 'active' : '')}>Trang chủ</NavLink>
          </li>
          <li>
            <NavLink to='/menu' className={({ isActive }) => (isActive ? 'active' : '')}>Thực đơn</NavLink>
          </li>
          <li>
            <a href='https://foodfast-app.example.com' target='_blank' rel='noreferrer'>Mobile-app</a>
          </li>
          <li>
            <NavLink to='/contact' className={({ isActive }) => (isActive ? 'active' : '')}>Liên hệ</NavLink>
          </li>
        </ul>
      </nav>
      <div className='navbar-right'>
        <button type='button' className='icon-btn' aria-label='Tìm kiếm'>
          <img src={assets.search_icon} alt='' />
        </button>
        <Link to='/cart' className='navbar-search-icon' aria-label='Xem giỏ hàng'>
          <img src={assets.basket_icon} alt='Giỏ hàng' />
          {cartItemCount > 0 && <span className='dot' aria-hidden='true'></span>}
        </Link>
        <Link to='/order' className='cta-btn'>Đăng Nhập</Link>
      </div>
    </header>
  )
}

export default Navbar
