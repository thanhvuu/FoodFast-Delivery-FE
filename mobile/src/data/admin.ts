// Dữ liệu đồng bộ với web superadmin (restaurants trong managementData)
export const restaurants = [
  {
    id: 'r-1',
    name: 'The Pizza Hub',
    owner: 'Trần Quốc Bảo',
    city: 'Hà Nội',
    status: 'pending',
    statusKey: 'pending',
    statusLabel: 'Chờ duyệt',
    rating: '—',
    openingHours: {
      open: '08:00',
      close: '22:00',
    },
  },
  {
    id: 'r-2',
    name: 'Bếp Nhà Xanh',
    owner: 'Nguyễn Thị Kim',
    city: 'TP.HCM',
    status: 'active',
    statusKey: 'active',
    statusLabel: 'Đang hoạt động',
    rating: '4,8 ★',
    openingHours: {
      open: '07:00',
      close: '21:30',
    },
  },
  {
    id: 'r-3',
    name: 'Sushi Corner',
    owner: 'F&B Kanto',
    city: 'Đà Nẵng',
    status: 'review',
    statusKey: 'review',
    statusLabel: 'Đang xem xét',
    rating: '4,4 ★',
    openingHours: {
      open: '10:00',
      close: '21:00',
    },
  },
  {
    id: 'r-4',
    name: 'Hi Five Coffee',
    owner: 'Lê Đăng Khôi',
    city: 'Cần Thơ',
    status: 'suspended',
    statusKey: 'suspended',
    statusLabel: 'Bị khoá',
    rating: '—',
    openingHours: {
      open: '08:00',
      close: '17:00',
    },
  },
];

export type RestaurantItem = (typeof restaurants)[number];
