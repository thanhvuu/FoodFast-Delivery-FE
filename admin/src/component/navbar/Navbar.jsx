import React from 'react'
import './Navbar.css'
import { assests } from '../../assets/assest'

const Navbar = () => {
    return (
        <div className='navbar'>
            <img className='logo' src={assests.logo} alt="" />
        </div>
    )
}

export default Navbar
