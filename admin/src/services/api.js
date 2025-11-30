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

export const fetchOrders = async () => {
  const response = await fetch(`${API_BASE_URL}/orders?_sort=placedAt&_order=desc`)
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
