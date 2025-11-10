import React from 'react'
import './Sidebar.css'
import { assests } from '../../assets/assest'
import { NavLink } from 'react-router-dom'
import { useAdminLanguage } from '../../context/LanguageContext'
const Sidebar = () => {
    const { dictionary } = useAdminLanguage()
    const { sidebar } = dictionary
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/' end className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>{sidebar.dashboard}</p>
                </NavLink>
                <NavLink to='/add' className="sidebar-option">
                    <img src={assests.add_icon} alt="" />
                    <p>{sidebar.add}</p>
                </NavLink>
                <NavLink to='/list' className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>{sidebar.list}</p>
                </NavLink>
                <NavLink to='/orders' className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>{sidebar.orders}</p>
                </NavLink>
                <NavLink to='/tracking' className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>{sidebar.tracking}</p>
                </NavLink>
            </div>

        </div>
    )
}

export default Sidebar
