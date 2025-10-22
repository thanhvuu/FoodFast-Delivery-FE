import seedOrders from '../data/orders.json'

export const ORDER_STORAGE_KEY = 'ff-admin-orders'
export const ORDER_EVENT = 'ff-orders-updated'

const isBrowser = typeof window !== 'undefined'

const ensureArray = (value) => {
  if (Array.isArray(value)) return value
  return []
}

const parseStored = (raw) => {
  try {
    const parsed = JSON.parse(raw)
    return ensureArray(parsed)
  } catch (error) {
    console.warn('Không thể đọc dữ liệu đơn hàng trong localStorage', error)
    return []
  }
}

export const loadOrders = () => {
  if (!isBrowser) return ensureArray(seedOrders)
  const raw = window.localStorage.getItem(ORDER_STORAGE_KEY)
  if (!raw) {
    return ensureArray(seedOrders)
  }
  return parseStored(raw)
}

export const persistOrders = (orders, { silent } = {}) => {
  if (!isBrowser) return
  const payload = JSON.stringify(ensureArray(orders))
  window.localStorage.setItem(ORDER_STORAGE_KEY, payload)
  if (!silent) {
    const event = new CustomEvent(ORDER_EVENT, { detail: ensureArray(orders) })
    window.dispatchEvent(event)
  }
}

export const subscribeOrders = (callback) => {
  if (!isBrowser) return () => {}

  const handleCustomEvent = (event) => {
    callback(event.detail ?? loadOrders())
  }

  const handleStorage = (event) => {
    if (event.key === ORDER_STORAGE_KEY) {
      callback(loadOrders())
    }
  }

  window.addEventListener(ORDER_EVENT, handleCustomEvent)
  window.addEventListener('storage', handleStorage)

  return () => {
    window.removeEventListener(ORDER_EVENT, handleCustomEvent)
    window.removeEventListener('storage', handleStorage)
  }
}

const generateSequence = (orders) => {
  return orders.reduce((max, order) => Math.max(max, order.sequence ?? 0), 0) + 1
}

const buildOrderId = (sequence) => {
  const now = new Date()
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  return `ORD-${date}-${String(sequence).padStart(3, '0')}`
}

export const createOrder = (orderInput) => {
  const currentOrders = loadOrders()
  const sequence = generateSequence(currentOrders)
  const id = buildOrderId(sequence)

  const now = new Date().toISOString()

  const newOrder = {
    id,
    sequence,
    deliveryStatus: 'Đang xử lý',
    paymentStatus: 'Chưa thanh toán',
    timeline: {
      placedAt: now,
      etaMinutes: orderInput?.timeline?.etaMinutes ?? 40,
    },
    flags: {
      attention: false,
      delayed: false,
      cancelled: false,
      ...(orderInput?.flags ?? {}),
    },
    notes: '',
    deliveryFee: 15000,
    ...orderInput,
  }

  const updatedOrders = [newOrder, ...currentOrders]
  persistOrders(updatedOrders)

  return newOrder
}

export const updateOrder = (orderId, updater) => {
  const currentOrders = loadOrders()
  const updatedOrders = currentOrders.map((order) => {
    if (order.id !== orderId) return order
    const nextOrder = typeof updater === 'function' ? updater(order) : { ...order, ...updater }
    return nextOrder
  })
  persistOrders(updatedOrders)
  return updatedOrders
}

export const removeOrder = (orderId) => {
  const currentOrders = loadOrders()
  const updatedOrders = currentOrders.filter((order) => order.id !== orderId)
  persistOrders(updatedOrders)
  return updatedOrders
}

export const exportOrdersFile = (orders = loadOrders()) => {
  if (!isBrowser) return
  const blob = new Blob([JSON.stringify(orders, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = 'foodfast-orders.json'
  anchor.click()
  URL.revokeObjectURL(url)
}

export const resetOrders = () => {
  const base = JSON.parse(JSON.stringify(ensureArray(seedOrders)))
  persistOrders(base)
  return base
}
