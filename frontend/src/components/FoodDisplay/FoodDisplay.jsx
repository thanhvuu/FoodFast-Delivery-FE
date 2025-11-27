import React, { useContext, useMemo, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { useLanguage } from '../../Context/LanguageContext'
import { Link } from 'react-router-dom'


const FoodDisplay = ({ category = 'all' }) => {
    const { food_list = [] } = useContext(StoreContext)
    const { dictionary } = useLanguage()
    const [sortOrder, setSortOrder] = useState('default')

    const sortOptions = [
        { value: 'default', label: dictionary.foodDisplay.sort.default },
        { value: 'asc', label: dictionary.foodDisplay.sort.lowToHigh },
        { value: 'desc', label: dictionary.foodDisplay.sort.highToLow },
    ]

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

    const sortedItems = useMemo(() => {
        if (sortOrder === 'asc') {
            return [...itemsToShow].sort((a, b) => Number(a.price) - Number(b.price))
        }

        if (sortOrder === 'desc') {
            return [...itemsToShow].sort((a, b) => Number(b.price) - Number(a.price))
        }

        return itemsToShow
    }, [itemsToShow, sortOrder])

    return (
        <div className='food-display' id='food-display'>
            <div className="food-display__header">
                <h2>{dictionary.foodDisplay.title}</h2>
                <label className="food-display__sort">
                    <span>{dictionary.foodDisplay.sort.label}</span>
                    <select
                        value={sortOrder}
                        onChange={(event) => setSortOrder(event.target.value)}
                        aria-label={dictionary.foodDisplay.sort.label}
                    >
                        {sortOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </label>
            </div>
            <div className="food-display-list">
                {sortedItems.map((item) => (
                    <Link to={`/food/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <FoodItem
                            id={item._id}
                            name={item.name}
                            description={item.description}
                            price={item.price}
                            image={item.image}
                        />
                    </Link>
                ))}
            </div>
        </div>
    )
}

export default FoodDisplay
