const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Yêu cầu thất bại với mã ${response.status}`)
  }
  return response.json()
}

const normalizeText = (value = '') => value.toString().trim().toLowerCase()

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`)
  return handleResponse(response)
}

export const fetchRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`)
  return handleResponse(response)
}

export const deleteProduct = async (id) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}

export const createProduct = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const updateProduct = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/products/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const fetchOrders = async (params = {}) => {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString()
  const response = await fetch(`${API_BASE_URL}/orders${query ? `?${query}` : ''}`)
  return handleResponse(response)
}

export const updateOrder = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const fetchRestaurant = async (id) => {
  const response = await fetch(`${API_BASE_URL}/restaurants/${id}`)
  return handleResponse(response)
}

export const updateRestaurant = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/restaurants/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const loginRestaurant = async (identifier, password) => {
  const response = await fetch(`${API_BASE_URL}/users?role=restaurant`)
  const users = await handleResponse(response)

  const normalizedIdentifier = normalizeText(identifier)
  const matchedUser = users.find((user) => {
    const emailMatch = normalizeText(user.email) === normalizedIdentifier
    const usernameMatch = normalizeText(user.username || user.name) === normalizedIdentifier
    return emailMatch || usernameMatch
  })

  if (!matchedUser) {
    throw new Error('Tài khoản cửa hàng chưa được Super Admin cấp hoặc thông tin không chính xác.')
  }

  const status = matchedUser.status ?? 'active'
  if (status !== 'active') {
    throw new Error('Tài khoản đã bị khoá đăng nhập, vui lòng liên hệ Super Admin để kích hoạt lại.')
  }

  const isValidPassword = String(matchedUser.password ?? '') === String(password)
  if (!isValidPassword) {
    throw new Error('Mật khẩu không đúng. Vui lòng kiểm tra lại thông tin được cấp từ Super Admin.')
  }

  return matchedUser
}
