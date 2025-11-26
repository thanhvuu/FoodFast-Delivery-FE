// Dữ liệu đồng bộ với web superadmin (restaurants trong managementData)
export const restaurants = [
  {
    id: 'r-1',
    name: 'The Pizza Hub',
    owner: 'Trần Quốc Bảo',
    city: 'Hà Nội',
    status: 'pending',
    statusLabel: 'Chờ duyệt',
    rating: '—',
  },
  {
    id: 'r-2',
    name: 'Bếp Nhà Xanh',
    owner: 'Nguyễn Thị Kim',
    city: 'TP.HCM',
    status: 'active',
    statusLabel: 'Đang hoạt động',
    rating: '4,8 ★',
  },
  {
    id: 'r-3',
    name: 'Sushi Corner',
    owner: 'F&B Kanto',
    city: 'Đà Nẵng',
    status: 'review',
    statusLabel: 'Đang xem xét',
    rating: '4,4 ★',
  },
  {
    id: 'r-4',
    name: 'Hi Five Coffee',
    owner: 'Lê Đăng Khôi',
    city: 'Cần Thơ',
    status: 'suspended',
    statusLabel: 'Bị khoá',
    rating: '—',
  },
];

export type RestaurantItem = (typeof restaurants)[number];
