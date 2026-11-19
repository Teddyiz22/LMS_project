import axios from 'axios'
import { API_BASE_URL } from '../config/api.js'

export class ApiError extends Error {
  constructor(status, message, details) {
    super(message)
    this.name = 'ApiError'
    this.status = status
    if (details) this.details = details
  }
}

const TOKEN_KEY = 'eduflow-auth-token'

export function getToken() {
  try {
    return localStorage.getItem(TOKEN_KEY) ?? sessionStorage.getItem(TOKEN_KEY)
  } catch {
    return null
  }
}

export function storeToken(token, remember) {
  try {
    if (remember) {
      localStorage.setItem(TOKEN_KEY, token)
      sessionStorage.removeItem(TOKEN_KEY)
    } else {
      sessionStorage.setItem(TOKEN_KEY, token)
      localStorage.removeItem(TOKEN_KEY)
    }
  } catch {
    // Storage unavailable (private mode, etc.) — the session just won't persist.
  }
}

export function clearToken() {
  try {
    localStorage.removeItem(TOKEN_KEY)
    sessionStorage.removeItem(TOKEN_KEY)
  } catch {
    // Ignore storage errors on logout.
  }
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
})

api.interceptors.request.use((config) => {
  const token = getToken()
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

api.interceptors.response.use(
  (response) => response.data?.data ?? response.data,
  (error) => {
    if (!error.response) {
      throw new ApiError(0, 'Unable to reach the EduFlow API. Check that the API server is running.')
    }
    const payload = error.response.data || {}
    const apiError = new ApiError(
      error.response.status,
      payload.error || 'The request failed.',
      Array.isArray(payload.details) ? payload.details : undefined,
    )
    throw apiError
  },
)

export default api
