import React from 'react'
import './Footer.css'
import { assets } from '../../assets/assets'

const Footer = () => {
    const year = new Date().getFullYear()

    return (
        <footer className='footer'>
            <div className="footer-content">
                <div className="footer-column footer-about">
                    <div className="footer-logo">
                        <img src={assets.logo} alt="FoodFast Delivery logo" />
                        <span>FoodFast Delivery</span>
                    </div>
                    <p>
                        FoodFast Delivery mang đến cho bạn trải nghiệm giao đồ ăn nhanh chóng, tiện lợi và an toàn.
                        Chúng tôi hợp tác với những đầu bếp địa phương để phục vụ các món ăn yêu thích mọi lúc bạn cần.
                    </p>
                </div>
                <div className="footer-column">
                    <h4>Liên kết nhanh</h4>
                    <ul>
                        <li><a href="#explore-menu">Khám phá menu</a></li>
                        <li><a href="#food-display">Món ăn nổi bật</a></li>
                        <li><a href="/cart">Giỏ hàng của bạn</a></li>
                    </ul>
                </div>
                <div className="footer-column">
                    <h4>Liên hệ</h4>
                    <ul>
                        <li>Hotline: 1111111111</li>
                        <li>Email: support@foodfast.vn</li>
                        <li>Địa chỉ: 273 An Dương Vương, Phường Chợ Quán, Hồ Chí Minh</li>
                    </ul>
                </div>
            </div>
            <div className="footer-bottom">
                <span>© {year} FoodFast Delivery. Tất cả các quyền được bảo lưu.</span>
            </div>
        </footer>
    )
}

export default Footer
