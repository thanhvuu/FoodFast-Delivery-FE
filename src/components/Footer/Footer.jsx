// ...existing code...
import React, { useMemo } from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'
import { useLanguage } from '../../Context/LanguageContext'

const Footer = () => {
    const { language, setLanguage, dictionary, languageOptions } = useLanguage()
    const year = new Date().getFullYear()
    const navText = dictionary?.navbar || { logoAlt: 'FoodFast' }

    const translations = useMemo(() => ({
        vi: {
            description: 'FoodFast Delivery mang đến cho bạn trải nghiệm giao đồ ăn nhanh chóng, tiện lợi và an toàn. Chúng tôi hợp tác với những đầu bếp địa phương để phục vụ các món ăn yêu thích mọi lúc bạn cần.',
            quickLinksTitle: 'Liên kết nhanh',
            quickLinks: [
                { href: '#explore-menu', label: 'Khám phá menu' },
                { href: '#food-display', label: 'Món ăn nổi bật' },
                { href: '/cart', label: 'Giỏ hàng của bạn' }
            ],
            contactTitle: 'Liên hệ',
            contactItems: [
                'Hotline: 1111111111',
                'Email: support@foodfast.vn',
                'Địa chỉ: 273 An Dương Vương, Phường Chợ Quán, Hồ Chí Minh'
            ],
            languageLabel: 'Ngôn ngữ',
            languageOptions: {
                vi: 'Tiếng Việt',
                en: 'English'
            },
            footerNotice: `© ${year} FoodFast Delivery. Tất cả các quyền được bảo lưu.`
        },
        en: {
            description: 'FoodFast Delivery brings you a fast, convenient and safe food delivery experience. We partner with local chefs to serve your favourite dishes whenever you need them.',
            quickLinksTitle: 'Quick links',
            quickLinks: [
                { href: '#explore-menu', label: 'Explore menu' },
                { href: '#food-display', label: 'Featured dishes' },
                { href: '/cart', label: 'Your cart' }
            ],
            contactTitle: 'Contact',
            contactItems: [
                'Hotline: 1111111111',
                'Email: support@foodfast.vn',
                'Address: 273 An Dương Vương, Ward Chợ Quán, Ho Chi Minh City'
            ],
            languageLabel: 'Language',
            languageOptions: {
                vi: 'Vietnamese',
                en: 'English'
            },
            footerNotice: `© ${year} FoodFast Delivery. All rights reserved.`
        }
    }), [year])

    const t = translations[language] || translations.en
    const langOptions = languageOptions || t.languageOptions

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
                        {Object.entries(langOptions).map(([value, label]) => (
                            <option key={value} value={value}>
                                {label}
                            </option>
                        ))}
                    </select>
                </div>

                <span>{t.footerNotice}</span>
            </div>
        </footer>
    )
}

export default Footer
// ...existing code...