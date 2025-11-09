import React from 'react'
import './Sidebar.css'
import { assests } from '../../assets/assest'
import { NavLink } from 'react-router-dom'
const Sidebar = () => {
    return (
        <div className='sidebar'>
            <div className="sidebar-options">
                <NavLink to='/add' className="sidebar-option">
                    <img src={assests.add_icon} alt="" />
                    <p>Add New Item</p>
                </NavLink>
                <NavLink to='/list' className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>List Items</p>
                </NavLink>
                <NavLink to='/orders' className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>Orders</p>
                </NavLink>
                <NavLink to='/tracking' className="sidebar-option">
                    <img src={assests.order_icon} alt="" />
                    <p>Drone Tracking</p>
                </NavLink>
            </div>

        </div>
    )
}

export default Sidebar
