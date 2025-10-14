import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { useLanguage } from '../../Context/LanguageContext'

const Footer = () => {
    const { language, setLanguage, dictionary, languageOptions } = useLanguage()
    const year = new Date().getFullYear()
    const t = dictionary.footer
    const navText = dictionary.navbar

    return (
        <footer className='footer'>
            <div className="footer-content">
                <div className="footer-column footer-about">
                    <div className="footer-logo">
                        <img src={assets.logo} alt={navText.logoAlt} />
                        <span>FoodFast Delivery</span>
                    </div>
                    <p>{t.description}</p>
                </div>
                <div className="footer-column">
                    <h4>{t.quickLinksTitle}</h4>
                    <ul>
                        {t.quickLinks.map((link) => (
                            <li key={link.href}>
                                <a href={link.href}>{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>{t.contactTitle}</h4>
                    <ul>
                        {t.contactItems.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <div className="footer-language-switch">
                    <label htmlFor="footer-language-select">{t.languageLabel}</label>
                    <select
                        id="footer-language-select"
                        value={language}
                        onChange={(event) => setLanguage(event.target.value)}
                    >
                        {Object.entries(languageOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>
                <span>{t.notice.replace('{{year}}', year)}</span>
            </div>
        </footer>
    )
}

export default Footer
