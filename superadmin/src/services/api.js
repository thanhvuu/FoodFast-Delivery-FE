const API_BASE_URL = (import.meta.env?.VITE_API_BASE_URL || 'http://localhost:4000').replace(/\/$/, '')

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Yêu cầu thất bại (${response.status})`)
  }
  return response.json()
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const fetchRestaurants = async () => {
  const response = await fetch(`${API_BASE_URL}/restaurants`)
  return handleResponse(response)
}

export const fetchUsers = async (params = {}) => {
  const searchParams = new URLSearchParams(params)
  const query = searchParams.toString()
  const response = await fetch(`${API_BASE_URL}/users${query ? `?${query}` : ''}`)
  return handleResponse(response)
}

export const updateUser = async (id, payload) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}

export const changeUserPassword = async (id, password) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}/password`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  })
  return handleResponse(response)
}

export const deleteUser = async (id) => {
  const response = await fetch(`${API_BASE_URL}/users/${id}`, {
    method: 'DELETE',
  })
  return handleResponse(response)
}
