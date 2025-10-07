import React, { useContext,useState } from 'react';
import './FoodItem.css';
import { StoreContext } from '../../Context/StoreContext';
import { assets } from '../../assets/assets';

const FoodItem = ({ id, name, price, description, image }) => {
  const{cartItems,addToCart, removeFromCart} = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-img" src={image} alt={name} />


        {!cartItems[id] ? (
          <button
            className="add-btn"
            onClick={() => addToCart(id)}
            aria-label="Thêm vào giỏ"
          >
            <img src={assets.add_icon_white} alt="" />
          </button>
        ) : (
          <div className="item-count-counter">
            <button
              className="icon-btn"
              onClick={() => removeFromCart(id)}
              aria-label="Giảm số lượng"
            >
              <img src={assets.remove_icon_red} alt="" />
            </button>
            <span className="qty">{cartItems[id]}</span>
            <button
              className="icon-btn"
              onClick={() => addToCart(id)}
              aria-label="Tăng số lượng"
            >
              <img src={assets.add_icon_green} alt="" />
            </button>
          </div>
        )}
      </div>

      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">{price}đ</p>
      </div>
    </div>
  );
};

export default FoodItem;
