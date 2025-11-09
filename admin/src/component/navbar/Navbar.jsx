import React from 'react'
import './Navbar.css'
import { assests } from '../../assets/assest'
import { useAdminLanguage } from '../../context/LanguageContext'

const Navbar = () => {
    const { dictionary, language, setLanguage, languageOptions } = useAdminLanguage()
    const { navbar } = dictionary

    return (
        <div className='navbar'>
            <img className='logo' src={assests.logo} alt="FoodFast logo" />
            <div className='navbar-actions'>
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
            </div>
        </div>
    )
}

export default Navbar
