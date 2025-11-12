import React, { useMemo } from 'react'
import './Sidebar.css'
import { NavLink } from 'react-router-dom'
import { useAdminLanguage } from '../../context/LanguageContext'

const NAV_ITEMS = [
    { key: 'dashboard', to: '/', icon: '📊', end: true },
    { key: 'add', to: '/add', icon: '➕' },
    { key: 'list', to: '/list', icon: '📋' },
    { key: 'orders', to: '/orders', icon: '📦' },
    { key: 'restaurant', to: '/restaurant', icon: '🍽️' },
    { key: 'tracking', to: '/tracking', icon: '🛩️' },
]

const Sidebar = () => {
    const { dictionary } = useAdminLanguage()
    const { sidebar = {}, sidebarDescriptions = {}, sidebarMeta = {} } = dictionary

    const items = useMemo(() => {
        return NAV_ITEMS.map(item => ({
            ...item,
            label: sidebar[item.key] ?? item.key,
            description: sidebarDescriptions[item.key] ?? '',
        }))
    }, [sidebar, sidebarDescriptions])

    return (
        <aside className='admin-sidebar'>
            <div className='sidebar-header'>
                <span className='sidebar-brand'>{sidebarMeta.brand ?? 'FoodFast'}</span>
                <strong>{sidebarMeta.subtitle ?? 'Admin Console'}</strong>
            </div>
            <nav className='sidebar-nav'>
                {items.map(item => (
                    <NavLink
                        key={item.key}
                        to={item.to}
                        end={item.end}
                        className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                    >
                        <span className='sidebar-icon' aria-hidden='true'>{item.icon}</span>
                        <div className='sidebar-text'>
                            <span>{item.label}</span>
                            {item.description && <small>{item.description}</small>}
                        </div>
                    </NavLink>
                ))}
            </nav>
            <footer className='sidebar-footer'>
                <span>{sidebarMeta.version ?? 'Phiên bản 1.0.0'}</span>
                <span>{sidebarMeta.copyright ?? '© FoodFast 2025'}</span>
            </footer>
        </aside>
    )
}

export default Sidebar
