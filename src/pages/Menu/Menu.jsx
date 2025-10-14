import React, { useState } from 'react'
import './Menu.css'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import Footer from '../../components/Footer/Footer'
import { useLanguage } from '../../Context/LanguageContext'

const Menu = () => {
  const [category, setCategory] = useState('all')
  const { dictionary } = useLanguage()
  const menuText = dictionary.menuPage

  return (
    <div className='menu-page'>
      <section className='menu-hero'>
        <div className='menu-hero-content'>
          <span className='menu-eyebrow'>{menuText.eyebrow}</span>
          <h1>{menuText.title}</h1>
          <p>{menuText.description}</p>
        </div>
      </section>
      <ExploreMenu category={category} setCategory={setCategory} />
      <FoodDisplay category={category} />
      <Footer />
    </div>
  )
}

export default Menu
