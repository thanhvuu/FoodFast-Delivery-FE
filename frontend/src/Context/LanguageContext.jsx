/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import dataset from '../assets/dtb.json'

const normalizeTrackingOrder = order => ({
  ...order,
  route: Array.isArray(order?.route) ? order.route : [],
})

const trackingOrders = (dataset?.orders ?? []).map(normalizeTrackingOrder)


const translationData = {
  vi: {
    languageName: 'Tiếng Việt',
    common: {
      currencyLocale: 'vi-VN',
      addItemToCart: 'Thêm {{item}} vào giỏ',
      decreaseItem: 'Giảm {{item}}',
      increaseItem: 'Tăng {{item}}',
      remove: 'Xóa',
      free: 'Miễn phí',
    },
    navbar: {
      logoAria: 'Về trang chủ FoodFast',
      logoAlt: 'FoodFast logo',
      home: 'Trang chủ',
      menu: 'Thực đơn',
      mobileApp: 'Mobile-app',
      contact: 'Liên hệ',
      orderTracking: 'Theo dõi đơn',
      searchAria: 'Tìm kiếm',
      cartAria: 'Xem giỏ hàng',
      cartAlt: 'Giỏ hàng',
      loginCta: 'Đăng nhập',
      signInCta: 'Đăng nhập',
      signOutCta: 'Đăng xuất',
      navAria: 'Điều hướng chính',
    },
    header: {
      title: 'Đặt món ăn yêu thích của bạn tại đây',
      description:
        'Đầu bếp sẽ đảm nhiệm mọi công đoạn chuẩn bị, như thái nhỏ và ướp, để bạn có thể nấu một bữa ăn tươi ngon chỉ trong 15 phút.',
      cta: 'Xem thực đơn',
    },
    exploreMenu: {
      title: 'Khám phá thực đơn của chúng tôi',
      description: 'Chạm để lọc nhanh các món ăn theo sở thích và khám phá những lựa chọn hấp dẫn mỗi ngày.',
      categories: {
        'Fast Food': 'Fast Food',
        'Đồ ăn vặt': 'Đồ ăn vặt',
        'Đồ ngọt': 'Đồ ngọt',
        'Món nước': 'Món nước',
        'Món khô': 'Món khô',
        'Thức uống': 'Thức uống',
      },
    },
    foodDisplay: {
      title: 'Những món ăn gần bạn',
      sort: {
        label: 'Sắp xếp theo',
        default: 'Mặc định',
        lowToHigh: 'Giá thấp đến cao',
        highToLow: 'Giá cao đến thấp',
      },
      pagination: {
        label: 'Phân trang món ăn',
        previous: 'Trang trước',
        next: 'Trang sau',
        page: 'Trang',
      },
      empty: 'Chưa có món nào trong danh mục này.',
    },
    footer: {
      description:
        'FoodFast Delivery mang đến cho bạn trải nghiệm giao đồ ăn nhanh chóng, tiện lợi và an toàn. Chúng tôi hợp tác với những đầu bếp địa phương để phục vụ các món ăn yêu thích mọi lúc bạn cần.',
      quickLinksTitle: 'Liên kết nhanh',
      quickLinks: [
        { href: '#explore-menu', label: 'Khám phá menu' },
        { href: '#food-display', label: 'Món ăn nổi bật' },
        { href: '/cart', label: 'Giỏ hàng của bạn' },
      ],
      contactTitle: 'Liên hệ',
      contactItems: [
        'Hotline: 1111111111',
        'Email: support@foodfast.vn',
        'Địa chỉ: 273 An Dương Vương, Phường Chợ Quán, Hồ Chí Minh',
      ],
      languageLabel: 'Ngôn ngữ',
      notice: '© {{year}} FoodFast Delivery. Tất cả các quyền được bảo lưu.',
    },
    menuPage: {
      eyebrow: 'Thực đơn mỗi ngày',
      title: 'Đặt món yêu thích chỉ trong vài chạm',
      description:
        'Khám phá hàng chục món ăn nổi bật của FoodFast và lọc theo thể loại bạn thích. Tất cả đều được chuẩn bị tươi ngon và giao đến tận nơi.',
    },
    contactPage: {
      eyebrow: 'Liên hệ FoodFast',
      title: 'Chúng tôi luôn sẵn sàng hỗ trợ bạn',
      description:
        'Có thắc mắc về đơn hàng, góp ý về chất lượng hay muốn hợp tác cùng FoodFast? Hãy gửi tin nhắn cho chúng tôi, đội ngũ chăm sóc khách hàng sẽ phản hồi trong vòng 24 giờ.',
      infoTitle: 'Thông tin liên hệ',
      details: [
        { label: 'Hotline', value: '111111111', href: 'tel:111111111' },
        { label: 'Email', value: 'dangthanhvu19124@gmail.com', href: 'mailto:dangthanhvu19124@gmail.com' },
        { label: 'Địa chỉ', value: '273 An Dương Vương, Phường Chợ Quán, Hồ Chí Minh' },
        { label: 'Giờ làm việc', value: '08:00 - 22:00 (Thứ 2 - Chủ nhật)' },
      ],
      formTitle: 'Gửi tin nhắn cho chúng tôi',
      formNameLabel: 'Họ và tên',
      formNamePlaceholder: 'Nguyễn Văn A',
      formEmailLabel: 'Email',
      formEmailPlaceholder: 'ban@example.com',
      formMessageLabel: 'Nội dung',
      formMessagePlaceholder: 'Mô tả yêu cầu của bạn...',
      formSubmit: 'Gửi yêu cầu',
      mapTitle: 'Vị trí FoodFast',
    },
    cart: {
      title: 'Giỏ hàng của bạn',
      emptyMessage: 'Giỏ hàng đang trống. Hãy thêm vài món ngon để bắt đầu nhé!',
      emptyCta: 'Khám phá thực đơn',
      tableHeaders: {
        item: 'Món ăn',
        price: 'Đơn giá',
        quantity: 'Số lượng',
        subtotal: 'Thành tiền',
        actions: 'Thao tác',
      },
      summaryTitle: 'Tổng kết đơn hàng',
      subtotal: 'Tạm tính',
      deliveryFee: 'Phí giao hàng',
      total: 'Tổng cộng',
      checkoutCta: 'Tiến hành đặt hàng',
      removeItem: 'Xóa',
    },
    trackingPage: {
      title: 'Theo dõi đơn hàng theo thời gian thực',
      description:
        'Giữ liên lạc với khách hàng và đội vận hành bằng bản đồ trực quan theo dõi cả chuyến bay drone lẫn tài xế xe máy.',
      selectorLabel: 'Chọn đơn hàng',
      timelineTitle: 'Lộ trình giao hàng',
      legend: {
        updated: 'Tọa độ cập nhật lúc {{time}}',
        drone: 'Drone #{{code}}',
        motorbike: 'Xe máy #{{code}}',
      },
      methods: {
        drone: {
          label: 'Giao bằng drone',
          etaShort: '10 - 15 phút',
          description: 'Bay thẳng, tránh kẹt xe và cập nhật liên tục.',
        },
        motorbike: {
          label: 'Giao xe máy',
          etaShort: '25 - 35 phút',
          description: 'Phù hợp khu vực cấm bay, linh hoạt theo tuyến đường.',
        },
      },
      loginRequiredTitle: 'Cần đăng nhập',
      loginRequiredDescription:
        'Vui lòng đăng nhập để theo dõi đơn hàng của bạn. Hệ thống chỉ hiển thị các chuyến bay thuộc tài khoản hiện tại.',
      noOrdersTitle: 'Chưa có đơn để theo dõi',
      noOrdersDescription:
        'Chúng tôi chưa tìm thấy đơn hàng nào thuộc tài khoản của bạn. Hãy đặt món và quay lại trang này sau nhé!',
      mapUnavailable:
        'Không thể tải bản đồ giao hàng. Vui lòng kiểm tra khóa API VITE_ORS_API_KEY hoặc kết nối mạng.',
      summaryLabels: {
        customer: 'Khách hàng',
        address: 'Địa chỉ giao',
        status: 'Trạng thái đơn',
        payment: 'Thanh toán',
        deliveryMethod: 'Hình thức giao',
        estimatedArrival: 'Dự kiến giao',
        deliveryProgress: 'Tiến độ giao hàng',
        lastUpdate: 'Cập nhật cuối',
        delivered: 'Đã giao',
        inTransit: 'Đang giao',
        paid: 'Đã thanh toán',
        unpaid: 'Chưa thanh toán',
        progressSuffix: '% hoàn thành',
      },
      orders: trackingOrders,
    },
  },
  en: {
    languageName: 'English',
    common: {
      currencyLocale: 'en-US',
      addItemToCart: 'Add {{item}} to cart',
      decreaseItem: 'Decrease {{item}}',
      increaseItem: 'Increase {{item}}',
      remove: 'Remove',
      free: 'Free',
    },
    navbar: {
      logoAria: 'Go to FoodFast home',
      logoAlt: 'FoodFast logo',
      home: 'Home',
      menu: 'Menu',
      mobileApp: 'Mobile app',
      contact: 'Contact',
      orderTracking: 'Order tracking',
      searchAria: 'Search',
      cartAria: 'View cart',
      cartAlt: 'Cart',
      loginCta: 'Sign in',
      signInCta: 'Sign in',
      signOutCta: 'Sign out',
      navAria: 'Main navigation',
    },
    header: {
      title: 'Order your favourite dishes right here',
      description:
        'Our chefs handle all the prep work, from slicing to marinating, so you can cook a fresh meal in just 15 minutes.',
      cta: 'View menu',
    },
    exploreMenu: {
      title: 'Explore our menu',
      description: 'Tap to quickly filter dishes by your taste and discover exciting picks every day.',
      categories: {
        'Fast Food': 'Fast Food',
        'Đồ ăn vặt': 'Snacks',
        'Đồ ngọt': 'Desserts',
        'Món nước': 'Soups & noodles',
        'Món khô': 'Dry dishes',
        'Thức uống': 'Beverages',
      },
    },
    foodDisplay: {
      title: 'Popular dishes near you',
      sort: {
        label: 'Sort by',
        default: 'Default',
        lowToHigh: 'Price: Low to High',
        highToLow: 'Price: High to Low',
      },
      pagination: {
        label: 'Food pagination',
        previous: 'Previous',
        next: 'Next',
        page: 'Page',
      },
      empty: 'No dishes found in this category.',
    },
    footer: {
      description:
        'FoodFast Delivery brings you a fast, convenient and safe food delivery experience. We partner with local chefs to serve your favourite dishes whenever you need them.',
      quickLinksTitle: 'Quick links',
      quickLinks: [
        { href: '#explore-menu', label: 'Explore menu' },
        { href: '#food-display', label: 'Featured dishes' },
        { href: '/cart', label: 'Your cart' },
      ],
      contactTitle: 'Contact',
      contactItems: [
        'Hotline: 1111111111',
        'Email: support@foodfast.vn',
        'Address: 273 An Dương Vương, Ward Chợ Quán, Ho Chi Minh City',
      ],
      languageLabel: 'Language',
      notice: '© {{year}} FoodFast Delivery. All rights reserved.',
    },
    menuPage: {
      eyebrow: 'Daily menu',
      title: 'Order your favourites in just a few taps',
      description:
        'Discover dozens of FoodFast signature dishes and filter by your favourite categories. Everything is freshly prepared and delivered to your door.',
    },
    contactPage: {
      eyebrow: 'Contact FoodFast',
      title: 'We are always here to help',
      description:
        'Questions about an order, feedback on quality or partnership ideas? Send us a message and our support team will get back within 24 hours.',
      infoTitle: 'Get in touch',
      details: [
        { label: 'Hotline', value: '111111111', href: 'tel:111111111' },
        { label: 'Email', value: 'dangthanhvu19124@gmail.com', href: 'mailto:dangthanhvu19124@gmail.com' },
        { label: 'Address', value: '273 An Dương Vương, Ward Chợ Quán, Ho Chi Minh City' },
        { label: 'Opening hours', value: '08:00 - 22:00 (Monday - Sunday)' },
      ],
      formTitle: 'Send us a message',
      formNameLabel: 'Full name',
      formNamePlaceholder: 'John Nguyen',
      formEmailLabel: 'Email',
      formEmailPlaceholder: 'you@example.com',
      formMessageLabel: 'Message',
      formMessagePlaceholder: 'Let us know how we can help...',
      formSubmit: 'Submit request',
      mapTitle: 'FoodFast location',
    },
    cart: {
      title: 'Your cart',
      emptyMessage: 'Your cart is empty. Add something tasty to get started!',
      emptyCta: 'Browse menu',
      tableHeaders: {
        item: 'Item',
        price: 'Price',
        quantity: 'Quantity',
        subtotal: 'Subtotal',
        actions: 'Actions',
      },
      summaryTitle: 'Order summary',
      subtotal: 'Subtotal',
      deliveryFee: 'Delivery fee',
      total: 'Total',
      checkoutCta: 'Proceed to checkout',
      removeItem: 'Remove',
    },
    trackingPage: {
      title: 'Track your delivery in real time',
      description:
        'Stay in sync with customers and ops through a live map that shows both drone flights and motorbike couriers.',
      selectorLabel: 'Select an order',
      timelineTitle: 'Delivery milestones',
      legend: {
        updated: 'Location updated at {{time}}',
        drone: 'Drone #{{code}}',
        motorbike: 'Rider #{{code}}',
      },
      methods: {
        drone: {
          label: 'Drone delivery',
          etaShort: '10 - 15 mins',
          description: 'Flies direct above traffic with minute-by-minute updates.',
        },
        motorbike: {
          label: 'Motorbike courier',
          etaShort: '25 - 35 mins',
          description: 'Ideal for no-fly zones and flexible neighbourhood routes.',
        },
      },
      loginRequiredTitle: 'Sign-in required',
      loginRequiredDescription:
        'Log in to follow along with your delivery. Only orders belonging to the active account are displayed.',
      noOrdersTitle: 'No deliveries to track yet',
      noOrdersDescription:
        'We could not find any orders linked to your account. Place an order and come back to watch the drone fly!',
      mapUnavailable:
        'Unable to load the delivery map. Confirm the VITE_ORS_API_KEY environment variable or your connection.',
      summaryLabels: {
        customer: 'Customer',
        address: 'Delivery address',
        status: 'Order status',
        payment: 'Payment',
        deliveryMethod: 'Delivery method',
        estimatedArrival: 'Estimated arrival',
        deliveryProgress: 'Delivery progress',
        lastUpdate: 'Last update',
        delivered: 'Delivered',
        inTransit: 'In transit',
        paid: 'Paid',
        unpaid: 'Unpaid',
        progressSuffix: '% complete',
      },
      orders: trackingOrders,
    },
  },
}

const languageOptions = Object.fromEntries(
  Object.entries(translationData).map(([code, content]) => [code, content.languageName]),
)

export const LanguageContext = createContext({
  language: 'vi',
  setLanguage: () => {},
  dictionary: translationData.vi,
  languageOptions,
})

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('foodfast-language')
    if (stored && translationData[stored]) {
      return stored
    }
  }
  return 'vi'
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('foodfast-language', language)
    }
  }, [language])

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dictionary: translationData[language],
      languageOptions,
    }),
    [language],
  )

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>
}

export const useLanguage = () => useContext(LanguageContext)
