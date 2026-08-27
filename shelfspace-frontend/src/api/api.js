const API_BASE_URL = 'http://localhost:8080/api'
const STORAGE_KEY = 'shelfspace_auth'

function getToken() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw)?.token ?? null : null
  } catch {
    return null
  }
}

async function request(path, options = {}) {
  const { method = 'GET', body, headers = {} } = options
  const token = getToken()

  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
  }

  if (body !== undefined && body !== null) {
    config.body = JSON.stringify(body)
  }

  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, config)
  } catch {
    throw new Error('Unable to reach the server. Please try again later.')
  }

  const text = await response.text()
  const data = text ? JSON.parse(text) : {}

  if (!response.ok) {
    throw new Error(data.error || data.message || 'Something went wrong. Please try again.')
  }

  return data
}

export function registerUser(credentials) {
  return request('/auth/register', { method: 'POST', body: credentials })
}

export function loginUser(credentials) {
  return request('/auth/login', { method: 'POST', body: credentials })
}

export function fetchResources() {
  return request('/resources')
}

export function createResource(resource) {
  return request('/resources', { method: 'POST', body: resource })
}

export function updateResource(id, resource) {
  return request(`/resources/${id}`, { method: 'PUT', body: resource })
}

export function deleteResource(id) {
  return request(`/resources/${id}`, { method: 'DELETE' })
}

export function fetchBorrowers() {
  return request('/borrowers')
}

export function createBorrower(borrower) {
  return request('/borrowers', { method: 'POST', body: borrower })
}

export function updateBorrower(id, borrower) {
  return request(`/borrowers/${id}`, { method: 'PUT', body: borrower })
}

export function deleteBorrower(id) {
  return request(`/borrowers/${id}`, { method: 'DELETE' })
}

export function fetchReservations() {
  return request('/reservations')
}

export function createReservation(reservation) {
  return request('/reservations', { method: 'POST', body: reservation })
}

export function returnReservation(id) {
  return request(`/reservations/${id}/return`, { method: 'PUT' })
}

export function deleteReservation(id) {
  return request(`/reservations/${id}`, { method: 'DELETE' })
}

export function fetchServiceRequests() {
  return request('/requests')
}

export function createServiceRequest(serviceRequest) {
  return request('/requests', { method: 'POST', body: serviceRequest })
}

export function updateServiceRequest(id, serviceRequest) {
  return request(`/requests/${id}`, { method: 'PUT', body: serviceRequest })
}

export function deleteServiceRequest(id) {
  return request(`/requests/${id}`, { method: 'DELETE' })
}