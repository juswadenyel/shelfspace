const API_BASE_URL = 'http://localhost:8080/api'

async function request(path, body) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    throw new Error('Unable to reach the server. Please try again later.')
  }

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong. Please try again.')
  }

  return data
}

export function registerUser(credentials) {
  return request('/auth/register', credentials)
}

export function loginUser(credentials) {
  return request('/auth/login', credentials)
}
