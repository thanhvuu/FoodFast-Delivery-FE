// ...existing code...
import React, { useContext } from 'react';
import './FoodDisplay.css';
import { StoreContext } from '../../Context/StoreContext';
import FoodItem from '../FoodItem/FoodItem';

const FoodDisplay = ({ category = "ALL" }) => {
  const { food_list = [] } = useContext(StoreContext);

  // --- Thay đoạn tính itemsToShow bằng mã sau ---
  const normalizedCategory = typeof category === 'string' ? category.trim().toLowerCase() : '';
  const itemsToShow = (!normalizedCategory || normalizedCategory === 'all')
    ? food_list
    : food_list.filter(item => {
        // phòng trường hợp item.category khác kiểu hoặc undefined
        const itemCat = (item.category || '').toString().trim().toLowerCase();
        return itemCat === normalizedCategory;
      });
  // --- Kết thúc thay đổi ---

  return (
    <div className='food-display' id='food-display'>
      <h2>Những món ăn gần bạn</h2>
      <div className="food-display-list">
        {itemsToShow.map(item => (
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
  );
};

export default FoodDisplay;
// ...existing code...