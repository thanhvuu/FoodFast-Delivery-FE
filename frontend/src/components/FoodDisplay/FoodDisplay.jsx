import React, { useContext, useEffect, useMemo, useState } from 'react'
import './FoodDisplay.css'
import { StoreContext } from '../../Context/StoreContext'
import FoodItem from '../FoodItem/FoodItem'
import { useLanguage } from '../../Context/LanguageContext'
import { Link } from 'react-router-dom'


const FoodDisplay = ({ category = 'all', restaurant = 'all' }) => {
    const { food_list = [] } = useContext(StoreContext)
    const { dictionary } = useLanguage()
    const [sortOrder, setSortOrder] = useState('default')
    const [currentPage, setCurrentPage] = useState(1)
    const ITEMS_PER_PAGE = 10

    const sortOptions = [
        { value: 'default', label: dictionary.foodDisplay.sort.default },
        { value: 'asc', label: dictionary.foodDisplay.sort.lowToHigh },
        { value: 'desc', label: dictionary.foodDisplay.sort.highToLow },
    ]

    const itemsToShow = useMemo(() => {
        const normalizedCategory = (category || '').toString().trim().toLowerCase()
        const normalizedRestaurant = (restaurant || '').toString().trim().toLowerCase()

        return food_list.filter((item) => {
            const itemCat = (item.category || '').toString().trim().toLowerCase()
            const matchCategory = !normalizedCategory || normalizedCategory === 'all' ? true : itemCat === normalizedCategory

            const itemRestaurant = (item.restaurant?.name || '').toString().trim().toLowerCase()
            const matchRestaurant =
                !normalizedRestaurant || normalizedRestaurant === 'all' ? true : itemRestaurant === normalizedRestaurant

            return matchCategory && matchRestaurant
        })
    }, [category, restaurant, food_list])

    const sortedItems = useMemo(() => {
        if (sortOrder === 'asc') {
            return [...itemsToShow].sort((a, b) => Number(a.price) - Number(b.price))
        }

        if (sortOrder === 'desc') {
            return [...itemsToShow].sort((a, b) => Number(b.price) - Number(a.price))
        }

        return itemsToShow
    }, [itemsToShow, sortOrder])

    const totalPages = useMemo(() => {
        if (!sortedItems.length) return 1
        return Math.ceil(sortedItems.length / ITEMS_PER_PAGE)
    }, [sortedItems.length])

    const paginatedItems = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
        const endIndex = startIndex + ITEMS_PER_PAGE
        return sortedItems.slice(startIndex, endIndex)
    }, [currentPage, sortedItems])

    useEffect(() => {
        setCurrentPage(1)
    }, [category, restaurant, sortOrder])

    useEffect(() => {
        if (currentPage > totalPages) {
            setCurrentPage(totalPages)
        }
    }, [currentPage, totalPages])

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
                {paginatedItems.length === 0 ? (
                    <p className="food-display__empty">{dictionary.foodDisplay.empty}</p>
                ) : (
                    paginatedItems.map((item) => (
                        <Link to={`/food/${item._id}`} key={item._id} style={{ textDecoration: 'none', color: 'inherit' }}>
                            <FoodItem
                                id={item._id}
                                name={item.name}
                                description={item.description}
                                price={item.price}
                                image={item.image}
                            />
                        </Link>
                    ))
                )}
            </div>
            <div className="food-display__pagination" role="navigation" aria-label={dictionary.foodDisplay.pagination.label}>
                <button
                    type="button"
                    className="food-display__page-button"
                    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                >
                    {dictionary.foodDisplay.pagination.previous}
                </button>
                <span className="food-display__page-status">
                    {dictionary.foodDisplay.pagination.page} {currentPage}/{totalPages}
                </span>
                <button
                    type="button"
                    className="food-display__page-button"
                    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                >
                    {dictionary.foodDisplay.pagination.next}
                </button>
            </div>
        </div>
    )
}

export default FoodDisplay
