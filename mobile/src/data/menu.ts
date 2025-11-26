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

export const normalizeCategory = (value: string) => {
  const key = value.toLowerCase()
  if (['đồ ăn nhanh', 'món chính', 'fast food', 'món mexico'].includes(key)) return 'Fast Food'
  if (['đồ ăn vặt', 'ăn vặt', 'snack', 'ăn kèm'].includes(key)) return 'Đồ ăn vặt'
  if (['đồ ngọt', 'tráng miệng', 'dessert'].includes(key)) return 'Đồ ngọt'
  if (['món nước', 'soups', 'noodles', 'mì', 'phở', 'bún'].includes(key)) return 'Món nước'
  if (['món khô', 'cơm', 'khô'].includes(key)) return 'Món khô'
  if (['thức uống', 'đồ uống', 'drink', 'beverage'].includes(key)) return 'Thức uống'
  return value
}

export const allFoods: FoodItem[] = [
  {
    id: 'banh-thuy',
    name: 'Bánh Thủy',
    price: 19000,
    rating: 4.7,
    votes: 120,
    category: 'Món nước',
    description: 'Bún riêu, bún, phở với topping đa dạng.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'banh-cuon-phu-ly',
    name: 'Bánh cuốn Phủ Lý',
    price: 14000,
    rating: 4.9,
    votes: 95,
    category: 'Món chính',
    description: 'Bánh cuốn nóng nhân thịt, hành phi, chả quế.',
    image: 'https://images.unsplash.com/photo-1604908177461-9f4b7fe1c95b?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bonchon-chicken',
    name: 'Bonchon Chicken',
    price: 45000,
    rating: 4.9,
    votes: 210,
    category: 'Fast Food',
    description: 'Gà rán giòn sốt Hàn Quốc, kèm mì Ý hoặc cơm.',
    image: 'https://images.unsplash.com/photo-1604908176903-a34d884e3be1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'banh-trang-kep',
    name: 'Bánh Tráng Kẹp Đà Nẵng',
    price: 25000,
    rating: 4.8,
    votes: 180,
    category: 'Đồ ăn vặt',
    description: 'Bánh tráng nướng giòn, pate, trứng, bò khô.',
    image: 'https://images.unsplash.com/photo-1608032846855-44f1abb9795e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pho-ha-noi',
    name: 'Phở Hà Nội Xưa',
    price: 25000,
    rating: 4.7,
    votes: 260,
    category: 'Món nước',
    description: 'Phở bò truyền thống, nước dùng trong, thơm.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'com-tam-sai-gon',
    name: 'Cơm Tấm Sài Gòn 123',
    price: 35000,
    rating: 4.9,
    votes: 175,
    category: 'Món khô',
    description: 'Cơm tấm sườn, bì, chả, trứng chuẩn Sài Gòn.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'chicken',
    name: 'Gà rán',
    price: 50000,
    rating: 4.9,
    votes: 420,
    category: 'Fast Food',
    description: 'Miếng gà giòn rụm cùng sốt cay ngọt đặc trưng.',
    image: 'https://images.unsplash.com/photo-1606755962773-0e7d4e5dff72?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'burger',
    name: 'Hamburger',
    price: 45000,
    rating: 4.8,
    votes: 388,
    category: 'Fast Food',
    description: 'Bánh mì kẹp thịt bò Mỹ với phô mai cheddar thơm lừng.',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pizza',
    name: 'Pizza Phô Mai',
    price: 89000,
    rating: 4.7,
    votes: 295,
    category: 'Fast Food',
    description: 'Đế bánh mỏng giòn, phủ phô mai mozzarella và pepperoni.',
    image: 'https://images.unsplash.com/photo-1548365328-9f5474eb6f12?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'taco',
    name: 'Tacos',
    price: 45000,
    rating: 4.8,
    votes: 198,
    category: 'Fast Food',
    description: 'Vỏ bánh giòn với nhân bò cay và sốt guacamole đặc trưng.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'pasta',
    name: 'Mì Ý Sốt Kem',
    price: 69000,
    rating: 4.6,
    votes: 152,
    category: 'Món nước',
    description: 'Sợi mì tươi sốt kem nấm và thịt xông khói.',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'salad',
    name: 'Salad Rau Củ',
    price: 30000,
    rating: 4.5,
    votes: 96,
    category: 'Đồ ăn vặt',
    description: 'Rau củ tươi giòn hòa quyện với nước sốt chanh leo.',
    image: 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'fried-shrimp',
    name: 'Tôm Chiên Xù',
    price: 59000,
    rating: 4.9,
    votes: 210,
    category: 'Đồ ăn vặt',
    description: 'Tôm tươi chiên giòn rụm, chấm kèm sốt tartar.',
    image: 'https://images.unsplash.com/photo-1626082927389-6cdcd6be9bdc?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'sushi',
    name: 'Combo Sushi',
    price: 129000,
    rating: 4.9,
    votes: 341,
    category: 'Món khô',
    description: 'Sashimi cá hồi, nigiri và maki cuộn tinh tế.',
    image: 'https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'dessert',
    name: 'Bánh Mousse Chanh Dây',
    price: 45000,
    rating: 4.7,
    votes: 165,
    category: 'Đồ ngọt',
    description: 'Lớp mousse mềm mịn với mùi thơm đặc trưng của chanh dây.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bun-bo-hue',
    name: 'Bún bò Huế',
    price: 55000,
    rating: 4.8,
    votes: 256,
    category: 'Món nước',
    description: 'Bún bò Huế cay nồng, nước dùng đậm đà chuẩn vị miền Trung.',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'banh-canh-cua',
    name: 'Bánh canh cua',
    price: 60000,
    rating: 4.7,
    votes: 188,
    category: 'Món nước',
    description: 'Sợi bánh canh dai, thịt cua tươi và chả hấp thơm.',
    image: 'https://images.unsplash.com/photo-1604908177660-3c61c1598c41?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'bo-luc-lac',
    name: 'Bò lúc lắc',
    price: 89000,
    rating: 4.8,
    votes: 205,
    category: 'Món khô',
    description: 'Bò lúc lắc sốt bơ tỏi, ăn kèm khoai tây và salad.',
    image: 'https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'goi-cuon',
    name: 'Gỏi cuốn tôm thịt',
    price: 30000,
    rating: 4.6,
    votes: 176,
    category: 'Đồ ăn vặt',
    description: 'Bánh tráng cuốn tôm thịt, rau sống và bún, chấm mắm nêm.',
    image: 'https://images.unsplash.com/photo-1585238342036-1a295c5c11f6?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'che-khuc-bach',
    name: 'Chè khúc bạch',
    price: 35000,
    rating: 4.7,
    votes: 142,
    category: 'Đồ ngọt',
    description: 'Thạch khúc bạch, hạnh nhân rang và trái vải mát lạnh.',
    image: 'https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tra-dao',
    name: 'Trà đào cam sả',
    price: 42000,
    rating: 4.8,
    votes: 230,
    category: 'Thức uống',
    description: 'Trà đào tươi, cam vàng và sả thơm mát lạnh.',
    image: 'https://images.unsplash.com/photo-1510626176961-4b37d0b4e904?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'tra-sua',
    name: 'Trà sữa Okinawa',
    price: 49000,
    rating: 4.7,
    votes: 310,
    category: 'Thức uống',
    description: 'Trà sữa Okinawa ngọt dịu, kem cheese và trân châu hoàng kim.',
    image: 'https://images.unsplash.com/photo-1510626176961-4b37d0b4e904?auto=format&fit=crop&w=800&q=80',
  },
].map((item) => ({ ...item, category: normalizeCategory(item.category) }))

export const featured: FoodItem[] = allFoods.slice(0, 6)
export const popular: FoodItem[] = allFoods.slice(6)

export const categories = [
  'Fast Food',
  'Đồ ăn vặt',
  'Đồ ngọt',
  'Món nước',
  'Món khô',
  'Thức uống',
]
