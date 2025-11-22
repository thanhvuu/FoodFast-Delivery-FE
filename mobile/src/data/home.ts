export type ShortcutAction = {
  id: string;
  label: string;
  icon: string;
  background: string;
  color: string;
};

export type RestaurantShowcase = {
  id: string;
  name: string;
  image: string;
  rating: number;
  distance: string;
  badge?: string;
  badgeTone?: string;
  tags: string;
  priceInfo: string;
  highlight?: string;
  foodId?: string;
};

export const shortcuts: ShortcutAction[] = [
  { id: 'hot-deal', label: 'Hot Deal', icon: '🔥', background: '#FFF2E8', color: '#FF7A00' },
  { id: 'quan-ngon', label: 'Quán Ngon', icon: '🍜', background: '#EBF4FF', color: '#1E7FFF' },
  { id: 'tich-diem', label: 'Tích Điểm', icon: '🎁', background: '#FFEFF7', color: '#FF5E8D' },
  { id: 'ngon-xiu', label: 'Ngon Xỉu', icon: '🤤', background: '#F0FFF4', color: '#26C281' },
  { id: 'bua-trua', label: 'Bữa Trưa', icon: '🍱', background: '#FFF8E1', color: '#F59E0B' },
  { id: 'snack-ngon', label: 'Snack Ngon', icon: '🍟', background: '#F5F3FF', color: '#8B5CF6' },
  { id: 'giam-50k', label: 'Giảm 50k', icon: '💸', background: '#EAF8FF', color: '#0EA5E9' },
  { id: '99k-off', label: '99k Off', icon: '🎉', background: '#FFF0F4', color: '#F43F5E' },
  { id: 'no-bung', label: 'No Bụng', icon: '🍚', background: '#ECFDF3', color: '#22C55E' },
];

export const discoveryFilters = ['Bữa trưa', 'Snack ngon', 'Món ăn Hà Nội', 'Giao cực nhanh'];

export const topRatedRestaurants: RestaurantShowcase[] = [
  {
    id: 'banh-thuy',
    name: 'Bánh Thủy',
    image: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    distance: '750m',
    badge: 'Flash Sale',
    badgeTone: '#FF6B35',
    tags: 'Bún riêu - Bún - Phở',
    priceInfo: 'Giảm 30%',
    highlight: 'Món chỉ từ 19k',
    foodId: 'pasta',
  },
  {
    id: 'banh-cuon-phu-ly',
    name: 'Bánh cuốn Phủ Lý',
    image: 'https://images.unsplash.com/photo-1604908177461-9f4b7fe1c95b?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    distance: '600m',
    badge: 'Flash Sale',
    badgeTone: '#FF6B35',
    tags: 'Đồ ăn gia đình',
    priceInfo: 'Giao chỉ 14k',
    highlight: 'Ưu đãi đồng giá',
    foodId: 'salad',
  },
  {
    id: 'bonchon-chicken',
    name: 'Bonchon Chicken',
    image: 'https://images.unsplash.com/photo-1604908176903-a34d884e3be1?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    distance: '670m',
    badge: 'Flash Sale',
    badgeTone: '#FF6B35',
    tags: 'Gà rán - Mì Ý - Cơm',
    priceInfo: 'Món chỉ từ 19k',
    highlight: 'Khai trương giảm 40%',
    foodId: 'chicken',
  },
];

export const newRestaurants: RestaurantShowcase[] = [
  {
    id: 'banh-trang-kep',
    name: 'Bánh Tráng Kẹp Đà Nẵng',
    image: 'https://images.unsplash.com/photo-1608032846855-44f1abb9795e?auto=format&fit=crop&w=800&q=80',
    rating: 4.8,
    distance: '520m',
    badge: 'Mới',
    badgeTone: '#1E7FFF',
    tags: 'Ăn vặt - Đồ ăn nhanh',
    priceInfo: 'Giảm 15%',
    highlight: 'Giao cực nhanh',
    foodId: 'taco',
  },
  {
    id: 'pho-ha-noi',
    name: 'Phở Hà Nội Xưa',
    image: 'https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80',
    rating: 4.7,
    distance: '910m',
    badge: 'Mới',
    badgeTone: '#1E7FFF',
    tags: 'Phở - Bún - Miến',
    priceInfo: 'Tặng topping',
    highlight: 'Chỉ từ 25k',
    foodId: 'pizza',
  },
  {
    id: 'com-tam-sai-gon',
    name: 'Cơm Tấm Sài Gòn 123',
    image: 'https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80',
    rating: 4.9,
    distance: '1.2km',
    badge: 'Mới',
    badgeTone: '#1E7FFF',
    tags: 'Cơm - Sườn - Đặc sản',
    priceInfo: 'Freeship 3km',
    highlight: 'Suất lớn no bụng',
    foodId: 'sushi',
  },
];
