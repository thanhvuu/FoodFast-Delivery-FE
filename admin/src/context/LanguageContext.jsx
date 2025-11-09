import { createContext, useContext, useEffect, useMemo, useState } from 'react'

const translations = {
  vi: {
    languageName: 'Tiếng Việt',
    common: {
      currencyLocale: 'vi-VN',
      currencySuffix: ' đ',
      confirmDeleteProduct: 'Bạn muốn xoá sản phẩm này?',
    },
    navbar: {
      languageLabel: 'Ngôn ngữ',
    },
    sidebar: {
      add: 'Thêm món mới',
      list: 'Danh sách món',
      orders: 'Đơn hàng',
      tracking: 'Theo dõi drone',
    },
    addPage: {
      uploadLabel: 'Tải ảnh',
      nameLabel: 'Tên món',
      namePlaceholder: 'Nhập tên món',
      descriptionLabel: 'Mô tả món ăn',
      descriptionPlaceholder: 'Mô tả ngắn về món...',
      categoryLabel: 'Danh mục',
      categories: [
        { value: 'Salad', label: 'Salad' },
        { value: 'Rolls', label: 'Cuốn' },
        { value: 'Deserts', label: 'Tráng miệng' },
        { value: 'Sandwich', label: 'Sandwich' },
        { value: 'Cake', label: 'Bánh ngọt' },
        { value: 'Pure Veg', label: 'Chay' },
        { value: 'Pasta', label: 'Mì Ý' },
        { value: 'Noodles', label: 'Mì' },
      ],
      priceLabel: 'Giá món',
      pricePlaceholder: '20.000',
      submit: 'Thêm món',
    },
    listPage: {
      title: 'Danh sách sản phẩm',
      columns: {
        image: 'Ảnh',
        name: 'Tên',
        description: 'Mô tả',
        category: 'Danh mục',
        price: 'Giá',
        restaurant: 'Địa chỉ / Quán',
        actions: '',
      },
      edit: 'Sửa',
      delete: 'Xoá',
      confirmDelete: 'Bạn muốn xoá sản phẩm này?',
    },
    ordersPage: {
      title: 'Danh sách đơn hàng',
      columns: {
        customer: 'Khách hàng',
        items: 'Sản phẩm',
        address: 'Địa chỉ',
        status: 'Trạng thái giao',
        payment: 'Thanh toán',
        total: 'Thành tiền',
        actions: 'Điều chỉnh',
      },
      statuses: {
        delivered: 'Đã giao',
        pending: 'Chưa giao',
      },
      payment: {
        paid: 'Đã thanh toán',
        unpaid: 'Chưa thanh toán',
      },
      buttons: {
        toggleStatus: 'Đổi trạng thái giao',
        togglePayment: 'Đổi thanh toán',
      },
    },
    trackingPage: {
      headerTitle: 'Theo dõi drone giao hàng',
      headerDescription:
        'Giám sát trạng thái thực tế của các đơn hàng được giao bằng drone. Dữ liệu được cập nhật tự động vài giây một lần.',
      selectorLabel: 'Chọn đơn hàng',
      summaryLabels: {
        customer: 'Khách hàng',
        address: 'Địa chỉ giao',
        status: 'Trạng thái',
        payment: 'Thanh toán',
        flightProgress: 'Tiến độ chuyến bay',
        lastUpdate: 'Cập nhật cuối',
        delivered: 'Đã giao',
        inTransit: 'Đang giao',
        paid: 'Đã thanh toán',
        unpaid: 'Chưa thanh toán',
        progressSuffix: '% hoàn thành',
      },
      legendPrefix: 'Drone #',
      legendUpdated: 'Tọa độ hiện tại cập nhật lúc {{time}}',
      timelineTitle: 'Lộ trình chuyến bay',
      empty: 'Không tìm thấy thông tin đơn hàng.',
    },
    foodEdit: {
      title: 'Chỉnh sửa món: {{name}}',
      fields: {
        name: 'Tên món',
        price: 'Giá',
        category: 'Danh mục',
        description: 'Mô tả',
        ingredients: 'Thành phần (cách nhau bởi dấu phẩy)',
        address: 'Địa chỉ',
      },
      actions: {
        save: 'Lưu thay đổi',
        close: 'Đóng',
      },
    },
  },
  en: {
    languageName: 'English',
    common: {
      currencyLocale: 'en-US',
      currencySuffix: ' ₫',
      confirmDeleteProduct: 'Do you want to delete this product?',
    },
    navbar: {
      languageLabel: 'Language',
    },
    sidebar: {
      add: 'Add new item',
      list: 'List items',
      orders: 'Orders',
      tracking: 'Drone tracking',
    },
    addPage: {
      uploadLabel: 'Upload image',
      nameLabel: 'Product name',
      namePlaceholder: 'Type name here',
      descriptionLabel: 'Product description',
      descriptionPlaceholder: 'Write a short description...',
      categoryLabel: 'Product category',
      categories: [
        { value: 'Salad', label: 'Salad' },
        { value: 'Rolls', label: 'Rolls' },
        { value: 'Deserts', label: 'Desserts' },
        { value: 'Sandwich', label: 'Sandwich' },
        { value: 'Cake', label: 'Cake' },
        { value: 'Pure Veg', label: 'Pure Veg' },
        { value: 'Pasta', label: 'Pasta' },
        { value: 'Noodles', label: 'Noodles' },
      ],
      priceLabel: 'Product price',
      pricePlaceholder: '20,000',
      submit: 'Add product',
    },
    listPage: {
      title: 'Product list',
      columns: {
        image: 'Image',
        name: 'Name',
        description: 'Description',
        category: 'Category',
        price: 'Price',
        restaurant: 'Restaurant / Address',
        actions: '',
      },
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Do you want to delete this product?',
    },
    ordersPage: {
      title: 'Order list',
      columns: {
        customer: 'Customer',
        items: 'Items',
        address: 'Address',
        status: 'Delivery status',
        payment: 'Payment',
        total: 'Total',
        actions: 'Actions',
      },
      statuses: {
        delivered: 'Delivered',
        pending: 'Pending',
      },
      payment: {
        paid: 'Paid',
        unpaid: 'Unpaid',
      },
      buttons: {
        toggleStatus: 'Toggle delivery status',
        togglePayment: 'Toggle payment',
      },
    },
    trackingPage: {
      headerTitle: 'Monitor drone deliveries',
      headerDescription:
        'Follow live delivery progress for every drone order. Status updates refresh automatically every few seconds.',
      selectorLabel: 'Select order',
      summaryLabels: {
        customer: 'Customer',
        address: 'Delivery address',
        status: 'Status',
        payment: 'Payment',
        flightProgress: 'Flight progress',
        lastUpdate: 'Last update',
        delivered: 'Delivered',
        inTransit: 'In transit',
        paid: 'Paid',
        unpaid: 'Unpaid',
        progressSuffix: '% complete',
      },
      legendPrefix: 'Drone #',
      legendUpdated: 'Current co-ordinates updated at {{time}}',
      timelineTitle: 'Flight route',
      empty: 'Order information not available.',
    },
    foodEdit: {
      title: 'Edit dish: {{name}}',
      fields: {
        name: 'Name',
        price: 'Price',
        category: 'Category',
        description: 'Description',
        ingredients: 'Ingredients (comma separated)',
        address: 'Address',
      },
      actions: {
        save: 'Save changes',
        close: 'Close',
      },
    },
  },
}

