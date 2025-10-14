import React, { useState } from 'react'
import './Menu.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Footer from '../../components/Footer/Footer'

const Menu = () => {
  const [category, setCategory] = useState('all')

  return (
    <div className='menu-page'>
      <section className='menu-hero'>
        <div className='menu-hero-content'>
          <span className='menu-eyebrow'>Thực đơn mỗi ngày</span>
          <h1>Đặt món yêu thích chỉ trong vài chạm</h1>
          <p>
            Khám phá hàng chục món ăn nổi bật của FoodFast và lọc theo thể loại bạn thích.
            Tất cả đều được chuẩn bị tươi ngon và giao đến tận nơi.
          </p>
        </div>
      </section>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <Footer />
    </div>
  )
}

export default Menu
