export type FoodItem = {
  id: string;
  name: string;
  price: number;
  rating: number;
  votes: number;
  image: string;
  category: string;
  description: string;
};

export const featured: FoodItem[] = [
  {
    id: 'chicken',
    name: 'Gà rán',
    price: 50000,
    rating: 4.9,
    votes: 420,
    category: 'Món chính',
    description: 'Miếng gà giòn rụm cùng sốt cay ngọt đặc trưng.',
    image: 'https://images.unsplash.com/photo-1606755962773-0e7d4e5dff72?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'burger',
    name: 'Hamburger',
    price: 45000,
    rating: 4.8,
    votes: 388,
    category: 'Đồ ăn nhanh',
    description: 'Bánh mì kẹp thịt bò Mỹ với phô mai cheddar thơm lừng.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pizza',
    name: 'Pizza Phô Mai',
    price: 89000,
    rating: 4.7,
    votes: 295,
    category: 'Món chính',
    description: 'Đế bánh mỏng giòn, phủ phô mai mozzarella và pepperoni.',
    image: 'https://images.unsplash.com/photo-1548365328-9f5474eb6f12?auto=format&fit=crop&w=800&q=80',
  },
];

export const popular: FoodItem[] = [
  {
    id: 'taco',
    name: 'Tacos',
    price: 45000,
    rating: 4.8,
    votes: 198,
    category: 'Món Mexico',
    description: 'Vỏ bánh giòn với nhân bò cay và sốt guacamole đặc trưng.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pasta',
    name: 'Mì Ý Sốt Kem',
    price: 69000,
    rating: 4.6,
    votes: 152,
    category: 'Món chính',
    description: 'Sợi mì tươi sốt kem nấm và thịt xông khói.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'salad',
    name: 'Salad Rau Củ',
    price: 30000,
    rating: 4.5,
    votes: 96,
    category: 'Ăn kèm',
    description: 'Rau củ tươi giòn hòa quyện với nước sốt chanh leo.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fried-shrimp',
    name: 'Tôm Chiên Xù',
    price: 59000,
    rating: 4.9,
    votes: 210,
    category: 'Ăn vặt',
    description: 'Tôm tươi chiên giòn rụm, chấm kèm sốt tartar.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cdcd6be9bdc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sushi',
    name: 'Combo Sushi',
    price: 129000,
    rating: 4.9,
    votes: 341,
    category: 'Ẩm thực Nhật',
    description: 'Sashimi cá hồi, nigiri và maki cuộn tinh tế.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dessert',
    name: 'Bánh Mousse Chanh Dây',
    price: 45000,
    rating: 4.7,
    votes: 165,
    category: 'Tráng miệng',
    description: 'Lớp mousse mềm mịn với mùi thơm đặc trưng của chanh dây.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
];

export const categories = [
  'Món yêu thích',
  'Đồ ăn nhanh',
  'Tráng miệng',
  'Đồ uống',
  'Salad',
  'Combo gia đình',
];