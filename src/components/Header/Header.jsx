import React from 'react'
import './Header.css'
import { useLanguage } from '../../Context/LanguageContext'

const Header = () => {
    const { dictionary } = useLanguage()
    const headerText = dictionary.header

    return (
        <div className='header'>
            <div className="header-contents">
                <h2>{headerText.title}</h2>
                <p>{headerText.description}</p>
                <button>{headerText.cta}</button>
            </div>
        </div>
    )
}

export default Header
