import seedCustomers from '../data/customers.json'

const CUSTOMER_STORAGE_KEY = 'ff-admin-customers'
const isBrowser = typeof window !== 'undefined'

const ensureArray = (value) => (Array.isArray(value) ? value : [])

export const loadCustomers = () => {
  if (!isBrowser) return ensureArray(seedCustomers)
  const raw = window.localStorage.getItem(CUSTOMER_STORAGE_KEY)
  if (!raw) return ensureArray(seedCustomers)
  try {
    return ensureArray(JSON.parse(raw))
  } catch (error) {
    console.warn('Không thể đọc dữ liệu khách hàng', error)
    return ensureArray(seedCustomers)
  }
}

export const persistCustomers = (customers) => {
  if (!isBrowser) return
  window.localStorage.setItem(CUSTOMER_STORAGE_KEY, JSON.stringify(ensureArray(customers)))
}

export const upsertCustomer = (customer) => {
  const customers = loadCustomers()
  const exists = customers.some((item) => item.id === customer.id)
  let updated
  if (exists) {
    updated = customers.map((item) => (item.id === customer.id ? { ...item, ...customer } : item))
  } else {
    const id = customer.id || `CUS-${String(customers.length + 1).padStart(3, '0')}`
    updated = [...customers, { ...customer, id }]
  }
  persistCustomers(updated)
  return updated
}

export const removeCustomer = (id) => {
  const customers = loadCustomers()
  const updated = customers.filter((item) => item.id !== id)
  persistCustomers(updated)
  return updated
}
