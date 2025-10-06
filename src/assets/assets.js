import logo from './logo.jpg';
import search_icon from './search_icon.png';
import basket_icon from './basket.jpeg';
import header_img from './header_img.webp';
import menu_1 from './menu1.jpg';
import menu_2 from './menu2.jpg';
import menu_3 from './menu3.jpg';
import menu_4 from './menu4.jpg';
import menu_5 from './menu5.jpg';
import menu_6 from './menu6.jpeg';

import food_1 from './food_1.jpg';
import food_2 from './food_2.jpg';
import food_3 from './food_3.webp';


export const assets = {
    logo,
    search_icon,
    basket_icon,
    header_img,
}

export const menu_list = [
    {
        menu_name: "fast-food",
        menu_image: menu_1
    },
    {
        menu_name: "Đồ ăn vặt",
        menu_image: menu_2
    },
    {
        menu_name: "Đồ ngọt",
        menu_image: menu_3
    },
    {
        menu_name: "Món nước",
        menu_image: menu_4
    },
    {
        menu_name: "Món khô",
        menu_image: menu_6
    },
    {
        menu_name: "Thức Uống",
        menu_image: menu_5
    },
]

export const food_list = [
    {
        _id: "1",
        name: "Gà rán",
        image: food_1,
        price: 30000,
        description: "Gà rán giòn rụm, thơm ngon",
        category: "fast-food"
    },
    {
        _id: "2",
        name: "Hamburger",
        image: food_2,
        price: 35000,
        description: "Hamburger bò Mỹ, phô mai cheddar",
        category: "fast-food",
    },
    {
        _id: "3",
        name: "Pizza",
        image: food_3,
        price: 50000,
        description: "Pizza hải sản, phô mai mozzarella",
        category: "fast-food",
    },
]