export const profileInfo = {
  name: 'Nguyễn Quản Trị',
  email: 'admin@gmail.com',
  phone: '0909000900',
  office: 'FoodFast, Thủ Đức',
}

export const overviewBadges = [
  { label: 'Đơn đã giao', value: '7' },
  { label: 'Đơn đang giao', value: '4' },
  { label: 'Đơn hủy', value: '2' },
]

export const metrics = [
  {
    label: 'Tổng doanh thu',
    value: '12,4 tỷ ₫',
    hint: 'Từ tất cả đối tác trên toàn quốc',
  },
  {
    label: 'Đơn hoàn thành',
    value: '184.230',
    hint: '97,4% trong 30 ngày gần nhất',
  },
  {
    label: 'Đối tác hoạt động',
    value: '512',
    hint: 'Nhà hàng và bếp cloud đang mở bán',
  },
  {
    label: 'Tài xế trực tuyến',
    value: '1.284',
    hint: 'Bao gồm shipper và đội drone',
  },
]

export const userSegments = [
  {
    role: 'Khách hàng',
    description: 'Theo dõi người dùng mới, trạng thái xác minh và báo cáo gian lận.',
    stats: '1,2 triệu tài khoản',
    actions: ['Xem hồ sơ', 'Khoá truy cập', 'Gửi thông báo'],
  },
  {
    role: 'Shipper',
    description: 'Quản lý đăng ký, giấy tờ pháp lý và trạng thái hoạt động.',
    stats: '8.420 tài xế',
    actions: ['Duyệt hồ sơ', 'Phân bổ khu vực', 'Tắt hoạt động'],
  },
  {
    role: 'Merchant',
    description: 'Kiểm soát hợp đồng, thực đơn và chất lượng dịch vụ của nhà hàng.',
    stats: '2.350 đối tác',
    actions: ['Duyệt đăng ký', 'Xem vi phạm', 'Liên hệ CSKH'],
  },
]

export const restaurants = [
  {
    name: 'The Pizza Hub',
    owner: 'Trần Quốc Bảo',
    city: 'Hà Nội',
    status: 'Chờ duyệt',
    statusKey: 'pending',
    rating: '—',
  },
  {
    name: 'Bếp Nhà Xanh',
    owner: 'Nguyễn Thị Kim',
    city: 'TP.HCM',
    status: 'Đang hoạt động',
    statusKey: 'active',
    rating: '4,8 ★',
  },
  {
    name: 'Sushi Corner',
    owner: 'F&B Kanto',
    city: 'Đà Nẵng',
    status: 'Đang xem xét',
    statusKey: 'review',
    rating: '4,4 ★',
  },
  {
    name: 'Hi Five Coffee',
    owner: 'Lê Đăng Khôi',
    city: 'Cần Thơ',
    status: 'Bị khoá',
    statusKey: 'suspended',
    rating: '—',
  },
]

export const orderOversight = [
  {
    id: 'FF-20384',
    customer: 'Mai Quỳnh Anh',
    issue: 'Khiếu nại phí giao cao',
    status: 'Đang xử lý',
    channel: 'Livechat',
  },
  {
    id: 'FF-20365',
    customer: 'Đinh Công Vũ',
    issue: 'Đơn hủy liên tục',
    status: 'Cần can thiệp',
    channel: 'CSKH',
  },
  {
    id: 'FF-20354',
    customer: 'Đỗ Thị Hà',
    issue: 'Nghi ngờ gian lận voucher',
    status: 'Đã khóa tạm',
    channel: 'Email',
  },
]

export const logisticsControls = {
  shipping: {
    title: 'Phí giao hàng',
    items: [
      { label: 'Trung tâm TP', value: '18.000 ₫/đơn', status: 'Ổn định' },
      { label: 'Ngoại thành', value: '26.000 ₫/đơn', status: 'Đang thí điểm' },
      { label: 'Đơn giờ cao điểm', value: '+25%', status: 'Tự động điều chỉnh' },
    ],
  },
  vouchers: {
    title: 'Mã giảm giá',
    items: [
      { label: 'WEEKEND50', value: 'Giảm 50% tối đa 40k', status: 'Sắp hết hạn' },
      { label: 'FREESHIPNEW', value: 'Miễn phí ship đơn đầu', status: 'Đang chạy' },
      { label: 'MERCHANTBOOST', value: 'Giảm 30% cho quán mới', status: 'Chuẩn bị' },
    ],
  },
  areas: {
    title: 'Khu vực hoạt động',
    items: [
      { label: 'Hà Nội', value: '36 quận/huyện', status: 'Mở rộng thêm 2 khu' },
      { label: 'TP.HCM', value: '24 quận/huyện', status: 'Ổn định' },
      { label: 'Đà Nẵng', value: '8 quận/huyện', status: 'Đang khảo sát' },
    ],
  },
}

export const leaderboards = {
  restaurants: [
    { name: 'Bún Chả 34', metric: '12.380 đơn', trend: '+18%' },
    { name: 'Pizza 4P', metric: '11.204 đơn', trend: '+11%' },
    { name: 'Cơm tấm Dì Ba', metric: '9.851 đơn', trend: '+8%' },
  ],
  users: [
    { name: 'Phạm Hoài Nam', metric: '128 đơn/tháng', trend: '+5%' },
    { name: 'Võ Thanh Hà', metric: '121 đơn/tháng', trend: '+12%' },
    { name: 'Nguyễn Lệ Mỹ', metric: '117 đơn/tháng', trend: '+7%' },
  ],
}
