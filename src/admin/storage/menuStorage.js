import seedMenu from '../data/menu.json'

const MENU_STORAGE_KEY = 'ff-admin-menu'
const isBrowser = typeof window !== 'undefined'

const ensureArray = (value) => (Array.isArray(value) ? value : [])

export const loadMenu = () => {
  if (!isBrowser) return ensureArray(seedMenu)
  const raw = window.localStorage.getItem(MENU_STORAGE_KEY)
  if (!raw) return ensureArray(seedMenu)
  try {
    return ensureArray(JSON.parse(raw))
  } catch (error) {
    console.warn('Không thể đọc dữ liệu món ăn', error)
    return ensureArray(seedMenu)
  }
}

export const persistMenu = (menu) => {
  if (!isBrowser) return
  window.localStorage.setItem(MENU_STORAGE_KEY, JSON.stringify(ensureArray(menu)))
}

export const upsertMenuItem = (item) => {
  const menu = loadMenu()
  const exists = menu.some((entry) => entry.id === item.id)
  let updated
  if (exists) {
    updated = menu.map((entry) => (entry.id === item.id ? { ...entry, ...item } : entry))
  } else {
    updated = [...menu, { ...item, id: item.id || crypto.randomUUID() }]
  }
  persistMenu(updated)
  return updated
}

export const removeMenuItem = (id) => {
  const menu = loadMenu()
  const updated = menu.filter((entry) => entry.id !== id)
  persistMenu(updated)
  return updated
}
