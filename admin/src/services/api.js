const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Yêu cầu thất bại với mã ${response.status}`)
  }
  return response.json()
}

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
