import React from 'react'
import './ExploreMenu.css'
import { menu_list } from '../../assets/assets'
import { useLanguage } from '../../Context/LanguageContext'

const ExploreMenu = ({ category, setCategory }) => {
  const { dictionary } = useLanguage()
  const menuText = dictionary.exploreMenu

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
      <h1>{menuText.title}</h1>
      <p className='explore-menu-text'>{menuText.description}</p>
      <div className="explore-menu-list">
        {menu_list.map((item) => {
          const isActive = normalizedCategory === item.menu_name.toLowerCase()
          const displayLabel = menuText.categories[item.menu_name] || item.menu_name
          return (
            <button
              key={item.menu_name}
              type='button'
              onClick={() => handleSelect(item.menu_name)}
              className={`explore-menu-list-item ${isActive ? 'active' : ''}`}
            >
              <img src={item.menu_image} alt={item.menu_name} />
              <p>{displayLabel}</p>
            </button>
          )
        })}
      </div>
      <hr />
    </div>
  )
}

export default ExploreMenu
