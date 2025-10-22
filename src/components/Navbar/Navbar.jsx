import React from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { useContext } from 'react'
import { StoreContext } from '../../Context/StoreContext'
import { useLanguage } from '../../Context/LanguageContext'

const Navbar = () => {
  const location = useLocation()
  const { cartItemCount } = useContext(StoreContext)
  const { dictionary } = useLanguage()

  const navText = dictionary.navbar

  const isHomeAnchor = location.pathname === '/' && location.hash

  return (
    <header className='navbar'>
      <Link to='/' className='logo-link' aria-label={navText.logoAria}>
        <img src={assets.logo} alt={navText.logoAlt} className='logo' />
      </Link>
      <nav aria-label={navText.navAria}>
        <ul className='navbar-menu'>
          <li>
            <NavLink to='/' className={({ isActive }) => (isActive && !isHomeAnchor ? 'active' : '')}>{navText.home}</NavLink>
          </li>
          <li>
            <NavLink to='/menu' className={({ isActive }) => (isActive ? 'active' : '')}>{navText.menu}</NavLink>
          </li>
          <li>
            <NavLink to='/admin' className={({ isActive }) => (isActive ? 'active' : '')}>{navText.admin}</NavLink>
          </li>
          <li>
            <a href='https://foodfast-app.example.com' target='_blank' rel='noreferrer'>{navText.mobileApp}</a>
          </li>
          <li>
            <NavLink to='/contact' className={({ isActive }) => (isActive ? 'active' : '')}>{navText.contact}</NavLink>
          </li>
        </ul>
      </nav>
      <div className='navbar-right'>
        <button type='button' className='icon-btn' aria-label={navText.searchAria}>
          <img src={assets.search_icon} alt='' />
        </button>
        <Link to='/cart' className='navbar-search-icon' aria-label={navText.cartAria}>
          <img src={assets.basket_icon} alt={navText.cartAlt} />
          {cartItemCount > 0 && <span className='dot' aria-hidden='true'></span>}
        </Link>
        <Link to='/order' className='cta-btn'>{navText.loginCta}</Link>
      </div>
    </header>
  )
}

export default Navbar
