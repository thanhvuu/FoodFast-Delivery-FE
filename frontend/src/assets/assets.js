import logo from './logo.jpg'
import search_icon from './search_icon.png'
import basket_icon from './basket.jpeg'
import header_img from './header_img.webp'
import rating_starts from './rating_stars.png'
import add_icon_white from './add_icon_white.png'
import remove_icon_red from './remove_icon_red.png'
import add_icon_green from './add_icon_green.png'
import menu_1 from './menu1.jpg'
import menu_2 from './menu2.jpg'
import menu_3 from './menu3.jpg'
import menu_4 from './menu4.jpg'
import menu_5 from './menu5.jpg'
import menu_6 from './menu6.jpeg'
import dtbData from './dtb.json'

import food_1 from './food_1.jpg'
import food_2 from './food_2.jpg'
import food_3 from './food_3.webp'
import food_4 from './food_4.jpg'
import food_5 from './food_5.jpg'
import food_6 from './food_6.jpg'
import food_7 from './food_7.jpg'
import food_8 from './food_8.jpg'
import food_9 from './food_9.jpg'
import food_10 from './food_10.jpg'
import food_11 from './food_11.png'
import food_12 from './food_12.png'

export const assets = {
  logo,
  search_icon,
  basket_icon,
  header_img,
  rating_starts,
  add_icon_white,
  remove_icon_red,
  add_icon_green,
}

const menuImageMap = {
  'menu1.jpg': menu_1,
  'menu2.jpg': menu_2,
  'menu3.jpg': menu_3,
  'menu4.jpg': menu_4,
  'menu5.jpg': menu_5,
  'menu6.jpeg': menu_6,
}

const foodImageMap = {
  'food_1.jpg': food_1,
  'food_2.jpg': food_2,
  'food_3.webp': food_3,
  'food_4.jpg': food_4,
  'food_5.jpg': food_5,
  'food_6.jpg': food_6,
  'food_7.jpg': food_7,
  'food_8.jpg': food_8,
  'food_9.jpg': food_9,
  'food_10.jpg': food_10,
  'food_11.png': food_11,
  'food_12.png': food_12,
}

export const menu_list = (dtbData.menu_list || []).map((item) => ({
  ...item,
  menu_image: menuImageMap[item.menu_image] || item.menu_image,
}))

export const food_list = (dtbData.food_list || []).map((item) => ({
  ...item,
  image: foodImageMap[item.image] || item.image,
}))

