const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000'

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text()
    throw new Error(message || `Yêu cầu thất bại (${response.status})`)
  }
  return response.json()
}

export const fetchProducts = async () => {
  const response = await fetch(`${API_BASE_URL}/products`)
  return handleResponse(response)
}

export const createOrder = async (payload) => {
  const response = await fetch(`${API_BASE_URL}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  return handleResponse(response)
}
