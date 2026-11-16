import { createContext, useContext, useMemo, useState } from 'react'
import { mockLogin, mockRegister, mockRequestPasswordReset } from '../services/authService.js'

const AuthContext = createContext(null)
const persistentStorageKey = 'eduflow_mock_auth_user'
const sessionStorageKey = 'eduflow_mock_session_user'

function getStoredUser() {
  try {
    const storedUser = localStorage.getItem(persistentStorageKey) ?? sessionStorage.getItem(sessionStorageKey)
    return storedUser ? JSON.parse(storedUser) : null
  } catch {
    return null
  }
}

function storeUser(user, remember) {
  const storage = remember ? localStorage : sessionStorage
  storage.setItem(remember ? persistentStorageKey : sessionStorageKey, JSON.stringify(user))
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser)

  const login = async ({ email, password, remember }) => {
    const authenticatedUser = await mockLogin({ email, password })
    localStorage.removeItem(persistentStorageKey)
    sessionStorage.removeItem(sessionStorageKey)
    storeUser(authenticatedUser, remember)
    setUser(authenticatedUser)
    return authenticatedUser
  }

  const register = async ({ email, fullName, password, role, ...profile }) => {
    const registeredUser = await mockRegister({ email, fullName, password, role, ...profile })
    storeUser(registeredUser, true)
    setUser(registeredUser)
    return registeredUser
  }

  const logout = () => {
    localStorage.removeItem(persistentStorageKey)
    sessionStorage.removeItem(sessionStorageKey)
    setUser(null)
  }

  const value = useMemo(() => ({
    user,
    isAuthenticated: Boolean(user),
    isInitializing: false,
    login,
    logout,
    register,
    requestPasswordReset: mockRequestPasswordReset,
  }), [user])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// This hook intentionally lives with its provider so consumers share one context instance.
// oxlint-disable-next-line react/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider.')
  return context
}
