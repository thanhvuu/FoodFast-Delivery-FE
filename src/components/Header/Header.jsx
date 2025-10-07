import React from 'react'
import './Header.css'

const Header = () => {
    return (
        <div className='header'>
            <div className="header-contents">
                <h2>Đặt món ăn yêu thích của bạn tại đây</h2>
                <p>Đầu bếp sẽ đảm nhiệm mọi công đoạn chuẩn bị, như thái nhỏ và ướp, để bạn có thể nấu một bữa ăn tươi ngon chỉ trong 15 phút.</p>
                <button>Xem thực đơn</button>
            </div>
        </div>
    )
}

export default Header
