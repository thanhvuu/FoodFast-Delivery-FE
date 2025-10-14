import React, { useContext, useMemo } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { useLanguage } from '../../Context/LanguageContext'

const FoodDisplay = ({ category = 'all' }) => {
  const { food_list = [] } = useContext(StoreContext)
  const { dictionary } = useLanguage()

  const itemsToShow = useMemo(() => {
    const normalizedCategory = (category || '').toString().trim().toLowerCase()
    if (!normalizedCategory || normalizedCategory === 'all') {
      return food_list
    }

    return food_list.filter((item) => {
      const itemCat = (item.category || '').toString().trim().toLowerCase()
      return itemCat === normalizedCategory
    })
  }, [category, food_list])

  return (
    <div className='food-display' id='food-display'>
      <h2>{dictionary.foodDisplay.title}</h2>
      <div className="food-display-list">
        {itemsToShow.map((item) => (
          <FoodItem
            key={item._id}
            id={item._id}
            name={item.name}
            description={item.description}
            price={item.price}
            image={item.image}
          />
        ))}
      </div>
    </div>
  )
}

export default FoodDisplay
