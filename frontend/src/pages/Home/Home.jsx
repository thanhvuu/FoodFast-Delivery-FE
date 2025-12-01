import React, { useState } from 'react'
import './Home.css'
import Header from '../../components/Header/Header'
import ExploreMenu from '../../components/ExploreMenu/ExploreMenu'
import FoodDisplay from '../../components/FoodDisplay/FoodDisplay'
import RestaurantSection from '../../components/RestaurantSection/RestaurantSection'

const Home = () => {
  const [category, setCategory] = useState('all')
  const [restaurant, setRestaurant] = useState('all')

  return (
    <div>
      <Header />
      <ExploreMenu category={category} setCategory={setCategory} />
      <RestaurantSection selectedRestaurant={restaurant} onSelect={setRestaurant} />
      <FoodDisplay category={category} restaurant={restaurant} />
    </div>
  )
}

export default Home