const languageOptions = Object.fromEntries(
  Object.entries(translations).map(([code, value]) => [code, value.languageName])
)

const AdminLanguageContext = createContext({
  language: 'vi',
  setLanguage: () => {},
  dictionary: translations.vi,
  formatCurrency: value => value,
  languageOptions,
})

const getInitialLanguage = () => {
  if (typeof window !== 'undefined') {
    const stored = window.localStorage.getItem('foodfast-admin-language')
    if (stored && translations[stored]) {
      return stored
    }
  }
  return 'vi'
}

export const AdminLanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(getInitialLanguage)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('foodfast-admin-language', language)
    }
  }, [language])

  const formatter = useMemo(
    () => new Intl.NumberFormat(translations[language].common.currencyLocale),
    [language]
  )

  const formatCurrency = useMemo(
    () => value => `${formatter.format(value)}${translations[language].common.currencySuffix}`,
    [formatter, language]
  )

  const value = useMemo(
    () => ({
      language,
      setLanguage,
      dictionary: translations[language],
      formatCurrency,
      languageOptions,
    }),
    [language, formatCurrency]
  )

  return <AdminLanguageContext.Provider value={value}>{children}</AdminLanguageContext.Provider>
}

export const useAdminLanguage = () => useContext(AdminLanguageContext)
