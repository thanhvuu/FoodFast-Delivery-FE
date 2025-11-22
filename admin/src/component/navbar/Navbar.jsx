import React from 'react'
import './Navbar.css'
import { assests } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const Navbar = () => {
    const { dictionary, language, setLanguage, languageOptions } = useAdminLanguage()
    const { navbar = {} } = dictionary

    return (
        <header className='admin-topbar'>
            <div className='brand-card'>
                <div className='brand-logo'>
                    <img src={assests.logo} alt='FoodFast logo' />
                </div>
                <div className='brand-copy'>
                    <span className='brand-label'>{navbar.title ?? 'FoodFast Admin'}</span>
                    <strong>{navbar.subtitle ?? 'Điều phối nhà hàng'}</strong>
                    <p>{navbar.description ?? 'Theo dõi hiệu suất đơn hàng và quản lý thực đơn trong một nơi duy nhất.'}</p>
                </div>
            </div>
            <div className='language-card'>
                <span className='language-title'>{navbar.languageCardTitle ?? 'Giao diện hiển thị'}</span>
                <label htmlFor='admin-language-select'>{navbar.languageLabel}</label>
                <select
                    id='admin-language-select'
                    value={language}
                    onChange={event => setLanguage(event.target.value)}
                >
                    {Object.entries(languageOptions).map(([code, label]) => (
                        <option key={code} value={code}>
                            {label}
                        </option>
                    ))}
                </select>
                <p className='language-hint'>{navbar.languageHint ?? 'Chọn ngôn ngữ để đồng bộ với đội vận hành.'}</p>
            </div>
        </header>
    )
}

export default Navbar
