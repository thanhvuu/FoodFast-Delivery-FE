import logo from './logo.jpg';
import add_icon from './add_icon.png';
import order_icon from './order_icon.png';
import upload_area from './upload_area.svg';


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


export const assests = {
    logo,
    add_icon,
    order_icon,
    upload_area
}

export const food_list = [
    {
        _id: '1',
        name: 'Gà rán',
        image: food_1,
        price: 30000,
        description: 'Gà rán giòn rụm, thơm ngon',
        category: 'Fast Food',
        ingredients: ['Đùi gà', 'Bột chiên', 'Dầu ăn', 'Tiêu', 'Muối'],
        address: '273 An Dương Vương, Quận 5, TP.HCM',
        restaurant: {
            name: 'KFC Nguyễn Trãi',
            address: '273 An Dương Vương, Quận 5, TP.HCM',
        },
    },
    {
        _id: '2',
        name: 'Hamburger',
        image: food_2,
        price: 35000,
        description: 'Hamburger bò Mỹ, phô mai cheddar',
        category: 'Fast Food',
        ingredients: ['Bánh mì Burger', 'Thịt bò', 'Phô mai Cheddar', 'Xà lách', 'Cà chua', 'Sốt đặc biệt'],
        address: '45 Trần Hưng Đạo, Quận 1, TP.HCM',
        restaurant: {
            name: 'Burger King Trần Hưng Đạo',
            address: '45 Trần Hưng Đạo, Quận 1, TP.HCM',
        },
    },
    {
        _id: '3',
        name: 'Pizza',
        image: food_3,
        price: 50000,
        description: 'Pizza hải sản, phô mai mozzarella',
        category: 'Fast Food',
        ingredients: ['Bột mì', 'Tôm', 'Mực', 'Phô mai Mozzarella', 'Sốt cà chua'],
        address: '198 Pasteur, Quận 3, TP.HCM',
        restaurant: {
            name: 'Pizza 4P Pasteur',
            address: '198 Pasteur, Quận 3, TP.HCM',
        },
    },
    {
        _id: '4',
        name: 'Tacos',
        image: food_4,
        price: 50000,
        description: 'Tacos thịt bò, rau củ tươi ngon',
        category: 'Fast Food',
        ingredients: ['Vỏ bánh tacos', 'Thịt bò', 'Hành tây', 'Cà chua', 'Xà lách', 'Sốt salsa'],
        address: '81 Lê Lợi, Quận 1, TP.HCM',
        restaurant: {
            name: 'Mexican Saigon',
            address: '81 Lê Lợi, Quận 1, TP.HCM',
        },
    },
    {
        _id: '5',
        name: 'Phở bò',
        image: food_5,
        price: 50000,
        description: 'Phở bò tái, nước dùng đậm đà',
        category: 'Món nước',
        ingredients: ['Bánh phở', 'Thịt bò tái', 'Nước dùng bò', 'Hành lá', 'Giá', 'Ngò gai'],
        address: '260 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        restaurant: {
            name: 'Phở Hòa Pasteur',
            address: '260 Cách Mạng Tháng 8, Quận 10, TP.HCM',
        },
    },
    {
        _id: '6',
        name: 'Mỳ Ý',
        image: food_6,
        price: 60000,
        description: 'Mỳ Ý sốt bò bằm, phô mai Parmesan',
        category: 'Món nước',
        ingredients: ['Mỳ Ý Spaghetti', 'Thịt bò bằm', 'Sốt cà chua', 'Phô mai Parmesan', 'Hành tây'],
        address: '92 Lê Thánh Tôn, Quận 1, TP.HCM',
        restaurant: {
            name: 'Italian Food Corner',
            address: '92 Lê Thánh Tôn, Quận 1, TP.HCM',
        },
    },
    {
        _id: '7',
        name: 'Khoai tây chiên',
        image: food_7,
        price: 30000,
        description: 'Khoai tây chiên giòn rụm, muối tiêu',
        category: 'Đồ ăn vặt',
        ingredients: ['Khoai tây', 'Dầu ăn', 'Muối', 'Tiêu'],
        address: '120 Nguyễn Tri Phương, Quận 10, TP.HCM',
        restaurant: {
            name: 'Snack House',
            address: '120 Nguyễn Tri Phương, Quận 10, TP.HCM',
        },
    },
    {
        _id: '8',
        name: 'Kem ốc quế',
        image: food_8,
        price: 15000,
        description: 'Kem ốc quế vani, socola',
        category: 'Đồ ngọt',
        ingredients: ['Kem vani', 'Kem socola', 'Ốc quế', 'Sữa đặc'],
        address: '35 Nguyễn Văn Cừ, Quận 5, TP.HCM',
        restaurant: {
            name: 'Ice Cream House',
            address: '35 Nguyễn Văn Cừ, Quận 5, TP.HCM',
        },
    },
    {
        _id: '9',
        name: 'Gà viên',
        image: food_9,
        price: 40000,
        description: 'Gà viên chiên giòn, sốt mayonnaise',
        category: 'Đồ ăn vặt',
        ingredients: ['Thịt gà', 'Bột chiên', 'Dầu ăn', 'Sốt mayonnaise', 'Tiêu'],
        address: '14 Nguyễn Thành Ý, Quận 1, TP.HCM',
        restaurant: {
            name: 'Chicken Balls Corner',
            address: '14 Nguyễn Thành Ý, Quận 1, TP.HCM',
        },
    },
    {
        _id: '10',
        name: 'Bún bò Huế',
        image: food_10,
        price: 50000,
        description: 'Bún bò Huế cay nồng, đậm đà hương vị',
        category: 'Món nước',
        ingredients: ['Bún Huế', 'Thịt bò', 'Chả Huế', 'Rau thơm', 'Ớt', 'Sả'],
        address: '19 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
        restaurant: {
            name: 'Bún bò Huế O Lý',
            address: '19 Nguyễn Đình Chiểu, Quận 3, TP.HCM',
        },
    },
    {
        _id: '11',
        name: 'Cơm chiên Dương Châu',
        image: food_11,
        price: 40000,
        description: 'Cơm chiên Dương Châu thập cẩm, trứng, rau củ',
        category: 'Món khô',
        ingredients: ['Cơm', 'Trứng', 'Thịt xá xíu', 'Đậu Hà Lan', 'Cà rốt', 'Lạp xưởng'],
        address: '212 Lý Chính Thắng, Quận 3, TP.HCM',
        restaurant: {
            name: 'Quán Hoa Dương Châu',
            address: '212 Lý Chính Thắng, Quận 3, TP.HCM',
        },
    },
    {
        _id: '12',
        name: 'Panna Cotta',
        image: food_12,
        price: 15000,
        description: 'Panna Cotta kem tươi, sốt dâu tây',
        category: 'Đồ ngọt',
        ingredients: ['Kem tươi', 'Sữa', 'Gelatin', 'Đường', 'Sốt dâu tây'],
        address: '101 Nguyễn Công Trứ, Quận 1, TP.HCM',
        restaurant: {
            name: 'Sweet Italy',
            address: '101 Nguyễn Công Trứ, Quận 1, TP.HCM',
        },
    },
]

