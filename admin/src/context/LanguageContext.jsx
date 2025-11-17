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
      title: 'FoodFast Admin',
      subtitle: 'Điều hành chi nhánh của bạn',
      description: 'Giám sát đơn hàng, cập nhật thực đơn và theo dõi vận hành trong cùng một bảng điều khiển.',
      languageCardTitle: 'Giao diện hiển thị',
      languageLabel: 'Ngôn ngữ',
      languageHint: 'Chọn ngôn ngữ để đồng bộ với đội vận hành.',
    },
    sidebar: {
      dashboard: 'Tổng quan',
      add: 'Thêm món mới',
      list: 'Danh sách món',
      orders: 'Đơn hàng',
      restaurant: 'Thông tin quán',
      tracking: 'Theo dõi drone',
    },
    sidebarDescriptions: {
      dashboard: 'Xem hiệu suất tổng thể',
      add: 'Đăng món mới lên menu',
      list: 'Quản lý món đang bán',
      orders: 'Điều phối đơn giao',
      restaurant: 'Cập nhật thông tin quán',
      tracking: 'Theo dõi hành trình giao',
    },
    sidebarMeta: {
      brand: 'FoodFast',
      subtitle: 'Admin Control',
      version: 'Phiên bản 1.0.0',
      copyright: '© FoodFast 2025',
    },
    dashboardPage: {
      title: 'Bảng điều khiển FoodFast',
      subtitle: 'Theo dõi nhanh hiệu suất giao hàng và món bán chạy trong ngày.',
      metrics: {
        totalProducts: 'Số món đang bán',
        totalProductsHint: 'Các món có sẵn trên hệ thống.',
        activeOrders: 'Đơn đang xử lý',
        activeOrdersHint: 'Đơn chưa hoàn tất giao hàng.',
        totalRevenue: 'Doanh thu ước tính',
        totalRevenueHint: 'Bao gồm giá món và phí giao.',
        averageEta: 'Thời gian giao trung bình',
        averageEtaHint: 'Tính trên các đơn có thời gian dự kiến.',
        averageEtaFallback: '—',
        deliveredRate: 'Tỉ lệ giao thành công',
        deliveredRateHint: '{{completed}} / {{total}} đơn đã giao xong.',
        noOrders: 'Chưa có dữ liệu đơn hàng.',
      },
      methodBreakdown: {
        title: 'Hình thức giao hàng',
        description: 'Theo dõi tỷ trọng đơn hàng giữa drone và xe máy.',
        orders: '{{count}} đơn',
        empty: 'Chưa ghi nhận đơn nào.',
        labels: {
          drone: 'Giao bằng drone',
          motorbike: 'Giao xe máy',
          default: 'Khác',
        },
      },
      topProducts: {
        title: 'Món bán chạy',
        description: 'Tổng số phần đã bán trong hôm nay.',
        empty: 'Chưa có dữ liệu bán hàng.',
      },
      recentOrders: {
        title: 'Đơn hàng gần đây',
        description: 'Cập nhật theo thời gian thực từ ứng dụng khách.',
        empty: 'Hiện chưa có đơn hàng nào.',
        headers: {
          code: 'Mã đơn',
          customer: 'Khách hàng',
          method: 'Hình thức',
          status: 'Trạng thái',
          total: 'Giá trị',
        },
      },
      revenueAnalytics: {
        empty: 'Chưa có dữ liệu biểu đồ.',
        daily: {
          title: 'Đơn theo ngày',
          description: 'Số lượng đơn phát sinh trong 7 ngày gần nhất.',
          ordersLabel: 'Số đơn mỗi ngày',
        },
        monthly: {
          title: 'Doanh thu theo tháng',
          description: 'Tổng doanh thu ước tính trong 6 tháng gần nhất.',
          revenueLabel: 'Doanh thu (ước tính)',
        },
      },
      statusInsights: {
        title: 'Tình trạng xử lý đơn',
        description: 'Tỉ lệ đơn mới, đang chế biến và đã hoàn tất.',
        completionLabel: 'Tỷ lệ hoàn tất',
        labels: {
          completed: 'Đã hoàn tất',
          preparing: 'Đang chế biến',
          new: 'Đơn mới',
        },
        countTemplate: '{{count}} đơn · {{percentage}}%',
      },
      customerInsights: {
        title: 'Khách hàng giá trị',
        description: 'Top khách hàng có tổng giá trị đơn cao nhất.',
        empty: 'Chưa có dữ liệu khách hàng.',
      },
      orderVelocity: {
        title: 'Nhịp đơn mỗi ngày',
        description: 'Nhịp độ đơn và doanh thu của 7 ngày gần nhất.',
        ordersLabel: 'Đơn',
        revenueLabel: 'Doanh thu',
        empty: 'Chưa có dữ liệu nhịp đơn.',
      },
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
      statusLabel: 'Trạng thái món',
      statusOptions: [
        { value: 'available', label: 'Đang bán' },
        { value: 'out_of_stock', label: 'Hết món' },
      ],
      submit: 'Thêm món',
      successMessage: 'Đã thêm món mới vào danh sách.',
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
        status: 'Trạng thái',
        actions: '',
      },
      edit: 'Sửa',
      delete: 'Xoá',
      confirmDelete: 'Bạn muốn xoá sản phẩm này?',
      statusLabels: {
        available: 'Đang bán',
        out_of_stock: 'Hết món',
      },
      markOutOfStock: 'Đánh dấu hết món',
      markAvailable: 'Mở bán lại',
    },
    ordersPage: {
      title: 'Danh sách đơn hàng',
      columns: {
        customer: 'Khách hàng',
        items: 'Sản phẩm',
        address: 'Địa chỉ',
        status: 'Trạng thái đơn',
        payment: 'Thanh toán',
        total: 'Thành tiền',
        actions: 'Điều chỉnh',
      },
      statuses: {
        new: 'Đơn mới',
        preparing: 'Đang chế biến',
        completed: 'Hoàn thành',
      },
      payment: {
        paid: 'Đã thanh toán',
        unpaid: 'Chưa thanh toán',
      },
      buttons: {
        advanceStatus: {
          new: 'Xác nhận đơn',
          preparing: 'Hoàn thành đơn',
          completed: 'Đã hoàn thành',
        },
        advanceFallback: 'Cập nhật trạng thái',
        togglePayment: 'Đổi thanh toán',
      },
    },
    restaurantPage: {
      title: 'Quản lý thông tin quán',
      description: 'Cập nhật giờ mở cửa, địa chỉ và phí giao hàng để đồng bộ với ứng dụng khách.',
      fields: {
        name: 'Tên quán',
        address: 'Địa chỉ',
        phone: 'Số điện thoại',
        openingTime: 'Giờ mở cửa',
        closingTime: 'Giờ đóng cửa',
        shippingFee: 'Phí giao mặc định',
        notes: 'Ghi chú nổi bật',
      },
      placeholders: {
        name: 'Ví dụ: FoodFast Quận 5',
        address: '273 An Dương Vương, Quận 5, TP.HCM',
        phone: '0123 456 789',
        notes: 'Ví dụ: Miễn phí nước khi đặt từ 3 món',
      },
      hints: {
        shippingFee: 'Phí giao hiện tại: {{value}}',
      },
      actions: {
        save: 'Lưu thông tin',
      },
      savedMessage: 'Đã lưu thông tin quán',
      lastUpdated: 'Cập nhật lần cuối: {{time}}',
      summary: {
        title: 'Thông tin hiển thị cho khách',
        subtitle: 'Kiểm tra nhanh thông tin sẽ xuất hiện trên ứng dụng đặt món.',
        labels: {
          name: 'Tên quán',
          address: 'Địa chỉ',
          schedule: 'Giờ phục vụ',
          shippingFee: 'Phí giao',
          phone: 'Liên hệ',
          notes: 'Ghi chú',
        },
        scheduleText: 'Mở cửa {{open}} - Đóng cửa {{close}}',
        scheduleFallback: 'Chưa thiết lập giờ phục vụ',
        phoneFallback: 'Chưa cập nhật',
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
        deliveryProgress: 'Tiến độ giao hàng',
        lastUpdate: 'Cập nhật cuối',
        delivered: 'Đã giao',
        inTransit: 'Đang giao',
        paid: 'Đã thanh toán',
        unpaid: 'Chưa thanh toán',
        progressSuffix: '% hoàn thành',
        deliveryMethod: 'Hình thức giao',
        estimatedArrival: 'Dự kiến giao',
        methodNames: {
          drone: 'Drone',
          motorbike: 'Xe máy',
          default: 'Khác',
        },
        statusValues: {
          new: 'Đơn mới',
          preparing: 'Đang chuẩn bị',
          completed: 'Đã hoàn thành',
          default: 'Đang xử lý',
        },
      },
      legendPrefixes: {
        drone: 'Drone #',
        motorbike: 'Xe máy #',
        default: 'Đơn #',
      },
      legendUpdated: 'Tọa độ hiện tại cập nhật lúc {{time}}',
      timelineTitle: 'Lộ trình giao hàng',
      empty: 'Không tìm thấy thông tin đơn hàng.',
    },
    foodEdit: {
      title: 'Chỉnh sửa món: {{name}}',
      fields: {
        name: 'Tên món',
        price: 'Giá',
        category: 'Danh mục',
        status: 'Trạng thái',
        description: 'Mô tả',
        ingredients: 'Thành phần (cách nhau bởi dấu phẩy)',
        address: 'Địa chỉ',
      },
      statusOptions: [
        { value: 'available', label: 'Đang bán' },
        { value: 'out_of_stock', label: 'Hết món' },
      ],
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
      title: 'FoodFast Admin',
      subtitle: 'Operate your kitchen smoothly',
      description: 'Keep an eye on orders, refresh the menu, and monitor deliveries from one control hub.',
      languageCardTitle: 'Interface language',
      languageLabel: 'Language',
      languageHint: 'Switch language to match your operations team.',
    },
    sidebar: {
      dashboard: 'Dashboard',
      add: 'Add new item',
      list: 'List items',
      orders: 'Orders',
      restaurant: 'Restaurant info',
      tracking: 'Drone tracking',
    },
    sidebarDescriptions: {
      dashboard: 'Monitor overall performance',
      add: 'Create new dishes for the menu',
      list: 'Maintain current items',
      orders: 'Coordinate deliveries',
      restaurant: 'Update restaurant details',
      tracking: 'Follow live delivery routes',
    },
    sidebarMeta: {
      brand: 'FoodFast',
      subtitle: 'Admin Control',
      version: 'Version 1.0.0',
      copyright: '© FoodFast 2025',
    },
    dashboardPage: {
      title: 'FoodFast control center',
      subtitle: 'Monitor delivery performance and popular dishes at a glance.',
      metrics: {
        totalProducts: 'Active dishes',
        totalProductsHint: 'Items currently available.',
        activeOrders: 'Orders in progress',
        activeOrdersHint: 'Deliveries still on the way.',
        totalRevenue: 'Estimated revenue',
        totalRevenueHint: 'Includes menu prices and delivery fees.',
        averageEta: 'Average ETA',
        averageEtaHint: 'Calculated from orders with an ETA.',
        averageEtaFallback: '—',
        deliveredRate: 'Delivery success rate',
        deliveredRateHint: '{{completed}} of {{total}} orders delivered.',
        noOrders: 'No order data available yet.',
      },
      methodBreakdown: {
        title: 'Delivery methods',
        description: 'Track the share between drone and motorbike deliveries.',
        orders: '{{count}} orders',
        empty: 'No orders recorded so far.',
        labels: {
          drone: 'Drone delivery',
          motorbike: 'Motorbike courier',
          default: 'Other',
        },
      },
      topProducts: {
        title: 'Top-selling dishes',
        description: 'Total servings sold today.',
        empty: 'No sales data yet.',
      },
      recentOrders: {
        title: 'Recent orders',
        description: 'Real-time updates coming from the customer app.',
        empty: 'No orders available right now.',
        headers: {
          code: 'Order ID',
          customer: 'Customer',
          method: 'Method',
          status: 'Status',
          total: 'Value',
        },
      },
      revenueAnalytics: {
        empty: 'No analytics data available yet.',
        daily: {
          title: 'Daily order volume',
          description: 'Orders completed across the last 7 days.',
          ordersLabel: 'Orders per day',
        },
        monthly: {
          title: 'Monthly revenue trend',
          description: 'Estimated revenue for the latest 6 months.',
          revenueLabel: 'Revenue (est.)',
        },
      },
      statusInsights: {
        title: 'Order status mix',
        description: 'Share of new, preparing, and completed orders.',
        completionLabel: 'Completion rate',
        labels: {
          completed: 'Completed',
          preparing: 'In kitchen',
          new: 'New orders',
        },
        countTemplate: '{{count}} orders · {{percentage}}%',
      },
      customerInsights: {
        title: 'Top customers',
        description: 'Customers with the highest order value.',
        empty: 'No customer data yet.',
      },
      orderVelocity: {
        title: 'Daily order pace',
        description: 'Order count and revenue across the last 7 days.',
        ordersLabel: 'Orders',
        revenueLabel: 'Revenue',
        empty: 'No pace data available yet.',
      },
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
      statusLabel: 'Item status',
      statusOptions: [
        { value: 'available', label: 'Available' },
        { value: 'out_of_stock', label: 'Out of stock' },
      ],
      submit: 'Add product',
      successMessage: 'Menu item saved successfully.',
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
        status: 'Status',
        actions: '',
      },
      edit: 'Edit',
      delete: 'Delete',
      confirmDelete: 'Do you want to delete this product?',
      statusLabels: {
        available: 'Available',
        out_of_stock: 'Out of stock',
      },
      markOutOfStock: 'Mark as out of stock',
      markAvailable: 'Mark as available',
    },
    ordersPage: {
      title: 'Order list',
      columns: {
        customer: 'Customer',
        items: 'Items',
        address: 'Address',
        status: 'Order status',
        payment: 'Payment',
        total: 'Total',
        actions: 'Actions',
      },
      statuses: {
        new: 'New order',
        preparing: 'In kitchen',
        completed: 'Completed',
      },
      payment: {
        paid: 'Paid',
        unpaid: 'Unpaid',
      },
      buttons: {
        advanceStatus: {
          new: 'Confirm order',
          preparing: 'Complete order',
          completed: 'Completed',
        },
        advanceFallback: 'Update status',
        togglePayment: 'Toggle payment',
      },
    },
    restaurantPage: {
      title: 'Restaurant profile',
      description: 'Keep your opening hours, address, and delivery fee in sync with the customer apps.',
      fields: {
        name: 'Restaurant name',
        address: 'Address',
        phone: 'Phone number',
        openingTime: 'Opening time',
        closingTime: 'Closing time',
        shippingFee: 'Default delivery fee',
        notes: 'Highlighted notes',
      },
      placeholders: {
        name: 'e.g. FoodFast District 5',
        address: '273 An Duong Vuong, District 5, HCMC',
        phone: '+84 123 456 789',
        notes: 'Example: Complimentary drinks for 3+ dishes',
      },
      hints: {
        shippingFee: 'Current fee: {{value}}',
      },
      actions: {
        save: 'Save details',
      },
      savedMessage: 'Restaurant details saved',
      lastUpdated: 'Last updated: {{time}}',
      summary: {
        title: 'Customer-facing information',
        subtitle: 'Verify what diners will see inside the ordering experience.',
        labels: {
          name: 'Restaurant',
          address: 'Address',
          schedule: 'Service hours',
          shippingFee: 'Delivery fee',
          phone: 'Contact',
          notes: 'Notes',
        },
        scheduleText: 'Open {{open}} – Close {{close}}',
        scheduleFallback: 'Opening hours not set',
        phoneFallback: 'Not provided',
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
        deliveryProgress: 'Delivery progress',
        lastUpdate: 'Last update',
        delivered: 'Delivered',
        inTransit: 'In transit',
        paid: 'Paid',
        unpaid: 'Unpaid',
        progressSuffix: '% complete',
        deliveryMethod: 'Delivery method',
        estimatedArrival: 'ETA',
        methodNames: {
          drone: 'Drone',
          motorbike: 'Motorbike',
          default: 'Other',
        },
        statusValues: {
          new: 'New order',
          preparing: 'In preparation',
          completed: 'Completed',
          default: 'In progress',
        },
      },
      legendPrefixes: {
        drone: 'Drone #',
        motorbike: 'Rider #',
        default: 'Order #',
      },
      legendUpdated: 'Current co-ordinates updated at {{time}}',
      timelineTitle: 'Delivery route',
      empty: 'Order information not available.',
    },
    foodEdit: {
      title: 'Edit dish: {{name}}',
      fields: {
        name: 'Name',
        price: 'Price',
        category: 'Category',
        status: 'Status',
        description: 'Description',
        ingredients: 'Ingredients (comma separated)',
        address: 'Address',
      },
      statusOptions: [
        { value: 'available', label: 'Available' },
        { value: 'out_of_stock', label: 'Out of stock' },
      ],
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

// eslint-disable-next-line react-refresh/only-export-components
export const useAdminLanguage = () => useContext(AdminLanguageContext)
