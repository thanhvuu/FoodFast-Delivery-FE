import React, { useState, useEffect, useContext } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { useLanguage } from '../../Context/LanguageContext'
import ModalLogin from '../../pages/ModalLogin/ModalLogin'

const Navbar = () => {
  const location = useLocation()
  const { cartItemCount } = useContext(StoreContext)
  const { dictionary } = useLanguage()
  const navText = dictionary.navbar
  const isHomeAnchor = location.pathname === '/' && location.hash

  // Trạng thái modal login
  const [openLogin, setOpenLogin] = useState(false)

  // Trạng thái user đăng nhập, lấy từ localStorage
  const [user, setUser] = useState(null)

  useEffect(() => {
    const loggedUser = localStorage.getItem('user')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
    }
  }, [])

  // Hàm đăng xuất
  const handleLogout = () => {
    localStorage.removeItem('user')
    setUser(null)
    window.dispatchEvent(new CustomEvent('foodfast-auth-change'))
    window.location.reload()
  }

  // Callback sau khi modal login đăng nhập thành công
  const handleLoginSuccess = () => {
    const loggedUser = localStorage.getItem('user')
    if (loggedUser) {
      setUser(JSON.parse(loggedUser))
      window.dispatchEvent(new CustomEvent('foodfast-auth-change'))
    }
    setOpenLogin(false)
  }

  return (
    <>
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
              <a href='https://foodfast-app.example.com' target='_blank' rel='noreferrer'>{navText.mobileApp}</a>
            </li>
            <li>
              <NavLink to='/contact' className={({ isActive }) => (isActive ? 'active' : '')}>{navText.contact}</NavLink>
            </li>
            <li>
              <NavLink to='/tracking' className={({ isActive }) => (isActive ? 'active' : '')}>{navText.orderTracking}</NavLink>
            </li>
          </ul>
        </nav>
        <div className='navbar-right'>
          {/* <button type='button' className='icon-btn' aria-label={navText.searchAria}>
            <img src={assets.search_icon} alt='' />
          </button> */}
          <Link to='/cart' className='navbar-search-icon' aria-label={navText.cartAria}>
            <img src={assets.basket_icon} alt={navText.cartAlt} />
            {cartItemCount && cartItemCount > 0 && <span className='dot' aria-hidden='true'></span>}
          </Link>
          {!user ? (
            <button
              className='cta-btn'
              style={{ marginLeft: '8px' }}
              type='button'
              onClick={() => setOpenLogin(true)}
            >
              {navText.signInCta}
            </button>
          ) : (
            <button
              className='cta-btn'
              style={{ marginLeft: '8px' }}
              type='button'
              onClick={handleLogout}
            >
              {navText.signOutCta}
            </button>
          )}
        </div>
      </header>
      <ModalLogin
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        onLoginSuccess={handleLoginSuccess} // truyền vào prop này ở ModalLogin
      />
    </>
  )
}

export default Navbar