export const order_list = [
    {
        id: 'o1',
        customer: 'Nguyễn Văn A',
        items: [
            { name: 'Gà rán', quantity: 2, price: 30000 },
            { name: 'Cơm chiên Dương Châu', quantity: 1, price: 40000 }
        ],
        address: '212 Lý Chính Thắng, Quận 3',
        status: 'pending', // 'delivered', 'pending'
        paid: true, // true/false
        route: [
            {
                id: 'pickup',
                title: 'Nhận món tại nhà hàng',
                eta: '10:05',
                position: { x: 10, y: 70 },
                description: 'Drone đã nhận đơn tại KFC Nguyễn Trãi và chuẩn bị cất cánh.'
            },
            {
                id: 'takeoff',
                title: 'Drone cất cánh',
                eta: '10:07',
                position: { x: 25, y: 55 },
                description: 'Thiết bị bay rời điểm lấy hàng và tăng độ cao an toàn.'
            },
            {
                id: 'enroute',
                title: 'Đang trên đường giao',
                eta: '10:12',
                position: { x: 50, y: 45 },
                description: 'Drone bay qua Quận 1, kiểm soát tốc độ và tránh vật cản.'
            },
            {
                id: 'arriving',
                title: 'Chuẩn bị hạ cánh',
                eta: '10:15',
                position: { x: 75, y: 40 },
                description: 'Drone đang tiếp cận vị trí giao hàng với tốc độ thấp.'
            },
            {
                id: 'delivered',
                title: 'Hoàn tất giao hàng',
                eta: '10:17',
                position: { x: 88, y: 65 },
                description: 'Đơn hàng được giao thành công cho khách Nguyễn Văn A.'
            }
        ]
    },
    {
        id: 'o2',
        customer: 'Trần Thị B',
        items: [
            { name: 'Pizza', quantity: 1, price: 50000 },
            { name: 'Kem ốc quế', quantity: 3, price: 15000 },
            { name: 'Hamburger', quantity: 2, price: 35000 }
        ],
        address: '45 Trần Hưng Đạo, Quận 1',
        status: 'delivered',
        paid: false,
        route: [
            {
                id: 'pickup',
                title: 'Nhận món tại nhà hàng',
                eta: '09:40',
                position: { x: 8, y: 75 },
                description: 'Drone đã nhận món tại Pizza 4P Pasteur.'
            },
            {
                id: 'takeoff',
                title: 'Drone cất cánh',
                eta: '09:42',
                position: { x: 22, y: 60 },
                description: 'Drone khởi hành và kiểm tra hệ thống định vị.'
            },
            {
                id: 'enroute',
                title: 'Đang trên đường giao',
                eta: '09:48',
                position: { x: 48, y: 47 },
                description: 'Thiết bị bay qua trung tâm Quận 1, tín hiệu ổn định.'
            },
            {
                id: 'arriving',
                title: 'Chuẩn bị hạ cánh',
                eta: '09:51',
                position: { x: 70, y: 45 },
                description: 'Drone đã thông báo khách hàng chuẩn bị nhận món.'
            },
            {
                id: 'delivered',
                title: 'Hoàn tất giao hàng',
                eta: '09:53',
                position: { x: 90, y: 60 },
                description: 'Đơn hàng bàn giao thành công cho khách Trần Thị B.'
            }
        ]
    },
    // ... thêm đơn nữa
]
