import { createContext, useContext, useEffect, useMemo, useState } from 'react'

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
      searchAria: 'Tìm kiếm',
      cartAria: 'Xem giỏ hàng',
      cartAlt: 'Giỏ hàng',
      loginCta: 'Đăng Nhập',
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
    foodItems: {
      '1': { name: 'Gà rán', description: 'Gà rán giòn rụm, thơm ngon' },
      '2': { name: 'Hamburger', description: 'Hamburger bò Mỹ, phô mai cheddar' },
      '3': { name: 'Pizza', description: 'Pizza hải sản, phô mai mozzarella' },
      '4': { name: 'Tacos', description: 'Tacos thịt bò, rau củ tươi ngon' },
      '5': { name: 'Phở bò', description: 'Phở bò tái, nước dùng đậm đà' },
      '6': { name: 'Mỳ Ý', description: 'Mỳ Ý sốt bò bằm, phô mai Parmesan' },
      '7': { name: 'Khoai tây chiên', description: 'Khoai tây chiên giòn rụm, muối tiêu' },
      '8': { name: 'Kem ốc quế', description: 'Kem ốc quế vani, socola' },
      '9': { name: 'Gà viên', description: 'Gà viên chiên giòn, sốt mayonnaise' },
      '10': { name: 'Bún bò Huế', description: 'Bún bò Huế cay nồng, đậm đà hương vị' },
      '11': { name: 'Cơm chiên Dương Châu', description: 'Cơm chiên Dương Châu thập cẩm, trứng, rau củ' },
      '12': { name: 'Panna Cotta', description: 'Panna Cotta kem tươi, sốt dâu tây' },
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
      searchAria: 'Search',
      cartAria: 'View cart',
      cartAlt: 'Cart',
      loginCta: 'Sign in',
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
    foodItems: {
      '1': { name: 'Fried chicken', description: 'Crispy, flavourful fried chicken' },
      '2': { name: 'Hamburger', description: 'American beef burger with cheddar cheese' },
      '3': { name: 'Seafood pizza', description: 'Seafood pizza topped with mozzarella' },
      '4': { name: 'Beef tacos', description: 'Beef tacos packed with fresh veggies' },
      '5': { name: 'Beef pho', description: 'Rare beef pho with rich broth' },
      '6': { name: 'Spaghetti bolognese', description: 'Spaghetti with minced beef and parmesan' },
      '7': { name: 'French fries', description: 'Crispy fries with salt and pepper' },
      '8': { name: 'Ice cream cone', description: 'Vanilla and chocolate ice cream cone' },
      '9': { name: 'Chicken bites', description: 'Crispy chicken bites with mayo sauce' },
      '10': { name: 'Hue beef noodle soup', description: 'Spicy Hue-style beef noodle soup' },
      '11': { name: 'Yangzhou fried rice', description: 'Yangzhou fried rice with egg and veggies' },
      '12': { name: 'Panna cotta', description: 'Creamy panna cotta with strawberry sauce' },
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
