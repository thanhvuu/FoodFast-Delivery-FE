import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'

const ExploreMenu = ({ category, setCategory }) => {
  const handleSelect = (menuName) => {
    if (!setCategory) return
    setCategory((prev) => {
      const normalizedPrev = (prev || '').toString().toLowerCase()
      const normalizedMenu = menuName.toLowerCase()
      return normalizedPrev === normalizedMenu ? 'all' : menuName
    })
  }

  const normalizedCategory = (category || '').toString().toLowerCase()

  return (
    <div className='explore-menu' id='explore-menu'>
      <h1>Khám phá thực đơn của chúng tôi</h1>
      <p className='explore-menu-text'>Chạm để lọc nhanh các món ăn theo sở thích và khám phá những lựa chọn hấp dẫn mỗi ngày.</p>
      <div className="explore-menu-list">
        {menu_list.map((item) => {
          const isActive = normalizedCategory === item.menu_name.toLowerCase()
          return (
            <button
              key={item.menu_name}
              type='button'
              onClick={() => handleSelect(item.menu_name)}
              className={`explore-menu-list-item ${isActive ? 'active' : ''}`}
            >
              <img src={item.menu_image} alt={item.menu_name} />
              <p>{item.menu_name}</p>
            </button>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
